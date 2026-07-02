---
phase: 22-storefront-data-and-rendering
plan: 05
subsystem: homepage-components
tags: [homepage, components, sanity, testimonials, blog, storybook]
requires:
  - phase: 22
    plan: 04
    provides: Certification section prop enablement
provides:
  - CMS-driven testimonials intro and items with existing slider handoff
  - CMS-driven Tea Journal intro, blog handle, link label, and max post count
  - Configurable getHomepageArticles(blogHandle, maxPosts) operation
  - Fixture-only testimonial and Tea Journal config for stories and temporary route wiring
affects: [phase-22-route-cutover, phase-22-homepage-components, blog-operations]
tech-stack:
  added: []
  patterns:
    - Server wrapper passes CMS testimonial items into an existing client slider leaf
    - CMS controls Tea Journal section config while live article data stays in blog operations
key-files:
  modified:
    - src/app/(storefront)/page.tsx
    - src/components/homepage/content.ts
    - src/components/homepage/testimonials/testimonials.tsx
    - src/components/homepage/testimonials/testimonials.stories.tsx
    - src/components/homepage/tea-journal/tea-journal.tsx
    - src/components/homepage/tea-journal/tea-journal.stories.tsx
    - src/lib/blog/operations.ts
    - src/lib/blog/operations.test.ts
    - src/lib/sanity/queries/blog.ts
key-decisions:
  - "Testimonials keeps TestimonialsSlider as the only carousel client leaf."
  - "Tea Journal receives CMS config, but article summaries still come from getHomepageArticles()."
  - "getHomepageArticles() now forwards a bounded GROQ limit variable and preserves the default limit of 3."
  - "Testimonials keeps optional defaults because the tea-bag-manufacturer page reuses the section outside the homepage CMS boundary."
patterns-established:
  - "Route-level CMS config chooses blog handle/link label/max posts; article ownership remains in src/lib/blog/operations.ts."
  - "Story fixtures exercise dynamic section config separately from live article data."
requirements-completed: [DATA-02, RENDER-01]
duration: 10 min
completed: 2026-07-02
---

# Phase 22 Plan 05: Testimonials And Tea Journal Prop Enablement Summary

**Testimonials and Tea Journal now consume typed homepage CMS configuration while live blog article data stays in the blog operation layer.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-07-02T09:22:03Z
- **Completed:** 2026-07-02T09:32:09Z
- **Tasks:** 1
- **Files modified:** 9

## Accomplishments

- Updated `Testimonials` to receive CMS-shaped intro and testimonial items while keeping `TestimonialsSlider` as the isolated client leaf.
- Updated `TeaJournal` and `TeaJournalSection` to receive CMS-shaped intro, blog handle, link label, and max-post configuration.
- Extended `getHomepageArticles(blogHandle, maxPosts)` and `homepageBlogPostsQuery` to fetch a bounded configurable number of posts.
- Added tests proving `getHomepageArticles(DEFAULT_BLOG_HANDLE, 2)` forwards `limit: 2` and default calls still use `limit: 3`.
- Added typed fixture exports for testimonials and Tea Journal, plus explicit Storybook args and temporary root route wiring.

## Task Commits

1. **Task 1: Prop-enable testimonials and Tea Journal config** - `6af5c1ca`

**Plan metadata:** this docs commit

## Files Modified

- `src/components/homepage/testimonials/testimonials.tsx` - CMS intro/items prop support with slider leaf preserved.
- `src/components/homepage/tea-journal/tea-journal.tsx` - CMS config support for intro, blog handle, link label, and max posts.
- `src/lib/blog/operations.ts` - Configurable, clamped homepage article count.
- `src/lib/sanity/queries/blog.ts` - `homepageBlogPostsQuery` uses `$limit`.
- `src/lib/blog/operations.test.ts` - Red-to-green coverage for configurable homepage article limits.
- `src/components/homepage/content.ts` - Fixture-only testimonial and Tea Journal config exports.
- `src/app/(storefront)/page.tsx` - Transitional fixture prop pass-through until the Sanity route cutover plan.
- Co-located stories - Explicit args for the updated prop APIs.

## Decisions Made

- Kept live article ownership in `src/lib/blog/operations.ts`; homepage CMS config only controls handle, label, and count.
- Kept `Testimonials` props optional with internal defaults because `src/app/(storefront)/pages/tea-bag-manufacturer/page.tsx` reuses the section outside the homepage route.
- Kept Tea Journal empty-live-result behavior unchanged: the async section returns `null` when no articles are found.

## Deviations from Plan

- `src/app/(storefront)/page.tsx` was touched to keep required homepage props type-safe before the later live data cutover.
- `Testimonials` uses optional props for shared tea-bag-manufacturer compatibility; the homepage route still passes explicit CMS-shaped props.
- The configured Storybook project is named `storybook`, not `chromium`; verification used `--project storybook`.
- The combined Storybook regex was split into separate `Testimonials` and `TeaJournal` runs to avoid Windows command parsing issues.

## Issues Encountered

- The new unit tests initially failed because `getHomepageArticles()` did not forward a `limit` variable; the operation and GROQ query were updated to satisfy the test.
- Storybook emitted pre-existing Next image warnings about eager/LCP images and fake image quality metadata. They did not fail the focused story runs and were not introduced by this wave.

## Verification

- `pnpm test:unit -- src/lib/blog/operations.test.ts` - first failed for missing `limit`, then passed after implementation, 68 files / 288 tests.
- `pnpm typecheck` - passed.
- `pnpm lint --quiet` - passed.
- `pnpm test:stories -- --project storybook --testNamePattern Testimonials` - passed, 106 files / 363 tests.
- `pnpm test:stories -- --project storybook --testNamePattern TeaJournal` - passed, 106 files / 363 tests.
- Pre-commit hook on `6af5c1ca` - passed Tailwind, ESLint, and component-contract checks.

## Self-Check: PASSED

- Testimonials and Tea Journal accept explicit CMS-shaped props from the homepage route and stories.
- `TestimonialsSlider` remains the client leaf; no server wrapper gained `'use client'`.
- Tea Journal article cards still come from `getHomepageArticles()`.
- Configurable max post count is covered by unit tests and bounded to 1-3.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 22-06 can prop-enable contact, catalogue CTA, and FAQ sections while preserving code-owned form actions and existing shared component defaults where needed.

---
*Phase: 22-storefront-data-and-rendering*
*Completed: 2026-07-02*
