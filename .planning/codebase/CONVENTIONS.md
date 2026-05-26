# Coding Conventions

**Analysis Date:** 2026-05-26

## Naming Patterns

**Files:**
- Use kebab-case for regular component and module files: `product-card.tsx`, `sort-select.tsx`, `custom-tea-blend.ts`.
- Use `*.stories.tsx` beside component implementation files.
- Use `*.test.mjs` for Node-based script/contract tests.
- Use Next.js special filenames exactly: `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `not-found.tsx`.

**Components:**
- Export components as PascalCase named exports: `export function ProductForm(...)`.
- Component folders are kebab-case and contain implementation, story, and `index.ts`.
- Only use default exports where Next.js or Storybook requires them.

**Functions:**
- Use camelCase verbs: `getProduct`, `reshapeMoney`, `sanitizeShopifyPageBodyHtml`.
- Server Actions use camelCase with `Action` suffix: `addToCartAction`, `sendContactAction`.
- Event handlers usually use `handle*`: `handleSubmit`, `handleAddToCart`, `handleOpen`.

**Types:**
- Use PascalCase type aliases.
- Prefer `type` aliases over interfaces except where extending React/native prop types is clearer.
- Use `unknown` and narrow with guards; do not introduce `any`.

## Code Style

**Formatting:**
- Prettier config: no semicolons, single quotes, trailing commas, Tailwind class sorting.
- Use 2-space indentation through Prettier.
- Run `pnpm format` for formatting and `pnpm lint` for linting.

**Linting:**
- ESLint flat config in `eslint.config.mjs`.
- Extends Next core web vitals, Next TypeScript, Storybook recommended, and import ordering.
- Custom Teavision rules enforce Section usage and Button styling constraints.
- Components and lib files cannot use default exports.

## Import Organization

**Order:**
1. External packages and framework imports.
2. Internal alias imports from `@/lib/*` and `@/components/*`.
3. Relative imports within the current domain/folder.
4. Type imports may be grouped with their source but should use `import type` for type-only values.

**Path Aliases:**
- `@/components/*` maps to `src/components/*`.
- `@/lib/*` maps to `src/lib/*`.
- `@/*` maps to `src/*` and root fallback.

**Barrels:**
- Use component barrels for cross-domain component imports such as `@/components/ui`.
- Use relative imports within a domain when avoiding circular dependencies.
- Do not add a broad `src/lib` barrel; import lib modules by explicit path.

## React and Next.js Patterns

**Server First:**
- Components are Server Components by default.
- Add `'use client'` only for event handlers, hooks, browser APIs, dialogs, carousels, or widgets.
- Add `'use server'` only to Server Action files or local inline Server Actions.

**Next.js 16 Dynamic APIs:**
- Dynamic routes use `params: Promise<{ ... }>` and must `await params`.
- Routes with search params use `searchParams: Promise<{ ... }>` and must `await searchParams`.
- Read `node_modules/next/dist/docs/` before writing Next.js code because this repo uses Next.js 16 with breaking changes.

**Caching:**
- Use `'use cache'` inside expensive Server Component data helpers.
- Tag cached Shopify reads with `cacheTag()` and `cacheLife()`.
- Keep carts and mutations `no-store`.

## Styling Rules

**Tailwind and Tokens:**
- Use Tailwind 4 utilities only.
- Use semantic token utilities such as `bg-canvas`, `bg-surface`, `text-strong`, `text-muted`, `border-default`, `ring-ring`.
- Do not add raw hex/rgb values in `className`.
- Do not add CSS modules, styled-components, or inline styles unless the dynamic value cannot be expressed statically in Tailwind.

**Class Composition:**
- Use `cn()` from `src/lib/utils.ts` for conditional or merged classes.
- Static class strings are fine when no composition is needed.
- Never use template literals or `filter(Boolean).join(' ')` for className construction.

**Page Sections:**
- Page-level semantic sections must use `Section.Root`.
- Use `Section.Container` for contained layout.
- Do not write raw page-level `<section>` elements except inside the `Section` primitive.
- Use `tone` props rather than background/foreground tone classes on `Section.Root`.

## Error Handling

**Patterns:**
- Throw at low-level service boundaries when the app cannot recover, e.g. missing Shopify credentials or Storefront errors.
- Return user-safe action result objects for form submissions.
- Use `try/catch` around optional third-party services and degrade when appropriate.
- Keep error messages specific but do not expose secrets or raw provider payloads to users.

**User Errors:**
- Product/cart UI catches cart action failures and displays concise retry messages.
- Contact actions return validation, rate limit, and send failure messages.

## Logging

**Framework:**
- No dedicated logger is configured.
- Use `console.error()` at server-side boundaries where operational debugging matters.

**Patterns:**
- Current committed logging is limited to Resend failure paths in `src/lib/contact/actions.ts`.
- Avoid noisy client logs in committed code.

## Comments

**When to Comment:**
- Explain legacy compatibility or non-obvious business rules.
- Comments exist for Shopify SPR rating metafield shape, legacy tag display logic, and webhook body/HMAC handling.
- Avoid comments that restate the code.

**TODO Comments:**
- There is no formal TODO convention. Prefer captured planning docs or focused issues for significant follow-up work.

## Function and Module Design

**Functions:**
- Keep transformation helpers small and close to the operation/page using them.
- Use guard functions for runtime narrowing.
- Prefer early returns for not-found, empty, optional, and invalid states.

**Modules:**
- Keep Shopify GraphQL transport in `src/lib/shopify/client.ts`.
- Keep read operations in `src/lib/shopify/operations/`.
- Keep cart mutations in `src/lib/cart/actions.ts` plus `src/lib/shopify/operations/cart.ts`.
- Keep UI primitives free of business logic and data fetching.

## Scaffolding

```bash
pnpm create:component -- ui/my-component
pnpm create:component -- product/my-feature
pnpm create:component -- homepage/my-section
pnpm create:lib -- blog/operations
```

Review generated files before use; current scaffolding produces a bare `className = ''` pattern that may need adjustment to match stricter `cn()` conventions for conditional classes.

---

*Convention analysis: 2026-05-26*
*Update when patterns change*
