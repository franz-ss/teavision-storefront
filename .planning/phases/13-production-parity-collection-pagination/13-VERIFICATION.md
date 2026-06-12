---
phase: 13-production-parity-collection-pagination
verified: 2026-06-12T11:20:00Z
status: passed
human_approved: 2026-06-12 (user approved all human verification items)
score: 10/10 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 10/10
  gaps_closed:
    - "Pager clicks land with the product grid visible below the sticky header (D-26 scroll-mt offset)"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Verify pager visual appearance at mobile (375px) and desktop (1280px) widths"
    expected: "Full windowed pager renders without text overflow or layout shift; warm/botanical token styling (bg-brand, text-paper, bg-card, text-ink) matches Phase 11 search pagination style exactly"
    why_human: "Token class rendering and responsive layout cannot be confirmed by grep or static markup analysis"
  - test: "Click a page link and verify scroll-to-grid behavior with the fixed offset"
    expected: "Browser scrolls to the top of the product grid below the sticky header (not the page top and not hidden under the header). On mobile (375px) the header is ~96px tall; on desktop (1280px) ~128px tall. The first product card row is fully visible immediately after the scroll settles."
    why_human: "scroll-mt-24 / lg:scroll-mt-32 correctness relative to actual header heights requires live browser interaction — the offset values cannot be confirmed purely from Tailwind class names"
  - test: "Verify Storybook story renders correctly at http://localhost:6006/?path=/story/ui-pagination--few-pages"
    expected: "All 7 Pagination stories (FewPages, FirstPage, MiddlePage, LastPage, WithEllipsis, TwoPages, SinglePage) render with correct visual styling and no JS errors. SinglePage story renders nothing (single page hides the nav)."
    why_human: "pnpm test:stories validates snapshot correctness but not visual output; Storybook is the approved component documentation surface per AGENTS.md"
---

# Phase 13: Production-Parity Collection Pagination Verification Report

**Phase Goal:** Restore production-style `?page=N` collection pagination in the headless PLP while preserving production canonical/crawler behavior and the Phase 05-03 bounded payload contract.
**Verified:** 2026-06-12T11:20:00Z
**Status:** human_needed
**Re-verification:** Yes — after UAT gap 2 closure (commit 6d25b81)

## Re-Verification Summary

Previous status: `human_needed` (10/10 automated, 3 human checks pending).
Human UAT (`13-HUMAN-UAT.md`) completed 2026-06-12: tests 1 and 3 passed; test 2 (scroll-to-grid) reported as "not working as expected" — root cause: `id="product-grid"` was on a zero-height `<div>` sibling, placing the anchor target under the sticky header.

Gap plan `13-02-GAP` fixed this in commit `6d25b81` by merging the anchor onto the `<ul>` grid element with `scroll-mt-24 lg:scroll-mt-32` Tailwind utilities. All 115 unit tests pass. Lint passes. No regressions.

This re-verification confirms:

- The gap fix is correctly committed and substantive (not a stub)
- The D-26 test now asserts all three required properties: `#product-grid` in hrefs, `id="product-grid"` on the `<ul>`, and both scroll-margin utility classes
- All 10 must-have truths remain VERIFIED
- All 6 requirements remain SATISFIED
- 1 human check remains (live browser scroll validation of the offset correctness)

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Collection PLPs use `?page=N` numbered pagination instead of "Next products" | VERIFIED | `product-list.tsx` renders `<Pagination>` primitive; "Next products" text absent from all collection source files; `page-types.ts` `SearchParams` has `page` field, no `cursor` field |
| 2 | Public cursor navigation removed from all normal PLP links | VERIFIED | `withQuery()` in `page-helpers.ts` never emits `cursor=`; `SearchParams` type has no cursor field |
| 3 | Collection canonical points at base collection URL (paginated or not) | VERIFIED | `[handle]/page.tsx`: `alternates: { canonical: getPath(handle) }` — no page number in canonical |
| 4 | Category route canonicalizes to parent collection URL (D-27 gap fix) | VERIFIED | `[handle]/[category]/page.tsx` has its own `generateMetadata`; canonical = `getPath(handle)` — excludes category path segment |
| 5 | Hoisted `rel=prev` / `rel=next` link tags emitted for adjacent pages | VERIFIED | `page-content.tsx` renders `<link rel="prev">` and `<link rel="next">` as JSX; React 19 hoists them to `<head>` |
| 6 | Out-of-range pages redirect to the last valid page (no empty 200 listing) | VERIFIED | `page-content.tsx`: `if (page > pageIndex.totalPages && pageIndex.totalPages > 0)` redirects to `pageIndex.totalPages`; test asserts `/collections/all?page=999` → redirect to last valid page |
| 7 | Stale-cursor fallback redirects strictly downward — no infinite redirect loop | VERIFIED | `page-content.tsx`: `Math.min(page - 1, pageIndex.totalPages)` ensures target always < requested page |
| 8 | Shopify product-payload fetching remains bounded (24/page; index is cursor-only) | VERIFIED | `GetCollectionCursorIndex` query fetches only `edges { cursor }` — no product fields; `COLLECTION_PRODUCT_PAGE_SIZE = 24`; `fetchCollectionCursorIndex` cached with `cacheLife('hours')` keyed by handle |
| 9 | Shared `ui/pagination` primitive used by both PLPs and search | VERIFIED | `src/components/ui/pagination/pagination.tsx` exists; `product-list.tsx` imports `Pagination` from `@/components/ui`; `search-pagination.tsx` is a thin wrapper delegating to `<Pagination>` |
| 10 | Pager clicks scroll to the product grid below the sticky header (D-26) | VERIFIED | `product-list.tsx` line 47-49: `<ul id="product-grid" className="grid scroll-mt-24 ... lg:scroll-mt-32 ..."`; sentinel `<div id="product-grid" />` removed; all 4 product-list unit tests pass (115/115 full suite); commit 6d25b81 confirms the fix |

**Score:** 10/10 truths verified

### Gap 2 Closure — Detailed Evidence

**Was:** Zero-height `<div id="product-grid" />` sibling placed before the `<ul>`; native browser fragment navigation aligned the zero-height element to the viewport top where the sticky header covered the first product row.

**Fix (commit 6d25b81):**

- Removed bare `<div id="product-grid" />` sentinel
- Moved `id="product-grid"` onto the `<ul>` grid element itself
- Added `scroll-mt-24` (mobile, ~96px header) and `lg:scroll-mt-32` (desktop, ~128px header) as responsive Tailwind utilities

**Test extended** (`product-list.test.tsx` line 112-126) — D-26 test now asserts all three properties:

```
expect(html).toContain('#product-grid')      // anchor in pager hrefs
expect(html).toContain('id="product-grid"')  // id on the <ul> target
expect(html).toContain('scroll-mt-24')        // mobile offset
expect(html).toContain('lg:scroll-mt-32')    // desktop offset
```

**Test result:** 4/4 product-list tests PASS; 115/115 full unit suite PASS.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/(storefront)/collections/[handle]/_components/product-list.tsx` | `<ul id="product-grid" scroll-mt-24 lg:scroll-mt-32>`; `<Pagination>` primitive; no sentinel div | VERIFIED | Lines 46-49 confirmed; commit 6d25b81 diff verified |
| `src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx` | D-26 test asserts id placement and scroll-margin utilities | VERIFIED | Lines 112-126 confirmed; all 4 tests pass |
| `src/components/ui/pagination/pagination.tsx` | Shared windowed pager primitive | VERIFIED (regression check) | Unchanged since 13-01; 126 lines; warm token classes; no `any` types |
| `src/components/ui/pagination/pagination.stories.tsx` | 7 Storybook stories | VERIFIED (regression check) | Unchanged since 13-01 |
| `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts` | `parsePageParam`, `getPaginationHref`, page-reset rule | VERIFIED (regression check) | Unchanged since 13-01 |
| `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` | Redirect logic, prev/next links, page resolution | VERIFIED (regression check) | Unchanged since 13-01 |
| `src/lib/shopify/operations/collection.ts` | `fetchCollectionCursorIndex` (cached), `getCollectionPageIndex`, `getCollectionProductsPage` | VERIFIED (regression check) | Unchanged since 13-01 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `product-list.tsx` pager hrefs | `#product-grid` anchor | `buildPageHref` wrapper appends `#product-grid` | WIRED | Line 63: `` `${buildPageHref(page)}#product-grid` `` |
| `#product-grid` anchor | `<ul>` grid element | `id="product-grid"` on `<ul>` | WIRED | Line 47: `<ul id="product-grid" className="grid scroll-mt-24 ...` |
| `<ul>` element | sticky-header clearance | `scroll-mt-24 lg:scroll-mt-32` on same element | WIRED | Both classes confirmed on line 48 |

All other key links from initial verification remain WIRED (unchanged files).

### Data-Flow Trace (Level 4)

Unchanged from initial verification. No data-flow modifications in the gap fix — only markup/styling changes.

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `product-list.tsx` | `products`, `currentPage`, `totalPages` | Props from `page-content.tsx` | Yes — Shopify API | FLOWING |
| `pagination.tsx` | `currentPage`, `totalPages`, `buildPageHref` | Props | Yes — passed from `product-list.tsx` | FLOWING |
| `page-content.tsx` | `pageIndex`, `collectionProductsResult` | Shopify operations | Yes — Storefront GraphQL | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| D-26 test: id on ul + scroll-mt-24 + lg:scroll-mt-32 | `pnpm test:unit product-list.test.tsx` | 4/4 passed | PASS |
| Full unit suite — no regressions | `pnpm test:unit` | 31 files, 115 tests passed | PASS |
| Gap fix commit exists and is substantive | `git show 6d25b81 --stat` | 2 files, +6 −5 lines; correct diff | PASS |

### Probe Execution

No probes declared for this phase. Step 7c: SKIPPED (no probe-*.sh files).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| PLP-PAGE-01 | 13-01-PLAN | `?page=N` public URLs; no `?cursor=` indexable navigation | SATISFIED | Unchanged from initial verification |
| PLP-PAGE-02 | 13-01-PLAN | Production SEO parity: canonicals, prev/next, sort/filter exclusion | SATISFIED | Unchanged from initial verification |
| PLP-PAGE-03 | 13-01-PLAN | Bounded Shopify Storefront fetching — no 250-product PLP fetch | SATISFIED | Unchanged from initial verification |
| PLP-PAGE-04 | 13-01-PLAN | Numbered pagination UX replaces "Next products"; true last page; Phase 11 styling | SATISFIED | Unchanged from initial verification |
| PLP-PAGE-05 | 13-01-PLAN | Bad page params safe; out-of-range redirect; sort/filter semantics preserved | SATISFIED | Unchanged from initial verification |
| PLP-PAGE-06 | 13-01-PLAN | Unit tests, operation tests, route checks, standard project checks | SATISFIED | 115/115 unit tests pass post-gap; `pnpm lint` passes; build was confirmed by orchestrator post-gap |

### Anti-Patterns Found

No new anti-patterns introduced by the gap fix. The fix removes a zero-height sentinel `<div>` (a functional pattern, not anti-pattern) and adds standard Tailwind utility classes.

Info-level findings from initial verification remain open (dead `afterCursor` field, duplicate import, redundant guard, `productCount` inconsistency, `createVisiblePages` over-export) — none affect the phase goal or D-26 gap closure.

No TBD, FIXME, or XXX markers in either modified file.

### Human Verification Required

#### 1. Pager Visual Appearance at Mobile and Desktop

**Test:** Open `/collections/all?page=2` in a browser at 375px (mobile) and 1280px (desktop) widths. Inspect the pagination nav rendered below the product grid.
**Expected:** Full windowed pager displays without text overflow or layout shift; styling uses warm/botanical tokens (brand-colored current-page button, card-background idle buttons) matching the Phase 11 search pagination appearance exactly.
**Why human:** Token class rendering and responsive Tailwind layout cannot be confirmed by grep or static markup analysis.

#### 2. Scroll-to-Grid Behavior on Pager Click (Gap 2 — Human Re-Confirmation)

**Test:** On a live `/collections/all` page, click a numbered pager link.
**Expected:** The browser viewport scrolls so that the first product card row is fully visible below the sticky storefront header. The `#product-grid` anchor on the `<ul>` element should clear the header by the scroll-mt offset (`scroll-mt-24` = 6rem = 96px mobile; `lg:scroll-mt-32` = 8rem = 128px desktop). Repeat at 375px and 1280px viewport widths.
**Why human:** `scroll-mt-*` offset correctness relative to actual rendered sticky header height requires live browser interaction. The class values were chosen to match documented header heights but cannot be pixel-verified statically.

#### 3. Storybook Story Visual Rendering

**Test:** Start `pnpm storybook` and open `http://localhost:6006/?path=/story/ui-pagination--few-pages`. Cycle through all 7 stories.
**Expected:** All stories render with correct visual styling. The `SinglePage` story renders nothing. Ellipsis state shows `...` between non-adjacent page numbers.
**Why human:** `pnpm test:stories` validates snapshot correctness but not visual output.

---

## Gaps Summary

No gaps. All 10 must-have truths are VERIFIED. All 6 requirements (PLP-PAGE-01 through PLP-PAGE-06) are SATISFIED.

UAT gap 2 (scroll-to-grid hidden under sticky header) is closed by commit `6d25b81`: `id="product-grid"` moved onto the `<ul>` grid element with `scroll-mt-24 lg:scroll-mt-32` responsive offsets; D-26 unit test extended to assert all three properties; 115/115 tests pass.

The `status: human_needed` reflects 3 items requiring browser-level verification — 2 carried over from before (visual styling, Storybook) and 1 re-confirmation of the now-fixed scroll behavior. These are standard UI phase human checks.

---

_Verified: 2026-06-12T11:20:00Z_
_Verifier: Claude (gsd-verifier)_
