---
phase: 01-bulk-savings-pdp-and-cart-parity
plan: 01
subsystem: product-pricing
tags: [shopify, product-page, cart, discounts, storybook]
provides:
  - Shopify-native quantity price break data path
  - Product metafield fallback for bulk pricing tiers
  - PDP bulk savings display and quantity add-to-cart
  - Cart line discount allocation display
affects: [product-detail, cart, shopify-storefront-api]
tech-stack:
  added: []
  patterns:
    [
      typed GraphQL reshaping,
      client leaf quantity state,
      Storybook component coverage,
    ]
key-files:
  created:
    - src/components/product/bulk-savings/bulk-savings.tsx
    - src/components/product/bulk-savings/bulk-savings.stories.tsx
    - src/components/product/bulk-savings/index.ts
  modified:
    - src/lib/shopify/queries/product.graphql
    - src/lib/shopify/queries/cart.graphql
    - src/lib/shopify/types/index.ts
    - src/lib/shopify/operations/product.ts
    - src/lib/shopify/operations/cart.ts
    - src/components/product/product-form/product-form.tsx
    - src/app/(storefront)/products/[handle]/page.tsx
    - src/app/(storefront)/cart/page.tsx
key-decisions:
  - 'Prefer native Shopify quantityPriceBreaks, with custom.bulk_pricing_tiers as fallback.'
  - 'Display savings only when Shopify or the configured product metafield returns tier data.'
  - 'Use Shopify cart discountAllocations as the authority for applied savings.'
duration: not tracked
completed: 2026-05-26
---

# Phase 1: Bulk Savings PDP and Cart Parity Summary

The headless storefront now has a typed bulk savings path from Shopify product data through PDP quantity selection and cart discount display.

## Performance

- **Duration:** not tracked
- **Tasks:** 3 completed
- **Files modified:** 18 code files plus planning artifacts

## Accomplishments

- Added `quantityPriceBreaks(first: 10)` to product variants and `custom.bulk_pricing_tiers` fallback parsing for product-level tier data.
- Added `BulkSavings` with Storybook coverage for native price breaks and fallback percent tiers.
- Updated `ProductForm` to render selected-variant tiers, select quantity with `QuantityStepper`, and submit that quantity to `addToCartAction`.
- Added cart line `cost` and `discountAllocations` to the Shopify cart query and cart reshaper.
- Updated the cart page to display Shopify line totals and discount rows when discounts are returned.
- Kept pre-existing product page layout edits unstaged and outside the feature commit.

## Task Commits

1. **Task 1-3: Bulk savings product and cart flow** - `1122179`

## Files Created/Modified

- `src/components/product/bulk-savings/bulk-savings.tsx` - Tier display component with active quantity highlighting.
- `src/components/product/bulk-savings/bulk-savings.stories.tsx` - Storybook examples for native and fallback tier models.
- `src/components/product/product-form/product-form.tsx` - Quantity state, tier display, and selected quantity add-to-cart.
- `src/lib/shopify/queries/product.graphql` - Variant quantity price breaks and fallback metafield.
- `src/lib/shopify/operations/product.ts` - Typed tier reshaping and safe fallback JSON parser.
- `src/lib/shopify/queries/cart.graphql` - Cart line cost and discount allocations.
- `src/lib/shopify/operations/cart.ts` - Cart line cost and discount allocation reshaping.
- `src/app/(storefront)/cart/page.tsx` - Line total and discount display.

## Decisions & Deviations

**Decisions**

- Shopify remains the authority for applied discount totals.
- The PDP uses native variant price breaks first and product-level metafield tiers only when native breaks are absent.
- Products with no configured tiers do not show a bulk savings block.

**Deviations**

- The collection product variant reshaper now returns `quantityPriceBreaks: []` because collection cards do not fetch PDP tier data and should not pay that query cost.
- Existing Storybook fixtures were updated with empty tier arrays and product fallback arrays to satisfy the richer domain type.
- The product page had two pre-existing unstaged layout edits before this phase; only the `bulkPricingTiers` prop hunk was committed.

## Verification

- `pnpm codegen` - passed
- `pnpm lint` - passed
- `pnpm build` - passed
- Generated query text includes `quantityPriceBreaks(first: 10)`, `bulkPricingTiersMetafield`, and `discountAllocations`.
- `BulkSavings` Storybook file exists with two exported stories.

## Self-Check: PASSED

All plan acceptance criteria are satisfied. Remaining operational dependency: products need native Shopify quantity price breaks or `custom.bulk_pricing_tiers` populated before the PDP can display real tiers for each product that used to rely only on HulkApps.

## Next Phase Readiness

Ready for UAT on a Shopify product that has native quantity price breaks or a populated `custom.bulk_pricing_tiers` metafield. A later pricing-admin phase can decide how to sync legacy HulkApps rules into those headless-readable sources.
