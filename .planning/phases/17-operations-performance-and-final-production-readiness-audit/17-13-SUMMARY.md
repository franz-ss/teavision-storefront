---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 13
subsystem: performance
tags: [performance, fonts, streaming, search, cart, cache-components]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: image LCP remediation and Next 16 image preload guards from 17-12
provides:
  - Optional-display launch font configuration
  - Empty-cart route fast path that avoids unnecessary account-session lookup
  - Search route shell split that keeps the hero outside Searchanise result fetching
  - Compact privacy-policy first-viewport body copy sizing
affects: [performance-evidence, text-lcp, search, cart, privacy-policy, PERF-01]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Use `display: 'optional'` for launch-critical next/font/google configs
    - Start independent server work with `Promise.all`, then gate dependent work after cheap state is known
    - With Cache Components, unwrap `searchParams` inside Suspense rather than awaiting runtime data at the page root

key-files:
  created:
    - src/app/(storefront)/search/_components/results.tsx
    - .planning/phases/17-operations-performance-and-final-production-readiness-audit/17-13-SUMMARY.md
  modified:
    - src/app/layout.tsx
    - scripts/component-contracts/performance-fonts.test.mjs
    - src/app/(storefront)/cart/page.tsx
    - src/app/(storefront)/cart/_components/loading-skeleton.tsx
    - src/app/(storefront)/search/page.tsx
    - src/components/search/search-results-view/search-results-view.tsx
    - src/components/search/search-results-view/search-hero.tsx
    - src/app/(storefront)/pages/privacy-policy/page.tsx

key-decisions:
  - "Root search pages must not await `searchParams` outside Suspense under Next 16 Cache Components; use the documented promise-child pattern instead."
  - "SearchHero now owns only the above-the-fold search shell, while route-local SearchResults owns awaited Searchanise results and analytics."
  - "Empty-cart rendering skips account-session lookup unless a real cart exists or the identity-sync failure context requires account handling."

patterns-established:
  - "Keep runtime search params out of cached/page-root prerender work by resolving them inside Suspense."
  - "Keep route-local async boundaries under `src/app/.../_components/` when the wrapper is not a reusable component."

requirements-completed: [UX-01, QA-02]
requirements-addressed: [PERF-01]

# Metrics
duration: 15 min
completed: 2026-06-24
---

# Phase 17 Plan 13: Text-LCP Shell Remediation Summary

**Optional launch fonts, faster empty-cart rendering, and a streamed search shell that passes Next 16 production prerender.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-06-24T04:42:30Z
- **Completed:** 2026-06-24T04:57:30Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Changed all four root Google font configs to `display: 'optional'` and extended the font contract to reject `display: 'swap'`.
- Reordered `/cart` server work so `searchParams` and `getCartAction()` start together, while `getCustomerAccountSession()` runs only after cart/context need is known.
- Replaced the full cart-table fallback with a stable empty-cart-style loading block containing `Checking your cart` and `min-h-72`.
- Split `/search` so the hero shell renders before the Searchanise result boundary and no helper components are declared inside `page.tsx`.
- Reduced the privacy policy route's first body paragraph from `type-body` to `type-body-sm` without changing legal-review copy.

## Task Commits

Each implementation task was committed atomically:

1. **Task 1: Make launch fonts non-blocking for text LCP routes** - `ed9862ce` (`perf(17-13): make launch fonts optional`)
2. **Task 2: Remove empty-cart account-session waterfall and reserve fallback space** - `c6ce66c0` (`perf(17-13): remove empty cart session waterfall`)
3. **Task 3: Split search shell into a real route-local result boundary** - `4f4e6963` (`perf(17-13): stream search shell before results`)

Plan metadata and this summary are captured in the final metadata commit.

## Files Created/Modified

- `src/app/layout.tsx` - Uses `display: 'optional'` for Spectral, Hanken Grotesk, Space Mono, and Caveat.
- `scripts/component-contracts/performance-fonts.test.mjs` - Guards optional display plus existing Spectral weight/style and non-preloaded decorative fonts.
- `src/app/(storefront)/cart/page.tsx` - Starts cart and search-param work in parallel; gates account session work.
- `src/app/(storefront)/cart/_components/loading-skeleton.tsx` - Provides a stable visible empty-cart loading footprint.
- `src/app/(storefront)/search/page.tsx` - Resolves `searchParams` inside Suspense and renders `SearchHero` before nested results.
- `src/app/(storefront)/search/_components/results.tsx` - Awaits Searchanise result data and renders analytics plus `SearchResultsView`.
- `src/components/search/search-results-view/search-hero.tsx` - Accepts `state` plus optional `countLabel`, with a pre-result "Searching products..." label.
- `src/components/search/search-results-view/search-results-view.tsx` - Owns only below-hero alerts, filters, product results, sort, and pagination.
- `src/app/(storefront)/pages/privacy-policy/page.tsx` - Uses smaller first-viewport body type while preserving copy.

## Decisions Made

- Followed the installed Next streaming docs after production smoke exposed the root-level `await searchParams` issue. The final page uses `{searchParams.then(...)}` inside Suspense so `/search` can prerender its fallback shell.
- Kept `SearchResults` route-local because it coordinates page-specific analytics and Searchanise results; it is not a reusable `src/components` boundary.
- Did not introduce `use cache` because the task depends on runtime search params and fresh Searchanise query state.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Moved searchParams resolution inside Suspense**

- **Found during:** Task 3 production smoke verification
- **Issue:** The plan requested an async default page export that awaited `searchParams`. Next 16 Cache Components rejected `/search` during production build with `Uncached data was accessed outside of <Suspense>`.
- **Fix:** Used the installed streaming guide's promise-child pattern inside `<Suspense>`, preserving the route-file component limit and keeping Searchanise result fetching in a nested boundary.
- **Files modified:** `src/app/(storefront)/search/page.tsx`
- **Verification:** `pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts` passed 10/10 after the fix.
- **Committed in:** `4f4e6963`

---

**Total deviations:** 1 auto-fixed (blocking)
**Impact on plan:** The final implementation better matches Next 16 Cache Components while preserving the plan's intent: no inline helper components, immediate search shell, and nested result streaming.

## Issues Encountered

- First production smoke attempt failed before tests because `/search` could not prerender with root-level runtime data access. The fix above resolved the build gate.

## Verification

- `node --test scripts/component-contracts/performance-fonts.test.mjs` - PASS, 1/1 test.
- `pnpm lint -- src/app/layout.tsx "src/app/(storefront)/cart/page.tsx" "src/app/(storefront)/cart/_components/loading-skeleton.tsx" "src/app/(storefront)/search/page.tsx" "src/app/(storefront)/search/_components/results.tsx" src/components/search/search-results-view/search-results-view.tsx src/components/search/search-results-view/search-hero.tsx "src/app/(storefront)/pages/privacy-policy/page.tsx" scripts/component-contracts/performance-fonts.test.mjs` - PASS.
- `pnpm typecheck` - PASS.
- `pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts` - PASS, 10/10 tests.

## Auth Gates

None.

## Known Stubs

Production smoke continues to use fake Shopify and fake Customer Account providers. No real Shopify hosted checkout, payment, shipping, tax, order creation, success redirect, live OAuth, protected customer data, or B2B pricing test was run.

## Threat Flags

None. The new search shell does not log or render tokens, cart IDs, checkout URLs, emails, raw provider payloads, or owner-gated data.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 17-14 can now add account CLS stabilization and render-shell contracts over the completed cart/search/privacy shell changes. Plan 17-15 still owns strict performance evidence regeneration and final readiness/verification updates.

## Self-Check: PASSED

- Found summary file: `.planning/phases/17-operations-performance-and-final-production-readiness-audit/17-13-SUMMARY.md`
- Found task commits: `ed9862ce`, `c6ce66c0`, `4f4e6963`
- Confirmed `/search` no longer declares `SearchContent` or `SearchFallback`.
- Confirmed `SearchResultsView` no longer renders `<SearchHero`.
- Confirmed production smoke passes 10/10 against the fake-provider production lifecycle.

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-24*
