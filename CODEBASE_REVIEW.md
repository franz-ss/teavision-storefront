# Teavision Codebase Review

Date: 2026-06-02

## Overall Score: 77/100

Runtime note: six requested subagents completed. The platform refused the seventh Security & SEO subagent twice with `agent thread limit reached`, so that slice was completed as a local specialist pass. Verification completed: `pnpm lint` and `pnpm build` pass. The Testing & Reliability reviewer also reported `build-storybook` passes, but an existing Node contract test fails.

## Area Scores

- React & Next.js Architecture: 84/100
- Component Design: 78/100
- TypeScript & Code Quality: 82/100
- Performance: 74/100
- Accessibility & UI: 78/100
- Testing & Reliability: 62/100
- Security & SEO, local specialist pass: 79/100

## Highest Priority Findings

### Critical Performance Risk: Collection Pages Fetch and Render Too Much Upfront

`getCollectionProductsWithFilters()` loops through Shopify pages in [collection.ts](<D:/Work/teavision/teavision.com.au/src/lib/shopify/operations/collection.ts:383>), [page-content.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/collections/[handle]/_components/page-content.tsx:55>) requests 250-product chunks, then category filtering happens locally at [page-content.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/collections/[handle]/_components/page-content.tsx:85>).

Why it matters: this can balloon Shopify latency, RSC payload, image discovery, and hydrated add-to-cart islands on large PLPs.

Recommended fix: add real pagination, push tag/category filters into the Shopify query path, use smaller card DTOs, and move quick-buy into a lazy island or quick-view flow.

Priority: Critical

### High: Homepage Conversion Paths Are Fragile

The homepage CTA points to `/contact` in [page.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/page.tsx:67>), while the real route is `/pages/contact`. Homepage form actions discard results in [actions.ts](<D:/Work/teavision/teavision.com.au/src/lib/contact/actions.ts:305>) and [actions.ts](<D:/Work/teavision/teavision.com.au/src/lib/contact/actions.ts:364>), leaving [contact-form.tsx](<D:/Work/teavision/teavision.com.au/src/components/homepage/contact-form/contact-form.tsx:9>) and [newsletter.tsx](<D:/Work/teavision/teavision.com.au/src/components/homepage/newsletter/newsletter.tsx:19>) without success/error feedback.

Why it matters: the storefront can lose leads or make users think a failed submission succeeded.

Recommended fix: change the CTA href to `/pages/contact` and reuse the richer `useActionState` pattern from the dedicated contact/newsletter forms.

Priority: High

### High: PDP Add-to-Cart Feedback Is Incomplete

[product-form.tsx](<D:/Work/teavision/teavision.com.au/src/components/product/product-form/product-form.tsx:133>) calls `addToCartAction()` but does not `router.refresh()`, unlike [product-purchase-form.tsx](<D:/Work/teavision/teavision.com.au/src/components/collection/product-card/product-purchase-form.tsx:55>) and [product-quick-view.tsx](<D:/Work/teavision/teavision.com.au/src/components/product/product-quick-view/product-quick-view.tsx:115>). It also lacks a success `role="status"`.

Why it matters: the header cart badge can stay stale, and assistive tech users get no reliable confirmation of the purchase action.

Recommended fix: centralize add-to-cart state, refresh, error, and success announcement behavior.

Priority: High

### High: Testing Is Not Production-Grade Yet

[package.json](<D:/Work/teavision/teavision.com.au/package.json:7>) has build/lint/storybook scripts but no `test` or `typecheck`; the stale contract test references removed `catalogues.tsx` in [button-system.test.mjs](<D:/Work/teavision/teavision.com.au/scripts/component-contracts/button-system.test.mjs:118>).

Why it matters: lint passing does not prove cart, form, search, webhook, or GraphQL behavior.

Recommended fix: add `typecheck`, `test:contracts`, Storybook interaction tests, and coverage for cart/product/form flows.

Priority: High

### High: JSON-LD Serialization Is Inconsistent

Safe escaping exists in [products/[handle]/page.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/products/[handle]/page.tsx:134>) and collection detail JSON-LD, but raw `JSON.stringify()` is used in [home page.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/page.tsx:45>), [collections/page.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/collections/page.tsx:134>), and [article page.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/blogs/[blog]/[article]/page.tsx:107>).

Why it matters: CMS or Shopify text containing `<` or `</script>` can break inline scripts.

Recommended fix: centralize a script-safe serializer that escapes `<` and use it for all JSON-LD.

Priority: High

### High/Medium: Security Controls Are Mostly Good, but Rate Limiting Is Weak

Contact/newsletter limits are module-local memory in [actions.ts](<D:/Work/teavision/teavision.com.au/src/lib/contact/actions.ts:53>) and keyed from request headers at [actions.ts](<D:/Work/teavision/teavision.com.au/src/lib/contact/actions.ts:77>). Search suggestions limit query length but have no server-side rate limit in [route.ts](<D:/Work/teavision/teavision.com.au/src/app/api/search/suggestions/route.ts:20>).

Why it matters: serverless or multi-instance deployments can bypass module-local limits, and public APIs can be abused to hammer third-party services.

Recommended fix: move rate limiting to a shared backing store or provider-level protection.

Priority: High/Medium

## Top Strengths

- Strong Next 16 foundation: `cacheComponents` in [next.config.ts](<D:/Work/teavision/teavision.com.au/next.config.ts:4>), cached Shopify operations, and mostly correct Server/Client boundaries.
- Good data safety patterns: Shopify fails fast on missing credentials in [client.ts](<D:/Work/teavision/teavision.com.au/src/lib/shopify/client.ts:22>), cart cookies are `httpOnly`/`sameSite`/production-secure in [actions.ts](<D:/Work/teavision/teavision.com.au/src/lib/cart/actions.ts:97>), and webhooks verify signatures.
- Senior-level guardrails: strict TypeScript, generated Shopify types routed through the barrel, custom ESLint rules, Tailwind token discipline, branded `SanitizedHtml`, and broad Storybook coverage.

## Top Weaknesses

- The most valuable flows, product add-to-cart, homepage lead capture, cart mutation, and search, are not protected by executable tests.
- Some route files and operation files are too broad, especially [products/[handle]/page.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/products/[handle]/page.tsx:281>) and [product.ts](<D:/Work/teavision/teavision.com.au/src/lib/shopify/operations/product.ts:608>).
- Accessibility misses are concentrated in bypass navigation, carousel motion, live async feedback, and small touch targets.

## Areas That Feel Senior-Level

Cache/tag strategy, webhook verification, HTML sanitization, generated GraphQL typing, custom lint governance, and the primitive component system feel deliberate and maintainable.

## Areas That Feel Junior, Rushed, or Fragile

The broken `/contact` CTA, homepage form result swallowing, stale hidden contract test, nested `<main>` in [collections/page.tsx](<D:/Work/teavision/teavision.com.au/src/app/(storefront)/collections/page.tsx:137>), root `error.tsx` still using `reset` in [error.tsx](<D:/Work/teavision/teavision.com.au/src/app/error.tsx:6>), and raw JSON-LD serialization all feel like late-stage polish gaps that can affect real users.

## Prioritized Improvement Roadmap

### Quick Wins

- Fix `/contact` to `/pages/contact`.
- Add a skip link and `main-content` target.
- Replace the nested `/collections` `<main>` with a `div` or fragment.
- Update root error recovery to the current Next 16 `unstable_retry` pattern.
- Add a shared JSON serializer for inline scripts.
- Add PDP cart refresh and success status feedback.
- Repair or remove the stale `catalogues.tsx` contract test.

### Next 1-2 Weeks

- Implement homepage contact/newsletter form state with pending, success, and error states.
- Add cart/product Storybook play tests.
- Add `typecheck` and contract tests to CI.
- Add a persistent carousel pause control or remove autoplay.
- Harden Searchanise/contact rate limits.
- Improve sitemap `lastModified` values and verify `/pages/about`.

### Larger Refactors

- Paginate/filter PLPs server-side.
- Split PDP sections into `_components`.
- Extract Shopify mappers and legacy enrichment adapters out of `product.ts`.
- Code-split header mega-nav and quick-view.
- Turn domain-specific `ui/product-card` into a product-domain component.

## Final Production Readiness Recommendation

The codebase is close and has a strong foundation, but it is not production-ready for a high-confidence public launch as-is. Fix the high-priority conversion, testing, accessibility, JSON-LD, and PLP performance issues first.

External guideline source used for the UI/accessibility pass: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).
