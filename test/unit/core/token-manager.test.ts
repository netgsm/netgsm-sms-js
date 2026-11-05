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
});
