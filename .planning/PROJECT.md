# Teavision Headless Storefront

## What This Is

Teavision is a headless Shopify storefront built with Next.js 16 App Router and React 19. It sells wholesale tea, herbs, spices, and related products to Australian retail, cafe, foodservice, and direct customers.

v1.0 shipped the migration of Shopify-theme storefront behavior into the Next storefront — product discovery, product detail with bulk savings, cart, checkout handoff, owned Searchanise search, trust signals — plus a complete visual redesign of every surface on the new warm-paper/green/gold design system.

## Core Value

Customers can confidently choose the right bulk product, quantity, and price path before checkout.

## Requirements

### Validated

- ✓ PDP "Buy in Bulk and Save" tiers from Shopify quantity price breaks / metafield / HulkApps fallback — v1.0
- ✓ Customer-selected quantity add-to-cart and Shopify-reported cart discount allocations — v1.0
- ✓ Searchanise as a JSON data source with Next-owned search layout, filters, sorting, pagination — v1.0
- ✓ Legacy Searchanise search-results page URLs redirect to the owned `/search` route — v1.0
- ✓ Footer 1:1 parity with the live site, later restyled to the redesign ink treatment — v1.0
- ✓ Production-readiness remediation (a11y, JSON-LD safety, rate limiting, PLP performance, sitemap hygiene) and pre-launch noindex controls — v1.0
- ✓ Optimized collection quick-add without per-card purchase forms — v1.0
- ✓ Cart→checkout critical flows covered by unit/integration/fake-Shopify e2e suites — v1.0
- ✓ Full visual redesign (RD-01..08): new OKLCH token system and typography across every surface, old `--tv-*`/steep/stone system deleted, behavior preserved through two owner UAT rounds — v1.0
- Shopify Storefront API remains the source of truth for product, collection, cart, and checkout data.
- The sibling Liquid theme remains a valid reference for legacy storefront behavior that has not yet been ported.

### Active

- [ ] Optimize `/blogs/teavision-blogs` loading and image rendering while preserving the Phase 11 Tea Journal design (Phase 12, carried into the next milestone).
- [ ] Close v1.0 known gaps: collection empty-state "Clear filters" misdirect (CQA-05), human UAT items (visual sweep, live Resend newsletter), and the tech-debt list in `milestones/v1.0-MILESTONE-AUDIT.md`.

### Out of Scope

- Reinstalling or injecting HulkApps app scripts into the headless storefront - third-party browser scripts from the Liquid theme are not a stable headless data contract.
- Recreating discount calculation rules in client code - Shopify checkout/cart remains the authority for actual discounts.
- Building wholesale account pricing for 100kg+ orders - this is a separate B2B/account feature.
- Editing sibling `teavision-theme` - it is used as a reference only.

## Context

Shipped v1.0 on 2026-06-11: 9 phases, 35 plans, 476 commits over ~6.5 weeks (+132k/−15k LOC TypeScript/TSX). Tech stack: Next.js 16 App Router (Cache Components), React 19, Tailwind 4 (OKLCH design tokens), Shopify Storefront GraphQL, Sanity (blog), Searchanise (search/recommendations), Storybook 10 + vitest + Playwright.

The site remains noindexed pending launch sign-off (Phase 6 controls; flip `DISABLE_INDEXING` at launch and add the new landing pages to the sitemap). The owner actively authors new landing surfaces directly in the codebase (bulk-wholesale-supply, private-label-packing, tea-bag-manufacturer, NPD order form, supply-chain protection band).

The codebase map in `.planning/codebase/` predates the redesign and has known drift (~241 structural elements); re-run `/gsd:map-codebase` before heavy planning.

## Constraints

- **Tech stack**: Next.js 16 App Router, React 19, Tailwind 4, Shopify Storefront API - match existing architecture and local Next docs.
- **Data source**: Actual discount application must come from Shopify cart/checkout data - avoid client-only price promises.
- **Conventions**: No default component exports, no `any`, no raw hex/rgb class names, no className concatenation, no direct generated type imports outside the types barrel; Section primitives for page bands; design-token classes only.
- **Testing**: unit/integration/e2e suites exist for cart-checkout (Phase 10 exception); Storybook story tests cover components; contract tests gate the button/section system. Real Shopify hosted-checkout testing still requires owner approval.

## Key Decisions

| Decision                                                                     | Rationale                                                                                                                             | Outcome |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Prefer Shopify-native quantity price breaks, with product metafield fallback | Native data is typed and cart/checkout aligned; metafield fallback lets operators mirror HulkApps tiers without injecting app scripts | Good    |
| Render bulk savings only when tier data exists                               | Prevents misleading static pricing on products that have no configured rule                                                           | Good    |
| Show cart discount allocations as Shopify reports them                       | Keeps displayed savings aligned with the authoritative cart state                                                                     | Good    |
| Use Searchanise API for search results instead of injected widget DOM        | Preserves Searchanise ranking and facets while giving the Next storefront full styling, semantics, and routing control                | Good    |
| Run the redesign as one 22-plan phase with old+new token systems coexisting until a final sweep | Kept every surface compiling during migration; the 11-14 sweep deleted the old system in one verified pass                | Good    |
| Preview-first concept workflow for design-direction changes (Storybook mockups → owner approval → implement) | Avoided re-implementing rejected directions; owner picked from rendered options (search overlay, 404, testimonials, collection hero) | Good    |
| Supersede Phase 9's horizontal card with the redesign's vertical card        | Owner approved the mockup card; CARD-02..06 delivered via 11-08, CARD-01 closed as superseded                                          | Good    |
| Client-side cart "Grand total" estimate from quantity breaks                 | Shows savings pre-checkout, but can diverge from Shopify's authoritative total                                                         | ⚠️ Revisit |

---

_Last updated: 2026-06-11 after v1.0 milestone completion_
