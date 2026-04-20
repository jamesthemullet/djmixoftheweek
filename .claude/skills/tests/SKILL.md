---
name: tests
description: Use this skill when the user types "/tests" or asks to improve, add, or run tests for this project. Incrementally improves test coverage by adding one meaningful unit or e2e test per invocation. Handles first-time setup of Playwright if it is not yet installed.
---

# Tests Skill

Improve test coverage for this Astro project incrementally — one meaningful test per run.

## Step 1: Check for Vitest

Read `package.json`. If `vitest` is NOT present in `devDependencies` and there are unit-testable candidates (pure TS functions), install it:

1. Run: `yarn add -D vitest`
2. Add `"test:unit": "vitest run"` to `package.json` scripts.

Do this only if you decide unit tests are the right choice in Step 3. Don't install vitest if you're adding an e2e test this run.

## Step 3: Decide — unit test or e2e test?

Audit the current state:

- List files in `e2e/` (if it exists) and `src/**/*.test.*` or `src/**/*.spec.*`
- Count how many unit tests vs e2e tests already exist
- Consider what's untested and what has the most value

**Choose e2e if:**
- No e2e tests exist yet (highest ROI — verifies real user flows)
- The gap in coverage is about page rendering, navigation, or interactive UI behaviour
- The feature is hard to unit-test in isolation (Astro components, Alpine.js interactions)

**Choose unit if:**
- e2e tests already cover the main flows
- There are pure TypeScript functions with no UI dependency that have no tests
- Good candidates: `src/lib/api.ts`, `src/scripts/load-more.ts`, `src/lib/queries/*.ts`

**Report "no improvement justifiable" if:**
- All meaningful paths are already covered
- The only untested code is trivially simple (single-expression functions, pure type definitions)
- Adding a test would require mocking so heavily that it provides no real signal

## Step 4: Write the test

Write one focused, meaningful test. Quality over quantity.

### For e2e tests — save to `e2e/<page-or-feature>.spec.ts`

**E2e tests must test behaviour, not visibility.** Do not write tests that only assert an element exists or is visible — those add no value. Every test should assert that a user action produces the correct outcome.

Good behavioural tests for this project:
- Genre filter selection navigates to the correct `/genre/{slug}` URL
- "Load more" click appends new posts (count increases after button re-enables)
- Clicking a post link navigates to the post page and renders an `<article>`
- Comment form submission posts and shows the new comment
- Genre page lists posts belonging to that genre

Bad tests (do not write these):
- "navigation is visible"
- "load more button is present"
- "genre filter exists"

Example structure:
```ts
import { test, expect } from '@playwright/test';

test('genre filter navigates to the selected genre page', async ({ page }) => {
  await page.goto('/');
  const select = page.locator('#genre-filter');
  const genreValue = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption({ index: 1 });
  await page.waitForURL(genreValue!);
  await expect(page).toHaveURL(genreValue!);
});
```

### For unit tests — save to `src/**/__tests__/<file>.test.ts`

Good unit test candidates:
- `src/lib/api.ts` — `fetchGraphQL` handles errors gracefully
- `src/scripts/load-more.ts` — pagination logic updates state correctly

Example structure:
```ts
import { describe, it, expect, vi } from 'vitest';

describe('fetchGraphQL', () => {
  it('throws on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    // ...
  });
});
```

## Step 5: Verify and report

Run the test you just wrote:
- e2e: `yarn test:e2e --project=chromium <path-to-test-file>`
- unit: `yarn test:unit <path-to-test-file>`

If it passes: report what was added and why it's valuable.
If it fails: fix it before reporting. Don't leave a failing test.

Report format:
```
Added: <type> test — <what it tests>
File: <path>
Reason: <why this particular test adds value>
```

If no improvement was justifiable, say so clearly and briefly explain why.
