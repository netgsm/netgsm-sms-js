// Minimal stand-in for jest-fetch-mock: an injected fetch, never the network.
interface Call extends Array<unknown> {
  0: string;
  1: RequestInit | undefined;
}

export function createFetchMock() {
  type Queued = { body: string; init: ResponseInit } | { error: Error };
  let queue: Queued[] = [];
  let rejectWith: Error | undefined;
  const mock = { calls: [] as Call[] };

  const fetchImpl = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    mock.calls.push([String(input), init] as unknown as Call);
    if (rejectWith) return Promise.reject(rejectWith);
    const next = queue.shift();
    if (!next) return Promise.reject(new Error('fetchMock: unexpected request to ' + String(input)));
    if ('error' in next) return Promise.reject(next.error);
    return Promise.resolve(new Response(next.body, next.init));
  };

  return {
    fetch: fetchImpl as typeof fetch,
    mock,
    mockResponseOnce(body: string, init: ResponseInit = {}) {
      queue.push({ body, init });
    },
    mockReject(error: Error) {
      rejectWith = error;
    },
    resetMocks() {
      queue = [];
      rejectWith = undefined;
      mock.calls = [];
    },
  };
}
