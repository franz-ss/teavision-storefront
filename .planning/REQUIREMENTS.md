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

**Coverage:**

- v1 requirements: 8 total
- Mapped to phases: 8
- Unmapped: 0

---

_Requirements defined: 2026-05-26_
_Last updated: 2026-05-26 after Phase 1 execution_
