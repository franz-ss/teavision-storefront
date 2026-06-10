---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Phase 08 complete
last_updated: "2026-06-10T01:04:20.653Z"
last_activity: 2026-06-10
progress:
  total_phases: 8
  completed_phases: 6
  total_plans: 25
  completed_plans: 11
  percent: 44
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-27)

**Core value:** Customers can confidently choose the right bulk product, quantity, and price path before checkout.
**Current focus:** Phase 11 — full-visual-redesign

## Current Position

Phase: 11 (full-visual-redesign) — EXECUTING
Plan: 2 of 14
Status: Ready to execute
Last activity: 2026-06-10

Progress: [████░░░░░░] 44%

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

Last session: 2026-06-10
Stopped at: Phase 11 Plan 01 complete
Resume file: .planning/phases/11-full-visual-redesign/11-01-SUMMARY.md
