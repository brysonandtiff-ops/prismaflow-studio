import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('accessibility scan', async ({ page }) => {
  await page.goto('/');

  // Dismiss onboarding if present
  const getStarted = page.locator('text=Get Started');
  if (await getStarted.isVisible().catch(() => false)) {
    await getStarted.click();
    await expect(getStarted).not.toBeVisible();
  }

  // Home page scan
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);

  // Open Access Centre and scan
  await page.click('[aria-label="Accessibility Settings"]');
  const accessCentreResults = await new AxeBuilder({ page }).analyze();
  expect(accessCentreResults.violations).toEqual([]);
});
