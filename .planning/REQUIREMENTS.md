# Requirements: Teavision Headless Storefront

**Defined:** 2026-05-26
**Core Value:** Customers can confidently choose the right bulk product, quantity, and price path before checkout.

## v1 Requirements

### Bulk Savings

- [x] **BULK-01**: Product data exposes Shopify-native quantity price breaks for each variant when available.
- [x] **BULK-02**: Product data exposes a safe fallback for product-level bulk pricing tiers from `custom.bulk_pricing_tiers`.
- [x] **BULK-03**: Product pages render a "Buy in Bulk and Save" tier display only when tier data exists.
- [x] **BULK-04**: Product pages let customers choose a quantity before adding the selected variant to cart.
- [x] **BULK-05**: Add-to-cart submits the customer-selected quantity to the existing Shopify cart Server Action.
- [x] **BULK-06**: Cart data exposes line-level Shopify discount allocations and line totals.
- [x] **BULK-07**: The cart page visibly reflects applied line discounts when Shopify returns them.
- [x] **BULK-08**: New product UI has Storybook coverage and follows existing design/component conventions.

## v2 Requirements

### Search Results

- [x] **SEARCH-01**: Site search results use the Searchanise Search API as a data source instead of rendering Searchanise's injected `snize-*` widget DOM.
- [x] **SEARCH-02**: `/search` renders Teavision-owned search results UI with product grid, result count, empty state, sorting, pagination, and filters styled through existing Tailwind/design tokens.
- [x] **SEARCH-03**: Search filters and sort state are encoded in URL search params so results are shareable, back-button friendly, and server-rendered from the current query.
- [x] **SEARCH-04**: Legacy `/pages/search-results-page` and `/pages/search-results` URLs no longer render the Shopify-managed Searchanise app body below third-party results; they redirect or canonicalize to `/search`.
- [x] **SEARCH-05**: Searchanise widget script loading remains available for PDP recommendations but does not take over the headless search results route.
- [x] **SEARCH-06**: Searchanise API response parsing uses typed `unknown` narrowing, handles malformed/partial data safely, and never imports generated Shopify types directly.
- [x] **SEARCH-07**: Search UI components include Storybook coverage for results, empty, filtered, and loading/error states.

### Pricing Administration

- **BULK-09**: Provide an operator workflow for syncing HulkApps tiers into Shopify-native price breaks, metaobjects, or product metafields.
- **BULK-10**: Support authenticated B2B/customer-specific price lists and quantity rules.

## Out of Scope

| Feature                                                | Reason                                                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| HulkApps script injection                              | Theme embed scripts are not a durable contract for a headless storefront.              |
| Client-side discount calculation as checkout authority | Shopify cart/checkout must remain the authority for actual applied discounts.          |
| Bulk wholesale account pricing                         | Separate account/B2B workflow beyond the live "Buy in Bulk and Save" PDP parity slice. |

## Traceability

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| BULK-01     | Phase 1 | Complete |
| BULK-02     | Phase 1 | Complete |
| BULK-03     | Phase 1 | Complete |
| BULK-04     | Phase 1 | Complete |
| BULK-05     | Phase 1 | Complete |
| BULK-06     | Phase 1 | Complete |
| BULK-07     | Phase 1 | Complete |
| BULK-08     | Phase 1 | Complete |
| SEARCH-01   | Phase 2 | Complete |
| SEARCH-02   | Phase 2 | Complete |
| SEARCH-03   | Phase 2 | Complete |
| SEARCH-04   | Phase 2 | Complete |
| SEARCH-05   | Phase 2 | Complete |
| SEARCH-06   | Phase 2 | Complete |
| SEARCH-07   | Phase 2 | Complete |
| BULK-09     | Deferred | Deferred |
| BULK-10     | Deferred | Deferred |

**Coverage:**

- v1 requirements: 8 total
- v2 search requirements: 7 total
- Deferred pricing requirements: 2 total
- Mapped to phases: 15
- Unmapped active/planned requirements: 0

---

_Requirements defined: 2026-05-26_
_Last updated: 2026-05-27 for Phase 2 Searchanise API execution_
