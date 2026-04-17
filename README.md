# @netgsm/sms

[![npm version](https://img.shields.io/npm/v/@netgsm/sms.svg)](https://www.npmjs.com/package/@netgsm/sms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/netgsm/netgsm-sms-js/actions/workflows/ci.yml/badge.svg)](https://github.com/netgsm/netgsm-sms-js/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Downloads](https://img.shields.io/npm/dm/@netgsm/sms.svg)](https://www.npmjs.com/package/@netgsm/sms)

Official Node.js client for the Netgsm SMS API. This package enables you to easily use Netgsm SMS and IYS services in your Node.js applications.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
  - [SMS](#sms)
  - [IYS](#iys)
- [Migrating from 1.x](#migrating-from-1x)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Security](#security)
- [Contact](#contact)

## Features

- SMS sending (instant and scheduled)
- Bulk SMS sending (different messages for each recipient)
- OTP SMS
- SMS report and stats querying
- Message header listing
- Balance querying
- Inbox message listing
- Canceling scheduled SMS
- **IYS (İleti Yönetim Sistemi) consent management**
- TypeScript support
- Comprehensive error handling

## Requirements

- Node.js 14.0.0 or higher
- Netgsm account and API access

## Installation

Using NPM:

```bash
npm install @netgsm/sms
```

Using Yarn:

```bash
yarn add @netgsm/sms
```

## Quick Start

### CommonJS usage

```javascript
const { Netgsm } = require('@netgsm/sms');

const netgsm = new Netgsm({
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  appname: 'YOUR_APP_NAME' // Optional
});

async function sendSms() {
  try {
    const response = await netgsm.sms.send({
      msgheader: 'YOUR_HEADER',
      encoding: 'TR',
      messages: [
        { msg: 'Message content', no: '5XXXXXXXXX' }
      ]
    });

    console.log('SMS sent:', response.jobid);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### ES Modules / TypeScript usage

```typescript
import Netgsm from '@netgsm/sms';

const netgsm = new Netgsm({
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  appname: 'YOUR_APP_NAME' // Optional
});

async function sendSms() {
  try {
    const response = await netgsm.sms.send({
      msgheader: 'YOUR_HEADER',
      messages: [{ msg: 'Hello!', no: '5XXXXXXXXX' }]
    });

    console.log('SMS sent:', response.jobid);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Usage Examples

For more examples, check the [examples](./examples) directory:

- [Basic Usage](./examples/basic-usage.js)
- [Scheduled SMS](./examples/advanced/scheduled-sms.js)
- [Bulk SMS](./examples/advanced/bulk-sms.js)
- [Additional Examples](./examples/advanced/additional-examples.js)

## API Reference

### SMS

#### Configuration

```javascript
const netgsm = new Netgsm({
  username: 'YOUR_USERNAME', // Required
  password: 'YOUR_PASSWORD', // Required
  appname: 'YOUR_APP_NAME'   // Optional
});
```

#### Sending SMS

```javascript
const response = await netgsm.sms.send({
  msgheader: 'YOUR_HEADER',
  encoding: 'TR',              // TR, ASCII
  startdate: '010620241530',   // Optional (format: ddMMyyyyHHmm)
  stopdate: '010620241630',    // Optional (format: ddMMyyyyHHmm)
  messages: [
    { msg: 'Message content', no: '5XXXXXXXXX' },
    { msg: 'Message content', no: '5YYYYYYYYY' }
  ]
});
```

#### Sending OTP SMS

```javascript
const response = await netgsm.sms.sendOtp({
  msgheader: 'YOUR_HEADER',
  msg: 'OTP Message content', // Max 160 char
  no: '5XXXXXXXXX'
});
```

#### Querying SMS Report

```javascript
const report = await netgsm.sms.getReport({
  bulkIds: ['12345678'] // Job ID received after sending
});
```

#### Querying SMS Stats

```javascript
const stats = await netgsm.sms.getStats({
  jobid: '12345678' // Job ID received after sending
});
```

#### Checking Balance

```javascript
import { BalanceType } from '@netgsm/sms';

const balance = await netgsm.sms.checkBalance({
  stip: BalanceType.CREDIT // CREDIT or PACKAGE
});
```

#### Listing Headers

```javascript
const headers = await netgsm.sms.getHeaders();
```

#### Listing Inbox Messages

```javascript
const inbox = await netgsm.sms.getInbox({
  startdate: '01012024', // Start date (format: ddMMyyyy)
  stopdate: '31012024'   // End date (format: ddMMyyyy)
});
```

#### Canceling Scheduled SMS

```javascript
const result = await netgsm.sms.cancel({
  jobid: '12345678' // Job ID of the delivery to cancel
});
```

---

### IYS

IYS (İleti Yönetim Sistemi) consent management. Requires a brand code (`brandCode`) from your Netgsm account.

#### Querying Consent Status

```javascript
import { IysAddressType, IysRecipientType } from '@netgsm/sms';

const result = await netgsm.iys.queryConsent({
  brandCode: 123456,
  recipient: '+905XXXXXXXXX',
  type: IysAddressType.MESAJ,         // Optional: MESAJ, ARAMA, EPOSTA
  recipientType: IysRecipientType.BIREYSEL // Optional: BIREYSEL, TACIR
});
```

#### Saving Consent

```javascript
import { IysAddressType, IysConsentStatus, IysRecipientType, IysSource } from '@netgsm/sms';

const result = await netgsm.iys.saveConsents({
  brandCode: 123456,
  permissions: [
    {
      recipient: '+905XXXXXXXXX',
      recipientType: IysRecipientType.BIREYSEL,
      type: IysAddressType.MESAJ,
      source: IysSource.HS_MESAJ,
      status: IysConsentStatus.ONAY,
      consentDate: '2026-01-01 12:00:00' // Format: YYYY-MM-DD HH:mm:ss
    }
  ]
});
```

#### Registering a Webhook

```javascript
const result = await netgsm.iys.setWebhook({
  brandCode: 123456,
  webhookUrl: 'https://your-domain.com/iys-webhook'
});
```

---

## Migrating from 1.x

In 2.0.0, all methods moved to dedicated modules (`netgsm.sms` and `netgsm.iys`). The top-level methods from 1.x are still available but deprecated — they will be removed in a future major version.

| 1.x | 2.0 |
|---|---|
| `netgsm.sendRestSms(payload)` | `netgsm.sms.send(payload)` |
| `netgsm.sendOtpSms(payload)` | `netgsm.sms.sendOtp(payload)` |
| `netgsm.cancelSms(payload)` | `netgsm.sms.cancel(payload)` |
| `netgsm.getReport(payload)` | `netgsm.sms.getReport(payload)` |
| `netgsm.getStats(payload)` | `netgsm.sms.getStats(payload)` |
| `netgsm.getHeaders(payload)` | `netgsm.sms.getHeaders(payload)` |
| `netgsm.getInbox(payload)` | `netgsm.sms.getInbox(payload)` |
| `netgsm.checkBalance(payload)` | `netgsm.sms.checkBalance(payload)` |

## Development

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/netgsm/netgsm-sms-js.git
cd netgsm-sms-js

# Install dependencies
npm install

# Run tests
npm test

# Run integration tests (requires .env)
npm run test:integration

# Build the library
npm run build
```

## Contributing

If you want to contribute to this project, please review the [CONTRIBUTING.md](./CONTRIBUTING.md) file. All contributions are evaluated under the [Contributors Agreement](./CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for details.

## Security

For security vulnerabilities or concerns, please review the [SECURITY.md](./SECURITY.md) file and follow the specified steps.

## Contact

For technical support or questions about the SDK, please contact us at:

- Email: [teknikdestek@netgsm.com.tr](mailto:teknikdestek@netgsm.com.tr)
- Website: [https://www.netgsm.com.tr](https://www.netgsm.com.tr)

We're here to help you integrate Netgsm SMS services into your applications successfully.
