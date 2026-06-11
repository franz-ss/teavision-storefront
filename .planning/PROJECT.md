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
- Validated in Phase 11: every storefront surface runs on the new warm-paper/green/gold design system (RD-01..RD-08); the old `--tv-*`/steep/stone system is removed; cart, search, bulk savings, and quick-add behavior preserved through two owner UAT rounds.

### Active

- [x] Product pages display "Buy in Bulk and Save" tiers when Shopify-native quantity price breaks or the configured product metafield provides tier data.
- [x] Product add-to-cart supports customer-selected quantity instead of always adding one unit.
- [x] Cart lines expose applied discount allocations so eligible savings are visible after quantity updates.
- [x] The implementation stays within current Next.js, Shopify, TypeScript, Tailwind, and Storybook conventions.
- [ ] Search results use Searchanise as a JSON data source while Next owns layout, filters, sorting, pagination, and styling.
- [ ] Legacy Searchanise search-results Shopify Page URLs no longer render injected widget output plus empty static-page content.

### Out of Scope

- Reinstalling or injecting HulkApps app scripts into the headless storefront - third-party browser scripts from the Liquid theme are not a stable headless data contract.
- Recreating discount calculation rules in client code - Shopify checkout/cart remains the authority for actual discounts.
- Building wholesale account pricing for 100kg+ orders - this is a separate B2B/account feature.
- Editing sibling `teavision-theme` - it is used as a reference only.

## Context

The live Shopify theme product page originally got its bulk discount table from a HulkApps Volume Discount app embed via `content_for_header`. The sibling `teavision-theme` also contains legacy HulkApps cart hooks and an inactive/commented Quantity Breaks Now integration.

Phase 1 added the Next bulk savings model, selected quantity add-to-cart, and Shopify-reported cart discount display.

Phase 2 targets the legacy Searchanise search-results page. The Shopify Page at `/pages/search-results-page` contains Searchanise widget script, style, skeleton, and mount markup. In the Next storefront it is currently treated like normal Shopify page content while the Searchanise script also injects results, causing third-party results above an empty static-page hero/body. The implementation should use Searchanise as a JSON API data source and let Next own rendering.

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
| Use Searchanise API for search results instead of injected widget DOM        | Preserves Searchanise ranking and facets while giving the Next storefront full styling, semantics, and routing control                | Planned |

---

_Last updated: 2026-06-11 after Phase 11 (full visual redesign) completion — final phase of the roadmap_
