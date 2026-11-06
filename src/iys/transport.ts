import { NetgsmApiError } from '../core/errors.js';
import { jitterMs, parseRetryAfter } from '../core/retry-after.js';
import type { TokenManager } from '../core/token-manager.js';

export interface IysTransportOptions {
  baseUrl: string;
  tokens: TokenManager;
  fetch: typeof fetch;
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  maxRetryAfterSec: number;
  userAgent: string;
}

export interface IysRequestOptions {
  query?: URLSearchParams;
  body?: unknown;
  requestId?: string;
}

const REQUEST_ID = /^[A-Za-z0-9._-]{8,64}$/;

/** Backoff for 429 / 503 and repeatable 5xx (seconds): 1, 2, 4 - at most three retries. */
const BACKOFF_SEC = [1, 2, 4];

/** İYS v1 request pipeline: bearer auth, one re-login on 401, envelope errors and the v1 retry policy. */
export class IysTransport {
  readonly #o: IysTransportOptions;

  constructor(o: IysTransportOptions) {
    this.#o = o;
  }

  /** `path` is relative to `/iys/v1` (e.g. `/consents`). Resolves with the parsed success envelope. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request<T = any>(
    method: 'GET' | 'POST',
    path: string,
    opts: IysRequestOptions = {},
  ): Promise<{ json: T; requestId: string }> {
    if (path.includes('?') || (path.length > 1 && path.endsWith('/'))) {
      throw new TypeError("request path must be canonical: no query string, no trailing '/'");
    }
    if (opts.requestId !== undefined && !REQUEST_ID.test(opts.requestId)) {
      throw new TypeError('requestId must be 8-64 characters of A-Z a-z 0-9 . _ -');
    }
    const { tokens, now, sleep, maxRetryAfterSec } = this.#o;
    const requestId = opts.requestId ?? globalThis.crypto.randomUUID();
    const qs = opts.query?.toString() ?? '';
    const url = `${this.#o.baseUrl}/iys/v1${path}${qs ? `?${qs}` : ''}`;
    const operation = `${method} /iys/v1${path}`;
    // Only POST /consents must never be repeated: the consent may already be recorded.
    // Reads and POST /webhooks (replaces the previous address) are safe to repeat.
    const repeatable = !(method === 'POST' && path === '/consents');
    let reloggedIn = false;
    let retries = 0;

    for (;;) {
      const token = await tokens.get();
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'X-Request-Id': requestId,
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
        // Not retried here (the caller decides, see retryable); only the error name is reported (the message may contain the URL).
        const name = e instanceof Error ? e.name : 'unknown';
        throw new NetgsmApiError({
          api: 'iys',
          operation,
          status: 0,
          code: 'NETWORK_ERROR',
          detail: `network error: ${name}`,
          requestId,
          retryAfterSec: null,
          retryable: repeatable,
          mayHaveBeenProcessed: method !== 'GET',
        });
      }

      const text = await res.text().catch(() => '');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let json: any = {};
      let parsed = false;
      try {
        if (text) {
          const v: unknown = JSON.parse(text);
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            json = v;
            parsed = true;
          }
        }
      } catch {
        // not JSON
      }

      if (res.ok) {
        if (!parsed || typeof json.success !== 'boolean') {
          throw new NetgsmApiError({
            api: 'iys',
            operation,
            status: res.status,
            code: 'INVALID_RESPONSE',
            detail: 'response body is not a valid İYS envelope',
            requestId: res.headers.get('X-Thread-Id') ?? requestId,
            retryAfterSec: null,
            retryable: false,
            mayHaveBeenProcessed: method !== 'GET',
          });
        }
        if (json.success !== false && (json.errorCode === undefined || json.errorCode === 0)) {
          return { json: json as T, requestId };
        }
      }

      const code: string =
        typeof json.errorCode === 'number' ? String(json.errorCode) : `HTTP_${res.status}`;
      const retryAfterSec = parseRetryAfter(res.headers.get('Retry-After'), now());
      const threadId = res.headers.get('X-Thread-Id') ?? requestId;
      const detail =
        typeof json.message === 'string' && json.message
          ? json.message
          : res.statusText || `HTTP ${res.status}`;
      const fail = (retryable: boolean, mayHaveBeenProcessed = false): NetgsmApiError =>
        new NetgsmApiError({
          api: 'iys',
          operation,
          status: res.status,
          code,
          detail,
          requestId: threadId,
          retryAfterSec,
          retryable,
          mayHaveBeenProcessed,
          data: json.data,
        });

      // 401 (50-53): re-login once and repeat once.
      if (res.status === 401) {
        if (reloggedIn) throw fail(false);
        tokens.invalidate(token);
        reloggedIn = true;
        continue;
      }

      // 424, 500 and other 5xx (not 503): on POST /consents the record may be stored. Never retry.
      // On POST /consents, errorCode 110 / 112 means the same whatever the HTTP status.
      const uncertain =
        res.status === 424 ||
        (res.status >= 500 && res.status !== 503) ||
        (!repeatable && (code === '110' || code === '112'));
      if (uncertain && !repeatable) throw fail(false, true);

      if (res.status === 429 || res.status === 503 || uncertain) {
        if (retries >= BACKOFF_SEC.length) throw fail(true);
        const waitSec = retryAfterSec ?? BACKOFF_SEC[retries]!;
        if (waitSec > maxRetryAfterSec) throw fail(true);
        retries++;
        await sleep(waitSec * 1000 + jitterMs());
        continue;
      }

      // 400, 403, 404, 405, 409, 422 (and 2xx with success:false): the same request gives the same result.
      throw fail(false);
    }
  }
}
