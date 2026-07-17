import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('prismaflow-onboarded', 'true');
  });
});

test('studio sessions are deep linked and survive reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Studio' }).first().click();

  await expect(page).toHaveURL(/#studio\//);
  await expect(page.getByRole('region', { name: 'Project safety controls' })).toBeVisible();

  const studioUrl = page.url();
  await page.reload();

  await expect(page).toHaveURL(studioUrl);
  await expect(page.getByRole('region', { name: 'Project safety controls' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Back to Gallery/i })).toBeVisible();
});

test('project safety bar creates a previous-version backup and downloads a portable file', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Studio' }).first().click();

  const pageId = decodeURIComponent(page.url().split('#studio/')[1]);
  const firstRecord = {
    pageId,
    fills: { regionA: '#45E7FF' },
    lastModified: 100,
  };
  const secondRecord = {
    pageId,
    fills: { regionA: '#8B5CF6' },
    lastModified: 200,
  };

  await page.evaluate(({ key, record }) => {
    localStorage.setItem(key, JSON.stringify(record));
  }, { key: `prismaflow-project-${pageId}`, record: firstRecord });

  await expect.poll(async () => {
    return page.evaluate((key) => localStorage.getItem(key), `prismaflow-project-${pageId}`);
  }).not.toBeNull();

  await page.waitForTimeout(900);
  await page.evaluate(({ key, record }) => {
    localStorage.setItem(key, JSON.stringify(record));
  }, { key: `prismaflow-project-${pageId}`, record: secondRecord });

  await expect.poll(async () => {
    return page.evaluate((key) => localStorage.getItem(key), `prismaflow-project-backup-${pageId}`);
  }).toBe(JSON.stringify(firstRecord));

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Project file/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.prismaflow\.json$/);
});

test('the product reports offline-ready status without leaving the studio', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Studio' }).first().click();

  await context.setOffline(true);
  await expect(page.getByText('Offline ready').first()).toBeVisible();
  await expect(page.getByRole('region', { name: 'Project safety controls' })).toBeVisible();

  await context.setOffline(false);
  await expect(page.getByText('Online').first()).toBeVisible();
});
