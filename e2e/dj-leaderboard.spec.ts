import { test, expect } from '@playwright/test';

test('DJ leaderboard sorts by most mixes when that button is clicked', async ({ page }) => {
  await page.goto('/dj-leaderboard');

  // Switch to "Most Mixes" sort
  await page.getByRole('button', { name: 'Most Mixes' }).click();

  // Read the total-mixes column values for the first several rows
  const counts = await page.locator('.dj-leaderboard-table tbody tr td:nth-child(3)').allTextContents();
  const nums = counts.slice(0, 10).map(Number);

  // Each value should be >= the next (descending order)
  for (let i = 0; i < nums.length - 1; i++) {
    expect(nums[i]).toBeGreaterThanOrEqual(nums[i + 1]);
  }
});

test('clicking a DJ name on the leaderboard navigates to their mix page', async ({ page }) => {
  await page.goto('/dj-leaderboard');

  const firstLink = page.locator('.dj-leaderboard-table tbody tr td:first-child a').first();
  const href = await firstLink.getAttribute('href');
  await firstLink.click();

  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('h1:not(.sr-only)')).toContainText('DJ:');
});
