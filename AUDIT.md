# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- 2026-09-01 — initial audit: 62 findings (7 test coverage, 5 accessibility, 3 performance, 12 SEO, 5 responsive/UX, 13 security, 5 README alignment, 21 code quality)
- 2026-09-01 — resolved: `src/lib/queries/getDJBySlug.ts` unit coverage (test coverage section)
- 2026-09-02 — resolved test coverage item 2: added unit coverage for `getDJsWithRatings` query
- 2026-09-05 — resolved test coverage item: `src/lib/api.ts`'s `fetchGraphQL` error paths (fetch rejection, malformed JSON)
- 2026-09-15 — resolved test coverage item: `src/scripts/load-more.ts` unit coverage (cursor tracking, DOM construction, error recovery)
- 2026-09-16 — resolved test coverage item: `src/scripts/fav-djs.ts` unit coverage (Alpine store init from localStorage, toggle add/remove, has())
- 2026-09-17 — resolved accessibility item: mix detail route `frame-title` violation (SoundCloud/Mixcloud embeds and in-content iframes now get a `title` attribute)
- 2026-09-18 — resolved accessibility item: `color-contrast` violation on `.share-button--whatsapp`/`--bluesky` in `src/styles/post.css`
- 2026-09-19 — resolved accessibility item: added a visually-hidden `<label>` for the search input in `src/components/search/search.astro`

## 1. Test coverage — unit gaps and e2e

- [x] `src/lib/queries/getDJBySlug.ts` has 0% unit coverage, unlike sibling query files (found: 2026-09-01) (resolved: 2026-09-01, PR #382)
- [x] `src/lib/queries/getDJsWithRatings.ts` has 0% unit coverage — no assertions on its query string/operation name (found: 2026-09-01) (resolved: 2026-09-02, PR #384)
- [x] `src/lib/queries/getNationalityNames.ts` has 0% unit coverage, untested alongside its DJ/genre counterparts (found: 2026-09-01)
- [x] `src/lib/constants.ts` has 0% unit coverage (e.g. `FEATURED_IMAGE_SIZE` never asserted/exercised) (found: 2026-09-01)
- [x] `src/scripts/load-more.ts` has 0% unit coverage — cursor tracking, `endCursor` update, empty-cursor button-hide behavior, DOM fragment construction, and the `catch` error-recovery path are entirely untested at the unit level (found: 2026-09-01) (resolved: 2026-09-15, PR #402)
- [x] `src/scripts/fav-djs.ts` has 0% unit coverage — no unit test exercises its logic at all (found: 2026-09-01) (resolved: 2026-09-16, PR #403)
- [x] `src/lib/api.ts`'s `fetchGraphQL` has no test for `fetch()` itself rejecting/throwing (network failure) or `response.json()` throwing on malformed JSON (found: 2026-09-01) (resolved: 2026-09-05, PR #389)
- [ ] Add e2e spec: clicking a nationality on the nationalities page navigates to that nationality and lists posts (mirroring `genres.spec.ts`) — no spec currently touches `/nationalities` or `/nationality/[slug]` (found: 2026-09-01)
- [ ] Add e2e spec: load-more button appends posts to the list on a genre page — load-more is currently only tested on the homepage list (found: 2026-09-01)
- [ ] Add e2e spec: DJ filter select navigates to the selected DJ page — filter-select navigation is currently tested only for the genre filter on the homepage (found: 2026-09-01)
- [ ] Add e2e spec: nationality filter select navigates to the selected nationality page (found: 2026-09-01)
- [ ] Add e2e spec: search returns matching results and navigates to the selected post — `src/components/search/search.astro` has no e2e spec at all (found: 2026-09-01)
- [ ] Add e2e spec: GET /rss.xml returns valid RSS XML with expected post entries — no e2e/integration spec currently covers `src/pages/rss.xml.js` (found: 2026-09-01)

## 2. Accessibility

- [x] Mix detail route (e.g. `/al-wootton-crack-mix-607`): axe-core reports a `frame-title` violation (serious) — the SoundCloud/Mixcloud embeds and in-content YouTube iframes lack a `title`/accessible name; fix in `src/pages/[...slug].astro` embed rendering (~lines 220-223) (found: 2026-09-01) (resolved: 2026-09-17, PR #405)
- [x] Mix detail route: axe-core reports a `color-contrast` violation (serious) on CMS-sourced links and `.share-button--whatsapp` — check contrast of `.share-button--whatsapp`/`--bluesky`/`--threads` in `src/styles/post.css` against the site's purple theme (found: 2026-09-01) (resolved: 2026-09-18, PR #409)
- [x] `src/components/search/search.astro:6` — the search `<input id="search-input">` has no associated `<label for="search-input">`, only a placeholder (found: 2026-09-01) (resolved: 2026-09-19, PR #412)
- [ ] `src/components/addComment.astro:32` — the comment submit-result message has no `aria-live` region so screen-reader users aren't told success/failure; mirror the `role="status" aria-live="polite"` pattern already used in `header.astro:56` (found: 2026-09-01)

## 3. Performance

- [ ] `src/pages/[...slug].astro:221,223` — SoundCloud/Mixcloud embeds are injected via `set:html` with no `loading="lazy"` or click/intersection-observer gating; SoundCloud iframe loads eagerly on every mix page (found: 2026-09-01)
- [ ] `src/pages/index.astro:117` — `{genre?.name} ({genre?.count})` has no null-guard, so the "Georgia" genre renders as "Georgia ()" in the genre `<select>`; guard with `?? 0` as already done in `genres.astro:40` (found: 2026-09-01)

## 4. SEO / metadata

- [ ] `src/pages/genres.astro:20` passes `pageTitle="Home"` to `BaseLayout` — wrong/duplicate title identical to the actual homepage (found: 2026-09-01)
- [ ] `src/pages/index.astro`, `djs.astro`, `genres.astro`, `nationalities.astro`, `dj-leaderboard.astro` pass no `description` prop to `BaseLayout`, so all fall back to the same generic homepage description (`BaseLayout.astro:27`) (found: 2026-09-01)
- [ ] `src/pages/about.astro:22` and `src/pages/league-of-mixes.astro:71` read `singlePost?.seo.opengraphDescription` without optional-chaining `.seo`, so a resolved `singlePost` with undefined `.seo` throws instead of degrading to the fallback (found: 2026-09-01)
- [ ] `src/layouts/BaseLayout.astro:32` OG `image` always falls back to the same `blog-placeholder-1.jpg`; no page in `src/pages/dj/[...slug].astro`, `genre/[...slug].astro`, or `nationality/[...slug].astro` passes a real `opengraphImage` (found: 2026-09-01)
- [ ] No `@astrojs/sitemap` integration is used (not in `package.json`); `src/pages/sitemap.xml.js` hand-rolls the feed instead of producing the conventional sitemap-index/sitemap-0 pair (found: 2026-09-01)
- [ ] `src/pages/sitemap.xml.js` static-pages list omits `/djs`, `/nationalities`, `/your-djs`, `/dj-leaderboard`, and all dynamic `dj/*`, `genre/*`, `nationality/*` routes (found: 2026-09-01)
- [ ] No `public/robots.txt` exists anywhere in the repo, so there's no reference pointing crawlers at `/sitemap.xml` (found: 2026-09-01)
- [ ] `src/pages/rss.xml.js` calls `getCollection("blog")` against a local `astro:content` collection that has no actual entries (`src/content/blog/` doesn't exist) — the RSS feed is disconnected from the real WordPress GraphQL content and renders empty with placeholder title/description (found: 2026-09-01)
- [ ] `src/components/header/header.astro` renders three `<h2>` elements ("Search:", "Recently visited", "Be notified of new posts by e-mail") between the sr-only site `<h1>` and the page's own `<h1>`, producing an out-of-order H1 → H2 → H2 → H2 → H1 pattern (found: 2026-09-01)
- [ ] `src/pages/league-of-mixes.astro:84` uses `<h2>{singlePost?.title}</h2>` for its main content title instead of an `<h1>` — this page has no real page-level `<h1>` (found: 2026-09-01)

## 5. Responsive / UX

- [ ] `src/pages/djs.astro` DJ list links use relative `href="dj/al-wootton"` (no leading slash) rather than `/dj/al-wootton` like `[...slug].astro`'s DJ byline — fragile if this link markup is ever reused from a nested route (found: 2026-09-01)
- [ ] Manual mobile-viewport (≈375px) screenshot pass of genre/DJ/nationality/search routes was not completed in this audit (tooling limitation) — recommend a manual check to confirm the `header.css` `max-width:835px` hamburger-nav breakpoint renders correctly (found: 2026-09-01)

## 6. Security

- [ ] `src/pages/[...slug].astro:220` renders `processContent(singlePost.content)` via `set:html` with no HTML sanitization (only string `.replace()` URL-rewriting) — full WP post HTML injected unescaped, unlike `comment.astro` which sanitizes with `sanitize-html` (found: 2026-09-01)
- [ ] `src/pages/[...slug].astro:221,223` (`sanitizeEmbed`) validates only the iframe `src` hostname and returns the entire matched `<iframe>` HTML unescaped — other injected attributes (e.g. `onload=`) in the WP-sourced embed string would pass through untouched (found: 2026-09-01)
- [ ] `src/pages/[...slug].astro:192` and `src/pages/nationality/[...slug].astro:104` render `featuredImage.node.caption` via `set:html` with no sanitization at all (found: 2026-09-01)
- [ ] `src/pages/about.astro:36` and `src/pages/league-of-mixes.astro:85` render `singlePost?.content` via `set:html` with no sanitization at all (found: 2026-09-01)
- [ ] `src/pages/dj-leaderboard.astro:101`, `src/pages/genres.astro:38`, `src/pages/nationalities.astro:37` use Alpine `x-html="dj.name"`/`"genre.name"`/`"nationality.name"` for plain taxonomy-name strings — unnecessary XSS surface where `x-text` would suffice (found: 2026-09-01)
- [ ] `src/components/addComment.astro` submits comments directly to the public WP GraphQL `createComment` mutation with no CSRF token, rate limiting, or CAPTCHA — a genuine public mutation surface exposed to spam/abuse (found: 2026-09-01)
- [ ] `yarn audit` reports a moderate advisory in `sanitize-html@2.17.0` (CVE-2026-53606); `renovate.json` explicitly disables updates for `sanitize-html` and `nanoid`, so this and future CVEs in it won't be auto-patched (found: 2026-09-01)
- [ ] CSP `script-src` in `vercel.json` includes `'unsafe-inline' 'unsafe-eval'`, substantially weakening XSS mitigation for the `set:html`/`x-html` gaps above (found: 2026-09-01)

## 7. README / feature alignment

- [ ] README claims an "RSS feed" feature, but `src/pages/rss.xml.js` is wired to an empty local `getCollection("blog")` rather than the site's real GraphQL mix data, so it outputs the default Astro-starter title/description with zero items (found: 2026-09-01)
- [ ] README claims "SEO-friendly with sitemap and OpenGraph data" but `src/pages/sitemap.xml.js`'s static-pages list omits several live routes (`djs`, `genres` subpages, `nationalities`, `dj-leaderboard`, `your-djs`, `dj/[slug]`, `nationality/[slug]`) (found: 2026-09-01)
- [ ] `src/pages/dj-leaderboard.astro` (a DJ leaderboard/average-rating page, distinct from "league of mixes") is live and working but not mentioned in README's Features list (found: 2026-09-01)
- [ ] `src/pages/your-djs.astro` is live and working but not mentioned in README's Features list (found: 2026-09-01)

## 8. Code quality

- [ ] `src/lib/api.ts:1` — `fetchGraphQL` return type is `Promise<any>`, so every call site loses type safety for the GraphQL response (found: 2026-09-01)
- [ ] `src/pages/about.astro:14` and `src/pages/league-of-mixes.astro:15` destructure `fetchGraphQL(GET_SINGLE_PAGE, ...)` results with no type annotation (found: 2026-09-01)
- [ ] `src/pages/genres.astro:12` — `allGenres` fetch result is untyped; should use `Genres` from `src/types.ts` (found: 2026-09-01)
- [ ] `src/pages/nationalities.astro:12` — `allNationalities` fetch result is untyped; should use `Nationalities` type (found: 2026-09-01)
- [ ] `src/pages/[...slug].astro:131` — `genreData` from `fetchGraphQL` is an untyped inline shape instead of `Genre` (found: 2026-09-01)
- [ ] `src/pages/index.astro:19-20,47` — three `fetchGraphQL` calls with no result typing (found: 2026-09-01)
- [ ] `src/pages/nationality/[...slug].astro:51` — `matching.posts.nodes as Post[]` is an unsafe cast masking an untyped upstream response instead of typing the fetch itself (found: 2026-09-01)
- [ ] `src/components/comment.astro:11` declares `Props` as `type` while `addComment.astro:2`/`comments.astro:2` use `interface Props` — inconsistent convention (found: 2026-09-01)
- [ ] `src/pages/dj/[...slug].astro` and `src/pages/genre/[...slug].astro` are ~95% duplicated (fetch-loop pagination, sort UI, template markup, x-data JSON building) — candidate for a shared component/layout (found: 2026-09-01)
- [ ] `src/lib/queries/getDJBySlug.ts:7-46` and `src/lib/queries/getGenreBySlug.ts:7-46` duplicate an identical `posts { nodes {...} pageInfo {...} }` selection set verbatim — candidate for a shared GraphQL fragment (found: 2026-09-01)
- [ ] `src/lib/queries/morePosts.ts`, `mostRecentPost.ts`, `otherPostsAfterFirst.ts` all repeat the same `posts.nodes` field selection, differing only by pagination args (found: 2026-09-01)
- [ ] `postsFirst: 100`/`first: 100` is inlined across 10+ call sites in `src/pages/dj/[...slug].astro`, `genre/[...slug].astro`, and multiple `src/lib/queries/*.ts` files — should be a named `DEFAULT_PAGE_SIZE` constant (found: 2026-09-01)
- [ ] `'/404'` redirect string is repeated 5 times across `src/pages/dj/[...slug].astro`, `genre/[...slug].astro`, `nationality/[...slug].astro`, `[...slug].astro` — should be a named constant (found: 2026-09-01)
- [ ] `` `${import.meta.env.PUBLIC_API_BASE_URL}/graphql` `` is duplicated in `src/lib/api.ts:2` and re-implemented directly in `src/components/comments.astro:62`, bypassing the `fetchGraphQL` helper and its error handling (found: 2026-09-01)
- [ ] `src/components/footer/footer.astro:49` and `src/components/header/header.astro:88` both hand-roll an identical `fetch` to `/wp-json/custom/v1/subscribe` — candidate for a shared helper (found: 2026-09-01)
- [ ] `src/components/comments.astro:86,91` sets `message.style.color = 'red' | 'green'` via inline JS instead of toggling a CSS status class (found: 2026-09-01)
- [ ] `src/consts.ts:4-5` — `SITE_TITLE = "Astro Blog"` and `SITE_DESCRIPTION = "Welcome to my website!"` are unedited Astro-starter boilerplate, still live in `src/pages/rss.xml.js:8-9`, producing a wrong site title/description in the RSS feed (found: 2026-09-01)
- [ ] `src/components/comment.astro:2-3` — `biome-ignore-all` comments left with placeholder text `<explanation>` rather than a real justification or the underlying issue being fixed (found: 2026-09-01)
- [ ] `knip.json:7` — `ignoreBinaries: ["wait-on", "axe"]` is flagged by `yarn knip`'s own "Configuration hints" as unnecessary and should be removed (found: 2026-09-01)
- [ ] `src/pages/your-djs.astro:13` and `:34` inline `style="display:none"` for Alpine `x-show` gating instead of a shared `.hidden`/utility class (found: 2026-09-01)
