<!-- refreshed: 2026-06-11 -->
# Architecture

**Analysis Date:** 2026-06-11

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                  Next.js 16 App Router                       │
├──────────────────┬──────────────────┬───────────────────────┤
│  Storefront UI   │   API Routes     │   Metadata/SEO        │
│ `src/app/(...)`  │ `src/app/api`    │ `src/app/*`,          │
│                  │                  │ `src/lib/seo`         │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                    │
         ▼                  ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│          Shared UI, Server Actions, Domain Operations        │
│ `src/components`, `src/lib/cart`, `src/lib/contact`,         │
│ `src/lib/shopify/operations`, `src/lib/blog`,                │
│ `src/lib/searchanise`                                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│       External Stores and Services                           │
│ Shopify Storefront GraphQL, Shopify Cart/Checkout,           │
│ Sanity, Searchanise, Trustoo, Resend                          │
│ clients in `src/lib/shopify`, `src/lib/sanity`,              │
│ `src/lib/searchanise`, `src/lib/reviews`, `src/lib/contact`  │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root App Shell | Defines document shell, fonts, global metadata, and global CSS import. | `src/app/layout.tsx` |
| Storefront Shell | Wraps public storefront routes with skip link, header, main landmark, and footer. | `src/app/(storefront)/layout.tsx` |
| Homepage Route | Composes static homepage sections and passes contact/newsletter Server Actions into form components. | `src/app/(storefront)/page.tsx` |
| Product Route | Fetches Shopify product data, metadata, JSON-LD, analytics scripts, product form, recommendations, and reviews. | `src/app/(storefront)/products/[handle]/page.tsx` |
| Collection Route | Fetches collection metadata and delegates paginated/filterable page rendering to route-local components. | `src/app/(storefront)/collections/[handle]/page.tsx`, `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` |
| Cart Route | Reads the cart through Server Actions and renders route-local cart UI inside a Suspense boundary. | `src/app/(storefront)/cart/page.tsx` |
| Blog Routes | Fetch Sanity-backed article/listing data and render Tea Journal pages, tag pages, article pages, and Atom feed. | `src/app/(storefront)/blogs/[blog]/page.tsx`, `src/app/(storefront)/blogs/[blog]/[article]/page.tsx`, `src/app/(storefront)/blogs/[blog]/atom/route.ts` |
| Static Service Pages | Compose route-local content sections and static data for wholesale, certifications, contact, FAQ, and service pages. | `src/app/(storefront)/pages/*/page.tsx` |
| Quick View API | Returns a JSON projection of Shopify product data for quick-view UI. | `src/app/api/products/[handle]/quick-view/route.ts` |
| Search Suggestions API | Returns Searchanise-backed product suggestions for header/search UI. | `src/app/api/search/suggestions/route.ts` |
| Shopify Webhook | Verifies Shopify HMAC signatures and invalidates product, collection, and page cache tags. | `src/app/api/webhooks/shopify/route.ts` |
| Sanity Webhook | Verifies Sanity webhook signatures and invalidates blog/article cache tags. | `src/app/api/webhooks/sanity/route.ts` |
| Shopify Client | Wraps Storefront GraphQL POST requests, generated typed documents, endpoint headers, and error handling. | `src/lib/shopify/client.ts` |
| Shopify Operations | Own read operations and reshape raw GraphQL nodes into app-facing types. | `src/lib/shopify/operations/product.ts`, `src/lib/shopify/operations/collection.ts`, `src/lib/shopify/operations/cart.ts`, `src/lib/shopify/operations/storefront-page.ts` |
| Cart Server Actions | Own cart cookie reads/writes and cart mutations. | `src/lib/cart/actions.ts` |
| Contact Server Actions | Own form parsing, validation, rate limiting, honeypot behavior, and Resend delivery. | `src/lib/contact/actions.ts` |
| Blog Operations | Own Sanity blog queries, reshaping, cache tags, pagination, tag filtering, and URL helpers. | `src/lib/blog/operations.ts` |
| Shared Components | Reusable presentational primitives and domain feature components. | `src/components/ui`, `src/components/product`, `src/components/collection`, `src/components/search`, `src/components/layout` |

## Pattern Overview

**Overall:** Server-first headless commerce storefront using Next.js App Router, route-local composition, domain operation modules, and Server Actions for mutations.

**Key Characteristics:**
- Keep pages and layouts in `src/app`; keep reusable UI in `src/components`; keep I/O, data shaping, Server Actions, and helpers in `src/lib`.
- Fetch data from Server Components and route handlers through operation helpers such as `getProduct` in `src/lib/shopify/operations/product.ts:582`, `getCollection` in `src/lib/shopify/operations/collection.ts:297`, and `getBlog` in `src/lib/blog/operations.ts:387`.
- Use Next.js 16 Cache Components: `next.config.ts:4` enables `cacheComponents`, cached operations use `'use cache'`, `cacheTag()`, and `cacheLife()`, and runtime-only APIs such as `cookies()` stay outside cached functions.
- Keep cart state server-owned in the `teavision_cart` cookie through `src/lib/cart/actions.ts:88`, `src/lib/cart/actions.ts:107`, and mutation actions at `src/lib/cart/actions.ts:116`, `src/lib/cart/actions.ts:138`, `src/lib/cart/actions.ts:161`.
- Keep route-only UI and helpers private under `src/app/**/_components` and `src/app/**/_lib`; move reused UI to `src/components/<domain>/<component-name>/`.
- Import generated Shopify types only through `src/lib/shopify/types/index.ts`; never import from `src/lib/shopify/types/generated/` directly.

## Layers

**Application Routes:**
- Purpose: Define URL structure, metadata, route handlers, loading/error boundaries, and page-level composition.
- Location: `src/app`
- Contains: `layout.tsx`, `page.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`.
- Depends on: `src/components`, `src/lib`, Next.js App Router APIs.
- Used by: Next.js runtime.

**Storefront Route Group:**
- Purpose: Own public storefront routes without adding a URL segment.
- Location: `src/app/(storefront)`
- Contains: Homepage, product, collection, cart, blog, search, and service-page routes.
- Depends on: Shared layout from `src/components/layout`, shared primitives from `src/components/ui`, domain operations from `src/lib`.
- Used by: Public storefront requests.

**Route-Local Components and Helpers:**
- Purpose: Isolate UI and helpers used by one App Router segment.
- Location: `src/app/**/_components`, `src/app/**/_lib`
- Contains: Route sections, JSON-LD renderers, page helpers, route-specific static data, and route-local types.
- Depends on: Shared primitives/domain components and `src/lib` helpers.
- Used by: Adjacent route `page.tsx` or nested route components only.

**Shared UI Components:**
- Purpose: Provide reusable primitives, layout shells, and domain feature components with Storybook coverage.
- Location: `src/components`
- Contains: `src/components/ui`, `src/components/layout`, `src/components/product`, `src/components/collection`, `src/components/search`, `src/components/blog`, `src/components/contact`, `src/components/homepage`.
- Depends on: React, Next client APIs for interactive leaves, `src/lib/utils`, and domain types.
- Used by: App routes and route-local components.

**Shopify Data Layer:**
- Purpose: Encapsulate Storefront GraphQL queries, generated GraphQL types, app-facing reshaping, cache policy, and cart transport.
- Location: `src/lib/shopify`
- Contains: `src/lib/shopify/client.ts`, `src/lib/shopify/operations`, `src/lib/shopify/queries`, `src/lib/shopify/types`.
- Depends on: Shopify Storefront API credentials through `src/lib/shopify/env.ts`, generated GraphQL documents in `src/lib/shopify/types`.
- Used by: Product, collection, cart, page, sitemap, route-handler, and recommendation flows.

**Mutation Actions:**
- Purpose: Handle server-side mutations invoked from forms/client components.
- Location: `src/lib/cart/actions.ts`, `src/lib/contact/actions.ts`
- Contains: `'use server'` modules, validation, cookie access, rate limiting, revalidation, and provider calls.
- Depends on: `next/headers`, `next/cache`, Shopify cart operations, Resend, `src/lib/rate-limit`.
- Used by: Cart components, product add-to-cart flows, contact pages, newsletter and enquiry forms.

**Content and Search Integrations:**
- Purpose: Encapsulate non-Shopify reads and adapters.
- Location: `src/lib/blog`, `src/lib/sanity`, `src/lib/searchanise`, `src/lib/reviews`
- Contains: Sanity clients and queries, Searchanise normalization, Trustoo review fetches, blog pagination/filtering.
- Depends on: Sanity, Searchanise, Trustoo, environment helpers.
- Used by: Blog routes, homepage Tea Journal section, product review UI, site search, and header suggestions.

**Environment and Cross-Cutting Helpers:**
- Purpose: Centralize environment reads, SEO helpers, rate limiting, class composition, and small domain utilities.
- Location: `src/lib/env`, `src/lib/seo`, `src/lib/rate-limit`, `src/lib/utils.ts`
- Contains: Required/optional env readers, public/server env accessors, `SITE_URL`, noindex helpers, inline JSON serialization, `cn()`.
- Depends on: Runtime environment and small utility packages.
- Used by: Routes, actions, operations, components, and tests.

## Data Flow

### Product Detail Request Path

1. Next invokes the product route and metadata functions at `src/app/(storefront)/products/[handle]/page.tsx:74` and `src/app/(storefront)/products/[handle]/page.tsx:394`; `params` and `searchParams` are Promise values and must be awaited before use.
2. `ProductContent` awaits route params and calls `getProduct(handle, PRODUCT_DETAIL_CACHE_VERSION)` from `src/app/(storefront)/products/[handle]/page.tsx:95`.
3. `getProduct` runs as a cached operation with `cacheTag('product', ...)` in `src/lib/shopify/operations/product.ts:582` and `src/lib/shopify/operations/product.ts:587`.
4. `getProduct` calls `shopifyFetch()` at `src/lib/shopify/operations/product.ts:589`; `shopifyFetch()` posts the typed GraphQL document to Shopify in `src/lib/shopify/client.ts:17`.
5. Product operations reshape GraphQL data into app-facing `Product` types, including variant pagination, legacy inventory, and bulk pricing tiers in `src/lib/shopify/operations/product.ts`.
6. The page composes shared product UI from `src/components/product` and route-only recommendation components from `src/app/(storefront)/products/[handle]/_components`.
7. Product recommendations and review summaries load through Suspense-backed server components and cached helpers such as `getProductRecommendations` in `src/lib/shopify/operations/product.ts:655` and `getTrustooProductRatings` in `src/lib/reviews/trustoo.ts:56`.

### Collection Listing Request Path

1. The collection route awaits `params` in `generateMetadata()` and calls `getCollection(handle)` in `src/app/(storefront)/collections/[handle]/page.tsx:14`.
2. The route delegates rendering to `PageContent` in `src/app/(storefront)/collections/[handle]/page.tsx:54`.
3. `PageContent` in `src/app/(storefront)/collections/[handle]/_components/page-content.tsx:45` reads `params` and `searchParams`, derives filter/sort/page state, and calls collection operation helpers.
4. `getCollectionProductsWithFilters()` caches collection products with `cacheTag('collection', ...)` and calls Shopify through `shopifyFetch()` in `src/lib/shopify/operations/collection.ts:383` and `src/lib/shopify/operations/collection.ts:395`.
5. Shared collection UI such as `src/components/collection/product-card/product-card.tsx`, `src/components/collection/toolbar/toolbar.tsx`, and route-local sidebar/hero components render the response.

### Cart Mutation Path

1. Product and cart interactive leaves call Server Actions exported from `src/lib/cart/actions.ts`.
2. `addToCartAction()` validates quantity, reads or creates the cart, and calls `addCartLines()` in `src/lib/cart/actions.ts:116`.
3. `getOrCreateCart()` reads and writes the `teavision_cart` HTTP-only cookie through `cookies()` in `src/lib/cart/actions.ts:88`.
4. Shopify cart transport happens in `src/lib/shopify/operations/cart.ts`; `addCartLines()`, `updateCartLines()`, and `removeCartLines()` use `cache: 'no-store'` at `src/lib/shopify/operations/cart.ts:182`, `src/lib/shopify/operations/cart.ts:196`, and `src/lib/shopify/operations/cart.ts:211`.
5. Mutations call `revalidatePath('/cart')` in `src/lib/cart/actions.ts` so the cart route at `src/app/(storefront)/cart/page.tsx:29` renders fresh data.

### Blog Content Path

1. Blog routes in `src/app/(storefront)/blogs/[blog]` call helpers from `src/lib/blog/operations.ts`.
2. `getBlog()`, `getArticle()`, `getDefaultBlogListing()`, and `getHomepageArticles()` use `'use cache'`, `cacheTag()`, and `cacheLife()` at `src/lib/blog/operations.ts:387`, `src/lib/blog/operations.ts:423`, `src/lib/blog/operations.ts:451`, and `src/lib/blog/operations.ts:515`.
3. Blog operations call `sanityFetch()` in `src/lib/sanity/client.ts:44`; Sanity client configuration lives in `src/lib/sanity/client.ts:11`.
4. `src/app/api/webhooks/sanity/route.ts:30` verifies webhook payloads and calls `revalidateTag()` for `blog`, `blog-${slug}`, and `article-${blogSlug}-${articleSlug}` tags at `src/app/api/webhooks/sanity/route.ts:68`.

### Search Path

1. Search pages and APIs derive query/filter/sort input from URL state in `src/app/(storefront)/search/page.tsx` and `src/app/api/search/suggestions/route.ts`.
2. `getSearchaniseSearchResults()` in `src/lib/searchanise/search.ts:516` validates configuration, builds the Searchanise URL, fetches with `cache: 'no-store'`, normalizes product/facet/pagination data, and returns an app-facing result.
3. Shared search components in `src/components/search` render facets, sorting, pagination, alerts, and product result lists.

**State Management:**
- Persistent cart state is a server-managed Shopify cart ID in the `teavision_cart` cookie from `src/lib/cart/actions.ts`.
- Route view state lives in URLs: dynamic route segments, `searchParams`, collection filters, sort values, blog tags, and search query params.
- Client state is limited to interactive leaves such as form controls, dialogs, quantity controls, and navigation overlays in `src/components/*`; parent route shells stay server components.
- Cached data state is owned by Next.js Cache Components through `'use cache'`, `cacheTag()`, `cacheLife()`, webhook `revalidateTag()`, and mutation `revalidatePath()`.

## Key Abstractions

**Operation Modules:**
- Purpose: Present typed, app-facing read APIs over external systems.
- Examples: `src/lib/shopify/operations/product.ts`, `src/lib/shopify/operations/collection.ts`, `src/lib/shopify/operations/storefront-page.ts`, `src/lib/blog/operations.ts`
- Pattern: Export named async functions such as `getProduct`, `getCollection`, `getDefaultBlogListing`; keep raw API response reshaping private in the same module.

**GraphQL Query Sources and Generated Types:**
- Purpose: Keep Shopify queries editable as `.graphql` files and generated types isolated.
- Examples: `src/lib/shopify/queries/product.graphql`, `src/lib/shopify/types/generated/graphql.ts`, `src/lib/shopify/types/index.ts`
- Pattern: Codegen writes generated files; handwritten app code imports public types and documents through `src/lib/shopify/types/index.ts`.

**Server Actions:**
- Purpose: Provide server-only mutation boundaries for forms and interactive client leaves.
- Examples: `src/lib/cart/actions.ts`, `src/lib/contact/actions.ts`
- Pattern: Put `'use server'` at the top of the actions module; export named actions with `Action` suffix; parse and validate form data in the action module.

**Route-Local Modules:**
- Purpose: Keep one-route components/helpers close to their route without promoting them to shared APIs.
- Examples: `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`, `src/app/(storefront)/products/[handle]/_lib/shopify-analytics.ts`, `src/app/(storefront)/pages/contact/_lib/page-data.ts`
- Pattern: Use `_components` for route-only React components and `_lib` for route-only constants, helpers, and types.

**Section Primitive:**
- Purpose: Standardize semantic page sections, spacing, tones, and containers.
- Examples: `src/components/ui/section/section.tsx:47`, `src/components/ui/section/section.tsx:69`, `src/components/ui/section/section.tsx:94`
- Pattern: Use `Section.Root`, `Section.Container`, and `Section.Intro` for storefront layout bands instead of raw page-level `<section>` elements.

**Environment Readers:**
- Purpose: Centralize server/public/tooling environment reads and fail-fast rules.
- Examples: `src/lib/env/server.ts`, `src/lib/env/public.ts`, `src/lib/env/read.ts`, `src/lib/shopify/env.ts`, `src/lib/sanity/env.ts`
- Pattern: Access env vars through typed helper functions; do not read `process.env` directly in components or route pages.

**Class Composition:**
- Purpose: Merge Tailwind classes predictably.
- Examples: `src/lib/utils.ts`, `src/components/ui/section/section.tsx`
- Pattern: Use `cn()` from `@/lib/utils` for conditional className composition.

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every Next.js route render.
- Responsibilities: HTML shell, global font variables, global metadata defaults, `src/app/globals.css`.

**Storefront Layout:**
- Location: `src/app/(storefront)/layout.tsx`
- Triggers: Public storefront route renders under `(storefront)`.
- Responsibilities: Header/footer shell, skip link, main landmark.

**Storefront Pages:**
- Location: `src/app/(storefront)/**/page.tsx`
- Triggers: Browser navigation and server requests.
- Responsibilities: Route metadata, parameter/search parameter parsing, Server Component composition, and route-local UI delegation.

**Route Handlers:**
- Location: `src/app/api/**/route.ts`, `src/app/(storefront)/blogs/[blog]/atom/route.ts`
- Triggers: HTTP requests to API/feed endpoints.
- Responsibilities: JSON/feed responses, webhook verification, cache invalidation, quick-view and search suggestion boundaries.

**SEO Metadata Routes:**
- Location: `src/app/robots.ts`, `src/app/sitemap.ts`
- Triggers: Metadata route requests.
- Responsibilities: Robots and sitemap generation using SEO helpers and Shopify product/collection reads.

**Shopify Transport:**
- Location: `src/lib/shopify/client.ts:17`
- Triggers: Calls from Shopify operation modules.
- Responsibilities: Storefront GraphQL POST, endpoint headers, GraphQL printing, HTTP/API error handling.

**Server Actions:**
- Location: `src/lib/cart/actions.ts`, `src/lib/contact/actions.ts`
- Triggers: React form actions and client component event flows.
- Responsibilities: Mutations, validation, cookies, rate limiting, external writes, cache/path revalidation.

## Architectural Constraints

- **Threading:** Next.js/React server runtime with request-scoped async execution. Do not keep request-specific mutable module state in Server Components or route handlers.
- **Global state:** `src/lib/rate-limit/index.ts` uses an in-memory fallback store for local or explicitly accepted deployments; cart state belongs in the Shopify cart plus `teavision_cart` cookie, not a client store.
- **Cache Components:** `next.config.ts:4` enables Cache Components. Use `'use cache'` only in functions that do not access request runtime APIs such as `cookies()`, `headers()`, or raw `searchParams`; pass serializable values into cached helpers.
- **Dynamic params:** Dynamic App Router pages use the Next.js 16 `params: Promise<{...}>` pattern. Always `await params` before destructuring, as in `src/app/(storefront)/products/[handle]/page.tsx:74`.
- **External data:** Shopify credentials are required; missing Shopify config should fail through `shopifyFetch()`/env helpers rather than falling back to stub product data.
- **Generated code:** Do not manually edit files under `src/lib/shopify/types/generated/`; update `.graphql` files under `src/lib/shopify/queries` and run codegen.
- **Circular imports:** No circular dependency chain is documented. Preserve the directional import rule: routes -> components/lib, components -> UI/lib/types, lib -> other lib modules. Avoid importing app route modules from `src/components` or `src/lib`.
- **Styling:** Use Tailwind 4 token utilities from `src/app/globals.css`; do not introduce CSS modules, inline styles, raw hex classes, or cool gray palette classes.

## Anti-Patterns

### Client Wrapper Creep

**What happens:** Parent route wrappers, layouts, or large domain containers are marked `'use client'`.
**Why it's wrong:** It pushes server-rendered composition and data across the client boundary, increases bundle size, and conflicts with the server-first App Router architecture.
**Do this instead:** Keep pages/layouts as Server Components in `src/app/(storefront)/**/page.tsx` and move interactivity into leaf components such as `src/components/product/product-form/product-form.tsx` or cart line controls under `src/app/(storefront)/cart/_components`.

### Data Fetching in Components That Should Be Presentational

**What happens:** Shared UI/domain components call Shopify, Sanity, Searchanise, or Resend directly.
**Why it's wrong:** It blurs reusable UI boundaries and makes Storybook/test isolation harder.
**Do this instead:** Fetch in route Server Components or `src/lib/*/operations` modules, then pass typed props into components under `src/components`. Use `src/lib/shopify/operations/product.ts`, `src/lib/blog/operations.ts`, or `src/lib/searchanise/search.ts` for external reads.

### Generated Type Bypass

**What happens:** App code imports from `src/lib/shopify/types/generated/`.
**Why it's wrong:** Generated files are implementation detail and can churn with codegen.
**Do this instead:** Import Shopify types and generated documents through `src/lib/shopify/types/index.ts`; add exported app-facing types there when needed.

### Route-Only Code Promoted Too Early

**What happens:** Single-route page sections are placed in `src/components` before reuse exists.
**Why it's wrong:** It expands shared API surface and weakens route ownership.
**Do this instead:** Put one-route UI in adjacent `_components` folders such as `src/app/(storefront)/pages/contact/_components`; promote to `src/components/<domain>/<component-name>/` only when reused or Storybook-worthy.

### Raw Section Markup for Storefront Bands

**What happens:** Page-level layout bands use raw `<section>` with ad hoc spacing/background classes.
**Why it's wrong:** It bypasses design tokens and creates inconsistent vertical rhythm.
**Do this instead:** Use `Section.Root`, `Section.Container`, and `Section.Intro` from `src/components/ui/section/section.tsx`.

## Error Handling

**Strategy:** Fail fast for required external configuration and normalize user-facing errors at route/action boundaries.

**Patterns:**
- `shopifyFetch()` throws on non-OK HTTP responses and GraphQL errors in `src/lib/shopify/client.ts:17`; callers decide whether to render not-found, fallback, or error UI.
- Product and collection pages call `notFound()` or noindex metadata when Shopify resources are missing, as in `src/app/(storefront)/products/[handle]/page.tsx` and `src/app/(storefront)/collections/[handle]/page.tsx`.
- API routes catch provider errors and return JSON with appropriate status codes, as in `src/app/api/products/[handle]/quick-view/route.ts:23`.
- Cart actions map Shopify/validation failures to stable messages in `src/lib/cart/actions.ts`.
- Contact actions validate and rate-limit before Resend calls, return typed result objects, and log provider failures without logging submitted secrets in `src/lib/contact/actions.ts`.
- Webhook routes verify signatures before cache invalidation in `src/app/api/webhooks/shopify/route.ts` and `src/app/api/webhooks/sanity/route.ts`.

## Cross-Cutting Concerns

**Logging:** Use `console.warn` and `console.error` sparingly in server-only provider/action boundaries such as `src/lib/contact/actions.ts`, `src/lib/shopify/operations/product.ts`, and `src/lib/rate-limit/index.ts`. Do not log request bodies, credentials, cart IDs, or form values.

**Validation:** Use explicit parsing/narrowing helpers in action and adapter modules, for example `readStringField()` and domain validators in `src/lib/contact/actions.ts`, Searchanise response guards in `src/lib/searchanise/search.ts`, and Shopify mapper helpers in `src/lib/shopify/operations/mappers.ts`.

**Authentication:** No customer authentication layer is present. Server trust boundaries are Shopify Storefront token configuration, Shopify/Sanity webhook signatures, Resend API key access, and HTTP-only cart cookie handling.

**Caching:** Product, collection, page, blog, and review reads use Cache Components with `cacheTag()` and `cacheLife()` in operation modules. Cart and Searchanise search reads use `cache: 'no-store'`.

**SEO:** Metadata and noindex behavior use `src/lib/seo/noindex.ts`, `src/lib/seo/site-url.ts`, and `src/lib/seo/serialize-inline-json.ts`. Product, collection, homepage, page, and article routes emit JSON-LD where needed.

**Styling:** Tailwind 4 tokens and `cn()` are the styling boundary. Design tokens live in `src/app/globals.css`; reusable section layout lives in `src/components/ui/section/section.tsx`.

---

*Architecture analysis: 2026-06-11*
