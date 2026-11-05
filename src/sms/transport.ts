import { NetgsmApiError } from '../core/errors.js';
import { readJson } from '../core/read-json.js';
import { jitterMs, parseRetryAfter } from '../core/retry-after.js';
import type { TokenManager } from '../core/token-manager.js';

export type QueryValue = string | number | boolean | string[] | undefined;

export interface SmsTransportOptions {
  baseUrl: string;
  tokens: TokenManager;
  fetch: typeof fetch;
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  maxRetryAfterSec: number;
  userAgent: string;
}

export interface RequestOptions {
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: Record<string, string>;
}

/** Backoff for 503 (seconds): 1, 2, 4 - at most three retries. */
const UNAVAILABLE_BACKOFF_SEC = [1, 2, 4];

/** Bulk send endpoints: any 5xx (503 included) may mean the job was queued, so never retry. */
function isBatchSend(method: string, path: string): boolean {
  return (
    method === 'POST' &&
    (path === '/send' || path === '/send/template' || path === '/directory/send')
  );
}

/** Non-GET requests that are safe to repeat: cancelling twice never sends an SMS. */
function isSafeToRepeat(method: string, path: string): boolean {
  return method === 'POST' && path === '/cancel';
}

/** Reads counted per job even when they fail: /stats and /report with jobIds. */
function hasPerJobLimit(path: string, query: Record<string, QueryValue>): boolean {
  if (path === '/stats') return true;
  if (path !== '/report') return false;
  const v = query.jobIds;
  return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== '';
}

function serializeQuery(query: Record<string, QueryValue>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || (Array.isArray(v) && v.length === 0)) continue;
    q.set(k, Array.isArray(v) ? v.join(',') : String(v));
  }
  return q.toString();
}

/** SMS v3 request pipeline: bearer auth, one re-login on 401, and the v3 retry policy. */
export class SmsTransport {
  readonly #o: SmsTransportOptions;

  constructor(o: SmsTransportOptions) {
    this.#o = o;
  }

  /** `path` is relative to `/sms/v3` (e.g. `/send`). */
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    if (path.includes('?') || (path.length > 1 && path.endsWith('/'))) {
      throw new TypeError("request path must be canonical: no query string, no trailing '/'");
    }
    const { tokens, now, sleep, maxRetryAfterSec } = this.#o;
    const query = opts.query ?? {};
    const qs = serializeQuery(query);
    const url = `${this.#o.baseUrl}/sms/v3${path}${qs ? `?${qs}` : ''}`;
    const operation = `${method} /sms/v3${path}`;
    const repeatable = method === 'GET' || isSafeToRepeat(method, path);
    let reloggedIn = false;
    let rateLimitRetried = false;
    let unavailableRetries = 0;

    for (;;) {
      const token = await tokens.get();
      const headers: Record<string, string> = {
        ...opts.headers,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };
      if (typeof window === 'undefined') headers['User-Agent'] = this.#o.userAgent;
      if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
      let res: Response;
      try {
        res = await this.#o.fetch(url, {
          method,
          headers,
          body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        });
      } catch (e) {
        // Never retried; only the error name is reported (the message may contain the URL).
        const name = e instanceof Error ? e.name : 'unknown';
        throw new NetgsmApiError({
          api: 'sms',
          operation,
          status: 0,
          code: 'NETWORK_ERROR',
          detail: `network error: ${name}`,
          requestId: null,
          retryAfterSec: null,
          retryable: !isBatchSend(method, path),
          mayHaveBeenProcessed: method !== 'GET',
        });
      }

      if (res.ok) {
        if (res.status === 204) return undefined as T;
        const text = await res.text().catch(() => '');
        try {
          if (text) return JSON.parse(text) as T;
        } catch {
          // fall through to INVALID_RESPONSE
        }
        throw new NetgsmApiError({
          api: 'sms',
          operation,
          status: res.status,
          code: 'INVALID_RESPONSE',
          detail: 'response body is not JSON',
          requestId: res.headers.get('X-Request-Id') ?? res.headers.get('X-Thread-Id'),
          retryAfterSec: null,
          retryable: false,
          mayHaveBeenProcessed: method !== 'GET',
        });
      }

      const p = await readJson(res);
      const code: string = typeof p.code === 'string' ? p.code : `HTTP_${res.status}`;
      const rawRetryAfter = res.headers.get('Retry-After');
      const retryAfterSec = parseRetryAfter(rawRetryAfter, now());
      const requestId: string | null =
        typeof p.requestId === 'string'
          ? p.requestId
          : (res.headers.get('X-Request-Id') ?? res.headers.get('X-Thread-Id'));
      const apiText: unknown = p.message ?? p.detail;
      const base =
        typeof apiText === 'string' && apiText ? apiText : res.statusText || `HTTP ${res.status}`;
      const fail = (retryable: boolean, mayHaveBeenProcessed = false, hint = ''): NetgsmApiError =>
        new NetgsmApiError({
          api: 'sms',
          operation,
          status: res.status,
          code,
          detail: base + hint,
          requestId,
          retryAfterSec,
          retryable,
          mayHaveBeenProcessed,
          rejectedItems: Array.isArray(p.rejectedItems) ? p.rejectedItems : undefined,
        });

      // 401: token invalid. Re-login once and repeat once.
      if (res.status === 401 && code === 'UNAUTHENTICATED' && !reloggedIn) {
        tokens.invalidate(token);
        reloggedIn = true;
        continue;
      }

      // 429: without Retry-After the sending is suspended; waiting does not help.
      if (res.status === 429) {
        if (rawRetryAfter === null) throw fail(false);
        // Balance is never waited on or repeated: the caller decides from Retry-After.
        if (path === '/balance') throw fail(true);
        if (retryAfterSec === null || rateLimitRetried || retryAfterSec > maxRetryAfterSec)
          throw fail(true);
        rateLimitRetried = true;
        await sleep(retryAfterSec * 1000 + jitterMs());
        continue;
      }

      // Bulk send: every 5xx, 503 included, may have queued the job. Never retry; check GET /report first.
      if (isBatchSend(method, path) && res.status >= 500) {
        throw fail(
          false,
          true,
          '; the job may have been queued: check with GET /report before sending again',
        );
      }

      // Other non-GET requests: 5xx other than 503 may have been processed. Never retry.
      if (!repeatable && res.status >= 500 && res.status !== 503) throw fail(false, true);

      // Per-job reads: a failed read still counts toward the limit, so no automatic retry.
      if (res.status >= 500 && hasPerJobLimit(path, query)) {
        throw fail(
          true,
          false,
          '; this query is limited per job (report 1 min, stats 10 min): retry after that window',
        );
      }

      // 503 (and any 5xx for reads and cancel): retry with growing backoff.
      if (res.status === 503 || (repeatable && res.status >= 500)) {
        if (unavailableRetries >= UNAVAILABLE_BACKOFF_SEC.length) throw fail(true);
        const waitSec = retryAfterSec ?? UNAVAILABLE_BACKOFF_SEC[unavailableRetries]!;
        if (waitSec > maxRetryAfterSec) throw fail(true);
        unavailableRetries++;
        await sleep(waitSec * 1000 + jitterMs());
        continue;
      }

      throw fail(false);
    }
  }
}
