---
phase: 23-preview-revalidation-and-no-regression-release
plan: 01
subsystem: homepage-preview-release
tags: [sanity, homepage, draft-mode, revalidation, pagespeed-gate]
requires:
  - phase: 21
    provides: Sanity `homePage` singleton and seed model
  - phase: 22
    provides: Typed CMS-backed storefront homepage rendering
provides:
  - Secure homepage-only Draft Mode entry and disable routes
  - Isolated Sanity draft homepage data access
  - Signed Sanity `homePage` cache revalidation
  - Published-safe homepage metadata and JSON-LD behavior under Draft Mode
  - Blocked-by-default public-preview PSI and Sanity publish release gate
affects: [homepage-rendering, sanity-webhooks, release-gates, v1.6]
tech-stack:
  added: []
  patterns:
    - Draft preview reads use a separate token-backed Sanity drafts client and never share published cache tags.
    - Draft Mode affects homepage body data only; metadata and JSON-LD stay published-owned.
    - Sanity webhooks use `revalidateTag(tag, { expire: 0 })` for immediate external publish invalidation.
key-files:
  created:
    - src/app/api/draft/route.ts
    - src/app/api/draft/route.test.ts
    - src/app/api/draft/disable/route.ts
    - src/app/api/draft/disable/route.test.ts
    - docs/launch/phase-23-homepage-release-gate.md
    - .planning/phases/23-preview-revalidation-and-no-regression-release/23-REVIEW.md
    - .planning/phases/23-preview-revalidation-and-no-regression-release/23-01-SUMMARY.md
  modified:
    - src/lib/sanity/env.ts
    - src/lib/sanity/client.ts
    - src/lib/sanity/home-page.ts
    - src/lib/sanity/home-page.test.ts
    - src/app/(storefront)/page.tsx
    - src/app/(storefront)/page.test.tsx
    - src/app/api/webhooks/sanity/route.ts
    - src/app/api/webhooks/sanity/route.test.ts
    - src/lib/observability/logger.ts
    - src/lib/observability/logger.test.ts
    - package.json
    - .planning/phases/23-preview-revalidation-and-no-regression-release/23-VALIDATION.md
key-decisions:
  - "Real public-preview PSI remains the score of record; local tests prove deploy readiness only."
  - "Draft preview is secret URL based and homepage-only; no Studio preview action, Visual Editing, stega, or in-page preview UI was added."
  - "Rollout remains blocked until current public-preview PSI and Sanity publish smoke-test evidence are recorded."
patterns-established:
  - "Preview routes validate server configuration separately from caller mistakes and log metadata only."
  - "Release gates separate automated local evidence from owner/deployment evidence."
requirements-completed: [DATA-03, PREVIEW-01, PREVIEW-02, QUALITY-02, QUALITY-03]
duration: 21 min implementation plus verification closeout
completed: 2026-07-03
---

# Phase 23 Plan 01: Preview, Revalidation, And Release Gate Summary

**Homepage Draft Mode preview, signed Sanity publish revalidation, and a blocked-by-default no-regression release gate now protect the CMS-backed homepage rollout.**

## Performance

- **Duration:** 21 min implementation plus verification closeout
- **Started:** 2026-07-03T10:50:40+08:00
- **Completed:** 2026-07-03T11:10:33+08:00 for final integration evidence; docs closeout followed
- **Tasks:** 6
- **Files modified:** 16 implementation/docs files plus planning validation/review/summary artifacts

## Accomplishments

- Added `getDraftHomepage()` through a separate token-backed Sanity drafts client while leaving published `getHomepage()` cached and tagged.
- Added secure `/api/draft` and `/api/draft/disable` route handlers with timing-safe secret validation, exact `/` slug gating, draft document existence checks, and metadata-only observability.
- Rendered draft homepage body content when Draft Mode is enabled while keeping metadata, noindex handling, canonical, and Organization/WebSite JSON-LD on the published path.
- Extended the signed Sanity webhook so `_type: homePage` immediately invalidates `homePage` and `sanity-homepage` tags without regressing blog/article invalidation.
- Added `docs/launch/phase-23-homepage-release-gate.md` with v1.5 PSI baselines, blocked-by-default rollout status, owner/deployment evidence fields, Sanity publish smoke-test checklist, and rollback rule.

## Task Commits

Each implementation task was committed atomically:

1. **Task 1: Isolated draft homepage data access** - `727b7b5f` red tests, `e71e2163` implementation.
2. **Task 2: Secure Draft Mode routes** - `9c830332` red tests, `5be79644` implementation.
3. **Task 3: Draft Mode body rendering with published-safe SEO** - `b3582f11` red tests, `b4ad0e1b` implementation.
4. **Task 4: Signed Sanity homepage webhook revalidation** - `f64f9304` red tests, `15035460` implementation.
5. **Task 5: No-regression release gate evidence** - `f214c679`.
6. **Task 6 auto-fix: Final typecheck repair** - `c0852302`.

**Plan metadata:** pending this docs commit.

## Files Created/Modified

- `src/lib/sanity/env.ts` - Adds required draft read token and preview secret accessors.
- `src/lib/sanity/client.ts` - Adds draft Sanity client and `sanityDraftFetch()`.
- `src/lib/sanity/home-page.ts` - Adds uncached `getDraftHomepage()` through the existing homepage reshape and validation path.
- `src/app/api/draft/route.ts` - Enables Draft Mode only for valid, document-backed homepage preview requests.
- `src/app/api/draft/disable/route.ts` - Disables Draft Mode and redirects home.
- `src/app/(storefront)/page.tsx` - Switches body content to draft data when Draft Mode is enabled; metadata remains published-only.
- `src/app/api/webhooks/sanity/route.ts` - Adds `homePage` tag invalidation while preserving blog behavior.
- `src/lib/observability/logger.ts` - Registers draft preview observability event names.
- `package.json` - Includes draft and Sanity webhook route tests in `test:integration`.
- `docs/launch/phase-23-homepage-release-gate.md` - Records release baseline, current-result placeholders, owner/deployment proof, and rollback rule.
- `.planning/phases/23-preview-revalidation-and-no-regression-release/23-VALIDATION.md` - Records executed automated evidence and owner-gated release approval.
- `.planning/phases/23-preview-revalidation-and-no-regression-release/23-REVIEW.md` - Code-review gate with no actionable findings.

## Automated Verification

- `pnpm test:unit -- src/lib/sanity/home-page.test.ts "src/app/(storefront)/page.test.tsx"` - passed, 69 files / 297 tests.
- `pnpm test:integration` - passed, 12 files / 59 tests.
- `pnpm lint --quiet` - passed; Tailwind class check and ESLint completed.
- `pnpm exec eslint . --quiet` - passed as direct confirmation after the planned `pnpm lint -- --quiet` syntax forwarded a literal `--` to ESLint.
- `pnpm typecheck` - passed after `c0852302`.
- `pnpm build` - passed with Next.js 16.2.9 and Cache Components enabled.
- Code review - passed with no actionable findings in `23-REVIEW.md`.

## Release Evidence

- Launch decision is `Blocked - awaiting public-preview PSI`.
- v1.5 baseline recorded: Performance 95-97, Accessibility 100, Best Practices 100, SEO 100, Speed Index 1.9s, TBT 30ms, CLS 0, and LCP about 3.0s.
- Current public-preview PSI URL, run date, category scores, and pass/fail comparison remain pending.
- Sanity `homePage` publish smoke-test evidence remains pending and must be recorded after deployment.

## Decisions Made

- Kept Draft Mode SEO-safe by fetching draft content only in the page body render path; `generateMetadata()` still calls published `getHomepage()`.
- Kept preview scope intentionally narrow: exact homepage slug only, no preview UI, no Studio preview action, no Visual Editing, and no stega/source-map markers.
- Kept global v1.6 requirements pending while the release gate lacks public-preview evidence, even though implementation evidence is complete.

## Deviations from Plan

### Auto-fixed Issues

**1. Final typecheck caught missing log event typing and test request type mismatch**
- **Found during:** Task 6 final `pnpm typecheck`.
- **Issue:** New draft preview observability event names were not in `ObservabilityEventName`, and the Sanity webhook tests passed plain `Request` objects to a handler typed as `NextRequest`.
- **Fix:** Added `draft_preview_enabled` and `draft_preview_rejected` to the logger event-name union and test coverage; updated the webhook test helper to construct `NextRequest`.
- **Files modified:** `src/lib/observability/logger.ts`, `src/lib/observability/logger.test.ts`, `src/app/api/webhooks/sanity/route.test.ts`.
- **Verification:** Affected tests passed, `pnpm typecheck` passed, final integration passed.
- **Committed in:** `c0852302`.

---

**Total deviations:** 1 auto-fixed typecheck issue.
**Impact on plan:** No scope change; the fix made the planned observability and route-test types compile.

## Issues Encountered

- `pnpm lint -- --quiet` failed because this package-manager invocation forwarded a literal `--` to ESLint, so ESLint treated `--quiet` as a file pattern. Equivalent `pnpm lint --quiet` and `pnpm exec eslint . --quiet` both passed, and commit hooks also ran full lint successfully.
- `pnpm build` emitted two metadata-only `draft_preview_rejected` missing-secret logs during route analysis. The build passed and no secret values or raw URLs were logged.

## User Setup Required

External preview/revalidation configuration is still required before owner verification:

- Set `SANITY_PREVIEW_SECRET` to at least 32 random characters before enabling `/api/draft` outside local tests, for example from `openssl rand -hex 32`.
- Set `SANITY_API_READ_TOKEN` for token-backed draft reads.
- Set `SANITY_REVALIDATE_SECRET` for signed Sanity webhook requests.
- Configure the deployed preview Sanity webhook target and record the publish smoke test.
- Run Google PageSpeed Insights against the deployed public preview `/` and record the report URL and category scores in `docs/launch/phase-23-homepage-release-gate.md`.

## Next Phase Readiness

The code is ready for deployed preview verification, but rollout is not approved. Phase 23 must remain open or owner-gated until the public-preview PSI comparison and Sanity publish smoke-test proof are added without regression.

---
*Phase: 23-preview-revalidation-and-no-regression-release*
*Completed: 2026-07-03*
