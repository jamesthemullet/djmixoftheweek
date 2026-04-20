import { test, expect } from '@playwright/test';

test('genre filter navigates to the selected genre page', async ({ page }) => {
  await page.goto('/');
  const select = page.locator('#genre-filter');
  const genreValue = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption({ index: 1 });
  await page.waitForURL(genreValue!);
  await expect(page).toHaveURL(genreValue!);
});

test('load more button appends posts to the list', async ({ page }) => {
  await page.goto('/');
  const initialCount = await page.locator('#post-list li').count();
  await page.locator('#load-more').click();
  await expect(page.locator('#load-more')).toBeEnabled();
  const newCount = await page.locator('#post-list li').count();
  expect(newCount).toBeGreaterThan(initialCount);
});

test('clicking a post navigates to the post page', async ({ page }) => {
  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  const href = await firstLink.getAttribute('href');
  await firstLink.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('article')).toBeVisible();
});
