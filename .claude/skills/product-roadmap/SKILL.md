---
name: product-roadmap
description: Build or refresh a product roadmap for DJ Mix of the Week (djmixoftheweek) — new features, pages, and content, PLUS making existing content easier to find, SEO, and improvements to features/pages that already exist — grounded in what the app already has. Writes a plain markdown ROADMAP.md at the repo root, grouped into Now/Next/Later, with each feature broken into a sequence of ~15-minute-reviewable PR steps. Use when the user asks for a roadmap, growth ideas, "what should we build next", or to update/rescope the existing roadmap — not for auditing existing code health (use /full-audit if present) or pitching a single feature.
---

# Product roadmap

Produces (or refreshes) **`ROADMAP.md`** at the repo root for `djmixoftheweek`: an Astro 7 site
(Alpine.js islands, `astro-seo`, RSS feed, Vercel) for discovering and browsing DJ mixes by DJ,
genre, and nationality, with a "League of Mixes" ranking page. Roadmap items are scored against
what actually moves the site forward, and broken into small enough steps that a human can review
each one in about 15 minutes. This is not only new features — it must always also cover:

- **Findability** — making existing content (DJs, genres, nationalities, individual mixes)
  easier to discover: internal linking, related mixes, better navigation between DJ/genre/
  nationality pages.
- **SEO** — beyond one-off hygiene fixes (those belong in `AUDIT.md` if the finding already
  exists there), roadmap-level SEO plays: structured data for mixes, indexability, content that
  targets underused search intent.
- **Improving what already exists** — a live-but-underbaked page (e.g. `league-of-mixes.astro`
  has no filtering, `your-djs.astro` has no notifications) is as valid a roadmap item as a
  brand-new one.

## Grounding the roadmap in the real app

Before inventing features, read the actual site:

- `README.md` — stated features: browse by DJ/genre/nationality, League of Mixes rankings, RSS
  feed, SEO (sitemap/OpenGraph).
- `AUDIT.md` if present — don't duplicate known bugs/gaps as roadmap features; those are health
  fixes.
- `package.json` — confirm what infra doesn't exist yet (no email/push/analytics packages seen)
  before proposing a feature that assumes it does.
- `Glob`/`get_file_contents` over `src/pages/**/*.astro` — real pages: `index`, `djs`, `dj/`,
  `genres`, `genre/`, `nationalities`, `nationality/`, `dj-leaderboard`, `league-of-mixes`,
  `your-djs` (an existing followed-DJs feature — a natural anchor for retention features), `rss.xml.js`.

Every feature description should be traceable to something concrete in the repo it builds on.

## Output format

Plain markdown, not an HTML artifact. Write directly to `ROADMAP.md` at the repo root,
overwriting the previous version (git history preserves prior versions).

Structure:

1. **Intro** — one short paragraph naming the gap, followed by scoring lenses as a bullet list:
   - **Acquisition** — brings new visitors in
   - **Engagement** — deepens a single visit
   - **Retention** — earns a repeat visit
   - **Fun** — no metric, just delight
2. **PR-sequence explainer** — one paragraph: every feature is broken into a PR sequence sized
   for ~15-minute human review; genuinely atomic changes stay as one PR.
3. **Now / Next / Later** sections by effort/infra needed.
4. Each feature: `### N. Name — *Goal tags*` heading, one-line description, numbered PR-step list.
5. **Mise en place** table at the end — shared infra prerequisites, if any are proposed.
6. Footer: `*DJ Mix of the Week — product roadmap, <today's date>*`.

## Breaking a feature into PR steps

Sequence data layer → business logic → UI → wiring, splitting wherever a step could stand alone:

- A pure function (query, formatter) plus its unit tests is its own step.
- New UI is its own step, built against existing or stubbed data.
- A step needing new human-written content (copy, editorial curation) gets a GitHub issue via
  `mcp__github__create_issue` rather than a PR, referenced from the roadmap line.
- If a feature is small enough that splitting produces nothing independently reviewable, write
  **"One PR."** instead.
- This repo has no feature-flag system (`featureFlags.ts`) like `rdldn` does — don't propose
  gating behind flags unless the user asks for one to be built first.

The 15-minute bar is a guideline, not a hard rule.

## Notes

- This is a personal/small project — don't propose enterprise-scale features as "Now"/"Next".
- Don't re-propose anything already tracked as an open item in `AUDIT.md`.
- Do not commit, push, or open a PR for `ROADMAP.md` changes unless the user explicitly asks.
