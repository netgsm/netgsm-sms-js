# @netgsm/sms Examples

This directory contains various examples for using the Netgsm SMS API. These examples demonstrate how to use the basic and advanced features of the API.

## Before You Begin

Before running the examples, make sure you complete the following steps:

1. Ensure you have a Netgsm account and API access is enabled.
2. Have your Netgsm user code and password ready.
3. Clone the project and install dependencies:

```bash
git clone https://github.com/netgsm/netgsm-sms-js.git
cd netgsm-sms-js
npm install
```

## Basic Examples

### [Basic Usage](./basic-usage.js)

This example demonstrates the basic usage of the Netgsm SMS API:

- Sending SMS
- Querying SMS reports
- Listing message headers
- Checking balance

To run the example:

```bash
node examples/basic-usage.js
```

## Advanced Examples

### [Bulk SMS](./advanced/bulk-sms.js)

This example demonstrates how to send different messages to multiple recipients in a single request:

- Creating message packages
- Sending bulk SMS
- Handling responses

To run the example:

```bash
node examples/advanced/bulk-sms.js
```

### [Scheduled SMS](./advanced/scheduled-sms.js)

This example demonstrates how to schedule SMS messages for future delivery:

- Setting delivery date and time
- Canceling scheduled messages
- Checking delivery status

To run the example:

```bash
node examples/advanced/scheduled-sms.js
```

### [Error Handling](./advanced/error-handling.js)

This example demonstrates proper error handling techniques:

- Handling API errors
- Retry mechanisms
- Logging errors

To run the example:

```bash
node examples/advanced/error-handling.js
```

## Configuration

All examples use environment variables for configuration. Create a `.env` file in the project root with the following variables:

```
NETGSM_USERNAMEyour_username
NETGSM_PASSWORD=your_password
NETGSM_MESSAGE_HEADER=your_header
TEST_PHONE_NUMBER=905xxxxxxxxx
```

## Additional Resources

- [API Documentation](../docs/README.md)
- [TypeScript Definitions](../src/types.ts)