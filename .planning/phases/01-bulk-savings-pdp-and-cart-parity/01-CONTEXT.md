# Phase 1: Bulk Savings PDP and Cart Parity - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning
**Source:** Live site and sibling theme investigation, codebase map

<domain>
## Phase Boundary

Implement the customer-facing headless storefront slice for "Buy in Bulk and Save":

- product query and domain types expose bulk tier data,
- PDP shows configured tier data and lets customers choose quantity,
- add-to-cart submits the selected quantity,
- cart query and cart page expose Shopify-applied line discounts.

This phase does not migrate Shopify admin/app configuration. If a product has no native quantity price breaks and no `custom.bulk_pricing_tiers` metafield, the PDP should simply omit the bulk savings block.

</domain>

<decisions>
## Implementation Decisions

### Source of Truth

- Use Shopify `ProductVariant.quantityPriceBreaks(first: 10)` as the preferred typed source.
- Use product metafield `custom.bulk_pricing_tiers` as a fallback. Supported JSON should be an array of tier objects with `minimumQuantity` or `min`, plus either `price` or `discountPercent`.
- Do not inject HulkApps or Quantity Breaks Now scripts into the Next app.
- Do not calculate the final discount authority on the client. Cart and checkout remain authoritative.

### PDP Behavior

- Render the heading text `Buy in Bulk and Save`.
- Show tiers for the currently selected variant when variant-level price breaks exist; otherwise show product-level fallback tiers.
- Highlight the best eligible tier for the selected quantity.
- Add a quantity stepper before the add-to-cart button.
- Submit selected quantity to `addToCartAction(selectedVariant.id, quantity)`.

### Cart Behavior

- Query `CartLine.discountAllocations`.
- Query `CartLine.cost` so the cart has line subtotal/total amounts from Shopify.
- Show a line-level discount row only when Shopify returns at least one discount allocation.

</decisions>

<canonical_refs>

## Canonical References

### Project Planning

- `.planning/PROJECT.md` - project context and constraints
- `.planning/REQUIREMENTS.md` - BULK requirement IDs
- `.planning/ROADMAP.md` - phase success criteria
- `.planning/codebase/CONCERNS.md` - current gaps identified by codebase mapping
- `.planning/codebase/INTEGRATIONS.md` - Shopify, Searchanise, Trustoo, and sibling theme context

### App Source

- `docs/conventions.md` - folder, component, style, and import rules
- `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md` - Next 16 Server Component data fetching guidance
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` - Next 16 Cache Components guidance
- `src/lib/shopify/queries/product.graphql` - product and variant data query
- `src/lib/shopify/queries/cart.graphql` - cart data query
- `src/lib/shopify/operations/product.ts` - product reshaping
- `src/lib/shopify/operations/cart.ts` - cart reshaping
- `src/lib/shopify/types/index.ts` - hand-written Shopify domain types barrel
- `src/components/product/product-form/product-form.tsx` - PDP client add-to-cart leaf
- `src/app/(storefront)/products/[handle]/page.tsx` - PDP route; currently has pre-existing user edits
- `src/app/(storefront)/cart/page.tsx` - cart route

</canonical_refs>

<specifics>
## Specific Ideas

- Native quantity price break GraphQL shape:
  - `quantityPriceBreaks(first: 10) { nodes { minimumQuantity price { amount currencyCode } } }`
- Product metafield key:
  - namespace: `custom`
  - key: `bulk_pricing_tiers`
- Example fallback metafield JSON:

```json
[
  { "minimumQuantity": 2, "discountPercent": 5 },
  { "minimumQuantity": 5, "discountPercent": 10 },
  {
    "minimumQuantity": 10,
    "price": { "amount": "18.50", "currencyCode": "AUD" }
  }
]
```

</specifics>

<deferred>
## Deferred Ideas

- Admin/operator automation to sync HulkApps rule data into native price breaks or metafields.
- Account-specific B2B pricing and customer-company context.
- Visual parity with the exact HulkApps table if the app exposes an official headless API later.

</deferred>

---

_Phase: 01-bulk-savings-pdp-and-cart-parity_
_Context gathered: 2026-05-26 via investigation and codebase map_
