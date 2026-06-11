# External Integrations

**Analysis Date:** 2026-06-11

## APIs & External Services

**Commerce:**
- Shopify Storefront GraphQL API - Products, collections, menus/pages, cart creation, cart line mutations, product recommendations, checkout handoff URL, and sitemap data.
  - SDK/Client: custom `shopifyFetch()` in `src/lib/shopify/client.ts` using `graphql` and typed documents from `src/lib/shopify/types/index.ts`.
  - Auth: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
  - API version: `2026-04` in `src/lib/shopify/env.ts` and `codegen.ts`.
- Shopify legacy product JSON endpoint - Fallback inventory lookup at `https://{SHOPIFY_STORE_DOMAIN}/products/{handle}.js`.
  - SDK/Client: native `fetch()` in `src/lib/shopify/operations/product.ts`.
  - Auth: public storefront product JSON endpoint; domain comes from `SHOPIFY_STORE_DOMAIN`.
- Shopify CDN - Product, marketing, catalogue PDF, and static storefront assets.
  - SDK/Client: Next image remote patterns in `next.config.ts`; hard-coded asset URLs in `src/components/homepage/content.ts`, `src/components/layout/header/mega-nav-data.ts`, and several `src/app/(storefront)/pages/*/_lib/data.ts` files.
  - Auth: none.

**CMS & Content:**
- Sanity Content Lake - Tea Journal/blog content and image metadata.
  - SDK/Client: `next-sanity` clients in `src/lib/sanity/client.ts`; GROQ queries under `src/lib/sanity/queries/`.
  - Auth: `SANITY_API_READ_TOKEN` optional for server reads; `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION` configure the project.
- Sanity Image CDN - Blog imagery rendered from Sanity image sources.
  - SDK/Client: `@sanity/image-url` via `getSanityImageUrl()` in `src/lib/sanity/client.ts`; remote image allowlist in `next.config.ts`.
  - Auth: none for published images.

**Search & Recommendations:**
- Searchanise Search API - Owned search results, facets, sorting, and search suggestions.
  - SDK/Client: native `fetch()` to `https://searchserverapi1.com/getresults` in `src/lib/searchanise/search.ts`.
  - Auth: public API key from `NEXT_PUBLIC_SEARCHANISE_API_KEY`; enabled with `NEXT_PUBLIC_SEARCHANISE_ENABLED`.
- Searchanise Shopify widget script - PDP recommendations compatibility path that parses third-party-rendered markup into native product cards.
  - SDK/Client: `next/script` loads `https://searchserverapi.com/widgets/shopify/init.js` in `src/components/product/searchanise-recommendations/searchanise-script-loader.tsx`; parsing lives in `src/components/product/searchanise-recommendations/searchanise-product-parser.ts`.
  - Auth: public API key from `NEXT_PUBLIC_SEARCHANISE_API_KEY`.

**Reviews:**
- Trustoo product ratings API - Product review summary data.
  - SDK/Client: native `fetch()` to `https://api.trustoo.io/api/v1/reviews/get_products_rating` in `src/lib/reviews/trustoo.ts`.
  - Auth: shop domain from `NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN`.

**Pricing Compatibility:**
- HulkApps volume discount offer table - Legacy fallback for bulk pricing when Shopify-native quantity price breaks and product metafields are absent.
  - SDK/Client: native `fetch()` POST to `https://volumediscount.hulkapps.com/api/v2/shop/get_offer_table` in `src/lib/shopify/operations/product.ts`.
  - Auth: store identifier from `HULK_VOLUME_DISCOUNT_STORE_ID`, defaulting in `src/lib/shopify/env.ts`.

**Email:**
- Resend - Sends contact, custom tea blend, wholesale account, NPD order, and newsletter form emails.
  - SDK/Client: `resend` package in `src/lib/contact/actions.ts`.
  - Auth: `RESEND_API_KEY`.

**Fonts & Platform Assets:**
- Google Fonts through Next font optimization - Spectral, Hanken Grotesk, Space Mono, and Caveat.
  - SDK/Client: `next/font/google` in `src/app/layout.tsx`.
  - Auth: none.

## Data Storage

**Databases:**
- Shopify Storefront API / Shopify platform
  - Connection: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
  - Client: custom GraphQL client `shopifyFetch()` in `src/lib/shopify/client.ts`.
- Sanity Content Lake
  - Connection: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`.
  - Client: `next-sanity` via `getSanityClient()` and `sanityPublishedFetch()` in `src/lib/sanity/client.ts`.
- No application-owned SQL, document, or key-value database is detected in the repo.

**File Storage:**
- Shopify CDN and Teavision Shopify-hosted file assets are used throughout page data and component fixtures, with image host allowlists in `next.config.ts`.
- Sanity Image CDN is used for blog imagery through `src/lib/sanity/client.ts`.
- Local static assets are served from `public/` and Storybook uses `staticDirs: ['../public']` in `.storybook/main.ts`.

**Caching:**
- Next.js Cache Components with `'use cache'`, `cacheTag()`, `cacheLife()`, and `revalidateTag()` are used for Shopify product/collection/page reads, Sanity blog reads, and Trustoo reviews in `src/lib/shopify/operations/*.ts`, `src/lib/blog/operations.ts`, and `src/lib/reviews/trustoo.ts`.
- Cart and Searchanise network calls use `cache: 'no-store'` where freshness is required in `src/lib/shopify/operations/cart.ts` and `src/lib/searchanise/search.ts`.
- Rate limiting uses an in-memory `Map` in `src/lib/rate-limit/index.ts`; no Redis, durable KV, or database-backed limiter is detected.

## Authentication & Identity

**Auth Provider:**
- Not detected for end-user accounts; storefront shopping is anonymous and cart state is stored in the `teavision_cart` HTTP-only cookie by `src/lib/cart/actions.ts`.
  - Implementation: Server Actions call Shopify cart operations and set/delete the Shopify cart ID cookie.
- Shopify Storefront API authentication is server-side token authentication via `X-Shopify-Storefront-Access-Token` in `src/lib/shopify/env.ts`.
- Sanity webhook authentication uses signed webhook verification through `next-sanity/webhook` and `SANITY_REVALIDATE_SECRET` in `src/app/api/webhooks/sanity/route.ts`.
- Shopify webhook authentication uses HMAC SHA-256 verification with `SHOPIFY_WEBHOOK_SECRET` in `src/app/api/webhooks/shopify/route.ts`.

## Monitoring & Observability

**Error Tracking:**
- No external error tracking provider such as Sentry, Datadog, Honeycomb, or Logtail is detected in `package.json` or source imports.

**Logs:**
- Server-side console logging is used for third-party degradation and form delivery failures in `src/lib/contact/actions.ts`, `src/lib/reviews/trustoo.ts`, `src/lib/shopify/operations/product.ts`, and `src/lib/rate-limit/index.ts`.
- Playwright traces are retained on failure via `trace: 'retain-on-failure'` in `playwright.config.ts`.
- Storybook/Chromatic package support is installed through `@chromatic-com/storybook`, but no repository CI workflow invoking Chromatic is detected.

## CI/CD & Deployment

**Hosting:**
- Provider-specific deployment config is not detected in the repo.
- Project documentation recommends Vercel for production/preview hosting in `docs/teavision-project-reference.md`.
- The app is a standard Next.js production build/start target through `pnpm build` and `pnpm start` in `package.json`.

**CI Pipeline:**
- No `.github/` workflow directory is detected.
- Local Git hooks in `.husky/pre-commit` run `pnpm lint` and `pnpm test:contracts`.
- Local Git hooks in `.husky/pre-push` run `pnpm lint`, `pnpm typecheck`, `pnpm test:contracts`, and `pnpm build`.
- E2E CI behavior is encoded in `playwright.config.ts` with retries controlled by `CI` through `isContinuousIntegration()`.

## Environment Configuration

**Required env vars:**
- `SHOPIFY_STORE_DOMAIN` - Shopify store domain for Storefront API and product JSON fallback.
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Storefront API token.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset.
- `SANITY_REVALIDATE_SECRET` - Signed Sanity webhook secret.
- `SITE_URL` or `NEXT_PUBLIC_SITE_URL` - Canonical site URL; required in production by `src/lib/seo/site-url.ts`.

**Optional / feature env vars:**
- `NEXT_PUBLIC_SANITY_API_VERSION` - Overrides Sanity API version; defaults to `2026-05-28` in `src/lib/sanity/env.ts`.
- `SANITY_API_READ_TOKEN` - Optional Sanity read token for private server reads.
- `RESEND_API_KEY` - Enables contact and newsletter email sending.
- `SHOPIFY_WEBHOOK_SECRET` - Enables Shopify webhook HMAC validation.
- `SHOPIFY_COLLECTIONS_INDEX_MENU_HANDLE` - Overrides Shopify collection index menu handle; defaults to `main-menu`.
- `HULK_VOLUME_DISCOUNT_STORE_ID` - Overrides HulkApps store ID; defaults to `mrteashop-com.myshopify.com`.
- `NEXT_PUBLIC_SEARCHANISE_ENABLED` - Enables Searchanise search integration when set to `true`.
- `NEXT_PUBLIC_SEARCHANISE_API_KEY` - Public Searchanise API key for search and widget script.
- `NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN` - Trustoo shop domain for product ratings.
- `DISABLE_INDEXING` - Enables noindex mode and empty sitemap behavior.
- `RATE_LIMIT_EXTERNAL_PROTECTION` - Declares external/provider-level rate limiting in production.
- `RATE_LIMIT_ALLOW_MEMORY_FALLBACK` - Explicitly allows in-memory rate limiting in production.
- `SHOPIFY_STOREFRONT_TEST_MODE`, `SHOPIFY_STOREFRONT_TEST_URL`, `PLAYWRIGHT_PORT`, and `FAKE_SHOPIFY_PORT` - Local/fake Shopify test harness configuration in `src/lib/shopify/env.ts` and `playwright.config.ts`.

**Secrets location:**
- `.env.local` is present and must be treated as local secret/config storage; contents are not read or documented.
- `.env.example` is present as a template, but environment values must not be copied from local secret files.
- Production secrets belong in the deployment platform environment, not in committed files.

## Webhooks & Callbacks

**Incoming:**
- `POST /api/webhooks/shopify` at `src/app/api/webhooks/shopify/route.ts`.
  - Verifies `x-shopify-hmac-sha256` with `SHOPIFY_WEBHOOK_SECRET`.
  - Handles product, collection, collection-product, and page topics by invalidating Next cache tags.
  - Accepts unknown topics but ignores them.
- `POST /api/webhooks/sanity` at `src/app/api/webhooks/sanity/route.ts`.
  - Uses `parseBody()` from `next-sanity/webhook` with `SANITY_REVALIDATE_SECRET`.
  - Invalidates broad blog tags plus specific blog/article tags when slugs are present.
- `GET /api/search/suggestions` at `src/app/api/search/suggestions/route.ts`.
  - Public route that proxies typed Searchanise results into limited product suggestions with in-memory rate limiting.
- `GET /api/products/[handle]/quick-view` at `src/app/api/products/[handle]/quick-view/route.ts`.
  - Public route that returns Shopify product quick-view details.

**Outgoing:**
- Shopify GraphQL POST requests from `src/lib/shopify/client.ts` to `https://{SHOPIFY_STORE_DOMAIN}/api/2026-04/graphql.json`.
- Shopify product JSON GET requests from `src/lib/shopify/operations/product.ts` to `https://{SHOPIFY_STORE_DOMAIN}/products/{handle}.js`.
- GraphQL Codegen schema introspection requests from `codegen.ts` to `https://{SHOPIFY_STORE_DOMAIN}/api/2026-04/graphql.json`.
- Sanity query requests from `src/lib/sanity/client.ts` through `next-sanity`.
- Searchanise search GET requests from `src/lib/searchanise/search.ts` to `https://searchserverapi1.com/getresults`.
- Searchanise widget script requests from `src/components/product/searchanise-recommendations/searchanise-script-loader.tsx` to `https://searchserverapi.com/widgets/shopify/init.js`.
- Trustoo ratings GET requests from `src/lib/reviews/trustoo.ts` to `https://api.trustoo.io/api/v1/reviews/get_products_rating`.
- HulkApps volume discount POST requests from `src/lib/shopify/operations/product.ts` to `https://volumediscount.hulkapps.com/api/v2/shop/get_offer_table`.
- Resend email API calls from `src/lib/contact/actions.ts`.
- Google font fetches are mediated by Next font optimization from `src/app/layout.tsx`.

---

*Integration audit: 2026-06-11*
