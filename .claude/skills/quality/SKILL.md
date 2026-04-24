---
name: quality
description: Use this skill when the user types "/quality" or asks to improve code quality, fix type issues, remove dead code, or improve patterns in this project. Runs one incremental quality improvement per invocation.
version: 1.0.0
---

# Quality Skill

You are running an incremental code quality improvement session for this Astro / Alpine.js / TypeScript project.

## Stack

- **TypeScript strict mode** (`tsconfig.json`) — `strict: true`, `noImplicitAny: true`
- **Astro 6** — server-rendered `.astro` files with optional Alpine.js hydration
- **Alpine.js 3** — lightweight client-side interactivity via `x-data`, `x-model`, `@click`
- **GraphQL** — data fetching via `src/lib/api.ts` + query strings in `src/lib/queries/`
- **Plain CSS** — global stylesheets in `src/styles/`; no CSS-in-JS
- **Biome** — linting (`biome.json`); `organizeImports` enabled
- **Knip** — unused export detection (`knip.json`)
- Source files: `src/pages/`, `src/components/`, `src/lib/`, `src/scripts/`, `src/types.ts`, `src/global.d.ts`

## What to do each invocation

### Step 1 — Pick a category

Use the current second of the clock (or any arbitrary signal) to pick **one** of these four categories. Vary the selection — do not always pick the same one:

1. **Strict typing** — look for: explicit `any`, unsafe `as Type` casts, missing return type annotations on exported functions, non-null assertions (`!`) that could be replaced with proper guards, Astro component props typed as `object` or `{}`, untyped GraphQL response shapes
2. **Code duplication** — look for: identical GraphQL query patterns that could share a fragment, repeated Astro template blocks across pages (e.g. `<head>` meta, pagination markup), values inlined 3+ times that should be a named constant in `src/types.ts` or a shared utility
3. **Bad patterns** — look for: inline `style=` attributes when a CSS class exists or could be added, magic strings (slugs, API paths, status values) that should be named constants, Alpine.js `x-data` objects with logic that duplicates logic already in another component, unhandled promise rejections in `fetchGraphQL` call sites, missing `null`/`undefined` guards on GraphQL response fields before rendering
4. **Dead code** — look for: exported symbols not imported anywhere (cross-check with Knip output), commented-out code blocks left in `.astro` or `.ts` files, unused CSS custom property declarations, imports that are aliased but the alias is never used

### Step 2 — Find the best candidate

Read the relevant source files in `src/pages/`, `src/components/`, `src/lib/`, and `src/scripts/`. Identify the **single clearest, most impactful** instance of the chosen category. Prefer issues that:

- Are in frequently-used files (e.g. `BaseLayout.astro`, `src/lib/api.ts`, `src/types.ts`, index page)
- Have an unambiguous fix
- Won't require changes across many files

### Step 3 — Fix it

Make the fix. Keep scope tight — one issue, one or two files. Do not refactor beyond what is needed to address the specific finding.

### Step 4 — Report

Output exactly this structure:

```
## Quality improvement

**Category:** <chosen category name>
**File:** <path:line>
**Issue:** <one sentence describing the problem>
**Fix:** <what was changed and why>
**Next suggestion:** <the next candidate worth tackling in this category, with file path>
```

## Known project patterns

- **GraphQL fetching:** All API calls go through `fetchGraphQL` in `src/lib/api.ts` — error handling there applies globally; call sites may silently swallow errors worth flagging
- **Astro props:** Props are typed inline in the component frontmatter (`interface Props { ... }`) — missing or overly broad prop interfaces are a signal
- **Alpine.js data:** Client-side state lives in `Alpine.data(...)` blocks in `src/scripts/` or inline `x-data` in `.astro` templates — duplication between these is a smell
- **Types:** Shared interfaces (`Post`, `Genre`, `DJ`, `Comment`) live in `src/types.ts` — using inline object types instead of these is a duplication smell
- **Knip ignore list:** `wait-on` and `axe` are intentionally in `knip.json` `ignoreDependencies` — do not flag these as unused
- **CSS:** Custom properties (`--menu`, `--white`, `--text`, etc.) are defined in `src/styles/` — inline `style=` props that duplicate these are a quality finding
- **No unit tests:** `src/` has no Jest/Vitest setup; quality findings about untested logic belong to `/tests`, not this skill
