# Collection Pagination Product Grid Anchor

## Symptom

During Phase 13 UAT, clicking a collection pager link did not land the viewport cleanly at the top of the product grid. The URL includes `#product-grid`, but the resulting viewport shows the top of the grid obscured by the sticky site header.

## Reproduction

1. Open `/collections/all`.
2. Click a numbered pagination link.
3. Observe navigation to a URL like `/collections/all?page=2#product-grid`.
4. The viewport aligns to the grid target, but the sticky header covers the target area.

## Root Cause

`ProductList` renders `#product-grid` as a zero-height target immediately before the product card `<ul>`, and pagination links append that fragment. The site header is `sticky top-0`, with a desktop utility bar and main header height, but neither the target nor the document defines a scroll offset. Native fragment navigation therefore aligns the target to the top of the viewport where the sticky header overlays it.

## Evidence

- `src/app/(storefront)/collections/[handle]/_components/product-list.tsx` renders `<div id="product-grid" />` immediately before the grid.
- The same file appends `#product-grid` to pager hrefs.
- `src/components/layout/header/header.tsx` renders `<header className="sticky top-0 z-60">`.
- `src/app/globals.css` has no global `scroll-padding-top`; the `#product-grid` target has no `scroll-mt-*` class.
- Existing unit coverage only checks that `#product-grid` appears in rendered HTML, not the final viewport position after fragment navigation.

## Suggested Fix Direction

Give the collection grid anchor an explicit scroll offset for the sticky header, preferably on the target element with a tokenized Tailwind utility such as `scroll-mt-*`. Add or update coverage so the anchor target carries the offset class, and manually verify mobile and desktop pager navigation.

## Resolution

Resolved by 13-02-GAP (commit 6d25b81, 2026-06-12): moved `id="product-grid"` onto the product grid `<ul>` and added `scroll-mt-24 lg:scroll-mt-32` to offset the sticky header. D-26 test extended to cover the offset. Pending human re-confirmation in 13-HUMAN-UAT.md test 2.
