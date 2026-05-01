<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm codegen      # Regenerate GraphQL types from Shopify schema
pnpm storybook    # Component dev/docs on port 6006
```

No test runner outside Storybook. To run a single Storybook story in isolation, open `http://localhost:6006/?path=/story/<story-id>`.

## Architecture

**Headless Shopify storefront** built on Next.js 16 App Router with React 19. All product, collection, cart, and checkout data comes from the Shopify Storefront GraphQL API.

### Data flow

- **Server Components** fetch data by calling `lib/shopify/index.ts` helpers (e.g. `getProduct`, `getCollection`, `getCart`)
- Those helpers call `shopifyFetch()` which wraps the Storefront GraphQL API
- Queries live in `lib/shopify/queries/*.graphql`; TypeScript types are generated into `lib/shopify/types/generated/` via `pnpm codegen`
- **Cart state** lives in a cookie (`teavision_cart`) holding the Shopify cart ID — no client-side store
- **Server Actions** in `lib/cart/actions.ts` handle all cart mutations; they read/write the cookie and call Shopify
- **`'use cache'`** (Next.js 16 Cache Components) with `cacheTag()` and `cacheLife()` wraps expensive product/collection fetches

### Routing

All storefront pages live under `app/(storefront)/`. Dynamic segments use the Next.js 16 `params: Promise<{...}>` pattern — always `await params` before destructuring.

Key routes:
- `/products/[handle]` — product detail
- `/collections/[handle]` — collection listing
- `/cart` — cart page
- `/blogs/[blog]/[article]` — Tea Journal articles
- `/pages/wholesale` — wholesale inquiry

### Component conventions

- **`'use client'`** only on interactive leaves (forms, quantity controls, cart buttons)
- **`'use server'`** on Server Actions files
- All styling via Tailwind 4 utilities — no CSS modules, no inline styles
- Use `cn()` from `@/lib/utils` for all className composition — never array concatenation or template literals
- Design tokens defined in `app/globals.css` via `@theme`; use token class names (`bg-background`, `text-primary`, `ring-ring`) rather than raw hex values
- The palette is warm/botanical — never introduce cool grays

### Environment variables

```
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
```

Lib functions fall back to stub data when the token is absent, so the dev server runs without credentials.

### Storybook

Stories are co-located with components as `*.stories.tsx`. Uses `@storybook/nextjs-vite` framework. Add a story whenever building a new UI component.

## Do not

These anti-patterns are explicitly banned — they override any default AI behavior:

- No default exports on components or lib modules (Next.js special files are excepted)
- No `any` type — use `unknown` and narrow, or define a proper type
- No raw hex/rgb values in className — use design token class names only (`text-primary` not `text-[#3d3d35]`)
- No className string concatenation or `filter(Boolean).join(' ')` — always use `cn()` from `@/lib/utils`
- No `'use client'` on parent/wrapper components — push it down to the interactive leaf
- No new CSS modules, styled-components, or `style={{}}` attributes
- No direct imports from `lib/shopify/types/generated/` — import via `lib/shopify/types/index.ts`
- No creating new top-level directories in `components/` or `lib/` without updating `docs/conventions.md`

## Before adding a file

1. Does a similar file already exist that should be extended instead?
2. Which directory does it belong in? (check `docs/conventions.md` folder map)
3. Does it need a Storybook story? (yes if it lives in `components/`)
4. Scaffold it: `pnpm create:component <domain>/<name>` or `pnpm create:lib <domain>/<name>`
