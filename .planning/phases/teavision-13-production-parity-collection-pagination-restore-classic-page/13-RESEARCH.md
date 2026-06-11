# Phase 13 Research: Production-Parity PLP Pagination

**Date:** 2026-06-12
**Phase:** 13 - Production-parity collection pagination
**Recommendation:** Preserve production public URLs and canonicals for launch, while implementing page-number navigation over internal Storefront cursor pagination.

## Research Question

How should the headless Next storefront restore classic collection pagination without changing production SEO signals or regressing the PLP performance remediation from Phase 05-03?

## Sources Reviewed

- Production storefront:
  - `https://www.teavision.com.au/collections/all?page=1`
  - `https://www.teavision.com.au/collections/all?page=2`
  - `https://www.teavision.com.au/collections/all/categories_all-herbs?page=2`
  - `https://www.teavision.com.au/robots.txt`
  - `https://www.teavision.com.au/sitemap.xml`
- Shopify docs:
  - Liquid `paginate` tag and object.
  - Storefront/Hydrogen pagination.
- Google Search Central:
  - Ecommerce pagination and incremental loading.
  - Robots.txt introduction.
- Project docs:
  - `.planning/milestones/v1.0-phases/05-codebase-review-remediation/05-03-SUMMARY.md`
  - `.planning/milestones/v1.0-phases/11-full-visual-redesign/11-UI-SPEC.md`
  - `.planning/codebase/CONCERNS.md`
- Current code:
  - `src/lib/shopify/operations/collection.ts`
  - `src/lib/shopify/queries/collection.graphql`
  - `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`
  - `src/app/(storefront)/collections/[handle]/_components/product-list.tsx`
  - `src/components/search/search-pagination/search-pagination.tsx`

## Findings

### Production Shopify Theme

Production is still Shopify Liquid/theme-rendered for collection pages. Shopify Liquid pagination has page-number semantics through `paginate.current_page`, `paginate.pages`, `paginate.items`, and the default `page` URL parameter. That explains why production can render classic page numbers quickly.

Production SEO signals observed:

- Page-one collection URL canonicalizes to the clean collection URL.
- Page-two collection URL also canonicalizes to the clean collection URL.
- Prev/next link elements are present for adjacent pages.
- Production robots blocks sort and noisy filter URL patterns but allows plain `?page=`.
- Paginated URLs are not directly listed in the sitemap index output.

### Headless Storefront API

The current headless PLP path uses Shopify Storefront GraphQL. Collection products are queried as a connection with `first`, `after`, and `pageInfo`. This is naturally cursor-based, not page-number-based. The API returns `hasNextPage` and `endCursor`; it does not give the Liquid theme's full `paginate.pages` behavior in the current query.

The current `Next products` button is the visible artifact of Phase 05-03, which changed PLP rendering from a 250-product request to a bounded 24-product request and single forward cursor.

### SEO Risk

Changing from production canonicals to self-referential paginated canonicals during a platform migration would make ranking changes harder to diagnose. Google's current ecommerce pagination docs recommend unique URLs and self-canonicals for paginated pages, but the safer migration posture is to preserve the production contract first.

Robots.txt alone is not a de-indexing guarantee. Canonical/noindex behavior still matters for parameter URLs.

## Recommended Implementation Shape

1. Keep Shopify Storefront GraphQL as source of truth.
2. Parse public `page` from route `searchParams`.
3. Resolve page N to an internal cursor by walking/caching page cursors in bounded page-size requests.
4. Fetch only the requested page of products for render.
5. Render a numbered pager using known/reachable pages, previous, and next.
6. Preserve production canonical behavior for launch.
7. Add route metadata tests and helper tests to prevent accidental cursor URL or canonical drift.

## Risks And Mitigations

- **Risk:** Deep page requests require walking many cursors.
  - **Mitigation:** Cache cursor resolution by collection/sort/filter/category/page size and keep each Shopify call bounded.

- **Risk:** We cannot know true total pages without more data.
  - **Mitigation:** Do not show fake far-future pages. Render known/reachable pages and next when available.

- **Risk:** Invalid pages create soft-404 indexed URLs.
  - **Mitigation:** Normalize page values and redirect or notFound/noindex out-of-range pages based on what can be determined safely.

- **Risk:** SEO changes happen accidentally during migration.
  - **Mitigation:** Write explicit canonical/prev/next tests and keep production parity as the locked launch decision.

