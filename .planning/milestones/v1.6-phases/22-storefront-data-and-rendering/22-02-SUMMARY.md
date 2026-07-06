---
phase: 22-storefront-data-and-rendering
plan: 02
subsystem: homepage-components
tags: [homepage, components, sanity, storybook]
requires:
  - phase: 22
    plan: 01
    provides: Typed HomepageContent data contract
provides:
  - CMS-driven hero rendering with one H1 and preserved LCP Image props
  - CMS-driven proof-point rendering using the existing visual treatment
  - CMS-driven product-range intro and overlay image-card rendering
  - Fixture-only above-fold homepage content for stories and tests
affects: [phase-22-route-cutover, phase-22-homepage-components]
tech-stack:
  added: []
  patterns:
    - Components accept narrow props derived from HomepageContent
    - Storybook fixtures use typed Sanity view-model shapes
key-files:
  modified:
    - src/app/(storefront)/page.tsx
    - src/components/homepage/content.ts
    - src/components/homepage/hero/hero.tsx
    - src/components/homepage/hero/hero.stories.tsx
    - src/components/homepage/proof-points/proof-points.tsx
    - src/components/homepage/proof-points/proof-points.stories.tsx
    - src/components/homepage/product-range/product-range.tsx
    - src/components/homepage/product-range/product-range.stories.tsx
    - src/components/homepage/overlay-image-card/overlay-image-card.tsx
    - src/components/homepage/overlay-image-card/overlay-image-card.test.tsx
    - src/components/homepage/overlay-image-card/overlay-image-card.stories.tsx
    - src/lib/sanity/home-page.ts
key-decisions:
  - "HomepageHero now receives required hero content props and keeps the existing fill/sizes/preload/fetchPriority image contract without priority."
  - "ProductRange and OverlayImageCard consume normalized Sanity card data while preserving the existing geometry, scrims, focus ring, hover reveal, and touch-visible CTA."
  - "The root route temporarily passes typed fixture props until Plan 22-07 replaces the homepage runtime source with getHomepage()."
patterns-established:
  - "Above-fold static content exports are clearly marked as fixtures and typed against HomepageContent."
  - "Shared homepage components stay fetch-free and render normalized content passed by the route."
requirements-completed: [RENDER-01, RENDER-02]
duration: 23 min
completed: 2026-07-02
---

# Phase 22 Plan 02: Above-Fold Prop Enablement Summary

**Hero, proof points, product range, and overlay cards now render typed homepage content passed in from the route boundary.**

## Performance

- **Duration:** 23 min
- **Started:** 2026-07-02T08:32:40Z
- **Completed:** 2026-07-02T08:55:26Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Updated `HomepageHero` to accept `HomepageContent['hero']`, render authored hero text/image/proof points, and preserve one visible `h1`.
- Preserved the hero LCP image discipline: `fill`, `sizes="100vw"`, `preload`, `fetchPriority="high"`, and no deprecated `priority` prop.
- Updated `ProofPoints` to accept homepage proof-point data while retaining the existing default certification proof-point content for other consumers.
- Updated `ProductRange` and `OverlayImageCard` to consume Sanity-shaped intro/card props without adding data fetching to components.
- Converted above-fold static homepage data in `content.ts` into fixture/story exports typed against `HomepageContent`.

## Task Commits

1. **Tasks 1-2: Prop-enable hero/proof points and product range/overlay cards** - `42fa034d`

**Plan metadata:** this docs commit

## Files Modified

- `src/components/homepage/hero/hero.tsx` - Required typed hero props, CMS-authored image alt text, proof-point strip from props.
- `src/components/homepage/proof-points/proof-points.tsx` - Optional typed homepage proof-point prop support.
- `src/components/homepage/product-range/product-range.tsx` - Required typed intro and cards props.
- `src/components/homepage/overlay-image-card/overlay-image-card.tsx` - Typed Sanity card prop support and authored CTA label.
- `src/components/homepage/content.ts` - Fixture-only above-fold data exports typed against `HomepageContent`.
- `src/app/(storefront)/page.tsx` - Transitional fixture prop pass-through until the Sanity route cutover plan.
- Co-located stories/tests - Updated to use the typed fixture exports.
- `src/lib/sanity/home-page.ts` - Made `HomepageImage.lqip` optional so authored images and code-owned fixture images share the same view-model type safely.

## Decisions Made

- Kept components as Server Components and did not add client-side state or component-level fetching.
- Committed the two component tasks together because the shared fixture rename and route prop compatibility change were interdependent.
- Left live homepage data fetching for Plan 22-07; this plan only created the prop contract needed by that cutover.

## Deviations from Plan

- `src/app/(storefront)/page.tsx` was touched earlier than Plan 22-07 so required component props could be introduced without breaking typecheck/build between waves.
- The configured Storybook project is named `storybook`, not `chromium`; verification used `--project storybook`.
- Windows command parsing made the combined `HomepageHero|Proof` and `ProductRange|Overlay` patterns unreliable, so those story checks were split into separate runs.

## Issues Encountered

- Storybook emitted pre-existing Next image warnings about eager/LCP images and fake image quality metadata. They did not fail the focused story runs and were not introduced by this wave.

## Verification

- `pnpm test:stories -- --project storybook --testNamePattern HomepageHero` - passed, 106 files / 363 tests.
- `pnpm test:stories -- --project storybook --testNamePattern Proof` - passed, 106 files / 363 tests.
- `pnpm test:unit -- src/components/homepage/overlay-image-card/overlay-image-card.test.tsx` - passed, 68 files / 286 tests.
- `pnpm test:stories -- --project storybook --testNamePattern ProductRange` - passed, 106 files / 363 tests.
- `pnpm test:stories -- --project storybook --testNamePattern Overlay` - passed, 106 files / 363 tests.
- `pnpm lint --quiet` - passed.
- `pnpm typecheck` - passed.
- Pre-commit hook on `42fa034d` - passed Tailwind, ESLint, and component-contract checks.

## Self-Check: PASSED

- Above-fold components consume required typed props instead of importing live runtime constants.
- Hero renders exactly one visible `h1` and keeps the approved Next Image LCP props.
- Product-range card geometry, focus, hover, and responsive image behavior remain owned by `OverlayImageCard`.
- Static above-fold data is fixture/story data only until the route cutover.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 22-03 can prop-enable the newsletter, private-label, and organic-herbs sections against `HomepageContent` while continuing to keep component fetch boundaries at the route/data layer.

---
*Phase: 22-storefront-data-and-rendering*
*Completed: 2026-07-02*
