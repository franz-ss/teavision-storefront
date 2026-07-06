---
phase: 22-storefront-data-and-rendering
plan: 06
subsystem: homepage-components
tags: [homepage, components, sanity, contact, faq, storybook]
requires:
  - phase: 22
    plan: 05
    provides: Testimonials and Tea Journal prop enablement
provides:
  - Shared contact section with optional homepage CMS intro and method props
  - CMS-driven catalogue CTA intro, primary CTA, and secondary CTA
  - CMS-driven FAQ intro and items through existing details/summary rendering
  - Updated component contract coverage for CMS-shaped catalogue CTA data
affects: [phase-22-route-cutover, phase-22-homepage-components, contact-section]
tech-stack:
  added: []
  patterns:
    - Shared components keep local defaults while homepage route passes explicit CMS-shaped props
    - CMS CTA data remains content-shaped while Button variants stay code-owned in rendering components
key-files:
  modified:
    - src/app/(storefront)/page.tsx
    - src/components/contact/contact-section/contact-section.tsx
    - src/components/contact/contact-section/contact-section.stories.tsx
    - src/components/homepage/catalogues/cta.tsx
    - src/components/homepage/catalogues/cta.stories.tsx
    - src/components/homepage/content.ts
    - src/components/homepage/faq/faq.tsx
    - src/components/homepage/faq/faq.stories.tsx
    - scripts/component-contracts/button-system.test.mjs
key-decisions:
  - "ContactSection keeps local default intro and method data so non-homepage call sites remain valid."
  - "ContactSectionForm remains the action/client leaf; CMS content cannot alter Server Action behavior."
  - "Catalogue CTA secondary action is CMS-driven, and Button variants remain hardcoded in the component."
  - "Faq keeps explicit override support for non-homepage use while accepting CMS intro/items."
patterns-established:
  - "Lower homepage sections accept HomepageContent slices directly from route-level data wiring."
  - "Component-contract tests should guard rendered button variants rather than content fixture implementation details."
requirements-completed: [DATA-02, RENDER-01]
duration: 15 min
completed: 2026-07-02
---

# Phase 22 Plan 06: Lower Section Prop Enablement Summary

**Contact, catalogue CTA, and FAQ now accept typed homepage CMS content while preserving their code-owned form, motif, and interaction boundaries.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-07-02T09:32:10Z
- **Completed:** 2026-07-02T09:47:20Z
- **Tasks:** 1
- **Files modified:** 9

## Accomplishments

- Updated `ContactSection` to accept optional CMS-shaped intro and contact method props.
- Kept `ContactSectionForm` as the isolated form/action leaf and preserved shared defaults for non-homepage callers.
- Updated `Cta` to render CMS-shaped catalogue intro, primary CTA, and secondary CTA data without hardcoded secondary content.
- Updated `Faq` to consume CMS intro/items while preserving explicit override props and native `details`/`summary` behavior.
- Added lower-section fixture exports and temporary homepage route pass-through until the live Sanity cutover.
- Updated Storybook args for contact, catalogue CTA, and FAQ to exercise the new prop APIs.
- Updated the button component contract so it verifies catalogue CTA rendered variants after the content data moved to a CMS-shaped model.

## Task Commits

1. **Task 1: Prop-enable contact, catalogue CTA, and FAQ** - `bfdf474f`

**Plan metadata:** this docs commit

## Files Modified

- `src/components/contact/contact-section/contact-section.tsx` - Optional CMS intro/method props with local defaults.
- `src/components/homepage/catalogues/cta.tsx` - CMS catalogue CTA intro, primary action, and secondary action rendering.
- `src/components/homepage/faq/faq.tsx` - CMS intro/items support with existing override behavior preserved.
- `src/components/homepage/content.ts` - Fixture-only lower-section content exports.
- `src/app/(storefront)/page.tsx` - Transitional fixture prop pass-through until the route cutover plan.
- Co-located stories - Explicit args for the updated prop APIs.
- `scripts/component-contracts/button-system.test.mjs` - Guard updated to assert rendered CTA variants instead of the old fixture name and `ButtonProps` shape.

## Decisions Made

- Kept contact defaults inside `ContactSection` rather than importing homepage fixture data into the shared contact component.
- Kept the contact form action required and code-owned, with CMS data limited to intro and visible contact methods.
- Removed the old hardcoded catalogue secondary CTA from the component path when CMS data is supplied.
- Kept FAQ title/eyebrow/description overrides for existing page-level flexibility.

## Deviations from Plan

- `src/app/(storefront)/page.tsx` was touched to keep required homepage props type-safe before the later live data cutover.
- `scripts/component-contracts/button-system.test.mjs` was updated because the existing pre-commit guard still expected the removed `ctaCatalogueData` fixture and `ButtonProps` variant field.
- The configured Storybook project is named `storybook`, not `chromium`; verification used `--project storybook`.
- The combined Storybook regex was split into separate `ContactSection`, `Catalogues`, and `Faq` runs to avoid Windows command parsing issues.

## Issues Encountered

- The first pre-commit attempt failed because a component-contract test asserted the previous catalogue CTA fixture name and data shape. The guard now checks the CMS fixture exists and the `Cta` component renders the approved `inverse` and `inverseSecondary` variants.
- Storybook emitted pre-existing Next image warnings about eager/LCP images and fake image quality metadata. They did not fail the focused story runs and were not introduced by this wave.

## Verification

- `pnpm typecheck` - passed.
- `pnpm lint --quiet` - passed.
- `pnpm test:stories -- --project storybook --testNamePattern ContactSection` - passed, 106 files / 363 tests.
- `pnpm test:stories -- --project storybook --testNamePattern Catalogues` - passed, 106 files / 363 tests.
- `pnpm test:stories -- --project storybook --testNamePattern Faq` - passed, 106 files / 363 tests.
- `node --test scripts/component-contracts/button-system.test.mjs` - passed, 11 tests.
- Pre-commit hook on `bfdf474f` - passed Tailwind, ESLint, and component-contract checks.

## Self-Check: PASSED

- Contact, catalogue CTA, and FAQ accept explicit CMS-shaped props from the homepage route and stories.
- `ContactSectionForm` remains the client/action leaf; no parent wrapper gained `'use client'`.
- Contact defaults remain available for non-homepage call sites.
- Catalogue decorative assets and CTA button variants remain code-owned.
- FAQ continues to render with native `details`/`summary` behavior.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 22-07 can replace temporary fixture pass-through with live `getHomepage()` data and route-level fallback/error behavior.

---
*Phase: 22-storefront-data-and-rendering*
*Completed: 2026-07-02*
