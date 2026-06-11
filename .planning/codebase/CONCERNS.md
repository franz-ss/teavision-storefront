# Codebase Concerns

**Analysis Date:** 2026-06-11

## Tech Debt

**Contact and lead-capture actions are concentrated in one large Server Actions module:**
- Issue: `src/lib/contact/actions.ts` handles contact enquiries, custom tea blends, wholesale accounts, NPD orders, newsletter signup, rate-limit checks, validation, formatting, and Resend transport in a single 660-line file.
- Files: `src/lib/contact/actions.ts`, `src/lib/contact/custom-tea-blend.ts`, `src/lib/contact/wholesale-account.ts`, `src/lib/contact/npd-order.ts`
- Impact: Adding a new lead-capture form requires editing a high-churn shared module. Validation and email formatting patterns can drift because form-specific code is separated only by function naming.
- Fix approach: Keep shared primitives in `src/lib/contact/actions.ts` only for transport, rate limiting, and common result helpers. Move each form workflow to a focused module such as `src/lib/contact/contact-action.ts`, `src/lib/contact/wholesale-account-action.ts`, and `src/lib/contact/npd-order-action.ts`, with tests next to each workflow.

**Product operations mix Shopify queries, legacy adapters, parsing, enrichment, and cache policy:**
- Issue: `src/lib/shopify/operations/product.ts` owns generated query calls, product reshaping, variant pagination, metafield bulk-tier parsing, HulkApps fallback parsing, legacy `/products/{handle}.js` inventory lookup, and cache lifetimes.
- Files: `src/lib/shopify/operations/product.ts`
- Impact: Product-detail changes are risky because unrelated concerns share the same module. Legacy enrichment can affect core PDP fetch behavior and cache duration.
- Fix approach: Keep public operations in `src/lib/shopify/operations/product.ts`, but extract adapters into focused modules such as `src/lib/shopify/operations/product-bulk-pricing.ts`, `src/lib/shopify/operations/product-inventory.ts`, and `src/lib/shopify/operations/product-mappers.ts`.

**Collection page helpers rely on custom HTML and filter parsing:**
- Issue: `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts` parses Shopify collection HTML with regexes, rebuilds category path segments from Shopify tag filters, and serializes filter inputs manually.
- Files: `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts`, `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`
- Impact: Changes to legacy collection HTML shape, tag naming, or Shopify filter input structure can break category routes, rich hero extraction, and filter links without TypeScript catching it.
- Fix approach: Prefer structured Shopify metafields for rich hero/category metadata. Keep HTML parsing as a compatibility adapter with explicit fixture tests in `src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts`.

**Test scripts use explicit file whitelists:**
- Issue: `package.json` enumerates individual files in `test:unit` and `test:integration` rather than globbing all eligible tests.
- Files: `package.json`, `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx`, `src/components/collection/toolbar.test.tsx`, `src/lib/blog/operations.test.ts`, `src/lib/sanity/queries/blog.test.ts`
- Impact: New `*.test.*` files can be committed but not run by the standard test scripts unless the script is manually updated.
- Fix approach: Replace whitelists with domain globs or split tests by marker/path convention. Keep the Shopify checkout e2e restriction, but run all unit-safe `src/**/*.test.*` and `tests/setup/**/*.test.*` files automatically.

## Known Bugs

**Collection category routes depend on the first uncategorized product page to discover category tags:**
- Symptoms: `PageContent` first fetches unfiltered products, then calls `findCategoryTagForPath()` with only `initialProductsResult.filters` and `initialProductsResult.products`. If Shopify filters do not include category tags and the first 24 products do not contain a requested category tag, the route can 404 even if later products in the collection match.
- Files: `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`, `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts`
- Trigger: Visit `/collections/[handle]/[category]` for a category represented only outside the first returned product page when Shopify does not expose the category tag in filters.
- Workaround: Ensure category tags appear in Shopify filter values or keep a representative product in the first collection page.

**Unknown Shopify webhook topics are accepted without visibility:**
- Symptoms: The Shopify webhook route returns success for unhandled topics and does not log or record the ignored topic.
- Files: `src/app/api/webhooks/shopify/route.ts`
- Trigger: Shopify sends a topic outside `products/*`, `collections/*`, `collections/products_*`, or `pages/*`, such as inventory, price list, publication, or metafield changes.
- Workaround: Configure only supported webhook topics until ignored-topic logging and topic coverage are expanded.

## Security Considerations

**Production rate limiting is process-local memory only:**
- Risk: Public forms and search suggestions call `checkRateLimit()`, but the implementation always uses the module-level `memoryBuckets` map. Multi-instance, serverless, or restarted deployments reset counters and allow bypass by spreading traffic across instances.
- Files: `src/lib/rate-limit/index.ts`, `src/lib/contact/actions.ts`, `src/app/api/search/suggestions/route.ts`
- Current mitigation: A production warning is emitted unless `RATE_LIMIT_EXTERNAL_PROTECTION=true` or `RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true` is set. Contact forms use honeypot fields and validation before email delivery.
- Recommendations: Add a durable `RateLimitStore` implementation backed by hosting-provider rate limiting, Redis/KV, or another shared store. Make production fail closed when neither external protection nor explicit memory fallback is configured.

**Client IP trust is based on forwarded headers:**
- Risk: `getClientIpFromHeaders()` trusts `x-forwarded-for`, `x-real-ip`, then `cf-connecting-ip`. If the hosting layer does not sanitize these headers, clients can spoof identifiers and bypass rate limits.
- Files: `src/lib/rate-limit/index.ts`, `src/lib/contact/actions.ts`, `src/app/api/search/suggestions/route.ts`
- Current mitigation: Header-derived IPs are used only for rate-limit keys, not authentication.
- Recommendations: Prefer the platform-provided client IP header after confirming proxy behavior. Document the trusted header source in deployment configuration and ignore generic forwarded headers when they are not guaranteed by the edge provider.

**Contact error logs may include provider payloads for user-submitted emails:**
- Risk: Resend error objects and caught exceptions are logged directly for contact, wholesale, NPD, and newsletter submissions.
- Files: `src/lib/contact/actions.ts`
- Current mitigation: Successful submission bodies are emailed but not logged by application code.
- Recommendations: Log structured, redacted fields such as form type, provider status/code, and request correlation ID. Avoid logging raw provider error objects if they can contain recipient, reply-to, or message metadata.

**Rich collection hero HTML bypasses the branded `SanitizedHtml` path:**
- Risk: General Shopify rich text rendering requires the `SanitizedHtml` brand from `src/lib/shopify/html-content.ts`, but collection rich hero intro HTML is a plain string created by `sanitizeInlineHtml()` and rendered with `dangerouslySetInnerHTML`.
- Files: `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts`, `src/app/(storefront)/collections/[handle]/_components/collection-rich-hero.tsx`, `src/lib/shopify/html-content.ts`, `src/components/ui/rich-text/rich-text.tsx`
- Current mitigation: `sanitizeInlineHtml()` strips scripts/styles and allows only `b`, `em`, `i`, and `strong`.
- Recommendations: Return `SanitizedHtml` from the rich-hero sanitizer or render the intro through a structured React representation. Keep all future `dangerouslySetInnerHTML` call sites behind branded sanitizer APIs.

## Performance Bottlenecks

**Cart reads fan out to product-detail enrichment for every unique line handle:**
- Problem: Every cart fetch or mutation reshapes the Shopify cart, then calls `getProduct()` for each unique product handle to merge product-level bulk pricing tiers.
- Files: `src/lib/shopify/operations/cart.ts`, `src/lib/shopify/operations/product.ts`, `src/lib/cart/actions.ts`
- Cause: `reshapeCart()` calls `getProductBulkPricingByHandle()`, which uses `Promise.all()` over cart line handles. `getProduct()` can paginate variants and query legacy inventory/HulkApps fallbacks.
- Improvement path: Add cart-specific bulk-pricing fields to the cart GraphQL query when possible, or create a lighter `getProductBulkPricing(handle)` operation that avoids PDP-only fields, recommendations, analytics inputs, and legacy inventory lookups.

**Sitemap generation fetches the entire product catalog:**
- Problem: `src/app/sitemap.ts` calls `getAllProducts()`, which paginates all Shopify products in 250-item pages before returning sitemap entries.
- Files: `src/app/sitemap.ts`, `src/lib/shopify/operations/product.ts`
- Cause: Sitemap generation uses the same product summary pagination path as storefront data rather than a sitemap-specific query/cache.
- Improvement path: Keep a sitemap-specific operation with only `handle` and `updatedAt`, cache it with an appropriate long-lived tag, and consider sitemap chunking if the catalog grows beyond a few thousand products.

**Collection pages do extra data work for categories and sidebar summaries:**
- Problem: Every collection page fetches collection details, one product page, and all collection summaries in parallel. Category pages then perform a second product query with the active category filter.
- Files: `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`, `src/lib/shopify/operations/collection.ts`
- Cause: Category route resolution first depends on initial unfiltered products/filters, then fetches the active filtered result.
- Improvement path: Resolve category tags from a structured category index or Shopify filter metadata without fetching products first. Cache sidebar collection summaries separately from the page request path.

**Search suggestions proxy every eligible keystroke to Searchanise:**
- Problem: Header autocomplete debounces to 180ms and the route calls Searchanise with `cache: 'no-store'`.
- Files: `src/components/layout/header/search-autocomplete.tsx`, `src/app/api/search/suggestions/route.ts`, `src/lib/searchanise/search.ts`
- Cause: Suggestions favor freshness and do not cache repeated popular prefixes.
- Improvement path: Add a short server-side cache for normalized query prefixes, keep the rate limit, and consider requiring three characters before server calls if Searchanise latency or cost becomes visible.

## Fragile Areas

**Legacy bulk-pricing fallback depends on HulkApps response shape and external availability:**
- Files: `src/lib/shopify/operations/product.ts`
- Why fragile: The HulkApps fallback posts to `https://volumediscount.hulkapps.com/api/v2/shop/get_offer_table` and parses `"% Off"` offer levels from a legacy response shape. Failures degrade bulk tiers and shorten product cache life to minutes.
- Safe modification: Treat the HulkApps adapter as compatibility-only. Add fixture coverage for every observed response shape before changing parsing, and prefer Shopify-native quantity price breaks or typed product metafields for new pricing work.
- Test coverage: `src/lib/shopify/operations/product.test.ts` covers product operations and bulk-pricing parsing, but live HulkApps behavior is not covered by integration tests.

**Legacy inventory lookup reads Shopify product JSON outside the Storefront GraphQL API:**
- Files: `src/lib/shopify/operations/product.ts`
- Why fragile: `getLegacyProductInventory()` fetches `https://${storeDomain}/products/${handle}.js` only when Storefront `quantityRule.maximum` is missing. That endpoint is theme/Shopify legacy surface area, not part of the generated Storefront GraphQL contract.
- Safe modification: Keep the fallback isolated and optional. Replace it with Storefront API inventory data or a first-party API path when the token scopes allow it.
- Test coverage: Product unit tests cover mapper behavior, but there is no fake-Shopify integration coverage for this legacy product JSON endpoint.

**Searchanise recommendations depend on third-party DOM markup:**
- Files: `src/components/product/searchanise-recommendations/searchanise-script-loader.tsx`, `src/components/product/searchanise-recommendations/use-searchanise-recommendations.ts`, `src/components/product/searchanise-recommendations/searchanise-product-parser.ts`, `src/app/(storefront)/products/[handle]/_components/customers-also-bought.tsx`, `src/app/(storefront)/cart/_components/recommendations.tsx`
- Why fragile: The component waits for global Searchanise events, observes third-party-rendered DOM with `MutationObserver`, parses product cards back into native `ProductSummary` objects, and falls back after a timer.
- Safe modification: Keep Shopify fallback carousels in place. When changing Searchanise integration, update Storybook fixtures in `src/components/product/searchanise-recommendations/searchanise-recommendations.stories.tsx` to mirror real widget markup before changing parser selectors.
- Test coverage: Storybook fixtures cover rendered, empty, and fallback states, but there is no production-like browser test against the real Searchanise script.

**Cache invalidation is broad and partially topic-based:**
- Files: `src/app/api/webhooks/shopify/route.ts`, `src/app/api/webhooks/sanity/route.ts`, `src/lib/shopify/operations/product.ts`, `src/lib/shopify/operations/collection.ts`, `src/lib/blog/operations.ts`
- Why fragile: Shopify webhooks invalidate broad tags such as `product`, `products`, `collection`, and `collections`, while product operations also use per-handle tags. Sanity invalidates blog-wide tags and optional slug tags. Unsupported topics are ignored.
- Safe modification: Add topic tests before changing webhook behavior. Prefer targeted handle/slug tags when webhook payloads provide enough identity, but keep broad tags for delete or relationship-changing events.
- Test coverage: Webhook route tests are not detected under current `*.test.*` files.

## Scaling Limits

**In-memory rate-limit store capacity scales with unique identifiers per process:**
- Current capacity: One `Map` entry per `{namespace}:{identifier}` until each bucket expires.
- Limit: High-cardinality spoofed IP traffic can grow memory within each Node process, and limits do not coordinate across processes.
- Scaling path: Use a bounded external store with TTL and atomic increment. Keep namespace-specific limits in code, but move storage out of module state.

**Storefront product and collection pagination assumes Shopify page sizes of 250:**
- Current capacity: Product and collection summary operations fetch pages of up to 250 records.
- Limit: Large catalogs increase Shopify request count for `getAllProducts()`, collection summaries, and PDP variant pagination.
- Scaling path: Add purpose-specific skinny queries, sitemap chunking, and route-level pagination that avoids fetching catalog-wide data during normal page requests.

## Dependencies at Risk

**HulkApps volume discount endpoint:**
- Risk: The endpoint and response contract are external and untyped.
- Impact: PDP and cart bulk-savings display can lose legacy fallback tiers when Shopify-native breaks and metafields are absent.
- Migration plan: Move operators to Shopify-native quantity price breaks or typed `custom.bulk_pricing_tiers` metafields; keep HulkApps only as a temporary compatibility adapter.

**Searchanise widget and Searchanise search API:**
- Risk: Search and recommendations rely on `NEXT_PUBLIC_SEARCHANISE_*`, `https://searchserverapi1.com/getresults`, and widget script markup.
- Impact: Search pages, suggestions, PDP recommendations, and cart recommendations degrade to unavailable/Shopify fallback states when Searchanise config or markup changes.
- Migration plan: Keep Shopify fallbacks for recommendations and consider a Storefront API search fallback for basic product search when Searchanise is unavailable.

**Legacy Shopify product JSON endpoint:**
- Risk: `/products/{handle}.js` is outside generated Storefront GraphQL types and may not match future inventory needs.
- Impact: Maximum quantity display and cart validation can become less accurate when Storefront quantity rules omit maximums.
- Migration plan: Replace with typed Storefront inventory data or a first-party endpoint once credentials and scopes are available.

## Missing Critical Features

**Durable rate limiting and abuse protection:**
- Problem: Public forms and search endpoints have application-level limits but no durable store implementation in the repo.
- Blocks: Reliable production protection for contact, wholesale, NPD, newsletter, and search suggestion endpoints.

**Webhook observability:**
- Problem: Shopify ignored topics and revalidation outcomes are not logged or surfaced.
- Blocks: Diagnosing stale product, collection, page, and pricing data after Shopify changes.

**Production-like third-party integration verification:**
- Problem: Searchanise, Trustoo, HulkApps, and legacy Shopify product JSON behavior are primarily covered by adapters, stories, or unit fixtures.
- Blocks: High-confidence deploys when third-party markup/API contracts change.

## Test Coverage Gaps

**Webhook route behavior:**
- What's not tested: HMAC success/failure paths, missing secret responses, topic-to-tag mapping, ignored Shopify topics, Sanity signature failures, and slug-specific Sanity invalidation.
- Files: `src/app/api/webhooks/shopify/route.ts`, `src/app/api/webhooks/sanity/route.ts`
- Risk: Cache invalidation regressions can ship unnoticed and leave stale storefront data.
- Priority: High

**Rate-limit production behavior:**
- What's not tested: Memory-store cleanup under high cardinality, forwarded-header precedence, production warning behavior, and explicit fallback flags.
- Files: `src/lib/rate-limit/index.ts`, `scripts/component-contracts/rate-limit.test.mjs`
- Risk: Abuse protection can be weaker than expected in production.
- Priority: High

**All test files are not covered by standard scripts automatically:**
- What's not tested: Any new unit file omitted from `package.json` scripts, including current files outside the explicit `test:unit` and `test:integration` lists.
- Files: `package.json`, `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx`, `src/components/collection/toolbar.test.tsx`, `src/lib/blog/operations.test.ts`, `src/lib/sanity/queries/blog.test.ts`
- Risk: Passing standard test commands may not include all committed tests.
- Priority: Medium

**Searchanise and recommendation browser behavior:**
- What's not tested: Real script loading, real widget event timing, Searchanise markup drift, and fallback behavior in a production-like browser.
- Files: `src/components/product/searchanise-recommendations/searchanise-script-loader.tsx`, `src/components/product/searchanise-recommendations/use-searchanise-recommendations.ts`, `src/components/product/searchanise-recommendations/searchanise-product-parser.ts`
- Risk: Recommendations can disappear or parse incorrectly without failing unit tests.
- Priority: Medium

**Sitemap scale and failure behavior:**
- What's not tested: Shopify failures during sitemap generation, very large catalogs, and noindex-mode sitemap suppression.
- Files: `src/app/sitemap.ts`, `src/lib/shopify/operations/product.ts`, `src/lib/shopify/operations/collection.ts`
- Risk: SEO surfaces can fail at request/build time or become slow as catalog size grows.
- Priority: Medium

---

*Concerns audit: 2026-06-11*
