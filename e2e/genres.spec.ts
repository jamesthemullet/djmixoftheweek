import { test, expect } from '@playwright/test';

test('clicking a genre on the genres page navigates to that genre and lists posts', async ({ page }) => {
  await page.goto('/genres');
  const firstGenreLink = page.locator('.genre-list li').first().locator('a');
  const href = await firstGenreLink.getAttribute('href');
  await firstGenreLink.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('main h1, article h1, h1:not(.sr-only)').first()).toContainText('Genre:');
  await expect(page.locator('ul li')).not.toHaveCount(0);
});
