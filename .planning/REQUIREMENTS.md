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

## v3 Requirements

### Footer Parity

- [x] **FOOTER-01**: The Next storefront footer preserves the live Shopify-theme footer's visible top-level structure: Main Menu, Footer, Quality, Keep in Touch, bottom copyright/Popular Searches row, and payment method marks. The hidden keyword-link block was removed during implementation review to avoid shipping non-visible keyword stuffing in the headless storefront.
- [x] **FOOTER-02**: All live footer links are rendered with exact labels and hrefs, including external, `tel:`, `mailto:`, root, collection, product, page, blog, hash, and legacy trailing-slash URLs.
- [x] **FOOTER-03**: Footer visual styling and responsive behavior match the live footer at desktop, tablet, and mobile breakpoints without raw hex/rgb Tailwind class names or inline styles.
- [x] **FOOTER-04**: Newsletter signup and contact links remain functional through existing server/action boundaries, validation, honeypot protection, and accessible feedback.
- [x] **FOOTER-05**: Footer parity is verified through Storybook coverage plus browser checks/screenshot comparison against the live footer.

## v4 Requirements

### Codebase Review Remediation

- [x] **AUDIT-01**: Core conversion paths are corrected and observable: homepage CTA routes to the real contact page, homepage contact/newsletter submissions expose pending/success/error feedback, and PDP add-to-cart refreshes visible cart state with an accessible success announcement.
- [x] **AUDIT-02**: Release-relevant accessibility issues are fixed, including bypass navigation, nested landmarks, autoplay motion control, async status announcements, rating labels, rich-text table keyboard access, touch target sizing, decorative icon hiding, and breadcrumb overflow.
- [x] **AUDIT-03**: Inline structured-data scripts and SEO-critical metadata are safe and consistent across home, collection, product, article, page, sitemap, and robots surfaces.
- [x] **AUDIT-04**: Automated quality gates exist for typechecking, contract tests, Storybook/a11y coverage, and core cart/product/form interactions.
- [x] **AUDIT-05**: Production reliability and abuse-resistance gaps are closed for contact/newsletter rate limiting, search suggestions, Shopify page cache invalidation, quick-view failures, codegen env validation, and third-party enrichment degradation.
- [x] **AUDIT-06**: Collection and storefront performance risks are reduced by limiting PLP fetch/render work, pushing filters closer to the data layer, lazy-loading expensive client islands, and standardizing image handling.
- [x] **AUDIT-07**: Component and route boundaries follow project conventions: broad route files are split, domain components leave `ui`, add-to-cart behavior is centralized, primitives are reused by forms, public component APIs are documented, and Storybook coverage fills gaps.
- [x] **AUDIT-08**: TypeScript/runtime maintainability gaps are reduced by replacing unsafe JSON assertions with guards, extracting shared Shopify mappers, tightening Portable Text rendering, avoiding client-side barrel ambiguity, and fixing scaffold templates.
- [x] **AUDIT-09**: Sitemap and canonical URL hygiene reflects real routes and durable modification dates rather than stale paths or request-time `new Date()` values.
- [x] **AUDIT-10**: Final verification records lint, typecheck, build, contract tests, Storybook build, targeted browser checks, accessibility checks, and a production-readiness summary.

## v5 Requirements

### Optimized Collection Quick Add

- [x] **CQA-01**: Collection and search product cards restore a visible add-to-cart affordance for products that can be safely added from listing context.
- [x] **CQA-02**: Multi-variant products must not silently add an arbitrary variant; they continue to route customers through Quick View or the PDP for variant selection.
- [x] **CQA-03**: Listing product data remains bounded and lightweight; quick-add support may fetch only the minimum variant fields needed to decide eligibility and add one variant.
- [x] **CQA-04**: Listing quick-add uses the existing Shopify cart Server Action path and preserves accessible pending, success, error, and cart-refresh feedback.
- [x] **CQA-05**: Product-card Storybook coverage proves quick-add success/error/pending states, multi-variant fallback behavior, and sold-out behavior without hitting Shopify.
- [x] **CQA-06**: Verification proves the restored affordance does not reintroduce full per-card purchase-form hydration or unbounded PLP payload growth.

## v6 Requirements

### Collection Product Card Improvements

- [ ] **CARD-01**: Collection product cards display a wider image column that gives product photography more visual weight at all breakpoints (mobile ≥ 10rem, sm ≥ 16rem, lg ≥ 20rem).
- [ ] **CARD-02**: Each card surfaces `productType` as a compact eyebrow label above the product title when the field is non-empty.
- [ ] **CARD-03**: Cards extract organic and certification signals from product tags and render up to 2 compact certification badges below the title.
- [ ] **CARD-04**: The redundant "More info" secondary button is removed; the product title link is the sole navigation path to the PDP.
- [ ] **CARD-05**: The right-column content uses a structured two-zone layout that always places product identity (eyebrow, title, badges, rating) at the top and purchase controls at the bottom.
- [ ] **CARD-06**: `ProductPurchaseForm` accepts a `showQuantity` prop (default `true`); the collection card passes `showQuantity={false}` to hide the quantity stepper in listing context.
- [ ] **CARD-07**: Storybook story for `ProductCard` is updated to reflect the new layout, including eyebrow, badge, and no-quantity-stepper states.

## v7 Requirements

### Full Visual Redesign (design/teavision-redesign.html)

- [x] **RD-01**: `src/app/globals.css` defines the new design system as Tailwind 4 `@theme` tokens — warm-paper surfaces, green-undertone ink scale, brand greens, gold accents (oklch values from the redesign), `Spectral` serif / `Hanken Grotesk` sans / `Space Mono` mono / `Caveat` script font stacks, and the redesign radius/rhythm values.
- [ ] **RD-02**: The old design system is removed completely — no `--tv-*` semantic tokens, no `steep`/`stone` palette scales, and no orphaned CSS or unused token classes remain anywhere in `src/`.
- [ ] **RD-03**: Layout chrome (header, navigation/mega-menu, search affordance, cart affordance, footer, announcement surfaces) matches the redesign's structure and styling.
- [ ] **RD-04**: The homepage matches the redesign's section composition and styling (hero, category/collection bands, product showcases, brand-motif bands, trust/wholesale sections, newsletter).
- [ ] **RD-05**: Collection pages and product cards match the redesign's listing presentation while preserving Phase 8/9 behavior contracts (bounded payloads, quick-add, badges).
- [ ] **RD-06**: Product detail pages match the redesign's PDP presentation while preserving bulk-savings, variant selection, and add-to-cart behavior.
- [ ] **RD-07**: Remaining storefront surfaces (cart, search, blog/Tea Journal, wholesale, static pages, error/empty states) are restyled with the new system with no legacy-styled stragglers.
- [ ] **RD-08**: Storybook stories render correctly under the new system, and `pnpm lint`, `pnpm typecheck`, and `pnpm build` pass with no raw hex/oklch values in classNames.

## Out of Scope

| Feature                                                | Reason                                                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| HulkApps script injection                              | Theme embed scripts are not a durable contract for a headless storefront.              |
| Client-side discount calculation as checkout authority | Shopify cart/checkout must remain the authority for actual applied discounts.          |
| Bulk wholesale account pricing                         | Separate account/B2B workflow beyond the live "Buy in Bulk and Save" PDP parity slice. |

## Traceability

| Requirement | Phase    | Status   |
| ----------- | -------- | -------- |
| BULK-01     | Phase 1  | Complete |
| BULK-02     | Phase 1  | Complete |
| BULK-03     | Phase 1  | Complete |
| BULK-04     | Phase 1  | Complete |
| BULK-05     | Phase 1  | Complete |
| BULK-06     | Phase 1  | Complete |
| BULK-07     | Phase 1  | Complete |
| BULK-08     | Phase 1  | Complete |
| SEARCH-01   | Phase 2  | Complete |
| SEARCH-02   | Phase 2  | Complete |
| SEARCH-03   | Phase 2  | Complete |
| SEARCH-04   | Phase 2  | Complete |
| SEARCH-05   | Phase 2  | Complete |
| SEARCH-06   | Phase 2  | Complete |
| SEARCH-07   | Phase 2  | Complete |
| FOOTER-01   | Phase 4  | Complete |
| FOOTER-02   | Phase 4  | Complete |
| FOOTER-03   | Phase 4  | Complete |
| FOOTER-04   | Phase 4  | Complete |
| FOOTER-05   | Phase 4  | Complete |
| AUDIT-01    | Phase 5  | Complete |
| AUDIT-02    | Phase 5  | Complete |
| AUDIT-03    | Phase 5  | Complete |
| AUDIT-04    | Phase 5  | Complete |
| AUDIT-05    | Phase 5  | Complete |
| AUDIT-06    | Phase 5  | Complete |
| AUDIT-07    | Phase 5  | Complete |
| AUDIT-08    | Phase 5  | Complete |
| AUDIT-09    | Phase 5  | Complete |
| AUDIT-10    | Phase 5  | Complete |
| CQA-01      | Phase 8  | Complete |
| CQA-02      | Phase 8  | Complete |
| CQA-03      | Phase 8  | Complete |
| CQA-04      | Phase 8  | Complete |
| CQA-05      | Phase 8  | Complete |
| CQA-06      | Phase 8  | Complete |
| CARD-01     | Phase 9  | Planned  |
| CARD-02     | Phase 9  | Planned  |
| CARD-03     | Phase 9  | Planned  |
| CARD-04     | Phase 9  | Planned  |
| CARD-05     | Phase 9  | Planned  |
| CARD-06     | Phase 9  | Planned  |
| CARD-07     | Phase 9  | Planned  |
| RD-01       | Phase 11 | Planned  |
| RD-02       | Phase 11 | Planned  |
| RD-03       | Phase 11 | Planned  |
| RD-04       | Phase 11 | Planned  |
| RD-05       | Phase 11 | Planned  |
| RD-06       | Phase 11 | Planned  |
| RD-07       | Phase 11 | Planned  |
| RD-08       | Phase 11 | Planned  |
| BULK-09     | Deferred | Deferred |
| BULK-10     | Deferred | Deferred |

**Coverage:**

- v1 requirements: 8 total
- v2 search requirements: 7 total
- v3 footer requirements: 5 total
- v4 audit remediation requirements: 10 total
- v5 optimized collection quick-add requirements: 6 total
- v6 collection product card improvement requirements: 7 total
- Deferred pricing requirements: 2 total
- Mapped to phases: 43
- Unmapped active/planned requirements: 0

---

_Requirements defined: 2026-05-26_
_Last updated: 2026-06-03 for Phase 8 optimized collection quick-add completion_
