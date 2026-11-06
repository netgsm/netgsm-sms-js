import { NetgsmApiError } from './errors.js';
import { readJson } from './read-json.js';
import { parseRetryAfter } from './retry-after.js';

const REFRESH_BACKOFF_MS = 30_000;
const MAX_MARGIN_MS = 5 * 60_000;

interface Tokens {
  access: string;
  refresh: string;
  expiresAt: number;
  marginMs: number;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface TokenManagerOptions {
  /** Already normalized (no trailing slash). */
  baseUrl: string;
  username: string;
  password: string;
  scope: string;
  fetch: typeof fetch;
  now: () => number;
}

/**
 * Identity /auth/v3 token cache shared by all transports. Concurrent callers share one login or
 * refresh; credentials and tokens never reach an error.
 */
export class TokenManager {
  #tokens?: Tokens;
  #inflight?: Promise<string>;
  /** After a failed refresh, keep using the old token until this time. */
  #retryAfterMs = 0;
  private readonly baseUrl: string;
  readonly #username: string;
  readonly #password: string;
  private readonly scope: string;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => number;

  constructor(o: TokenManagerOptions) {
    this.baseUrl = o.baseUrl;
    this.#username = o.username;
    this.#password = o.password;
    this.scope = o.scope;
    this.fetchImpl = o.fetch;
    this.now = o.now;
  }

  /** A valid access token; refreshes first once inside the last min(5 min, 10% of lifetime). */
  async get(): Promise<string> {
    const t = this.#tokens;
    const now = this.now();
    if (t && (now < t.expiresAt - t.marginMs || now < this.#retryAfterMs) && now < t.expiresAt) {
      return t.access;
    }
    this.#inflight ??= this.renew().finally(() => {
      this.#inflight = undefined;
    });
    return this.#inflight;
  }

  /**
   * Call with the token used by a request that got 401. If another call already replaced the
   * token, the new one is kept; otherwise the next get() logs in again.
   */
  invalidate(staleAccessToken: string): void {
    if (this.#tokens?.access === staleAccessToken) this.#tokens = undefined;
  }

  private async renew(): Promise<string> {
    const old = this.#tokens;
    if (old) {
      const op = 'POST /auth/v3/token/refresh';
      let r: Response | undefined;
      let netErr: NetgsmApiError | undefined;
      try {
        r = await this.post(op, '/auth/v3/token/refresh', { refresh_token: old.refresh });
      } catch (e) {
        if (!(e instanceof NetgsmApiError)) throw e;
        netErr = e;
      }
      if (r?.ok) return this.store(op, r, await readJson(r));
      const p = r ? await readJson(r) : {};
      // invalidate() may have cleared the token while the refresh was pending.
      const invalidated = this.#tokens !== old;
      if (!invalidated && (netErr || p.code !== 'invalid_refresh_token')) {
        // Transient failure (network, 429, 5xx): keep the old token while it is valid, retry in 30 s.
        if (this.now() < old.expiresAt) {
          this.#retryAfterMs = this.now() + REFRESH_BACKOFF_MS;
          return old.access;
        }
        throw netErr ?? this.identityError(op, r!, p);
      }
      this.#tokens = undefined; // session ended or token invalidated: log in again
    }
    const op = 'POST /auth/v3/token';
    const r = await this.post(op, '/auth/v3/token', {
      username: this.#username,
      password: this.#password,
      scope: this.scope,
    });
    const p = await readJson(r);
    if (!r.ok) throw this.identityError(op, r, p);
    return this.store(op, r, p);
  }

  private store(operation: string, r: Response, t: Partial<TokenResponse>): string {
    if (
      typeof t.access_token !== 'string' ||
      t.access_token === '' ||
      typeof t.refresh_token !== 'string' ||
      t.refresh_token === '' ||
      typeof t.expires_in !== 'number' ||
      !Number.isFinite(t.expires_in) ||
      t.expires_in < 0
    ) {
      throw new NetgsmApiError({
        api: 'identity',
        operation,
        status: r.status,
        code: 'INVALID_RESPONSE',
        detail: 'token response is missing access_token, refresh_token or expires_in',
        requestId: r.headers.get('X-Thread-Id'),
        retryable: false,
        mayHaveBeenProcessed: false,
      });
    }
    const lifeMs = t.expires_in * 1000;
    this.#tokens = {
      access: t.access_token,
      refresh: t.refresh_token,
      expiresAt: this.now() + lifeMs,
      marginMs: Math.min(MAX_MARGIN_MS, lifeMs / 10),
    };
    this.#retryAfterMs = 0;
    return t.access_token;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private identityError(operation: string, r: Response, p: any): NetgsmApiError {
    const code = typeof p.code === 'string' ? p.code : `HTTP_${r.status}`;
    const detail: unknown = p.error_description ?? p.detail ?? (r.statusText || `HTTP ${r.status}`);
    const requestId: unknown = p.request_id ?? r.headers.get('X-Thread-Id');
    return new NetgsmApiError({
      api: 'identity',
      operation,
      status: r.status,
      code,
      detail: typeof detail === 'string' ? detail : '',
      requestId: typeof requestId === 'string' ? requestId : null,
      retryAfterSec: parseRetryAfter(r.headers.get('Retry-After'), this.now()),
      // rate_limited and 5xx can be retried later; other 4xx need a fix first.
      retryable: r.status >= 500 || code === 'rate_limited',
      mayHaveBeenProcessed: false,
    });
  }

  /** Only the error name is reported on failure: the message may contain the URL. */
  private async post(operation: string, path: string, body: unknown): Promise<Response> {
    try {
      return await this.fetchImpl(this.baseUrl + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new NetgsmApiError({
        api: 'identity',
        operation,
        status: 0,
        code: 'NETWORK_ERROR',
        detail: `network error: ${e instanceof Error ? e.name : 'unknown'}`,
        requestId: null,
        retryAfterSec: null,
        retryable: true,
        mayHaveBeenProcessed: false,
      });
    }
  }
}
