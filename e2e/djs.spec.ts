import { test, expect } from '@playwright/test';

test('clicking a DJ on the DJs page navigates to that DJ and lists their posts', async ({ page }) => {
  await page.goto('/djs');
  const firstDJLink = page.locator('.genre-list li').first().locator('a');
  const href = await firstDJLink.getAttribute('href');
  await firstDJLink.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('h1:not(.sr-only)')).toContainText('DJ:');
  await expect(page.locator('ul li')).not.toHaveCount(0);
});
