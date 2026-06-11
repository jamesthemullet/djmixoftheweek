import { test, expect } from '@playwright/test';

test('visiting an unknown URL renders the 404 page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist-xyz-abc');
  await expect(page.locator('h1:not(.sr-only)')).toContainText('404');
  await expect(page.locator('#main-content a[href="/"]').first()).toBeVisible();
});
