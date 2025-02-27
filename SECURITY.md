# Security Policy

## Supported Versions

The following versions are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in the @netgsm/sms project, please report it directly to the project maintainers rather than disclosing it publicly. You can report security vulnerabilities by following these steps:

1. Send an email with details of the security vulnerability.
2. Explain how the vulnerability can be reproduced.
3. If possible, provide a suggested fix or workaround for the vulnerability.

After receiving your security vulnerability report:

1. We will acknowledge receipt of your report.
2. We will verify the vulnerability.
3. We will establish a timeline for fixing it.
4. We will inform you when the fix is released.

## Security Best Practices

We recommend following these security best practices when using the @netgsm/sms library:

1. **Keep the library updated**: Always use the latest version of the library to benefit from security patches.
2. **Secure your API credentials**: Store your Netgsm API credentials securely and never hardcode them in your application code.
3. **Use environment variables**: Store sensitive information like API keys in environment variables rather than in your code.
4. **Implement proper error handling**: Handle errors properly to prevent information leakage.
5. **Validate input data**: Always validate user input before passing it to the library.
6. **Implement rate limiting**: Implement rate limiting to prevent abuse of your application.
7. **Monitor your application**: Regularly monitor your application for unusual activity.

## Security Updates

Security updates will be released as patch versions and announced in the CHANGELOG.md file. We recommend subscribing to GitHub releases to be notified of new versions. 