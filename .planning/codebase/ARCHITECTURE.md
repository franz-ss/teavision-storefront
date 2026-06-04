# Architecture

**Analysis Date:** 2026-05-26

## Pattern Overview

**Overall:** Headless Shopify storefront using Next.js 16 App Router, React Server Components, typed Shopify GraphQL operations, and client-only interactive leaves.

**Key Characteristics:**

- Storefront routes live under `src/app/(storefront)/`.
- Server Components fetch Shopify data through operation helpers in `src/lib/shopify/operations/`.
- Client Components are limited to forms, controls, carousels, dialogs, and widget loaders.
- Cart state is server-owned through a cookie and Server Actions; there is no client cart store.
- Shopify and third-party app compatibility is intentionally rebuilt rather than inherited from Liquid.

## Layers

**Route Layer:**

- Purpose: Defines pages, metadata, route handlers, and static params.
- Contains: `src/app/(storefront)/**/page.tsx`, `src/app/api/**/route.ts`, `src/app/layout.tsx`.
- Depends on: Shopify operations, blog/page helpers, design system components.
- Used by: Next.js App Router.

**Data Operations Layer:**

- Purpose: Fetch and reshape Storefront GraphQL responses into local handwritten types.
- Contains: `src/lib/shopify/operations/product.ts`, `collection.ts`, `cart.ts`, `search.ts`, `storefront-page.ts`, and `src/lib/blog/operations.ts`.
- Depends on: `shopifyFetch()` and typed documents re-exported through `src/lib/shopify/types/index.ts`.
- Used by: Server Components, Server Actions, and API route handlers.

**GraphQL Document Layer:**

- Purpose: Owns Storefront API query/mutation selection sets.
- Contains: `src/lib/shopify/queries/*.graphql`.
- Depends on: Shopify Storefront schema at codegen time.
- Used by: `pnpm codegen`, then operations via generated document exports.

**Server Action Layer:**

- Purpose: Mutates cart and sends forms from server boundaries.
- Contains: `src/lib/cart/actions.ts`, `src/lib/contact/actions.ts`, and the local `subscribeToNewsletter()` action in `src/components/layout/footer/footer.tsx`.
- Depends on: Next headers/cookies, Shopify operations, Resend.
- Used by: Product/cart/contact/newsletter UI.

**Component Layer:**

- Purpose: Renders UI with reusable primitives and domain components.
- Contains: `src/components/ui/`, `src/components/product/`, `src/components/collection/`, `src/components/homepage/`, `src/components/layout/`, `src/components/contact/`, `src/components/cart/`.
- Depends on: Handwritten types, Server Actions, `cn()`, and design tokens.
- Used by: Route layer and Storybook.

**Content Sanitization Layer:**

- Purpose: Converts Shopify-managed HTML into safe, tokenized markup.
- Contains: `src/lib/shopify/html-content.ts` and `src/components/ui/rich-text/rich-text.tsx`.
- Depends on: `sanitize-html`.
- Used by: Product descriptions, collection descriptions, static pages, articles, and comments.

## Data Flow

**Product Detail Page:**

1. `src/app/(storefront)/products/[handle]/page.tsx` awaits `params` and calls `getProduct(handle)`.
2. `getProduct()` uses `'use cache'`, `cacheTag('product', ...)`, and `cacheLife('hours')`.
3. `shopifyFetch()` posts the generated `GetProductDocument` to Shopify.
4. `src/lib/shopify/operations/product.ts` reshapes generated GraphQL types into local `Product`.
5. Server markup renders gallery, title, reviews, `ProductForm`, sanitized description, tags, JSON-LD, and related/recommendation sections.
6. `ProductForm` runs as a client leaf and calls `addToCartAction()`.

**Collection Listing:**

1. `src/app/(storefront)/collections/[handle]/page.tsx` awaits `params` and `searchParams`.
2. Sort/filter URL params are parsed and converted to Shopify `ProductFilter[]`.
3. `getCollectionProductsWithFilters()` fetches Shopify products and filter metadata.
4. Route-level helper functions normalize legacy Shopify HTML and category tags.
5. UI renders toolbar, filter panel, collection cards, sidebar cards, and structured data.

**Cart Flow:**

1. Client product forms call `addToCartAction(variantId, quantity)`.
2. `src/lib/cart/actions.ts` gets or creates a Shopify cart and stores the cart ID in `teavision_cart`.
3. `src/lib/shopify/operations/cart.ts` executes cart mutations.
4. `/cart` calls `getCartAction()`, renders lines, and posts update/remove forms through Server Actions.
5. Checkout is handed to Shopify through `cart.checkoutUrl`.

**Static Content and Blog Flow:**

1. Static pages and blog pages use Shopify page/blog/article queries.
2. HTML bodies are sanitized in `src/lib/shopify/html-content.ts`.
3. JSON-LD and metadata are generated from Shopify content and local helpers.

**Webhook Revalidation Flow:**

1. Shopify posts to `/api/webhooks/shopify`.
2. The route verifies HMAC over the raw request body.
3. Product/collection topics invalidate cache tags.
4. Unknown topics are accepted and ignored.

## State Management

- Cart state: Shopify cart ID in an HTTP-only cookie.
- Product/collection/page/blog data: Next cache tags and cache life.
- Client UI state: local React state in interactive leaves such as `ProductForm`, `ProductQuickView`, `QuantityStepper`, filters, dialogs, and carousels.
- No Redux, Zustand, database, or persistent local browser store is used.

## Key Abstractions

**`shopifyFetch()`:**

- Location: `src/lib/shopify/client.ts`.
- Purpose: Single Storefront GraphQL transport boundary.
- Pattern: Fail fast on missing credentials, throw on HTTP/GraphQL errors, default `cache: 'no-store'`.

**Operation Reshapers:**

- Locations: `src/lib/shopify/operations/*.ts`.
- Purpose: Convert generated Storefront response shapes into stable handwritten types.
- Pattern: Local `reshapeMoney()`, `reshapeImage()`, and feature-specific `reshape*()` helpers.

**Handwritten Public Types:**

- Location: `src/lib/shopify/types/index.ts`.
- Purpose: Public type surface for app code and generated document re-exports.
- Pattern: Do not import directly from `src/lib/shopify/types/generated/`.

**Design System Primitives:**

- Location: `src/components/ui/*`.
- Purpose: Shared presentational controls and surfaces.
- Pattern: Named exports, `cn()`, CVA variants where useful, Storybook stories.

**Section Layout Primitive:**

- Location: `src/components/ui/section/section.tsx`.
- Purpose: Page-level semantic section bands, containers, and intros.
- Pattern: Raw page-level `<section>` is banned by ESLint except inside this primitive.

## Entry Points

**Application Layout:**

- `src/app/layout.tsx` - Font loading, global metadata, and root HTML/body.
- `src/app/(storefront)/layout.tsx` - Header, footer, storefront `main`, and optional Searchanise script loader.

**Storefront Pages:**

- `src/app/(storefront)/page.tsx` - Homepage.
- `src/app/(storefront)/products/[handle]/page.tsx` - PDP.
- `src/app/(storefront)/collections/[handle]/page.tsx` - Collection listing with filters/sorting/category path.
- `src/app/(storefront)/cart/page.tsx` - Cart page.
- `src/app/(storefront)/blogs/[blog]/[article]/page.tsx` - Blog article.
- `src/app/(storefront)/pages/[...slug]/page.tsx` - Shopify static pages, excluding custom local pages.

**API Routes:**

- `src/app/api/webhooks/shopify/route.ts` - Shopify webhook revalidation.
- `src/app/api/products/[handle]/quick-view/route.ts` - Product JSON for quick view dialogs.

## Error Handling

**Strategy:** Fail fast at service boundaries, return user-safe messages at UI/action boundaries.

**Patterns:**

- `shopifyFetch()` throws on missing credentials, non-OK HTTP, and Storefront GraphQL errors.
- Cart mutations inspect Shopify `userErrors` and throw joined messages.
- Contact actions validate, rate-limit, and return `{ success, error }` instead of exposing thrown errors to forms.
- Third-party review fetch failures return `{}` so product pages degrade without blocking.
- Route handlers return JSON with explicit status codes.

## Cross-Cutting Concerns

**Validation:**

- Runtime narrowing uses `unknown` and helper guards, especially for GraphQL JSON-ish metafields, Searchanise/Trustoo responses, and collection filter params.

**Security:**

- Shopify webhook HMAC validation uses raw body bytes and timing-safe comparison.
- Contact forms include honeypot `website` fields and in-memory rate limiting.
- Shopify HTML is sanitized server-side before rendering.
- Secrets are read from env vars and must not be surfaced in client code unless they are explicitly public `NEXT_PUBLIC_*` values.

**Caching:**

- Use Next.js 16 Cache Components with `'use cache'`, `cacheTag()`, and `cacheLife()`.
- Webhooks invalidate product and collection cache tags.

**Accessibility:**

- Components use semantic controls, labels, `aria-live`, `aria-label`, and Storybook a11y addon.
- Icon-only buttons require accessible names.

---

_Architecture analysis: 2026-05-26_
_Update when major patterns change_
