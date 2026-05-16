import { test, expect } from '@playwright/test';

test('basic smoke test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('PRISMAFLOW');

  // Dismiss onboarding if present
  const getStarted = page.locator('text=Get Started');
  if (await getStarted.isVisible().catch(() => false)) {
    await getStarted.click();
    await expect(getStarted).not.toBeVisible();
  }

  // Check if starter pages are visible
  await expect(page.locator('article')).toHaveCount(3);

  // Navigate to studio
  await page.click('text=Open Studio');
  await expect(page.locator('h3')).toBeVisible();
});
