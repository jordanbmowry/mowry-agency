import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for accessibility/e2e tests.
 * - tests live in `tests/e2e`
 * - runs against local dev server at http://localhost:3000 by default
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. */
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  // Only test on Chromium for CI speed and reliability
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // Reuse existing server locally, start fresh in CI
    timeout: 180000, // 3 minutes to ensure Nuxt starts
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      SUPABASE_KEY: process.env.SUPABASE_KEY || 'placeholder-key',
      NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  /* Global timeout for all tests */
  timeout: 60000, // 1 minute per test
});
