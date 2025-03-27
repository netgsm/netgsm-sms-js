# @netgsm/sms

[![npm version](https://img.shields.io/npm/v/@netgsm/sms.svg)](https://www.npmjs.com/package/@netgsm/sms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/netgsm/netgsm-sms-js/actions/workflows/ci.yml/badge.svg)](https://github.com/netgsm/netgsm-sms-js/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Downloads](https://img.shields.io/npm/dm/@netgsm/sms.svg)](https://www.npmjs.com/package/@netgsm/sms)

Official Node.js client for the Netgsm SMS API. This package enables you to easily use Netgsm SMS services in your Node.js applications.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Security](#security)
- [Contact](#contact)

## Features

- SMS sending (instant and scheduled)
- Bulk SMS sending (different messages for each recipient)
- SMS report querying
- Message header listing
- Balance querying
- Inbox message listing
- Canceling scheduled SMS
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
const { Netgsm, SmsStatus, BalanceType } = require('@netgsm/sms');

// Configure Netgsm client
const netgsm = new Netgsm({
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  appname: 'YOUR_APP_NAME' // Optional
});

// Send SMS
async function sendSms() {
  try {
    const response = await netgsm.sendRestSms({
      msgheader: 'YOUR_HEADER', // SMS header
      encoding: 'TR', // Turkish character support
      startdate: '010620241530',       // Optional (format: ddMMyyyyHHmm)
      stopdate: '010620241630',        // Optional (format: ddMMyyyyHHmm)
      messages: [
        { msg: 'Message content', no: '5XXXXXXXXX' },
        { msg: 'Message content', no: '5YYYYYYYYY' }
      ]
    });
    
    console.log('SMS sent:', response);
    return response.jobid;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function
sendSms();
```

### ES Modules / TypeScript usage

```typescript
import { Netgsm, SmsStatus, BalanceType } from '@netgsm/sms';

// Configure Netgsm client
const netgsm = new Netgsm({
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD',
  appname: 'YOUR_APP_NAME' // Optional
});

// Type-safe usage
async function checkBalance() {
  try {
    const balance = await netgsm.getBalance({
      type: BalanceType.CREDIT
    });
    
    console.log('Balance:', balance);
    return balance;
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
- [Additional Examples](./examples/advanced/additional-examples.js) (Future-dated, multiple numbers, end-dated, Turkish character support, and IYS filtered deliveries)

## API Reference

### Configuration

```javascript
const netgsm = new Netgsm({
  username: 'YOUR_USERNAME', // Required
  password: 'YOUR_PASSWORD',  // Required
  appname: 'YOUR_APP_NAME'    // Optional
});
```

### Sending SMS

```javascript
const response = await netgsm.sendRestSms({
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

### Querying SMS Report

```javascript
const report = await netgsm.getReport({
  bulkIds: ['12345678'] // Job ID received after sending  
});
```

### Checking Balance

```javascript
const balance = await netgsm.getBalance({
  type: BalanceType.CREDIT // 1: Package/campaign info, 2: Credit info
});
```

### Listing Headers

```javascript
const headers = await netgsm.getHeaders();
```

### Listing Inbox Messages

```javascript
const inbox = await netgsm.getInbox({
  startdate: '01012024', // Start date (format: ddMMyyyy)
  stopdate: '31012024'   // End date (format: ddMMyyyy)
});
```

### Canceling Scheduled SMS

```javascript
const cancelResult = await netgsm.cancelSms({
  jobid: '12345678' // Job ID of the delivery to cancel
});
```

For more detailed API reference, visit the [API Documentation](./docs/API.md) page.

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
