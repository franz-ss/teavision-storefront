# Phase 2: Searchanise API Search Results - Research

**Researched:** 2026-05-27
**Status:** Complete
**Mode:** codex-inline

## Summary

Searchanise supports a JSON Search API that can power a headless search results
page. The current bad render happens because `/pages/search-results-page` is a
legacy Shopify Page containing Searchanise widget script/style/skeleton markup,
while the Next storefront also renders that Shopify Page through the generic
static-page template. The right headless path is to stop rendering that Shopify
Page body and use Searchanise as a data source instead of a DOM owner.

## External Findings

### Searchanise API

Official docs:

- `https://docs.searchanise.io/api/`
- `https://docs.searchanise.io/search-api/`

Relevant findings:

- Searchanise exposes REST endpoints for search results.
- `/search` returns minimal IDs.
- `/getwidgets` returns extended data for instant-search style results.
- `/getresults` returns extended data for the full Search Results Widget use
  case, including products, categories, pages, facets, and pagination metadata.
- Supported request parameters include `apiKey`, `output=json`, `q`,
  `items`, `suggestions`, `categories`, `pages`, `facets`, `restrictBy[...]`,
  `sortBy`, `sortOrder`, `startIndex`, and `maxResults`.
- Filters are represented through `facets`, with buckets for select/range/slider
  values. Applied filters can be sent back through `restrictBy[attribute]`.
- Product response fields include product ID, title, description, link, price,
  list price, quantity, product code, and image link when using the extended
  endpoints.
- Possible errors include missing/invalid API key, unimported data, disabled or
  suspended engine, invalid query/sort attributes, and index/system errors.

### Widget Customization Limits

Official docs:

- `https://docs.searchanise.io/customizing-the-appearance-of-searchanise-widgets/`
- `https://docs.searchanise.io/css-customization-of-search-results-widget/`

Relevant findings:

- Searchanise's admin UI and custom CSS can alter widget appearance.
- That path still depends on Searchanise's DOM structure and `snize-*` classes.
- Deep structural changes and custom interactions are documented as support-level
  or custom-code concerns.
- For full ownership of layout, semantics, component composition, and styling,
  the JSON Search API is a better fit than the widget.

## Local Code Findings

### Current Search Route

- `src/app/(storefront)/search/page.tsx` currently reads `searchParams` as a
  Promise, fetches native Shopify predictive search through `searchProducts(q)`,
  and renders a simple product grid.
- Metadata marks `/search` as `robots: { index: false }`.
- The current route has no facets, pagination, category/page results, or
  Searchanise ranking.

### Current Header Search

- `src/components/layout/header/header-search-form.tsx` submits to `/search`
  with `name="q"`, so the header can continue working unchanged.
- `src/components/layout/header/header-search.tsx` reads `q` from
  `useSearchParams()` and is already wrapped in `Suspense` by the header.

### Legacy Searchanise Page

- The Shopify Page handle `search-results-page` contains Searchanise app markup,
  not editorial content.
- The body begins with a warning not to edit the page, a Searchanise init script,
  and a `snize_results` mount plus skeleton HTML.
- `sanitizeShopifyPageBodyHtml()` strips scripts/styles/classes/ids, which leaves
  empty markup and list bullets when the generic static-page renderer displays
  that body.
- Because the storefront layout also loads Searchanise globally when enabled,
  Searchanise injects its own results above the generic static page hero.

### Current Searchanise Loader

- `src/app/(storefront)/layout.tsx` loads `SearchaniseScriptLoader` globally when
  `NEXT_PUBLIC_SEARCHANISE_ENABLED=true` and `NEXT_PUBLIC_SEARCHANISE_API_KEY`
  is set.
- The loader exists for PDP recommendations. The phase should keep PDP
  recommendations working while skipping global widget control on `/search` and
  legacy search-results page URLs.

### Existing UI Patterns

- Collection pages already have URL-driven sort and filter patterns using
  `useRouter`, `usePathname`, and `useSearchParams`.
- `CollectionFilterPanel` and `SortSelect` demonstrate the local expectations
  for filter controls, clear actions, and no-scroll URL replacement.
- `ProductCard` takes `ProductSummary`, which is a good target shape for mapped
  Searchanise product data.
- New component files under `src/components/` need co-located Storybook stories.

### Next.js 16 Notes

- Server Components can fetch async data directly.
- Runtime data such as `searchParams` should be handled inside Suspense
  boundaries when Cache Components are enabled.
- Query-param client leaves using `useSearchParams()` must be wrapped in
  Suspense for production builds.
- Search results should be request-time data, not cached with `use cache`.

## Recommended Approach

1. Add a Searchanise data module under `src/lib/searchanise/` with local types,
   URL building, `unknown` response narrowing, and mapping to `ProductSummary`.
2. Replace `/search` with a Searchanise-backed route that reads URL params,
   fetches Searchanise data server-side, and renders owned UI.
3. Add search-specific UI components under `src/components/search/` with
   Storybook stories.
4. Add explicit legacy redirect routes for `/pages/search-results-page` and
   `/pages/search-results`, preserving useful query params.
5. Update the Searchanise script loader to skip `/search` and legacy
   search-results routes while keeping PDP recommendations available.

## Risks and Mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Searchanise response includes unexpected custom fields or malformed values | Narrow from `unknown`; drop invalid products/facets; render error/empty states safely |
| Filter URL encoding becomes hard to maintain | Centralize parse/build helpers and acceptance-check common filter/sort/page cases |
| Searchanise widget script still injects UI into `/search` | Skip loader by pathname and verify in browser that no `snize-search-results` output appears |
| PDP recommendations regress | Verify a PDP with Searchanise enabled and disabled/fallback behavior |
| Searchanise API key missing in local env | Build route to show setup/unavailable state only when a search fetch is attempted; do not expose secrets |

## Open Questions for Execution

- Confirm whether Teavision wants category/page results visible in the first
  version or fetched but hidden. The plan includes data support and leaves
  rendering as compact secondary sections.
- Confirm final filter URL naming. The plan recommends a stable app-level filter
  representation converted into Searchanise `restrictBy[...]` parameters.

## RESEARCH COMPLETE
