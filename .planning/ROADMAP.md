# Roadmap: Teavision Headless Storefront

## Overview

This one-phase milestone brings the live theme's "Buy in Bulk and Save" purchase path into the Next storefront without depending on legacy Shopify app browser scripts. The slice covers product data, PDP quantity and tier UI, authoritative cart discount visibility, and verification.

## Phases

**Phase Numbering:**

- Integer phases are planned milestone work.
- Decimal phases are urgent insertions if a follow-up fix is needed.

- [x] **Phase 1: Bulk Savings PDP and Cart Parity** - Render configured bulk tiers on product pages and reflect Shopify-applied discounts in cart.

## Phase Details

### Phase 1: Bulk Savings PDP and Cart Parity

**Goal**: Customers can choose an eligible quantity from the PDP, understand available bulk savings, add that quantity to cart, and see Shopify-reported line discounts in cart.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: [BULK-01, BULK-02, BULK-03, BULK-04, BULK-05, BULK-06, BULK-07, BULK-08]
**Success Criteria** (what must be TRUE):

1. Product variant data includes `quantityPriceBreaks` and product data includes fallback `bulkPricingTiers`.
2. Product pages render "Buy in Bulk and Save" only for products with configured tiers.
3. Product add-to-cart uses the customer-selected quantity.
4. Cart lines include Shopify discount allocations and show applied savings when present.
5. Codegen, lint, build, and the new Storybook story are valid.

**Plans**: 1 plan

Plans:

- [x] 01-01: Bulk savings product and cart parity

## Progress

**Execution Order:**
Phase 1 only.

| Phase                               | Plans Complete | Status   | Completed  |
| ----------------------------------- | -------------- | -------- | ---------- |
| 1. Bulk Savings PDP and Cart Parity | 1/1            | Complete | 2026-05-26 |
