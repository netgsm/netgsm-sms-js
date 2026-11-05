import { inspect } from 'node:util';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import Netgsm, * as pkg from '../../../src/index';
import type { LegacyReportResponse, LegacyStatsResponse, ReportResponse } from '../../../src/index';
import * as enums from '../../../src/enums';
import { resetDeprecationWarnings } from '../../../src/legacy/deprecation';
import { createFetchMock } from './fetch-mock';

const SECRET = 'S3cr3t-Pa55w0rd!';
const OK = JSON.stringify({ code: '00', jobid: '1', description: 'ok' });
const send = (n: Netgsm) =>
  n.sendRestSms({ msgheader: 'T', messages: [{ msg: 'm', no: '5551234567' }] });

function client(extra: Record<string, unknown> = {}) {
  const f = createFetchMock();
  f.mockResponseOnce(OK);
  return { f, n: new Netgsm({ username: 'u', password: SECRET, fetch: f.fetch, ...extra }) };
}

const tick = () => new Promise((r) => setImmediate(r));

let warnings: Array<{ message: string; code?: string; name: string }>;
const onWarning = (w: Error & { code?: string }) =>
  warnings.push({ message: w.message, code: w.code, name: w.name });

beforeEach(() => {
  resetDeprecationWarnings();
  warnings = [];
  process.noDeprecation = false;
  process.on('warning', onWarning);
});
afterEach(async () => {
  await tick(); // let pending process warnings flush before detaching
  process.off('warning', onWarning);
  process.noDeprecation = false;
  delete (globalThis as { window?: unknown }).window;
  delete (globalThis as { document?: unknown }).document;
  vi.restoreAllMocks();
});

describe('legacy request shape', () => {
  it('posts to the legacy host with Basic auth and the appname suffix', async () => {
    const { f, n } = client({ appname: 'shop' });
    await send(n);
    const [url, init] = f.mock.calls[0]!;
    expect(url).toBe('https://api.netgsm.com.tr/sms/rest/v2/send');
    expect(init!.method).toBe('POST');
    const h = new Headers(init!.headers);
    expect(h.get('Authorization')).toBe('Basic ' + btoa('u:' + SECRET));
    expect(h.get('Content-Type')).toBe('application/json');
    expect(JSON.parse(init!.body as string)).toMatchObject({ msgheader: 'T', appname: 'shop-sdk-js' });
  });

  it('a payload appname wins over the option; none means no appname', async () => {
    const a = client({ appname: 'shop' });
    await a.n.sendRestSms({ msgheader: 'T', appname: 'own', messages: [] });
    expect(JSON.parse(a.f.mock.calls[0]![1]!.body as string).appname).toBe('own');
    const b = client();
    await send(b.n);
    expect(JSON.parse(b.f.mock.calls[0]![1]!.body as string)).not.toHaveProperty('appname');
  });

  it('checkBalance posts usercode/password to /balance without an Authorization header', async () => {
    const f = createFetchMock();
    f.mockResponseOnce(JSON.stringify({ code: '00', balance: '1' }));
    const n = new Netgsm({ username: 'u', password: SECRET, fetch: f.fetch });
    await n.checkBalance({ stip: enums.BalanceType.CREDIT });
    const [url, init] = f.mock.calls[0]!;
    expect(url).toBe('https://api.netgsm.com.tr/balance');
    expect(JSON.parse(init!.body as string)).toEqual({ usercode: 'u', password: SECRET, stip: 2 });
    expect(new Headers(init!.headers).get('Authorization')).toBeNull();
  });

  it('ignores baseUrl: legacy always uses the legacy host', async () => {
    const { f, n } = client({ baseUrl: 'http://127.0.0.1:4010' });
    await send(n);
    expect(f.mock.calls[0]![0]).toMatch(/^https:\/\/api\.netgsm\.com\.tr\//);
  });

  it('validates appname as a string', () => {
    expect(() => new Netgsm({ username: 'u', password: SECRET, appname: 5 as never })).toThrow(
      /appname/,
    );
  });
});

describe('deprecation warnings', () => {
  it('warns once per method with code, replacement and MIGRATION.md', async () => {
    const { n } = client();
    await send(n);
    await tick();
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      name: 'DeprecationWarning',
      code: 'NETGSM_LEGACY_SENDRESTSMS',
    });
    expect(warnings[0]!.message).toContain('sendRestSms');
    expect(warnings[0]!.message).toContain('netgsm.sms.send');
    expect(warnings[0]!.message).toContain('MIGRATION.md');
  });

  it('warns once, not on every call, and separately per method', async () => {
    const f = createFetchMock();
    for (let i = 0; i < 3; i++) f.mockResponseOnce(OK);
    const n = new Netgsm({ username: 'u', password: SECRET, fetch: f.fetch });
    await send(n);
    await send(n);
    await n.cancelSms({ jobid: '1' });
    await tick();
    expect(warnings.map((w) => w.code).sort()).toEqual([
      'NETGSM_LEGACY_CANCELSMS',
      'NETGSM_LEGACY_SENDRESTSMS',
    ]);
  });

  it('maps every method to its v3 replacement', async () => {
    const f = createFetchMock();
    const n = new Netgsm({ username: 'u', password: SECRET, fetch: f.fetch });
    const calls: Array<[string, () => Promise<unknown>, string]> = [
      ['sendRestSms', () => send(n), 'netgsm.sms.send'],
      ['sendOtpSms', () => n.sendOtpSms({ msgheader: 'T', msg: 'm', no: '5' }), 'sms.sendOtp'],
      ['cancelSms', () => n.cancelSms({ jobid: '1' }), 'sms.cancel'],
      ['getReport', () => n.getReport({}), 'sms.getReport'],
      ['getStats', () => n.getStats({ jobid: '1' }), 'sms.getStats'],
      ['getHeaders', () => n.getHeaders(), 'sms.listSenders'],
      ['getInbox', () => n.getInbox(), 'sms.getInbox'],
      ['checkBalance', () => n.checkBalance({ stip: 1 }), 'sms.getBalance'],
    ];
    for (const [, run] of calls) {
      f.mockResponseOnce(JSON.stringify({ code: '00' }));
      await run();
    }
    await tick();
    expect(warnings).toHaveLength(8);
    for (const [m, , repl] of calls) {
      const w = warnings.find((x) => x.code === 'NETGSM_LEGACY_' + m.toUpperCase());
      expect(w, m).toBeDefined();
      expect(w!.message).toContain(repl);
    }
  });

  it('is silenced by process.noDeprecation', async () => {
    process.noDeprecation = true;
    const { n } = client();
    await send(n);
    await tick();
    expect(warnings).toHaveLength(0);
  });

  it('never contains credentials', async () => {
    const { n } = client({ appname: 'shop' });
    await send(n);
    await tick();
    const text = JSON.stringify(warnings);
    expect(text).not.toContain(SECRET);
    expect(text).not.toContain(btoa('u:' + SECRET));
    expect(text).not.toContain('shop');
  });

  it('falls back to a single console.warn without process.emitWarning', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const proc = globalThis.process;
    vi.stubGlobal('process', { ...proc, emitWarning: undefined });
    try {
      const { n } = client();
      await send(n);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(String(spy.mock.calls[0]![0])).toContain('sendRestSms');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('credential protection', () => {
  it('password and tokens stay unreachable after a legacy call', async () => {
    const { n } = client({ appname: 'shop' });
    await send(n);
    for (const out of [
      String(n),
      JSON.stringify(n),
      inspect(n, { depth: Infinity, showHidden: true }),
    ]) {
      expect(out).not.toContain(SECRET);
      expect(out).not.toContain(btoa('u:' + SECRET));
    }
  });
});

describe('browser protection', () => {
  it('constructor no longer throws; .sms and .iys do; legacy only warns once', async () => {
    (globalThis as { window?: unknown }).window = {};
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.noDeprecation = true;
    const f = createFetchMock();
    f.mockResponseOnce(OK);
    f.mockResponseOnce(OK);
    const n = new Netgsm({ username: 'u', password: SECRET, fetch: f.fetch });
    expect(() => n.sms).toThrow(/server/i);
    expect(() => n.iys).toThrow(/server/i);
    await send(n);
    await send(n);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(String(spy.mock.calls[0]![0])).toMatch(/client-side/);
    expect(String(spy.mock.calls[0]![0])).not.toContain(SECRET);
  });

  it('dangerouslyAllowBrowser unlocks .sms/.iys and silences the browser warning', async () => {
    (globalThis as { window?: unknown }).window = {};
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.noDeprecation = true;
    const { n } = client({ dangerouslyAllowBrowser: true });
    expect(n.sms).toBeDefined();
    expect(n.iys).toBeDefined();
    await send(n);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('exports', () => {
  it('root exports the 1.x enums and default/named Netgsm', () => {
    expect(pkg.Netgsm).toBe(Netgsm);
    for (const k of [
      'ApiErrorCode', 'BalanceType', 'OperatorCode', 'SmsStatus', 'SendSmsErrorCode',
      'SendOtpSmsErrorCode', 'InboxErrorCode', 'ReportErrorCode', 'MsgHeaderErrorCode', 'CancelErrorCode',
    ]) {
      expect(pkg, k).toHaveProperty(k);
    }
    expect(pkg).not.toHaveProperty('resetDeprecationWarnings');
    expect(pkg).not.toHaveProperty('warnDeprecated');
  });

  it('enums subpath exports all 12 enums', () => {
    expect(Object.keys(enums).sort()).toEqual(
      [
        'ApiErrorCode', 'BalanceErrorCode', 'BalanceType', 'CancelErrorCode', 'InboxErrorCode',
        'MsgHeaderErrorCode', 'OperatorCode', 'ReportErrorCode', 'SendOtpSmsErrorCode',
        'SendSmsErrorCode', 'SmsStatus', 'StatsErrorCode',
      ].sort(),
    );
    expect(enums.SendSmsErrorCode.SUCCESS).toBe('00');
  });

  it('keeps v3 and legacy report/stats types apart', () => {
    expectTypeOf<LegacyReportResponse>().toHaveProperty('jobs');
    expectTypeOf<LegacyStatsResponse>().toHaveProperty('description');
    expectTypeOf<ReportResponse>().not.toEqualTypeOf<LegacyReportResponse>();
    const n = new Netgsm({ username: 'u', password: 'p' });
    expectTypeOf(n.getReport).returns.resolves.toEqualTypeOf<LegacyReportResponse>();
    expectTypeOf(n.getStats).returns.resolves.toEqualTypeOf<LegacyStatsResponse>();
  });
});
