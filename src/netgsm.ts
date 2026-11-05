import { TokenManager } from './core/token-manager.js';
import { sleep } from './core/retry-after.js';
import { NetgsmEnvironment } from './environment.js';
import { IysApi } from './iys/iys-api.js';
import { IysTransport } from './iys/transport.js';
import { SmsApi } from './sms/sms-api.js';
import { SmsTransport } from './sms/transport.js';
import { VERSION } from './version.js';

export interface NetgsmOptions {
  username: string;
  password: string;
  /** Defaults to {@link NetgsmEnvironment.LIVE}. */
  baseUrl?: string;
  /** Token scope, default `'sms'`. */
  scope?: string;
  /** Sends `x-client: enterprise` on `sms.sendOtp` (enterprise OTP accounts only). */
  enterpriseOtp?: boolean;
  /** Default İYS brand code for `iys.*` calls. */
  iysBrandCode?: number;
  /** Upper bound for honoring a `Retry-After` header, default 60. */
  maxRetryAfterSec?: number;
  fetch?: typeof fetch;
  now?: () => number;
  /** Credentials must stay server-side; set only if you accept the risk. */
  dangerouslyAllowBrowser?: boolean;
}

function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  let ok = false;
  try {
    const u = new URL(trimmed);
    ok = (u.protocol === 'http:' || u.protocol === 'https:') && !u.username && !u.password;
  } catch {
    ok = false;
  }
  if (!ok) throw new TypeError('baseUrl must be a valid http(s) URL without credentials');
  return trimmed;
}

export class Netgsm {
  readonly sms: SmsApi;
  readonly iys: IysApi;
  readonly #baseUrl: string;

  constructor(o: NetgsmOptions) {
    if (
      (typeof window !== 'undefined' || typeof document !== 'undefined') &&
      o?.dangerouslyAllowBrowser !== true
    ) {
      throw new Error(
        'Netgsm credentials must stay server-side: do not use this SDK in a browser. ' +
          'Set dangerouslyAllowBrowser: true only if you accept the risk.',
      );
    }
    if (!o || typeof o.username !== 'string' || o.username === '') {
      throw new TypeError('username must be a non-empty string');
    }
    if (typeof o.password !== 'string' || o.password === '') {
      throw new TypeError('password must be a non-empty string');
    }
    const baseUrl = normalizeBaseUrl(o.baseUrl ?? NetgsmEnvironment.LIVE);
    const userFetch = o.fetch;
    const fetchImpl: typeof fetch = userFetch ?? ((...a) => globalThis.fetch(...a));
    const now = o.now ?? Date.now;

    const tokens = new TokenManager({
      baseUrl,
      username: o.username,
      password: o.password,
      scope: o.scope ?? 'sms',
      fetch: fetchImpl,
      now,
    });
    const transportOptions = {
      baseUrl,
      tokens,
      fetch: fetchImpl,
      now,
      sleep,
      maxRetryAfterSec: o.maxRetryAfterSec ?? 60,
      userAgent: `netgsm-sms-js/${VERSION}`,
    };
    this.#baseUrl = baseUrl;
    this.sms = new SmsApi(new SmsTransport(transportOptions), {
      enterpriseOtp: o.enterpriseOtp ?? false,
    });
    this.iys = new IysApi(new IysTransport(transportOptions), {
      ...(o.iysBrandCode !== undefined ? { brandCode: o.iysBrandCode } : {}),
    });
  }

  toJSON(): { baseUrl: string } {
    return { baseUrl: this.#baseUrl };
  }
}
