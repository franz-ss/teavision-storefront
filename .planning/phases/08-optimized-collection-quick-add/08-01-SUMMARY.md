---
phase: 08-optimized-collection-quick-add
plan: 01
status: complete
completed_at: "2026-06-03T17:09:15+08:00"
requirements:
  - CQA-01
  - CQA-02
  - CQA-03
  - CQA-04
  - CQA-05
  - CQA-06
commits:
  - 78fd865 feat(08-01): add listing quick-add data contract
  - aa38d15 feat(08-01): add collection quick-add button
  - 986a5bc feat(08-01): restore optimized collection card quick-add
  - 1477a39 fix(08-01): show add trigger on available product cards
---

# 08-01 Summary: Optimized Listing Quick Add

## What Changed

Collection and search listing products no longer carry a listing-level
`quickAdd` contract. The final optimized path keeps `ProductCard` lean by
removing the bounded listing variant probe and deferring full purchase data
until the customer asks to buy.

Implemented flow:

- Shopify collection listings no longer query `variants(first: 2)` for quick-add eligibility.
- Searchanise summaries no longer synthesize listing quick-add data from `add_to_cart_id`.
- `ProductCard` remains a Server Component and renders an `Add to cart` trigger for every available product.
- The trigger opens `ProductQuickView`, which lazily fetches `/api/products/[handle]/quick-view`.
- Inside the modal, customers select pack size with `Select`, adjust quantity with `QuantityStepper`, and submit through `addItem(selectedVariant.id, quantity)`.
- Sold-out products render no purchase action, while `More info` remains available for every product.

`ProductQuickView` is the only purchase client leaf used from listing cards. It reuses `useAddToCart`, calls the existing cart Server Action path through that hook, and renders accessible pending, success, and error feedback. `ProductCard` renders:

- `Add to cart` for all available products, opening Quick View for explicit size and quantity selection.
- no purchase action for sold-out products.
- `More info` for all products.

The old purchase behavior was restored without restoring the full
`ProductPurchaseForm` to listing cards. This preserves pack-size and quantity
selection while avoiding extra variant data in every collection/search listing
payload.

## Verification

Passed:

- `pnpm codegen`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm build-storybook`
- `pnpm test:contracts` through commit hooks

Targeted source checks passed:

- `collection.graphql` no longer contains `variants(first: 2)`.
- `collection.graphql` no longer fetches listing `options`.
- `ProductCard` has no `ProductPurchaseForm` import/render.
- `ProductCard` has no `'use client'` directive.
- `src` contains no `quickAdd`, `ProductQuickAdd`, `QuickAddButton`, `quick-add-button`, or `variants(first: 2)` references.
- `ProductQuickView` renders `Select` and `QuantityStepper`, and calls `addItem(selectedVariant.id, quantity)`.

Automated Chrome checks against the built Storybook bundle passed:

- `Product/ProductQuickView Add To Cart Trigger`: selected the 1kg variant, increased quantity to 2, submitted, and rendered `Added to cart`.
- `Collection/ProductCard Default`: `Add to cart` trigger shown.
- `Collection/ProductCard Multi Variant`: `Add to cart` trigger shown.
- `Collection/ProductCard Sold Out`: purchase actions absent, `More info` remains.

Live app smoke check against the built production server on `localhost:3001` passed:

- `/collections/all` rendered enabled ProductCard `Add to cart` triggers.
- Clicking the first trigger fetched `/api/products/2003y-mini-ripe-pu-erh-tea-brick-250g-box/quick-view` with HTTP 200.
- The modal rendered a pack-size `Select`, a `QuantityStepper`, and the final `Add to Cart` action.

## Residual Risk

The restored affordance still creates one tiny `ProductQuickView` client island
per available listing card. That is intentionally much lighter than restoring
`ProductPurchaseForm` or fetching variant/options data for every listing item,
but a future optimization could consolidate list-level modal state if listing
hydration budgets tighten further.

The lazy modal now depends on the quick-view API route being available for
listing purchase. If that route fails, the modal shows retryable error feedback
instead of guessing a variant.
