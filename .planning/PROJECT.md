# Teavision Headless Storefront

## What This Is

Teavision is a headless Shopify storefront built with Next.js 16 App Router and React 19. It sells wholesale tea, herbs, spices, and related products to Australian retail, cafe, foodservice, and direct customers.

v1.0 shipped the migration of Shopify-theme storefront behavior into the Next storefront — product discovery, product detail with bulk savings, cart, checkout handoff, owned Searchanise search, trust signals — plus a complete visual redesign of every surface on the new warm-paper/green/gold design system. v1.1 followed with Tea Journal (blog) loading and image-rendering performance work. v1.2 restored production-style numbered collection pagination for launch parity. v1.3 added modern Shopify Customer Account authentication and account self-service, with protected account pages, address/profile management, order history, cart buyer identity sync, legacy account bridges, and launch-readiness documentation. v1.4 hardened the storefront to a 100/100 automated production-readiness score — security/headers/CSP, legal/consent/analytics, operations/observability/e2e, SEO-audit remediation, and H1 correctness. v1.5 fixed the homepage `/` PageSpeed findings (hero LCP fetchPriority, AVIF, lazy Sentry SDK), verified with real owner-run PSI: Performance 95–97, Accessibility 100, Best Practices 100.

## Core Value

Customers can confidently choose the right bulk product, quantity, and price path before checkout.

## Current State

**Shipped through:** v1.5 Performance & PageSpeed 100 (Phase 20, shipped 2026-07-01, lean scope). v1.4 Production Readiness (Phases 15–19) reached 100/100 automated code readiness on 2026-06-26 (H1 re-remediation 2026-06-29). v1.6 Phases 21-22 are complete: the sibling Sanity Studio owns the homepage singleton model/seed path, and the storefront `/` now renders typed Sanity homepage content through the existing homepage with visual, SEO, image, and commerce parity.

**Customer-account capability now available:**

- Customer Account API OAuth/session foundation with secure server-owned cookies.
- `/account` login/logout/callback and protected account routes.
- Account dashboard/profile details, saved addresses, default address handling, paginated orders, and order detail pages.
- Address and supported profile mutations through session-verified Server Actions.
- Cart buyer identity sync before checkout with fake-Shopify checkout-handoff coverage.
- Legacy account bridge routes and owned header/footer account links.
- Launch-readiness documentation for Shopify admin setup, protected customer data, HTTPS OAuth testing, real checkout approval gates, reorder parity, and B2B/customer-pricing parity.

**Current launch gates:** Automated code readiness is `100/100` after dated PERF-01 performance acceptance; v1.5 superseded that acceptance for `/` with a real owner-run PSI result (Performance 95–97). Production launch still needs owner-gated Shopify/admin/Search Console proof for hosted checkout, payment, shipping, tax, order creation, success redirect, live Customer Account OAuth, protected customer data, B2B/customer pricing, sitemap submission, and URL inspection.

## Current Milestone: v1.6 Sanity CMS Homepage Integration

**Goal:** Make the front page CMS-authored through the sibling `teavision-cms` Studio while preserving the current storefront experience and enforcing strict no SEO/PageSpeed regression.

**Target features:**

- Homepage content schemas in `../teavision-cms`, using folder context instead of redundant `homepage-*` file names.
- Typed Sanity homepage query and fetch path in the Next storefront, using existing Sanity helpers and Next.js 16 cache/tag conventions.
- Front page rendering through existing homepage components with fail-loud behavior for missing or invalid homepage content.
- Sanity image handling, metadata/SEO mapping, preview/draft support, webhook revalidation, and deployment wiring.
- Release gate that blocks rollout if SEO or PageSpeed scores regress from the current v1.5 baseline.

## Shipped Milestone: v1.5 Performance & PageSpeed 100

**Shipped:** 2026-07-01 (lean scope, owner directive D-16). Phase 20 resolved the four homepage `/` PSI screenshot findings — hero LCP `fetchPriority="high"`, AVIF image delivery, a lazy-loaded client Sentry SDK, and a measured `experimental.inlineCss` decision — verified end-to-end with real owner-run PSI (Performance 95–97, LCP 3.0s, Speed Index 1.9s, TBT 30ms, CLS 0, Accessibility 100, Best Practices 100), with no regression of the Phase 18/19 SEO/H1 guards. The broad "100/100 across all four categories on every representative route" ambition (10 of 15 PSI requirements) was **deliberately deferred**; plans are summarized in `milestones/v1.5-ROADMAP.md` and recoverable from commit `e0e42881`.

## Prior Milestone: v1.4 Production Readiness 100/100

**Goal:** Close every launch-blocking QA, security, compliance, performance, analytics, reliability, and operational gap found in the production-readiness audit so the storefront can earn a 100/100 readiness score.

**Target features:**

- Security and dependency remediation for all critical, high, and launch-relevant medium findings.
- Production-safe account login/OAuth behavior with verified callback and local-production e2e coverage.
- Complete legal, privacy, policy, cookie-consent, SEO redirect, and sitemap coverage for launch.
- Analytics and conversion tracking readiness with consent-aware instrumentation.
- Health checks, monitoring/logging hooks, alerting documentation, backup/runbook coverage, and deploy-time launch gates.
- Performance evidence with dated acceptance for remaining local Lighthouse lab failures.
- A repeatable production-readiness audit proving no critical, high, or medium automated code blockers remain.

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

- ✓ Optimized `/blogs/teavision-blogs` loading and image rendering (bounded image URLs, LQIP placeholders, hero preload discipline, light default-listing query) while preserving the Phase 11 Tea Journal design — v1.1

- ✓ Production-style `?page=N` collection pagination with production canonical/crawler parity, bounded Shopify Storefront GraphQL payloads, and sticky-header-aware scroll-to-grid anchoring (PLP-PAGE-01..06) — Validated in Phase 13 — v1.2
- ✓ Shopify Customer Account API OAuth/session foundation, protected account dashboard, profile/address self-service, order history/detail, cart buyer identity sync, legacy account bridges, launch-readiness documentation, and UAT gap closure — Validated in Phase 14 — v1.3
- ✓ Production readiness hardening across security, legal/consent/analytics/SEO, operations, observability, local production e2e, final readiness audit, and dated PERF-01 local lab acceptance — Validated in Phases 15-17 — v1.4
- ✓ SEO audit remediation across URL parity, H1/content hierarchy, metadata/indexation, structured data, crawlable HTML proof, and honest Core Web Vitals evidence reconciliation — Validated in Phase 18 — v1.4
- ✓ H1 correctness re-remediation — one visible H1 per standalone route load; soft-nav Activity-DOM accumulation documented (cited) as invisible to Google; banner-collection H1 kept compact per D-08 — Validated in Phase 19 — v1.4
- ✓ Homepage `/` PageSpeed remediation — hero LCP `fetchPriority="high"`, AVIF delivery, lazy client Sentry SDK, measured inlineCss decision; real owner-run PSI Performance 95–97, Accessibility 100, Best Practices 100, CLS 0 (PSI-03/05/06/07/08) — Validated in Phase 20 — v1.5
- ✓ Sanity homepage singleton schema and seed path in sibling `teavision-cms` — Validated in Phase 21 — v1.6
- ✓ Typed Sanity homepage data boundary and storefront `/` rendering through existing homepage sections with visual, SEO, image, form, and Shopify commerce parity — Validated in Phase 22 — v1.6

### Active

- [ ] Publisher can update homepage content and invalidate the existing homepage cache tags through the signed Sanity webhook.
- [ ] Editor can securely preview draft homepage content at `/` through Next Draft Mode, without exposing draft/stega/source-map text to published visitors.
- [ ] Release verification proves no homepage SEO or PageSpeed score regression before rollout and blocks or rolls back any measured regression.

### Deferred / Carryover

- Capture owner-gated external launch proof: real Customer Account OAuth, protected customer data scopes, hosted checkout/payment/shipping/tax/order/success redirect tests, authoritative B2B/company-location pricing checks, and Search Console submission/URL inspection.
- Broad PageSpeed 100/100 (deferred from v1.5 per D-16): the 10 deferred PSI requirements — multi-route real-PSI preview harness, `/account` CLS, font/caching/third-party tuning, multi-route Accessibility/Best-Practices/SEO 100, and the full evidence pack. Plans are summarized in `milestones/v1.5-ROADMAP.md` and recoverable from commit `e0e42881`.
- Close inherited human-only launch checks where still relevant: collection empty-state behavior, human visual/newsletter UAT, and blog performance debt.

### Out of Scope

- Reinstalling or injecting HulkApps app scripts into the headless storefront - third-party browser scripts from the Liquid theme are not a stable headless data contract.
- Recreating discount calculation rules in client code - Shopify checkout/cart remains the authority for actual discounts.
- Implementing wholesale/customer-specific pricing as an unverified client-side calculation - Shopify remains the source of truth for actual customer pricing and checkout totals.
- Recreating classic password-based customer account forms - modern Shopify Customer Account API uses Shopify-hosted OAuth unless the owner explicitly chooses a legacy fallback later.
- Editing sibling `teavision-theme` - it is used as a reference only.

## Context

Shipped v1.0 on 2026-06-11: 9 phases, 35 plans, 476 commits over ~6.5 weeks (+132k/-15k LOC TypeScript/TSX). Shipped v1.1 on 2026-06-12: Phase 12 blog performance (4 plans). Shipped v1.2 on 2026-06-12: numbered `?page=N` collection pagination with canonical/crawler parity and gap-closed scroll-to-grid anchoring. Shipped v1.3 on 2026-06-22: Phase 14 Shopify Customer Accounts (9 plans, 31 tasks, 26/26 requirements) covering Customer Account API OAuth/session, protected account pages, address/profile/order self-service, cart buyer identity sync, migration bridges, launch-readiness docs, and UAT gap closure. v1.4 completed automated code readiness on 2026-06-26 with final readiness at `100/100`; PERF-01 closed through dated project-owner acceptance of repeated local Lighthouse lab failures as non-blocking while raw metric FAIL rows remain documented. v1.5 (Phase 20, 2026-07-01) shipped a lean homepage `/` PageSpeed pass — hero LCP fetchPriority, AVIF, lazy Sentry SDK — confirmed by real owner-run PSI (Performance 95–97, Accessibility 100, Best Practices 100, CLS 0); 10 of 15 PSI requirements were deliberately deferred (D-16). Tech stack: Next.js 16 App Router (Cache Components), React 19, Tailwind 4 (OKLCH design tokens), Shopify Storefront GraphQL and Customer Account API, Sanity (blog), Searchanise (search/recommendations), Storybook 10 + vitest + Playwright.

The site remains noindexed pending launch sign-off (Phase 6 controls; flip `DISABLE_INDEXING` at launch and add the new landing pages to the sitemap). The owner actively authors new landing surfaces directly in the codebase (bulk-wholesale-supply, private-label-packing, tea-bag-manufacturer, NPD order form, supply-chain protection band).

v1.6 starts with an existing sibling Sanity Studio at `../teavision-cms`; homepage schema work belongs there rather than scaffolding a new Studio inside the storefront. Existing storefront Sanity usage covers the blog, and v1.6 extends that boundary to the front page without making Sanity authoritative for Shopify product, collection, cart, checkout, or price data.

The codebase map in `.planning/codebase/` predates the redesign and has known drift (~241 structural elements); re-run `/gsd:map-codebase` before heavy planning.

## Constraints

- **Tech stack**: Next.js 16 App Router, React 19, Tailwind 4, Shopify Storefront API - match existing architecture and local Next docs.
- **Release quality**: The Sanity homepage integration must not reduce SEO or PageSpeed scores; any measured regression blocks rollout until fixed or rolled back.
- **CMS boundary**: Extend the sibling `teavision-cms` Studio for authoring and keep storefront code in `src/`; do not create a second Studio in the Next app.
- **Naming**: Do not repeat parent directory context in filenames; files inside homepage folders should be named `hero.ts`, `cta.ts`, `faq.ts`, etc., not `homepage-hero.ts`.
- **Data source**: Actual discount application must come from Shopify cart/checkout data - avoid client-only price promises.
- **Conventions**: No default component exports, no `any`, no raw hex/rgb class names, no className concatenation, no direct generated type imports outside the types barrel; Section primitives for page bands; design-token classes only.
- **Testing**: unit/integration/e2e suites exist for cart-checkout (Phase 10 exception); Storybook story tests cover components; contract tests gate the button/section system. Real Shopify hosted-checkout testing still requires owner approval.

## Key Decisions

| Decision                                                                                                     | Rationale                                                                                                                                                                                                                      | Outcome                                      |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Prefer Shopify-native quantity price breaks, with product metafield fallback                                 | Native data is typed and cart/checkout aligned; metafield fallback lets operators mirror HulkApps tiers without injecting app scripts                                                                                          | Good                                         |
| Render bulk savings only when tier data exists                                                               | Prevents misleading static pricing on products that have no configured rule                                                                                                                                                    | Good                                         |
| Show cart discount allocations as Shopify reports them                                                       | Keeps displayed savings aligned with the authoritative cart state                                                                                                                                                              | Good                                         |
| Use Searchanise API for search results instead of injected widget DOM                                        | Preserves Searchanise ranking and facets while giving the Next storefront full styling, semantics, and routing control                                                                                                         | Good                                         |
| Run the redesign as one 22-plan phase with old+new token systems coexisting until a final sweep              | Kept every surface compiling during migration; the 11-14 sweep deleted the old system in one verified pass                                                                                                                     | Good                                         |
| Preview-first concept workflow for design-direction changes (Storybook mockups → owner approval → implement) | Avoided re-implementing rejected directions; owner picked from rendered options (search overlay, 404, testimonials, collection hero)                                                                                           | Good                                         |
| Supersede Phase 9's horizontal card with the redesign's vertical card                                        | Owner approved the mockup card; CARD-02..06 delivered via 11-08, CARD-01 closed as superseded                                                                                                                                  | Good                                         |
| Client-side cart "Grand total" estimate from quantity breaks                                                 | Shows savings pre-checkout, but can diverge from Shopify's authoritative total                                                                                                                                                 | ⚠️ Revisit                                   |
| Light server-paginated GROQ query for the default blog listing, full `getBlog()` for tag/search              | Avoids fetching every article's bodyText on the most-visited blog path while keeping in-memory filtering where it is needed                                                                                                    | Good                                         |
| Revert CDN-backed Sanity reads to authenticated `sanityFetch`                                                | Token-less CDN client broke reads against the dataset; authenticated non-CDN reads are correct, CDN helper removed at v1.1 audit                                                                                               | Good                                         |
| LQIP blur placeholders with truthy guards plus bounded image URL options                                     | Blur-in perceived performance without render crashes on empty/absent LQIP; image weight capped per use case                                                                                                                    | Good                                         |
| Preserve production PLP pagination SEO behavior for launch                                                   | Platform migration risk is lower when `?page=N`, base canonicals, prev/next links, and crawler exclusions match the live Shopify site before post-launch SEO tuning                                                            | Good                                         |
| Use a dedicated Customer Account API boundary                                                                | Customer auth headers, endpoints, PII handling, schema shape, and no-store cache policy differ from Storefront product/cart reads                                                                                              | Good                                         |
| Keep customer session and OAuth material server-owned in HttpOnly cookies                                    | Prevents token exposure to browser JavaScript and keeps account data session-scoped                                                                                                                                            | Good                                         |
| Block checkout when signed-in buyer identity sync fails                                                      | Avoids silently continuing as guest when customer identity should be attached before Shopify checkout                                                                                                                          | Good                                         |
| Bridge legacy account routes instead of recreating password forms                                            | Modern Shopify Customer Accounts are OAuth-hosted; bridge pages preserve intent without rebuilding classic account flows                                                                                                       | Good                                         |
| Treat real Customer Account OAuth and hosted checkout as launch gates                                        | Shopify admin setup, protected data scopes, and store-owner approval are required before live OAuth/checkout/payment/order testing                                                                                             | Pending                                      |
| Close PERF-01 via dated project-owner acceptance of local Lighthouse lab failures                            | Strict local mobile Lighthouse kept failing all representative routes after exhaustive image/font/shell work; the gap was a lab artifact, so acceptance unblocked readiness while raw FAIL rows stayed documented              | ✓ Good (superseded for `/` by v1.5 real PSI) |
| Keep `cacheComponents` enabled; resolve SEO-H1-01 as one-visible-H1-per-standalone-route (D-09)              | Disabling Cache Components (Approach A) was implemented then reverted; Googlebot renders each URL statelessly and never assembles the soft-nav accumulation, so multiple H1s in the live browser DOM are not an indexing issue | ✓ Good                                       |
| Narrow v1.5 to a lean homepage `/` PageSpeed pass (D-16)                                                     | Screenshot-driven, architecture-preserving fixes with real-PSI proof beat a broad multi-category sweep against unverified local-lab numbers; the broad scope is deferred with plans preserved                                  | ✓ Good                                       |
| Use `fetchPriority="high"` for the LCP hero image, distinct from the banned deprecated `priority` (D-15)     | `fetchPriority` is the supported Next.js 16 prop that makes the preload `<link>` carry `fetchpriority=high`; verified against runtime source, and it does not throw the preload+priority runtime error                         | ✓ Good                                       |
| Treat no SEO/PageSpeed regression as a v1.6 release blocker                                                  | Homepage CMS flexibility is not allowed to cost search or performance gains earned in v1.4/v1.5                                                                                                                                | — Pending                                    |
| Fail loudly when the Sanity homepage singleton or render-critical fields are missing                         | A hidden runtime static fallback would mask CMS failures and create content drift after cutover                                                                                                                                | ✓ Good                                       |
| Defer Draft Mode preview, signed webhook revalidation, and release SEO/PageSpeed proof to Phase 23           | Phase 22 proved the typed published-content rendering path; preview/revalidation/release gates are separate rollout concerns                                                                                                   | Pending                                      |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):

1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):

1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---

_Last updated: 2026-07-03 after completing Phase 22_
