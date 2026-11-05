import { describe, expect, it } from 'vitest';
import { NetgsmApiError } from '../../../src/core/errors.js';
import { TokenManager } from '../../../src/core/token-manager.js';
import { fakeFetch, type FakeResponse } from '../../fixtures/fake-fetch.js';

const BASE = 'https://id.example.test';

const tokenBody = (n: number, expiresIn = 3600) => ({
  access_token: `a${n}`,
  refresh_token: `r${n}`,
  expires_in: expiresIn,
});

function setup(responses: FakeResponse[]) {
  let t = 0;
  const ff = fakeFetch(responses);
  const manager = new TokenManager({
    baseUrl: BASE,
    username: 'user',
    password: 's3cret!',
    scope: 'sms',
    fetch: ff.fetch,
    now: () => t,
  });
  return {
    ...ff,
    manager,
    setTime: (v: number) => {
      t = v;
    },
  };
}

describe('TokenManager', () => {
  it('caches_token', async () => {
    const { manager, calls } = setup([{ status: 200, body: tokenBody(1) }]);
    expect(await manager.get()).toBe('a1');
    expect(await manager.get()).toBe('a1');
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe(`${BASE}/auth/v3/token`);
    expect(calls[0]!.method).toBe('POST');
    expect(calls[0]!.headers['content-type']).toBe('application/json');
    expect(calls[0]!.body).toEqual({ username: 'user', password: 's3cret!', scope: 'sms' });
  });

  it('concurrent_get_shares_one_login', async () => {
    const { manager, calls } = setup([{ status: 200, body: tokenBody(1) }]);
    const all = await Promise.all(Array.from({ length: 50 }, () => manager.get()));
    expect(new Set(all)).toEqual(new Set(['a1']));
    expect(calls.length).toBe(1);
  });

  it('refreshes_inside_margin', async () => {
    const { manager, calls, setTime } = setup([
      { status: 200, body: tokenBody(1) },
      { status: 200, body: tokenBody(2) },
    ]);
    await manager.get();
    setTime(3600_000 - 299_000);
    expect(await manager.get()).toBe('a2');
    expect(calls).toHaveLength(2);
    expect(calls[1]!.url).toBe(`${BASE}/auth/v3/token/refresh`);
    expect(calls[1]!.method).toBe('POST');
    expect(calls[1]!.body).toEqual({ refresh_token: 'r1' });
  });

  it('short_ttl_margin_is_ten_percent', async () => {
    const { manager, calls, setTime } = setup([
      { status: 200, body: tokenBody(1, 60) },
      { status: 200, body: tokenBody(2, 60) },
    ]);
    await manager.get();
    setTime(53_999);
    expect(await manager.get()).toBe('a1');
    expect(calls).toHaveLength(1);
    setTime(54_001);
    expect(await manager.get()).toBe('a2');
    expect(calls).toHaveLength(2);
    expect(calls[1]!.url).toBe(`${BASE}/auth/v3/token/refresh`);
  });

  it('invalid_refresh_token_relogs', async () => {
    const { manager, calls, setTime } = setup([
      { status: 200, body: tokenBody(1) },
      { status: 401, body: { code: 'invalid_refresh_token' } },
      { status: 200, body: tokenBody(3) },
    ]);
    await manager.get();
    setTime(3600_000 - 100_000);
    expect(await manager.get()).toBe('a3');
    expect(calls.map((c) => c.url)).toEqual([
      `${BASE}/auth/v3/token`,
      `${BASE}/auth/v3/token/refresh`,
      `${BASE}/auth/v3/token`,
    ]);
  });

  it('transient_refresh_failure_uses_old_token', async () => {
    const { manager, calls, setTime } = setup([
      { status: 200, body: tokenBody(1) },
      { status: 503 },
      { status: 200, body: tokenBody(2) },
    ]);
    await manager.get();
    const start = 3600_000 - 299_000;
    setTime(start);
    expect(await manager.get()).toBe('a1');
    expect(calls).toHaveLength(2);
    setTime(start + 29_999);
    expect(await manager.get()).toBe('a1');
    expect(calls).toHaveLength(2);
    setTime(start + 30_000);
    expect(await manager.get()).toBe('a2');
    expect(calls).toHaveLength(3);
    expect(calls[2]!.url).toBe(`${BASE}/auth/v3/token/refresh`);
  });

  it('login_error_hides_password', async () => {
    const { manager } = setup([
      { status: 401, body: { code: 'invalid_credentials', request_id: 'abc' } },
    ]);
    const err = await manager.get().then(
      () => null,
      (e: unknown) => e,
    );
    expect(err).toBeInstanceOf(NetgsmApiError);
    const e = err as NetgsmApiError;
    expect(e.api).toBe('identity');
    expect(e.operation).toBe('POST /auth/v3/token');
    expect(e.code).toBe('invalid_credentials');
    expect(e.requestId).toBe('abc');
    expect(e.retryable).toBe(false);
    expect(e.mayHaveBeenProcessed).toBe(false);
    expect(e.message).not.toContain('s3cret!');
    expect(JSON.stringify(e)).not.toContain('s3cret!');
  });

  it('invalidate_during_inflight_refresh_relogs', async () => {
    let t = 0;
    const calls: string[] = [];
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const json = (status: number, body: unknown) =>
      new Response(JSON.stringify(body), { status });
    const impl = async (input: RequestInfo | URL): Promise<Response> => {
      const url = String(input);
      calls.push(url);
      if (calls.length === 1) return json(200, tokenBody(1));
      if (url.endsWith('/refresh')) {
        await gate;
        return json(503, {});
      }
      return json(200, tokenBody(3));
    };
    const manager = new TokenManager({
      baseUrl: BASE,
      username: 'user',
      password: 's3cret!',
      scope: 'sms',
      fetch: impl as typeof fetch,
      now: () => t,
    });
    await manager.get();
    t = 3600_000 - 299_000;
    const pending = manager.get();
    await Promise.resolve();
    manager.invalidate('a1');
    release();
    expect(await pending).toBe('a3');
    expect(calls).toEqual([
      `${BASE}/auth/v3/token`,
      `${BASE}/auth/v3/token/refresh`,
      `${BASE}/auth/v3/token`,
    ]);
  });

  it('invalidate_only_stale', async () => {
    const { manager, calls } = setup([
      { status: 200, body: tokenBody(1) },
      { status: 200, body: tokenBody(2) },
    ]);
    await manager.get();
    manager.invalidate('eski');
    expect(await manager.get()).toBe('a1');
    expect(calls).toHaveLength(1);
    manager.invalidate('a1');
    expect(await manager.get()).toBe('a2');
    expect(calls).toHaveLength(2);
    expect(calls[1]!.url).toBe(`${BASE}/auth/v3/token`);
  });

  const mk = (fetchImpl: typeof fetch, now: () => number = () => 0) =>
    new TokenManager({
      baseUrl: BASE, username: 'user', password: 's3cret!', scope: 'sms', fetch: fetchImpl, now,
    });
  const jsonRes = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

  it('login_network_failure_is_identity_api_error', async () => {
    const m = mk((() => Promise.reject(new TypeError(`fetch failed ${BASE}/secret`))) as typeof fetch);
    const e = (await m.get().catch((x: unknown) => x)) as NetgsmApiError;
    expect(e).toBeInstanceOf(NetgsmApiError);
    expect(e).toMatchObject({
      api: 'identity', operation: 'POST /auth/v3/token', status: 0, code: 'NETWORK_ERROR',
      requestId: null, retryAfterSec: null, retryable: true, mayHaveBeenProcessed: false,
    });
    expect(e.message).toContain('network error: TypeError');
    expect(e.message).not.toContain('secret');
  });

  it('non_json_200_is_invalid_response', async () => {
    const m = mk((() => Promise.resolve(new Response('<html>', { status: 200 }))) as typeof fetch);
    const e = (await m.get().catch((x: unknown) => x)) as NetgsmApiError;
    expect(e).toBeInstanceOf(NetgsmApiError);
    expect(e).toMatchObject({ api: 'identity', code: 'INVALID_RESPONSE', status: 200, retryable: false });
  });

  it('missing_expires_in_is_invalid_response', async () => {
    for (const body of [
      { access_token: 'a', refresh_token: 'r' },
      { access_token: 'a', refresh_token: 'r', expires_in: -1 },
      { access_token: '', refresh_token: 'r', expires_in: 5 },
      { access_token: 'a', refresh_token: 5, expires_in: 5 },
    ]) {
      const m = mk((() => Promise.resolve(jsonRes(200, body))) as typeof fetch);
      const e = (await m.get().catch((x: unknown) => x)) as NetgsmApiError;
      expect(e).toMatchObject({ code: 'INVALID_RESPONSE', retryable: false });
    }
  });

  it('refresh_network_blip_keeps_valid_old_token_and_backs_off', async () => {
    let t = 0;
    const urls: string[] = [];
    const impl = ((input: RequestInfo | URL) => {
      const url = String(input);
      urls.push(url);
      if (urls.length === 1) return Promise.resolve(jsonRes(200, tokenBody(1)));
      if (url.endsWith('/refresh') && urls.length === 2) return Promise.reject(new TypeError('boom'));
      return Promise.resolve(jsonRes(200, tokenBody(2)));
    }) as typeof fetch;
    const m = mk(impl, () => t);
    await m.get();
    t = 3600_000 - 299_000;
    expect(await m.get()).toBe('a1');
    t += 29_999;
    expect(await m.get()).toBe('a1');
    expect(urls).toHaveLength(2);
    t += 1;
    expect(await m.get()).toBe('a2');
  });

  it('error_description_preferred_over_detail', async () => {
    const m = mk((() =>
      Promise.resolve(
        jsonRes(401, { code: 'invalid_credentials', error_description: 'Bad credentials', detail: 'Hatali' }),
      )) as typeof fetch);
    const e = (await m.get().catch((x: unknown) => x)) as NetgsmApiError;
    expect(e.message).toContain('Bad credentials');
    expect(e.message).not.toContain('Hatali');
    const m2 = mk((() => Promise.resolve(jsonRes(401, { code: 'x', detail: 'only detail' }))) as typeof fetch);
    const e2 = (await m2.get().catch((x: unknown) => x)) as NetgsmApiError;
    expect(e2.message).toContain('only detail');
  });
});
