# Phase 13: Production-Parity Collection Pagination - Context

**Gathered:** 2026-06-12
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
- **D-05:** Emit `rel="prev"` and `rel="next"` metadata where the route can determine adjacent pages.
- **D-06:** Preserve production crawler intent for sort/filter combinations. Plain `?page=N` remains allowed; sort and noisy multi-filter combinations should stay out of indexing/crawling.
- **D-07:** Do not modernize paginated canonicals to self-referential URLs during this migration. That is a post-launch SEO improvement decision.

### Data Source And Performance

- **D-08:** Shopify Storefront GraphQL remains the PLP source of truth.
- **D-09:** Keep the Phase 05-03 bounded payload contract. Do not fetch every product in a collection for normal PLP rendering.
- **D-10:** Implement page-number navigation over Storefront cursor pagination through an internal cursor-index or cursor-walk helper.
- **D-11:** Cache cursor/page resolution by collection handle, sort, reverse, filters, category tag, and page size.
- **D-12:** Do not switch PLPs to Searchanise in this phase; Searchanise remains search/recommendations only.
- **D-13:** Keep listing product-card data minimal and compatible with the Phase 8/11 quick-add contract.

### UX

- **D-14:** Replace the visible `Next products` button with a classic pager: previous, nearby page numbers, current page, and next.
- **D-15:** Do not display unverifiable far-future page numbers. If total pages are unavailable, render a bounded window around known/reachable pages.
- **D-16:** Match existing Phase 11 PLP/search visual language, Tailwind token classes, `cn()` class composition, and named exports.

### Validation

- **D-17:** Tests must cover parsing invalid page params, href generation, metadata/canonical output, pagination rendering, and bounded Shopify calls.
- **D-18:** Route verification must include `/collections/all`, `/collections/all?page=2`, a sorted PLP URL, and a category PLP URL.
- **D-19:** If GraphQL documents change, run `pnpm codegen`.
- **D-20:** Completion requires `pnpm typecheck`, `pnpm lint`, relevant tests, and `pnpm build`.

### Codex's Discretion

- Whether page resolution is implemented as a route-local helper, Shopify operation helper, or small pair of helpers, provided the public API stays understandable and testable.
- Exact pagination window shape, provided it does not invent unknowable pages and remains accessible.
- Whether `?cursor=` receives a redirect, noindex canonical handling, or simple ignored-parameter behavior, provided it does not remain the public navigation path.

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

</specifics>

<deferred>
## Deferred Ideas

- Self-referential canonicals for paginated pages after launch, if Search Console and SEO review support the change.
- Searchanise-backed PLP data source.
- Full total-page counts if Shopify Storefront API cannot provide them without unacceptable fetch cost.
- Broader collection SEO canonical policy changes beyond pagination parity.

</deferred>

