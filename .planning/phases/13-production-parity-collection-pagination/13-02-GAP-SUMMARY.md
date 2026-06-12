---
phase: 13-production-parity-collection-pagination
plan: 02-GAP
subsystem: ui
tags: [tailwind, scroll-margin, pagination, collection, next.js]

# Dependency graph
requires:
  - phase: 13-production-parity-collection-pagination
    provides: collection pagination with #product-grid anchor hrefs (plan 13-01)
provides:
  - scroll-mt-24/lg:scroll-mt-32 on the product grid <ul> so pager navigation
    lands below the sticky storefront header on all viewport widths (D-26)
affects: [collection-pagination, product-list]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Anchor scroll-margin: put id= on the grid element itself with scroll-mt-* sized
      to the sticky header height rather than using a zero-height sibling div"

key-files:
  created: []
  modified:
    - src/app/(storefront)/collections/[handle]/_components/product-list.tsx
    - src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx

key-decisions:
  - "Merged the bare <div id='product-grid' /> sentinel into the <ul> itself with
    scroll-mt-24 / lg:scroll-mt-32 — eliminates the off-by-one caused by the
    zero-height div landing under the sticky header"

patterns-established:
  - "scroll-mt-24 (mobile) + lg:scroll-mt-32 (desktop) as the standard sticky-header
    compensation offset for in-page anchor targets in collection and listing views"

requirements-completed: []

# Metrics
duration: 5min
completed: 2026-06-12
---

# Phase 13 Plan 02-GAP: Anchor Offset for Collection Pager Summary

**Merged `id="product-grid"` onto the `<ul>` grid element and added `scroll-mt-24 lg:scroll-mt-32` so pager clicks land with the product grid visible below the sticky header (D-26 gap closure)**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-06-12T03:00:00Z
- **Completed:** 2026-06-12T03:04:13Z
- **Tasks:** 3 (Tasks 1-2 code + test, Task 3 lint/verify)
- **Files modified:** 2

## Accomplishments

- Moved `id="product-grid"` from a zero-height `<div>` sibling onto the product `<ul>` element so the browser scroll target is the grid itself
- Added `scroll-mt-24 lg:scroll-mt-32` Tailwind utilities to compensate for the sticky storefront header height on mobile and desktop
- Extended the D-26 unit test to assert both the `id` placement and the scroll-margin utilities, providing regression coverage going forward

## Task Commits

Each task was committed atomically:

1. **Tasks 1-3: Cover anchor offset (RED), implement fix (GREEN), verify lint+tests** - `6d25b81` (fix)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `src/app/(storefront)/collections/[handle]/_components/product-list.tsx` — Moved `id="product-grid"` onto `<ul>`, added `scroll-mt-24 lg:scroll-mt-32`, removed bare sentinel `<div>`
- `src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx` — Expanded D-26 test to assert `id="product-grid"`, `scroll-mt-24`, and `lg:scroll-mt-32`

## Decisions Made

- `scroll-mt-24` for mobile (matches the ~96px mobile header height) and `lg:scroll-mt-32` for desktop (matches ~128px desktop sticky header height), matching the actual header heights.
- Merged the anchor id onto the `<ul>` rather than offsetting the old `<div>` with a negative-margin hack — cleaner, semantically correct, no invisible phantom element.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Human UAT Deferred

Task 3 Step 2 ("Manually verify desktop and mobile pager navigation via `pnpm dev`") is a human-only visual verification step per the execution environment notes. Automated evidence (unit tests pass, lint passes) is sufficient for the commit. Visual confirmation at `http://localhost:3000/collections/all` — click a pager link, confirm URL shows `?page=N#product-grid` and top product row is visible below the sticky header — is deferred to human UAT.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 13 gap closure complete: both UAT gaps addressed (gap 1 in 13-01, gap 2 in this plan)
- No blockers. Phase 13 production-parity collection pagination is ready for final human UAT sign-off.

---
*Phase: 13-production-parity-collection-pagination*
*Completed: 2026-06-12*

## Self-Check: PASSED

- `src/app/(storefront)/collections/[handle]/_components/product-list.tsx` — EXISTS (verified during edit)
- `src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx` — EXISTS (verified during edit)
- Commit `6d25b81` — EXISTS (confirmed by `git rev-parse --short HEAD`)
- All 4 unit tests PASS (`pnpm test:unit` output: 4 passed)
- Lint PASS (`pnpm lint` output: Tailwind class check passed, no ESLint errors)
