---
name: performance
description: Use this skill when the user types "/performance" or asks to review the app for performance improvements. Audits the codebase for performance issues and creates GitHub issues — minor findings grouped into one issue, significant findings each get their own issue. If nothing worth improving is found, that is an acceptable outcome.
version: 1.0.0
---

# Performance Skill

You are running a performance audit session for DJ Mix Of The Week.

## Stack

- **Astro 6** — server-rendered `.astro` files; pages are statically generated or SSR at request time
- **Alpine.js 3** — lightweight client-side interactivity; no bundler-heavy frameworks
- **GraphQL** — data fetching via `src/lib/api.ts` + queries in `src/lib/queries/`; external WordPress backend
- **Plain CSS** — global stylesheets in `src/styles/`; no CSS-in-JS
- **Mixcloud & SoundCloud embeds** — third-party iframes; not self-hosted
- **Vercel** — deployment with web analytics; static output preferred
- Source files: `src/pages/`, `src/components/`, `src/lib/`, `src/scripts/`, `src/types.ts`

## What to do each invocation

### Step 1 — Audit across all four categories

Read the source files in `src/pages/`, `src/components/`, `src/lib/`, and `src/scripts/`. Check **all four** of the following categories — do not skip any:

1. **Unnecessary data fetching** — look for: GraphQL queries that fetch more fields than the page uses, the same query fired multiple times on the same page/request, missing `no-store` / cache headers on volatile data, over-fetching in list queries when only a subset of posts is rendered

2. **Render-blocking or oversized assets** — look for: images without `width`/`height` or without `loading="lazy"` on below-the-fold images, fonts loaded without `font-display: swap`, CSS files imported that are larger than needed or contain unused rules for this page, third-party scripts loaded synchronously in `<head>` without `async`/`defer`

3. **Client-side JavaScript bloat** — look for: Alpine.js `x-data` initialised on every page when it is only needed on some, large inline scripts in `.astro` files that could be deferred, `document.querySelector` / DOM manipulation run on page load before the element is visible, redundant re-renders in Alpine.js (e.g. watching a value that never changes)

4. **Build / bundle inefficiencies** — look for: dynamic `import()` that defeats static analysis, Astro components importing a whole library when only one export is used, duplicate dependencies (same utility imported differently across files), unused Astro integrations in `astro.config.mjs`

### Step 2 — Classify findings

For each finding, assign a severity:

- **Major** — measurable page-load or runtime impact; worth a dedicated fix (e.g. fetching 10 extra fields on every page load, a synchronous third-party script in `<head>`, a large unoptimised image on the critical path)
- **Minor** — low-impact polish; individually small but collectively worth addressing (e.g. missing `loading="lazy"` on a single below-fold image, an unused CSS variable, a redundant Alpine watch)

If you find **no issues worth acting on**, state that clearly and stop — do not create GitHub issues.

### Step 3 — Report findings

Output exactly this structure:

```
## Performance audit

### Major findings
<numbered list — or "None" if none found>

### Minor findings
<numbered list — or "None" if none found>

### Verdict
<"No action needed" if nothing material was found, otherwise a one-sentence summary of the most impactful area>
```

### Step 4 — Create GitHub issues

**Only proceed if at least one finding was reported.**

- For each **major** finding, create a **separate** GitHub issue.
- For all **minor** findings combined, create **one** GitHub issue (skip if there are no minor findings).

Use this command for each major finding:

```bash
gh issue create \
  --title "Performance: <short title>" \
  --label "performance" \
  --body "## Finding

**Category:** <category name>
**Severity:** Major
**File:** <path:line if applicable>

## Description

<what the problem is and why it matters for performance>

## Suggested fix

<concrete change — be specific about files and patterns>"
```

Use this command for all minor findings grouped together:

```bash
gh issue create \
  --title "Performance: minor improvements" \
  --label "performance" \
  --body "## Minor performance improvements

The following low-impact issues were found during a performance audit. Each is small but together they contribute to a leaner build.

<for each minor finding:>
### <finding title>
**Category:** <category>
**File:** <path:line if applicable>
**Issue:** <one sentence>
**Suggested fix:** <one sentence>
"
```

Report each issue URL once created.

## Known project patterns

- **GraphQL fetching:** All API calls go through `fetchGraphQL` in `src/lib/api.ts`; queries live in `src/lib/queries/` — over-fetching here affects every page that uses the query
- **Images:** Mix cover images come from the WordPress GraphQL API as URLs — Astro's `<Image>` component or native `loading="lazy"` are the levers available
- **Alpine.js init:** `Alpine.data(...)` registrations in `src/scripts/` are bundled globally — components registered but only used on one page are loaded everywhere
- **Embeds:** Mixcloud/SoundCloud iframes are render-blocking by nature; lazy-loading them behind a click or Intersection Observer is a known pattern
- **CSS:** Styles are global (`src/styles/`) — unused rules cannot be tree-shaken automatically; manual audit needed
- **Astro config:** Integrations and output mode are in `astro.config.mjs` — unused integrations add to build time
- **`performance` label:** If the label does not exist in the repo, create it first with `gh label create "performance" --color "e4e669" --description "Performance improvements"`
