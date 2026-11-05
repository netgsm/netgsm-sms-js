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
  private tokens?: Tokens;
  private inflight?: Promise<string>;
  /** After a failed refresh, keep using the old token until this time. */
  private retryAfterMs = 0;
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
    const t = this.tokens;
    const now = this.now();
    if (t && (now < t.expiresAt - t.marginMs || now < this.retryAfterMs) && now < t.expiresAt) {
      return t.access;
    }
    this.inflight ??= this.renew().finally(() => {
      this.inflight = undefined;
    });
    return this.inflight;
  }

  /**
   * Call with the token used by a request that got 401. If another call already replaced the
   * token, the new one is kept; otherwise the next get() logs in again.
   */
  invalidate(staleAccessToken: string): void {
    if (this.tokens?.access === staleAccessToken) this.tokens = undefined;
  }

  private async renew(): Promise<string> {
    const old = this.tokens;
    if (old) {
      const r = await this.post('/auth/v3/token/refresh', { refresh_token: old.refresh });
      if (r.ok) return this.store((await r.json()) as TokenResponse);
      const p = await readJson(r);
      // invalidate() may have cleared the token while the refresh was pending.
      const invalidated = this.tokens !== old;
      if (p.code !== 'invalid_refresh_token' && !invalidated) {
        // Transient failure (429, 5xx): keep the old token while it is valid and retry in 30 s.
        if (this.now() < old.expiresAt) {
          this.retryAfterMs = this.now() + REFRESH_BACKOFF_MS;
          return old.access;
        }
        throw this.identityError('POST /auth/v3/token/refresh', r, p);
      }
      this.tokens = undefined; // session ended or token invalidated: log in again
    }
    const r = await this.post('/auth/v3/token', {
      username: this.#username,
      password: this.#password,
      scope: this.scope,
    });
    if (!r.ok) throw this.identityError('POST /auth/v3/token', r, await readJson(r));
    return this.store((await r.json()) as TokenResponse);
  }

  private store(t: TokenResponse): string {
    const lifeMs = t.expires_in * 1000;
    this.tokens = {
      access: t.access_token,
      refresh: t.refresh_token,
      expiresAt: this.now() + lifeMs,
      marginMs: Math.min(MAX_MARGIN_MS, lifeMs / 10),
    };
    this.retryAfterMs = 0;
    return t.access_token;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private identityError(operation: string, r: Response, p: any): NetgsmApiError {
    const code = typeof p.code === 'string' ? p.code : `HTTP_${r.status}`;
    const detail: unknown = p.detail ?? p.error_description ?? r.statusText;
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

  private post(path: string, body: unknown): Promise<Response> {
    return this.fetchImpl(this.baseUrl + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  }
}
