---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 11-13-PLAN.md
last_updated: "2026-06-10T05:08:49.172Z"
last_activity: 2026-06-10
progress:
  total_phases: 8
  completed_phases: 6
  total_plans: 25
  completed_plans: 23
  percent: 92
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-27)

**Core value:** Customers can confidently choose the right bulk product, quantity, and price path before checkout.
**Current focus:** Phase 11 — full-visual-redesign

## Current Position

Phase: 11 (full-visual-redesign) — EXECUTING
Plan: 13 of 14
Status: Ready to execute
Last activity: 2026-06-10

Progress: [█████████░] 92%

## Performance Metrics

**Velocity:**

- Total plans completed: 10
- Average duration: not tracked
- Total execution time: not tracked

**By Phase:**

| Phase                               | Plans | Total       | Avg/Plan    |
| ----------------------------------- | ----- | ----------- | ----------- |
| 1. Bulk Savings PDP and Cart Parity | 1/1   | not tracked | not tracked |
| 2. Searchanise API Search Results   | 1/1   | not tracked | not tracked |
| 4. Footer 1:1 Parity                | 1/1   | not tracked | not tracked |
| 5. Codebase Review Remediation      | 5/5   | not tracked | not tracked |
| 6. Prevent site indexing            | 1/1   | not tracked | not tracked |
| 8. Optimized Collection Quick Add   | 1/1   | not tracked | not tracked |

**Recent Trend:**

- Last 5 plans: 05-03 complete, 05-04 complete, 05-05 complete, 06-01 complete, 08-01 complete
- Trend: stable

| Phase 6 P06-01 | not tracked | 4 tasks | 20 files |
| Phase 8 P08-01 | complete | 4 tasks | 12 files |
| Phase 11 P02 | 451s | 3 tasks | 11 files |
| Phase 11-full-visual-redesign P03 | 8m | 3 tasks | 23 files |
| Phase 11 P05 | 25m | 2 tasks | 17 files |
| Phase 11-full-visual-redesign P06 | 535 | 3 tasks | 8 files |
| Phase 11-full-visual-redesign P08 | 16m | 3 tasks | 15 files |
| Phase 11-full-visual-redesign P11 | 801s | 2 tasks | 10 files |
| Phase 11-full-visual-redesign P12 | 6m | 3 tasks | 11 files |
| Phase 11-full-visual-redesign P07 | 26 min | 3 tasks | 15 files |
| Phase 11-full-visual-redesign P09 | 16 min | 2 tasks | 9 files |
| Phase 11-full-visual-redesign P10 | 22min | 3 tasks | 12 files |
| Phase 11-full-visual-redesign P13 | 21 min | 3 tasks | 39 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 1: Use Shopify-native quantity price breaks first, a product metafield fallback second, and the legacy HulkApps volume-discount endpoint only when both are absent.
- Phase 1: Keep bulk-tier selection separate from the visible quantity input; validate the selected deal quantity before adding to cart.
- Phase 1: Use Shopify quantity rules plus legacy product JSON inventory as the PDP max quantity cap because this Storefront token cannot read `quantityAvailable`.
- Phase 1: Preserve any pre-existing user edits in product page files.
- Phase 1: Leave the sibling Liquid theme untouched; it remains a reference source only.
- Phase 2: Use the Searchanise Search API JSON response for search results, not the injected Searchanise search-results widget DOM.
- Phase 2: Keep Searchanise PDP recommendations available while preventing Searchanise from taking over `/search` and legacy search-results page routes.
- Phase 2: `/search` is the canonical owned search page; `/pages/search-results` and `/pages/search-results-page` redirect to it with useful query params preserved.
- Phase 2: Next 16 Cache Components needs Suspense around runtime route reads such as the Searchanise loader path check and legacy redirect `searchParams`.
- Phase 4: The live footer from `https://www.teavision.com.au/` is the canonical reference for visible footer parity, including exact labels/hrefs for visible links, the `mrtea.com.au` footer Login link, and payment marks. The hidden keyword-link markup was removed during implementation review to keep the headless footer lean and user-facing.
- Phase 4: Use Phase 04 rather than Phase 03 because `.planning/phases/03-blog-sanity-cms-migration/` already exists locally and must not be overwritten.
- Phase 8: Restore listing-card direct add only through a minimal `quickAdd` contract (`variants(first: 2)` with id/title/availability) and a small `QuickAddButton` client leaf; multi-variant products keep Quick View/PDP selection.
- Phase 11-01: Fonts self-hosted via next/font; Spectral uses explicit weights [300,400,500,600] + italic (not a variable font). No runtime Google Fonts requests.
- Phase 11-01: Phase 11 OKLCH design tokens added alongside old --tv-* tokens in globals.css; dual-system persists until final sweep in plan 11-14.
- Phase 11-01: --color-ring/radius-*/shadow-*/container-wide override old values via last-write-wins within @theme inline.
- [Phase ?]: Phase 11-02: brandStrong kept as temp alias of brand in Section.Root until 11-14 migration sweep
- [Phase ?]: Phase 11-02: Section.Intro gains optional eyebrow string prop via Eyebrow component above type-heading-01
- [Phase ?]: Phase 11-02: Badge keeps legacy variant names while adding organic/gold/onDark pill variants
- Phase 11-05: Payment marks refactored from SVG icons to bordered text chips matching .ft mockup; SVG files retained for plan 11-14 cleanup
- Phase 11-05: Newsletter form layout changed to full-width stacked input+button per mockup; Server Action/honeypot/aria-live wiring unchanged
- [Phase ?]: Phase 11-06: Hero uses Section.Root tone=transparent with hero-scrim CSS utility; PrivateLabel uses inline svc__card layout; CertificationCoverage is CSS-only marquee Server Component
- [Phase ?]: Preserved per-unit pricing context in cart line despite drawer mockup omitting it
- [Phase ?]: Blog hero and rich-content mappers
- [Phase 11]: Homepage lower section order follows the redesign lower composition: testimonials, motif bands, journal, newsletter, contact, FAQ.
- [Phase 11]: Header cart count loads through a client leaf after hydration to satisfy Next.js 16 Server Function initial-render restrictions.
- [Phase 11]: Phase 11-09: Search reuses the 11-08 PLP ProductCard/grid/facet/sort vocabulary instead of adding search-only visual variants.
- [Phase 11]: Phase 11-09: Searchanise request, typed-unknown narrowing, and URL-param helpers stayed untouched; the plan changed presentation only.
- [Phase 11-10]: Preserved the existing Shopify product query shape and derived PDP eyebrow/detail metadata from available tags/options instead of expanding Storefront GraphQL fields.
- [Phase 11-10]: Restyled PDP quick view and recommendation rails without changing Searchanise fetch, quick-view fetch, variant selection, add-to-cart, or bulk-savings behavior.
- [Phase 11-full-visual-redesign]: Wholesale now renders the shared protected ContactForm so wholesale and contact enquiries stay on the same Server Action, honeypot, and rate-limit boundary. — Keeps spam protection, rate limiting, and validation behavior consistent across supporting page enquiry forms.
- [Phase 11-full-visual-redesign]: The generic Shopify page route keeps page.tsx metadata, noindex, cache, and sanitized rich text plumbing untouched; only hero, breadcrumb, body, and support presentation changed. — Plan 11-13 owned presentation surfaces, while route metadata and sanitization already belonged to the existing data boundary.
- [Phase 11-full-visual-redesign]: Supporting page heroes standardize on brand Section surfaces with gold eyebrows, warm card surfaces, and compact prose for static informational content. — Aligns every support/static page with the approved Phase 11 visual language without introducing new layout primitives.

### Roadmap Evolution

- Phase 2 added: Searchanise API Search Results
- Phase 4 added: Footer 1:1 Parity
- Phase 5 added: Codebase Review Remediation
- Phase 6 added: Prevent the site from being indexed
- Phase 8 added: Optimized Collection Quick Add

### Pending Todos

- None.

### Blockers/Concerns

- Legacy HulkApps volume tiers are available through the app offer-table endpoint, but that endpoint is an external compatibility dependency rather than a typed Shopify source of truth.
- Legacy product JSON exposes `inventory_quantity` for old-theme parity, but it remains a compatibility fallback until inventory is available through the Storefront token or a first-party API path.
- `src/app/(storefront)/products/[handle]/page.tsx` still has pre-existing unstaged layout edits that were intentionally preserved outside the Phase 1 commit.
- Searchanise's API key is public and already present locally, but API response shape should still be narrowed defensively because Searchanise returns JSON outside the Shopify generated type system.
- Phase 5 remediated the production-readiness gaps found in `CODEBASE_REVIEW.md`. See `.planning/phases/05-codebase-review-remediation/05-VERIFICATION.md` and the `05-*-SUMMARY.md` files for evidence and accepted residual risks.
- Phase 8 restored optimized listing quick-add without reattaching `ProductPurchaseForm` to every card. See `.planning/phases/08-optimized-collection-quick-add/08-01-SUMMARY.md` for verification evidence.

## Deferred Items

| Category      | Item                                       | Status   | Deferred At       |
| ------------- | ------------------------------------------ | -------- | ----------------- |
| Pricing admin | HulkApps-to-Shopify tier sync workflow     | Deferred | Phase 1 bootstrap |
| B2B pricing   | Authenticated company/location price lists | Deferred | Phase 1 bootstrap |

## Session Continuity

Last session: 2026-06-10T05:08:21.765Z
Stopped at: Completed 11-13-PLAN.md
Resume file: None
