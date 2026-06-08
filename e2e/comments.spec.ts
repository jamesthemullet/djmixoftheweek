import { test, expect } from '@playwright/test';

test('comment form shows success message after submission', async ({ page }) => {
  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  await firstLink.click();
  await expect(page.locator('article')).toBeVisible();

  await page.route('**/graphql', async (route) => {
    const body = route.request().postDataJSON();
    if (body?.query?.includes('createComment')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { createComment: { success: true } } }),
      });
    } else {
      await route.continue();
    }
  });

  const form = page.locator('#comment-form');
  await form.locator('#authorName').fill('Test User');
  await form.locator('#email').fill('test@example.com');
  await form.locator('#commentText').fill('This is a test comment.');
  await form.locator('button[type="submit"]').click();

  await expect(page.locator('#message')).toHaveText('Comment submitted! Awaiting moderation.');
});

test('comment form shows error message when submission fails', async ({ page }) => {
  await page.goto('/');
  const firstLink = page.locator('#post-list li').first().locator('a').first();
  await firstLink.click();
  await expect(page.locator('article')).toBeVisible();

  await page.route('**/graphql', async (route) => {
    const body = route.request().postDataJSON();
    if (body?.query?.includes('createComment')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ errors: [{ message: 'Sorry, you must be logged in to comment.' }] }),
      });
    } else {
      await route.continue();
    }
  });

  const form = page.locator('#comment-form');
  await form.locator('#authorName').fill('Test User');
  await form.locator('#email').fill('test@example.com');
  await form.locator('#commentText').fill('This is a test comment.');
  await form.locator('button[type="submit"]').click();

  await expect(page.locator('#message')).toContainText('Failed to submit comment:');
});
