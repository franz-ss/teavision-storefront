---
phase: 13-production-parity-collection-pagination
reviewed: 2026-06-12T00:53:36Z
depth: standard
files_reviewed: 17
files_reviewed_list:
  - src/components/ui/pagination/pagination.tsx
  - src/components/ui/pagination/pagination.stories.tsx
  - src/components/ui/pagination/index.ts
  - src/app/(storefront)/collections/[handle]/_lib/page-types.ts
  - src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts
  - src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts
  - src/app/(storefront)/collections/[handle]/_components/page-content.tsx
  - src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx
  - src/app/(storefront)/collections/[handle]/_components/product-list.tsx
  - src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx
  - src/app/(storefront)/collections/[handle]/page.tsx
  - src/app/(storefront)/collections/[handle]/[category]/page.tsx
  - src/lib/shopify/operations/collection.ts
  - src/lib/shopify/queries/collection.graphql
  - src/lib/shopify/types/index.ts
  - src/components/search/search-pagination/search-pagination.tsx
  - src/components/ui/index.ts
findings:
  critical: 1
  warning: 3
  info: 6
  total: 10
status: issues_found
---

# Phase 13: Code Review Report

**Reviewed:** 2026-06-12T00:53:36Z
**Depth:** standard
**Files Reviewed:** 17
**Status:** issues_found

## Summary

Reviewed the numbered PLP pagination implementation: the shared `ui/pagination` primitive, the cursor-index GraphQL query and operations, the collection page-content rewiring (page param parsing, out-of-range redirect, stale-cursor fallback), SEO metadata/prev-next links, and the SearchPagination consolidation. The `Pagination` primitive itself is solid (correct windowing math, correct a11y attributes), `parsePageParam` is well-hardened and well-tested, and the SearchPagination dedup is clean.

One Critical defect exists: the stale-cursor fallback can redirect a page to itself, producing an infinite redirect loop that persists for an entire cache window — and the unit test suite asserts this looping behavior as correct. Three warnings concern category-page pagination URLs carrying a redundant serialized filter param (non-canonical URL variants on an SEO-parity phase), dead metadata code that silently does nothing, and divergent duplicate cursor-index fetches that are the root cause of the Critical issue.

## Critical Issues

### CR-01: Stale-cursor fallback redirects a page to itself — infinite redirect loop

**File:** `src/app/(storefront)/collections/[handle]/_components/page-content.tsx:129-143`
**Issue:** The stale-cursor fallback fires when `collectionProductsResult.products.length === 0 && page > 1`, and redirects to `pageIndex.totalPages`. When the requested page *is* the last page (`page === pageIndex.totalPages`) and it comes back empty, the redirect target is the exact URL currently being served. Because `getCollectionPageIndex` and `getCollectionProductsPage` are independent `'use cache'` entries with `cacheLife('hours')`, they routinely diverge after a collection shrinks: the cached index still reports `totalPages = 2` while a fresh product fetch resolves the page-2 cursor past the new end of the collection and returns zero products. Every request to `/collections/all?page=2` then 307-redirects to `/collections/all?page=2`, looping until the browser aborts with `ERR_TOO_MANY_REDIRECTS` — and the loop persists until the stale cache entry expires (up to an hour). The same trap exists via the out-of-range path: `page > totalPages` redirects to `totalPages`, which, if empty, re-enters the self-redirect.

The existing test locks in the broken behavior rather than catching it — `page-content.test.tsx:115-130` requests `page=2` with `totalPages: 2` and asserts `redirect:/collections/all?page=2`, i.e. a redirect to the URL under test.

**Fix:** Make the fallback target strictly decrease so the redirect chain always terminates at page 1 (which never redirects):

```tsx
// Stale-cursor fallback (D-22): always step strictly downward so we can never
// redirect to the URL currently being served.
if (collectionProductsResult.products.length === 0 && page > 1) {
  const fallbackPage = Math.min(page - 1, pageIndex.totalPages)
  redirect(
    getPaginationHref({
      category,
      handle,
      page: fallbackPage,
      selectedFilters,
      sort,
    }),
  )
}
```

Update the test at `page-content.test.tsx:115-130` to assert the new target (`redirect:/collections/all` for page 2 of a stale 2-page index) instead of the self-redirect.

## Warnings

### WR-01: Category-page pagination, prev/next, and redirect URLs embed a redundant serialized category filter param

**File:** `src/app/(storefront)/collections/[handle]/_components/page-content.tsx:106-114, 135-143, 194-201, 259-267`
**Issue:** All four pagination href call sites pass `selectedFilters: activeSelectedFilters`, which on a category route includes `getCategoryFilterInput(selectedCategoryTag)` — i.e. `{"tag":"categories_…"}` — even though the category is already encoded in the URL path. On `/collections/all/herbs`, page-2 links, the hoisted `<link rel="prev/next">` hrefs, and the out-of-range/stale redirect `Location` headers all become `/collections/all/herbs?filter=%7B%22tag%22%3A%22categories_herbs%22%7D&page=2`. The state round-trips only by accident: `parseSelectedFilterParams` silently discards category filters on the next request and the tag is re-derived from the path. The result is two URL variants for every category page — directly at odds with this phase's production-parity SEO goal (prev/next links advertise non-canonical URLs to crawlers) — and it contradicts the codebase's own convention, since `getHref`/`getCategoryHref` (sort/filter links) correctly use the plain `selectedFilters`. Note `Toolbar`/`Sidebar` should keep receiving `activeSelectedFilters` (display state); only the URL builders are wrong.
**Fix:** Pass `selectedFilters` (without the synthesized category input) to every `getPaginationHref` call in this file; the `category` argument already encodes that state in the path. Add a `page-helpers`/`page-content` test asserting that category-page pagination hrefs contain no `filter=` param.

### WR-02: Dead spread in generateMetadata — pagination metadata intent silently does nothing

**File:** `src/app/(storefront)/collections/[handle]/page.tsx:37-38, 57-58`
**Issue:** `...(currentPage === 1 && {})` is a no-op for every input: when `currentPage === 1` it spreads an empty object; otherwise it spreads `false`, which object spread ignores. The `parsePageParam` call and its result are therefore entirely unused, and the comment "Suppress page=1 from the URL: the clean collection URL IS page 1" describes behavior the code does not implement. This is dead code masking unfinished intent — either paginated pages were meant to get distinct metadata (e.g. a `Page N` title suffix or page-aware canonical) and never did, or the block should not exist. Either way a reader cannot tell which behavior is the decision.
**Fix:** If D-03 ("canonical always points at the base collection") is the final decision, delete lines 37-38 and 57-58 and the now-unused `parsePageParam` import. If paginated metadata was intended, implement it explicitly instead of the inert spread.

### WR-03: Cursor index fetched twice per request from independently cached entries that can diverge mid-render

**File:** `src/lib/shopify/operations/collection.ts:476-503, 526-548`; `src/app/(storefront)/collections/[handle]/_components/page-content.tsx:64-76, 96-102`
**Issue:** `getCollectionPageIndex` and `getCollectionProductsPage` each call the uncached `fetchCollectionCursorIndex` and are cached as *separate* `'use cache'` entries. Within a single render, `page-content.tsx` consumes `totalPages` from one entry and the resolved `after` cursor from the other; because the entries are created and expire at different times, they can disagree about the collection's contents inside one request — this divergence is exactly what arms the CR-01 redirect loop, and it falsifies the code comment claiming the shared cache policy keeps "index and page data" within one window of each other (two independent windows can straddle a collection edit). Additionally, the initial `getCollectionProductsPage(handle, 1, …)` call walks the *entire* collection cursor index (sequential 250-item round trips) even though `resolveAfterCursor` returns `null` for page 1 without ever reading the cursors, and on `page > 1`/category requests the full index walk runs a second time inside the page fetch.
**Fix:** Extract a single cached cursor-index function (e.g. `'use cache'` on `fetchCollectionCursorIndex` keyed by handle/sort/reverse/filters) and have both `getCollectionPageIndex` and `getCollectionProductsPage` read from it, so total-pages and cursor resolution come from one snapshot. In `getCollectionProductsPage`, short-circuit `page <= 1` before fetching the index:

```ts
const after =
  page <= 1
    ? null
    : resolveAfterCursor(
        await getCollectionCursorIndex(handle, sortKey, reverse, filters),
        page,
        first,
      )
```

## Info

### IN-01: `CollectionPageIndex.afterCursor` is always null and its doc comment is wrong

**File:** `src/lib/shopify/types/index.ts:119-126`; `src/lib/shopify/operations/collection.ts:496-502`
**Issue:** The field is documented as "The resolved `after` cursor for the requested page", but `getCollectionPageIndex` takes no page argument and hardcodes `afterCursor: null`. No consumer reads it. Dead, misleading API surface.
**Fix:** Remove `afterCursor` from `CollectionPageIndex` and the return value, or implement it by accepting a `page` parameter.

### IN-02: `createVisiblePages` exported through the UI barrel but never consumed; primitive has no unit test

**File:** `src/components/ui/pagination/index.ts:1`; `src/components/ui/pagination/pagination.tsx:24`
**Issue:** `createVisiblePages` is only used inside `pagination.tsx`. Exporting it via `@/components/ui` widens the public API for nothing — and the windowing/ellipsis math it implements (the most fragile logic in the primitive) has no unit test; only Storybook stories exercise it.
**Fix:** Either drop the export from `index.ts`, or keep it and add a `pagination.test.ts` covering the boundary cases (`totalPages = 7` vs `8`, `currentPage` at 1, 2, mid, `totalPages - 1`, `totalPages`).

### IN-03: Duplicate `next/navigation` import statements

**File:** `src/app/(storefront)/collections/[handle]/_components/page-content.tsx:1-2`
**Issue:** `redirect` and `notFound` are imported from `'next/navigation'` on two consecutive lines.
**Fix:** `import { notFound, redirect } from 'next/navigation'`

### IN-04: `pageIndex.totalPages > 0` guards are dead conditions

**File:** `src/app/(storefront)/collections/[handle]/_components/page-content.tsx:105, 133`
**Issue:** `getCollectionPageIndex` returns `totalPages = 1` when `totalCount === 0` (`collection.ts:494`), so `totalPages` is never 0 and both guards are always true. Harmless, but they imply a zero-pages state that cannot occur and obscure the real invariant.
**Fix:** Remove the `&& pageIndex.totalPages > 0` clauses (and simplify alongside the CR-01 fix).

### IN-05: Toolbar shows per-page product count although the true total is now available

**File:** `src/app/(storefront)/collections/[handle]/_components/page-content.tsx:238`
**Issue:** `productCount={products.length}` displays at most the page size (e.g. "24 products" on every page of a 120-product collection) while pagination beside it shows 5 pages. `pageIndex.totalCount` now provides the true total this phase computed. Pre-existing display semantics, but newly inconsistent with the visible page count.
**Fix:** Pass `pageIndex.totalCount` (when no client-side category narrowing applies) so the count matches the pagination.

### IN-06: Line exceeds Prettier print width — file likely not formatted

**File:** `src/lib/shopify/operations/collection.ts:547`
**Issue:** `return getCollectionProductsWithFilters(handle, first, sortKey, reverse, filters, after)` is ~90 characters on one line, which Prettier would wrap; the rest of the file is wrapped at 80. Suggests `pnpm format` was not run on the final state.
**Fix:** Run `pnpm format`.

---

_Reviewed: 2026-06-12T00:53:36Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
