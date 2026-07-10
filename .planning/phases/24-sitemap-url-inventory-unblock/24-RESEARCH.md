# Phase 24: Sitemap & URL-inventory unblock — Research

**Researched:** 2026-07-10  
**Status:** Ready for planning  
**Requirements:** SEO-01, SEO-02  
**Context:** No `CONTEXT.md`; the owner chose to proceed from the roadmap and requirements without a discuss-phase lock.

## Research Question

What does Phase 24 need to implement so the SEO consultant can download a complete canonical-production-host CSV inventory while staging remains noindex and the existing `sitemap.ts` / `robots.ts` noindex contract remains unchanged?

## Executive Summary

Build a request-time `GET` Route Handler at
`src/app/api/seo/url-inventory/route.ts`. It must require both
`SEO_URL_EXPORT_ENABLED=true` and a strong `SEO_URL_EXPORT_SECRET`, fetch
published route data through the existing Next-runtime operations, emit a
deterministic CSV of canonical `https://www.teavision.com.au` URLs, and attach
`X-Robots-Tag: noindex, nofollow` plus `Cache-Control: private, no-store` to
every response.

Model authentication, constant-time comparison, metadata-only logging, and
error responses on `src/app/api/draft/route.ts`, but prefer an
`Authorization: Bearer <secret>` header over a query-string secret. Query
secrets are convenient but can be retained in browser history, copied URLs,
proxy/access logs, and referrers. A consultant can still download the file with
one `curl` command. If the implementation intentionally retains query-secret
compatibility, it must document that exposure and add `Referrer-Policy:
no-referrer`; header-only authorization is the safer default.

Do not decouple `sitemap.ts` from `DISABLE_INDEXING`, do not change
`robots.ts`, and do not make the export depend on `isNoindexModeEnabled()`.
The route is the deliberately separate escape hatch: it works while staging is
noindex, but only when its own flag and secret both pass.

The most important correction to the milestone-level research is completeness.
The existing sitemap inputs cover products, collections, the canonical blog,
eligible articles, and the launch SEO matrix, but the matrix is not a complete
registry of public storefront pages. The route tree also contains
`/collections`, route-owned pages such as `/pages/download-catalogues` and
`/pages/how-long-does-bulk-tea-last`, and Shopify-backed pages returned by
`getPages()`. A plan that merely copies `sitemap.ts` will be secure but does not
yet prove SEO-01. The plan must define the finite inventory universe explicitly
and test every source category.

## Scope Reconciliation

The current v1.7 `REQUIREMENTS.md` and `ROADMAP.md` supersede stale parts of
`.planning/research/SUMMARY.md`:

- Phase 24 is only the secret/flag-gated URL inventory.
- The `/blog` canonical migration was declined and is out of scope;
  `/blogs/teavision-blogs` remains canonical.
- Heading work is Phase 25, and server-render-shell work is Phase 26.
- Claims in the summary that Phase 24 feeds an app-owned `/blog` phase are no
  longer actionable. The CSV still unblocks the consultant's external redirect
  worksheet.
- Existing noindex behavior is frozen. “Unchanged” means the exact
  `if (isNoindexModeEnabled()) { return [] }` sitemap guard, robots behavior,
  and their committed regression tests continue to pass.

## Inputs Read

- `AGENTS.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/research/SUMMARY.md`
- `.planning/research/SITEMAP-INVENTORY.md`
- `.planning/research/URL-MIGRATION.md`
- `.planning/research/STACK.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`
- `docs/conventions.md`
- `docs/launch/seo-url-parity-register.md`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `scripts/component-contracts/noindex-mode.test.mjs`
- `src/app/api/draft/route.ts` and `route.test.ts`
- all current `src/app/(storefront)/**/{page,route}.tsx?` entry points
- `src/lib/seo/site-url.ts`
- `src/lib/seo/launch-route-matrix.ts` and its tests
- `src/lib/seo/noindex.ts`
- `src/lib/env/read.ts` and `src/lib/env/server.ts`
- `src/lib/observability/logger.ts`, `redact.ts`, and logger tests
- `src/lib/shopify/operations/product.ts`
- `src/lib/shopify/operations/collection.ts`
- `src/lib/shopify/operations/storefront-page.ts`
- `src/lib/blog/operations.ts`
- `src/lib/sanity/queries/blog.ts`
- `.env.example`
- `package.json`
- installed Next 16.2.9 docs:
  - `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md`

## Next.js 16 Findings

The installed fork's docs establish these implementation constraints:

- App Router Route Handlers use Web `Request` / `Response` and live in a
  `route.ts` file. `GET` is appropriate for a downloadable CSV.
- Ordinary Route Handlers are not cached by default. With Cache Components,
  they may be prerendered only if they avoid request-time and uncached data.
  Reading `request.headers` (or `request.url`) makes this handler request-time.
  No `dynamic = 'force-dynamic'` workaround is needed.
- A `'use cache'` directive cannot be placed directly in the Route Handler
  body. Calling the repository's already-cached Shopify/Sanity operations from
  the handler is supported and is the correct pattern.
- `sitemap.ts` and `robots.ts` are special Route Handlers cached by default.
  Their current non-request-time behavior and the noindex gate should remain
  untouched.
- The local sitemap docs confirm the 50,000-URL sitemap threshold. The present
  catalog is far below it, so sharding is not Phase 24 work.

## Existing Security And Environment Patterns

### Closest analog

`src/app/api/draft/route.ts` is the closest route-handler analog:

- server-only secret reader;
- minimum 32-character secret;
- same-length `Buffer` values passed to `timingSafeEqual`;
- explicit 500 for missing/misconfigured server secret;
- explicit 401 for invalid caller secret;
- structured `logEvent()` calls that never include the secret;
- integration tests that prove both behavior and log redaction.

Phase 24 should copy this security shape, not its Draft Mode behavior.

### Recommended gate order and statuses

1. If `SEO_URL_EXPORT_ENABLED` is anything except the literal string `true`,
   return 404 and do not read/fetch inventory data. This conceals a disabled
   temporary surface and proves the flag is independently required.
2. If enabled but `SEO_URL_EXPORT_SECRET` is missing or shorter than 32
   characters, return 500 without fetching data.
3. If the supplied bearer secret is missing or invalid, return 401 without
   fetching data.
4. Only after both gates pass may Shopify/Sanity operations run.
5. If any required upstream fails, return one non-CSV 502/500 response; never
   issue a partial inventory that looks complete.

Use `truthyEnv('SEO_URL_EXPORT_ENABLED')` and `optionalEnv`/`requiredEnv` through
new named functions in `src/lib/env/server.ts`; do not read raw `process.env`
throughout the route.

### Response-wide security headers

Apply these to success and error responses from the route:

- `X-Robots-Tag: noindex, nofollow`
- `Cache-Control: private, no-store, max-age=0`

On the successful CSV also set:

- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename="teavision-url-inventory.csv"`

`/api/` is already unconditionally disallowed by `src/app/robots.ts`, but that
is defense-in-depth, not a substitute for the explicit response header. Do not
add the export URL to any navigation, sitemap, metadata, or feed.

If logging is added, extend `ObservabilityEventName` with explicit SEO export
events and log only outcome/reason/counts. Never log the authorization header,
secret, raw request URL, CSV body, Shopify/Sanity payloads, or individual URLs.

## Inventory Universe: The Definition The Plan Must Lock

“All routes” cannot mean every syntactically addressable App Router URL:
search/filter query combinations are unbounded, account/order/address IDs are
private, redirect aliases are non-canonical, and collection category paths
canonicalize to their parent collection. For SEO-01, use this finite contract:

> Every public content URL that is a canonical destination on the production
> host and is relevant to migration/redirect mapping, with enough metadata for
> the consultant to distinguish source type and indexability.

Recommended included sources:

1. **Route-owned static/legal pages** — all `expectedStatus === 200` and
   `shouldAppearInSitemap === true` rows from
   `getLaunchSeoRouteExpectations()`, retaining
   `shouldIndexWhenEnabled`/`shouldAppearInSitemap` as CSV metadata.
2. **Audited public route-owned gaps** — at minimum `/collections`,
   `/pages/certifications`, `/pages/download-catalogues`, and
   `/pages/how-long-does-bulk-tea-last` unless they are first added to the
   shared launch route registry. The route tree proves these canonical public
   pages exist, while the current matrix does not list them.
3. **Shopify-backed pages** — `getPages()` from
   `src/lib/shopify/operations/storefront-page.ts`, mapped with `getPagePath()`.
   It paginates in 250-item pages until `hasNextPage` is false. Deduplicate
   handles that are served by route-owned literal pages.
4. **Products** — every row from `getAllProducts()`. Its internal
   `fetchProductSummaryPages()` paginates until Shopify reports no next page.
5. **Collections** — every row from `getCollectionSummaries(250)`. Despite the
   argument name, it also loops through all pages; 250 is the per-request page
   size, not a total cap.
6. **Blog listing and articles** — `getBlog(DEFAULT_BLOG_HANDLE)`,
   `getBlogPath()`, and `getArticlePath()`. Preserve the current sitemap's
   article rule: exclude `article.seo.noIndex` and articles whose canonical is
   external or a different local path (`isLocalCanonicalPath`). Keep
   `/blogs/teavision-blogs`; `/blog` is explicitly out of scope.

Recommended exclusions, documented in code/tests rather than left implicit:

- `/api/**`, Atom feed, checkout handoff, OAuth callbacks, and other Route
  Handlers;
- `/account/**`, order/address parameter routes, and `/cart`;
- redirects and legacy aliases (they are source URLs, not canonical
  destinations);
- `/search`, blog search, filter query combinations, and other intentionally
  noindex discovery pages unless the consultant explicitly wants a second
  noncanonical/noindex worksheet;
- collection category/filter/pagination variants that canonicalize to the base
  collection;
- blog tag/search variants that are explicitly noindex;
- externally canonicalized or noindex Sanity articles.

Blog listing page 2+ is a nuance: it has a finite, self-canonical route and is
not explicitly noindex, but the current sitemap omits it. The minimal Phase 24
interpretation is to export canonical content entities (listing + articles),
not pagination mechanics. Record this exclusion in the contract test so it is
intentional. Expanding pagination is a separate sitemap/indexation decision.

### Why the earlier source list is insufficient by itself

`.planning/research/SITEMAP-INVENTORY.md` recommends only the four sources used
by `sitemap.ts`. That accurately recreates the enabled sitemap, but the current
filesystem audit shows it is not a complete public-route inventory. In
particular, the launch route matrix omits the `/collections` index and several
public `/pages/*` routes, while the catch-all page route is backed by
`getPages()`. The plan must either:

- extend the shared canonical route registry and use it from the export; or
- add an export-specific, tested set of the missing route-owned paths plus
  `getPages()`.

Prefer the first when it can be done without changing sitemap/noindex behavior;
otherwise use the second to keep Phase 24 narrow. Do not parse the filesystem
at runtime and do not import `'use cache'` operations into a bare Node script.

## Data Model And CSV Contract

Use a typed internal row such as:

```ts
type UrlInventoryRow = {
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
```

Recommended CSV header:

```text
url,type,lastModified,shouldAppearInSitemap,shouldIndexWhenEnabled
```

Implementation rules:

- Build every absolute URL from `SITE_URL`/`getSiteUrl()`, never
  `request.url`, `Host`, or `X-Forwarded-Host`. The request may arrive on a
  Vercel/staging hostname, but the CSV must contain the production canonical
  origin.
- The staging deployment must leave `SITE_URL` at the canonical production
  origin; smoke verification must assert every parsed row has origin
  `https://www.teavision.com.au`.
- Normalize dates to ISO strings; use an empty field where no meaningful
  source date exists rather than inventing freshness. Reusing the sitemap's
  stale `STATIC_LAST_MODIFIED` is acceptable for parity but not evidence of an
  actual page edit date.
- Quote/escape every CSV field (double embedded quotes), use CRLF row endings,
  and produce a deterministic lexical URL order.
- Deduplicate by normalized absolute URL. Throw on conflicting duplicate row
  metadata rather than silently choosing a winner.
- A successful empty/implausibly partial response must not pass unnoticed.
  Tests should assert source-to-row counts and the required static paths.
- No new npm production dependency is needed; a small serializer is sufficient.

Keep pure row normalization, deduplication, sorting, and CSV serialization in a
small named helper (for example `src/lib/seo/url-inventory.ts`) so unit tests do
not need to exercise the HTTP boundary for every edge case. Data fetching stays
in the Route Handler or a server-only operation, consistent with
`docs/conventions.md`.

## Failure And Lifecycle Behavior

- Missing Shopify credentials already fail fast through `shopifyFetch()`; do
  not substitute fixture/stub data in production.
- A required Sanity blog returning `null` should be treated as an incomplete
  export and fail the request, not silently omit the journal.
- Log upstream failure by source category only. Do not expose provider details
  or secrets to the caller.
- The route is temporary operational tooling. `SEO_URL_EXPORT_ENABLED=false`
  should be the normal default in `.env.example`; enable it only for the
  approved handoff window, rotate/remove the secret after delivery, then
  disable the flag.
- No real Shopify checkout, payment, shipping, tax, order creation, or hosted
  redirect testing is needed or allowed for this phase.

## Concrete File Plan

### New files

- `src/app/api/seo/url-inventory/route.ts`
  - flag/secret gate, source orchestration, fail-closed response, headers.
- `src/app/api/seo/url-inventory/route.test.ts`
  - Node-environment Route Handler integration tests.
- `src/lib/seo/url-inventory.ts`
  - typed pure row assembly/normalization and CSV serialization (recommended).
- `src/lib/seo/url-inventory.test.ts`
  - source-completeness, dedupe, sort, canonical-host, and CSV escaping tests.

### Existing files likely changed

- `src/lib/env/server.ts`
  - named readers for `SEO_URL_EXPORT_ENABLED` and `SEO_URL_EXPORT_SECRET`.
- `.env.example`
  - disabled-by-default flag and blank server-only secret with 32+ character
    guidance.
- `src/lib/observability/logger.ts`
  - add typed SEO export event names if route logging is implemented.
- `src/lib/observability/logger.test.ts`
  - include the new event names/redaction behavior if logger union changes.
- `package.json`
  - add the new `src/app/api/.../route.test.ts` to the explicit
    `test:integration` file list. Tests under `src/app/api/**` are excluded from
    `test:unit` and are not auto-discovered by the integration script.

### Read-only/frozen files for this phase

- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/seo/noindex.ts`
- `scripts/component-contracts/noindex-mode.test.mjs`

The noindex contract test must pass unchanged. If a planner chooses to share a
new inventory registry with `sitemap.ts`, preserve the exact source-level guard
and static-coverage assertions; the safer narrow plan is to leave all four
files untouched.

### Existing sources/analogs consumed

- `src/app/api/draft/route.ts`
- `src/lib/seo/site-url.ts`
- `src/lib/seo/launch-route-matrix.ts`
- `src/lib/shopify/operations/product.ts`
- `src/lib/shopify/operations/collection.ts`
- `src/lib/shopify/operations/storefront-page.ts`
- `src/lib/blog/operations.ts`

## Recommended Plan Shape

One implementation plan is sufficient, split into three ordered tasks:

1. **Inventory contract and pure helper (SEO-01):** lock included/excluded
   route categories, implement all-source typed row assembly, canonical-origin
   normalization, dedupe/sort, and CSV serialization with unit tests.
2. **Secure Route Handler (SEO-02):** add env readers, flag-first and
   constant-time secret gates, fail-closed source orchestration, response
   headers, logging, and route integration tests; wire the test into
   `test:integration`.
3. **Noindex/no-regression proof and handoff smoke test:** run the unchanged
   noindex contracts, full static checks/build, then verify disabled, bad-secret,
   and valid-secret behavior against a local/fake or approved staging runtime.
   Record row counts by type and prove every URL uses the canonical production
   origin.

This phase has no UI surface, component, Storybook story, UI-SPEC, GraphQL
schema/codegen change, or new dependency.

## Validation Architecture

### Test levels

| Level         | Target                                              | Purpose                                                                                                                                                                            |
| ------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit          | `src/lib/seo/url-inventory.test.ts`                 | Prove exact source-to-row mapping, required route set, filters, dedupe, ordering, canonical origin, ISO dates, and RFC-style CSV escaping.                                         |
| Integration   | `src/app/api/seo/url-inventory/route.test.ts`       | Prove feature flag + secret gates, source calls only after authorization, response statuses, headers, full CSV, canonical host, fail-closed upstream errors, and secret-free logs. |
| Contract      | `scripts/component-contracts/noindex-mode.test.mjs` | Prove the sitemap still returns `[]` in noindex mode and robots behavior is unchanged.                                                                                             |
| Build/static  | TypeScript, ESLint, Next build                      | Prove the route compiles under Next 16 Cache Components and no environment/API boundary was broken.                                                                                |
| Runtime smoke | Local/fake or approved staging deployment           | Prove actual download semantics, canonical production host, and plausible row counts without exercising checkout.                                                                  |

### Requirement-to-test map

#### SEO-01 — complete canonical-host CSV

- Assert the success fixture contains every required route-owned path.
- Assert one row per mocked Shopify page/product/collection.
- Assert the blog listing and every eligible article are present.
- Assert noindex/external-canonical articles and duplicate literal/Shopify page
  handles are excluded/deduplicated as designed.
- Assert exact counts per `type`, unique URLs, deterministic ordering, valid CSV
  parsing, and production origin for every row.
- Assert the request/staging host never appears in the payload.

#### SEO-02 — flag, secret, noindex, frozen sitemap/robots

- Flag absent/false/`TRUE` => 404, no source calls.
- Flag true + missing/short configured secret => 500, no source calls.
- Flag true + missing/malformed/invalid bearer secret => 401, no source calls.
- Valid same-length secret => 200 and source calls exactly once.
- Secret comparison follows the `timingSafeEqual` same-length pattern.
- Every response carries `X-Robots-Tag` and `Cache-Control: no-store`.
- Success has `text/csv` and attachment headers.
- Upstream rejection => non-200, no partial CSV.
- Captured logger calls contain neither configured nor caller secret.
- Existing noindex contract passes without editing `sitemap.ts`/`robots.ts`.

### Exact verification commands

Targeted during implementation:

```powershell
pnpm exec vitest run --environment node src/lib/seo/url-inventory.test.ts
pnpm exec vitest run --environment node src/app/api/seo/url-inventory/route.test.ts
pnpm test:contracts
```

Final phase verification:

```powershell
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:integration
pnpm test:contracts
pnpm build
```

Runtime smoke (header-only secret recommendation):

```powershell
$env:SEO_URL_EXPORT_ENABLED = 'false'
curl.exe -i http://127.0.0.1:3000/api/seo/url-inventory

$env:SEO_URL_EXPORT_ENABLED = 'true'
$env:SEO_URL_EXPORT_SECRET = '<32-plus-character-secret>'
curl.exe -i -H "Authorization: Bearer wrong" http://127.0.0.1:3000/api/seo/url-inventory
curl.exe -fS -H "Authorization: Bearer $env:SEO_URL_EXPORT_SECRET" -o url-inventory.csv http://127.0.0.1:3000/api/seo/url-inventory
```

For staging, inspect headers and parse the downloaded CSV to assert:

- all URLs are unique;
- every origin is exactly `https://www.teavision.com.au`;
- required static paths are present;
- product, collection, page, and article counts are plausible against the
  source systems;
- `X-Robots-Tag` includes `noindex`;
- `/sitemap.xml` remains empty and `robots.txt` still omits its sitemap line
  while `DISABLE_INDEXING=true`.

Do not commit the downloaded CSV or any real secret.

### Nyquist sampling guidance

The VALIDATION.md generated from this research should identify these minimum
representatives:

- static: `/` and `/collections`;
- legal: `/pages/privacy-policy`;
- route-owned page: `/pages/download-catalogues`;
- Shopify page: one non-reserved `getPages()` handle;
- product: first and last mocked/paginated handle;
- collection: first and last mocked/paginated handle;
- blog: `/blogs/teavision-blogs`;
- article: one eligible, one noindex, and one external-canonical fixture;
- negative routes: account, cart, search, redirect alias, collection category,
  and API route are absent according to the locked exclusion contract.

Validation must check both membership and total/source-category counts. Spot
checking a few URLs alone cannot prove completeness.

## Risks And Mitigations

| Risk                                    | Consequence                                                        | Mitigation                                                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Copying only current sitemap sources    | Secure but incomplete consultant worksheet                         | Lock the finite universe, add `getPages()` and audited route-owned gaps, assert category counts.                                             |
| Request host used for URLs              | CSV contains Vercel/staging URLs                                   | Build only through `SITE_URL`/`getSiteUrl`; assert exact production origin.                                                                  |
| Query-string secret                     | Secret leaks through URLs/history/access logs/referrers            | Prefer bearer header; never log request URL/headers; no-store responses.                                                                     |
| Route prerender/cache                   | Authenticated CSV or errors are cached/shared                      | Read request headers, set `private, no-store`; do not force static.                                                                          |
| Partial upstream failure                | Incomplete CSV looks authoritative                                 | `Promise.all`/fail-closed response; never return partial success.                                                                            |
| Duplicate route-owned and Shopify pages | Duplicate worksheet rows or conflicting metadata                   | Normalize/dedupe; throw on conflicts; test reserved/literal overlap.                                                                         |
| Sanity canonical override               | External/nonlocal URL incorrectly presented as Teavision canonical | Reuse `isLocalCanonicalPath` and noindex filters.                                                                                            |
| Future drift between sitemap and export | Consultant inventory becomes stale                                 | Reuse the same operations/path helpers and add source-category contract tests; consider a shared registry without touching noindex behavior. |
| Logging disclosure                      | Export secret or inventory enters runtime logs                     | Metadata-only typed events; explicit tests against caller/configured secret.                                                                 |
| Accidental indexing regression          | Staging URLs become discoverable/indexable                         | Leave frozen files unchanged; route under `/api`; explicit `X-Robots-Tag`; run noindex contracts.                                            |

## Planning Decisions Recommended

- Use one phase plan; no discuss-phase context is required to proceed.
- Use `GET` plus bearer-header secret, flag-first 404 behavior, and a 32-character
  minimum secret.
- Keep the export response uncached and attachment-oriented.
- Treat completeness as canonical public content destinations relevant to the
  migration worksheet, not every possible/private/parameterized route.
- Add `getPages()` and an explicit audited set of route-owned public paths; the
  current launch matrix alone is not complete.
- Keep sitemap/robots/noindex source and behavior unchanged.
- Fail closed on any required data-source error or missing canonical blog.
- Do not add JSON mode, UI, public links, rate-limit infrastructure, sitemap
  sharding, `/blog` migration, or checkout coverage in this phase.

## Research Complete

Phase 24 is ready for planning. The implementation is small, but SEO-01 must be
planned as a completeness contract rather than merely “return the same rows as
today's sitemap.” SEO-02 is a conventional, well-supported Route Handler gate
with strong existing repository analogs and a clear noindex regression suite.
