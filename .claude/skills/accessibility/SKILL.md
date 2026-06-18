---
name: accessibility
description: Use this skill when the user types "/accessibility" or asks to improve accessibility, fix a11y issues, or improve WCAG compliance in this project. Runs one incremental accessibility improvement per invocation.
version: 1.0.0
---

# Accessibility Skill

You are running an incremental accessibility improvement session for this Astro / Alpine.js / TypeScript project.

## Stack

- **TypeScript strict mode** (`tsconfig.json`) — `strict: true`, `noImplicitAny: true`
- **Astro 6** — server-rendered `.astro` files with optional Alpine.js hydration
- **Alpine.js 3** — lightweight client-side interactivity via `x-data`, `x-model`, `@click`
- **GraphQL** — data fetching via `src/lib/api.ts` + query strings in `src/lib/queries/`
- **Plain CSS** — global stylesheets in `src/styles/`; no CSS-in-JS
- **`accented`** — development-only accessibility overlay (imported in `BaseLayout.astro`) that highlights issues at runtime; check its output patterns for known issues
- Source files: `src/pages/`, `src/components/`, `src/lib/`, `src/scripts/`, `src/types.ts`, `src/global.d.ts`

## What to do each invocation

### Step 1 — Pick a category

Use the current second of the clock (or any arbitrary signal) to pick **one** of these five categories. Vary the selection — do not always pick the same one:

1. **ARIA attributes** — look for: interactive elements missing `aria-expanded`, `aria-controls`, `aria-haspopup`, or `aria-hidden`; decorative elements lacking `aria-hidden="true"`; Alpine.js toggle components that change visibility without updating ARIA state; `role` attributes that are incorrect or redundant; `aria-label` values that are vague or duplicate visible text
2. **Semantic HTML** — look for: heading hierarchy violations (skipped levels, multiple `<h1>`, headings used for styling); non-semantic wrappers (`<div>` or `<span>`) where a `<button>`, `<nav>`, `<section>`, `<article>`, or list element would be correct; landmark regions missing or misused (`<header>`, `<main>`, `<footer>`, `<nav>`); `<b>`/`<i>` used where `<strong>`/`<em>` is intended
3. **Keyboard navigation** — look for: interactive elements unreachable by tab (missing `tabindex` or hidden with CSS but still in DOM); click-only handlers with no keyboard equivalent; focus order that doesn't match visual order; missing visible focus indicator (no `:focus-visible` style); Alpine.js widgets (modals, dropdowns, menus) that trap or lose keyboard focus incorrectly; skip links that exist in markup but don't visually appear on focus
4. **Forms and inputs** — look for: inputs with only a `placeholder` but no `<label>` (placeholders disappear on typing and have poor contrast); `<label>` elements not programmatically associated via `for`/`id` or `aria-labelledby`; form error messages not announced to screen readers (missing `aria-live` or `role="alert"`); submit buttons with no accessible name; missing `autocomplete` attributes on common fields (name, email, search)
5. **Images and media** — look for: `<img>` tags missing `alt`; `alt=""` used on images that convey information; third-party Mixcloud/SoundCloud iframes missing a `title` attribute; CSS background images used for content images (information conveyed only visually); SVG icons without accessible text (`aria-label` or `<title>`)

### Step 2 — Find the best candidate

Read the relevant source files in `src/pages/`, `src/components/`, `src/lib/`, and `src/scripts/`. Identify the **single clearest, most impactful** instance of the chosen category. Prefer issues that:

- Affect multiple pages (e.g. a component in `BaseLayout.astro`, `header/header.astro`, or a shared component)
- Fail WCAG 2.1 Level AA (not just best-practice polish)
- Have an unambiguous, safe fix that doesn't change visual appearance
- Can be verified by reading the markup — do not guess at runtime behaviour

If the chosen category has no clear finding, switch to a different category rather than inventing a minor issue.

### Step 3 — Fix it

Make the fix. Keep scope tight — one issue, one or two files. Do not refactor beyond what is needed to address the specific finding. Prefer:

- Adding `aria-*` attributes to existing elements over restructuring markup
- Adding or tightening CSS `:focus-visible` rules over changing DOM structure
- Associating existing `<label>` elements before adding new ones

### Step 4 — Report

Output exactly this structure:

```
## Accessibility improvement

**Category:** <chosen category name>
**WCAG criterion:** <e.g. 1.1.1 Non-text Content (Level A), 4.1.2 Name, Role, Value (Level AA), or "Best practice">
**File:** <path:line>
**Issue:** <one sentence describing the problem>
**Fix:** <what was changed and why>
**Next suggestion:** <the next candidate worth tackling in this category, with file path>
```

### Step 5 — Raise a PR

After reporting, commit the change and open a pull request:

1. Stage only the file(s) you modified: `git add <file>`
2. Commit with a message in the form: `fix(a11y): <short description of the fix>`
3. Push to the current branch
4. Create a PR using `gh pr create` targeting `main` with:
   - **Title:** `fix(a11y): <short description>`
   - **Body:** include the Category, WCAG criterion, file, issue, and fix from Step 4
   - Add the label `accessibility` if it exists (use `gh label list` to check; skip silently if it doesn't)

## Known project patterns

- **Skip link:** `<a href="#main-content" class="skip-link">` is already present in `BaseLayout.astro` — verify its CSS makes it visible on `:focus` before flagging it as missing
- **Nav toggle:** `#nav-toggle` in `header/header.astro` now has `aria-expanded` and `aria-controls="nav-menu"` — the JS handler toggles `aria-expanded` on click. The `#nav-menu` `<nav>` still has no `aria-hidden` toggling; adding it to mirror the collapsed state on mobile is the next improvement to tackle here
- **Search input:** The `<input>` in `search/search.astro` has only a `placeholder` and no `<label>` — a visually hidden `<label>` or `aria-label` is needed (WCAG 1.3.1 / 4.1.2)
- **Search form:** The `<form>` in `search/search.astro` would benefit from `role="search"` to expose it as a search landmark to screen readers
- **Alpine.js ARIA:** Alpine.js binds like `:aria-expanded="isOpen"` and `:aria-hidden="!isOpen"` are the idiomatic way to keep ARIA state in sync with Alpine reactive data — prefer these over manual DOM manipulation in `<script>` blocks
- **`accented` library:** Imported in `BaseLayout.astro` development mode — it highlights missing alt text, poor contrast, and unlabelled form fields at runtime; its categories map directly to this skill's audit areas
- **Color contrast:** CSS custom properties (`--text`, `--menu`, `--white`, etc.) are defined in `src/styles/` — check contrast ratios against backgrounds before flagging; do not guess, read the actual values
- **Mixcloud/SoundCloud iframes:** These appear in mix detail pages — check that each `<iframe>` has a descriptive `title` attribute so screen readers can identify the embedded player
- **`axe` dependency:** `axe-core` is listed in `knip.json` `ignoreDependencies` — it is used in the Playwright e2e test suite; do not flag it as unused
- **Heading in header:** The `<h2>Search:</h2>` and `<h2>Be notified of new posts by e-mail</h2>` in `header/header.astro` may conflict with the page's own heading hierarchy — investigate before flagging; the `<h1 class="sr-only">` on the site title is intentional
