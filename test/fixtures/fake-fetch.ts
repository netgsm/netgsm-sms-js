export interface FakeResponse {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface FakeCall {
  url: string;
  method: string;
  /** Header names are normalized to lowercase, e.g. `calls[0].headers['authorization']`. */
  headers: Record<string, string>;
  /** Parsed JSON when the request body is a JSON string, otherwise the raw body. */
  body: unknown;
}

/**
 * Queue-based fake `fetch`. Each call consumes the next response; when the queue is exhausted the
 * returned promise rejects so the test fails loudly.
 */
export function fakeFetch(responses: FakeResponse[]): { fetch: typeof fetch; calls: FakeCall[] } {
  const queue = [...responses];
  const calls: FakeCall[] = [];

  const fakeImpl = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const headers: Record<string, string> = {};
    new Headers(init?.headers).forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
    let body: unknown = init?.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // keep the raw string
      }
    }
    calls.push({ url, method: init?.method ?? 'GET', headers, body });

    const next = queue.shift();
    if (!next) return Promise.reject(new Error(`fakeFetch: unexpected request to ${url}`));
    const payload =
      next.body === undefined
        ? null
        : typeof next.body === 'string'
          ? next.body
          : JSON.stringify(next.body);
    return Promise.resolve(
      new Response(next.status === 204 ? null : payload, {
        status: next.status,
        headers: next.headers,
      }),
    );
  };

  return { fetch: fakeImpl as typeof fetch, calls };
}
