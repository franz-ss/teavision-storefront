# Phase 24: Sitemap & URL-inventory unblock — Pattern Map

**Mapped:** 2026-07-10  
**Requirements:** SEO-01, SEO-02  
**Source:** `24-RESEARCH.md`, repository code, and installed Next.js 16.2.9 docs  
**Context:** No `CONTEXT.md`; owner approved planning without one.

## Recommended implementation surface

The research supports one narrow implementation surface. The export-specific route registry should live in the new pure helper instead of extending `launch-route-matrix.ts`, because `src/app/sitemap.ts` consumes that matrix and is frozen for this phase.

| File                                          | Action | Role and data flow                                                                                                                                                         | Closest repository analog                                                                                                                 |
| --------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/seo/url-inventory.ts`                | Create | Pure completeness contract: convert static registries plus fetched Shopify/Sanity records into normalized, deduplicated, sorted rows and CSV. No I/O and no `'use cache'`. | `src/lib/seo/launch-route-matrix.ts` for typed route policy; `src/app/sitemap.ts` for source mapping/filter semantics.                    |
| `src/lib/seo/url-inventory.test.ts`           | Create | Unit tests for the finite inventory universe, source counts, filtering, canonical origin, dates, duplicate conflicts, deterministic order, and CSV escaping.               | `src/lib/seo/launch-route-matrix.test.ts` for registry coverage; `src/lib/seo/site-url.test.ts` for canonical-host assertions.            |
| `src/app/api/seo/url-inventory/route.ts`      | Create | Request-time `GET`: flag-first gate, secret validation, authorized source orchestration, fail-closed CSV response, security headers, and metadata-only logging.            | `src/app/api/draft/route.ts` for constant-time auth/status/logging; `src/app/api/health/route.ts` for explicit no-store response headers. |
| `src/app/api/seo/url-inventory/route.test.ts` | Create | Node-environment integration tests for gates, headers, source call order, complete success, upstream failure, and log secrecy.                                             | `src/app/api/draft/route.test.ts` and `src/app/api/webhooks/sanity/route.test.ts`.                                                        |
| `src/lib/env/server.ts`                       | Modify | Add server-only named readers for the export flag and secret.                                                                                                              | Existing `isNoindexModeEnabledFromEnv()` and webhook/API-key readers.                                                                     |
| `.env.example`                                | Modify | Document a disabled-by-default operational flag and blank server-only secret.                                                                                              | Existing launch/rate-limit sections.                                                                                                      |
| `src/lib/observability/logger.ts`             | Modify | Add typed SEO export event names.                                                                                                                                          | Existing draft/webhook event union.                                                                                                       |
| `src/lib/observability/logger.test.ts`        | Modify | Register the new event names in the typed redaction exercise; route tests prove configured/caller secrets never enter calls.                                               | Existing `providerEvents` test.                                                                                                           |
| `package.json`                                | Modify | Add the route test to the explicit `test:integration` list.                                                                                                                | Existing quoted `src/app/api/**/route.test.ts` entries.                                                                                   |

No component, story, GraphQL document/codegen output, CSS, new dependency, or UI file belongs in this phase.

## End-to-end data flow

1. `GET(request)` checks `isSeoUrlExportEnabledFromEnv()` before reading the configured secret or invoking any data source.
2. The route reads a bearer token from `request.headers`, validates configured-secret length, then compares same-length `Buffer` values with `timingSafeEqual`.
3. Only an authorized request invokes the four existing complete-source operations, preferably concurrently: `getAllProducts()`, `getCollectionSummaries(250)`, `getPages()`, and `getBlog(DEFAULT_BLOG_HANDLE)`.
4. A `null` blog or any rejected source fails the whole request; no partial CSV is returned.
5. `buildUrlInventoryRows(...)` adds route-owned rows, filters source records according to the locked contract, builds absolute URLs only through `getSiteUrl()`/`SITE_URL`, removes identical duplicates, rejects conflicting duplicates, and sorts by URL.
6. `serializeUrlInventoryCsv(rows)` returns quoted CRLF CSV.
7. The route returns the attachment with noindex/no-store headers and logs only outcome, reason/source category, total count, and counts by type.

The export must not call `isNoindexModeEnabled()`. Its own flag/secret are the deliberate staging escape hatch.

## Next.js 16 Route Handler constraints

Installed documentation establishes the patterns to reuse:

- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` defines App Router handlers in `route.ts` with Web `Request`/`Response`; ordinary handlers are request-time/not cached by default.
- With Cache Components, a `GET` may prerender only while it avoids runtime data. Accessing `request.headers` stops prerendering, so bearer auth makes this route request-time. Do not add `export const dynamic = 'force-dynamic'`.
- `'use cache'` cannot appear directly inside a Route Handler body. The existing Shopify and Sanity operations already own their cache policy and are safe to call from the request-time handler.
- `sitemap.ts` and `robots.ts` are special handlers cached by default. They are not the pattern for the new authenticated response and must stay untouched.
- The documented 50,000-entry sitemap threshold is irrelevant to this CSV and current catalog size; do not add sharding.

Use the repository's ordinary signature:

```ts
export async function GET(request: Request): Promise<Response> {
  // request.headers access, gates, source orchestration, Response
}
```

## `src/app/api/seo/url-inventory/route.ts`

### Authentication pattern

Copy the security shape from `src/app/api/draft/route.ts`, not its query-string transport or Draft Mode behavior:

```ts
const candidate = Buffer.from(candidateSecret)
const expected = Buffer.from(expectedSecret)

return (
  candidate.length === expected.length && timingSafeEqual(candidate, expected)
)
```

Parse exactly one `Authorization` credential. Accept the `Bearer` scheme case-insensitively, reject a missing token or extra whitespace-separated parts, and never fall back to `request.url` query parameters. The configured secret must be at least 32 characters after the existing `optionalEnv()` trim.

Required gate order and observable behavior:

| Gate                                                         | Status | Source calls                           | Caller-facing body                                    |
| ------------------------------------------------------------ | -----: | -------------------------------------- | ----------------------------------------------------- |
| Flag is absent or not literal `true`                         |    404 | None                                   | Generic not-found JSON.                               |
| Enabled; configured secret absent or shorter than 32         |    500 | None                                   | Generic configuration/unavailable JSON.               |
| Enabled; bearer missing, malformed, wrong length, or unequal |    401 | None                                   | Generic unauthorized JSON.                            |
| Authorized; any Shopify/Sanity source rejects                |    502 | No success/partial serialization       | Generic inventory-unavailable JSON.                   |
| Authorized; canonical blog is `null`                         |    502 | All source promises may have completed | Treat as incomplete upstream data, not an empty blog. |
| Authorized; all sources valid                                |    200 | Each source exactly once               | CSV attachment.                                       |

Use a shared response-header constant/helper so every success and error path has:

```ts
const URL_INVENTORY_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
} as const
```

Success merges:

```ts
{
  ...URL_INVENTORY_HEADERS,
  'Content-Type': 'text/csv; charset=utf-8',
  'Content-Disposition':
    'attachment; filename="teavision-url-inventory.csv"',
}
```

`src/app/api/health/route.ts` demonstrates headers passed directly in the `Response` init. A local `jsonError(error, status)` should also merge the same headers; do not let early returns omit them.

### Source orchestration pattern

Reuse the complete operations as-is:

```ts
const [products, collections, pages, blog] = await Promise.all([
  getAllProducts(),
  getCollectionSummaries(250),
  getPages(),
  getBlog(DEFAULT_BLOG_HANDLE),
])
```

Do not replace these with `getProducts(250)`, `getDefaultBlogListing()`, filesystem route parsing, a Node script, or direct GraphQL/GROQ calls. `getProducts(first)` is intentionally bounded, while `getDefaultBlogListing()` returns a presentation page and separates featured posts; neither proves inventory completeness.

For source-category failure logs without provider payloads, wrap each promise with a small label-aware helper or catch each promise before the outer fail-closed catch. Allowed labels are only `products`, `collections`, `pages`, and `blog`.

### Logging pattern

Add explicit union members such as:

```ts
| 'seo_url_export_completed'
| 'seo_url_export_failed'
| 'seo_url_export_rejected'
```

Follow `logEvent(level, eventName, context)` from the draft/webhook routes. Context may include `reason`, `source`, `totalCount`, and aggregate `countsByType`. Never include the authorization header, either secret, request URL, CSV, an individual URL/handle, or raw Shopify/Sanity values. `src/lib/observability/redact.ts` is defense in depth, not permission to log sensitive input.

## `src/lib/env/server.ts` and `.env.example`

`src/lib/env/server.ts` already imports `optionalEnv` and `truthyEnv` and begins with `import 'server-only'`. Extend that file rather than reading `process.env` in the route:

```ts
export function isSeoUrlExportEnabledFromEnv(): boolean {
  return truthyEnv('SEO_URL_EXPORT_ENABLED')
}

export function getSeoUrlExportSecret(): string | undefined {
  return optionalEnv('SEO_URL_EXPORT_SECRET')
}
```

`truthyEnv()` is strict (`optionalEnv(name) === 'true'`), so `TRUE`, `1`, and `yes` remain disabled and should be integration-test cases.

Add a nearby operational block to `.env.example`:

```dotenv
# Temporary SEO URL inventory export — server-only and disabled by default.
# Set a random 32+ character secret only during the approved handoff window.
SEO_URL_EXPORT_ENABLED=false
SEO_URL_EXPORT_SECRET=
```

Do not use a `NEXT_PUBLIC_` name. Do not add a real/example secret that might be copied into production. The route should distinguish disabled, misconfigured, and unauthorized states; the env reader should not enforce length itself.

## `src/lib/seo/url-inventory.ts`

### Responsibility boundary and signatures

This file belongs under `src/lib/seo/` per `docs/conventions.md`: it is a pure SEO helper, not a data operation. Keep data fetching in the Route Handler. A useful API is:

```ts
export type UrlInventoryRow = {
  url: string
  type:
    | 'static'
    | 'legal'
    | 'page'
    | 'product'
    | 'collection'
    | 'blog'
    | 'article'
  lastModified: string
  shouldAppearInSitemap: boolean
  shouldIndexWhenEnabled: boolean
}

export type UrlInventorySources = {
  products: readonly ProductSummary[]
  collections: readonly CollectionSummary[]
  pages: readonly ShopifyPageSummary[]
  blog: BlogIndex
}

export function buildUrlInventoryRows(
  sources: UrlInventorySources,
): UrlInventoryRow[]

export function serializeUrlInventoryCsv(
  rows: readonly UrlInventoryRow[],
): string
```

Import hand-written Shopify types through `@/lib/shopify/types`; never import generated types directly. `ShopifyPageSummary` and `BlogIndex` are exported by their operation modules.

### Route-owned registry pattern

Reuse `getLaunchSeoRouteExpectations()` but select only:

```ts
expectation.expectedStatus === 200 && expectation.shouldAppearInSitemap
```

That automatically excludes redirect rows and `/search`. Identify legal rows with the existing `LEGAL_POLICIES` hrefs; all other selected matrix rows are `static`.

The matrix is demonstrably incomplete for public canonical destinations. Keep an export-specific constant in this helper:

```ts
const ADDITIONAL_ROUTE_OWNED_PATHS = [
  '/collections',
  '/pages/certifications',
  '/pages/download-catalogues',
  '/pages/how-long-does-bulk-tea-last',
] as const
```

These files exist in the route tree and are not currently matrix rows. Treat them as indexable/static inventory rows. Do not parse `src/app` at runtime.

Build a `Set` of every route-owned URL path from the selected matrix rows plus these additions before mapping Shopify pages. Exclude `getPages()` records whose `getPagePath(page.handle)` is in that set so literal app pages win once. Do not copy the private `RESERVED_HANDLES` set from `pages/[...slug]/page.tsx`; it is a static-generation concern and does not include all newer literal routes. A Shopify-backed `/pages/terms-conditions` record remains eligible through `getPages()` and is served by its literal route using the same underlying page data.

### Source mapping patterns

| Type         | Existing signature/helper                                                   | Exact reuse rule                                                                                                                                                                                                                                         |
| ------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static/legal | `getLaunchSeoRouteExpectations(): LaunchSeoRouteExpectation[]`              | Include only status-200 sitemap rows; preserve both policy booleans. Add the four audited gaps above as `static`.                                                                                                                                        |
| Shopify page | `getPages(): Promise<ShopifyPageSummary[]>`; `getPagePath(handle)`          | The operation loops in 250-item requests until `hasNextPage` is false. Exclude route-owned collisions before row creation. Use `updatedAt`.                                                                                                              |
| Product      | `getAllProducts(): Promise<ProductSummary[]>`                               | Internally calls unbounded `fetchProductSummaryPages()`; use `/products/${handle}` and `updatedAt ?? ''`. Do not call bounded `getProducts(first)`.                                                                                                      |
| Collection   | `getCollectionSummaries(250): Promise<CollectionSummary[]>`                 | The `first` argument is per-request page size; internal `while (hasNextPage)` fetches all pages. Use `/collections/${handle}` and `updatedAt`. Do not filter `frontpage` merely because the collection-index UI does.                                    |
| Blog         | `getBlog(DEFAULT_BLOG_HANDLE): Promise<BlogIndex \| null>`; `getBlogPath()` | GROQ already returns all published, slugged articles ordered by `publishedAt desc`. Fail the request when the blog is `null`; include the listing only when `blog.seo.noIndex` is false. `/blogs/teavision-blogs` remains canonical; never emit `/blog`. |
| Article      | `getArticlePath()`; `isLocalCanonicalPath()`                                | Reuse sitemap semantics exactly: include only `!article.seo.noIndex` and `isLocalCanonicalPath(article.seo.canonicalPath, localPath, SITE_URL)`. Use `publishedAt`.                                                                                      |

`isLocalCanonicalPath()` deliberately accepts only no override, the exact local path, or the exact `${SITE_URL}${localPath}`. Do not create a broader canonical-normalization rule in this phase.

Do not emit blog listing page 2+, tag pages, or search results. Page 2+ is currently self-canonical and indexable in `blogs/[blog]/_lib/metadata.ts`, but the research explicitly locks Phase 24 to content entities rather than listing mechanics. Unit tests must make that omission intentional.

### Absolute URL and metadata rules

- Build absolute URLs with `getSiteUrl(path)` or the imported canonical `SITE_URL`; never use `request.url`, `Host`, or `X-Forwarded-Host`.
- `src/lib/seo/site-url.ts` normalizes the Teavision apex origin to `https://www.teavision.com.au`. Test every row's `new URL(row.url).origin`, not only a sample.
- Normalize meaningful source dates with `new Date(value).toISOString()`. Use `''` when a source has no meaningful date; do not invent request time. A malformed non-empty source date should fail assembly rather than silently produce bad CSV.
- Preserve matrix booleans. For the additional static paths and included dynamic canonical entities, use `shouldAppearInSitemap: true` and `shouldIndexWhenEnabled: true`; noindex/external-canonical content is excluded before rows are made.
- For the blog listing, reuse the latest eligible article's publication date when available, as `sitemap.ts` does; otherwise use `''`.

### Deduplication, sorting, and CSV pattern

Normalize the absolute URL before using it as the `Map` key. When a duplicate has identical non-URL metadata, keep one. When any non-URL field conflicts, throw; silent winner selection can make the consultant's worksheet misleading.

Sort after deduplication with a code-point comparator, not source order:

```ts
rows.sort((left, right) =>
  left.url < right.url ? -1 : left.url > right.url ? 1 : 0,
)
```

The exact CSV schema is:

```text
url,type,lastModified,shouldAppearInSitemap,shouldIndexWhenEnabled
```

Quote every field, replace each `"` with `""`, stringify booleans as `true`/`false`, join records with `\r\n`, and terminate the file with `\r\n`. No CSV dependency is needed.

## Test patterns

### `src/lib/seo/url-inventory.test.ts`

Follow the table-driven, registry-oriented style in `launch-route-matrix.test.ts` and the exact-origin checks in `site-url.test.ts`. Minimum contract cases:

- Required route-owned representatives: `/`, `/collections`, `/pages/privacy-policy`, `/pages/certifications`, `/pages/download-catalogues`, and `/pages/how-long-does-bulk-tea-last`.
- One non-colliding Shopify page plus one colliding literal handle; only the non-colliding page becomes type `page`.
- First and last product/collection fixtures become rows, proving caller inputs are not truncated.
- Blog listing plus eligible article; noindex and external/different-local-canonical articles are absent; exact local absolute/path overrides remain eligible.
- `/blog`, account, cart, API, search, blog tag/search/pagination, redirect alias, and collection category URLs are absent.
- Exact counts by type and total, unique URL count, lexical order, exact canonical production origin, and absence of the synthetic request/staging host.
- Dates normalize to ISO; missing dates serialize as an empty quoted field.
- Identical duplicates collapse; conflicting duplicates throw.
- CSV header/order, embedded comma/newline/quote escaping, boolean formatting, CRLF-only line endings, and deterministic repeated output.

The unit suite already auto-discovers this file. `test:unit` excludes only cart actions and `src/app/api/**/*.test.ts`, so no package-script change is needed for the helper test.

### `src/app/api/seo/url-inventory/route.test.ts`

Use `vi.hoisted()` factories and top-level `vi.mock()` declarations as in the draft and webhook route tests. Mock:

- `@/lib/env/server` readers;
- `getAllProducts`, `getCollectionSummaries`, `getPages`, and `getBlog`;
- `buildUrlInventoryRows`/`serializeUrlInventoryCsv` where an HTTP-only test does not need real mapping;
- `logEvent`.

Reset all mocks and establish valid defaults in `beforeEach()`. Build requests with a deliberately noncanonical host, for example:

```ts
new Request('https://phase24-preview.vercel.app/api/seo/url-inventory', {
  headers: { Authorization: `Bearer ${VALID_SECRET}` },
})
```

Required integration assertions:

- Missing/`false`/`TRUE` flag gives 404 and does not read the secret or call sources.
- Missing/short configured secret gives 500 and does not call sources.
- Missing/malformed/extra-part/wrong-length/same-length-wrong bearer gives 401 and does not call sources.
- Valid bearer calls each complete operation exactly once, passes `250` to collections, returns 200, attachment/content-type, `X-Robots-Tag`, and private no-store.
- Every error status also carries both security headers.
- A rejected source and a `null` blog return 502 and never return the CSV body/content type.
- The successful payload contains only canonical-host rows; the request host is absent.
- Serialized `logEvent` mock calls contain neither the configured secret nor caller-supplied values and never contain an authorization header or CSV body.

Where the test needs a typed mocked operation, prefer `vi.mocked(operation)` or the repository's `Mock<(...) => Promise<...>>` narrowing; do not use `any`.

### `package.json`

`test:integration` is an explicit Vitest file list, while `test:unit` excludes all API tests. Add this quoted entry next to the other API route tests:

```text
"src/app/api/seo/url-inventory/route.test.ts"
```

Without that edit the focused test can pass while `pnpm test:integration` silently omits it.

## Frozen noindex contract

These files are read-only for Phase 24:

- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/seo/noindex.ts`
- `scripts/component-contracts/noindex-mode.test.mjs`

Preserve the exact source-level sitemap guard:

```ts
if (isNoindexModeEnabled()) {
  return []
}
```

Do not reformat, move, or abstract it. `robots.ts` must continue omitting the sitemap line in noindex mode and keep `/api/` disallowed. The new API response's `X-Robots-Tag` is additional defense, not a replacement.

Also consume, but do not modify, `src/lib/seo/launch-route-matrix.ts` in the narrow implementation. Adding the four gaps to that shared registry would change enabled-sitemap output through `sitemap.ts`; Phase 24 does not need that coupling.

The unchanged contract must continue to pass via `pnpm test:contracts`. The export route must still work with `DISABLE_INDEXING=true` when its own flag and secret pass.

## Patterns to avoid

- Query-string secrets or secret compatibility modes.
- Reading raw `process.env` in the route, using `NEXT_PUBLIC_` export settings, or tying the export to `DISABLE_INDEXING`.
- Using the request/staging origin to construct rows.
- Returning partial success after any required source fails.
- Using bounded product/blog listing operations as inventory sources.
- Runtime filesystem route discovery.
- Broadening Sanity canonical filtering beyond `isLocalCanonicalPath()`.
- Emitting private, parameterized, search/filter, redirect-source, or pagination URLs.
- Editing the four frozen noindex files or extending the shared route matrix in this narrow phase.
- Logging request URLs, auth headers, secrets, CSV, individual URLs, or provider payloads.
- Adding a CSV/runtime dependency, Storybook story, UI, or GraphQL codegen change.

## Verification hooks for the planner

Targeted checks should use the repository's existing commands and file locations:

```powershell
pnpm exec vitest run --environment node src/lib/seo/url-inventory.test.ts
pnpm exec vitest run --environment node src/app/api/seo/url-inventory/route.test.ts
pnpm test:contracts
```

Final verification should include `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm test:integration`, `pnpm test:contracts`, and `pnpm build`. No real Shopify checkout/payment/shipping/tax/order flow is relevant or authorized for this phase.
