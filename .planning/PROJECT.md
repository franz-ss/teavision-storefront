# Teavision Headless Storefront

## What This Is

Teavision is a headless Shopify storefront built with Next.js 16 App Router and React 19. It sells wholesale tea, herbs, spices, and related products to Australian retail, cafe, foodservice, and direct customers.

This project tracks the migration of Shopify-theme storefront behavior into the Next storefront with parity for product discovery, product detail, cart, checkout handoff, and trust signals.

## Core Value

Customers can confidently choose the right bulk product, quantity, and price path before checkout.

## Requirements

### Validated

- Existing product, collection, cart, blog, page, review, Searchanise, and contact flows are implemented in the Next storefront codebase.
- Shopify Storefront API remains the source of truth for product, collection, cart, and checkout data.
- The sibling Liquid theme remains a valid reference for legacy storefront behavior that has not yet been ported.

### Active

- [x] Product pages display "Buy in Bulk and Save" tiers when Shopify-native quantity price breaks or the configured product metafield provides tier data.
- [x] Product add-to-cart supports customer-selected quantity instead of always adding one unit.
- [x] Cart lines expose applied discount allocations so eligible savings are visible after quantity updates.
- [x] The implementation stays within current Next.js, Shopify, TypeScript, Tailwind, and Storybook conventions.

### Out of Scope

- Reinstalling or injecting HulkApps app scripts into the headless storefront - third-party browser scripts from the Liquid theme are not a stable headless data contract.
- Recreating discount calculation rules in client code - Shopify checkout/cart remains the authority for actual discounts.
- Building wholesale account pricing for 100kg+ orders - this is a separate B2B/account feature.
- Editing sibling `teavision-theme` - it is used as a reference only for this phase.

## Context

The live Shopify theme product page currently gets its bulk discount table from a HulkApps Volume Discount app embed via `content_for_header`. The sibling `teavision-theme` also contains legacy HulkApps cart hooks and an inactive/commented Quantity Breaks Now integration.

The Next storefront currently has no bulk savings model. Product forms add quantity `1` only, product queries do not fetch quantity price breaks or bulk pricing metafields, and cart queries do not expose line-level discount allocations.

The codebase map in `.planning/codebase/` documents the existing architecture, data flow, integrations, conventions, testing surface, and concerns. Those documents are canonical background for this phase.

## Constraints

- **Tech stack**: Next.js 16 App Router, React 19, Tailwind 4, Shopify Storefront API - match existing architecture and local Next docs.
- **Data source**: Actual discount application must come from Shopify cart/checkout data - avoid client-only price promises.
- **Compatibility**: Do not mutate pre-existing user changes in `src/app/(storefront)/products/[handle]/page.tsx`; preserve and build around them.
- **Conventions**: No default component exports, no `any`, no raw hex/rgb class names, no className concatenation, no direct generated type imports outside the types barrel.
- **Testing**: No app test runner exists outside Storybook; verify through codegen, lint, build, and Storybook coverage for new UI components.

## Key Decisions

| Decision                                                                     | Rationale                                                                                                                             | Outcome |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Prefer Shopify-native quantity price breaks, with product metafield fallback | Native data is typed and cart/checkout aligned; metafield fallback lets operators mirror HulkApps tiers without injecting app scripts | Good    |
| Render bulk savings only when tier data exists                               | Prevents misleading static pricing on products that have no configured rule                                                           | Good    |
| Show cart discount allocations as Shopify reports them                       | Keeps displayed savings aligned with the authoritative cart state                                                                     | Good    |

---

_Last updated: 2026-05-26 after Phase 1 execution_
