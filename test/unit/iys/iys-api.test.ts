import { describe, expect, it } from 'vitest';
import { NetgsmApiError } from '../../../src/core/errors.js';
import { TokenManager } from '../../../src/core/token-manager.js';
import { formatIysDate, maskRecipient, toIysRecipient } from '../../../src/iys/helpers.js';
import { IysApi } from '../../../src/iys/iys-api.js';
import { IysTransport } from '../../../src/iys/transport.js';
import type { ConsentRecord } from '../../../src/iys/types.js';
import { fakeFetch, type FakeResponse } from '../../fixtures/fake-fetch.js';

const BASE = 'https://api.example.test';
const tok = (n: number): FakeResponse => ({
  status: 200,
  body: { access_token: `a${n}`, refresh_token: `r${n}`, expires_in: 3600 },
});
const ok = (data: unknown): FakeResponse => ({
  status: 200,
  body: { success: true, errorCode: 0, message: 'ok', data },
});

function build(queue: FakeResponse[], maxRetryAfterSec = 60) {
  const ff = fakeFetch(queue);
  const tokens = new TokenManager({
    baseUrl: BASE,
    username: 'u',
    password: 'p',
    scope: 'sms',
    fetch: ff.fetch,
    now: () => 0,
  });
  const sleeps: number[] = [];
  const transport = new IysTransport({
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
  return { transport, sleeps, ff };
}

function setup(
  responses: FakeResponse[],
  brandCode: number | null = 123,
  maxRetryAfterSec = 60,
) {
  const { transport, sleeps, ff } = build([tok(1), ...responses], maxRetryAfterSec);
  const api = new IysApi(transport, brandCode === null ? {} : { brandCode });
  return { api, transport, sleeps, calls: () => ff.calls.slice(1) };
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

const rec = (recipient = '+905551112233'): ConsentRecord => ({
  recipient,
  recipientType: 'BIREYSEL',
  type: 'MESAJ',
  source: 'HS_WEB',
  status: 'ONAY',
  consentDate: '2026-11-05 10:00:00',
});
const q1 = { recipient: '+905551112233', recipientType: 'BIREYSEL', type: 'MESAJ' } as const;

describe('helpers', () => {
  it('converts and formats', () => {
    expect(toIysRecipient('905551112233')).toBe('+905551112233');
    expect(() => toIysRecipient('5551112233')).toThrow(TypeError);
    expect(formatIysDate(new Date('2026-11-05T07:00:00Z'))).toBe('2026-11-05 10:00:00');
    expect(maskRecipient('+905321234567')).toBe('+90532*****67');
    expect(maskRecipient('ad@alan.com')).toBe('a***@alan.com');
  });
});

describe('IysApi', () => {
  it('saveConsents_501_throws_range_error_without_request', async () => {
    const { api, calls } = setup([]);
    await expect(api.saveConsents(Array.from({ length: 501 }, () => rec()))).rejects.toBeInstanceOf(
      RangeError,
    );
    expect(calls()).toHaveLength(0);
  });

  it('saveConsents_posts_body_and_returns_rejected', async () => {
    const { api, calls } = setup([
      ok({ uid: 'u1', erroritem: [{ index: 0, field: 'consentDate', message: 'bad' }] }),
    ]);
    const r = await api.saveConsents([rec()], { refId: 'ref', path: 'SMSAPI', requestId: 'rid-00001' });
    expect(r).toEqual({
      uid: 'u1',
      rejected: [{ index: 0, field: 'consentDate', message: 'bad' }],
      requestId: 'rid-00001',
    });
    const c = calls()[0]!;
    expect(c.url).toBe(`${BASE}/iys/v1/consents`);
    expect(c.headers['x-request-id']).toBe('rid-00001');
    expect(c.body).toMatchObject({ brandCode: 123, path: 'SMSAPI', refId: 'ref' });
  });

  it('saveConsents_rejects_sms_format_phone_without_leaking_it', async () => {
    const { api, calls } = setup([]);
    const e = await api.saveConsents([rec('905551112233')]).catch((x: Error) => x);
    expect(e).toBeInstanceOf(TypeError);
    expect((e as Error).message).not.toContain('905551112233');
    expect(calls()).toHaveLength(0);
  });

  it('searchConsents_chunks_and_keeps_order', async () => {
    const queries = Array.from({ length: 250 }, (_, i) => ({
      recipient: `+90555${String(1000000 + i)}`,
      recipientType: 'BIREYSEL' as const,
      type: 'MESAJ' as const,
    }));
    const row = (q: { recipient: string }) => ({
      type: 'MESAJ',
      source: 'HS_WEB',
      recipient: q.recipient,
      status: 'ONAY',
      consentDate: '2026-11-05 10:00:00',
      recipientType: 'BIREYSEL',
      errorCode: 0,
      message: null,
    });
    const { api, calls } = setup([
      ok(queries.slice(0, 100).map(row)),
      ok(queries.slice(100, 200).map(row)),
      ok(queries.slice(200).map(row)),
    ]);
    const out = await api.searchConsents(queries, { chunkSize: 100 });
    expect(calls()).toHaveLength(3);
    expect(out.map((c) => c.recipient)).toEqual(queries.map((q) => q.recipient));
    const first = new URL(calls()[0]!.url).searchParams;
    expect(first.get('brandCode')).toBe('123');
    expect(first.get('data[0][recipient]')).toBe(queries[0]!.recipient);
    expect(first.get('data[99][type]')).toBe('MESAJ');
    expect(calls()[0]!.url).toContain('%2B');
  });

  it('searchConsents_validates_chunk_size', async () => {
    const { api, calls } = setup([]);
    await expect(api.searchConsents([], { chunkSize: 1001 })).rejects.toBeInstanceOf(RangeError);
    await expect(api.searchConsents([], { chunkSize: 0 })).rejects.toBeInstanceOf(RangeError);
    expect(calls()).toHaveLength(0);
  });

  it('searchConsents_single_query_81_becomes_record', async () => {
    const { api } = setup([
      { status: 404, body: { success: false, errorCode: 81, message: 'not found' } },
    ]);
    const out = await api.searchConsents([q1]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ errorCode: 81, status: null });
  });

  it('saveWebhook_posts', async () => {
    const { api, calls } = setup([ok({ uid: 'w1' })]);
    const r = await api.saveWebhook('https://hook.example/x', { path: 'SMSAPI', requestId: 'rid-00002' });
    expect(r).toEqual({ uid: 'w1', requestId: 'rid-00002' });
    expect(calls()[0]!.body).toEqual({
      brandCode: 123,
      path: 'SMSAPI',
      webhookUrl: 'https://hook.example/x',
    });
  });

  it('method_brandCode_overrides_default', async () => {
    const { api, calls } = setup([ok({ uid: 'w1' })]);
    await api.saveWebhook('https://h.example', { brandCode: 7 });
    expect((calls()[0]!.body as { brandCode: number }).brandCode).toBe(7);
  });

  it('no_brandCode_throws_type_error_without_request', async () => {
    const { api, calls } = setup([], null);
    await expect(api.saveConsents([rec()])).rejects.toBeInstanceOf(TypeError);
    await expect(api.searchConsents([])).rejects.toBeInstanceOf(TypeError);
    await expect(api.saveWebhook('https://h.example')).rejects.toBeInstanceOf(TypeError);
    expect(calls()).toHaveLength(0);
  });
});

describe('IysTransport', () => {
  it('success_false_errorCode_81_maps_to_error', async () => {
    const { api } = setup([
      { status: 200, body: { success: false, errorCode: 81, message: 'nf', data: { x: 1 } } },
    ]);
    const e = await fails(api.saveWebhook('https://h.example'));
    expect(e).toMatchObject({ api: 'iys', code: '81', retryable: false, data: { x: 1 } });
  });

  it('retries_503_then_succeeds_with_backoff', async () => {
    const busy = { status: 503, body: { success: false, errorCode: 141, message: 'busy' } };
    const { api, sleeps, calls } = setup([busy, busy, ok({ uid: 'w' })]);
    await api.saveWebhook('https://h.example');
    expect(sleeps).toEqual([1000, 2000]);
    expect(calls()).toHaveLength(3);
  });

  it('honours_retry_after_and_throws_when_above_max', async () => {
    const limited = (ra: string): FakeResponse => ({
      status: 429,
      body: { success: false, errorCode: 150, message: 'x' },
      headers: { 'Retry-After': ra },
    });
    const r = setup([limited('120')], 123, 60);
    const e = await fails(r.api.saveWebhook('https://h.example'));
    expect(e).toMatchObject({ retryable: true, code: '150', retryAfterSec: 120 });
    expect(r.sleeps).toEqual([]);
    const r2 = setup([limited('5'), ok({ uid: 'w' })]);
    await r2.api.saveWebhook('https://h.example');
    expect(r2.sleeps).toEqual([5000]);
  });

  it('gives_up_after_three_retries', async () => {
    const busy = { status: 503, body: { success: false, errorCode: 141, message: 'b' } };
    const { api, calls } = setup([busy, busy, busy, busy]);
    const e = await fails(api.saveWebhook('https://h.example'));
    expect(e.retryable).toBe(true);
    expect(calls()).toHaveLength(4);
  });

  it('post_consents_500_sets_may_have_been_processed_and_does_not_retry', async () => {
    const { api, calls } = setup([
      { status: 500, body: { success: false, errorCode: 110, message: 'err' } },
    ]);
    const e = await fails(api.saveConsents([rec()]));
    expect(e).toMatchObject({ mayHaveBeenProcessed: true, retryable: false, code: '110' });
    expect(calls()).toHaveLength(1);
  });

  it('get_500_is_retried', async () => {
    const { api, calls } = setup([
      { status: 500, body: { success: false, errorCode: 110, message: 'err' } },
      ok([
        {
          type: 'MESAJ',
          source: 'HS_WEB',
          recipient: q1.recipient,
          status: 'ONAY',
          consentDate: '2026-11-05 10:00:00',
          recipientType: 'BIREYSEL',
        },
      ]),
    ]);
    const out = await api.searchConsents([q1]);
    expect(out[0]).toMatchObject({ errorCode: 0, message: null });
    expect(calls()).toHaveLength(2);
  });

  it('401_relogs_in_once', async () => {
    const { transport, ff } = build([
      tok(1),
      { status: 401, body: { success: false, errorCode: 51, message: 'expired' } },
      tok(2),
      ok({ uid: 'w' }),
    ]);
    await new IysApi(transport, { brandCode: 1 }).saveWebhook('https://h.example');
    expect(ff.calls[3]!.headers['authorization']).toBe('Bearer a2');
  });

  it('network_error_on_post_consents_is_uncertain_single_call', async () => {
    const { transport, ff } = build([tok(1)]); // the API call rejects: queue exhausted
    const e = await fails(new IysApi(transport, { brandCode: 1 }).saveConsents([rec()]));
    expect(e).toMatchObject({
      code: 'NETWORK_ERROR',
      status: 0,
      mayHaveBeenProcessed: true,
      retryable: false,
    });
    expect(ff.calls).toHaveLength(2);
    expect(e.message).not.toContain('905551112233');
  });

  it('network_error_on_get_is_retryable_not_uncertain', async () => {
    const { transport } = build([tok(1)]);
    const e = await fails(transport.request('GET', '/consents'));
    expect(e).toMatchObject({ code: 'NETWORK_ERROR', mayHaveBeenProcessed: false, retryable: true });
  });

  it('empty_2xx_is_invalid_response', async () => {
    const { api } = setup([{ status: 200, body: '' }]);
    const e = await fails(api.saveConsents([rec()]));
    expect(e).toMatchObject({ code: 'INVALID_RESPONSE', mayHaveBeenProcessed: true });
  });

  it('thread_id_is_request_id_fallback', async () => {
    const { api } = setup([
      {
        status: 400,
        body: { success: false, errorCode: 120, message: 'bad' },
        headers: { 'X-Thread-Id': 'th-1' },
      },
    ]);
    const e = await fails(api.saveWebhook('https://h.example'));
    expect(e.requestId).toBe('th-1');
  });

  it('rejects_non_canonical_paths_before_fetch', async () => {
    const { transport, calls } = setup([]);
    await expect(transport.request('GET', '/consents?x=1')).rejects.toBeInstanceOf(TypeError);
    await expect(transport.request('GET', '/consents/')).rejects.toBeInstanceOf(TypeError);
    expect(calls()).toHaveLength(0);
  });
});


describe('malformed success and request ids', () => {
  it.each([
    ['empty object', {}],
    ['array', []],
    ['no success flag', { errorCode: 0, data: { uid: 'x' } }],
  ])('2xx_%s_is_invalid_response', async (_n, body) => {
    const { api } = setup([{ status: 200, body }]);
    const e = await fails(api.saveConsents([rec()]));
    expect(e).toMatchObject({ code: 'INVALID_RESPONSE', mayHaveBeenProcessed: true });
  });

  it('saveConsents_without_uid_is_invalid_response', async () => {
    const { api } = setup([ok({ erroritem: [] })]);
    const e = await fails(api.saveConsents([rec()]));
    expect(e).toMatchObject({ code: 'INVALID_RESPONSE', mayHaveBeenProcessed: true });
  });

  it('saveWebhook_without_uid_is_invalid_response', async () => {
    const { api } = setup([{ status: 200, body: { success: true } }]);
    const e = await fails(api.saveWebhook('https://h.example'));
    expect(e).toMatchObject({ code: 'INVALID_RESPONSE', mayHaveBeenProcessed: true });
  });

  it('searchConsents_non_array_data_is_invalid_response', async () => {
    const { api } = setup([ok({ foo: 1 })]);
    const e = await fails(api.searchConsents([q1]));
    expect(e).toMatchObject({ code: 'INVALID_RESPONSE', mayHaveBeenProcessed: false });
  });

  it('searchConsents_row_count_mismatch_is_invalid_response', async () => {
    const { api } = setup([ok([])]);
    const e = await fails(api.searchConsents([q1]));
    expect(e).toMatchObject({ code: 'INVALID_RESPONSE', mayHaveBeenProcessed: false });
  });

  it.each([110, 112])('post_consents_errorCode_%i_is_uncertain_whatever_status', async (code) => {
    const { api, calls } = setup([
      { status: 400, body: { success: false, errorCode: code, message: 'x' } },
    ]);
    const e = await fails(api.saveConsents([rec()]));
    expect(e).toMatchObject({ mayHaveBeenProcessed: true, retryable: false, code: String(code) });
    expect(calls()).toHaveLength(1);
  });

  it('invalid_request_id_throws_type_error_without_request_or_echo', async () => {
    const { api, calls } = setup([]);
    for (const bad of ['short', 'has space 12345', 'x'.repeat(65), 'ünicode-id-123']) {
      const e = await api.saveWebhook('https://h.example', { requestId: bad }).catch((x: Error) => x);
      expect(e).toBeInstanceOf(TypeError);
      expect((e as Error).message).not.toContain(bad);
    }
    await expect(api.saveConsents([rec()], { requestId: 'bad' })).rejects.toBeInstanceOf(TypeError);
    expect(calls()).toHaveLength(0);
  });
});
