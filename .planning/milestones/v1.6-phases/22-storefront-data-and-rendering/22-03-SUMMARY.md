---
phase: 22-storefront-data-and-rendering
plan: 03
subsystem: homepage-components
tags: [homepage, components, sanity, newsletter, storybook]
requires:
  - phase: 22
    plan: 02
    provides: Above-fold component prop contract pattern
provides:
  - CMS-driven newsletter intro with existing Server Action handoff preserved
  - CMS-driven private-label intro and service cards
  - CMS-driven organic-herbs intro, authored image, checklist, and CTA
  - Fixture-only middle homepage content for stories and temporary route wiring
affects: [phase-22-route-cutover, phase-22-homepage-components]
tech-stack:
  added: []
  patterns:
    - Components accept narrow props derived from HomepageContent
    - Newsletter form remains an isolated client leaf behind a code-owned action prop
key-files:
  modified:
    - src/app/(storefront)/page.tsx
    - src/components/homepage/content.ts
    - src/components/homepage/newsletter/newsletter.tsx
    - src/components/homepage/newsletter/newsletter.stories.tsx
    - src/components/homepage/private-label/private-label.tsx
    - src/components/homepage/private-label/private-label.stories.tsx
    - src/components/homepage/organic-herbs/organic-herbs.tsx
    - src/components/homepage/organic-herbs/organic-herbs.stories.tsx
key-decisions:
  - "HomepageNewsletter now receives CMS intro props while HomepageNewsletterForm and the Server Action handoff remain code-owned."
  - "PrivateLabel and OrganicHerbs render normalized HomepageContent props without component-level fetching."
  - "OrganicHerbs uses the authored image URL and alt text while preserving the existing full-bleed fill/sizes/object-cover layout."
patterns-established:
  - "Middle homepage static content exports are fixture-only values typed against HomepageContent."
  - "Temporary route fixture pass-through continues until Plan 22-07 performs the live getHomepage() cutover."
requirements-completed: [DATA-02, RENDER-01, RENDER-02]
duration: 10 min
completed: 2026-07-02
---

# Phase 22 Plan 03: Middle Homepage Prop Enablement Summary

**Newsletter, private-label, and organic-herbs sections now render typed CMS content props while preserving their existing behavior and visual contracts.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-07-02T08:57:12Z
- **Completed:** 2026-07-02T09:07:57Z
- **Tasks:** 1
- **Files modified:** 8

## Accomplishments

- Updated `HomepageNewsletter` to receive `HomepageContent['newsletter']['intro']` while keeping `HomepageNewsletterForm` and the Server Action handoff unchanged.
- Updated `PrivateLabel` to receive typed intro and service-card props from `HomepageContent['privateLabel']`.
- Updated `OrganicHerbs` to receive typed intro, image, checklist, and CTA props from `HomepageContent['organicHerbs']`.
- Added typed fixture exports for the newsletter, private-label, and organic-herbs sections.
- Updated co-located Storybook stories to pass explicit args for the new required props.

## Task Commits

1. **Task 1: Prop-enable newsletter, private-label, and organic-herbs** - `db627f63`

**Plan metadata:** this docs commit

## Files Modified

- `src/components/homepage/newsletter/newsletter.tsx` - Required CMS intro prop support with existing action prop and form leaf preserved.
- `src/components/homepage/private-label/private-label.tsx` - Required typed intro/cards props.
- `src/components/homepage/organic-herbs/organic-herbs.tsx` - Required typed intro/image/checklist/CTA props.
- `src/components/homepage/content.ts` - Fixture-only middle-section data exports typed against `HomepageContent`.
- `src/app/(storefront)/page.tsx` - Transitional fixture prop pass-through until the Sanity route cutover plan.
- Co-located stories - Explicit args for the updated prop APIs.

## Decisions Made

- Kept all three section wrappers as Server Components; no parent section gained `'use client'`.
- Kept newsletter action behavior code-owned and isolated to the existing `HomepageNewsletterForm` client leaf.
- Rendered organic-herbs authored image alt text from Sanity-shaped data while preserving the current full-bleed layout.

## Deviations from Plan

- `src/app/(storefront)/page.tsx` was touched to keep required component props type-safe before the later live data cutover.
- The configured Storybook project is named `storybook`, not `chromium`; verification used `--project storybook`.
- The combined Storybook regex was split into separate `Newsletter`, `PrivateLabel`, and `OrganicHerbs` runs to avoid Windows command parsing issues.

## Issues Encountered

- Initial lint found import ordering in `newsletter.stories.tsx`; the import groups were corrected and lint passed.
- Storybook emitted pre-existing Next image warnings about eager/LCP images and fake image quality metadata. They did not fail the focused story runs and were not introduced by this wave.

## Verification

- `pnpm typecheck` - passed.
- `pnpm lint --quiet` - passed.
- `pnpm test:stories -- --project storybook --testNamePattern Newsletter` - passed, 106 files / 363 tests.
- `pnpm test:stories -- --project storybook --testNamePattern PrivateLabel` - passed, 106 files / 363 tests.
- `pnpm test:stories -- --project storybook --testNamePattern OrganicHerbs` - passed, 106 files / 363 tests.
- Pre-commit hook on `db627f63` - passed Tailwind, ESLint, and component-contract checks.

## Self-Check: PASSED

- Newsletter, private-label, and organic-herbs accept explicit CMS props.
- Newsletter form/action behavior remains code-owned and isolated in the existing client leaf.
- Organic-herbs image geometry keeps `fill`, `sizes="100vw"`, and object-cover behavior.
- Storybook stories cover the updated prop APIs.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 22-04 can prop-enable the supply-chain, certification coverage, and supply-chain protection sections while keeping motif assets code-owned.

---
*Phase: 22-storefront-data-and-rendering*
*Completed: 2026-07-02*
