---
phase: 13-production-parity-collection-pagination
verified: 2026-06-12T10:00:00Z
status: human_needed
score: 10/10 must-haves verified
overrides_applied: 0
re_verification: null
human_verification:
  - test: "Verify pager visual appearance at mobile (375px) and desktop (1280px) widths"
    expected: "Full windowed pager renders without text overflow or layout shift; warm/botanical token styling (bg-brand, text-paper, bg-card, text-ink) matches Phase 11 search pagination style exactly"
    why_human: "Token class rendering and responsive layout cannot be confirmed by grep or static markup analysis"
  - test: "Click a page link and verify scroll-to-grid behavior"
    expected: "Browser scrolls to the product grid (not page top) when navigating between pages via the pager"
    why_human: "The #product-grid anchor appended to hrefs is correct in code but scroll behavior requires a live browser interaction"
  - test: "Verify Storybook story renders correctly at http://localhost:6006/?path=/story/ui-pagination--few-pages"
    expected: "All Storybook stories (FewPages, FirstPage, MiddlePage, LastPage, WithEllipsis, TwoPages, SinglePage) render with correct visual styling and no JS errors"
    why_human: "Storybook visual rendering requires a browser; pnpm test:stories only validates snapshot, not visual correctness"
---

# Phase 13: Production-Parity Collection Pagination Verification Report

**Phase Goal:** Restore classic `?page=N` PLP pagination while preserving production SEO canonicals, robots behavior, and bounded Shopify Storefront GraphQL payloads.
**Verified:** 2026-06-12T10:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Collection PLPs use `?page=N` numbered pagination instead of `Next products` | VERIFIED | `product-list.tsx` renders `<Pagination>` primitive; "Next products" text absent from all collection source files; `page-types.ts` `SearchParams` has `page` field, no `cursor` field |
| 2 | Public cursor navigation removed from all normal PLP links | VERIFIED | `withQuery()` in `page-helpers.ts` never emits `cursor=`; `SearchParams` type has no cursor field; grep over collection route `*.tsx` confirms no `cursor=` in generated hrefs |
| 3 | Collection canonical points at base collection URL (paginated or not) | VERIFIED | `[handle]/page.tsx` line 48: `alternates: { canonical: canonicalPath }` where `canonicalPath = getPath(handle)` — no page number in canonical; orchestrator live-check confirmed canonical on `?page=2` |
| 4 | Category route canonicalizes to parent collection URL (D-27 gap fix) | VERIFIED | `[handle]/[category]/page.tsx` has its own `generateMetadata` (not re-exporting parent); canonical is `getPath(handle)` — excludes category path segment; orchestrator live-check confirmed `/collections/all/categories_all-herbs?page=2` canonical = `https://teavision.com.au/collections/all` |
| 5 | Hoisted `rel=prev` / `rel=next` link tags emitted for adjacent pages | VERIFIED | `page-content.tsx` lines 210-211 render `<link rel="prev">` and `<link rel="next">` as JSX; React 19 hoists them to `<head>`; orchestrator live-check confirmed both tags present on `?page=2` |
| 6 | Out-of-range pages redirect to the last valid page (no empty 200 listing) | VERIFIED | `page-content.tsx` lines 108-117: `if (page > pageIndex.totalPages && pageIndex.totalPages > 0)` redirects to `pageIndex.totalPages`; test asserts `/collections/all?page=999` throws `redirect:/collections/all?page=3` for a 3-page collection; orchestrator live-check confirmed `?page=999` → 307 to `?page=11` |
| 7 | Stale-cursor fallback redirects strictly downward — no infinite redirect loop | VERIFIED | `page-content.tsx` lines 137-148: `Math.min(page - 1, pageIndex.totalPages)` ensures target is always < requested page; test at line 152 asserts page 2 (stale, 2-page index) → `redirect:/collections/all` (page 1); test at line 171 asserts page 3 of 3 (empty) → `redirect:/collections/all?page=2` |
| 8 | Shopify product-payload fetching remains bounded (24/page; index is cursor-only) | VERIFIED | `GetCollectionCursorIndex` query (`collection.graphql:113-138`) fetches only `edges { cursor }` and `pageInfo` — no product fields; `COLLECTION_PRODUCT_PAGE_SIZE = 24` constant; `getCollectionProductsPage` fetches exactly `first` products per call; `fetchCollectionCursorIndex` cached with `cacheLife('hours')` keyed by handle |
| 9 | Shared `ui/pagination` primitive used by both PLPs and search | VERIFIED | `src/components/ui/pagination/pagination.tsx` exists; `product-list.tsx` imports `Pagination` from `@/components/ui`; `search-pagination.tsx` is a thin wrapper delegating directly to `<Pagination>`; `src/components/ui/index.ts` re-exports from `./pagination` |
| 10 | Tests, Storybook story, and build verification pass | VERIFIED | Orchestrator-provided evidence: `pnpm typecheck` pass, `pnpm lint` pass, `pnpm test:unit` 30 files 108 tests pass, `pnpm test:stories` 90 files 313 tests pass (includes ui/pagination stories), `pnpm build` pass, `pnpm codegen` regenerated types committed at c7a301f |

**Score:** 10/10 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/ui/pagination/pagination.tsx` | Shared windowed pager primitive | VERIFIED | 126 lines; `Pagination` + `createVisiblePages` exports; warm token classes (`bg-brand`, `text-paper`, `bg-card`, `text-ink`); `aria-current="page"` on current link; no `any` types |
| `src/components/ui/pagination/pagination.stories.tsx` | Storybook stories for all states | VERIFIED | 7 stories: FewPages, FirstPage, MiddlePage, LastPage, WithEllipsis, TwoPages, SinglePage |
| `src/components/ui/pagination/index.ts` | Barrel export | VERIFIED | Exports `Pagination` and `createVisiblePages` |
| `src/components/ui/index.ts` | Re-exports pagination | VERIFIED | Line 2: `export * from './pagination'` |
| `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts` | `parsePageParam`, `getPaginationHref`, page-reset in `getHref` | VERIFIED | `parsePageParam` (line 441): handles undefined/zero/negative/decimal/array; `getPaginationHref` (line 488): uses `withQuery` with page param; `getHref` (line 465): never passes page to `withQuery` |
| `src/app/(storefront)/collections/[handle]/_lib/page-types.ts` | `SearchParams` uses `page` not `cursor` | VERIFIED | `page?: string \| string[]`; no `cursor` field |
| `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` | Page resolution, prev/next links, redirect logic | VERIFIED | Calls `getCollectionPageIndex` + `getCollectionProductsPage`; stale-cursor fallback strictly descends; `<link rel="prev/next">` rendered as JSX |
| `src/app/(storefront)/collections/[handle]/_components/product-list.tsx` | `Pagination` primitive replaces "Next products" | VERIFIED | Renders `<Pagination>` with `aria-label="Collection pagination"`; `#product-grid` anchor appended to hrefs; no "Next products" text |
| `src/app/(storefront)/collections/[handle]/page.tsx` | Canonical always base collection | VERIFIED | `alternates.canonical` = `getPath(handle)` unconditionally; dead pagination spread removed (WR-02 fix) |
| `src/app/(storefront)/collections/[handle]/[category]/page.tsx` | Own `generateMetadata`; canonical → parent | VERIFIED | Own `generateMetadata` function; canonical = `getPath(handle)` (excludes category segment) |
| `src/lib/shopify/operations/collection.ts` | `fetchCollectionCursorIndex` (cached), `getCollectionPageIndex`, `getCollectionProductsPage` | VERIFIED | `fetchCollectionCursorIndex` has `'use cache'` + `cacheTag` + `cacheLife` at lines 444-446; `getCollectionProductsPage` short-circuits page <= 1 before cursor fetch; single cached function shared by both consumers (WR-03 fix) |
| `src/lib/shopify/queries/collection.graphql` | `GetCollectionCursorIndex` query — cursors only | VERIFIED | Lines 113-138: fetches only `pageInfo { hasNextPage endCursor }` and `edges { cursor }` — no product fields |
| `src/components/search/search-pagination/search-pagination.tsx` | Thin wrapper over shared Pagination primitive | VERIFIED | 28 lines; directly renders `<Pagination>` with mapped props; no duplicated windowing logic |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `product-list.tsx` | `@/components/ui` Pagination | import + render | WIRED | `import { Button, Pagination } from '@/components/ui'`; rendered at line 61 with `aria-label="Collection pagination"` |
| `page-content.tsx` | `product-list.tsx` ProductList | import + props | WIRED | `buildPageHref` callback passes `getPaginationHref(...)` with plain `selectedFilters` (WR-01 fix); `currentPage` and `totalPages` from page index |
| `page-content.tsx` | `getCollectionPageIndex` | import + await | WIRED | Imported from `@/lib/shopify/operations/collection`; called at line 96 with `activeProductFilters` |
| `page-content.tsx` | `getCollectionProductsPage` | import + await | WIRED | Called at lines 67 (page 1 initial) and 122-130 (page N) |
| `search-pagination.tsx` | `@/components/ui` Pagination | import + render | WIRED | `import { Pagination } from '@/components/ui'`; renders `<Pagination>` directly |
| `fetchCollectionCursorIndex` | `getCollectionPageIndex` + `getCollectionProductsPage` | shared cached call | WIRED | Both consumers call `fetchCollectionCursorIndex(...)` — single `'use cache'` entry ensures one index snapshot per render (WR-03 fix) |
| `[category]/page.tsx` `generateMetadata` | `getPath(handle)` canonical | import + return | WIRED | `canonicalPath = getPath(handle)` passed to `alternates.canonical` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `product-list.tsx` | `products`, `currentPage`, `totalPages` | Props from `page-content.tsx` | Yes — `products` from `getCollectionProductsPage` (Shopify API); `totalPages` from `getCollectionPageIndex` (cursor index) | FLOWING |
| `pagination.tsx` | `currentPage`, `totalPages`, `buildPageHref` | Props | Yes — passed from `product-list.tsx` / `search-pagination.tsx` | FLOWING |
| `page-content.tsx` | `pageIndex`, `collectionProductsResult` | `getCollectionPageIndex` + `getCollectionProductsPage` Shopify ops | Yes — Shopify Storefront GraphQL; cursor index is id-only bounded fetch | FLOWING |

### Behavioral Spot-Checks

Orchestrator-provided live-route evidence treated as verified behavioral checks:

| Behavior | Check | Result | Status |
|----------|-------|--------|--------|
| Base collection renders pager with true last page | GET /collections/all | 200; aria-label="Collection pagination"; last page = 11 | PASS |
| Page 2 canonical = base collection | GET /collections/all?page=2 | canonical = https://teavision.com.au/collections/all | PASS |
| Sort + page preserves both params in pager links | GET /collections/all?sort=title-asc&page=2 | 200; canonical = base; prev/next preserve sort | PASS |
| Category page canonical = parent collection | GET /collections/all/categories_all-herbs?page=2 | canonical = https://teavision.com.au/collections/all | PASS |
| Out-of-range page redirects to last valid page | GET /collections/all?page=999 | 307 redirect to /collections/all?page=11 | PASS |
| Category pager hrefs contain no redundant filter= param | Route HTML for /collections/all/categories_all-herbs?page=2 | Zero `cursor=` anywhere; no `filter=` in pager hrefs | PASS |
| No cursor= URLs emitted anywhere | HTML scan of all live routes above | Zero `cursor=` in HTML | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| PLP-PAGE-01 | 13-01-PLAN | `?page=N` public URLs; no `?cursor=` indexable navigation | SATISFIED | `page-types.ts` has `page` field; `withQuery` never emits `cursor=`; all pager hrefs use `?page=N` |
| PLP-PAGE-02 | 13-01-PLAN | Production SEO parity: canonicals, prev/next, sort/filter exclusion | SATISFIED | Canonical = base collection URL for all paginated and category routes; prev/next JSX links hoisted by React 19; robots.ts preserves `?page=N` accessibility while disallowing only `/api/` |
| PLP-PAGE-03 | 13-01-PLAN | Bounded Shopify Storefront fetching — no 250-product PLP fetch | SATISFIED | Cursor index query fetches only `edges { cursor }` (no product fields); product page bounded to 24; `COLLECTION_PRODUCT_PAGE_SIZE = 24` constant |
| PLP-PAGE-04 | 13-01-PLAN | Numbered pagination UX replaces "Next products"; true last page; Phase 11 styling | SATISFIED | `Pagination` primitive renders windowed pager with prev/next and page numbers; `totalPages` from cursor index; warm token classes match Phase 11 (visual confirmation deferred to human check) |
| PLP-PAGE-05 | 13-01-PLAN | Bad page params safe; out-of-range redirect; sort/filter semantics preserved | SATISFIED | `parsePageParam` returns 1 for invalid/zero/negative/decimal; out-of-range → redirect to `totalPages`; stale-cursor → strictly descending redirect; `selectedFilters` excludes synthesized category filter from pager hrefs |
| PLP-PAGE-06 | 13-01-PLAN | Unit tests, operation tests, route checks, standard project checks | SATISFIED | `pnpm typecheck`, `pnpm lint`, `pnpm test:unit` (108 tests), `pnpm test:stories` (313 tests), `pnpm build` all pass per orchestrator evidence; `pnpm codegen` run and types committed at c7a301f |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `page-content.tsx` | 1-2 | Duplicate `next/navigation` import (IN-03) | Info | Cosmetic only; no functional impact; merge to `import { notFound, redirect } from 'next/navigation'` |
| `collection.ts` | 505 | `afterCursor: null` hardcoded in `getCollectionPageIndex` return value; field documented as "resolved after cursor" but never is (IN-01) | Info | Dead API surface; no consumer reads it; remove `afterCursor` from `CollectionPageIndex` or implement with a `page` parameter |
| `page-content.tsx` | 108 | `&& pageIndex.totalPages > 0` guard is always true (`totalPages` is always ≥ 1 per `collection.ts:498`) (IN-04) | Info | Dead condition; harmless but misleading |
| `page-content.tsx` | 238 | `productCount={products.length}` shows at most 24; `pageIndex.totalCount` available for true total (IN-05) | Info | Pre-existing UX inconsistency; not a regression |
| `pagination/index.ts` | 1 | `createVisiblePages` exported at UI barrel level but never consumed outside `pagination.tsx`; windowing math has no unit test (IN-02) | Info | Widens public API unnecessarily; ellipsis/windowing logic untested at unit level |

No TBD, FIXME, or XXX markers found in any file modified by this phase. No placeholder implementations or empty return stubs.

**All Info findings are pre-existing style/quality items with no functional impact on the phase goal. None qualify as blockers.**

### Locked Decision Compliance

All locked decisions from the PLAN are honored in code:

- **D-01 to D-07** (public `?page=N` URLs, no cursor in public links, canonical/prev-next via JSX): HONORED
- **D-05** (prev/next via hoisted `<link>` tags, not Metadata API): HONORED — JSX `<link rel="prev/next">` in `page-content.tsx`
- **D-10** (id-only cursor index, no sequential product-payload walking): HONORED — `GetCollectionCursorIndex` fetches only `edges { cursor }`
- **D-11** (index and page cache share same window — cannot diverge): HONORED — single `fetchCollectionCursorIndex` with `'use cache'` shared by both consumers (WR-03 fix)
- **D-21** (page size stays 24): HONORED — `COLLECTION_PRODUCT_PAGE_SIZE = 24`
- **D-22** (stale-cursor → redirect, not retry): HONORED — `Math.min(page - 1, pageIndex.totalPages)` strictly descends
- **D-23** (shared `ui/pagination` primitive): HONORED — both PLPs and search use the same primitive
- **D-24** (out-of-range → redirect to last valid page): HONORED — lines 108-117
- **D-25** (sort/filter hrefs drop page param): HONORED — `getHref` / `getCategoryHref` never pass page to `withQuery`
- **D-26** (pager clicks scroll to grid top): HONORED — `#product-grid` anchor appended to `buildPageHref` output in `product-list.tsx`
- **D-27** (category pages canonical → parent collection): HONORED — `[category]/page.tsx` own `generateMetadata` with `getPath(handle)` canonical

### Human Verification Required

#### 1. Pager Visual Appearance at Mobile and Desktop

**Test:** Open `/collections/all?page=2` in a browser at 375px (mobile) and 1280px (desktop) widths. Inspect the pagination nav rendered below the product grid.
**Expected:** Full windowed pager displays without text overflow or layout shift; styling uses warm/botanical tokens (brand-colored current-page button, card-background idle buttons) matching the Phase 11 search pagination appearance exactly.
**Why human:** Token class rendering and responsive Tailwind layout cannot be confirmed by grep or static markup analysis. The `pageLinkClassName` function uses `bg-brand text-paper border-brand` for current and `bg-card text-ink hover:bg-brand-tint hover:text-brand` for idle — visual confirmation requires a browser.

#### 2. Scroll-to-Grid Behavior on Pager Click

**Test:** On a live `/collections/all` page with multiple pages, click a page number link.
**Expected:** The browser viewport scrolls to the top of the product grid (the `#product-grid` anchor target, not the page top), landing immediately above the product list.
**Why human:** The `#product-grid` anchor href append in `product-list.tsx` is correct in code, but whether the browser scroll position lands visually at the right spot (considering sticky headers, spacing) requires a live interaction.

#### 3. Storybook Story Visual Rendering

**Test:** Start `pnpm storybook` and open `http://localhost:6006/?path=/story/ui-pagination--few-pages`. Cycle through all 7 stories.
**Expected:** All stories render with correct visual styling. The `SinglePage (hidden)` story renders nothing (single page hides the nav). Ellipsis state shows `...` between non-adjacent page numbers.
**Why human:** `pnpm test:stories` validates snapshot correctness but not the visual output. Storybook is the approved component documentation surface per AGENTS.md.

---

## Gaps Summary

No gaps. All 10 must-have truths are VERIFIED. All 6 requirements (PLP-PAGE-01 through PLP-PAGE-06) are SATISFIED. The 1 Critical and 3 Warning review findings are fixed in the merged main tree (commits 44f3a54, 0e484e8, 602f3ea, 9af0c52). The 6 Info findings remain open as quality improvements but do not block the phase goal.

The `status: human_needed` reflects 3 items requiring browser-level verification (visual styling, scroll behavior, Storybook rendering) — standard for any phase delivering new UI components.

---

_Verified: 2026-06-12T10:00:00Z_
_Verifier: Claude (gsd-verifier)_
