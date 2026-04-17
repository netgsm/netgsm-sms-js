# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0] - 2026-04-17

### Added
- IYS (İleti Yönetim Sistemi) consent management module (`netgsm.iys`)
  - `queryConsent` — query consent status for a recipient
  - `saveConsents` — save or update consent records (batch supported)
  - `setWebhook` — register a webhook URL for consent updates
- Modular architecture: all SMS methods now available under `netgsm.sms`
- New IYS enums exported from package root: `IysRecipientType`, `IysAddressType`, `IysConsentStatus`, `IysSource`
- `SmsEncoding` enum for `encoding` field in `RestSmsPayload` (`DEFAULT=0`, `UNICODE=8`, `TR=11`)
- `IysFilter` enum for `iysfilter` field in `RestSmsPayload` (`NONE`, `COMMERCIAL_INDIVIDUAL`, `COMMERCIAL_MERCHANT`)
- `StatsErrorCode` added to package exports (was missing)
- `src/constants.ts` centralizing base URLs for all modules
- Integration tests for IYS module

### Changed
- Top-level methods (`sendRestSms`, `sendOtpSms`, `cancelSms`, `getReport`, `getStats`, `getHeaders`, `getInbox`, `checkBalance`) are now **deprecated** — they still work but will be removed in a future release. Use `netgsm.sms.*` equivalents instead.
- `getReport` request body now uses consistent spread pattern for optional fields
- `checkBalance` now handles JSON parse errors gracefully

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