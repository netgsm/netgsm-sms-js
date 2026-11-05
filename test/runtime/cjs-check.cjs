'use strict';
// Node's built-in fetch (undici) needs Buffer internally. To prove the SDK itself is Buffer-free,
// the injected fetch restores Buffer only while undici runs and hands back a fully-read Response-shaped object.
const NodeBuffer = globalThis.Buffer;
const realFetch = globalThis.fetch;
delete globalThis.Buffer;
if (typeof globalThis.Buffer !== 'undefined') throw new Error('Buffer still defined');

async function bufferedFetch(input, init) {
  globalThis.Buffer = NodeBuffer;
  try {
    const res = await realFetch(input, init);
    const { ok, status, statusText, headers } = res;
    const text = await res.text();
    // A real Response body read needs Buffer too, so hand back a plain Response-shaped object.
    return { ok, status, statusText, headers, text: async () => text, json: async () => JSON.parse(text) };
  } finally {
    delete globalThis.Buffer;
  }
}

// Package self-reference through "exports"; no relative fallback.
const { Netgsm, NetgsmApiError } = require('@netgsm/sms');

(async () => {
  const sms = new Netgsm({
    username: '8500000000',
    password: 'password001',
    baseUrl: process.env.NETGSM_MOCK_URL,
    fetch: bufferedFetch,
  }).sms;
  const r = await sms.send({
    sender: 'MOCKTEST',
    messages: [{ text: 'cjs', recipient: '905551112233' }],
  });
  if (!r.jobId || typeof NetgsmApiError !== 'function') throw new Error('unexpected result');
  if (typeof globalThis.Buffer !== 'undefined') throw new Error('Buffer was re-introduced');
  console.log('CJS_OK ' + r.jobId);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
