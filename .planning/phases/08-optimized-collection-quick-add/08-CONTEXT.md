# Phase 8: Optimized Collection Quick Add - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning
**Source:** Developer request after git archaeology of missing collection-card add-to-cart behavior

<domain>

## Phase Boundary

Restore a visible add-to-cart affordance on collection/search listing product cards without reverting the Phase 5 performance remediation that removed the full per-card purchase form.

The original `ProductPurchaseForm` was removed from `src/components/collection/product-card/product-card.tsx` in `e91215f feat(product): improve purchase and recommendation flows`. The supporting collection/search summary data was shrunk immediately before that in `e7f9ead refactor(shopify): centralize storefront data reshaping`, which removed per-card `variants` from `CollectionProductSummary` and the collection query. Written rationale in Phase 5 was PLP performance: reduce initial fetch/render/hydration cost, avoid serializing large variant arrays for every card, and keep quick-buy behind Quick View or another user-intent island.

This phase partially reverses the UX outcome, not the performance decision.

**In scope:**
- Add a card-level quick-add button for products that are safe to add directly from listing context.
- Extend collection/search summary types with a tiny quick-add eligibility payload.
- Use the existing `addToCartAction` and `useAddToCart` behavior.
- Preserve Quick View/PDP selection for multi-variant products.
- Add Storybook interaction coverage for quick-add states.

**Out of scope:**
- Reattaching the old `ProductPurchaseForm` to every card.
- Adding a quantity stepper or variant selector directly to every listing card.
- Changing PDP bulk purchase behavior.
- Implementing a shared list-level Quick View controller unless needed after measurement.
- Any cart/checkout mutation rewrite outside the existing Server Action path.

</domain>

<decisions>

## Implementation Decisions

### User Experience

- D-01: Product cards should show an `Add to cart` affordance again when a product has exactly one available quick-add variant.
- D-02: Multi-variant products must not quick-add a guessed first/default variant. They keep `Quick View` and `More info` so customers choose the pack size.
- D-03: Sold-out products render no enabled quick-add action; the existing sold-out badge and disabled state remain the source of truth.
- D-04: Quick-add success/error feedback must be accessible and local to the card action, with the header/cart view refreshed through the existing shared hook.

### Performance

- D-05: Do not restore full per-card form hydration. `ProductCard` remains a Server Component and only a small quick-add button hydrates where direct add is eligible.
- D-06: Do not restore full variant payloads in collection/search summaries. Fetch only minimal fields needed for quick-add: variant id, title, availableForSale, and enough product-level information to know whether direct add is safe.
- D-07: Keep Phase 5 bounded PLP pagination intact; no all-products fetching loop returns.
- D-08: Keep Quick View available for multi-variant products and as the richer shopping path.

### Architecture

- D-09: Add a new collection-domain client leaf, e.g. `src/components/collection/quick-add-button/quick-add-button.tsx`, rather than making `ProductCard` a Client Component.
- D-10: Reuse `src/components/product/use-add-to-cart.ts`; do not duplicate add-to-cart pending/success/error/refresh logic.
- D-11: Import generated Shopify types only through `src/lib/shopify/types/index.ts`; run `pnpm codegen` after GraphQL query changes.
- D-12: Product-card stories should mock add-to-cart and not hit Shopify.

</decisions>

<technical_findings>

## Technical Findings

### Current state

- `src/components/collection/product-card/product-card.tsx` is a Server Component. It currently renders `From <Price>`, `More info`, and `ProductQuickView`.
- `src/components/collection/product-card/product-purchase-form.tsx` still exists and still works, but it is a heavier client form with variant selection and quantity state. It should remain available for targeted use/stories but should not be mounted on every card.
- `src/components/product/use-add-to-cart.ts` already wraps `addToCartAction`, `useTransition`, success/error state, and `router.refresh()`.
- `src/lib/shopify/queries/collection.graphql` currently fetches `options { name values }` but not variant IDs for collection products.
- `CollectionProductSummary` currently includes product display fields plus `availableForSale`, `productType`, and `tags`; it has no direct quick-add contract.
- Searchanise product mapping also returns `CollectionProductSummary`, so the quick-add shape must be safe for both Shopify collection products and Searchanise results.

### Recommended quick-add data shape

Add a small hand-written type:

```ts
export type ProductQuickAdd = {
  variantId: string
  variantTitle: string
  availableForSale: boolean
}
```

Then add `quickAdd: ProductQuickAdd | null` to `CollectionProductSummary`.

Rules:
- exactly one available variant and no meaningful multi-option choice -> `quickAdd`
- multiple variants/options or unavailable only -> `null`
- malformed Searchanise variants -> `null`

Collection query can fetch `variants(first: 2)` with only `id`, `title`, `availableForSale`. `first: 2` is deliberate: it proves whether a product is single-variant without pulling the full variant array.

### UI shape

Add a tiny client leaf:

```tsx
'use client'

export function QuickAddButton({
  addToCart,
  productTitle,
  variantId,
}: QuickAddButtonProps) {
  // useAddToCart({ addToCart, getSuccessMessage: () => 'Added to cart' })
}
```

`ProductCard` renders:
- price and `Add to cart` for eligible single-variant products
- `Quick View` for multi-variant products
- `More info` remains for all products

If layout gets cramped, prefer `Add to cart` + compact `More info` for eligible products and keep Quick View only for products needing variant selection.

</technical_findings>

<canonical_refs>

## Canonical References

### Prior rationale to preserve

- `CODEBASE_REVIEW.md` - "Critical Performance Risk: Collection Pages Fetch and Render Too Much Upfront"
- `.planning/phases/05-codebase-review-remediation/05-03-PLAN.md` - Task 2: reduce product-list hydration and quick-buy cost
- `.planning/phases/05-codebase-review-remediation/05-03-SUMMARY.md` - states that per-card `ProductPurchaseForm` was removed and replaced with price/detail/quick-view actions

### Code to modify

- `src/lib/shopify/queries/collection.graphql` - add minimal quick-add variant fields
- `src/lib/shopify/operations/collection.ts` - reshape quick-add eligibility
- `src/lib/shopify/types/index.ts` - add `ProductQuickAdd` and `CollectionProductSummary.quickAdd`
- `src/lib/searchanise/search.ts` - map Searchanise results to the same quick-add contract defensively
- `src/components/collection/product-card/product-card.tsx` - render the optimized quick-add affordance
- `src/components/collection/product-card/product-card.stories.tsx` - add state coverage
- `src/components/collection/quick-add-button/*` - new small client leaf and Storybook coverage
- `src/components/product/use-add-to-cart.ts` - reuse, do not duplicate

### Project rules

- `AGENTS.md` - Next 16 / App Router / component constraints
- `docs/conventions.md` - folder map, client leaf rule, Storybook rule, Tailwind token rules
- `node_modules/next/dist/docs/` - read relevant Next 16 docs before changing App Router or cache behavior

</canonical_refs>

<specifics>

## Success Criteria

1. Single-variant available listing products show a visible `Add to cart` action.
2. Multi-variant listing products keep `Quick View` / PDP selection and never quick-add a guessed variant.
3. The collection query remains bounded and only adds minimal quick-add fields.
4. The card itself remains a Server Component; hydration is limited to a small quick-add client leaf and existing Quick View where rendered.
5. The add-to-cart path uses `addToCartAction` through `useAddToCart` and exposes pending/success/error feedback.
6. Storybook covers quick-add success, error, pending, sold-out, multi-variant fallback, and long-title layout.
7. `pnpm codegen`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and Storybook build pass.

</specifics>

<deferred>

## Deferred Ideas

- A single list-level Quick View controller could further reduce per-card modal state, but it is not required to restore direct quick-add safely.
- A future bundle analysis pass can compare the exact JS delta before and after this change.
- Quantity quick-add from listings stays deferred; PDP remains the full bulk/quantity purchase surface.

</deferred>

---

*Phase: 08-optimized-collection-quick-add*
*Context gathered: 2026-06-03 via optimized quick-add planning*
