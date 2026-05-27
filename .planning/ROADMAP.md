# Roadmap: Teavision Headless Storefront

## Overview

This milestone brings high-value legacy storefront behavior into the Next storefront without depending on legacy Shopify app browser scripts. Phase 1 covers "Buy in Bulk and Save" parity. Phase 2 replaces the legacy Searchanise search-results widget page with a headless Searchanise API integration rendered through Teavision-owned UI.

## Phases

**Phase Numbering:**

- Integer phases are planned milestone work.
- Decimal phases are urgent insertions if a follow-up fix is needed.

- [x] **Phase 1: Bulk Savings PDP and Cart Parity** - Render configured bulk tiers on product pages and reflect Shopify-applied discounts in cart.
- [ ] **Phase 2: Searchanise API Search Results** - Render Searchanise-powered search results through first-class Next UI with owned filters, sorting, pagination, and legacy route cleanup.

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

### Phase 2: Searchanise API Search Results

**Goal:** Customers can search Teavision's catalogue through Searchanise ranking and facets while seeing a fully owned, accessible, Teavision-styled Next search results experience.
**Requirements**: [SEARCH-01, SEARCH-02, SEARCH-03, SEARCH-04, SEARCH-05, SEARCH-06, SEARCH-07]
**Depends on:** Phase 1
**Success Criteria** (what must be TRUE):

1. `/search` fetches Searchanise JSON results server-side and renders owned result UI, not injected `snize-*` widget markup.
2. Search results include product grid, result count, empty state, sort, pagination, and Searchanise facets.
3. Filter, sort, query, and page state round-trip through URL search params.
4. Legacy `/pages/search-results-page` and `/pages/search-results` URLs no longer render the Shopify Searchanise app page body.
5. PDP Searchanise recommendations still work or fall back exactly as before.
6. New search UI has Storybook coverage and passes lint/build verification.

**Plans:** 1 plan

Plans:

- [ ] 02-01: Searchanise API search results

## Progress

**Execution Order:**
Phase 1, then Phase 2.

| Phase                                    | Plans Complete | Status           | Completed  |
| ---------------------------------------- | -------------- | ---------------- | ---------- |
| 1. Bulk Savings PDP and Cart Parity      | 1/1            | Complete         | 2026-05-26 |
| 2. Searchanise API Search Results        | 0/1            | Ready to execute |            |
