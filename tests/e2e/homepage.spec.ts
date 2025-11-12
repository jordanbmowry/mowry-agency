import { expect, test } from '@playwright/test';

/**
 * Smoke test for CI/CD pipeline
 * Verifies the application starts and serves content successfully
 */
test.describe('Smoke Test', () => {
  test('application loads successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Verify page has loaded by checking for body element
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verify page has some content
    await expect(body).not.toBeEmpty();
  });
});
