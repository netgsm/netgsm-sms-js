import { inspect } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';
import Netgsm, * as pkg from '../../src/index.js';
import { fakeFetch, type FakeResponse } from '../fixtures/fake-fetch.js';

const SECRET = 'S3cr3t-Pa55w0rd!';
const tok: FakeResponse = {
  status: 200,
  body: { access_token: 'a1', refresh_token: 'r1', expires_in: 3600 },
};
const opts = { username: 'user1', password: SECRET };

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
  delete (globalThis as { document?: unknown }).document;
});

describe('Netgsm facade', () => {
  it('rejects empty or non-string credentials without leaking values', () => {
    for (const bad of [
      { username: '', password: SECRET },
      { username: 'user1', password: '' },
      { username: 'user1', password: 5 as unknown as string },
      { username: undefined as unknown as string, password: SECRET },
    ]) {
      let err: unknown;
      try {
        new Netgsm(bad);
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(TypeError);
      expect((err as Error).message).not.toContain(SECRET);
      expect((err as Error).message).not.toContain('user1');
    }
  });

  it('rejects an invalid baseUrl with a generic message', () => {
    for (const baseUrl of ['not a url', 'ftp://x.test', '']) {
      expect(() => new Netgsm({ ...opts, baseUrl })).toThrow(TypeError);
    }
    expect(() => new Netgsm({ ...opts, baseUrl: 'ftp://u:pw@x.test' })).toThrow(/baseUrl/);
    for (const baseUrl of [5, {}, 'https://x.test?a=1', 'https://x.test#h', 'https://x.test?', 'https://x.test/#', 'https://x.test/?']) {
      expect(() => new Netgsm({ ...opts, baseUrl: baseUrl as unknown as string })).toThrow(
        "baseUrl must be a valid http(s) URL",
      );
    }
  });

  it('exports NetgsmEnvironment and public API', () => {
    expect(pkg.NetgsmEnvironment).toEqual({
      LIVE: 'https://ext-api.netgsm.com.tr',
      SANDBOX: 'https://ext-sandbox.netgsm.com.tr',
    });
    expect(pkg.Netgsm).toBe(Netgsm);
    for (const k of [
      'NetgsmApiError', 'VERSION', 'parseCredit', 'findBalance', 'webhookToReport',
      'webhookOperator', 'WEBHOOK_STATUS_REASON', 'WEBHOOK_ERROR_REASON', 'formatIysDate',
      'toIysRecipient', 'maskRecipient',
    ]) {
      expect(pkg, k).toHaveProperty(k);
    }
    expect(pkg).not.toHaveProperty('TokenManager');
  });

  it('uses baseUrl with trailing slashes trimmed', async () => {
    const { fetch, calls } = fakeFetch([tok, { status: 200, body: { success: true, data: [] } }]);
    const n = new Netgsm({ ...opts, baseUrl: ' http://127.0.0.1:4010// ', fetch });
    await n.sms.getBalance();
    expect(calls[0]!.url).toBe('http://127.0.0.1:4010/auth/v3/token');
    expect(calls[1]!.url.startsWith('http://127.0.0.1:4010/sms/v3/balance')).toBe(true);
  });

  it('defaults to the live environment', async () => {
    const { fetch, calls } = fakeFetch([tok, { status: 200, body: {} }]);
    await new Netgsm({ ...opts, fetch }).sms.getBalance();
    expect(calls[0]!.url).toBe('https://ext-api.netgsm.com.tr/auth/v3/token');
  });

  it('shares one login between sms and iys', async () => {
    const { fetch, calls } = fakeFetch([
      tok,
      { status: 200, body: { success: true, errorCode: 0, data: [] } },
      {
        status: 200,
        body: {
          success: true,
          errorCode: 0,
          data: [
            {
              type: 'MESAJ',
              source: 'HS_WEB',
              recipient: '+905551234567',
              status: 'ONAY',
              consentDate: '2026-11-05 10:00:00',
              recipientType: 'BIREYSEL',
              errorCode: 0,
              message: null,
            },
          ],
        },
      },
    ]);
    const n = new Netgsm({ ...opts, fetch, iysBrandCode: 123 });
    await n.sms.getBalance();
    await n.iys.searchConsents([
      { recipient: '+905551234567', recipientType: 'BIREYSEL', type: 'MESAJ' },
    ]);
    expect(calls.filter((c) => c.url.endsWith('/auth/v3/token'))).toHaveLength(1);
    expect(calls.some((c) => c.url.includes('/iys/v1/consents'))).toBe(true);
    expect(calls[0]!.body).toMatchObject({ scope: 'sms' });
  });

  it('works when the default global fetch is this-sensitive', async () => {
    const orig = globalThis.fetch;
    const { fetch: inner } = fakeFetch([tok, { status: 200, body: {} }]);
    globalThis.fetch = function (this: unknown, ...a: Parameters<typeof fetch>) {
      if (this !== globalThis) throw new TypeError('Illegal invocation');
      return inner(...a);
    } as typeof fetch;
    try {
      await new Netgsm(opts).sms.getBalance();
    } finally {
      globalThis.fetch = orig;
    }
  });

  it('wraps an injected this-sensitive fetch', async () => {
    const { fetch: inner } = fakeFetch([tok, { status: 200, body: {} }]);
    const sensitive = function (this: unknown, ...a: Parameters<typeof fetch>) {
      if (this !== undefined && this !== globalThis) throw new TypeError('Illegal invocation');
      return inner(...a);
    } as typeof fetch;
    await new Netgsm({ ...opts, fetch: sensitive }).sms.getBalance();
  });

  it('refuses window-only and document-only environments unless allowed', () => {
    const g = globalThis as { window?: unknown; document?: unknown };
    g.window = {};
    const guarded = new Netgsm(opts);
    expect(() => guarded.sms).toThrow(/server/i);
    expect(() => guarded.iys).toThrow(/server/i);
    const allowed = new Netgsm({ ...opts, dangerouslyAllowBrowser: true });
    expect(allowed.sms).toBeDefined();
    expect(allowed.iys).toBeDefined();
    delete g.window;
    g.document = {};
    expect(() => new Netgsm(opts).sms).toThrow(/server/i);
  });

  it('allows window when running on Deno', () => {
    const g = globalThis as { window?: unknown; Deno?: unknown };
    g.window = {};
    g.Deno = {};
    try {
      expect(new Netgsm(opts).sms).toBeDefined();
    } finally {
      delete g.Deno;
    }
  });

  it('does not expose the password', () => {
    const n = new Netgsm(opts);
    expect(String(n)).not.toContain(SECRET);
    expect(JSON.stringify(n)).not.toContain(SECRET);
    expect(inspect(n, { depth: 10, showHidden: true })).not.toContain(SECRET);
    expect(JSON.stringify(n.sms)).not.toContain(SECRET);
    expect(inspect(n.iys, { depth: 10 })).not.toContain(SECRET);
  });

  it('never exposes tokens or password after a login', async () => {
    const { fetch } = fakeFetch([
      { status: 200, body: { access_token: 'ACCESS_TOKEN_XYZ', refresh_token: 'REFRESH_TOKEN_XYZ', expires_in: 3600 } },
      { status: 200, body: { success: true, errorCode: 0, data: [] } },
      {
        status: 200,
        body: {
          success: true,
          errorCode: 0,
          data: [
            {
              type: 'MESAJ', source: 'HS_WEB', recipient: '+905551234567', status: 'ONAY',
              consentDate: '2026-11-05 10:00:00', recipientType: 'BIREYSEL', errorCode: 0, message: null,
            },
          ],
        },
      },
    ]);
    const n = new Netgsm({ ...opts, fetch, iysBrandCode: 1 });
    await n.sms.getBalance();
    await n.iys.searchConsents([
      { recipient: '+905551234567', recipientType: 'BIREYSEL', type: 'MESAJ' },
    ]);
    for (const x of [n, n.sms, n.iys]) {
      for (const out of [
        String(x),
        JSON.stringify(x),
        inspect(x, { depth: Infinity, showHidden: true }),
      ]) {
        expect(out).not.toContain('ACCESS_TOKEN_XYZ');
        expect(out).not.toContain('REFRESH_TOKEN_XYZ');
        expect(out).not.toContain(SECRET);
      }
    }
  });

  it('login_network_failure_surfaces_from_sms_send_as_identity_error', async () => {
    const n = new Netgsm({
      ...opts,
      fetch: (() => Promise.reject(new TypeError('down'))) as typeof fetch,
    });
    const e = (await n.sms
      .send({ sender: 'S', messages: [{ text: 't', recipient: '905321234567' }] })
      .catch((x: unknown) => x)) as pkg.NetgsmApiError;
    expect(e).toBeInstanceOf(pkg.NetgsmApiError);
    expect(e).toMatchObject({ api: 'identity', code: 'NETWORK_ERROR' });
  });

  it('validates option types with generic messages', () => {
    const bad: Record<string, unknown[]> = {
      maxRetryAfterSec: [-1, NaN, Infinity, '5', null],
      iysBrandCode: [0, -3, 1.5, 2147483648, '12', NaN],
      enterpriseOtp: ['true', 1, null],
      fetch: ['x', {}, 1],
      now: ['x', 5],
      dangerouslyAllowBrowser: ['yes', 1],
    };
    for (const [key, values] of Object.entries(bad)) {
      for (const v of values) {
        let err: unknown;
        try {
          new Netgsm({ ...opts, [key]: v } as never);
        } catch (e) {
          err = e;
        }
        expect(err, `${key}=${String(v)}`).toBeInstanceOf(TypeError);
        expect((err as Error).message).toContain(key);
        expect((err as Error).message).not.toContain(String(v) + '!');
      }
    }
    expect(
      () => new Netgsm({ ...opts, maxRetryAfterSec: 0, iysBrandCode: 2147483647, enterpriseOtp: false }),
    ).not.toThrow();
  });
});
