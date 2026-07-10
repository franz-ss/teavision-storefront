---
phase: 25-heading-structure-fixes
plan: '01'
subsystem: seo
tags: [shopify-html, accessibility, headings, storybook]
requires:
  - phase: 24-seo-migration-readiness
    provides: SEO implementation and verification baseline
provides:
  - Collection-only source-aware Shopify HTML heading promotion
  - Semantic native product specification disclosure headings
  - Route and Storybook regression coverage for the repaired hierarchy
affects: [product-pages, collection-pages, trusted-html, accessibility]
tech-stack:
  added: []
  patterns: [source-aware sanitizer heading transforms, semantic native disclosure labels]
key-files:
  created: []
  modified:
    - src/lib/shopify/html-content.ts
    - src/app/(storefront)/collections/[handle]/_components/page-content.tsx
    - src/app/(storefront)/products/[handle]/page.tsx
    - src/components/collection/story-disclosure/story-disclosure.stories.tsx
key-decisions:
  - "Keep compact sanitization unchanged and expose collectionStory as the isolated collection read-more path."
  - "Keep native details/summary controls and place product specification semantics in an H2 child."
patterns-established:
  - "Sanitizer transforms may supply source-specific output classes when heading levels converge."
requirements-completed: [SEO-03, SEO-04]
duration: 14 min
completed: 2026-07-10
---

# Phase 25 Plan 01: Heading Structure Fixes Summary

**Collection stories now promote source H3/H4 content to semantic H2/H3 output while product specifications retain native disclosure behavior with semantic H2 titles.**

## Performance

- **Duration:** 14 min
- **Started:** 2026-07-10T06:41:09Z
- **Completed:** 2026-07-10T06:55:34Z
- **Tasks:** 4/4
- **Files modified:** 7

## Accomplishments

- Added the isolated `sanitizeShopifyCollectionStoryHtml()` path, mapping source H3 → H2 with `type-heading-05 text-ink mt-5` and source H4 → H3 with `type-label text-ink mt-5`; compact H1/H2/H5/H6 behavior remains unchanged.
- Wired that sanitizer only into the non-rich-hero collection read-more branch after `richHero` parsing, with a regression test proving rich-hero content never invokes it.
- Made every product specification title an H2 within its existing native `details > summary` control, retaining one page H1, first-panel default-open state, and no custom ARIA or client interaction.
- Updated the StoryDisclosure fixtures to represent sanitized H2/H3 output; the mobile story verifies its rendered hierarchy, default-open state, and no canvas overflow.

## Task Commits

1. **Task 1: Add the isolated, source-aware collection story sanitizer contract** — `90d5e371` (`feat`)
2. **Task 2: Wire collection read-more content to the isolated variant and lock path isolation** — `b7173093` (`feat`)
3. **Task 3: Make product disclosure labels semantic H2 headings without changing native behavior** — `de1086f3` (`feat`)
4. **Task 4: Update story coverage and run the Phase 25 regression gate** — `a4bc539a` (`test`)

## Files Created/Modified

- `src/lib/shopify/html-content.ts` — adds the private `collectionStory` variant and public collection-story sanitizer boundary.
- `src/lib/shopify/html-content.test.ts` — locks the source-aware H3/H4 mapping and compact regression behavior.
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` — sanitizes only the non-rich-hero read-more content with the new entry point.
- `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx` — proves hierarchy, grid placement, and rich-hero isolation.
- `src/app/(storefront)/products/[handle]/page.tsx` — nests specification labels in shrink-safe semantic H2 elements.
- `src/app/(storefront)/products/[handle]/page.test.tsx` — proves one H1, native disclosure/H2 structure, default open state, and no ARIA overrides.
- `src/components/collection/story-disclosure/story-disclosure.stories.tsx` — uses sanitized H2/H3 fixture markup and mobile hierarchy/overflow assertions.

## Verification

- `pnpm exec vitest run src/lib/shopify/html-content.test.ts "src/app/(storefront)/products/[handle]/page.test.tsx" "src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx"` — passed (21 tests).
- `pnpm test:stories` — passed (106 files, 362 tests).
- `pnpm lint` — passed.
- `pnpm typecheck` — passed.
- `pnpm test:unit` — passed (70 files, 314 tests).
- `pnpm build` — passed.
- Manual mobile Storybook inspection confirmed the long title wraps without horizontal overflow, the disclosure is visibly open with its chevron state, and story content renders H2 then H3. Native keyboard toggling remains a human-verification item because the in-app browser could not focus the Storybook iframe control for a keypress.

## Decisions Made

- Used a source-aware heading transform object so the collection story variant can preserve H3/H4 visual classes while promoting their output semantics.
- Kept `sanitizeShopifyCompactHtml()`, `RichText`, and `StoryDisclosure` production behavior unchanged to preserve the trusted HTML and native disclosure boundaries.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The in-app browser could inspect the mobile Storybook rendering but could not attach a keyboard event to its nested iframe control. This does not affect production behavior or automated checks; it is retained as a human verification item.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All implementation and automated quality gates are green.
- Human verification should keyboard-toggle the mobile StoryDisclosure summary and visually confirm focus and chevron state before Phase 25 is marked fully verified.

## Self-Check: PASSED

- All four tasks are committed and all required automated acceptance checks pass.
- The remaining keyboard/focus observation is explicitly recorded for human verification; no Shopify content, credentials, checkout, payment, shipping, tax, order, or success-redirect system was accessed.

---
*Phase: 25-heading-structure-fixes*
*Completed: 2026-07-10*
