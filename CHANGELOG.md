# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.1.11 (2025-12-26)


### Features

* **ci:** add CodeQL security analysis ([97273d6](https://github.com/netgsm/netgsm-sms-js/commit/97273d6662302d9608e92e89942b2af2d0069810))
* **ci:** enhance CI workflow with CodeQL analysis ([62c17ea](https://github.com/netgsm/netgsm-sms-js/commit/62c17eabe2b1b23d4a13a4b59655a0d8d800b7bd))
* improve ES modules support and refactor report API ([cccb42f](https://github.com/netgsm/netgsm-sms-js/commit/cccb42f060b2c96938f5c9797d19ae1c620dfd06))


### Bug Fixes

* **ci:** remove npm cache configuration ([7fbda96](https://github.com/netgsm/netgsm-sms-js/commit/7fbda96dacbbafded332f5a4b3baf622cebbacc8))
* place .mjs files in dist/ root for proper ES modules support ([b64f2f7](https://github.com/netgsm/netgsm-sms-js/commit/b64f2f7d641872c32a992e7f0f7979ed07df79cd))
* remove unused imports and fix lint errors ([995becf](https://github.com/netgsm/netgsm-sms-js/commit/995becf1f3cdb034bde51397a88374c0aa4a293d))

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