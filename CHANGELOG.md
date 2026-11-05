# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0] - 2026-11-05

Complete rewrite for the new Netgsm APIs. See [MIGRATION.md](./MIGRATION.md) for the 1.x to 2.x
mapping.

### Breaking
- Targets the new Identity (`/auth/v3`), SMS (`/sms/v3`) and İYS (`/iys/v1`) APIs on
  `ext-api.netgsm.com.tr` instead of the legacy REST v2 API. The 1.x line targets the legacy API
  and receives no new features.
- New client shape: methods live under `netgsm.sms` and `netgsm.iys` (for example
  `sendRestSms` is now `sms.send`), with the v3 field names (`sender`, `text`, `recipient`,
  `startAt`, ...).
- New error model: HTTP status based `NetgsmApiError` with `code`, `requestId`, `retryable` and
  `mayHaveBeenProcessed`; there is no `code: "00"` success check.
- Authentication is automatic: the client fetches, caches and refreshes access tokens.
- Requires Node.js 20 or later (1.x supported Node 14). The 1.x enums are no longer exported.
- The client throws in a browser unless `dangerouslyAllowBrowser: true` is set.

### Added
- ESM and CommonJS builds with bundled type definitions; zero runtime dependencies.
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