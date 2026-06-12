---
status: partial
phase: 13-production-parity-collection-pagination
source: [13-VERIFICATION.md]
started: 2026-06-12T01:25:00Z
updated: 2026-06-12T03:30:00Z
---

## Current Test

2. Scroll-to-grid behavior on pager click (re-test after 13-02-GAP fix)

## Tests

### 1. Pager visual appearance at mobile and desktop widths

expected: On `/collections/all` and `/collections/all?page=2`, the numbered pager renders with warm/botanical token styling matching the Phase 11 search pagination, with no layout shift or text overflow at 375px (mobile) and 1280px (desktop). The true last page (currently 11) is visible, with ellipsis windowing for middle pages.
result: pass

### 2. Scroll-to-grid behavior on pager click

expected: Clicking any pager link lands the viewport at the top of the product grid (the `#product-grid` anchor), not the top of the page (D-26).
result: pending
note: "Fix applied in 13-02-GAP (commit 6d25b81): id moved onto the grid <ul> with scroll-mt-24 / lg:scroll-mt-32. Re-test at 375px and 1280px."

### 3. Storybook UI/Pagination stories render correctly

expected: All `UI/Pagination` stories (few-pages, ellipsis, first-page, last-page, middle states) render correctly in Storybook (`pnpm storybook`, then UI/Pagination in the sidebar). The story test runner already passes (313 tests); this is a visual confirmation.
result: pass

## Summary

total: 3
passed: 2
issues: 0
pending: 1
skipped: 0
blocked: 0

## Gaps

- truth: "Clicking any pager link lands the viewport at the top of the product grid (the `#product-grid` anchor), not the top of the page (D-26)."
  status: resolved
  resolved_by: "13-02-GAP (commit 6d25b81) — pending human re-confirmation"
  reason: "User reported: not working as expected"
  severity: major
  test: 2
  root_cause: "The `#product-grid` fragment target is a zero-height element immediately before the product grid, but the storefront header is sticky at `top-0` and no scroll offset is defined. Native fragment navigation aligns the target to the viewport top, where the sticky header covers the grid start."
  artifacts:
    - path: "src/app/(storefront)/collections/[handle]/_components/product-list.tsx"
      issue: "Renders the `#product-grid` target without a `scroll-mt-*` offset while pager hrefs navigate to that fragment."
    - path: "src/components/layout/header/header.tsx"
      issue: "Sticky `top-0` header overlays native fragment targets aligned to the viewport top."
    - path: "src/app/globals.css"
      issue: "No global `scroll-padding-top` offsets fragment navigation for the sticky header."
  missing:
    - "Add a sticky-header-aware scroll offset to the `#product-grid` target or equivalent document scroll padding."
    - "Extend coverage beyond fragment href presence to assert the anchor target carries the scroll offset."
    - "Manually verify pager navigation on mobile and desktop after the offset is applied."
  debug_session: ".planning/debug/collection-pagination-product-grid-anchor.md"
