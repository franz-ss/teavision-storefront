# Phase 8 Research: Optimized Collection Quick Add

**Date:** 2026-06-03
**Mode:** Inline research because the `gsd-sdk` shim is not available in this PowerShell session.

## Key Findings

1. The old direct listing purchase path was removed for performance, not because the cart action was broken. The old card mounted `ProductPurchaseForm`, which required variant data, local quantity state, form state, and a hydrated client island on every product card.
2. `useAddToCart` is already the correct shared behavior for quick-add. It calls `addToCartAction`, tracks pending/success/error state, and refreshes the route unless an explicit `onCartChanged` callback is supplied.
3. `ProductQuickView` already covers the multi-variant path. It fetches full variant data on intent via `/api/products/[handle]/quick-view`, so collection cards do not need full variant arrays up front.
4. The current collection query fetches `options` but not variant IDs. For optimized quick-add, the cheapest Shopify-side contract is `variants(first: 2) { edges { node { id title availableForSale } } }`. Fetching two variants is enough to distinguish single-variant from multi-variant products without serializing all variants.
5. Searchanise mapping must remain defensive. If Searchanise exposes a clean single add-to-cart variant ID, map it; otherwise set `quickAdd: null` and let Quick View/PDP handle selection.

## Recommended Strategy

- Add `ProductQuickAdd` to hand-written Shopify/domain types.
- Add `quickAdd: ProductQuickAdd | null` to `CollectionProductSummary`.
- Compute quick-add eligibility in mappers, not the component.
- Create a small collection-domain client component for the button.
- Keep `ProductCard` server-rendered and pass only primitive props to the client button.
- Keep `ProductPurchaseForm` out of listing cards.

## Risks

- Products with one visible default variant but meaningful quantity rules may still be safe to add one unit, because PDP remains the bulk/quantity path.
- Products with multiple variants must not expose direct add; wrong-variant adds are worse than an extra click.
- The visible button could make cards crowded on mobile; stable card dimensions and wrapping must be tested in Storybook.

## Verification Focus

- Source check that `ProductCard` does not import `ProductPurchaseForm`.
- Source check that quick-add variant query uses a bounded `first: 2`, not `first: 10` or full product data.
- Storybook interaction tests for success/error/pending states with mocked `addToCart`.
- Route check for `/collections/all` and `/search?q=tea` rendering both quick-add eligible and quick-view fallback cards.
