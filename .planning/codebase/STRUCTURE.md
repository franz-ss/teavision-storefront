# Codebase Structure

**Analysis Date:** 2026-06-11

## Directory Layout

```text
teavision.com.au/
├── .agents/skills/                 # Project-local Codex skills and rule indexes
├── .planning/                      # GSD project planning, generated codebase maps, graphs, and phase artifacts
├── .storybook/                     # Storybook configuration
├── design/                         # Design/reference assets and artifacts
├── docs/                           # Project documentation and canonical conventions
├── public/                         # Static public assets served by Next.js
├── scripts/                        # Scaffolding and tooling scripts
├── src/                            # Application source root
│   ├── app/                        # Next.js App Router routes, layouts, metadata routes, and API routes
│   │   ├── (storefront)/           # Public storefront route group
│   │   └── api/                    # Route handlers for JSON/webhooks
│   ├── components/                 # Shared UI primitives, layout shells, and reusable domain components
│   └── lib/                        # Data access, Server Actions, integrations, env, SEO, and utilities
├── tests/                          # E2E/integration support and fake-provider tests
├── next.config.ts                  # Next.js 16 config; Cache Components enabled
├── package.json                    # Scripts and dependencies
├── codegen.ts                      # Shopify GraphQL code generation config
├── vitest.config.mts               # Unit/integration test config
├── vitest.storybook.config.mts     # Storybook test config
├── playwright.config.ts            # E2E test config
└── tsconfig.json                   # TypeScript path aliases and compiler config
```

## Directory Purposes

**`src/app`:**
- Purpose: Own App Router entry points, layouts, loading/error boundaries, metadata routes, route handlers, and global CSS.
- Contains: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/error.tsx`, `src/app/global-error.tsx`, `src/app/not-found.tsx`, `src/app/(storefront)`, `src/app/api`.
- Key files: `src/app/layout.tsx`, `src/app/(storefront)/layout.tsx`, `src/app/(storefront)/page.tsx`.

**`src/app/(storefront)`:**
- Purpose: Own public storefront pages without adding a URL segment.
- Contains: Homepage, product, collection, cart, blog, search, and service-page routes.
- Key files: `src/app/(storefront)/products/[handle]/page.tsx`, `src/app/(storefront)/collections/[handle]/page.tsx`, `src/app/(storefront)/cart/page.tsx`, `src/app/(storefront)/blogs/[blog]/page.tsx`, `src/app/(storefront)/pages/[...slug]/page.tsx`.

**`src/app/**/_components`:**
- Purpose: Own React components used only by the adjacent route segment.
- Contains: Route-local page sections, route-specific JSON-LD components, skeletons, and presentation helpers.
- Key files: `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`, `src/app/(storefront)/cart/_components/view.tsx`, `src/app/(storefront)/pages/contact/_components/page-content.tsx`, `src/app/(storefront)/products/[handle]/_components/related-products.tsx`.

**`src/app/**/_lib`:**
- Purpose: Own route-local constants, static data, formatting helpers, metadata helpers, and types.
- Contains: Route-specific data and helpers that are not shared across domains.
- Key files: `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts`, `src/app/(storefront)/collections/[handle]/_lib/page-types.ts`, `src/app/(storefront)/products/[handle]/_lib/shopify-analytics.ts`, `src/app/(storefront)/pages/wholesale/_lib/wholesale-content.ts`.

**`src/app/api`:**
- Purpose: Own HTTP route handlers that are not page renders.
- Contains: Product quick view JSON API, Searchanise suggestions API, Shopify webhook, Sanity webhook.
- Key files: `src/app/api/products/[handle]/quick-view/route.ts`, `src/app/api/search/suggestions/route.ts`, `src/app/api/webhooks/shopify/route.ts`, `src/app/api/webhooks/sanity/route.ts`.

**`src/components/ui`:**
- Purpose: Reusable presentational primitives with no business logic or data fetching.
- Contains: Buttons, form controls, section primitive, card, badge, price, rich text, dialogs, accordion, star rating, quantity stepper.
- Key files: `src/components/ui/button/button.tsx`, `src/components/ui/section/section.tsx`, `src/components/ui/quantity-stepper/quantity-stepper.tsx`, `src/components/ui/index.ts`.

**`src/components/layout`:**
- Purpose: Shared page structure shells and navigation.
- Contains: Header, footer, mega navigation, search overlay/autocomplete, cart badge, catalogue/service links.
- Key files: `src/components/layout/header/header.tsx`, `src/components/layout/header/search-autocomplete.tsx`, `src/components/layout/footer/footer.tsx`, `src/components/layout/index.ts`.

**`src/components/product`:**
- Purpose: Reusable product-domain UI.
- Contains: Product form, gallery, bulk savings, product quick view, related-products carousel, Searchanise recommendations, add-to-cart hook.
- Key files: `src/components/product/product-form/product-form.tsx`, `src/components/product/product-gallery/product-gallery.tsx`, `src/components/product/use-add-to-cart.ts`, `src/components/product/index.ts`.

**`src/components/collection`:**
- Purpose: Reusable collection and product-listing UI.
- Contains: Product cards, filter panel, toolbar, sort select, story disclosure, quick-add controls.
- Key files: `src/components/collection/product-card/product-card.tsx`, `src/components/collection/toolbar/toolbar.tsx`, `src/components/collection/filter-panel/filter-panel.tsx`, `src/components/collection/index.ts`.

**`src/components/search`:**
- Purpose: Reusable search page/result UI.
- Contains: Search results view, filters, pagination, sort select, result helpers, alerts, active chips.
- Key files: `src/components/search/search-results-view/search-results-view.tsx`, `src/components/search/search-filter-panel/search-filter-panel.tsx`, `src/components/search/search-pagination/search-pagination.tsx`.

**`src/components/blog`:**
- Purpose: Reusable blog/Tea Journal UI.
- Contains: Hero, article list, article results, featured articles, pagination, portable text, tag filter nav, loading/empty states.
- Key files: `src/components/blog/hero/hero.tsx`, `src/components/blog/article-list/article-list.tsx`, `src/components/blog/portable-text/portable-text.tsx`, `src/components/blog/index.ts`.

**`src/components/contact`:**
- Purpose: Reusable contact-domain components and enquiry form UI.
- Contains: Contact form, contact section, contact section form.
- Key files: `src/components/contact/contact-form/contact-form.tsx`, `src/components/contact/contact-section/contact-section.tsx`, `src/components/contact/index.ts`.

**`src/components/homepage`:**
- Purpose: Homepage feature sections, homepage-only UI helpers, and static homepage content.
- Contains: Hero, product range, newsletter, service sections, proof points, testimonials, Tea Journal, FAQ, CTA, content data.
- Key files: `src/components/homepage/hero/hero.tsx`, `src/components/homepage/content.ts`, `src/components/homepage/index.ts`.

**`src/lib/shopify`:**
- Purpose: Own Shopify Storefront GraphQL integration, queries, generated types, app-facing types, and operation helpers.
- Contains: `client.ts`, `env.ts`, `operations`, `queries`, `types`, HTML/image/quantity helpers.
- Key files: `src/lib/shopify/client.ts`, `src/lib/shopify/operations/product.ts`, `src/lib/shopify/operations/collection.ts`, `src/lib/shopify/operations/cart.ts`, `src/lib/shopify/queries/product.graphql`, `src/lib/shopify/types/index.ts`.

**`src/lib/shopify/operations`:**
- Purpose: Own read/write transport helpers and data reshaping for Shopify domains.
- Contains: Product, collection, cart, storefront page operations and shared mappers.
- Key files: `src/lib/shopify/operations/product.ts`, `src/lib/shopify/operations/collection.ts`, `src/lib/shopify/operations/cart.ts`, `src/lib/shopify/operations/storefront-page.ts`, `src/lib/shopify/operations/mappers.ts`.

**`src/lib/shopify/queries`:**
- Purpose: Source Shopify GraphQL documents for codegen.
- Contains: `.graphql` files only.
- Key files: `src/lib/shopify/queries/product.graphql`, `src/lib/shopify/queries/collection.graphql`, `src/lib/shopify/queries/cart.graphql`, `src/lib/shopify/queries/page.graphql`, `src/lib/shopify/queries/blog.graphql`.

**`src/lib/shopify/types`:**
- Purpose: Public Shopify type boundary plus generated codegen output.
- Contains: Handwritten `index.ts` and generated `generated/` files.
- Key files: `src/lib/shopify/types/index.ts`, `src/lib/shopify/types/generated/graphql.ts`.

**`src/lib/cart`:**
- Purpose: Server Actions and cart-domain events.
- Contains: Cart cookie handling, cart mutations, form action state, and custom events.
- Key files: `src/lib/cart/actions.ts`, `src/lib/cart/events.ts`, `src/lib/cart/actions.test.ts`.

**`src/lib/contact`:**
- Purpose: Contact/newsletter/wholesale/custom blend/NPD form domain logic.
- Contains: Server Actions, allowed values, limits, type definitions, and tests.
- Key files: `src/lib/contact/actions.ts`, `src/lib/contact/types.ts`, `src/lib/contact/wholesale-account.ts`, `src/lib/contact/custom-tea-blend.ts`, `src/lib/contact/npd-order.ts`.

**`src/lib/blog`:**
- Purpose: Blog application model, Sanity query orchestration, paths, filtering, pagination, and article reshaping.
- Contains: Blog operations, listing helpers, tests.
- Key files: `src/lib/blog/operations.ts`, `src/lib/blog/listing.ts`, `src/lib/blog/operations.test.ts`.

**`src/lib/sanity`:**
- Purpose: Sanity client, config, query strings, and Sanity type definitions.
- Contains: Client factories, env helpers, blog GROQ queries, query tests, Sanity content types.
- Key files: `src/lib/sanity/client.ts`, `src/lib/sanity/env.ts`, `src/lib/sanity/queries/blog.ts`, `src/lib/sanity/types.ts`.

**`src/lib/searchanise`:**
- Purpose: Searchanise request building, URL param helpers, response normalization, and result types.
- Contains: Search transport, params, types.
- Key files: `src/lib/searchanise/search.ts`, `src/lib/searchanise/params.ts`, `src/lib/searchanise/types.ts`.

**`src/lib/env`:**
- Purpose: Centralize environment reads by runtime context.
- Contains: Public, server, tooling, runtime, and low-level env read helpers.
- Key files: `src/lib/env/server.ts`, `src/lib/env/public.ts`, `src/lib/env/tooling.ts`, `src/lib/env/read.ts`, `src/lib/env/runtime.ts`.

**`src/lib/seo`:**
- Purpose: Shared SEO helpers.
- Contains: Site URL, noindex mode helpers, safe inline JSON serialization.
- Key files: `src/lib/seo/site-url.ts`, `src/lib/seo/noindex.ts`, `src/lib/seo/serialize-inline-json.ts`.

**`src/lib/rate-limit`:**
- Purpose: Shared server-side rate-limit helper.
- Contains: Rate-limit store interface, in-memory fallback, client IP extraction.
- Key files: `src/lib/rate-limit/index.ts`.

**`docs`:**
- Purpose: Canonical project documentation and conventions.
- Contains: Folder map, naming rules, component anatomy, styling rules, scaffolding shortcuts, import style.
- Key files: `docs/conventions.md`.

**`scripts`:**
- Purpose: Project tooling and scaffolding.
- Contains: Component/lib scaffolding scripts used by `pnpm create:component` and `pnpm create:lib`.
- Key files: scripts referenced by `package.json`.

**`tests`:**
- Purpose: Browser/integration coverage outside co-located unit tests.
- Contains: Playwright and integration test support.
- Key files: `tests` directory and `playwright.config.ts`.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML shell, fonts, default metadata, global CSS.
- `src/app/(storefront)/layout.tsx`: Storefront header/footer shell and main landmark.
- `src/app/(storefront)/page.tsx`: Homepage composition.
- `src/app/(storefront)/products/[handle]/page.tsx`: Product detail page.
- `src/app/(storefront)/collections/[handle]/page.tsx`: Collection route metadata and page delegation.
- `src/app/(storefront)/cart/page.tsx`: Cart page and cart data read.
- `src/app/(storefront)/search/page.tsx`: Storefront search page.
- `src/app/api/products/[handle]/quick-view/route.ts`: Product quick-view JSON API.
- `src/app/api/search/suggestions/route.ts`: Search suggestions JSON API.
- `src/app/api/webhooks/shopify/route.ts`: Shopify webhook cache invalidation.
- `src/app/api/webhooks/sanity/route.ts`: Sanity webhook cache invalidation.
- `src/app/robots.ts`: Robots metadata route.
- `src/app/sitemap.ts`: Sitemap metadata route.

**Configuration:**
- `next.config.ts`: Cache Components, build-time env, redirects, image allowlist.
- `tsconfig.json`: TypeScript configuration and `@/*` path alias.
- `eslint.config.mjs`: ESLint rules.
- `.prettierrc`: Prettier formatting rules.
- `postcss.config.mjs`: Tailwind/PostCSS integration.
- `codegen.ts`: Shopify GraphQL type generation.
- `vitest.config.mts`: Unit/integration test config.
- `vitest.storybook.config.mts`: Storybook test config.
- `playwright.config.ts`: Browser E2E config.
- `.storybook`: Storybook configuration.
- `.env.example`: Environment configuration example; do not read or copy values from real `.env*` files.

**Core Logic:**
- `src/lib/shopify/client.ts`: Storefront GraphQL transport.
- `src/lib/shopify/env.ts`: Shopify endpoint/env access.
- `src/lib/shopify/operations/product.ts`: Product reads, recommendations, bulk pricing, inventory enrichment.
- `src/lib/shopify/operations/collection.ts`: Collection reads, listing filters, menus, summaries.
- `src/lib/shopify/operations/cart.ts`: Shopify cart read/mutation operations.
- `src/lib/shopify/operations/storefront-page.ts`: Shopify page reads.
- `src/lib/cart/actions.ts`: Cart Server Actions and cookie state.
- `src/lib/contact/actions.ts`: Contact/newsletter/wholesale/NPD Server Actions.
- `src/lib/blog/operations.ts`: Blog path, listing, pagination, tag, and article operations.
- `src/lib/sanity/client.ts`: Sanity clients and image URL builder.
- `src/lib/searchanise/search.ts`: Searchanise API adapter.
- `src/lib/reviews/trustoo.ts`: Trustoo review fetches.
- `src/lib/rate-limit/index.ts`: Shared rate limiting.
- `src/lib/utils.ts`: `cn()` class composition helper.

**Testing:**
- `src/**/*.test.ts`: Unit and integration tests for library modules and route handlers.
- `src/**/*.test.tsx`: Component tests and route-local component tests.
- `src/**/*.stories.tsx`: Storybook stories co-located with shared and Storybook-worthy route-local components.
- `tests`: Playwright/fake-provider browser and integration coverage.
- `vitest.config.mts`: Main Vitest config.
- `vitest.storybook.config.mts`: Storybook test config.
- `playwright.config.ts`: E2E config.

**Generated:**
- `src/lib/shopify/types/generated/`: Generated Shopify GraphQL TypeScript output; do not edit manually.
- `next-env.d.ts`: Next.js generated TypeScript environment declarations.
- `tsconfig.tsbuildinfo`: TypeScript incremental build metadata.
- `.next`: Next.js build/dev output.
- `storybook-static`: Storybook static build output.
- `test-results`: Test output artifacts.

## Naming Conventions

**Files:**
- Use kebab-case for ordinary component and helper files: `product-card.tsx`, `sort-select.tsx`, `page-helpers.ts`.
- Use Next.js special filenames exactly where required: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Do not repeat parent directory context in filenames. Inside `src/app/(storefront)/cart/_components`, use `view.tsx` and `loading-skeleton.tsx`, not `cart-view.tsx` or `cart-loading-skeleton.tsx`.
- Use `*.stories.tsx` beside Storybook-covered components.
- Use `*.test.ts` or `*.test.tsx` beside tested implementation files.
- Use `.graphql` only under `src/lib/shopify/queries`.

**Directories:**
- Use kebab-case for component folders: `product-card`, `quantity-stepper`, `search-results-view`.
- Use route segment names for App Router directories: `[handle]`, `[article]`, `[...slug]`, `(storefront)`.
- Use `_components` and `_lib` for route-private modules under `src/app/**`.
- Use domain directories under `src/components`: `ui`, `layout`, `product`, `collection`, `search`, `blog`, `contact`, `homepage`.
- Use domain directories under `src/lib`: `shopify`, `cart`, `contact`, `blog`, `sanity`, `searchanise`, `seo`, `env`, `rate-limit`, `reviews`.

**Exports:**
- Use named exports for components and lib modules; avoid default exports except Next.js special files such as `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`.
- Component exports use PascalCase: `ProductCard`, `Section`, `SearchResultsView`.
- Server Action exports use camelCase plus `Action` suffix: `addToCartAction`, `sendWholesaleAccountAction`.
- Operation exports use camelCase verb+noun: `getProduct`, `getCollection`, `getCart`, `getBlog`.

## Where to Add New Code

**New Storefront Route:**
- Primary code: `src/app/(storefront)/<route>/page.tsx`
- Route-only components: `src/app/(storefront)/<route>/_components/`
- Route-only helpers/static data: `src/app/(storefront)/<route>/_lib/`
- Shared UI: promote to `src/components/<domain>/<component-name>/` only when reused or Storybook-worthy.

**New Product/Collection Data Fetch:**
- Shopify query: `src/lib/shopify/queries/<domain>.graphql`
- Operation helper: `src/lib/shopify/operations/<domain>.ts`
- Public app type: `src/lib/shopify/types/index.ts`
- Generated output: run `pnpm codegen`; do not edit `src/lib/shopify/types/generated/`.

**New Cart or Checkout Mutation:**
- Primary code: `src/lib/cart/actions.ts`
- Shopify transport helper: `src/lib/shopify/operations/cart.ts`
- UI caller: interactive leaf component under `src/components/product`, `src/components/cart`, or `src/app/(storefront)/cart/_components`.
- Tests: co-located `*.test.ts` or `*.test.tsx` near the action/operation/component.

**New Contact/Form Submission:**
- Server Action: `src/lib/contact/actions.ts`
- Domain constants/validators: `src/lib/contact/<domain>.ts`
- Shared form UI: `src/components/contact/<component-name>/`
- Route-specific form UI: `src/app/(storefront)/pages/<route>/_components/`
- Rate limiting: use `src/lib/rate-limit/index.ts`.

**New Reusable UI Primitive:**
- Implementation: `src/components/ui/<component-name>/<component-name>.tsx`
- Story: `src/components/ui/<component-name>/<component-name>.stories.tsx`
- Barrel: `src/components/ui/<component-name>/index.ts` and export from `src/components/ui/index.ts`
- Scaffold with: `pnpm create:component -- ui/<component-name>`

**New Reusable Domain Component:**
- Implementation: `src/components/<domain>/<component-name>/<component-name>.tsx`
- Story: `src/components/<domain>/<component-name>/<component-name>.stories.tsx`
- Barrel: `src/components/<domain>/<component-name>/index.ts` and export from `src/components/<domain>/index.ts`
- Scaffold with: `pnpm create:component -- <domain>/<component-name>`

**New Layout/Navigational Shell:**
- Implementation: `src/components/layout/<component-name>/<component-name>.tsx` or existing `src/components/layout/header`
- Story: co-located `*.stories.tsx`
- Export: `src/components/layout/index.ts`

**New Blog/Sanity Query:**
- Query string: `src/lib/sanity/queries/<domain>.ts`
- Client/operation usage: `src/lib/blog/operations.ts` or a focused `src/lib/<domain>` module.
- Types: `src/lib/sanity/types.ts` or operation-local exported app types.
- Webhook invalidation: update `src/app/api/webhooks/sanity/route.ts` when new cache tags are introduced.

**New Search UI or Search Helper:**
- Search transport/normalization: `src/lib/searchanise/search.ts`
- URL param helpers: `src/lib/searchanise/params.ts`
- Shared UI: `src/components/search/<component-name>/`
- API boundary: `src/app/api/search/<endpoint>/route.ts` if the browser needs JSON.

**New SEO Helper:**
- Shared helper: `src/lib/seo/`
- Route metadata: adjacent route `page.tsx` or route `_lib/metadata.ts`.
- JSON-LD: route-local `_components/json-ld.tsx` when used by one route; shared helper only when reused.

**New Utility:**
- Cross-domain helper: `src/lib/<domain-or-purpose>/`
- Class composition: extend `src/lib/utils.ts` only for truly shared small utilities.
- Route-local helper: `src/app/<route>/_lib/`.

## Special Directories

**`.planning`:**
- Purpose: GSD planning artifacts and generated codebase maps.
- Generated: Yes
- Committed: Project-dependent; mapper outputs in `.planning/codebase/` are intended for GSD consumption.

**`.agents/skills`:**
- Purpose: Project-local skill instructions for component building, Next Cache Components, Vercel React practices, and UI review.
- Generated: No
- Committed: Yes

**`.storybook`:**
- Purpose: Storybook configuration for component documentation and interaction tests.
- Generated: No
- Committed: Yes

**`src/lib/shopify/types/generated`:**
- Purpose: GraphQL codegen output from Shopify schema and `.graphql` files.
- Generated: Yes
- Committed: Yes

**`.next`:**
- Purpose: Next.js build/dev output.
- Generated: Yes
- Committed: No

**`storybook-static`:**
- Purpose: Static Storybook build output.
- Generated: Yes
- Committed: No

**`test-results`:**
- Purpose: Test runner output artifacts.
- Generated: Yes
- Committed: No

**`node_modules`:**
- Purpose: Installed dependencies.
- Generated: Yes
- Committed: No

**`public`:**
- Purpose: Static assets served directly by Next.js.
- Generated: No
- Committed: Yes

**`design`:**
- Purpose: Design reference materials and imported design artifacts.
- Generated: Mixed
- Committed: Yes

**`tmp` and `.codex-temp`:**
- Purpose: Temporary local work artifacts.
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-06-11*
