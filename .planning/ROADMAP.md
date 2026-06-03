# Roadmap: Teavision Headless Storefront

## Overview

This milestone brings high-value legacy storefront behavior into the Next storefront without depending on legacy Shopify app browser scripts. Phase 1 covers "Buy in Bulk and Save" parity. Phase 2 replaces the legacy Searchanise search-results widget page with a headless Searchanise API integration rendered through Teavision-owned UI. Phase 4 ports the live Shopify-theme footer into the Next storefront with strict visible content, link, responsive, and visual parity. Phase 5 remediates the production-readiness issues found during the full-codebase review. Phase 6 prevents the storefront from being indexed before launch readiness is confirmed.

## Phases

**Phase Numbering:**

- Integer phases are planned milestone work.
- Decimal phases are urgent insertions if a follow-up fix is needed.

- [x] **Phase 1: Bulk Savings PDP and Cart Parity** - Render configured bulk tiers on product pages and reflect Shopify-applied discounts in cart.
- [x] **Phase 2: Searchanise API Search Results** - Render Searchanise-powered search results through first-class Next UI with owned filters, sorting, pagination, and legacy route cleanup.
- [x] **Phase 4: Footer 1:1 Parity** - Replace the compact Next footer with a faithful port of the live `https://www.teavision.com.au/` footer, including menu columns, quality/trust content, newsletter/contact block, bottom copyright/search/payment row, and responsive layout. The hidden keyword-link block was removed after review.
- [x] **Phase 5: Codebase Review Remediation** - Fix the production-readiness issues from `CODEBASE_REVIEW.md`, including conversion-path correctness, accessibility, JSON-LD safety, testing gates, reliability/security hardening, PLP performance, component boundaries, type/runtime guardrails, sitemap hygiene, and final verification evidence.
- [ ] **Phase 6: Prevent the site from being indexed** - Add temporary noindex/no-crawl controls across robots, metadata, and sitemap surfaces until launch.

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

- [x] 02-01: Searchanise API search results

### Phase 4: Footer 1:1 Parity

**Goal:** The Next storefront footer matches the live Shopify-theme footer from `https://www.teavision.com.au/` in visible content, link destinations, layout, responsive behavior, newsletter/contact affordances, copyright row, Popular Searches link, and payment marks.
**Requirements**: [FOOTER-01, FOOTER-02, FOOTER-03, FOOTER-04, FOOTER-05]
**Depends on:** Phase 2
**Success Criteria** (what must be TRUE):

1. `src/components/layout/footer/footer.tsx` renders the live visible footer structure: Main Menu, Footer, Quality, Keep in Touch, and bottom payment/copyright row.
2. All visible live footer links are preserved with exact labels and hrefs, including the `https://mrtea.com.au/account/login` footer Login URL.
3. Footer visual styling matches the live footer at desktop, tablet, and mobile breakpoints, while expressing colors through design tokens or semantic utilities rather than raw hex values in class names.
4. Newsletter signup continues to use the existing server-action boundary and preserves honeypot/rate-limit validation with accessible success/error feedback.
5. Storybook coverage and browser checks prove parity for the default footer, mobile layout, newsletter states, and payment marks.

**Plans:** 1 plan

Plans:

- [x] 04-01: Footer 1:1 parity

## Progress

**Execution Order:**
Phase 1, then Phase 2, then Phase 4, then Phase 5, then Phase 6.

| Phase                               | Plans Complete | Status   | Completed  |
| ----------------------------------- | -------------- | -------- | ---------- |
| 1. Bulk Savings PDP and Cart Parity | 1/1            | Complete | 2026-05-26 |
| 2. Searchanise API Search Results   | 1/1            | Complete | 2026-05-27 |
| 4. Footer 1:1 Parity                | 1/1            | Complete | 2026-05-29 |
| 5. Codebase Review Remediation      | 5/5            | Complete | 2026-06-02 |
| 6. Prevent site indexing            | 0/1            | Planned     | -          |

### Phase 5: Codebase Review Remediation

**Goal:** The storefront is ready for a high-confidence public launch after addressing the strict full-codebase review findings captured in `CODEBASE_REVIEW.md`.
**Requirements**: [AUDIT-01, AUDIT-02, AUDIT-03, AUDIT-04, AUDIT-05, AUDIT-06, AUDIT-07, AUDIT-08, AUDIT-09, AUDIT-10]
**Depends on:** Phase 4
**Success Criteria** (what must be TRUE):

1. Homepage contact/newsletter flows, homepage contact CTA, PDP add-to-cart, root error recovery, skip navigation, and nested landmarks are corrected.
2. JSON-LD and inline script serialization use one safe helper across storefront routes.
3. Typecheck, contract tests, lint, build, Storybook build, and interaction coverage exist for the highest-risk flows.
4. Contact/newsletter/search abuse protection, Shopify page invalidation, quick-view failure behavior, codegen env validation, and third-party degradation behavior are production-capable or explicitly documented.
5. Collection pages avoid unbounded initial product fetching/rendering and reduce unnecessary client hydration.
6. Broad route/component/operation files are split or extracted where the review identified maintainability risk.
7. Remaining accessibility, brand-copy, sitemap, and metadata hygiene issues are resolved.
8. Final verification evidence is recorded in `05-05-SUMMARY.md`.

**Plans:** 5 plans

Plans:

- [x] 05-01: Launch blockers, conversion feedback, JSON-LD safety, and core accessibility
- [x] 05-02: Testing, reliability, and security hardening
- [x] 05-03: PLP and storefront performance remediation
- [x] 05-04: Component architecture and TypeScript maintainability refactors
- [x] 05-05: Accessibility/SEO polish and final production-readiness verification

### Phase 6: Prevent the site from being indexed

**Goal:** Search engines and well-behaved crawlers are instructed not to index or crawl the storefront while the headless launch remains gated.
**Requirements**: TBD
**Depends on:** Phase 5
**Success Criteria** (what must be TRUE):

1. The root robots surface disallows crawling for all user agents while the site is not intended for indexing.
2. Storefront metadata emits noindex/nofollow robots directives across public routes, including dynamic product, collection, blog, and Shopify page routes.
3. Sitemap output does not invite indexing while noindex mode is active.
4. Verification confirms the built app exposes the expected robots, metadata, and sitemap behavior.

**Plans:** 1 plan

Plans:
- [ ] 06-01: Environment-controlled noindex mode across metadata, robots, sitemap, and verification
