---
phase: 22-storefront-data-and-rendering
plan: GAP-01
subsystem: homepage-route
tags: [homepage, sanity, next-cache-components, initial-html, route-tests]
requires:
  - phase: 22
    plan: 07
    provides: CMS-backed homepage route cutover
provides:
  - Homepage CMS body rendered in the default route output instead of a null streamed shell
  - Regression coverage proving the default `/` route output includes CMS sections, one H1, and JSON-LD
  - Source guard preventing `connection()`, `next/server`, `<Suspense>`, or `fallback={null}` from returning to the live homepage route
affects: [phase-22-route-cutover, homepage-rendering, next-cache-components, crawler-html]
tech-stack:
  added: []
  patterns:
    - Cached Sanity homepage data can render directly in the initial HTML shell under Next 16 Cache Components
    - Route tests should render the default page export when proving crawler-visible initial HTML
key-files:
  created:
    - .planning/phases/22-storefront-data-and-rendering/22-GAP-01-SUMMARY.md
  modified:
    - src/app/(storefront)/page.tsx
    - src/app/(storefront)/page.test.tsx
key-decisions:
  - "The homepage body no longer uses route-level `connection()` or `Suspense fallback={null}` because the `getHomepage()` boundary is cached and should contribute visible CMS content to initial server HTML."
  - "The 22-07 request-time streamed-shell decision is superseded for `/`; missing or invalid CMS homepage content should fail loudly through the cached Sanity boundary rather than being hidden behind an empty fallback."
  - "The regression test renders the default Next route export, not a helper component, so it proves the crawler-visible route output."
patterns-established:
  - "For homepage initial HTML regressions, tests must exercise the default route export and source-guard streaming escape hatches."
requirements-completed: [DATA-01, RENDER-01, RENDER-02, QUALITY-01]
duration: 10 min
completed: 2026-07-03
---

# Phase 22 Plan GAP-01: Homepage Initial HTML Gap Closure Summary

**The storefront `/` route now includes the CMS-backed homepage body in the initial server-rendered output while preserving metadata, JSON-LD, action handoffs, and section order.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-07-02T23:55:00Z
- **Completed:** 2026-07-03T00:05:12Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- Added regression coverage that renders the default route export and fails when CMS section content only exists behind the old helper/streaming boundary.
- Removed `connection()` and the route-wide `Suspense fallback={null}` wrapper from the homepage route.
- Made the default route export async and render all CMS-backed homepage sections directly from `getHomepage()`.
- Updated metadata generation to use the cached homepage boundary without opting into request-time rendering.
- Verified the production build now reports `/` as static with the expected one-hour revalidation.

## Task Commits

1. **Task 1: Add failing regression test** - `f2646372` (test)
2. **Task 2: Render CMS homepage body in initial HTML** - `bda7317f` (fix)
3. **Task 3: Verify Cache Components and build behavior** - no code commit; verification-only task.

**Plan metadata:** this docs commit

## Files Created/Modified

- `src/app/(storefront)/page.test.tsx` - Renders the default route output for CMS section, one-H1, JSON-LD, action handoff, and source-guard assertions.
- `src/app/(storefront)/page.tsx` - Removes request-time streaming from the visible homepage body and renders cached Sanity homepage content directly.

## Decisions Made

- Superseded the earlier Phase 22-07 streamed-shell approach for `/` because the cached Sanity homepage boundary is render-critical content, not per-request personalized data.
- Kept JSON-LD code-owned and in the default route output while making CMS sections part of the same render result.
- Kept failure behavior loud by relying on `getHomepage()` validation and build/runtime checks rather than a static content fallback.

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope creep; implementation stayed within the two planned route files.

## Issues Encountered

- `pnpm test:unit -- "src/app/(storefront)/page.test.tsx"` failed during RED as expected: the default route output did not call `getHomepage()`, metadata still called `connection()` outside request scope, and the source guard found `next/server` plus the null Suspense shell.
- The project `test:unit` script forwards the `--` separator through to Vitest, so the focused commands exercised the broader non-excluded unit suite. This was accepted as stronger evidence, not a blocker.

## Verification

- RED: `pnpm test:unit -- "src/app/(storefront)/page.test.tsx"` - failed as expected before production changes.
- GREEN: `pnpm test:unit -- "src/app/(storefront)/page.test.tsx"` - passed, 69 files / 292 tests.
- Regression suite: `pnpm test:unit -- "src/app/(storefront)/page.test.tsx" src/lib/sanity/home-page.test.ts src/lib/blog/operations.test.ts` - passed, 69 files / 292 tests.
- `pnpm lint` - passed.
- `pnpm typecheck` - passed.
- `pnpm build` - passed; `/` reported as static with 1h revalidation and 1d expiry.
- Pre-commit hooks on `f2646372` and `bda7317f` - passed Tailwind class check, ESLint, and component-contract tests.
- Source guard: no `connection()`, `from 'next/server'`, `<Suspense>`, or `fallback={null}` remains in `src/app/(storefront)/page.tsx`.

## Self-Check: PASSED

- The default `/` route output now calls `getHomepage()` and renders all 13 CMS-backed homepage sections.
- The route source no longer imports `next/server` or `Suspense`.
- Metadata still comes from the typed homepage SEO fields and passes through `withNoindexRobots()`.
- Organization and WebSite JSON-LD remain code-owned in the default route output.
- Newsletter and contact Server Actions remain code-owned handoffs.
- Build, lint, typecheck, unit regression tests, and source guard all pass.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 22 still has `22-08-PLAN.md` open for final automated guards and manual homepage visual parity evidence.

---
*Phase: 22-storefront-data-and-rendering*
*Completed: 2026-07-03*
