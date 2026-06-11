# Teavision Storefront

Headless Shopify storefront for Teavision, Australia's wholesale tea, herb, and spice supplier.

The app replaces a constrained Shopify Liquid storefront with a Next.js 16 App Router build that can support product discovery, B2B inquiry flows, retail sample purchases, SEO content, and a reusable design system.

## Stack

- Next.js 16 with App Router, React 19, and Cache Components enabled
- Shopify Storefront GraphQL API for products, collections, carts, and checkout handoff
- Sanity CMS for Tea Journal content
- Tailwind CSS 4 with project design tokens in `src/app/globals.css`
- Storybook 10 for component documentation and interaction checks
- Vitest and Playwright for focused cart, Shopify, route-handler, and checkout-handoff coverage

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

At minimum, local storefront data requires:

```bash
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
```

Missing Shopify credentials fail fast through `shopifyFetch()` instead of falling back to stub data.

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
pnpm dev               # Start the Next.js dev server
pnpm build             # Create a production build
pnpm lint              # Run Tailwind class checks and ESLint
pnpm format            # Format the repo with Prettier
pnpm typecheck         # Run TypeScript without emitting files
pnpm codegen           # Regenerate Shopify GraphQL types
pnpm storybook         # Start Storybook on port 6006
pnpm test:unit         # Unit tests for pure helpers, transport, operations, and focused UI
pnpm test:integration  # Server Action and route-handler boundary tests
pnpm test:e2e          # Local fake-Shopify cart-to-checkout handoff coverage
pnpm test:stories      # Storybook story tests
```

Do not run real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests until the Shopify dev store is configured and the store owner explicitly approves checkout testing.

## Architecture

Storefront routes live under `src/app/(storefront)/`.

Server Components fetch storefront data through helpers in `src/lib/shopify/operations/`. Those helpers call `shopifyFetch()`, which wraps the Shopify Storefront GraphQL API. GraphQL source documents live in `src/lib/shopify/queries/`, and generated types are written to `src/lib/shopify/types/generated/`.

Cart state is held in the `teavision_cart` cookie. Server Actions in `src/lib/cart/actions.ts` handle cart mutations, update the cookie, and revalidate the cart page. There is no client-side cart store.

Expensive product, collection, page, blog, and review reads use Next.js 16 Cache Components patterns with `'use cache'`, `cacheTag()`, and `cacheLife()`.

## Key Routes

- `/` - storefront homepage
- `/products/[handle]` - product detail pages
- `/collections` and `/collections/[handle]` - collection index and listing pages
- `/cart` - cart review and checkout handoff
- `/search` - search page
- `/blogs/[blog]` and `/blogs/[blog]/[article]` - Tea Journal listing and articles
- `/pages/wholesale` - wholesale inquiry
- `/pages/contact` - contact form
- `/pages/new-product-development-order-form` - NPD order form

Dynamic App Router segments use the Next.js 16 `params: Promise<{ ... }>` pattern. Await `params` before destructuring.

## Project Layout

```text
src/app/(storefront)/       Storefront pages and route-only components
src/app/api/                API routes for search, quick view, and webhooks
src/components/             Shared UI, layout, and domain components
src/lib/shopify/            Storefront client, operations, queries, and exported types
src/lib/cart/actions.ts     Cart Server Actions
src/lib/contact/            Contact, wholesale, custom blend, and NPD actions
src/lib/sanity/             Sanity client, queries, and types
src/lib/searchanise/        Searchanise integration helpers
docs/                       Project, testing, and design-system documentation
```

Use `docs/conventions.md` before adding files. It is the canonical folder map and naming reference.

## Development Conventions

- Use named exports for components and library modules. Next.js special files are the exception.
- Keep `'use client'` on interactive leaves only.
- Use Tailwind token classes such as `bg-paper`, `bg-card`, `text-ink`, `text-brand`, and `ring-ring`.
- Use `cn()` from `@/lib/utils` for conditional class composition.
- Import Shopify types through `src/lib/shopify/types/index.ts`, not directly from generated files.
- Add Storybook stories for new shared components under `src/components/`.
- Scaffold new components and library modules with the project scripts:

```bash
pnpm create:component -- product/my-component
pnpm create:lib -- shopify/my-helper
```

## Environment

See `.env.example` for the full set of supported variables, including Shopify, Sanity, Resend, Trustoo, Searchanise, rate limiting, indexing, and webhook configuration.

Important production notes:

- `SITE_URL` drives canonical URLs and structured data.
- `DISABLE_INDEXING=true` keeps launch or preview storefronts out of search indexes.
- `RATE_LIMIT_EXTERNAL_PROTECTION=true` should be set when production form/search protection is handled outside the app.
- `RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true` is required if production intentionally accepts the in-memory rate-limit fallback.

## Documentation

- `AGENTS.md` - agent instructions and project guardrails
- `docs/conventions.md` - folder map, naming, styling, and scaffolding rules
- `PRODUCT.md` - product purpose, users, brand personality, and conversion goals
- `DESIGN.md` - visual and interaction direction
- `docs/design-system/` - design-system principles, foundations, and component notes
- `docs/testing/cart-checkout-uat.md` - cart and checkout-handoff UAT notes
