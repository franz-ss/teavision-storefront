---
phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering
plan: 03
subsystem: ui
tags: [sanity, groq, next-image, blog, lqip, coalesce]

# Dependency graph
requires:
  - phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering
    provides: defaultBlogListingQuery and Hero component introduced in plans 12-01 and 12-02
provides:
  - null-safe featuredPosts exclusion filter in defaultBlogListingQuery (coalesce guard)
  - truthy LQIP guard in Hero preventing empty-string blurDataURL render crash
affects: [12-optimize-blogs-teavision-blogs-loading-and-image-rendering]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GROQ coalesce() for null-safe array ref dereferencing in exclusion filters"
    - "Boolean() truthy guard for optional string fields driving next/image placeholder"

key-files:
  created: []
  modified:
    - src/lib/sanity/queries/blog.ts
    - src/components/blog/hero/hero.tsx

key-decisions:
  - "Used coalesce(..., []) to make featuredPosts[]._ref dereference null-safe; _id in [] evaluates to false under GROQ three-valued logic so all articles pass the exclusion when no featuredPosts are configured"
  - "Mirrored the existing ArticleCard truthy LQIP pattern (Boolean(lqip)) in Hero to ensure cross-component consistency"

patterns-established:
  - "GROQ null-safe ref list: wrap featuredPosts[]._ref in coalesce(..., []) wherever used in exclusion predicates"
  - "next/image LQIP guard: use Boolean(image?.lqip) not != null to correctly reject empty strings"

requirements-completed: []

# Metrics
duration: 3min
completed: 2026-06-11
---

# Phase 12 Plan 03: Gap Closure (WR-01, WR-07) Summary

**coalesce() null-safety for GROQ featuredPosts exclusion and Boolean() truthy guard for Hero LQIP to close two crash/blank regressions in the default blog listing path**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-11T12:02:00Z
- **Completed:** 2026-06-11T12:05:12Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Fixed WR-01: `defaultBlogListingQuery` articles and totalCount filters now wrap the featured-posts ref list in `coalesce(..., [])` so a blog document with no `featuredPosts` attribute produces an empty exclusion set instead of propagating null through GROQ three-valued logic and blanking the entire listing
- Fixed WR-07: `Hero` `hasLqip` guard replaced with `Boolean(heroImage?.lqip)` so an empty-string LQIP resolves to false, preventing `next/image` from receiving `placeholder="blur"` with `blurDataURL=""` and throwing at render time
- Both fixes are availability hardening against plausible CMS data states; no advisory warnings (WR-02..WR-06, IN-01..IN-04) were touched

## Task Commits

Each task was committed atomically:

1. **Task 1: Guard featuredPosts ref list with coalesce() in defaultBlogListingQuery (WR-01)** - `62afce0` (fix)
2. **Task 2: Use truthy LQIP guard in Hero to prevent empty-string blurDataURL crash (WR-07)** - `77630f0` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/lib/sanity/queries/blog.ts` - Both occurrences of the unsafe `!(_id in *[...][0].featuredPosts[]._ref)` exclusion predicate wrapped with `coalesce(..., [])`
- `src/components/blog/hero/hero.tsx` - `hasLqip` guard changed from `!= null` to `Boolean()` truthy evaluation

## Decisions Made

- Used `coalesce(*[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref, [])` — the empty-array default causes `_id in []` to evaluate false, `!false` to true, passing all articles when no featuredPosts are configured. This matches GROQ semantics correctly without changing query structure.
- Mirrored `Boolean(heroImage?.lqip)` from `ArticleCard` (article-card.tsx:100) to ensure the two blog image components share the same LQIP evaluation idiom.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Both WR-01 and WR-07 blockers resolved; Phase 12 verification truths 6 and 7 can now be re-verified against the live CMS
- Advisory warnings WR-02..WR-06 and IN-01..IN-04 remain explicitly deferred per plan scope discipline
- Phase 12 is complete pending human verification of the live `/blogs/teavision-blogs` route with a blog document that has no configured featuredPosts

## Threat Flags

None - these fixes close mitigations already registered as T-12-01 and T-12-02 in the plan's threat model. No new network endpoints, auth paths, file access patterns, or schema changes introduced.

## Self-Check: PASSED

- `src/lib/sanity/queries/blog.ts` exists and contains `coalesce(` x2 (verified via node)
- `src/components/blog/hero/hero.tsx` exists and contains `Boolean(heroImage?.lqip)` (verified via node)
- Task 1 commit `62afce0` present: `git log --oneline` confirms
- Task 2 commit `77630f0` present: `git log --oneline` confirms
- `pnpm typecheck` exits 0 (verified twice — once after each task)

---
*Phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering*
*Completed: 2026-06-11*
