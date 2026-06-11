---
phase: 08-optimized-collection-quick-add
plan: 01
status: complete
completed_at: '2026-06-03T17:09:15+08:00'
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
  - be35fda fix(08-01): restore optimized listing purchase controls
---

# 08-01 Summary: Optimized Listing Quick Add

## What Changed

Collection and search listing products no longer carry a listing-level
`quickAdd` contract. The final optimized path restores the old inline purchase
controls on `ProductCard` while fetching only the variant fields those controls
need.

Implemented flow:

- Shopify collection listings no longer query `variants(first: 2)` for quick-add eligibility.
- Shopify collection listings query `variants(first: 20)` with purchase-form fields only.
- Searchanise summaries no longer synthesize listing quick-add data from `add_to_cart_id`.
- Searchanise summaries retain parsed `shopify_variants` or fallback `add_to_cart_id` as `variants`.
- `ProductCard` remains a Server Component and renders `ProductPurchaseForm` for every available product.
- Inside the card, customers select pack size with `Select`, adjust quantity with `QuantityStepper`, and submit through `addItem(selectedVariant.id, quantity)`.
- Sold-out products render no purchase action, while `More info` remains available for every product.

`ProductPurchaseForm` is the purchase client leaf used from listing cards. It reuses `useAddToCart`, calls the existing cart Server Action path through that hook, and renders accessible pending, success, and error feedback. `ProductCard` renders:

- pack-size `Select`, `QuantityStepper`, price, and `Add to cart` for available products.
- no purchase action for sold-out products.
- `More info` for all products.

The old purchase behavior is restored on listing cards. The optimization is no
longer a direct quantity-1 quick-add; it is a slimmer listing data contract that
fetches variant purchase fields without fetching full product detail,
description HTML, images, options, bulk pricing tiers, or recommendation data.

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
- `collection.graphql` contains `variants(first: 20)` with only purchase-form fields.
- `collection.graphql` no longer fetches listing `options`.
- `ProductCard` renders `ProductPurchaseForm` for available products.
- `ProductCard` has no `'use client'` directive.
- `src` contains no `quickAdd`, `ProductQuickAdd`, `QuickAddButton`, `quick-add-button`, or `variants(first: 2)` references.
- `ProductPurchaseForm` renders `Select` and `QuantityStepper`, and calls `addItem(selectedVariant.id, quantity)`.

Automated Chrome checks against the built Storybook bundle passed:

- `Collection/ProductCard Default`: pack-size dropdown, quantity stepper, and `Add to cart` render inline.
- `Collection/ProductCard Multi Variant`: pack-size dropdown, quantity stepper, and `Add to cart` render inline.
- `Collection/ProductCard Sold Out`: purchase actions absent, `More info` remains.

Automated Chrome check against the built Storybook bundle passed:

- `Collection/ProductCard Default` rendered `Pack size`, options `50g Sample` and `1kg`, quantity value `1`, and the inline `Add to cart` button.

## Residual Risk

The restored affordance creates one `ProductPurchaseForm` client island per
available listing card. That is the cost of keeping the old inline size and
quantity controls. A future optimization could consolidate list-level cart
state, but should not remove the visible pack-size and quantity controls.

Collection listings fetch the first 20 variants. If products can exceed that
variant count on listing pages, pagination or a product-level fallback should be
added before increasing merchandising coverage.
