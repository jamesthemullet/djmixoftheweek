---
name: security
description: Use this skill when the user types "/security" or asks to review the app for security issues, vulnerabilities, or hardening opportunities. Audits the codebase for security issues and creates GitHub issues — minor findings grouped into one issue, major findings each get their own issue. If nothing worth improving is found, that is an acceptable outcome.
version: 1.0.0
---

# Security Review Skill

You are running a security audit session for DJ Mix Of The Week.

## Stack

- **Astro 6** — server-rendered `.astro` files; pages are statically generated or SSR at request time
- **Alpine.js 3** — lightweight client-side interactivity; no bundler-heavy frameworks
- **GraphQL** — data fetching via `src/lib/api.ts` + queries in `src/lib/queries/`; external WordPress backend
- **Plain CSS** — global stylesheets in `src/styles/`; no CSS-in-JS
- **Mixcloud & SoundCloud embeds** — third-party iframes; not self-hosted
- **Vercel** — deployment with web analytics; static output preferred
- Source files: `src/pages/`, `src/components/`, `src/lib/`, `src/scripts/`, `src/types.ts`
- Config files: `astro.config.mjs`, `.env*`, `package.json`, `vercel.json`

## What to do each invocation

### Step 1 — Audit across all five categories

Read the source files in `src/pages/`, `src/components/`, `src/lib/`, `src/scripts/`, and any config files at the root. Check **all five** of the following categories — do not skip any:

1. **Injection & XSS** — look for: user-controlled input rendered without escaping (`.innerHTML`, `set:html` in Astro, `eval`, `new Function`), GraphQL variables constructed via string interpolation rather than parameterised variables, URL parameters passed directly to queries or rendered raw, dangerously-set HTML in Alpine.js (`x-html` on untrusted data)

2. **Secrets & sensitive data exposure** — look for: API keys, tokens, or credentials hardcoded in source files or committed `.env` files, environment variables referenced client-side (Astro `import.meta.env.PUBLIC_*` vs private vars), secrets logged to the console or included in error responses, `.env*` files not listed in `.gitignore`

3. **Dependency & supply chain risks** — look for: dependencies with known CVEs (check `package.json` versions against common advisories), packages with very wide permissions or unusual post-install scripts, unpinned dependency versions (`*` or `latest`) in `package.json`, use of `npm audit` / `yarn audit` to surface issues

4. **HTTP headers & transport security** — look for: missing or misconfigured `Content-Security-Policy`, missing `X-Frame-Options` or `frame-ancestors` CSP directive (especially relevant given Mixcloud/SoundCloud iframes), no `Strict-Transport-Security` header, missing `Referrer-Policy`, overly permissive CORS configuration in `vercel.json` or Astro middleware

5. **Authentication & access control** — look for: admin or sensitive routes without authentication checks, GraphQL mutations exposed without authorisation, cookies set without `HttpOnly` or `Secure` flags, session tokens stored in `localStorage` instead of cookies, any API endpoints that trust client-supplied identity

### Step 2 — Classify findings

For each finding, assign a severity:

- **Major** — exploitable vulnerability or serious data exposure risk; worth a dedicated issue and fix (e.g. XSS via unescaped user input, a hardcoded API key, a missing auth check on an admin route, a dependency with a known critical CVE)
- **Minor** — defence-in-depth hardening; low direct risk but good hygiene (e.g. a missing security header, an `npm audit` low-severity advisory, an unused env variable left in `.env.example`)

If you find **no issues worth acting on**, state that clearly and stop — do not create GitHub issues.

### Step 3 — Report findings

Output exactly this structure:

```
## Security audit

### Major findings
<numbered list — or "None" if none found>

### Minor findings
<numbered list — or "None" if none found>

### Verdict
<"No action needed" if nothing material was found, otherwise a one-sentence summary of the most critical area>
```

### Step 4 — Create GitHub issues

**Only proceed if at least one finding was reported.**

- For each **major** finding, create a **separate** GitHub issue.
- For all **minor** findings combined, create **one** GitHub issue (skip if there are no minor findings).

Use this command for each major finding:

```bash
gh issue create \
  --title "Security: <short title>" \
  --label "security" \
  --body "## Finding

**Category:** <category name>
**Severity:** Major
**File:** <path:line if applicable>

## Description

<what the vulnerability or exposure is and why it matters>

## Suggested fix

<concrete change — be specific about files, patterns, and any library or header to add>"
```

Use this command for all minor findings grouped together:

```bash
gh issue create \
  --title "Security: minor hardening improvements" \
  --label "security" \
  --body "## Minor security hardening

The following low-risk issues were found during a security audit. Each is individually small but together they improve the security posture of the site.

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

- **GraphQL fetching:** All API calls go through `fetchGraphQL` in `src/lib/api.ts`; queries live in `src/lib/queries/` — injection risks here affect every page that uses the query
- **Environment variables:** Astro exposes only `PUBLIC_*` vars to the client; private vars stay server-side — check that no sensitive var is accidentally prefixed `PUBLIC_`
- **Third-party embeds:** Mixcloud/SoundCloud iframes load from external origins — CSP `frame-src` and `child-src` directives need to allow these origins explicitly
- **Static output:** Most pages are statically generated — traditional server-side auth issues are less relevant, but build-time secret exposure and client-side trust issues still apply
- **Vercel config:** `vercel.json` can set response headers globally — this is the right place to add security headers if not handled by Astro middleware
- **`security` label:** If the label does not exist in the repo, create it first with `gh label create "security" --color "d73a4a" --description "Security vulnerabilities and hardening"`
