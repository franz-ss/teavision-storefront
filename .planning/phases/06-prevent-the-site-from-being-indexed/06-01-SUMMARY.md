---
phase: 06-prevent-the-site-from-being-indexed
plan: 01
status: complete
completed_at: "2026-06-03T10:20:42+08:00"
requirements:
  - ROADMAP-06
key-files:
  created:
    - src/lib/seo/noindex.ts
    - scripts/component-contracts/noindex-mode.test.mjs
  modified:
    - .env.example
    - src/app/layout.tsx
    - src/app/robots.ts
    - src/app/sitemap.ts
    - src/app/not-found.tsx
    - src/app/(storefront)/page.tsx
    - src/app/(storefront)/collections/page.tsx
    - src/app/(storefront)/collections/[handle]/page.tsx
    - src/app/(storefront)/products/[handle]/page.tsx
    - src/app/(storefront)/pages/[...slug]/page.tsx
    - src/app/(storefront)/pages/contact/page.tsx
    - src/app/(storefront)/pages/our-story/page.tsx
    - src/app/(storefront)/pages/custom-tea-blends/page.tsx
    - src/app/(storefront)/pages/wholesale/page.tsx
    - src/app/(storefront)/cart/page.tsx
    - src/app/(storefront)/search/page.tsx
    - src/app/(storefront)/blogs/[blog]/_lib/metadata.ts
    - src/app/(storefront)/blogs/[blog]/[article]/page.tsx
metrics:
  tasks_completed: 4
  tests_added: 2
---

# 06-01 Summary: Environment-Controlled Noindex Mode

## Result

Implemented a reversible `DISABLE_INDEXING=true` launch gate that layers `noindex, nofollow, noarchive` metadata across storefront pages, suppresses sitemap URLs while enabled, and keeps robots.txt from hiding HTML pages from crawlers.

## What Changed

- Added `src/lib/seo/noindex.ts` with `isNoindexModeEnabled()` and `withNoindexRobots()`.
- Documented `DISABLE_INDEXING=false` in `.env.example`.
- Wrapped root metadata, public route metadata, dynamic product/collection/page metadata, blog listing/article metadata, search metadata, cart metadata, and not-found metadata with the shared helper.
- Updated `src/app/robots.ts` so enabled mode keeps `/api/` disallowed, keeps `/` crawlable, and suppresses the sitemap reference.
- Updated `src/app/sitemap.ts` so enabled mode returns an empty sitemap before Shopify or Sanity fetches.
- Added `scripts/component-contracts/noindex-mode.test.mjs` after first observing it fail against the missing implementation.

## Verification

Passed:

- `node --test scripts/component-contracts/noindex-mode.test.mjs` failed first for the expected missing helper/route wiring.
- `node --test scripts/component-contracts/noindex-mode.test.mjs`
- `pnpm lint`
- `pnpm test:contracts`
- `$env:DISABLE_INDEXING='true'; pnpm build`
- `Remove-Item Env:DISABLE_INDEXING -ErrorAction SilentlyContinue; pnpm build`

Enabled-mode HTTP checks passed against `next start` on `http://localhost:3008` after building with `DISABLE_INDEXING=true`:

- `/robots.txt` returned `Allow: /`, `Disallow: /api/`, and no `Sitemap:` line.
- `/sitemap.xml` returned a valid empty sitemap with `locCount=0`.
- `/`, `/products/organic-coldandflu-tea`, `/collections/wholesale-bulk-tea`, `/pages/wholesale`, `/blogs/teavision-blogs/how-cafes-and-restaurants-can-create-signature-blends-using-bulk-spices`, `/search`, and `/cart` each emitted `noindex, nofollow, noarchive` in the robots meta tag when requested with a crawler-like user agent.

Disabled-mode HTTP checks passed against the pre-existing local dev server on `http://localhost:3000`:

- `/robots.txt` still advertised `https://teavision.com.au/sitemap.xml`.
- `/sitemap.xml` returned public URLs with `locCount=490`.

The temporary production server on port 3008 was stopped after verification. The pre-existing dev server on port 3000 was left running.

## Commits

| Commit | Description |
| ------ | ----------- |
| Not created | Commit deferred because the git index already contained a large pre-existing staged Phase 5/source bundle before Phase 6 execution began. Creating a Phase 6 commit would have included unrelated staged work. |

## Deviations from Plan

**[Rule 2 - Missing critical verification] Added contract coverage** - Found during: Task 1. The plan did not list a test file, but TDD guidance required a failing test before production behavior changes. Added `scripts/component-contracts/noindex-mode.test.mjs` and verified it failed before implementation, then passed after wiring.

**Total deviations:** 1 auto-fixed verification gap.
**Impact:** Positive. The noindex behavior now has a lightweight contract test in the existing contract suite.

## Residual Risks

- `DISABLE_INDEXING` is evaluated during build for statically generated metadata, so gated deployments must set `DISABLE_INDEXING=true` before building or deploying.
- The implementation is complete but uncommitted because unrelated changes were already staged. Stage and commit Phase 6 separately after the existing staged bundle is resolved.

## Self-Check: PASSED

- Shared helper exists and is imported by metadata, robots, and sitemap routes.
- Enabled mode emits noindex/nofollow/noarchive on representative public routes.
- Enabled mode does not advertise sitemap URLs and returns an empty sitemap.
- Disabled mode restores existing robots and sitemap behavior.
- Lint, contract tests, and both enabled/disabled production builds pass.
