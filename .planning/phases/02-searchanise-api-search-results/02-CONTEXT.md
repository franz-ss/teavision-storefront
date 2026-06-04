# Phase 2: Searchanise API Search Results - Context

**Gathered:** 2026-05-27
**Status:** Ready for planning
**Source:** Current conversation, local code inspection, Searchanise documentation review

<domain>
## Phase Boundary

Replace the legacy Searchanise search-results widget page with a first-class
Next storefront search experience:

- `/search` should fetch Searchanise JSON results server-side and render
  Teavision-owned UI.
- Search results should support query, sort, pagination, filters, result count,
  empty state, and product cards.
- Legacy `/pages/search-results-page` and `/pages/search-results` should stop
  rendering the Shopify-managed Searchanise app page body.
- PDP recommendations can continue using the existing Searchanise widget bridge
  and Shopify fallback.

This phase does not rebuild Searchanise indexing, synonyms, merchandising, or
admin configuration. Searchanise remains the search engine; Next owns rendering.

</domain>

<decisions>
## Implementation Decisions

### Search Source

- Use the Searchanise Search API JSON endpoint as the primary data source for
  search results.
- Use the API endpoint that returns extended Search Results Widget data, because
  the route needs product fields, facets, categories/pages if enabled, and
  pagination metadata.
- Keep the existing Shopify predictive search operation available as legacy
  code or a limited fallback, but do not use Searchanise's injected search
  results widget for `/search`.

### UI Ownership

- Render products with Teavision components and design tokens, not `snize-*`
  widget markup.
- Reuse `ProductCard`, `ProductQuickView`, `Section`, `Button`, `Card`, `Select`,
  and collection filter/sort URL patterns where they fit.
- Add Storybook coverage for any new `src/components/search/*` UI components.
- Keep search UI dense and task-focused: result count, filters, sort, grid,
  pagination, and clear empty/error states.

### URL and Routing

- Preserve query state in URL search params so results are shareable and
  browser navigation works.
- Use `q` for the search term and `page` for pagination.
- Use a stable app-level representation for Searchanise filters that can be
  converted to `restrictBy[attribute]` API parameters.
- Redirect legacy `/pages/search-results-page` and `/pages/search-results` URLs
  to `/search`, preserving useful query params where possible.

### Script Isolation

- Keep the Searchanise script loader available for PDP recommendations.
- Prevent Searchanise's Shopify widget script from taking over `/search` and
  legacy search-results page routes.
- Do not render or sanitize the Shopify Page body for the legacy Searchanise
  search-results page.

### Data Safety

- Treat Searchanise responses as `unknown` and narrow them into local types.
- Do not use `any`.
- Do not expose private credentials. The existing Searchanise API key is public,
  but planning docs must not include its value.
- Use HTTPS Searchanise endpoints and bounded `maxResults`.

</decisions>

<canonical_refs>

## Canonical References

### Project Planning

- `.planning/PROJECT.md` - project context and constraints
- `.planning/REQUIREMENTS.md` - SEARCH requirement IDs
- `.planning/ROADMAP.md` - Phase 2 success criteria
- `.planning/codebase/ARCHITECTURE.md` - route/data/component layering
- `.planning/codebase/INTEGRATIONS.md` - Searchanise, Shopify, and env context
- `.planning/codebase/TESTING.md` - verification commands and Storybook rules

### Local App Source

- `docs/conventions.md` - folder map, styling, component, and import rules
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` - App Router pages and route layout guidance
- `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md` - Server Component data fetching and streaming
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` - Cache Components and runtime search param handling
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md` - client leaf URL param behavior
- `src/app/(storefront)/search/page.tsx` - current native Shopify predictive search route
- `src/lib/shopify/operations/search.ts` - current Shopify predictive search operation
- `src/lib/shopify/types/index.ts` - handwritten public product summary types
- `src/components/layout/header/header-search-form.tsx` - current header search form action
- `src/components/collection/collection-filter-panel/collection-filter-panel.tsx` - URL-driven filter UI pattern
- `src/components/collection/sort-select/sort-select.tsx` - URL-driven sort UI pattern
- `src/components/ui/product-card/product-card.tsx` - existing product card presentation
- `src/components/product/searchanise-recommendations/searchanise-script-loader.tsx` - global Searchanise widget loader
- `src/components/product/searchanise-recommendations/searchanise-recommendations.tsx` - PDP recommendation bridge
- `src/app/(storefront)/pages/[...slug]/page.tsx` - Shopify static page catch-all currently rendering the legacy Searchanise page

### Searchanise Documentation

- `https://docs.searchanise.io/api/` - Searchanise API overview
- `https://docs.searchanise.io/search-api/` - Search API endpoints, params, response fields, and errors
- `https://docs.searchanise.io/customizing-the-appearance-of-searchanise-widgets/` - widget customization limits
- `https://docs.searchanise.io/css-customization-of-search-results-widget/` - existing widget DOM/CSS structure, useful only as legacy reference

</canonical_refs>

<specifics>
## Specific Ideas

- Searchanise full results endpoint:
  - `https://searchserverapi1.com/getresults`
  - Params: `apiKey`, `q`, `output=json`, `items=true`, `facets=true`,
    `categories=true`, `pages=true`, `startIndex`, `maxResults`, `sortBy`,
    `sortOrder`, and `restrictBy[attribute]`.
- Suggested page size: 24 products per page.
- Suggested sort mapping:
  - `relevance` -> `sortBy=relevance`
  - `title-asc` -> `sortBy=title&sortOrder=asc`
  - `title-desc` -> `sortBy=title&sortOrder=desc`
  - `price-asc` -> `sortBy=price&sortOrder=asc`
  - `price-desc` -> `sortBy=price&sortOrder=desc`
  - `newest` -> `sortBy=created&sortOrder=desc`
  - `best-selling` -> `sortBy=sales_amount&sortOrder=desc`
- Product mapping should parse product handle from `link` and map product
  fields into `ProductSummary` where possible:
  - `product_id` -> stable ID, converted to Shopify GID when safe
  - `title` -> title
  - `link` -> handle extraction
  - `price` -> `priceRange.minVariantPrice.amount`
  - `image_link` -> `featuredImage.url`
- Product ratings are not guaranteed by Searchanise. Leave ratings undefined
  unless the API response includes a documented custom field later.

</specifics>

<deferred>
## Deferred Ideas

- Autocomplete/dropdown search in the header.
- Search analytics event forwarding beyond Searchanise API usage.
- Searchanise headless merchandising administration.
- Replacing Searchanise with Algolia, Typesense, or Shopify native search.
- Collection-page Searchanise filters. This phase targets site search results.

</deferred>

---

_Phase: 02-searchanise-api-search-results_
_Context gathered: 2026-05-27 via current conversation, docs, and code inspection_
