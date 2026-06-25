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

test('imported SVG pages render and support region fill', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('prismaflow-onboarded', 'true');
    localStorage.setItem('prismaflow-imported-pages', JSON.stringify([
      {
        id: 'imported-test-svg',
        title: 'Imported Square',
        type: 'svg',
        data: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect id="test-region" x="10" y="10" width="80" height="80" fill="#ffffff" /></svg>',
        regions: [{ id: 'test-region', name: 'Test Region' }],
        createdAt: Date.now(),
      },
    ]));
  });

  await page.goto('/');

  await page.getByRole('button', { name: /Open imported page Imported Square/i }).click();
  await expect(page.getByRole('heading', { name: 'Imported Square' })).toBeVisible();

  const region = page.locator('svg.studio-canvas #test-region');
  await expect(region).toBeVisible();
  await expect(region).toHaveAttribute('aria-label', 'Region: Test Region');

  await region.click();
  await expect(region).toHaveAttribute('fill', '#45E7FF');
  await expect.poll(async () => {
    return page.evaluate(() => {
      const saved = localStorage.getItem('prismaflow-project-imported-test-svg');
      return saved ? JSON.parse(saved).fills?.['test-region'] : undefined;
    });
  }).toBe('#45E7FF');
});
