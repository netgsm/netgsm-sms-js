# @netgsm/sms

[![npm version](https://img.shields.io/npm/v/@netgsm/sms.svg)](https://www.npmjs.com/package/@netgsm/sms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/netgsm/netgsm-sms-js/actions/workflows/ci.yml/badge.svg)](https://github.com/netgsm/netgsm-sms-js/actions/workflows/ci.yml)

Official JavaScript / TypeScript client for the Netgsm SMS API v3 (`/sms/v3`) and İYS API v1
(`/iys/v1`), with automatic token handling (`/auth/v3`).

- Zero runtime dependencies; ESM and CommonJS builds with bundled types.
- Node.js 20 or later. Uses only `fetch`, so it also runs on Bun, Deno and Cloudflare Workers.
- One method per API operation, typed after the API specification (field names are the API's own).
- Coming from 1.x? Read [MIGRATION.md](./MIGRATION.md). Version 2 targets a different API and is a
  breaking change.

## Server-side only

Your Netgsm username and password must never reach a browser or mobile app. The client throws when
it detects a browser (`window` or `document` present, except Deno). If you accept that risk, for
example in a controlled Electron app, pass `dangerouslyAllowBrowser: true`. Otherwise call Netgsm from
your backend only.

## Installation

```bash
npm install @netgsm/sms
```

## Quick start

```ts
import { Netgsm } from '@netgsm/sms';

const netgsm = new Netgsm({
  username: process.env.NETGSM_USERNAME!,
  password: process.env.NETGSM_PASSWORD!,
});

const sent = await netgsm.sms.send({
  sender: 'YOUR_SENDER',
  messages: [{ text: 'Hello from Netgsm', recipient: '905XXXXXXXXX' }],
});
console.log(sent.jobId, sent.status, sent.accepted, sent.rejected);
```

CommonJS works too: `const { Netgsm } = require('@netgsm/sms');`

Recipients use the SMS API format `90XXXXXXXXXX` (12 digits). The token is fetched on the first
request, cached, refreshed before it expires and renewed once on a `401`; you never handle it.

### Client options

| Option | Default | Meaning |
|---|---|---|
| `username`, `password` | required | Your Netgsm API credentials. |
| `baseUrl` | `NetgsmEnvironment.LIVE` | API address; a trailing `/` is trimmed. See [Environments](#environments). |
| `scope` | `'sms'` | Token scope. |
| `enterpriseOtp` | `false` | Sends `x-client: enterprise` on `sms.sendOtp` (enterprise OTP accounts only). |
| `iysBrandCode` | none | Default İYS brand code for `iys.*` calls. |
| `maxRetryAfterSec` | `60` | Longest `Retry-After` the client will wait for. |
| `fetch`, `now` | global `fetch`, `Date.now` | Injectable for tests and custom transports. |
| `dangerouslyAllowBrowser` | `false` | See [Server-side only](#server-side-only). |

## Environments

Develop against the local mock first, then the sandbox, then go live:

| Stage | Address | Description |
|---|---|---|
| 1. Local mock | `http://127.0.0.1:4010` | No subscription needed, sends no SMS. For development, automated tests and error scenarios. |
| 2. Sandbox | `https://ext-sandbox.netgsm.com.tr` | Real network and token flow with demo accounts; sends no SMS, free of charge. |
| 3. Live | `https://ext-api.netgsm.com.tr` | Real, paid sends with your own credentials. The default. |

```ts
import { Netgsm, NetgsmEnvironment } from '@netgsm/sms';

const sandbox = new Netgsm({
  username: process.env.NETGSM_USERNAME!,
  password: process.env.NETGSM_PASSWORD!,
  baseUrl: NetgsmEnvironment.SANDBOX, // or 'http://127.0.0.1:4010' for the local mock
});
```

The local mock is part of the [Netgsm agent skills](https://github.com/netgsm/skills) and is also
vendored in this repository: `node test/fixtures/netgsm-sms-mock.mjs --port 4010`. Its public test
account is `8500000000` / `password001` with sender `MOCKTEST`.

**İYS has no sandbox and no mock.** Every `iys.*` call goes to the live İYS registry, where saved
consents are legal records that cannot be edited or deleted. Never test İYS with real numbers or
made-up records.

## Sending messages

```ts
import { Netgsm } from '@netgsm/sms';

const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

// Many recipients, each with its own text, in ONE request (up to 1,000,000 messages).
const sent = await netgsm.sms.send({
  sender: 'YOUR_SENDER',
  messages: [
    { text: 'Hello Ayşe', recipient: '905XXXXXXXXX' },
    { text: 'Hello Mehmet', recipient: '905YYYYYYYYY' },
  ],
  encoding: 'TURKISH', // 'DEFAULT' | 'TURKISH' | 'UNICODE'
  iysFilter: 'NONE', // 'NONE' | 'BRAND' | 'RETAILER' | 'BRAND_AND_RETAILER'
  startAt: '2026-12-01T09:00:00+03:00', // optional scheduled start, ISO-8601 with offset
  referenceId: 'order-1234', // echoed in reports and webhooks
});

// Invalid entries do not stop the job; they are listed here (at most 100).
for (const item of sent.rejectedItems) console.log(item.index, item.reason);

// Cancel a scheduled job (status 'SCHEDULED'); jobs that are already QUEUED cannot be cancelled.
await netgsm.sms.cancel({ jobId: sent.jobId });
```

Send many recipients in one request instead of one request per recipient: limits count requests,
not messages. Use `sms.sendOtp` for one-time codes, `sms.sendTemplate` for template messages,
`sms.sendToDirectory` for directory groups, and `sms.measureLength` to check length and parts.

```ts
import { Netgsm } from '@netgsm/sms';

const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

const { jobId } = await netgsm.sms.sendOtp({
  sender: 'YOUR_SENDER',
  recipient: '905XXXXXXXXX',
  text: 'Your verification code is 123456',
});
```

Other operations: `getReport`, `getStats`, `getInbox`, `listSenders`, `getDefaultSender`,
`setDefaultSender`, `registerReportWebhook`, `deleteReportWebhook`, `registerInboxWebhook`,
`deleteInboxWebhook`, `getBlacklist`, `listTemplates`, `getBalance`. Request and response types are
exported from the package (`SmsSendRequest`, `SmsSendResponse`, ...).

## Reports

```ts
import { Netgsm } from '@netgsm/sms';

const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

const { reports } = await netgsm.sms.getReport({ jobIds: ['YOUR_JOB_ID'] });
for (const r of reports) console.log(r.status, r.failReason, r.operator);
```

`GET /report` is limited per account and per `jobId`, and new results can take a few minutes to
appear. For production, register a [report webhook](#webhooks) instead of polling.

## Error handling

Every failed API call rejects with a `NetgsmApiError`. It never contains credentials, tokens or
recipient numbers, so it is safe to log.

```ts
import { Netgsm, NetgsmApiError } from '@netgsm/sms';

const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

try {
  await netgsm.sms.send({
    sender: 'YOUR_SENDER',
    messages: [{ text: 'Hello', recipient: '905XXXXXXXXX' }],
  });
} catch (err) {
  if (!(err instanceof NetgsmApiError)) throw err;
  console.error(err.code, err.status, err.requestId); // include requestId when you contact support
  if (err.mayHaveBeenProcessed) {
    // The job may already be queued. Do NOT resend: check sms.getReport first.
  } else if (err.retryable) {
    // Safe to retry later, honoring err.retryAfterSec when it is set.
  }
  for (const item of err.rejectedItems ?? []) console.error(item.index, item.reason);
}
```

| Field | Meaning |
|---|---|
| `api` | `'identity'`, `'sms'` or `'iys'`: which API answered. |
| `operation` | For example `POST /sms/v3/send`. |
| `status` | HTTP status; `0` when no response arrived. |
| `code` | The API's error code (for example `INSUFFICIENT_CREDIT`, `REJECTED_HEADER`, `NO_DELIVERABLE_MESSAGES`), or one of the client codes below. |
| `requestId` | The request id to quote to support; `null` when no response arrived. |
| `retryable` | Whether repeating the same request later can succeed. |
| `retryAfterSec` | The `Retry-After` value, or `null`. |
| `mayHaveBeenProcessed` | `true` when the API may have accepted the request despite the failure. |
| `rejectedItems` | Recipients refused by a 422 `NO_DELIVERABLE_MESSAGES`. |

Client-side codes: `NETWORK_ERROR` (no usable HTTP response: connection failure, timeout) and
`INVALID_RESPONSE` (a response that does not match the API contract). Both set
`mayHaveBeenProcessed` to `true` for requests other than `GET`, because the server may have acted
before the answer was lost.

**Never blindly resend a batch send when `mayHaveBeenProcessed` is `true`.** Requests are not
deduplicated: a second `send` creates a second job and your recipients get the message twice. Check
`sms.getReport` for the period (`startAt` / `stopAt`) first to see whether the job already exists. The client
itself never retries a send after a possibly-processed failure; it only re-logins once on a `401`,
waits once for a `Retry-After` of at most `maxRetryAfterSec` on a `429`, and backs off on `503` for
requests that are safe to repeat.

Invalid arguments (for example a malformed `baseUrl` or an out-of-range `chunkSize`) throw
`TypeError` or `RangeError` before any request is made.

## Balance

Query the balance once before a campaign, not in a loop: `GET /balance` is limited to 60 requests
per minute per account and answers are cached for 10 seconds, so polling gains nothing.

```ts
import { Netgsm, findBalance, parseCredit } from '@netgsm/sms';

const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

const { balance } = await netgsm.sms.getBalance(); // entries by type
const smsCount = findBalance(balance, 'Adet SMS'); // number | null

const summary = await netgsm.sms.getBalance({ stip: 2 }); // one-line summary
const credit = parseCredit(summary.balance); // "92,150" -> 92.15
```

The API returns credit as a string with a decimal comma; `parseCredit` and `findBalance` convert it
and return `null` for anything unreadable.

## Webhooks

Register an address and Netgsm posts delivery reports (and incoming messages) to it.

```ts
import { Netgsm } from '@netgsm/sms';

const netgsm = new Netgsm({ username: process.env.NETGSM_USERNAME!, password: process.env.NETGSM_PASSWORD! });

await netgsm.sms.registerReportWebhook({
  url: 'https://example.com/netgsm/report',
  headers: 'X-Webhook-Secret: change-me', // sent with every call; use it to verify the sender
});
```

Report webhooks carry numeric codes, while `GET /report` returns names. `webhookToReport` translates
a webhook entry to the report vocabulary:

```ts
import { webhookToReport } from '@netgsm/sms';
import type { ReportWebhookPayload } from '@netgsm/sms';

export function handleReportWebhook(payload: ReportWebhookPayload): void {
  for (const entry of payload.numbers) {
    const { status, failReason, operator } = webhookToReport(entry);
    console.log(entry.jobid, entry.referansID, status, failReason, operator);
  }
}
```

Any `2xx` answer counts as delivered, and failed deliveries to your address are **not** resent: answer
quickly, and fill gaps with `sms.getReport`. See
[`examples/report-webhook-handler.mjs`](./examples/report-webhook-handler.mjs) for a runnable receiver.

## İYS (consent management)

`netgsm.iys` stores and queries İYS consents. These are **legal records on the live İYS registry**
and there is no sandbox: send only consents (or rejections) that were really obtained, and always
inspect `rejected` in the result.

Every İYS call needs your brand code, either as `iysBrandCode` in the client options or as
`brandCode` on the call. Phone numbers use the İYS format `+90XXXXXXXXXX` (not the SMS `90...`
format; `toIysRecipient` converts).

```ts
import { Netgsm, formatIysDate } from '@netgsm/sms';

const netgsm = new Netgsm({
  username: process.env.NETGSM_USERNAME!,
  password: process.env.NETGSM_PASSWORD!,
  iysBrandCode: 123456, // your İYS brand code
});

// Save consents the recipients really gave (1-500 records per call).
const saved = await netgsm.iys.saveConsents([
  {
    recipient: '+905XXXXXXXXX',
    recipientType: 'BIREYSEL',
    type: 'MESAJ',
    source: 'HS_WEB',
    status: 'ONAY',
    consentDate: formatIysDate(new Date()), // the moment the consent was given
  },
]);
for (const item of saved.rejected) console.error(item.index, item.field, item.message);

// Query consents; only status === 'ONAY' means the recipient consented.
const consents = await netgsm.iys.searchConsents(
  [{ recipient: '+905XXXXXXXXX', recipientType: 'BIREYSEL', type: 'MESAJ' }],
  { chunkSize: 100 },
);
console.log(consents[0]?.status, consents[0]?.errorCode);
```

`searchConsents` splits the queries into requests of `chunkSize` (default 100, at most 1000) and
returns results in input order. The queries travel in the URL of a `GET`, so a large `chunkSize`
builds long URLs: lower it if a proxy or gateway rejects long URLs. Per-record `errorCode` is `0` on
success and `81` when no consent record exists.

`iys.saveWebhook(webhookUrl)` registers the İYS webhook address for the brand; it
replaces the brand's previous address and changes the live account setting.

## Agent skills and documentation

- Netgsm agent skills (for AI coding assistants), with the local mock: https://github.com/netgsm/skills
- Official API documentation: https://api-docs.netgsm.com.tr/
- Knowledge base: https://bilgibankasi.netgsm.com.tr/

## Examples

Runnable examples are in [`examples/`](./examples). They read `NETGSM_USERNAME` and
`NETGSM_PASSWORD` from the environment and default to the local mock, so they never hit the live API
by accident. After `npm run build`:

```bash
node test/fixtures/netgsm-sms-mock.mjs --port 4010 --quiet &
node examples/send.mjs
```

See [`.env.example`](./.env.example) for the variables.

## Development

```bash
npm test               # unit tests
npm run test:mock      # builds, then runs the end-to-end tests against the local mock
npm run lint
npm run typecheck      # also compiles every code block of this README
```

See [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md) and
[CHANGELOG.md](./CHANGELOG.md).

## Support

Include the `requestId` from the error when you contact Netgsm technical support. Account and
process questions are covered in the knowledge base linked above.

## License

MIT, see [LICENSE](./LICENSE).
