---
name: full-audit
description: Run a full audit of the DJ Mix of the Week site (Astro / Alpine.js / TypeScript, external WordPress GraphQL backend, deployed on Vercel) covering test coverage (unit + e2e gaps), accessibility, performance, SEO, responsive/UX, security, code quality (strict typing, duplication, bad patterns, dead code), and README/feature alignment. Appends new findings to a persistent AUDIT.md checklist in the repo (existing checked-off items are preserved). Use when the user asks to audit, review the health of, or find improvements for the whole site — not for reviewing a single PR/diff (use `/code-review` for that).
---

# Full site audit

Produces a holistic health report for the DJ Mix of the Week site: an Astro 7 + Alpine.js 3 +
TypeScript (strict) frontend, pulling content from an external WordPress GraphQL backend
(`blog.djmixoftheweek.com`) via `src/lib/api.ts`, deployed to Vercel. This is NOT a PR/diff
review — lint (Biome), type-check (`astro check`), unit tests, e2e (Playwright), and knip
(unused-export detection) already run as CI gates on every PR (see
`.github/workflows/pull_request_audit.yml`), so **do not re-check whether the app
lints/type-checks/builds/passes its existing tests — it already does**. This audit looks at
things no single PR's gates catch: coverage gaps in files nobody has touched recently,
cross-cutting site quality (a11y, perf, SEO, security, UX), and code quality that a passing
type-check doesn't guarantee (e.g. `any` and unsafe casts still compile cleanly — see
category 8).

Note there are already narrower, single-purpose skills in this repo (`/accessibility`,
`/performance`, `/product`, `/quality`, `/security`, `/tests`) that each make one incremental
fix or file one GitHub issue per invocation. This skill is different: it is read-only/diagnostic,
covers all areas in one pass, and writes everything to the single running `AUDIT.md` checklist
rather than opening issues or PRs itself.

## When to run this

User asks to "audit the site", "find ways to improve the website", "do a full review of the
app", or similar whole-app requests. If they ask about a single PR or the current diff, use
`/code-review` instead.

## Output

Findings live in a single persistent file at the repo root: **`AUDIT.md`**. This is not a
one-off report — it's a living checklist that accumulates across runs. Each run **appends**,
never replaces:

- `AUDIT.md` has one `## <n>. <Category>` section per category below, in the same order, each
  containing a flat markdown checklist (`- [ ] finding text (found: YYYY-MM-DD)`).
- **Before writing anything**, read the current `AUDIT.md` in full (create it from the template
  below if it doesn't exist yet).
- For each category, compare this run's findings against what's already listed in that section:
  - If a finding already exists (same issue, same file/route — wording may differ slightly),
    **do not duplicate it**. Leave the existing line untouched.
  - If an existing unchecked item no longer reproduces (verify, don't assume — re-check it),
    check it off and add `(resolved: YYYY-MM-DD, verified during audit)` rather than deleting
    the line, so there's a record.
  - **Never touch a line that's already checked off (`- [x]`)** — those are the user's own
    record of completed work. Leave them exactly as-is, in place.
  - Genuinely new findings get appended to the bottom of that section's list as new `- [ ]`
    items, dated.
- Add a line to the `## Run log` section at the top with today's date and a one-line summary
  (e.g. "2026-08-31 — 4 new findings (2 a11y, 1 security, 1 code quality), 1 item resolved").
- Do not renumber, reorder, or rewrite prose outside the checklists — this file is meant to be
  readable as a diff over time.

Do not modify application code during the audit unless the user explicitly asks you to fix
something after seeing the report — this skill is read-only/diagnostic aside from editing
`AUDIT.md` itself.

### AUDIT.md template (use this structure if the file doesn't exist yet)

```markdown
# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- YYYY-MM-DD — initial audit

## 1. Test coverage — unit gaps and e2e

## 2. Accessibility

## 3. Performance

## 4. SEO / metadata

## 5. Responsive / UX

## 6. Security

## 7. README / feature alignment

## 8. Code quality
```

## How to run it

Fan out the categories below as parallel forks or a general-purpose subagent per category (they
are independent and read-heavy — keep the raw output out of your main context). Have each one
**report findings back as text**, not write to `AUDIT.md` directly — only you should touch that
file, in a single merge pass at the end, so the dedup/checked-item rules above are applied
consistently in one place. Categories needing the browser (a11y/perf/responsive/e2e-walkthrough)
should run together in one browser-driving pass since they all need the app running.

Before starting, check whether a dev server is already running; if not, start the site yourself
with `yarn dev` (Astro dev server, port 4321) for the duration of the audit, and stop it when
done unless the user is already running it. `PUBLIC_API_BASE_URL` (see `.env`/`.env.example`)
must point at the live `blog.djmixoftheweek.com` WordPress GraphQL API for pages to render
content locally.

### 1. Test coverage — unit gaps and e2e

- Run `yarn test:unit:coverage` — even though CI only enforces that unit tests pass (not a
  coverage threshold), list files in `src/lib/`, `src/scripts/`, and `src/lib/queries/` with
  little or no coverage, especially `src/lib/api.ts` (`fetchGraphQL` error paths) and any pure
  logic in `src/scripts/` (e.g. load-more pagination).
- Run `yarn test:e2e` and list the specs in `e2e/`. Playwright is already set up (unlike a
  from-scratch project) — the gap to look for is **missing flows**, not missing tooling. Check
  actual coverage of key user flows, walking any that lack a spec in the browser via
  `claude-in-chrome` as a manual substitute:
  - Home page → genre/DJ/nationality browse pages → individual mix detail page
  - "Load more" pagination on list pages
  - Genre/DJ/nationality filter selection navigating to the correct route
  - Comment submission on a mix detail page (`src/components/addComment.astro`)
  - Search (`src/components/search/search.astro`)
  - RSS feed endpoint returning valid content
  For each flow, report whether it currently has automated coverage (unit-level mocks don't
  count as e2e) and, if not, propose the missing spec(s) — one line per spec, matching the style
  already used in `e2e/`.

### 2. Accessibility

- Automated pass per route (axe via browser console injection, or Lighthouse a11y score through
  `claude-in-chrome`) — note that CI already runs `axe-core` against the homepage only
  (`pull_request_audit.yml`'s `axe` job); extend the check to genre/DJ/nationality/mix-detail
  routes that CI doesn't cover.
- Manual: color contrast against the CSS custom properties in `src/styles/`, focus order/visible
  focus states, the skip link and nav toggle's `aria-expanded`/`aria-controls` wiring in
  `header/header.astro`, labels on the search input and comment form, `title` attributes on
  Mixcloud/SoundCloud `<iframe>` embeds, keyboard-only completion of browse → filter → play flow.
- The dev-only `accented` overlay (imported in `BaseLayout.astro`) surfaces some of these live —
  check its output as a starting point, then verify findings by reading the markup.

### 3. Performance

- Lighthouse performance score and Core Web Vitals (LCP, CLS, INP) per route (home, a genre page,
  a DJ page, a mix detail page with an embed).
- Astro build output (`yarn build`): static vs SSR routes, unused JS/CSS, render-blocking
  third-party scripts, image weight (mix cover images served as raw URLs from the WordPress
  GraphQL API — check for `loading="lazy"`/explicit dimensions).
- GraphQL over-fetching: check queries in `src/lib/queries/` against what each page in
  `src/pages/` actually renders — flag fields fetched but unused, or the same query fired more
  than once per page.
- Mixcloud/SoundCloud embeds are render-blocking third-party iframes by nature — check whether
  any are lazy-loaded behind a click or intersection observer vs. loaded eagerly on every mix
  page.

### 4. SEO / metadata

- `astro-seo` usage per page (title/meta description/canonical/Open Graph tags) — check it's
  applied consistently across `src/pages/` and not just the homepage.
- Presence and correctness of `sitemap`, `robots.txt`, and the RSS feed (`@astrojs/rss`).
- Semantic heading structure per route (the `<h1 class="sr-only">` site title plus per-page
  `<h1>` — check for duplicates or skipped levels, e.g. the `<h2>` elements in
  `header/header.astro`).

### 5. Responsive / UX

- Screenshot each route type at ~375px and ~1280px via `claude-in-chrome` (home, genre list, DJ
  list, nationality list, mix detail with embed, search) — look for layout breaks, especially
  around the Mixcloud/SoundCloud embeds and the nav toggle on mobile.
- Console errors on load/navigation (`read_console_messages`), broken links (dead DJ/genre/
  nationality slugs), dead-end states (e.g. no results after a filter with no guidance).

### 6. Security

- **Injection & XSS**: user-controlled input rendered without escaping (`set:html` in Astro,
  `x-html` in Alpine.js), GraphQL variables built via string interpolation instead of proper
  variables, comment form input rendered unescaped.
- **Secrets & env exposure**: `.env`/`.env.example` — confirm nothing sensitive is prefixed
  `PUBLIC_*` (Astro exposes only `PUBLIC_*` vars client-side), no hardcoded tokens in
  `src/lib/api.ts` or `astro.config.mjs`.
- **Dependency health**: `yarn audit`, and cross-check `renovate.json`'s open PR backlog for
  stale/ignored security updates.
- **HTTP headers**: `vercel.json` for CSP (must allow `frame-src`/`child-src` for Mixcloud/
  SoundCloud origins), `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`.
- No authentication/session layer exists in this app (all data is public, read-only content from
  the external WordPress API) — skip auth/session-handling checks unless a new admin or mutation
  surface has been added since this was written (re-verify, don't assume).

### 7. README / feature alignment

There's no `ROADMAP.md` in this repo. Instead, diff the "Features" list in `README.md` (browse
by DJ/genre/nationality, league of mixes rankings, RSS feed, SEO-friendly sitemap/OpenGraph)
against what's actually live in `main` — flag any feature that's listed but not actually working
end-to-end (e.g. broken sitemap, stale RSS feed, a "league of mixes" page that 404s), and flag
anything live but unlisted that's worth adding to the README.

### 8. Code quality

A passing lint/type-check/build only proves the code compiles cleanly, not that it's precisely
typed, non-duplicated, or free of dead weight — that's what this category covers.

- **Strict typing** — explicit `any`, unsafe `as Type` casts, missing return type annotations on
  exported functions in `src/lib/`, Astro component `Props` interfaces typed as `object` or
  `{}` (or missing entirely), untyped GraphQL response shapes that should use `Post`, `Genre`,
  `DJ`, or `Comment` from `src/types.ts` instead of inline object types.
- **Code duplication** — repeated GraphQL query fragments across `src/lib/queries/` that could
  share a fragment, repeated Astro template blocks (e.g. `<head>` meta, pagination markup)
  across pages, values inlined 3+ times that should be a named constant.
- **Bad patterns** — inline `style=` attributes where a CSS custom property/class already exists
  in `src/styles/`, magic strings (slugs, API paths, status values), `Alpine.data(...)` blocks
  duplicating logic that already exists elsewhere, unhandled promise rejections around
  `fetchGraphQL` call sites, missing null/undefined guards on GraphQL response fields before
  rendering.
- **Dead code** — run `yarn knip` and list genuine findings (cross-check `knip.json`'s
  `ignoreDependencies` list first — `axe`/`wait-on` etc. are intentionally excluded, don't
  re-flag them); commented-out code blocks left in `.astro`/`.ts` files; unused CSS custom
  property declarations in `src/styles/`.

## Notes

- This is a personal/small project — keep findings proportionate. Don't recommend enterprise-
  scale tooling (e.g. a full CI a11y pipeline) as a "blocker"; note it as a "nice to have" instead
  unless it's actually broken for a real user.
- Cite every finding with a route, file:line, or screenshot — no vague "could be improved"
  entries.
- **Every checklist item must be independently reviewable as one small PR** — same spirit as
  the narrower `/quality`, `/security`, `/performance`, `/accessibility`, and `/tests` skills'
  "one fix per PR" approach. If a finding is actually a bundle of unrelated or large changes
  (e.g. "add missing e2e coverage", "improve accessibility across the app", "harden CSP"), split
  it into several separate `- [ ]` lines, each scoped to a single reviewable change (e.g. one
  line per flow's e2e spec, one line per route's a11y fix, one line per header to add). Never
  write a checklist item a reviewer couldn't approve or reject on its own without also weighing
  in on unrelated changes bundled into it.
