---
phase: 02-searchanise-api-search-results
plan: 01
subsystem: search
tags: [searchanise, nextjs, storefront, ui, api]

requires:
  - phase: 01-bulk-savings-pdp-and-cart-parity
    provides: ProductCard and PDP recommendation surfaces preserved during search work
provides:
  - Searchanise Search API server data boundary for owned search results
  - Teavision-owned `/search` results UI with filters, sort, pagination, and states
  - Legacy Searchanise page redirects to `/search`
  - Searchanise script route gating that preserves PDP recommendations
affects: [search, storefront, searchanise, product recommendations]

tech-stack:
  added: []
  patterns:
    - Server-only Searchanise API adapter with `unknown` response narrowing
    - URL search params as canonical query/filter/sort/page state
    - Cache Components Suspense boundaries around runtime route reads

key-files:
  created:
    - src/lib/searchanise/types.ts
    - src/lib/searchanise/search.ts
    - src/lib/searchanise/params.ts
    - src/components/search/index.ts
    - src/components/search/search-results-view/search-results-view.tsx
    - src/components/search/search-filter-panel/search-filter-panel.tsx
    - src/components/search/search-sort-select/search-sort-select.tsx
    - src/components/search/search-pagination/search-pagination.tsx
  modified:
    - docs/conventions.md
    - src/app/(storefront)/search/page.tsx
    - src/app/(storefront)/layout.tsx
    - src/app/(storefront)/pages/search-results/page.tsx
    - src/app/(storefront)/pages/search-results-page/page.tsx
    - src/components/product/searchanise-recommendations/searchanise-script-loader.tsx

key-decisions:
  - "`/search` uses Searchanise JSON as data, never Searchanise-owned search widget DOM."
  - "Legacy Searchanise page URLs redirect to `/search` while preserving useful query params."
  - "Searchanise script loading is path-gated: search routes are clean, PDP recommendations remain enabled."
  - "Runtime search param reads sit behind Suspense boundaries to satisfy Next 16 Cache Components."

patterns-established:
  - "Search API adapter maps third-party payloads into local storefront types at the boundary."
  - "Search UI state is shareable through URL params and converted server-side into Searchanise API params."
  - "Feature-specific search components live under `src/components/search/` with co-located stories."

requirements-completed:
  - SEARCH-01
  - SEARCH-02
  - SEARCH-03
  - SEARCH-04
  - SEARCH-05
  - SEARCH-06
  - SEARCH-07

duration: 1h 45m
completed: 2026-05-27
---

# Phase 2: Searchanise API Search Results Summary

**Searchanise-ranked catalogue search now renders through owned Next UI with URL-driven filters, sort, pagination, and legacy route redirects.**

## Performance

- **Duration:** 1h 45m
- **Started:** 2026-05-27T01:49:51Z
- **Completed:** 2026-05-27T02:20:00Z
- **Tasks:** 4/4
- **Files modified:** 25 phase files plus planning metadata

## Accomplishments

- Added a server-only Searchanise data boundary that builds bounded Search API requests, narrows `unknown` JSON safely, and maps result items into local product summaries.
- Replaced `/search` with Teavision-owned result UI covering products, facets, active filters, sort, pagination, no-query, empty, and unavailable states.
- Added `src/components/search/` stories for the composed view and all new controls.
- Redirected `/pages/search-results-page` and `/pages/search-results` to `/search`, preventing the legacy Shopify/Searchanise app body from rendering below search results.
- Kept Searchanise PDP recommendations enabled while preventing Searchanise script takeover on search routes.

## Task Commits

1. **Task 1: Add typed Searchanise API data boundary** - `54298f9` (`feat`)
2. **Task 2: Build owned search results UI components** - `b982d1b` (`feat`)
3. **Task 3: Replace /search and clean legacy Searchanise routes** - `0d265db` (`feat`)
4. **Task 3 build fix: Suspense legacy redirect boundary** - `61f8dca` (`fix`)

**Plan metadata:** created in the completion commit with this summary.

## Files Created/Modified

- `src/lib/searchanise/search.ts` - Searchanise API request, response narrowing, error handling, and product mapping.
- `src/lib/searchanise/params.ts` - URL state parsing plus href builders for query, filters, sort, pagination, and legacy redirects.
- `src/components/search/search-results-view/search-results-view.tsx` - Composed owned search results experience.
- `src/components/search/search-filter-panel/search-filter-panel.tsx` - Facet and active-filter UI.
- `src/components/search/search-sort-select/search-sort-select.tsx` - Sort control preserving URL state.
- `src/components/search/search-pagination/search-pagination.tsx` - Pagination links preserving URL state.
- `src/app/(storefront)/search/page.tsx` - Search route wired to Searchanise API and `SearchResultsView`.
- `src/app/(storefront)/pages/search-results/page.tsx` - Legacy redirect to `/search`.
- `src/app/(storefront)/pages/search-results-page/page.tsx` - Legacy redirect to `/search`.
- `src/components/product/searchanise-recommendations/searchanise-script-loader.tsx` - Search route skip logic for the Searchanise script.
- `src/app/(storefront)/layout.tsx` - Suspense boundary around the route-aware Searchanise loader.
- `docs/conventions.md` - Folder map entry for `src/components/search/`.

## Decisions Made

Searchanise remains the ranking and facet source, but not the DOM owner. The new adapter treats Searchanise as a third-party JSON API and normalizes its payload before UI rendering.

`/search` is the canonical search page. The legacy `/pages/search-results-page` and `/pages/search-results` routes redirect there so old links keep working without rendering Shopify-managed page content.

PDP recommendations are preserved by gating the Searchanise loader by route instead of disabling it globally.

## Deviations from Plan

### Auto-fixed Issues

**1. [Blocking] Wrapped global Searchanise loader in Suspense**

- **Found during:** Task 3 build verification
- **Issue:** `usePathname()` inside the global Searchanise loader tripped the Next 16 Cache Components prerender boundary.
- **Fix:** Wrapped `SearchaniseScriptLoader` in `Suspense` from the storefront layout.
- **Files modified:** `src/app/(storefront)/layout.tsx`
- **Verification:** `pnpm build`
- **Committed in:** `0d265db`

**2. [Blocking] Wrapped legacy redirects in Suspense child components**

- **Found during:** Task 4 final build verification
- **Issue:** Reading `searchParams` in the legacy redirect pages still triggered a Cache Components blocking-route error.
- **Fix:** Moved the runtime redirect work into async children rendered behind `Suspense`.
- **Files modified:** `src/app/(storefront)/pages/search-results/page.tsx`, `src/app/(storefront)/pages/search-results-page/page.tsx`
- **Verification:** `pnpm lint`; `pnpm build`
- **Committed in:** `61f8dca`

---

**Total deviations:** 2 auto-fixed blocking issues
**Impact on plan:** Both fixes were required for Next 16 production build compatibility. Scope stayed within the planned search routes and Searchanise loader.

## Verification

- `pnpm lint` - passed
- `pnpm build` - passed with 57/57 static pages generated
- `rg "\bany\b" src/lib/searchanise src/components/search` - no matches
- Storybook stories exist for all new `src/components/search/*` components
- Browser `/search?q=chai` - owned UI rendered 22 results, no `snize-*` search DOM, no static `SEARCH UTILITY` body
- Browser filtered/sorted search URL - owned UI rendered 9 results with `price-desc` selected and active filter state preserved
- Browser `/search` - no-query state rendered without product results
- Browser `/pages/search-results-page?q=chai` - redirected to `/search?q=chai`
- Browser PDP `/products/aussie-chai` - Searchanise script present, recommendation mount present, state `rendered`

## Issues Encountered

Next 16 Cache Components requires Suspense around runtime reads even for small redirect and loader components. The fixes are now part of the search route pattern.

## User Setup Required

None. The implementation uses the existing `NEXT_PUBLIC_SEARCHANISE_ENABLED` and `NEXT_PUBLIC_SEARCHANISE_API_KEY` environment contract.

## Next Phase Readiness

The planned milestone phases are complete and verified. Remaining search refinement can happen as follow-up UX work, analytics work, or Searchanise merchandising configuration, but there is no blocker from this phase.

---

*Phase: 02-searchanise-api-search-results*
*Completed: 2026-05-27*
