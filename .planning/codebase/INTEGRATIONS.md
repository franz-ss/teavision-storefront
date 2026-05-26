# External Integrations

**Analysis Date:** 2026-05-26

## APIs and External Services

**Shopify Storefront API:**
- Purpose: Products, collections, carts, pages, blogs, predictive search, recommendations, and checkout URLs.
- Client: `src/lib/shopify/client.ts` wraps `fetch()` against `https://${SHOPIFY_STORE_DOMAIN}/api/2026-04/graphql.json`.
- Documents: `src/lib/shopify/queries/*.graphql`.
- Types: Generated into `src/lib/shopify/types/generated/`, re-exported through `src/lib/shopify/types/index.ts`.
- Auth: Storefront access token in `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.

**Shopify Cart and Checkout:**
- Purpose: Cart creation/mutation and checkout handoff.
- Implementation: `src/lib/cart/actions.ts` stores Shopify cart ID in the `teavision_cart` HTTP-only cookie and delegates to `src/lib/shopify/operations/cart.ts`.
- Checkout: Cart page links directly to `cart.checkoutUrl`.
- Current limitation: Cart query does not expose line-level `discountAllocations`.

**Shopify Webhooks:**
- Endpoint: `src/app/api/webhooks/shopify/route.ts`.
- Verification: HMAC SHA-256 using `SHOPIFY_WEBHOOK_SECRET` and `crypto.timingSafeEqual`.
- Events handled: product create/update/delete, collection create/update/delete, and collection product add/remove.
- Effect: Invalidates Next cache tags with `revalidateTag()`.

**Trustoo / TrustWILL Reviews:**
- Purpose: Product rating summaries.
- Implementation: `src/lib/reviews/trustoo.ts`.
- Endpoint: `https://api.trustoo.io/api/v1/reviews/get_products_rating`.
- Auth/config: Public shop domain in `NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN`.
- Usage: Product pages and related product summaries merge Trustoo ratings when available.

**Searchanise:**
- Purpose: Customer-also-bought recommendations widget on product pages when enabled.
- Loader: `src/components/product/searchanise-recommendations/searchanise-script-loader.tsx`.
- Widget wrapper: `src/components/product/searchanise-recommendations/searchanise-recommendations.tsx`.
- Script: `https://searchserverapi.com/widgets/shopify/init.js?a=<apiKey>`.
- Config: `NEXT_PUBLIC_SEARCHANISE_ENABLED` and `NEXT_PUBLIC_SEARCHANISE_API_KEY`.
- Widget DOM id: `1T8K1Y6Q6G8R3B3` is hard-coded as the default.

**Resend:**
- Purpose: Contact form, custom tea blend enquiry, and newsletter signup emails.
- Implementation: `src/lib/contact/actions.ts`.
- Auth: `RESEND_API_KEY`.
- From addresses: `noreply@teavision.com.au`.
- Recipient: `info@teavision.com.au`.

**Shopify Customer Account Link:**
- Header account link goes to `https://mrtea.com.au/account/login` in `src/components/layout/header/header.tsx`.
- This is an external handoff, not a headless account implementation.

**Sibling Shopify Theme:**
- Sibling project exists at `../teavision-theme`.
- It contains legacy Liquid app integration footprints, including HulkApps discount hooks in cart templates and commented Quantity Breaks Now integration.
- Use it as a migration reference, not as source code to import.

## Data Storage

**Primary Store:**
- Shopify is the source of truth for storefront catalog, carts, checkout, pages, blogs, and product review metafields.
- The Next app does not have its own database.

**Session/Cart State:**
- Cart ID is stored in an HTTP-only cookie named `teavision_cart`.
- No client-side global cart store exists.

**File Storage:**
- Product and content images are loaded from `cdn.shopify.com`.
- Static assets live in `public/`, including `public/teavision.svg` and homepage imagery.

**Caching:**
- Next.js 16 Cache Components are enabled with `cacheComponents: true`.
- Expensive reads use `'use cache'`, `cacheTag()`, and `cacheLife()` in Shopify/blog/review operations.
- Cart operations use `cache: 'no-store'`.

## Authentication and Identity

**Storefront Auth:**
- No custom storefront login state exists in this app.
- Shopify account access is linked externally from the header.

**Admin Auth:**
- `SHOPIFY_ADMIN_API_ACCESS_TOKEN` is documented in `.env.example`, but no committed code currently uses it.

## Monitoring and Analytics

**Structured Data:**
- JSON-LD is emitted by homepage, product, collection, article, static page, and custom tea blend routes.

**Shopify Analytics Compatibility:**
- `src/app/(storefront)/products/[handle]/page.tsx` currently emits `window.ShopifyAnalytics.meta` and `var __st` product context for compatibility with Shopify-app-style scripts.
- This file has uncommitted user edits; do not overwrite it casually.

**Error Tracking:**
- No Sentry, Datadog, or equivalent error tracking integration is committed.

**Logs:**
- Server-side contact and newsletter failures use `console.error()` in `src/lib/contact/actions.ts`.

## CI/CD and Deployment

**Hosting:**
- No committed Vercel, GitHub Actions, or deployment workflow config is present.
- `next.config.ts` is compatible with typical Next.js hosting and Shopify CDN images.

**CI Pipeline:**
- No `.github/workflows/` pipeline is present.
- Verification is currently local via `pnpm lint`, `pnpm build`, `pnpm codegen`, Storybook, and direct Node tests for script contracts when needed.

## Environment Configuration

**Development:**
- `.env.local` is gitignored.
- `.env.example` provides names only; do not copy secrets into planning docs.

**Production:**
- Required: Shopify Storefront domain/token and public site URL.
- Optional/feature-gated: Trustoo, Searchanise, Resend, Shopify webhook secret.

## Webhooks and Callbacks

**Incoming:**
- Shopify webhook endpoint: `/api/webhooks/shopify`.
- Validates HMAC and updates cache tags.

**Outgoing:**
- Resend email API calls for contact and newsletter submissions.
- Trustoo rating fetches.
- Shopify GraphQL requests.
- Searchanise widget script and client-side widget rendering when enabled.

---

*Integration audit: 2026-05-26*
*Update when adding, removing, or replacing external services*
