# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-27)

**Core value:** Customers can confidently choose the right bulk product, quantity, and price path before checkout.
**Current focus:** Phase 2: Searchanise API Search Results

## Current Position

Phase: 2 of 2 (Searchanise API Search Results)
Plan: 1 of 1 in current phase
Status: Ready to execute
Last activity: 2026-05-27 - Phase 2 planned for Searchanise API-backed search results with owned Next UI and legacy Searchanise page cleanup.

Progress: [#####-----] 50%

## Performance Metrics

**Velocity:**

- Total plans completed: 1
- Average duration: not tracked
- Total execution time: not tracked

**By Phase:**

| Phase                               | Plans | Total       | Avg/Plan    |
| ----------------------------------- | ----- | ----------- | ----------- |
| 1. Bulk Savings PDP and Cart Parity | 1/1   | not tracked | not tracked |
| 2. Searchanise API Search Results   | 0/1   | not tracked | not tracked |

**Recent Trend:**

- Last 5 plans: 01-01 complete, 02-01 planned
- Trend: stable

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

### Roadmap Evolution

- Phase 2 added: Searchanise API Search Results

### Pending Todos

None yet.

### Blockers/Concerns

- Legacy HulkApps volume tiers are available through the app offer-table endpoint, but that endpoint is an external compatibility dependency rather than a typed Shopify source of truth.
- Legacy product JSON exposes `inventory_quantity` for old-theme parity, but it remains a compatibility fallback until inventory is available through the Storefront token or a first-party API path.
- `src/app/(storefront)/products/[handle]/page.tsx` still has pre-existing unstaged layout edits that were intentionally preserved outside the Phase 1 commit.
- Searchanise's API key is public and already present locally, but API response shape should still be narrowed defensively because Searchanise returns JSON outside the Shopify generated type system.

## Deferred Items

| Category      | Item                                       | Status   | Deferred At       |
| ------------- | ------------------------------------------ | -------- | ----------------- |
| Pricing admin | HulkApps-to-Shopify tier sync workflow     | Deferred | Phase 1 bootstrap |
| B2B pricing   | Authenticated company/location price lists | Deferred | Phase 1 bootstrap |

## Session Continuity

Last session: 2026-05-26
Stopped at: Phase 2 ready to execute after plan creation.
Resume file: None
