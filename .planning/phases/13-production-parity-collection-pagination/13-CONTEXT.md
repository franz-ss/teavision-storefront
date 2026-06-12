# Phase 13: Production-Parity Collection Pagination - Context

**Gathered:** 2026-06-12
**Refined:** 2026-06-12 (plan-validation discussion — production probes + codebase validation)
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the current forward-only `Next products` PLP pagination with production-style numbered `?page=N` pagination while preserving SEO behavior from the existing Shopify production site.

This phase owns collection product listing pagination only:

- `/collections/[handle]`
- `/collections/[handle]?page=N`
- `/collections/[handle]/[category]`
- `/collections/[handle]/[category]?page=N`

This phase must not redesign PLPs, move PLPs to Searchanise as a product source, widen product-card payloads, or change Shopify cart/checkout behavior.

</domain>

<decisions>
## Implementation Decisions

### SEO And URL Contract

- **D-01:** Public PLP pagination must use `?page=N`, matching the existing production storefront.
- **D-02:** Public cursor URLs must not be used as primary PLP navigation and must not become indexable.
- **D-03:** For launch, preserve production canonical behavior: paginated collection pages canonicalize to the base collection URL.
- **D-04:** `?page=1` should normalize to the clean collection URL via redirect or canonical/href generation. Prefer redirect if it does not create framework complexity.
- **D-05 (refined):** Emit `rel="prev"` and `rel="next"` for adjacent pages via **hoisted `<link>` tags rendered in the page Server Component** (React 19 hoists them to `<head>`). Validated 2026-06-12: the Next 16 Metadata API has no prev/next field, so the metadata route is not available. Parity-cosmetic only — Google deprecated these signals in 2019.
- **D-27:** Category routes currently emit NO canonical (latent gap). Paginated and unpaginated category pages (`/collections/{handle}/{category}`) canonicalize to the **parent collection** (`/collections/{handle}`) for exact production parity. Category self-canonicals join the post-launch SEO deferred list.
- **D-06:** Preserve production crawler intent for sort/filter combinations. Plain `?page=N` remains allowed; sort and noisy multi-filter combinations should stay out of indexing/crawling.
- **D-07:** Do not modernize paginated canonicals to self-referential URLs during this migration. That is a post-launch SEO improvement decision.

### Data Source And Performance

- **D-08:** Shopify Storefront GraphQL remains the PLP source of truth.
- **D-09:** Keep the Phase 05-03 bounded payload contract. Do not fetch every product in a collection for normal PLP rendering.
- **D-10 (refined):** Implement page-number navigation via an internal **id-only cursor index query** — a lightweight GraphQL request fetching only edge cursors/ids (`first: 250`, chunked if the collection ever exceeds 250) that yields every page boundary AND the true total page count in one request. Sequential cursor-walking is rejected. The Phase 05-03 payload bound applies to **product payloads**, not to id/cursor-only index requests.
- **D-11 (refined):** Cache cursor-index resolution by collection handle, sort, reverse, filters, category tag, and page size — using the **same cache policy as the product fetch**: `cacheTag('collection', 'collection-${handle}')` + `cacheLife('hours')`, so index and page data cannot diverge by more than one cache window.
- **D-12:** Do not switch PLPs to Searchanise in this phase; Searchanise remains search/recommendations only.
- **D-13:** Keep listing product-card data minimal and compatible with the Phase 8/11 quick-add contract.
- **D-21:** Page size stays `COLLECTION_PRODUCT_PAGE_SIZE = 24`. Production evidence (2026-06-12) shows production uses 48/page (5 pages, ~230 products in `/collections/all`); the owner-approval condition in the original D was surfaced and the decision is to keep 24 — Phase 05-03 payload contract is untouched and the windowed pager handles ~10 pages fine.
- **D-22:** Stale cached cursors (page fetch returns empty/short despite `page <= totalPages`) reuse the out-of-range path: redirect to the last valid page per fresh data. No force-refresh/retry machinery.

### UX

- **D-14:** Replace the visible `Next products` button with a classic pager: previous, nearby page numbers, current page, and next.
- **D-15 (refined):** With D-10's cursor index, true total pages ARE knowable — render the full windowed pager including the real last page (matching production's `1 … 5` display). The original "never invent unknowable pages" rule still holds in the degenerate case where the index is unavailable.
- **D-16:** Match existing Phase 11 PLP/search visual language, Tailwind token classes, `cn()` class composition, and named exports.
- **D-23:** Extract a shared `src/components/ui/pagination/` primitive (with Storybook story) taking `currentPage`, `totalPages`, and an href-builder. `SearchPagination` becomes a thin wrapper over it (or is replaced by it). Do NOT create a route-local duplicate pager.
- **D-24:** Out-of-range pages (e.g. `?page=20` when 10 pages exist) redirect to the last valid page. Production's 200-empty behavior is intentionally NOT copied (soft-404 risk); canonical-to-base means zero SEO divergence.
- **D-25:** Sort/filter changes reset pagination — sort/filter links drop the `page` param (clean URL = page 1); pager links preserve current sort/filters. Lock as explicit href-generation test cases.
- **D-26:** Pager clicks scroll to the top of the product grid (not page top, not preserved position), with sensible keyboard focus behavior.

### Validation

- **D-17:** Tests must cover parsing invalid page params, href generation, metadata/canonical output, pagination rendering, and bounded Shopify calls.
- **D-18:** Route verification must include `/collections/all`, `/collections/all?page=2`, a sorted PLP URL, and a category PLP URL.
- **D-19:** If GraphQL documents change, run `pnpm codegen`.
- **D-20:** Completion requires `pnpm typecheck`, `pnpm lint`, relevant tests, and `pnpm build`.

### Codex's Discretion

- Where the cursor-index helper lives (route-local `_lib` vs `src/lib/shopify/operations/collection.ts`), provided the public API stays understandable and testable. (The *strategy* — id-only index query — is locked by D-10.)
- Exact pagination window/ellipsis shape, provided the true last page is shown (D-15) and it remains accessible. The existing `SearchPagination` window logic is the reference implementation.
- Whether `?cursor=` receives a redirect, noindex canonical handling, or simple ignored-parameter behavior, provided it does not remain the public navigation path.
- Exact mechanism for scroll-to-grid (anchor target vs `scroll={false}` + effect) per D-26.

</decisions>

<canonical_refs>
## Canonical References

### Production Behavior

- `https://www.teavision.com.au/collections/all?page=1` - production page-one canonical and next-link behavior.
- `https://www.teavision.com.au/collections/all?page=2` - production paginated canonical, prev, and next behavior.
- `https://www.teavision.com.au/robots.txt` - current crawler exclusions for sort and noisy filter URLs.
- `https://www.teavision.com.au/sitemap.xml` - production sitemap index; paginated pages are not listed directly.

### Prior Project Decisions

- `.planning/milestones/v1.0-phases/05-codebase-review-remediation/05-03-SUMMARY.md` - explains why PLP fetching was bounded and why cursor pagination was introduced.
- `.planning/milestones/v1.0-phases/11-full-visual-redesign/11-UI-SPEC.md` - PLP/search visual language and payload bounds.
- `.planning/PROJECT.md` - Shopify Storefront API remains the source of truth for products and collections.
- `.planning/STATE.md` - accumulated decisions around Searchanise, quick-add, and PLP behavior.
- `.planning/REQUIREMENTS.md` - v1.2 requirements.

### Current Code

- `src/app/(storefront)/collections/[handle]/page.tsx` - collection route and metadata entry.
- `src/app/(storefront)/collections/[handle]/[category]/page.tsx` - category route entry.
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` - PLP state parsing, product fetch, and product list wiring.
- `src/app/(storefront)/collections/[handle]/_components/product-list.tsx` - current `Next products` UI.
- `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts` - URL, filter, sort, category helper logic.
- `src/app/(storefront)/collections/[handle]/_lib/page-types.ts` - route/search param types.
- `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx` - route-level rendering tests.
- `src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx` - product list rendering tests.
- `src/lib/shopify/operations/collection.ts` - collection Storefront GraphQL operation and `COLLECTION_PRODUCT_PAGE_SIZE`.
- `src/lib/shopify/queries/collection.graphql` - collection products query using `first`, `after`, and `pageInfo`.
- `src/components/search/search-pagination/search-pagination.tsx` - existing numbered pagination component style for Searchanise results.

### External References

- Shopify Liquid paginate tag/object - production theme has native `page` pagination, total pages, and page params.
- Shopify Storefront/Hydrogen pagination docs - Storefront API uses cursor pagination and encourages URL-stored pagination state.
- Google ecommerce pagination docs - modern guidance favors unique paginated URLs, but this phase intentionally preserves production canonicals for launch safety.
- Google robots.txt guide - robots controls crawling and is not a guaranteed de-indexing mechanism.

</canonical_refs>

<specifics>
## Production Observations

Production checks on 2026-06-12 found:

- `/collections/all?page=1` returns `200`, canonicalizes to `https://www.teavision.com.au/collections/all`, and links next to `/collections/all?page=2`.
- `/collections/all?page=2` returns `200`, canonicalizes to `https://www.teavision.com.au/collections/all`, links prev to `/collections/all?page=1`, and links next to `/collections/all?page=3`.
- `/collections/all/categories_all-herbs?page=2` returns `200`, canonicalizes to `https://www.teavision.com.au/collections/all`, and links prev to `/collections/all/categories_all-herbs?page=1`.
- Production robots disallows `/collections/*sort_by*`, nested `sort_by`, `+` collection URLs, and multi-filter collection URLs, but does not block plain `?page=`.

Plan-validation probes on 2026-06-12 additionally found:

- `/collections/all` has **5 pages at ~48 products/page, ~230 distinct products total** — comfortably under the Storefront API's 250-per-request cap, so a single id-only index query can enumerate the whole collection.
- Production page 2 pager links to pages 1, 3, 4, 5 — a full window including the true last page.
- Out-of-range pages (`?page=9` through `?page=20`) return `200` with an empty product listing and pager links to pages 1 and 5 only — a soft-404 pattern this migration intentionally does NOT copy (D-24).
- The headless category route (`[category]/page.tsx`) currently emits no canonical at all; only the base collection route sets `alternates.canonical`.
- The Next 16 Metadata API (`generate-metadata` docs in `node_modules/next/dist/docs`) has no prev/next pagination field — hoisted `<link>` elements are the supported path.

</specifics>

<deferred>
## Deferred Ideas

- Self-referential canonicals for paginated pages after launch, if Search Console and SEO review support the change.
- Category-base self-canonicals (`/collections/{handle}/{category}` as first-class indexable landing pages) — deliberate post-launch SEO improvement (see D-27).
- Searchanise-backed PLP data source.
- Matching production's 48-products-per-page size, if the owner requests it after launch (see D-21).
- Broader collection SEO canonical policy changes beyond pagination parity.

</deferred>

