import { TokenManager } from './core/token-manager.js';
import { sleep } from './core/retry-after.js';
import { NetgsmEnvironment } from './environment.js';
import { IysApi as IysApiClass } from './iys/iys-api.js';
import { IysTransport } from './iys/transport.js';
import { SmsApi as SmsApiClass } from './sms/sms-api.js';
import { SmsTransport } from './sms/transport.js';
import { VERSION } from './version.js';

/**
 * Public shape of `netgsm.sms`. A mapped type over the implementation class, so the class (with its
 * private brand) is not part of the public API: it cannot be imported or used with `instanceof`, and
 * structural fakes are assignable.
 */
export type SmsApi = { [K in keyof SmsApiClass]: SmsApiClass[K] };
/** Public shape of `netgsm.iys`; see {@link SmsApi}. */
export type IysApi = { [K in keyof IysApiClass]: IysApiClass[K] };

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

const BASE_URL_ERROR =
  'baseUrl must be a valid http(s) URL without credentials, query or fragment';

function normalizeBaseUrl(raw: unknown): string {
  if (typeof raw !== 'string') throw new TypeError(BASE_URL_ERROR);
  const trimmed = raw.trim().replace(/\/+$/, '');
  // A bare trailing '?' or '#' is dropped by URL parsing, so check the raw text.
  if (trimmed.includes('?') || trimmed.includes('#')) throw new TypeError(BASE_URL_ERROR);
  let ok = false;
  try {
    const u = new URL(trimmed);
    ok =
      (u.protocol === 'http:' || u.protocol === 'https:') &&
      !u.username &&
      !u.password &&
      !u.search &&
      !u.hash;
  } catch {
    ok = false;
  }
  if (!ok) throw new TypeError(BASE_URL_ERROR);
  return trimmed;
}

function assertOptions(o: NetgsmOptions): void {
  const bad = (name: string, rule: string): never => {
    throw new TypeError(`${name} must be ${rule}`);
  };
  if (o.maxRetryAfterSec !== undefined && !(typeof o.maxRetryAfterSec === 'number' && Number.isFinite(o.maxRetryAfterSec) && o.maxRetryAfterSec >= 0)) {
    bad('maxRetryAfterSec', 'a finite number >= 0');
  }
  if (
    o.iysBrandCode !== undefined &&
    !(Number.isInteger(o.iysBrandCode) && o.iysBrandCode > 0 && o.iysBrandCode <= 2147483647)
  ) {
    bad('iysBrandCode', 'a positive integer up to 2147483647');
  }
  if (o.enterpriseOtp !== undefined && typeof o.enterpriseOtp !== 'boolean') bad('enterpriseOtp', 'a boolean');
  if (o.fetch !== undefined && typeof o.fetch !== 'function') bad('fetch', 'a function');
  if (o.now !== undefined && typeof o.now !== 'function') bad('now', 'a function');
  if (o.dangerouslyAllowBrowser !== undefined && typeof o.dangerouslyAllowBrowser !== 'boolean') {
    bad('dangerouslyAllowBrowser', 'a boolean');
  }
}

export class Netgsm {
  readonly sms: SmsApi;
  readonly iys: IysApi;
  readonly #baseUrl: string;

  constructor(o: NetgsmOptions) {
    if (
      (typeof document !== 'undefined' ||
        (typeof window !== 'undefined' && typeof (globalThis as { Deno?: unknown }).Deno === 'undefined')) &&
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
    assertOptions(o);
    const baseUrl = normalizeBaseUrl(o.baseUrl ?? NetgsmEnvironment.LIVE);
    const userFetch = o.fetch;
    // Always wrap: a bare fetch called as a method (this.o.fetch) throws Illegal invocation
    // in browsers and Workers.
    const fetchImpl: typeof fetch = userFetch
      ? (...a) => userFetch(...a)
      : (...a) => globalThis.fetch(...a);
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
    this.sms = new SmsApiClass(new SmsTransport(transportOptions), {
      enterpriseOtp: o.enterpriseOtp ?? false,
    });
    this.iys = new IysApiClass(new IysTransport(transportOptions), {
      ...(o.iysBrandCode !== undefined ? { brandCode: o.iysBrandCode } : {}),
    });
  }

  toJSON(): { baseUrl: string } {
    return { baseUrl: this.#baseUrl };
  }
}
