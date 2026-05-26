# Codebase Structure

**Analysis Date:** 2026-05-26

## Directory Layout

```text
teavision.com.au/
|-- src/
|   |-- app/                 # Next.js 16 App Router routes, layouts, API handlers, globals
|   |-- components/          # UI primitives and domain component folders
|   `-- lib/                 # Shopify, cart, contact, blog, reviews, SEO, utilities
|-- scripts/                 # Scaffolding scripts, custom ESLint rules, contract tests
|-- docs/                    # Project references, design system docs, historical plans/specs
|-- public/                  # Static assets served by Next
|-- .storybook/              # Storybook config
|-- node_modules/            # Installed dependencies, ignored by git
|-- .next/                   # Next build/dev output, ignored by git
|-- storybook-static/        # Storybook build output, ignored by git
|-- AGENTS.md                # Repository instructions
|-- package.json             # Scripts and dependencies
|-- codegen.ts               # Shopify GraphQL Codegen config
|-- eslint.config.mjs        # ESLint flat config and local rules
|-- next.config.ts           # Next.js config
`-- tsconfig.json            # TypeScript config and path aliases
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js routing, layouts, metadata, route handlers, global CSS.
- Storefront group: `src/app/(storefront)/`.
- API handlers: `src/app/api/webhooks/shopify/route.ts`, `src/app/api/products/[handle]/quick-view/route.ts`.
- Special files: `layout.tsx`, `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`.

**`src/components/ui/`:**
- Purpose: Reusable presentational primitives with no data fetching or business logic.
- Pattern: `component-name/component-name.tsx`, co-located `.stories.tsx`, and `index.ts`.
- Examples: `button`, `card`, `section`, `price`, `quantity-stepper`, `dialog`, `rich-text`.

**`src/components/product/`:**
- Purpose: Product-domain components.
- Examples: `product-form`, `product-gallery`, `product-quick-view`, `related-products-carousel`, `searchanise-recommendations`.

**`src/components/collection/`:**
- Purpose: Collection listing UI, filters, toolbar, and collection product cards.
- Examples: `collection-product-card`, `collection-filter-panel`, `collection-toolbar`.

**`src/components/homepage/`:**
- Purpose: Homepage-only sections and static content.
- Examples: `hero`, `catalogues`, `proof-points`, `supply-chain`, `tea-journal`.

**`src/components/layout/`:**
- Purpose: Shared page shell pieces.
- Examples: `header`, `footer`.

**`src/lib/shopify/`:**
- Purpose: Shopify transport, queries, operations, types, and HTML sanitization.
- Operations: `src/lib/shopify/operations/*.ts`.
- GraphQL source: `src/lib/shopify/queries/*.graphql`.
- Generated code: `src/lib/shopify/types/generated/`.
- Public type barrel: `src/lib/shopify/types/index.ts`.

**`src/lib/cart/`:**
- Purpose: Cart Server Actions.
- Key file: `src/lib/cart/actions.ts`.

**`src/lib/contact/`:**
- Purpose: Contact/newsletter/custom tea blend Server Actions and domain constants.
- Key files: `actions.ts`, `custom-tea-blend.ts`.

**`scripts/`:**
- Purpose: Project tooling and contract tests.
- Scaffolding: `scripts/create-component.mjs`, `scripts/create-lib.mjs`.
- ESLint rules: `scripts/eslint-rules/*.mjs`.
- Contract tests: `scripts/eslint-rules/*.test.mjs`, `scripts/component-contracts/*.test.mjs`.

**`docs/`:**
- Purpose: Design system, project references, historical implementation plans/specs.
- Important: `docs/conventions.md` is the folder map and code style reference before adding files.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx` - Root layout, fonts, metadata base.
- `src/app/(storefront)/layout.tsx` - Storefront shell and Searchanise script loader.
- `src/app/(storefront)/page.tsx` - Homepage.
- `src/app/(storefront)/products/[handle]/page.tsx` - Product detail page.
- `src/app/(storefront)/collections/[handle]/page.tsx` - Collection detail page.
- `src/app/(storefront)/cart/page.tsx` - Cart.

**Configuration:**
- `package.json` - Scripts/dependencies.
- `next.config.ts` - Cache Components and image remote patterns.
- `tsconfig.json` - Strict TypeScript and aliases.
- `eslint.config.mjs` - Next/Storybook/import/custom rules.
- `.prettierrc` - No semicolons, single quotes, trailing commas, Tailwind class sorting.
- `codegen.ts` - Shopify GraphQL Codegen.
- `.env.example` - Environment variable names only.

**Core Logic:**
- `src/lib/shopify/client.ts` - Storefront GraphQL transport.
- `src/lib/shopify/operations/product.ts` - Product/recommendations fetch and reshape.
- `src/lib/shopify/operations/collection.ts` - Collection/product filters fetch and reshape.
- `src/lib/shopify/operations/cart.ts` - Shopify cart mutations and reshape.
- `src/lib/cart/actions.ts` - Cart cookie and Server Action boundary.
- `src/lib/shopify/html-content.ts` - Sanitized Shopify HTML pipeline.
- `src/lib/contact/actions.ts` - Contact/newsletter/custom blend submission actions.

**Testing and Verification:**
- `src/components/**/*.stories.tsx` - Storybook component stories.
- `scripts/eslint-rules/*.test.mjs` - Node `node:test` coverage for local ESLint rules.
- `scripts/component-contracts/button-system.test.mjs` - Node `node:test` source contract checks.

**Documentation:**
- `AGENTS.md` - Required coding rules.
- `docs/conventions.md` - Folder map, component anatomy, styling, imports, scaffolding.
- `PRODUCT.md` - Brand/product context.
- `docs/design-system/` - Design system reference.

## Naming Conventions

**Files:**
- Kebab-case for component files and folders: `product-card.tsx`, `quantity-stepper.tsx`.
- `*.stories.tsx` co-located with components.
- `index.ts` barrels for component folders and component domains.
- `.graphql` files are domain-named: `product.graphql`, `cart.graphql`.
- Next special files follow framework names: `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`.

**Directories:**
- Domain folders under `src/components/` are singular business domains: `product`, `collection`, `homepage`, `layout`, `contact`, `cart`, `ui`.
- Application code lives under `src/`; do not recreate root-level `app/`, `components/`, or `lib/`.

**Exports:**
- Components and lib modules use named exports.
- Default exports are allowed for Next special files and Storybook stories.
- Cross-domain component imports use component barrels, e.g. `@/components/ui`.
- Lib imports use explicit paths, e.g. `@/lib/shopify/operations/product`.

## Where to Add New Code

**New UI primitive:**
- Scaffold with `pnpm create:component -- ui/<component-name>`.
- Add implementation, story, and export under `src/components/ui/`.

**New product-domain component:**
- Scaffold with `pnpm create:component -- product/<component-name>`.
- Add Storybook story unless there is a specific reason not to.

**New Shopify query:**
- Add or extend `src/lib/shopify/queries/<domain>.graphql`.
- Run `pnpm codegen`.
- Export public types through `src/lib/shopify/types/index.ts` rather than importing generated files directly.

**New Shopify fetch helper:**
- Add to `src/lib/shopify/operations/<domain>.ts`.
- Use `shopifyFetch()`, typed generated documents, local reshape helpers, and cache directives where appropriate.

**New cart mutation:**
- Add Server Action behavior to `src/lib/cart/actions.ts`.
- Delegate Storefront mutation details to `src/lib/shopify/operations/cart.ts`.

**New contact/email behavior:**
- Add validation and action code to `src/lib/contact/actions.ts` or supporting domain constants in `src/lib/contact/`.

**New page:**
- Add under `src/app/(storefront)/`.
- Use `params: Promise<...>` and `searchParams: Promise<...>` patterns for dynamic routes in Next.js 16.

## Special Directories

**`src/lib/shopify/types/generated/`:**
- Purpose: Generated GraphQL Codegen output.
- Source: `pnpm codegen`.
- Rule: Do not edit manually and do not import directly from app code.

**`.next/`, `storybook-static/`, `node_modules/`, `.worktrees/`:**
- Purpose: Generated or local tooling output.
- Committed: No, ignored by `.gitignore`.

**`../teavision-theme`:**
- Purpose: Sibling Shopify Liquid theme used as migration/reference material.
- Committed in this repo: No.
- Use carefully when investigating legacy app integrations or Liquid behavior.

---

*Structure analysis: 2026-05-26*
*Update when directory structure changes*
