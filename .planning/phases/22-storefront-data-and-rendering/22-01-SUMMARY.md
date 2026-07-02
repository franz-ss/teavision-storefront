---
phase: 22-storefront-data-and-rendering
plan: 01
subsystem: sanity
tags: [sanity, homepage, cache-components, seo, validation]
requires:
  - phase: 21
    provides: Sanity homePage singleton schema and seed shape
provides:
  - Typed homePage GROQ query for the storefront homepage singleton
  - Cached fail-loud getHomepage() operation and HomepageContent view model
  - Code-owned homepage Organization/WebSite JSON-LD constants under src/lib/seo
affects: [phase-22-components, phase-22-route-cutover, phase-23-revalidation]
tech-stack:
  added: []
  patterns:
    - Next 16 Cache Components data operation with cacheTag/cacheLife
    - Fail-loud Sanity validation before homepage rendering
key-files:
  created:
    - src/lib/sanity/queries/home-page.ts
    - src/lib/sanity/home-page.ts
    - src/lib/sanity/queries/home-page.test.ts
    - src/lib/sanity/home-page.test.ts
    - src/lib/seo/homepage-json-ld.ts
  modified:
    - src/lib/sanity/types.ts
key-decisions:
  - "Homepage validation throws for missing singleton, required SEO, canonical '/', unsafe links, missing image asset/alt/dimensions, and render-critical fields."
  - "Section cardinality is asserted through seeded fixture tests, not runtime rejection solely because a modeled array count differs from the schema."
patterns-established:
  - "Sanity homepage images normalize to src/alt/width/height/lqip using bounded getSanityImageUrl options by use case."
  - "Homepage cache invalidation tags are homePage and sanity-homepage for Phase 23 webhook reuse."
requirements-completed: [DATA-01, DATA-02, RENDER-02, QUALITY-01]
duration: 10 min
completed: 2026-07-02
---

# Phase 22 Plan 01: Typed Sanity Homepage Data Boundary Summary

**Cached Sanity homepage operation with strict SEO, link, image, and render-critical field validation.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-07-02T08:23:34Z
- **Completed:** 2026-07-02T08:32:40Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Added `homePageQuery` for the fixed Phase 21 homepage singleton and every modeled section field.
- Added raw nullable Sanity homepage types plus the public `HomepageContent` view model returned by `getHomepage()`.
- Implemented fail-loud normalization for required document, SEO, canonical `/`, safe CMS links, authored image asset/alt/dimensions, Tea Journal config, and section render fields.
- Split code-owned Organization/WebSite JSON-LD constants into `src/lib/seo/homepage-json-ld.ts`.

## Task Commits

1. **Task 1: Write failing tests for the homepage Sanity boundary** - `df5c8f99`
2. **Task 2: Implement query, types, cached operation, and JSON-LD split** - `c6dfd01f`

**Plan metadata:** this docs commit

## Files Created/Modified

- `src/lib/sanity/queries/home-page.ts` - GROQ projection for the `homePage` singleton at `/`.
- `src/lib/sanity/queries/home-page.test.ts` - Query-shape assertions for singleton targeting, SEO/image metadata, and fixed section fields.
- `src/lib/sanity/types.ts` - Raw nullable Sanity homepage result types.
- `src/lib/sanity/home-page.ts` - Cached `getHomepage()` operation and `HomepageContent` normalizer.
- `src/lib/sanity/home-page.test.ts` - Fail-loud and seeded fixture-shape tests for the homepage boundary.
- `src/lib/seo/homepage-json-ld.ts` - Code-owned Organization/WebSite JSON-LD constants.

## Decisions Made

- Kept runtime validation strict for render-critical fields while preserving D-03: array counts are fixture/schema assertions, not a standalone runtime failure rule.
- Used `cacheTag('homePage', 'sanity-homepage')` and `cacheLife('hours')` inside `getHomepage()` to match Next 16 Cache Components guidance and prepare Phase 23 revalidation.
- Used bounded image URL options by use case: hero width 1920, cards width 900, marks/logos width 640.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `pnpm create:lib -- sanity/queries/home-page` scaffolded `src/lib/sanity/queries.ts` instead of `src/lib/sanity/queries/home-page.ts`; the unintended stub was removed and the intended query file was created manually.
- The literal verification command `pnpm lint -- --quiet` passes `--quiet` as an ESLint file pattern in this repo. The equivalent gate `pnpm lint --quiet` passed.

## Verification

- `pnpm test:unit -- src/lib/sanity/queries/home-page.test.ts src/lib/sanity/home-page.test.ts` - passed, 68 files / 286 tests.
- `pnpm lint --quiet` - passed.
- `pnpm typecheck` - passed.
- Pre-commit hooks on `df5c8f99` and `c6dfd01f` - passed Tailwind, ESLint, and component-contract checks.

## Self-Check: PASSED

- Key files created by the plan exist on disk.
- `git log --grep="22-01"` returns task and metadata commits.
- Plan verification commands passed.
- No runtime fallback path was added.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 22-02 can import `HomepageContent` from `src/lib/sanity/home-page.ts` and prop-enable the hero, proof points, and product range sections against the normalized Sanity content. The live route still renders static homepage content until the later cutover plan.

---
*Phase: 22-storefront-data-and-rendering*
*Completed: 2026-07-02*
