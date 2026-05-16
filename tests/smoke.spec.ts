import { test, expect } from '@playwright/test';

test('basic smoke test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('PRISMAFLOW');
  
  // Check if starter pages are visible
  await expect(page.locator('article')).toHaveCount(3);
  
  // Navigate to studio
  await page.click('text=Open Studio');
  await expect(page.locator('h3')).toBeVisible();
});
