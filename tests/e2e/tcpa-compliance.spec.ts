// E2E Test for TCPA Compliance Flow
// This test would run with Playwright when properly configured

import { test, expect } from '@playwright/test';

test.describe('TCPA Compliance E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the quote form page
    await page.goto('/');
    // Assuming the quote form is on the homepage or navigate to quote page
  });

  test('complete TCPA compliant quote submission', async ({ page }) => {
    // Fill out the quote form
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#email', 'john.doe@example.com');
    await page.fill('#phone', '1234567890');
    await page.fill('#dateOfBirth', '1990-01-01');
    await page.fill('#city', 'Test City');
    await page.selectOption('#state', 'TX');
    await page.selectOption('#coverageType', 'term_life');

    // Check TCPA consent
    await page.check('#tcpaConsent');

    // Verify TCPA consent text is displayed
    const tcpaLabel = page.locator('label[for="tcpaConsent"]');
    await expect(tcpaLabel).toContainText('By submitting this form');
    await expect(tcpaLabel).toContainText('Mowry Agency');
    await expect(tcpaLabel).toContainText(
      'not required as a condition of purchase'
    );

    // Verify licensing disclosure is visible
    await expect(page.locator('text=Licensing Information')).toBeVisible();
    await expect(
      page.locator('text=Mowry Digital Enterprise LLC')
    ).toBeVisible();

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success message or navigation
    await expect(page.locator('text=Quote request submitted')).toBeVisible({
      timeout: 10000,
    });
  });

  test('prevents submission without TCPA consent', async ({ page }) => {
    // Fill out all fields except TCPA consent
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Smith');
    await page.fill('#email', 'jane.smith@example.com');
    await page.fill('#phone', '0987654321');
    await page.fill('#dateOfBirth', '1985-05-15');
    await page.fill('#city', 'Another City');
    await page.selectOption('#state', 'CA');
    await page.selectOption('#coverageType', 'whole_life');

    // Do NOT check TCPA consent
    // await page.check('#tcpaConsent'); // Commented out intentionally

    // Try to submit
    await page.click('button[type="submit"]');

    // Should still be on the form page (not submitted)
    await expect(page.locator('#tcpaConsent')).toBeVisible();

    // Submit button should be disabled or form should show validation error
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('displays privacy policy and terms links', async ({ page }) => {
    // Verify privacy policy link exists and is functional
    const privacyLink = page.locator('a[href="/privacy-policy"]');
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveText(/Privacy Policy/);

    // Verify terms of service link exists and is functional
    const termsLink = page.locator('a[href="/terms-of-service"]');
    await expect(termsLink).toBeVisible();
    await expect(termsLink).toHaveText(/Terms of Service/);
  });

  test('shows licensing information section', async ({ page }) => {
    // Verify licensing section is visible
    await expect(page.locator('text=Licensing Information')).toBeVisible();

    // Verify key licensing details
    await expect(
      page.locator('text=Mowry Digital Enterprise LLC')
    ).toBeVisible();
    await expect(
      page.locator('text=Licensed to sell life insurance')
    ).toBeVisible();
  });

  test('email marketing consent is optional', async ({ page }) => {
    // Check if email marketing checkbox exists (it might be optional/future feature)
    const emailMarketingCheckbox = page.locator('#emailMarketing');

    if (await emailMarketingCheckbox.isVisible()) {
      // If it exists, verify it's not required
      await expect(emailMarketingCheckbox).not.toHaveAttribute('required');

      // Verify it can be checked independently of TCPA consent
      await emailMarketingCheckbox.check();
      await expect(emailMarketingCheckbox).toBeChecked();
    }
  });

  test('form validation works correctly', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors for required fields
    await expect(page.locator('input:invalid')).toHaveCount(6); // Adjust based on required fields

    // Specifically check that TCPA consent is required
    const tcpaCheckbox = page.locator('#tcpaConsent');
    await expect(tcpaCheckbox).toHaveAttribute('required');
  });
});
