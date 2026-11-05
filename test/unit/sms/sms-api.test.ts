import { describe, expect, expectTypeOf, it } from 'vitest';
import { TokenManager } from '../../../src/core/token-manager.js';
import { SmsApi } from '../../../src/sms/sms-api.js';
import { SmsTransport } from '../../../src/sms/transport.js';
import type { BalanceListResponse, BalanceSummaryResponse } from '../../../src/sms/types.js';
import { fakeFetch, type FakeResponse } from '../../fixtures/fake-fetch.js';

const BASE = 'https://api.example.test';

function setup(responses: FakeResponse[], enterpriseOtp = false) {
  const ff = fakeFetch([
    { status: 200, body: { access_token: 'a1', refresh_token: 'r1', expires_in: 3600 } },
    ...responses,
  ]);
  const tokens = new TokenManager({
    baseUrl: BASE,
    username: 'u',
    password: 'p',
    scope: 'sms',
    fetch: ff.fetch,
    now: () => 0,
  });
  const transport = new SmsTransport({
    baseUrl: BASE,
    tokens,
    fetch: ff.fetch,
    now: () => 0,
    sleep: () => Promise.resolve(),
    maxRetryAfterSec: 60,
    userAgent: 'netgsm-sms-js/test',
  });
  return { api: new SmsApi(transport, { enterpriseOtp }), calls: () => ff.calls.slice(1) };
}

const RESP = { ok: true, marker: 'as-is' };
const body = { a: 1, nested: { b: [2] } };

type Case = [string, (a: SmsApi) => Promise<unknown>, string, string, unknown?, unknown?];
const cases: Case[] = [
  ['send', (a) => a.send(body as never), 'POST', '/send', undefined, body],
  ['sendTemplate', (a) => a.sendTemplate(body as never), 'POST', '/send/template', undefined, body],
  ['sendOtp', (a) => a.sendOtp(body as never), 'POST', '/send/otp', undefined, body],
  ['sendToDirectory', (a) => a.sendToDirectory(body as never), 'POST', '/directory/send', undefined, body],
  ['cancel', (a) => a.cancel(body as never), 'POST', '/cancel', undefined, body],
  ['getReport', (a) => a.getReport({ jobIds: ['1', '2'], page: 1 }), 'GET', '/report', 'jobIds=1%2C2&page=1'],
  ['getStats', (a) => a.getStats({ jobId: '9', month: '2026-01' }), 'GET', '/stats', 'jobId=9&month=2026-01'],
  ['getInbox', (a) => a.getInbox({ startAt: 's', stopAt: 'e' }), 'GET', '/inbox', 'startAt=s&stopAt=e'],
  ['listSenders', (a) => a.listSenders(), 'GET', '/senders'],
  ['getDefaultSender', (a) => a.getDefaultSender(), 'GET', '/senders/default'],
  ['setDefaultSender', (a) => a.setDefaultSender(body as never), 'PUT', '/senders/default', undefined, body],
  ['registerReportWebhook', (a) => a.registerReportWebhook(body as never), 'POST', '/webhooks/report', undefined, body],
  ['registerInboxWebhook', (a) => a.registerInboxWebhook(body as never), 'POST', '/webhooks/inbox', undefined, body],
  ['getBlacklist', (a) => a.getBlacklist({ page: 2, number: '555' }), 'GET', '/blacklist', 'page=2&number=555'],
  ['measureLength', (a) => a.measureLength(body as never), 'POST', '/length', undefined, body],
  ['listTemplates', (a) => a.listTemplates({ includePublic: false, size: 5 }), 'GET', '/templates', 'includePublic=false&size=5'],
  ['getBalance', (a) => a.getBalance({ stip: 3, service: 'sms' }), 'GET', '/balance', 'stip=3&service=sms'],
];

describe('SmsApi', () => {
  it.each(cases)('%s', async (_n, call, method, path, query, reqBody) => {
    const { api, calls } = setup([{ status: 200, body: RESP }]);
    await expect(call(api)).resolves.toEqual(RESP);
    const c = calls()[0]!;
    expect(c.method).toBe(method);
    const u = new URL(c.url);
    expect(u.pathname).toBe(`/sms/v3${path}`);
    expect(u.search.replace(/^\?/, '')).toBe(query ?? '');
    expect(c.body).toEqual(reqBody);
    expect(c.headers['x-client']).toBeUndefined();
  });

  it.each([
    ['deleteReportWebhook', '/webhooks/report'],
    ['deleteInboxWebhook', '/webhooks/inbox'],
  ] as const)('%s', async (name, path) => {
    const { api, calls } = setup([{ status: 204 }]);
    await expect(api[name]()).resolves.toBeUndefined();
    expect(calls()[0]!.method).toBe('DELETE');
    expect(new URL(calls()[0]!.url).pathname).toBe(`/sms/v3${path}`);
  });

  it('getBalance({stip:2}) returns BalanceSummaryResponse', () => {
    // Types only: never invoked at runtime.
    const typeChecks = (api: SmsApi): void => {
      expectTypeOf(api.getBalance({ stip: 2 })).toEqualTypeOf<Promise<BalanceSummaryResponse>>();
      expectTypeOf(api.getBalance()).toEqualTypeOf<Promise<BalanceListResponse>>();
      expectTypeOf(api.getBalance({ stip: 1 })).toEqualTypeOf<Promise<BalanceListResponse>>();
    };
    expect(typeChecks).toBeTypeOf('function');
  });

  it('sendOtp omits x-client when enterpriseOtp is false', async () => {
    const { api, calls } = setup([{ status: 200, body: RESP }], false);
    await api.sendOtp(body as never);
    expect(calls()[0]!.headers['x-client']).toBeUndefined();
  });

  it('sendOtp sends x-client: enterprise when enterpriseOtp is true', async () => {
    const { api, calls } = setup([{ status: 200, body: RESP }], true);
    await api.sendOtp(body as never);
    expect(calls()[0]!.headers['x-client']).toBe('enterprise');
  });
});
