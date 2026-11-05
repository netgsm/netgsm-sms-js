import { describe, expect, it } from 'vitest';
import { NetgsmApiError } from '../../../src/core/errors.js';
import { TokenManager } from '../../../src/core/token-manager.js';
import { SmsTransport } from '../../../src/sms/transport.js';
import { fakeFetch, type FakeResponse } from '../../fixtures/fake-fetch.js';

const BASE = 'https://api.example.test';
const tok = (n: number): FakeResponse => ({
  status: 200,
  body: { access_token: `a${n}`, refresh_token: `r${n}`, expires_in: 3600 },
});

function setup(responses: FakeResponse[], maxRetryAfterSec = 60) {
  const ff = fakeFetch([tok(1), ...responses]);
  const tokens = new TokenManager({
    baseUrl: BASE,
    username: 'u',
    password: 'p',
    scope: 'sms',
    fetch: ff.fetch,
    now: () => 0,
  });
  const sleeps: number[] = [];
  const transport = new SmsTransport({
    baseUrl: BASE,
    tokens,
    fetch: ff.fetch,
    now: () => 0,
    sleep: (ms) => {
      sleeps.push(ms);
      return Promise.resolve();
    },
    maxRetryAfterSec,
    userAgent: 'netgsm-sms-js/test',
  });
  // calls[0] is the token request; API calls follow.
  return { transport, sleeps, calls: ff.calls, api: () => ff.calls.slice(1) };
}

async function fails(p: Promise<unknown>): Promise<NetgsmApiError> {
  try {
    await p;
  } catch (e) {
    expect(e).toBeInstanceOf(NetgsmApiError);
    return e as NetgsmApiError;
  }
  throw new Error('expected rejection');
}

const jitterOk = (ms: number, base: number) => ms >= base && ms < base + 250;

describe('SmsTransport', () => {
  it('sends_bearer_and_json', async () => {
    const { transport, api } = setup([{ status: 202, body: { jobId: '1' } }]);
    const r = await transport.request('POST', '/send', { body: { msg: 'hi' } });
    expect(r).toEqual({ jobId: '1' });
    const c = api()[0]!;
    expect(c.url).toBe(`${BASE}/sms/v3/send`);
    expect(c.headers['authorization']).toBe('Bearer a1');
    expect(c.headers['content-type']).toBe('application/json');
    expect(c.headers['user-agent']).toBe('netgsm-sms-js/test');
    expect(c.body).toEqual({ msg: 'hi' });
  });

  it('returns_undefined_on_204', async () => {
    const { transport } = setup([{ status: 204 }]);
    expect(await transport.request('DELETE', '/x')).toBeUndefined();
  });

  it('relogin_once_on_401', async () => {
    const ok = setup([
      { status: 401, body: { code: 'UNAUTHENTICATED' } },
      tok(2),
      { status: 202, body: { ok: true } },
    ]);
    expect(await ok.transport.request('POST', '/send', { body: {} })).toEqual({ ok: true });
    expect(ok.api()[2]!.headers['authorization']).toBe('Bearer a2');

    const bad = setup([
      { status: 401, body: { code: 'UNAUTHENTICATED' } },
      tok(2),
      { status: 401, body: { code: 'UNAUTHENTICATED' } },
    ]);
    const err = await fails(bad.transport.request('POST', '/send', { body: {} }));
    expect(err.status).toBe(401);
  });

  it('send_5xx_is_never_retried', async () => {
    for (const path of ['/send', '/send/template', '/directory/send']) {
      for (const status of [500, 502, 503, 504]) {
        const { transport, api, sleeps } = setup([
          { status, body: { code: 'X' } },
          { status: 202 },
        ]);
        const err = await fails(transport.request('POST', path, { body: {} }));
        expect(api().filter((c) => c.url === `${BASE}/sms/v3${path}`)).toHaveLength(1);
        expect(api()).toHaveLength(1);
        expect(sleeps).toEqual([]);
        expect(err.mayHaveBeenProcessed).toBe(true);
        expect(err.retryable).toBe(false);
      }
    }
  });

  it('otp_503_retries_1_2_4', async () => {
    const ok = setup([
      { status: 503 },
      { status: 503 },
      { status: 503 },
      { status: 200, body: { a: 1 } },
    ]);
    expect(await ok.transport.request('POST', '/send/otp', { body: {} })).toEqual({ a: 1 });
    expect(ok.sleeps).toHaveLength(3);
    [1000, 2000, 4000].forEach((b, i) => expect(jitterOk(ok.sleeps[i]!, b)).toBe(true));

    const bad = setup([{ status: 503 }, { status: 503 }, { status: 503 }, { status: 503 }]);
    const err = await fails(bad.transport.request('POST', '/send/otp', { body: {} }));
    expect(err.retryable).toBe(true);
    expect(bad.api()).toHaveLength(4);
  });

  it('otp_500_not_retried', async () => {
    const { transport, api } = setup([{ status: 500 }, { status: 200 }]);
    const err = await fails(transport.request('POST', '/send/otp', { body: {} }));
    expect(err.mayHaveBeenProcessed).toBe(true);
    expect(err.retryable).toBe(false);
    expect(api()).toHaveLength(1);
  });

  it('cancel_5xx_retried', async () => {
    const { transport, api } = setup([{ status: 500 }, { status: 200, body: { done: true } }]);
    expect(await transport.request('POST', '/cancel', { body: {} })).toEqual({ done: true });
    expect(api()).toHaveLength(2);
  });

  it('per_job_reads_not_retried', async () => {
    const stats = setup([{ status: 503 }, { status: 200 }]);
    const e1 = await fails(stats.transport.request('GET', '/stats', { query: { jobId: '1' } }));
    expect(stats.api()).toHaveLength(1);
    expect(e1.retryable).toBe(true);

    const rep = setup([{ status: 503 }, { status: 200 }]);
    const e2 = await fails(rep.transport.request('GET', '/report', { query: { jobIds: ['1'] } }));
    expect(rep.api()).toHaveLength(1);
    expect(e2.retryable).toBe(true);

    const range = setup([{ status: 503 }, { status: 200, body: { items: [] } }]);
    await range.transport.request('GET', '/report', { query: { startAt: '2026-01-01' } });
    expect(range.api()).toHaveLength(2);
  });

  it('retry_after_429_once', async () => {
    const { transport, sleeps, api } = setup([
      { status: 429, headers: { 'Retry-After': '2' } },
      { status: 200, body: { ok: 1 } },
    ]);
    expect(await transport.request('GET', '/senders')).toEqual({ ok: 1 });
    expect(sleeps).toHaveLength(1);
    expect(jitterOk(sleeps[0]!, 2000)).toBe(true);
    expect(api()).toHaveLength(2);

    const twice = setup([
      { status: 429, headers: { 'Retry-After': '2' } },
      { status: 429, headers: { 'Retry-After': '2' } },
    ]);
    const err = await fails(twice.transport.request('GET', '/senders'));
    expect(err.status).toBe(429);
    expect(twice.sleeps).toHaveLength(1);
  });

  it('429_without_retry_after_is_suspension', async () => {
    const { transport, sleeps } = setup([{ status: 429, body: { code: 'SENDING_SUSPENDED' } }]);
    const err = await fails(transport.request('POST', '/send', { body: {} }));
    expect(err.retryable).toBe(false);
    expect(sleeps).toEqual([]);
  });

  it('long_retry_after_throws', async () => {
    const { transport, sleeps } = setup([{ status: 429, headers: { 'Retry-After': '120' } }], 60);
    const err = await fails(transport.request('GET', '/senders'));
    expect(sleeps).toEqual([]);
    expect(err.retryable).toBe(true);
    expect(err.retryAfterSec).toBe(120);
  });

  it('balance_429_never_waits', async () => {
    const { transport, sleeps, api } = setup([{ status: 429, headers: { 'Retry-After': '5' } }]);
    const err = await fails(transport.request('GET', '/balance'));
    expect(sleeps).toEqual([]);
    expect(err.retryable).toBe(true);
    expect(err.retryAfterSec).toBe(5);
    expect(api()).toHaveLength(1);
  });

  it('422_carries_rejected_items', async () => {
    const { transport } = setup([
      {
        status: 422,
        body: {
          code: 'NO_DELIVERABLE_MESSAGES',
          rejectedItems: [{ index: 0, recipient: 'x', reason: 'INVALID_NUMBER' }],
          requestId: 'q1',
        },
      },
    ]);
    const err = await fails(transport.request('POST', '/send', { body: {} }));
    expect(err.rejectedItems).toHaveLength(1);
    expect(err.requestId).toBe('q1');
    expect(err.retryable).toBe(false);
    expect(err.api).toBe('sms');
    expect(err.operation).toBe('POST /sms/v3/send');
  });

  it('request_id_falls_back_to_headers', async () => {
    const { transport } = setup([{ status: 400, headers: { 'X-Thread-Id': 't9' } }]);
    const err = await fails(transport.request('POST', '/send', { body: {} }));
    expect(err.requestId).toBe('t9');
  });

  it('non_json_error_body', async () => {
    const { transport } = setup([{ status: 502, body: '<html>Bad Gateway</html>' }]);
    const err = await fails(transport.request('POST', '/send/otp', { body: {} }));
    expect(err.code).toBe('HTTP_502');
  });

  it('query_serialization', async () => {
    const { transport, api } = setup([{ status: 200, body: {} }]);
    await transport.request('GET', '/report', {
      query: { jobIds: ['1', '2'], page: 2, x: undefined },
    });
    expect(api()[0]!.url).toBe(`${BASE}/sms/v3/report?jobIds=1%2C2&page=2`);
  });
});
