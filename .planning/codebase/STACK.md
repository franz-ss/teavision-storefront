# Technology Stack

**Analysis Date:** 2026-05-26

## Languages

**Primary:**

- TypeScript 5.x - All application code under `src/`, Next.js route files, Shopify operations, and components.
- TSX / React JSX - UI components and App Router pages.

**Secondary:**

- JavaScript / MJS - Tooling scripts in `scripts/`, ESLint configuration, Storybook configuration, PostCSS configuration.
- GraphQL - Shopify Storefront API documents in `src/lib/shopify/queries/*.graphql`.
- CSS - Tailwind 4 entrypoint and design tokens in `src/app/globals.css`, plus design-system reference files in `docs/design-system/`.

## Runtime

**Environment:**

- Node.js - Required for Next.js, Storybook, GraphQL codegen, and scripts. No explicit Node engine is declared in `package.json`.
- Browser runtime - Client-only leaves use React hooks and browser APIs where needed.

**Package Manager:**

- pnpm - `pnpm-lock.yaml` and `pnpm-workspace.yaml` are present.
- Workspace shape: single package workspace with `packages: ['.']`.

## Frameworks

**Core:**

- Next.js 16.2.4 - App Router storefront, Server Components, Server Actions, route handlers, metadata, and image optimization.
- React 19.2.4 / React DOM 19.2.4 - Component runtime.
- Tailwind CSS 4 - Utility styling through `@import 'tailwindcss'` and `@theme inline` tokens in `src/app/globals.css`.

**Data and Generated Types:**

- Shopify Storefront GraphQL API 2026-04 - Storefront data source for products, collections, carts, pages, blogs, and checkout URLs.
- GraphQL Code Generator 6.x with client preset - Generates typed documents into `src/lib/shopify/types/generated/`.
- `graphql` and `@graphql-typed-document-node/core` - Typed GraphQL document support.

**UI and Component Tooling:**

- Storybook 10.3.5 with `@storybook/nextjs-vite` - Component documentation and interactive verification.
- `@storybook/addon-a11y`, docs, onboarding, Vitest addon, and Chromatic addon are configured.
- `class-variance-authority`, `clsx`, and `tailwind-merge` - Component variants and class composition via `cn()`.
- `lucide-react` - Icon set.
- `embla-carousel-react` - Product recommendation carousel.

**Server Utilities:**

- `resend` - Contact and newsletter email delivery.
- `sanitize-html` - Server-side sanitization for Shopify page/article/product HTML.

## Key Dependencies

**Critical:**

- `next` - Routing, rendering, caching, image optimization, metadata, Server Actions.
- `react` / `react-dom` - UI runtime.
- `graphql` / GraphQL Codegen packages - Shopify typed document pipeline.
- `resend` - Production contact/newsletter mail path.
- `sanitize-html` - Safety boundary for Shopify-managed rich HTML.

**Design System:**

- `tailwindcss`, `@tailwindcss/postcss`, `prettier-plugin-tailwindcss` - Tailwind 4 styling and class ordering.
- `class-variance-authority`, `clsx`, `tailwind-merge` - Variant APIs and class merging.
- `lucide-react` - Button and control icons.

## Configuration

**Environment:**

- `.env.local` is gitignored and must not be read into docs.
- `.env.example` documents required names: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_WEBHOOK_SECRET`, `SHOPIFY_ADMIN_API_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN`, `NEXT_PUBLIC_SEARCHANISE_ENABLED`, `NEXT_PUBLIC_SEARCHANISE_API_KEY`, and `RESEND_API_KEY`.
- `shopifyFetch()` fails fast when Storefront credentials are missing.

**Build and Tooling:**

- `next.config.ts` enables `cacheComponents: true` and allows remote images from `cdn.shopify.com`.
- `tsconfig.json` is strict, uses bundler module resolution, and defines aliases `@/components/*`, `@/lib/*`, and `@/*`.
- `eslint.config.mjs` extends Next core web vitals and TypeScript config, Storybook rules, import ordering, no default exports for components/lib, and Teavision custom UI rules.
- `codegen.ts` points GraphQL Codegen at Shopify Storefront API version `2026-04`.

## Commands

```bash
pnpm dev          # Next development server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm codegen      # Shopify GraphQL code generation
pnpm storybook    # Storybook on port 6006
```

## Platform Requirements

**Development:**

- Requires Shopify Storefront credentials for real product/collection/cart data.
- Use `pnpm` commands; npm/yarn examples in the stock `README.md` are not the project convention.
- Storybook is the primary component verification surface.

**Production:**

- Suitable for Vercel-style Next.js hosting, but deployment config is not committed.
- External runtime dependencies are Shopify, Trustoo, Searchanise when enabled, and Resend when contact/newsletter email is enabled.

---

_Stack analysis: 2026-05-26_
_Update after major dependency or runtime changes_
