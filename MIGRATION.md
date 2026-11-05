# Migrating from 1.x to 2.0

Version 2.0 is a rewrite, not an upgrade. The 1.x line talks to the legacy REST API
(`api.netgsm.com.tr`, `/sms/rest/v2/*`). Version 2.0 talks to the new APIs: Identity (`/auth/v3`), SMS
(`/sms/v3`) and İYS (`/iys/v1`) on `ext-api.netgsm.com.tr`. Method names, request fields, response
shapes and error handling all change, so plan to touch every call site.

**Status of 1.x.** 1.x targets the legacy API and receives no new features. Move to 2.x to use the
new APIs.

Also new in 2.0: Node.js 20 or later is required (1.x supported Node 14), the package ships ESM and
CommonJS builds, and it has zero runtime dependencies.

## The client

```ts
// 1.x
const netgsm = new Netgsm({ username, password, appname: 'my-app' });
await netgsm.sendRestSms({ /* ... */ });

// 2.x
const netgsm = new Netgsm({ username, password });
await netgsm.sms.send({ /* ... */ });
```

- API methods live under `netgsm.sms` (SMS API v3) and `netgsm.iys` (İYS API v1).
- The 1.x client-level `appname` option is gone. Pass `appName` per call where the API accepts it
  (`sms.send`, `sms.sendTemplate`, `sms.sendOtp`).
- New options: `baseUrl`, `scope`, `enterpriseOtp`, `iysBrandCode`, `maxRetryAfterSec`, `fetch`,
  `now`, `dangerouslyAllowBrowser`. See the README.
- The default base URL is the live `https://ext-api.netgsm.com.tr`. Use `NetgsmEnvironment.SANDBOX`
  or the local mock while you migrate; see the README's Environments table.
- The 1.x enums (`SendSmsErrorCode`, `BalanceType`, report status enums and so on) are not exported
  any more. Statuses and reasons are string unions (`'DELIVERED'`, `'INSUFFICIENT_CREDIT'`, ...).

## Authentication

1.x sent HTTP Basic credentials on every request (and username and password in the body of
`checkBalance`). 2.x logs in to `/auth/v3/token` itself, keeps the access token, refreshes it before
it expires and re-logs in once on a `401`. You only pass `username` and `password`; there is nothing
to configure and no token to handle.

## Method mapping

| 1.x | 2.x | Notes |
|---|---|---|
| `sendRestSms` | `sms.send` | See [Send](#send). |
| `sendOtpSms` | `sms.sendOtp` | `msgheader` -> `sender`, `msg` -> `text`, `no` -> `recipient`. Returns `{ jobId }`. |
| `cancelSms` | `sms.cancel` | `{ jobid }` -> `{ jobId }`. Returns `{ jobId, cancelledAt }`. |
| `getReport` | `sms.getReport` | `bulkIds` -> `jobIds`; see [Reports](#reports-stats-and-inbox). |
| `getStats` | `sms.getStats` | `jobid` -> `jobId`; `senddate` -> `month` (`yyyy-MM`). |
| `getHeaders` | `sms.listSenders` | Returns `{ count, senders }`; each sender has `name`, `type`, `brandCode`, `usable`, `reason`. |
| `getInbox` | `sms.getInbox` | `startdate` / `stopdate` -> `startAt` / `stopAt` (ISO-8601 with offset). |
| `checkBalance` | `sms.getBalance` | `stip` stays (`1`, `2`, `3`); new optional `service`; `appkey` is gone. |
| (none) | `sms.sendTemplate`, `sms.sendToDirectory`, `sms.getDefaultSender`, `sms.setDefaultSender`, `sms.registerReportWebhook`, `sms.deleteReportWebhook`, `sms.registerInboxWebhook`, `sms.deleteInboxWebhook`, `sms.getBlacklist`, `sms.measureLength`, `sms.listTemplates` | New in the v3 API. |
| (none) | `iys.saveConsents`, `iys.searchConsents`, `iys.saveWebhook` | İYS API v1. |

### Send

```ts
// 1.x
await netgsm.sendRestSms({
  msgheader: 'YOUR_HEADER',
  encoding: 'TR',
  startdate: '010620241530', // ddMMyyyyHHmm
  messages: [{ msg: 'Hello', no: '5XXXXXXXXX' }],
});

// 2.x
await netgsm.sms.send({
  sender: 'YOUR_HEADER',
  encoding: 'TURKISH',
  startAt: '2024-06-01T15:30:00+03:00', // ISO-8601 with offset
  messages: [{ text: 'Hello', recipient: '905XXXXXXXXX' }],
});
```

| 1.x field | 2.x field | Notes |
|---|---|---|
| `msgheader` | `sender` | Matched exactly, case-sensitive. |
| `messages[].msg` | `messages[].text` | |
| `messages[].no` | `messages[].recipient` | Written `90XXXXXXXXXX` (12 digits) in the v3 API. |
| `encoding: 'TR'` | `encoding: 'TURKISH'` | v3 accepts `'DEFAULT'`, `'TURKISH'` and `'UNICODE'`. For any other 1.x value, check the API documentation for the closest v3 value instead of assuming. |
| `startdate` (`ddMMyyyyHHmm`) | `startAt` | ISO-8601 with a UTC offset, for example `2026-08-31T09:00:00+03:00`. |
| `stopdate` (`ddMMyyyyHHmm`) | `stopAt` | Same format as `startAt`. |
| `iysfilter` | `iysFilter` | Values are `'NONE'`, `'BRAND'`, `'RETAILER'` or `'BRAND_AND_RETAILER'`. Choose `BRAND`, `RETAILER` or `BRAND_AND_RETAILER` according to your account's İYS registration. The mapping of the legacy `iysfilter` values (such as `"11"` and `"12"`) is being confirmed and will be added here. Do not guess it for a production sender. |
| `partnercode` | `partnerCode` | |
| `appname` | `appName` | |
| (none) | `referenceId` | New: echoed in reports and webhooks. |

The 1.x response was `{ code, description, jobid }`. 2.x returns `{ jobId, status, accepted, rejected,
rejectedItems, rejectedItemsTruncated, referenceId }`. A send with some invalid recipients still
succeeds; read `rejectedItems` (at most 100 entries, see `rejectedItemsTruncated`).

### Reports, stats and inbox

- `getReport`: `bulkIds` -> `jobIds`, `startdate` / `stopdate` -> `startAt` / `stopAt`,
  `pageNumber` -> `page`. `pageSize` has no 2.x counterpart. The response is
  `{ count, page, reports }`; entries are `{ jobId, number, status, operator, messageLength,
  deliveredAt, failReason, referenceId }`. `status` is now `'PENDING'`, `'DELIVERED'` or
  `'NOT_DELIVERED'` (1.x returned numeric codes), `operator` and `failReason` are names, and 1.x
  `referansID` is `referenceId` (webhook payloads still use `referansID`).
- `getStats`: the response is `{ jobId, month, count, stats }`.
- `getInbox`: the response is `{ count, messages, truncated }`; a message has `id`, `jobId`, `sender`,
  `text`, `operator`, `receivedAt`.
- `getBalance`: with `stip: 2` you get `{ code: '00', balance, type }` (the `code` is part of that
  response shape); the default returns `{ balance: [{ amount, balance_name }] }`. Use `findBalance` and
  `parseCredit` for values such as `"92,150"`.

## Error model

1.x resolved or rejected based on a `code` field in a (usually HTTP 200) body, where `code: "00"`
meant success, and threw plain objects (`{ status, code, description }`).

2.x relies on HTTP status codes: a successful call resolves with the response body, and there is
no `code: "00"` to check. Every failure rejects with a `NetgsmApiError`:

```ts
import { NetgsmApiError } from '@netgsm/sms';

try {
  await netgsm.sms.send(request);
} catch (err) {
  if (err instanceof NetgsmApiError) {
    err.status; // HTTP status, 0 when no response arrived
    err.code; // API error code, or NETWORK_ERROR / INVALID_RESPONSE
    err.requestId; // quote it to support
    err.retryable;
    err.mayHaveBeenProcessed; // true: do not resend a send, check sms.getReport first
  }
}
```

- The numeric 1.x codes (`"20"`, `"30"`, ...) are replaced by named codes such as
  `INSUFFICIENT_CREDIT` or `REJECTED_HEADER`.
- 1.x did not retry. 2.x retries only where it is safe (see the README's Error handling section) and
  never retries a send after a possibly-processed failure.
- Argument problems throw `TypeError` / `RangeError` before any request is made.

## Checklist

1. Upgrade to Node.js 20 or later.
2. `npm install @netgsm/sms@2`.
3. Replace `sendRestSms` and the other methods using the table above; convert dates to ISO-8601 with
   offset and numbers to `90XXXXXXXXXX`.
4. Replace `code === '00'` checks with `try` / `catch` on `NetgsmApiError`.
5. Run against the local mock or the sandbox, then go live.
6. Decide your `iysFilter` per the note in the table above.
