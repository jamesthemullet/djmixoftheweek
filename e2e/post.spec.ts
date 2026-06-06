import { test, expect } from '@playwright/test';

test('share button shows "Copied!" on click and reverts after timeout', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  const href = await firstLink.getAttribute('href');
  await firstLink.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  const shareButton = page.locator('.share-button');
  await expect(shareButton).toHaveText('Share This Mix');

  await shareButton.click();
  await expect(shareButton).toHaveText('Copied!');

  await expect(shareButton).toHaveText('Share This Mix', { timeout: 5000 });
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
