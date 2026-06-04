# Codebase Concerns

**Analysis Date:** 2026-05-26

## Tech Debt

**PDP quantity and discount parity:**

- Issue: `src/components/product/product-form/product-form.tsx` hard-codes add-to-cart quantity to `1` and does not render bulk discount tiers.
- Related files: `src/app/(storefront)/products/[handle]/page.tsx`, `src/lib/shopify/queries/product.graphql`, `src/lib/shopify/types/index.ts`, `src/lib/cart/actions.ts`.
- Impact: Headless PDP does not yet match the live Shopify-theme "Buy in Bulk and Save" behavior.
- Fix approach: Add a first-class quantity selector, bulk tier data source, and cart discount display path. Prefer Shopify-native discount/metafield/metaobject data over injecting legacy app scripts.

**Cart discount visibility gap:**

- Issue: `src/lib/shopify/queries/cart.graphql` fetches totals and line prices but not line-level `discountAllocations`.
- Impact: Cart can show Shopify subtotal/total but cannot explain applied bulk/discount allocations at line level.
- Fix approach: Extend cart query/types/reshaper to expose discount allocations before implementing visible discount messaging.

**Duplicated reshape helpers:**

- Issue: `reshapeMoney()`, `reshapeImage()`, and review-rating parsing exist in multiple operation files.
- Files: `src/lib/shopify/operations/product.ts`, `collection.ts`, `cart.ts`, `search.ts`.
- Impact: Field additions must be repeated and can drift across product, collection, search, and cart.
- Fix approach: Extract shared reshapers only when a change touches multiple domains; keep type-specific reshape logic local.

**Homepage/page docs and README drift:**

- Issue: `README.md` is still the create-next-app default and references root `app/page.tsx`.
- Impact: New contributors may follow wrong commands or paths.
- Fix approach: Replace README with Teavision-specific setup, env, Shopify, Storybook, and verification notes.

**Scaffolding script generates weak placeholder code:**

- Issue: `scripts/create-component.mjs` emits `className = ''` and a placeholder `<div>`.
- Impact: Generated components still need cleanup to comply with the stricter `cn()`/component anatomy guidance.
- Fix approach: Update scaffold templates to import `cn()` when `className` exists, include `type-*`/token examples only if appropriate, and keep placeholder comments out of production components.

## Known Bugs

**No confirmed runtime bugs documented in code:**

- Current map did not find reproducible committed bug reports in source comments.
- Keep this section updated as QA or production issues are confirmed.

## Security Considerations

**Contact form rate limiting is in-memory:**

- Risk: `src/lib/contact/actions.ts` stores buckets in a module-level `Map`, which resets across serverless instances/restarts and does not coordinate across regions.
- Current mitigation: Honeypot field, validation, and short-window per-IP bucket.
- Recommendation: Use provider-level rate limits, edge middleware, or durable rate limiting for production abuse resistance.

**Searchanise public script injection:**

- Risk: `SearchaniseScriptLoader` loads a third-party script from `searchserverapi.com` when public env flags enable it.
- Current mitigation: Feature flag and fallback state.
- Recommendation: Validate the exact production role of Searchanise, monitor failures, and keep a no-script fallback.

**HTML rendering requires sanitizer discipline:**

- Risk: Shopify page/article/product HTML enters the app from an external CMS.
- Current mitigation: `src/lib/shopify/html-content.ts` sanitizes allowed tags, attributes, schemes, and classes.
- Recommendation: Route all Shopify HTML through this module before `dangerouslySetInnerHTML`; do not render raw CMS HTML directly.

**Webhook accepts ignored topics:**

- Risk: Unknown Shopify topics return success and do not alert.
- Current mitigation: Safe default avoids webhook retries for irrelevant topics.
- Recommendation: Add structured logging or monitoring if webhook topic coverage becomes operationally important.

## Performance Bottlenecks

**Full collection product pagination before render:**

- Problem: `getCollectionProductsWithFilters()` loops through all product pages for a collection using page size 250.
- Files: `src/lib/shopify/operations/collection.ts`, `src/app/(storefront)/collections/[handle]/page.tsx`.
- Measurement: No current timings captured.
- Cause: Collection page needs full product set to build category filters and display all products.
- Improvement path: Introduce pagination or split filter metadata from visible product fetches if collection size affects TTFB.

**Product detail page does multiple independent external reads:**

- Problem: PDP fetches product data, related collection/recommendations, and Trustoo ratings.
- Files: `src/app/(storefront)/products/[handle]/page.tsx`, `src/lib/reviews/trustoo.ts`.
- Measurement: No current timings captured.
- Cause: Related products and reviews add external dependencies.
- Improvement path: Keep related sections behind Suspense, preserve caching, and measure before broadening PDP dependencies.

**Blog fetch loads all articles:**

- Problem: `getBlog()` paginates through all articles before filtering/pagination in memory.
- File: `src/lib/blog/operations.ts`.
- Measurement: No current timings captured.
- Improvement path: Use Shopify pagination/cursors for listing pages if article count grows enough to affect page generation.

## Fragile Areas

**Next.js 16 APIs:**

- Why fragile: Repo instructions warn this Next version differs from common assumptions.
- Common failures: Using old `params`/`searchParams` patterns, wrong cache assumptions, or outdated docs.
- Safe modification: Read `node_modules/next/dist/docs/` before changing Next data, caching, route, or dynamic API code.
- Test coverage: Build/lint only; no E2E suite.

**Shopify generated types boundary:**

- Why fragile: Generated files are large and should not be hand-edited or imported directly.
- Common failures: Direct imports from `src/lib/shopify/types/generated/`, stale generated types after query edits.
- Safe modification: Edit `.graphql`, run `pnpm codegen`, then update public exports in `src/lib/shopify/types/index.ts`.

**Legacy Shopify app parity:**

- Why fragile: Live theme behavior can come from Shopify app embeds/scripts instead of Liquid files.
- Evidence: Sibling `../teavision-theme` contains HulkApps hooks and commented Quantity Breaks Now code; live behavior may still depend on admin-side app config.
- Safe modification: Treat the theme as evidence, then verify live rendered scripts/DOM before implementing parity in Next.

**Product analytics compatibility script:**

- Why fragile: `src/app/(storefront)/products/[handle]/page.tsx` includes inline `window.ShopifyAnalytics`/`__st` compatibility data and currently has uncommitted user edits.
- Common failures: Overwriting user changes, introducing unsafe inline JSON, or breaking Shopify-app-style product context.
- Safe modification: Use `serializeInlineJson()` for inline JSON and read the latest diff before editing this file.

## Scaling Limits

**No app database or queue:**

- Current capacity: Limited by Shopify Storefront API, Next server runtime, and external service limits.
- Limit: Long-running or durable workflows cannot be stored locally.
- Scaling path: Keep state in Shopify where possible; introduce durable infrastructure only for explicit product requirements.

**Contact form rate limiting:**

- Current capacity: Best-effort per runtime instance.
- Limit: Distributed production traffic can bypass the in-memory bucket.
- Scaling path: Durable rate limiter or provider-level protection.

## Dependencies at Risk

**Third-party storefront widgets:**

- Risk: Searchanise and Trustoo behavior depends on external services and dashboard configuration outside the repo.
- Impact: Recommendations/reviews can silently disappear or mismatch headless markup.
- Mitigation: Feature flags, fallbacks, and server-side summaries where available.

**Shopify Storefront schema:**

- Risk: Queries target `2026-04`; schema or plan features may affect fields like quantity price breaks.
- Impact: Codegen/build can fail after API changes or when adding B2B pricing fields without schema support.
- Mitigation: Run `pnpm codegen` after query edits and check official Shopify docs for new Storefront fields.

## Missing Critical Features

**Bulk pricing source of truth:**

- Problem: The Next app has no committed model for bulk pricing tiers.
- Current workaround: None in Next; live theme/app behavior handles it outside this codebase.
- Blocks: Accurate "Buy in Bulk and Save" display and discount explanation in cart.
- Implementation complexity: Medium to high, depending on whether tiers come from Shopify native data, metafields/metaobjects, or a third-party app export/API.

**Automated browser/E2E coverage:**

- Problem: No Playwright/Cypress suite covers PDP, collection filters, cart, checkout handoff, contact forms, or third-party widget degradation.
- Current workaround: Manual local verification and Storybook.
- Blocks: Safe migration confidence for revenue-critical flows.
- Implementation complexity: Medium.

**Production monitoring:**

- Problem: No committed error tracking or uptime/analytics instrumentation beyond partial ShopifyAnalytics compatibility on PDP.
- Current workaround: Hosting/provider logs and manual checks.
- Blocks: Fast detection of production regressions.
- Implementation complexity: Low to medium depending on provider choice.

## Test Coverage Gaps

**Cart and checkout:**

- What's not tested: Add/update/remove cart lines, cookie recovery, checkout URL handoff, discount allocation display.
- Risk: Revenue-impacting regressions can ship unnoticed.
- Priority: High.
- Difficulty: Needs real Shopify test products/carts or a mocked Storefront layer.

**Shopify HTML sanitizer:**

- What's not tested: Allowed/disallowed tags, links, images, table rendering, class stripping, heading remapping.
- Risk: CMS content can break layout or unsafe markup can slip through after changes.
- Priority: High.
- Difficulty: Low; pure function tests are straightforward if a test runner is formalized.

**Collection filtering/canonicalization:**

- What's not tested: Sort/filter/category URL parsing, not-found behavior, and generated structured data.
- Risk: SEO and product discovery regressions.
- Priority: Medium-high.
- Difficulty: Medium due to Storefront data dependency.

**Webhook verification:**

- What's not tested: Valid/invalid HMAC, known topics, unknown topics, cache tag calls.
- Risk: Cache invalidation breaks silently.
- Priority: Medium.
- Difficulty: Medium; route handler tests need request fixtures and cache mocking.

---

_Concerns audit: 2026-05-26_
_Update as issues are fixed or new ones are discovered_
