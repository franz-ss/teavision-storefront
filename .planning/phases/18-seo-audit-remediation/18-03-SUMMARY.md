---
phase: 18-seo-audit-remediation
plan: 03
subsystem: seo
tags: [seo, metadata, robots, sitemap, blog-indexation, nextjs]

# Dependency graph
requires:
  - phase: 18-seo-audit-remediation
    provides: Plan 18-01 URL parity register and owner/operator handoff boundaries
  - phase: 18-seo-audit-remediation
    provides: Phase 18 metadata, robots, sitemap, and blog indexation decisions
provides:
  - en-AU root HTML language and audit-target absolute title metadata
  - Account/login robots disallows in both disabled and enabled indexing modes
  - Blog tag noindex metadata and sitemap tag URL exclusion
  - Probe-backed owner/SEO handoff evidence for the audit-listed /blog/ simplification
affects: [phase-18, SEO-AUDIT-01, SEO-AUDIT-04, metadata, robots, sitemap, blog]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Next Metadata `title.absolute` for audit-target SEO pages that must bypass the root template
    - SEO probe checks for root language, account robots disallows, tagged blog sitemap exclusion, and Blog Listing URL handoff evidence

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/robots.ts
    - src/app/sitemap.ts
    - src/app/(storefront)/page.tsx
    - src/app/(storefront)/collections/page.tsx
    - src/app/(storefront)/collections/[handle]/page.tsx
    - src/app/(storefront)/collections/[handle]/[category]/page.tsx
    - src/app/(storefront)/blogs/[blog]/_lib/metadata.ts
    - src/app/(storefront)/pages/wholesale/page.tsx
    - src/app/(storefront)/pages/wholesale-account-request/page.tsx
    - src/app/(storefront)/pages/our-story/page.tsx
    - src/app/(storefront)/pages/contact/page.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/page.tsx
    - src/app/(storefront)/pages/private-label-packing/page.tsx
    - src/app/(storefront)/pages/tea-bag-manufacturer/page.tsx
    - src/app/(storefront)/pages/new-product-development-order-form/page.tsx
    - src/app/(storefront)/pages/custom-tea-blends/page.tsx
    - src/lib/blog/operations.test.ts
    - scripts/component-contracts/noindex-mode.test.mjs
    - scripts/seo/probe-launch-seo.mjs
    - scripts/seo/probe-launch-seo.test.mjs
    - docs/launch/seo-audit-remediation.md
    - docs/launch/seo-url-parity-register.md

key-decisions:
  - 'The audit-listed `/blog/` simplification remains an owner/SEO handoff for this plan; no `/blog` app route or redirect was added because the register did not mark it app-owned.'
  - 'Home, collection, collection index, and route-owned service/landing page titles use `title.absolute`; product pages retain the root brand suffix behavior.'
  - 'Robots account/login disallows are enforced in both disabled and enabled indexing modes, while `/search` stays non-indexable through the existing route matrix.'

patterns-established:
  - 'SEO probe contract: live enabled/disabled checks now fail if account disallows, root en-AU language, or tagged blog sitemap exclusion regress.'
  - 'Blog URL audit handoff: `url-audit` reports the Blog Listing URL item and requires remediation docs to record the owner/SEO handoff.'

requirements-completed: [SEO-AUDIT-01, SEO-AUDIT-04]

# Metrics
duration: 16 min
completed: 2026-06-25
---

# Phase 18 Plan 03: Metadata, Robots, Sitemap, Language, Domain, And Blog Indexation Summary

**Probe-backed metadata, robots, sitemap, blog tag noindex, and /blog handoff evidence for SEO-AUDIT-04 and SEO-AUDIT-01**

## Performance

- **Duration:** 16 min
- **Started:** 2026-06-25T11:11:15Z
- **Completed:** 2026-06-25T11:26:50Z
- **Tasks:** 2 completed
- **Files modified:** 23 task files plus this summary and planning state updates

## Accomplishments

- Set the root HTML language to `en-AU`.
- Applied `title.absolute` to homepage, collection pages, collection index, and route-owned service/landing pages so the root `| Teavision` template does not append an unwanted suffix.
- Added account/login robots disallows while preserving disabled-indexing behavior.
- Removed blog tag URLs from the sitemap and made tagged blog listing metadata noindex/follow.
- Recorded the audit-listed `/blog/` simplification as an owner/SEO handoff and made `url-audit` report that item.

## Task Commits

Each task was committed atomically:

1. **Task 1: Apply metadata, language, robots, and sitemap audit rules** - `804d9257` (feat)
2. **Task 2: Implement or explicitly hand off the /blog/ main listing simplification** - `cb307b17` (docs)

**Plan metadata:** recorded by the commit that adds this SUMMARY and state updates.

## Files Created/Modified

- `src/app/layout.tsx` - Root `<html>` now uses `lang="en-AU"`.
- `src/app/robots.ts` - Robots rules disallow `/api/` plus account/login/callback/logout surfaces in all indexing modes.
- `src/app/sitemap.ts` - Sitemap no longer builds or returns tagged blog URLs.
- `src/app/(storefront)/blogs/[blog]/_lib/metadata.ts` - Tagged blog listings set noindex while retaining follow unless the whole blog is noindexed.
- `src/app/(storefront)/page.tsx`, `src/app/(storefront)/collections/**/page.tsx`, and route-owned service/landing pages - Audit-target metadata titles use `title.absolute`.
- `scripts/seo/probe-launch-seo.mjs` - Live probes check account disallows, `en-AU` root language, tagged blog sitemap exclusion, and Blog Listing URL handoff evidence.
- `scripts/seo/probe-launch-seo.test.mjs` and `scripts/component-contracts/noindex-mode.test.mjs` - Source contracts cover the new probe/robots behavior.
- `src/lib/blog/operations.test.ts` - Covers tagged blog noindex metadata and the chosen `/blog` handoff branch.
- `docs/launch/seo-audit-remediation.md` - Adds `### Blog Listing URL` owner/SEO handoff evidence.
- `docs/launch/seo-url-parity-register.md` - Updates stale `/blog/` pending rows to the recorded owner/SEO handoff state.

## Decisions Made

- `/blog/` was not implemented because the URL parity register marks it as an owner/operator handoff rather than an app-owned redirect or route.
- The plan kept product titles on the root brand-suffix template, matching D-13.
- The enabled live probe was run with `SITE_URL` and `NEXT_PUBLIC_SITE_URL` set to `https://www.teavision.com.au` to validate launch-host evidence without hard-coding the host into helpers.

## Verification

- `pnpm test:unit -- "src/lib/blog/operations.test.ts" "src/lib/seo/launch-route-matrix.test.ts"` - passed.
- `node --test scripts/seo/probe-launch-seo.test.mjs` - passed.
- `node scripts/seo/probe-launch-seo.mjs --mode url-audit` - passed with the expected optional owner-export `WARN`.
- `node scripts/seo/probe-launch-seo.mjs --mode disabled --base-url http://127.0.0.1:3000` - passed against a temporary local server with `DISABLE_INDEXING=true`.
- `node scripts/seo/probe-launch-seo.mjs --mode enabled --base-url http://127.0.0.1:3000` - passed against a temporary local server with indexing enabled and launch host env set; expected `WARN` rows remained for the pattern redirect and unset product path.
- Commit hooks for both task commits ran `pnpm lint` and `pnpm test:contracts` successfully.
- `git diff --check` - passed before Task 1 commit.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Applied title.absolute to route-owned static SEO pages**

- **Found during:** Task 1
- **Issue:** D-13 required homepage, collection, and service/landing pages to avoid unwanted root title suffixes, but several route-owned static pages and the collection index still used plain string titles.
- **Fix:** Applied `title: { absolute: ... }` to the collection index and route-owned service/landing pages in the launch/audit surface while leaving product metadata unchanged.
- **Files modified:** `src/app/(storefront)/collections/page.tsx`, `src/app/(storefront)/pages/**/page.tsx`
- **Verification:** `rg 'title:\s*\{\s*absolute' ...`, focused unit tests, enabled live SEO probe, and commit hook lint/contracts.
- **Committed in:** `804d9257`

**2. [Rule 3 - Blocking] Isolated metadata tests from server-only env imports**

- **Found during:** Task 1
- **Issue:** The new tagged blog metadata unit test pulled `server-only` through `withNoindexRobots()`, which blocked Vitest import in the existing focused command.
- **Fix:** Mocked `@/lib/seo/noindex` as an identity wrapper in `src/lib/blog/operations.test.ts`.
- **Files modified:** `src/lib/blog/operations.test.ts`
- **Verification:** `pnpm test:unit -- "src/lib/blog/operations.test.ts" "src/lib/seo/launch-route-matrix.test.ts"`
- **Committed in:** `804d9257`

**3. [Rule 3 - Blocking] Updated stale noindex contract for expanded robots disallows**

- **Found during:** Task 1 commit hook
- **Issue:** `scripts/component-contracts/noindex-mode.test.mjs` still asserted a literal `disallow: ['/api/']`, blocking the expanded account/login robots rules required by the plan.
- **Fix:** Updated the contract to require `DISALLOWED_PATHS` and each required disallow path.
- **Files modified:** `scripts/component-contracts/noindex-mode.test.mjs`
- **Verification:** `node --test scripts/component-contracts/noindex-mode.test.mjs` and commit hook `pnpm test:contracts`
- **Committed in:** `804d9257`

**4. [Rule 1 - Bug] Cleared stale pending /blog register state**

- **Found during:** Task 2
- **Issue:** The URL parity register still said Plan 18-03 must decide `/blog/` after the chosen branch documented owner/SEO handoff.
- **Fix:** Updated the register's no-op parity, owner/operator handoff, and residual-risk rows to the recorded handoff state.
- **Files modified:** `docs/launch/seo-url-parity-register.md`
- **Verification:** `node scripts/seo/probe-launch-seo.mjs --mode url-audit`
- **Committed in:** `cb307b17`

---

**Total deviations:** 4 auto-fixed (1 missing critical, 1 bug, 2 blocking)
**Impact on plan:** All fixes supported the planned metadata/indexation evidence and did not add speculative redirects, schema, or URL taxonomy.

## Issues Encountered

- PowerShell treated bracketed App Router path segments as wildcards during reads; reran those reads with `-LiteralPath`.
- The live probe server command initially used `pnpm dev -- --port 3000`, which Next interpreted as a project directory. Reran with `pnpm dev --port 3000`.
- Stopping the `cmd.exe` wrapper did not stop the spawned Next child on the first disabled-mode run; the child was stopped explicitly by the process listening on port 3000. No server was left running.
- Task 2's first commit attempt failed on import ordering in `src/lib/blog/operations.test.ts`; imports were reordered and verification passed before retrying.

## Authentication Gates

None.

## Known Stubs

None. The stub scan found only local accumulator/default-argument patterns in Node probe/test code, not placeholder UI/data or unfinished behavior.

## User Setup Required

None. Owner/SEO migration export, `/blog/` canonical decision, production host redirects, Shopify-domain behavior, and Search Console proof remain explicit owner/operator-gated launch evidence items.

## Next Phase Readiness

Plan 18-04 can build structured-data coverage on top of the updated SEO probe. Plan 18-05 should use the new live probe rows as metadata/indexation evidence while keeping `/blog/` in the owner/SEO handoff column unless a dated owner decision changes it.

## Self-Check: PASSED

- Summary file created at `.planning/phases/18-seo-audit-remediation/18-03-SUMMARY.md`.
- Task commits exist: `804d9257`, `cb307b17`.
- Key files exist: `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/(storefront)/blogs/[blog]/_lib/metadata.ts`, `docs/launch/seo-audit-remediation.md`.
- Plan verification commands passed, including live disabled/enabled SEO probes and URL audit evidence.
- No accidental tracked deletions were introduced by task commits.

---

_Phase: 18-seo-audit-remediation_
_Completed: 2026-06-25_
