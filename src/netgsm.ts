import { TokenManager } from './core/token-manager.js';
import { sleep } from './core/retry-after.js';
import { NetgsmEnvironment } from './environment.js';
import { IysApi as IysApiClass } from './iys/iys-api.js';
import { IysTransport } from './iys/transport.js';
import { SmsApi as SmsApiClass } from './sms/sms-api.js';
import { SmsTransport } from './sms/transport.js';
import { LegacyClient } from './legacy/legacy-client.js';
import { warnBrowserCredentials, warnDeprecated } from './legacy/deprecation.js';
import type {
  BalancePayload,
  BalanceResponse,
  CancelSmsPayload,
  CancelSmsResponse,
  HeaderQueryPayload,
  HeaderQueryResponse,
  LegacyReportResponse,
  LegacyStatsResponse,
  OtpSmsPayload,
  OtpSmsResponse,
  ReportPayload,
  RestSmsPayload,
  RestSmsResponse,
  SmsInboxPayload,
  SmsInboxResponse,
  StatsPayload,
} from './legacy/types.js';
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
  /**
   * Application name sent by the legacy 1.x methods as `<appname>-sdk-js` (falsy means none, other
   * non-strings are stringified, as in 1.x). Has no effect on `sms` / `iys`.
   * @deprecated since 2.0.0; only the deprecated 1.x methods use it. See MIGRATION.md.
   */
  appname?: string;
  /** Credentials must stay server-side; set only if you accept the risk. */
  dangerouslyAllowBrowser?: boolean;
}

const BASE_URL_ERROR =
  'baseUrl must be a valid http(s) URL without credentials, query or fragment';

function normalizeBaseUrl(raw: unknown): string {
  if (typeof raw !== 'string') throw new TypeError(BASE_URL_ERROR);
  // Strip trailing slashes with a linear scan; /\/+$/ backtracks polynomially on long slash runs.
  const t = raw.trim();
  let end = t.length;
  while (end > 0 && t.charCodeAt(end - 1) === 0x2f) end--;
  const trimmed = t.slice(0, end);
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

function coerceCredential(v: unknown): string {
  return typeof v === 'number' && Number.isFinite(v) ? String(v) : (v as string);
}

function isBrowserLike(): boolean {
  return (
    typeof document !== 'undefined' ||
    (typeof window !== 'undefined' && typeof (globalThis as { Deno?: unknown }).Deno === 'undefined')
  );
}

const BROWSER_ERROR =
  'Netgsm credentials must stay server-side: do not use this SDK in a browser. ' +
  'Set dangerouslyAllowBrowser: true only if you accept the risk.';

const LEGACY_DISABLED_ERROR =
  'The deprecated 1.x methods always use the live legacy API and have no sandbox or mock, so they ' +
  'are disabled when baseUrl points to another environment. Use netgsm.sms.* there.';

export class Netgsm {
  readonly #sms: SmsApi;
  readonly #iys: IysApi;
  readonly #baseUrl: string;
  readonly #legacy: LegacyClient;
  readonly #allowBrowser: boolean;
  readonly #legacyEnabled: boolean;

  constructor(options: NetgsmOptions) {
    // 1.x accepted numeric credentials (e.g. read from JSON) and appname: null; keep that.
    const o: NetgsmOptions = options
      ? {
          ...options,
          username: coerceCredential(options.username),
          password: coerceCredential(options.password),
        }
      : options;
    if (!o || typeof o.username !== 'string' || o.username === '') {
      throw new TypeError('username must be a non-empty string');
    }
    if (typeof o.password !== 'string' || o.password === '') {
      throw new TypeError('password must be a non-empty string');
    }
    assertOptions(o);
    const baseUrl = normalizeBaseUrl(o.baseUrl ?? NetgsmEnvironment.LIVE);
    this.#allowBrowser = o.dangerouslyAllowBrowser === true;
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
    this.#legacyEnabled = baseUrl === NetgsmEnvironment.LIVE;
    this.#legacy = new LegacyClient({
      username: o.username,
      password: o.password,
      // 1.x: a falsy appname means none; any other value was interpolated into `${appname}-sdk-js`.
      ...(o.appname ? { appname: String(o.appname) } : {}),
      fetch: fetchImpl,
    });
    this.#sms = new SmsApiClass(new SmsTransport(transportOptions), {
      enterpriseOtp: o.enterpriseOtp ?? false,
    });
    this.#iys = new IysApiClass(new IysTransport(transportOptions), {
      ...(o.iysBrandCode !== undefined ? { brandCode: o.iysBrandCode } : {}),
    });
  }

  /** SMS API v3. Throws in a browser-like environment unless `dangerouslyAllowBrowser: true`. */
  get sms(): SmsApi {
    this.#assertServerSide();
    return this.#sms;
  }

  /** İYS consent API. Throws in a browser-like environment unless `dangerouslyAllowBrowser: true`. */
  get iys(): IysApi {
    this.#assertServerSide();
    return this.#iys;
  }

  #assertServerSide(): void {
    if (!this.#allowBrowser && isBrowserLike()) throw new Error(BROWSER_ERROR);
  }

  /** Warns (once per method) that a 1.x method is deprecated; in browsers also that credentials are exposed. */
  #legacyUse(method: string): LegacyClient {
    warnDeprecated(method);
    if (!this.#allowBrowser && isBrowserLike()) warnBrowserCredentials();
    return this.#legacy;
  }

  /** Runs a deprecated 1.x call; rejects without a request unless baseUrl is the live environment. */
  #legacyRun<T>(method: string, call: (client: LegacyClient) => Promise<T>): Promise<T> {
    const client = this.#legacyUse(method);
    if (!this.#legacyEnabled) return Promise.reject(new Error(LEGACY_DISABLED_ERROR));
    return call(client);
  }

  /** @deprecated since 2.0.0 — use netgsm.sms.send; see MIGRATION.md. Removed in 3.0.0. */
  sendRestSms(payload: RestSmsPayload): Promise<RestSmsResponse> {
    return this.#legacyRun('sendRestSms', (c) => c.sendRestSms(payload));
  }

  /** @deprecated since 2.0.0 — use netgsm.sms.sendOtp; see MIGRATION.md. Removed in 3.0.0. */
  sendOtpSms(payload: OtpSmsPayload): Promise<OtpSmsResponse> {
    return this.#legacyRun('sendOtpSms', (c) => c.sendOtpSms(payload));
  }

  /** @deprecated since 2.0.0 — use netgsm.sms.cancel; see MIGRATION.md. Removed in 3.0.0. */
  cancelSms(payload: CancelSmsPayload): Promise<CancelSmsResponse> {
    return this.#legacyRun('cancelSms', (c) => c.cancelSms(payload));
  }

  /** @deprecated since 2.0.0 — use netgsm.sms.getReport; see MIGRATION.md. Removed in 3.0.0. */
  getReport(payload: ReportPayload): Promise<LegacyReportResponse> {
    return this.#legacyRun('getReport', (c) => c.getReport(payload));
  }

  /** @deprecated since 2.0.0 — use netgsm.sms.getStats; see MIGRATION.md. Removed in 3.0.0. */
  getStats(payload: StatsPayload): Promise<LegacyStatsResponse> {
    return this.#legacyRun('getStats', (c) => c.getStats(payload));
  }

  /** @deprecated since 2.0.0 — use netgsm.sms.listSenders; see MIGRATION.md. Removed in 3.0.0. */
  getHeaders(payload?: HeaderQueryPayload): Promise<HeaderQueryResponse> {
    return this.#legacyRun('getHeaders', (c) => c.getHeaders(payload));
  }

  /** @deprecated since 2.0.0 — use netgsm.sms.getInbox; see MIGRATION.md. Removed in 3.0.0. */
  getInbox(payload?: SmsInboxPayload): Promise<SmsInboxResponse> {
    return this.#legacyRun('getInbox', (c) => c.getInbox(payload));
  }

  /** @deprecated since 2.0.0 — use netgsm.sms.getBalance; see MIGRATION.md. Removed in 3.0.0. */
  checkBalance(payload: BalancePayload): Promise<BalanceResponse> {
    return this.#legacyRun('checkBalance', (c) => c.checkBalance(payload));
  }

  toJSON(): { baseUrl: string } {
    return { baseUrl: this.#baseUrl };
  }
}
