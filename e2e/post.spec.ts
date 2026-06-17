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

test('share button shows "Copied!" on click and reverts after timeout', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  const href = await firstLink.getAttribute('href');
  await firstLink.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  const shareButton = page.getByRole('button', { name: 'Copy Link' });
  await expect(shareButton).toHaveText('Copy Link');

  await shareButton.click();
  await expect(shareButton).toHaveText('Copied!');

  await expect(shareButton).toHaveText('Copy Link', { timeout: 5000 });
});

test('more mixes section links navigate to another post page', async ({ page }) => {
  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  await firstLink.click();
  await expect(page.locator('article')).toBeVisible();

  const moreMixesSection = page.locator('.more-in-genre');
  const hasMoreMixes = await moreMixesSection.count();
  if (!hasMoreMixes) {
    test.skip();
    return;
  }

  const firstMoreLink = moreMixesSection.locator('a').first();
  const href = await firstMoreLink.getAttribute('href');
  await firstMoreLink.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('article')).toBeVisible();
});
