import { test, expect } from '@playwright/test';

test('single post page shows an article with a title and date', async ({ page }) => {
  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  await firstLink.click();
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('article h1')).not.toBeEmpty();
  await expect(page.locator('article date')).toBeVisible();
});

test('single post page includes a comments section', async ({ page }) => {
  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  await firstLink.click();
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('.comments-block')).toBeVisible();
});

test('single post page includes a share button', async ({ page }) => {
  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  await firstLink.click();
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('button.share-button')).toBeVisible();
});
