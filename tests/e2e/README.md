# E2E Testing with Playwright

## Overview

This project uses a simplified smoke test approach to ensure CI/CD pipeline reliability. The test verifies that the application starts and serves content successfully.

## Running Tests

### Prerequisites

**IMPORTANT**: You MUST have the Nuxt dev server running before running e2e tests locally.

```bash
# Terminal 1: Start the dev server (and keep it running)
pnpm dev

# Terminal 2: Run the e2e tests
pnpm test:e2e
```

The tests will connect to your running dev server on `http://localhost:3000`.

### Test Commands

- `pnpm test:e2e` - Run smoke test in headless mode
- `pnpm test:e2e:debug` - Run tests in debug mode with Playwright Inspector
- `pnpm test:e2e:ui` - Run tests with Playwright UI mode (interactive)

### Viewing Test Reports

After tests run, view the HTML report:

```bash
pnpm exec playwright show-report
```

## Test Structure

Tests are located in `tests/e2e/`:

- `homepage.spec.ts` - Smoke test that verifies application loads successfully
- `accessibility.spec.ts` - Accessibility validation tests

## Configuration

Playwright configuration is in `playwright.config.ts`:

- **Local Development**: Reuses existing dev server on port 3000
- **CI Environment**: Starts a fresh server automatically
- **Timeout**: 120 seconds for server startup
- **Environment Variables**: Automatically provides Supabase placeholders

## Troubleshooting

### Tests hang or timeout

**Cause**: Dev server not running or port 3000 is occupied by another process.

**Solution**:
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Start the dev server
pnpm dev

# In another terminal, run tests
pnpm test:e2e
```

### "Cannot find tests" error

**Cause**: Tests are not in the expected directory.

**Solution**: Ensure your test files are in `tests/e2e/` and end with `.spec.ts` or `.test.ts`.

### Environment variable errors

**Cause**: Missing Supabase configuration.

**Solution**: The config provides default placeholders, but for full functionality, set:
```bash
export SUPABASE_URL=your-supabase-url
export SUPABASE_KEY=your-supabase-key
```

## CI/CD

In GitHub Actions, tests run automatically:

1. Fresh server starts on port 3000
2. Tests run against the server
3. Server shuts down after tests complete
4. Reports are uploaded as artifacts

See `.github/workflows/ci.yml` for the complete CI configuration.
