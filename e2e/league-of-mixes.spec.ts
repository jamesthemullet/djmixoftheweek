import { test, expect } from '@playwright/test';

test('clicking a post in the league of mixes navigates to the post page', async ({ page }) => {
  await page.goto('/league-of-mixes');
  const firstLink = page.locator('ul.league-of-mixes li').first().locator('a');
  const href = await firstLink.getAttribute('href');
  await firstLink.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('article')).toBeVisible();
});
