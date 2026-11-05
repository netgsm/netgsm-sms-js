# Contributing Guide

Thank you for your interest in contributing to the @netgsm/sms project! This guide contains step-by-step instructions for those who want to contribute to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Environment Setup](#development-environment-setup)
- [Development Process](#development-process)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Writing Tests](#writing-tests)
- [Documentation](#documentation)
- [Creating Releases](#creating-releases)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Code of Conduct

This project is governed by the [Contributor Covenant](./CODE_OF_CONDUCT.md). By participating, you agree to abide by these rules.

## How Can I Contribute?

There are many ways to contribute to the project:

- **Bug Reports**: Report bugs you find
- **Feature Requests**: Suggest new features
- **Code Contributions**: Fix bugs or add new features
- **Documentation**: Improve or expand documentation
- **Examples**: Add new usage examples
- **Tests**: Expand test coverage

## Development Environment Setup

1. Fork the project
2. Clone the repo: `git clone https://github.com/<your-username>/netgsm-sms-js.git`
3. Navigate to the project directory: `cd netgsm-sms-js`
4. Install dependencies: `npm install`
5. Optional, for running the examples: copy `.env.example` to `.env`. The defaults point at the
   local mock (`node test/fixtures/netgsm-sms-mock.mjs --port 4010 --quiet`), so no real credentials
   are needed. Tests and examples never call the live API.

### Development Commands

- `npm run build`: Builds the ESM and CommonJS bundles with type definitions (tsup)
- `npm test`: Runs the unit tests (vitest, with a fake `fetch`)
- `npm run test:mock`: Builds, then runs the end-to-end tests against the local mock
- `npm run lint`: Checks code quality (ESLint)
- `npm run typecheck`: Type-checks `src` and `test`, including the README snippets

## Development Process

1. Create a new branch:
   - For a feature: `git checkout -b feature/new-feature`
   - For a bug fix: `git checkout -b fix/bug-fix`
   - For documentation: `git checkout -b docs/documentation-update`

2. Make your changes

3. Run tests: `npm test`

4. Commit your changes:
   - For a feature: `git commit -m "feat: added new feature"`
   - For a bug fix: `git commit -m "fix: fixed bug"`
   - For documentation: `git commit -m "docs: updated documentation"`

5. Push your branch: `git push origin feature/new-feature`

6. Create a Pull Request

### Commit Messages

Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Only documentation changes
- `style`: Changes that do not affect code behavior (spaces, formatting, etc.)
- `refactor`: Bug fix or feature addition without code changes
- `test`: Test addition or correction
- `chore`: Configuration, build process, etc. changes

## Code Standards

- Use TypeScript type definitions correctly
- Add tests for all new features
- Ensure existing tests pass
- Format your code with ESLint and Prettier
- Use descriptive commit messages
- Comment your code with JSDoc (in JSDoc format)
- Add comments for complex functions

### Code Style

This project uses ESLint and Prettier to standardize code style:

- Use 2 spaces for indentation
- Use semicolons at the end of lines
- Maximum line length is 100 characters
- Use double quotes instead of single quotes
- Use camelCase for variable names
- Use PascalCase for class names
- Use UPPER_SNAKE_CASE for constants

## Pull Request Process

1. Before creating a PR, merge your code with the `main` branch
2. Describe your changes in the PR description
3. Ensure your PR passes CI tests
4. Apply review feedback
5. Your PR will be merged by project managers after approval

### PR Template

Use the [PR template](./PULL_REQUEST_TEMPLATE.md) when creating a PR and fill in all required information.

## Writing Tests

- Add unit tests to `test/unit` (inject a fake `fetch`; never call a live API)
- Add end-to-end tests to `test/mock` (they run against the local mock)
- Use descriptive names for all test files (e.g. `netgsm.test.ts`)

### Test Examples

```typescript
describe('sms.send', () => {
  it('posts the messages to /sms/v3/send', async () => {
    // Test code here
  });
});
```

## Documentation

- Add JSDoc comments for all public APIs
- Keep README.md up-to-date. Every TypeScript code block in README.md is also in
  `test/docs/readme-snippets.test-d.ts` (wrapped in functions so it compiles) and is checked by
  `npm run typecheck`. When you change a README snippet, change it there too.
- Add usage examples for new features
- Update CHANGELOG.md for API changes

## Creating Releases

Release creation is done by project managers. Release numbering follows the [Semantic Versioning](https://semver.org/) rules:

- MAJOR: Backward-incompatible API changes
- MINOR: Backward-compatible new features
- PATCH: Backward-compatible bug fixes

## Reporting Issues

To report a bug or feature request:

1. Use the GitHub Issues section
2. Select the appropriate template (bug report or feature request)
3. Provide all required information:
   - For bug reports: Reproduction steps, expected behavior, actual behavior, environment information
   - For feature requests: Usage scenario, recommended solution, alternatives
4. If possible, add reproduction steps or code examples

## License

By contributing, you agree that your contributions will be licensed under the project's license (MIT). 