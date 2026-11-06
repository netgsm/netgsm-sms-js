# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - Unreleased

Pre-release `2.0.0-beta.0` is published on the npm `next` tag: `npm install @netgsm/sms@next`.

Rewrite for the new Netgsm APIs. Upgrading is non-breaking for 1.x JavaScript code: the 1.x methods
keep working as a deprecated layer against the legacy API. See [MIGRATION.md](./MIGRATION.md).

### Breaking
- Requires Node.js 20 or later (1.x supported Node 14); npm warns on older Node; yarn 1 or npm with
  engine-strict refuse to install.
- TypeScript only: `ReportResponse` and `StatsResponse` now name the v3 types. The 1.x shapes are
  `LegacyReportResponse` and `LegacyStatsResponse`.
- A missing or invalid `username`/`password`, or a 2.x option name (`baseUrl`, `fetch`, `now`,
  `maxRetryAfterSec`, ...) present in your config with an invalid value, now throws a `TypeError`
  (still an `Error`).
- With `node --throw-deprecation`, the first call to each deprecated method crashes the process:
  Node throws the DeprecationWarning as an uncaught exception on the next tick, after the request has
  been started, so it cannot be caught around the call. Set `process.noDeprecation = true` (it takes
  precedence) or drop the flag.
- Undocumented instance internals (`config`, `headers`, `baseURL`) are gone;
  `JSON.stringify(netgsm)` now returns `{ baseUrl }`.

### Deprecated
- The eight 1.x methods `sendRestSms`, `sendOtpSms`, `cancelSms`, `getReport`, `getStats`,
  `getHeaders`, `getInbox` and `checkBalance`. They behave as in 1.x (legacy API, same response and
  error shapes), print a one-time `DeprecationWarning` and are removed in 3.0.0. Replacements are
  in MIGRATION.md.
- The `appname` client option, which only the deprecated methods use.
- With a `baseUrl` other than `NetgsmEnvironment.LIVE` (sandbox or mock), the deprecated methods
  reject without making a request: they always use the live legacy API, which has no sandbox or mock.

### Added
- New client for the Identity (`/auth/v3`), SMS (`/sms/v3`) and İYS (`/iys/v1`) APIs on
  `ext-api.netgsm.com.tr`, under `netgsm.sms` and `netgsm.iys`, with v3 field names, automatic token
  handling and a `NetgsmApiError` error model (`code`, `requestId`, `retryable`,
  `mayHaveBeenProcessed`). Accessing `netgsm.sms` / `netgsm.iys` in a browser throws unless
  `dangerouslyAllowBrowser: true`.
- Types-first `exports` conditions. The `@netgsm/sms/enums` subpath, the ESM and CommonJS builds
  and zero runtime dependencies are kept from 1.x, as are the 1.x enums.
- Every SMS API v3 operation: send, template send, OTP, directory send, cancel, report, stats,
  inbox, senders, default sender, report and inbox webhooks, blacklist, length, templates, balance.
- İYS API v1: `iys.saveConsents`, `iys.searchConsents`, `iys.saveWebhook`.
- Helpers: `findBalance`, `parseCredit`, `webhookToReport`, `webhookOperator`,
  `formatIysDate`, `toIysRecipient`, `maskRecipient`, and the `NetgsmEnvironment` constants
  (live and sandbox).
- Runnable examples in `examples/` that default to the local mock.

## [1.1.11] - 2025-12-26

### Added
- Support for OTP SMS
- Support for SMS Stats
- Enumaration for Method Codes

### Fixed
- SMS reports status for BLACKLISTED
- Balan example in README

## [1.1.2] - 2025-02-27

### Added
- Support for `appkey` parameter in `checkBalance` method

### Fixed
- Syntax errors in integration tests

## [1.1.1] - 2025-02-27

### Changed
- Documentation improvements
- Updated type definitions

## [1.1.0] - 2025-02-26

### Added
- REST v2 API support
- `sendRestSms` method
- `getReport` method
- `getHeaders` method
- `getInbox` method
- `cancelSms` method
- `checkBalance` method

## [1.0.1] - 2025-02-25

### Fixed
- Error handling in SMS sending
- TypeScript type definitions

## [1.0.0] - 2025-02-24

### Added
- Initial release
- Basic SMS sending functionality
- TypeScript support 