export const MOCK_USER = '8500000000';
export const MOCK_PASS = 'password001';
export const MOCK_SENDER = 'MOCKTEST';

export function mockUrl(): string {
  const url = process.env.NETGSM_MOCK_URL;
  if (!url) throw new Error('NETGSM_MOCK_URL is not set (run via npm run test:mock)');
  return url;
}

async function control(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(mockUrl() + path, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function resetMock(): Promise<void> {
  const r = await control('/__mock/reset', { method: 'POST' });
  if (!r.ok) throw new Error(`mock reset failed: ${r.status}`);
}

export async function setScenario(body: Record<string, unknown>): Promise<void> {
  const r = await control('/__mock/scenario', { method: 'POST', body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`mock scenario failed: ${r.status} ${await r.text()}`);
}

export async function getScenarios(): Promise<unknown> {
  return (await control('/__mock/scenario')).json();
}
