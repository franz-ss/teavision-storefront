# Coding Conventions

**Analysis Date:** 2026-06-11

## Naming Patterns

**Files:**
- Use kebab-case for implementation, story, and test files: `src/components/ui/button/button.tsx`, `src/components/ui/button/button.stories.tsx`, `src/components/ui/quantity-stepper/quantity-stepper.test.tsx`.
- Keep extracted components in one folder per component with `<component-name>.tsx`, `<component-name>.stories.tsx`, and `index.ts`: `src/components/ui/badge/badge.tsx`, `src/components/ui/badge/badge.stories.tsx`, `src/components/ui/badge/index.ts`.
- Do not repeat parent route or domain names inside route-scoped folders. Use `src/app/(storefront)/cart/_components/view.tsx` and `src/app/(storefront)/cart/_components/loading-skeleton.tsx`, not `cart-view.tsx`.
- Next.js special files keep framework names: `src/app/(storefront)/products/[handle]/page.tsx`, `src/app/api/products/[handle]/quick-view/route.ts`, `src/app/layout.tsx`.
- Shopify GraphQL documents live as `.graphql` files under `src/lib/shopify/queries/`; generated output under `src/lib/shopify/types/generated/` is not imported directly by hand-written code.

**Functions:**
- Components use PascalCase named exports: `Button` in `src/components/ui/button/button.tsx`, `ProductForm` in `src/components/product/product-form/product-form.tsx`.
- Lib and operation functions use camelCase verb+noun names: `shopifyFetch` in `src/lib/shopify/client.ts`, `getCart` and `createCart` in `src/lib/shopify/operations/cart.ts`.
- Server Actions use camelCase with an `Action` suffix: `addToCartAction`, `updateCartLineAction`, and `cartLineFormAction` in `src/lib/cart/actions.ts`.
- Factory helpers in tests use `make*` names and accept `Partial<T>` overrides: `makeCart`, `makeCartLine`, and `makeShopifyCartPayload` in `tests/fixtures/shopify/cart.ts`.
- Route handlers use framework exports such as `GET` in `src/app/api/products/[handle]/quick-view/route.ts`.

**Variables:**
- Constants use uppercase snake case for fixed messages and config values: `CART_COOKIE`, `MAXIMUM_QUANTITY_ERROR`, and `CART_SESSION_EXPIRED_ERROR` in `src/lib/cart/actions.ts`.
- Mock variables use a `Mock` suffix after typed casting: `cookiesMock`, `shopifyFetchMock`, and `getProductMock` in `src/lib/cart/actions.test.ts` and `src/lib/shopify/operations/cart.test.ts`.
- Storybook metadata uses `meta` and `Story` aliases consistently: `src/components/ui/button/button.stories.tsx`.
- Class variant maps use descriptive names ending in `Variants`: `buttonVariants` in `src/components/ui/button/button.tsx`.

**Types:**
- Props types use the component name plus `Props`: `ButtonProps` in `src/components/ui/button/button.tsx`.
- Domain model types are imported from the hand-written type barrel `@/lib/shopify/types`, as in `src/lib/cart/actions.ts`, `src/app/api/products/[handle]/quick-view/route.ts`, and `tests/fixtures/shopify/cart.ts`.
- Avoid `any`; tests that cast mocks use `unknown` before narrowing to `Mock<...>`: `const cookiesMock = cookies as unknown as Mock<...>` in `src/lib/cart/actions.test.ts`.
- Use discriminated unions for variant data where useful: `ShopifyDiscountAllocation` in `tests/fixtures/shopify/cart.ts`.

## Code Style

**Formatting:**
- Use Prettier 3 via `pnpm format`; settings are in `.prettierrc`.
- Formatting rules: no semicolons, single quotes, trailing commas, and Tailwind class sorting through `prettier-plugin-tailwindcss`.
- Use Tailwind 4 utilities only for styling in app and component code. Do not add CSS modules, styled-components, raw hex/rgb classes, or inline `style={{}}` except when Tailwind cannot statically extract a dynamic value.
- Compose conditional class names with `cn()` from `src/lib/utils.ts`; do not use template literals, array joins, or `filter(Boolean).join(' ')` for `className`.
- Use warm/botanical design token utilities from `src/app/globals.css`, such as `bg-paper`, `bg-card`, `text-ink`, `text-brand`, `border-hairline`, and `ring-ring`.

**Linting:**
- Run `pnpm lint`, which executes `scripts/check-tailwind-classes.mjs` before `eslint .`.
- ESLint config lives in `eslint.config.mjs` and extends `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, and Storybook recommended rules.
- Import ordering is enforced by `eslint-plugin-import`: builtin, external, internal aliases, then parent/sibling/index, with blank lines between groups.
- `import/no-default-export` is enforced for `src/components/**/*.tsx` and `src/lib/**/*.ts`; Next.js special files and `*.stories.tsx` are explicit exceptions in `eslint.config.mjs`.
- Project rules in `scripts/eslint-rules/` ban raw page sections, raw buttons, button styling classes outside primitives, and custom root tone classes for sections.

## Import Organization

**Order:**
1. Framework, runtime, and package imports, with type imports grouped naturally: `react`, `next/link`, `class-variance-authority`, `lucide-react` in `src/components/ui/button/button.tsx`.
2. Internal alias imports from `@/components/*`, `@/lib/*`, and `@/tests/*`: `@/lib/utils`, `@/lib/shopify/operations/cart`, `@/tests/fixtures/shopify/cart`.
3. Relative imports for same-component or same-domain files: `./button`, `./actions`, `./cart`, `../mocks/third-party-network`.

**Path Aliases:**
- `@/components/*` maps to `src/components/*` in `tsconfig.json`.
- `@/lib/*` maps to `src/lib/*` in `tsconfig.json`.
- `@/*` maps to `src/*` and repo root in `tsconfig.json`; tests use this for `@/tests/fixtures/shopify/cart`.
- Use component barrels for cross-domain component imports, such as `@/components/ui`, as documented in `docs/conventions.md`.
- Use explicit paths for `src/lib` imports, such as `@/lib/cart/actions` and `@/lib/shopify/operations/product`; `src/lib` does not use broad barrels.
- Import Shopify generated GraphQL types only through `src/lib/shopify/types/index.ts`, never from `src/lib/shopify/types/generated/`.

## Error Handling

**Patterns:**
- Fail fast on missing required configuration in low-level clients. `shopifyFetch()` in `src/lib/shopify/client.ts` calls `getStorefrontEndpoint()` and throws when Shopify credentials are absent.
- Convert non-OK HTTP responses and Storefront GraphQL errors into thrown `Error` instances in `src/lib/shopify/client.ts`.
- Surface Shopify cart `userErrors` as thrown errors from operations such as `createCart`, `addCartLines`, `updateCartLines`, and `removeCartLines` in `src/lib/shopify/operations/cart.ts`.
- Server Actions validate and normalize user input before mutation. `normalizeCartQuantity()` and `getRequiredFormString()` in `src/lib/cart/actions.ts` throw safe user-facing messages for invalid cart requests.
- Form Server Actions return serializable state instead of throwing to the UI. `cartLineFormAction()` in `src/lib/cart/actions.ts` returns `{ cartChanged, message }` and maps unknown errors to generic copy.
- API route handlers return status-coded JSON. `GET()` in `src/app/api/products/[handle]/quick-view/route.ts` returns 404 for missing products and 503 for failed product fetches.
- Avoid logging request bodies, credentials, or submitted form values from rate limiting and public form surfaces, as specified in `docs/conventions.md`.

## Logging

**Framework:** console

**Patterns:**
- Application code generally avoids routine logging. Error paths prefer returned safe messages or thrown `Error` instances, as in `src/lib/cart/actions.ts` and `src/app/api/products/[handle]/quick-view/route.ts`.
- CLI/scaffold scripts write user-facing status and validation failures with `console.log()` and `console.error()`, as in `scripts/create-component.mjs`.
- Do not add logs that include Shopify tokens, cart IDs beyond test fixtures, request bodies, submitted contact form values, or credential-derived values.

## Comments

**When to Comment:**
- Use comments for non-obvious design constraints or contracts that tests enforce. Examples include Tailwind transform behavior and design intent comments in `src/components/ui/button/button.tsx`.
- Use comments in tests to document locked behavior and why it matters, such as the 100-line cart cap note in `src/lib/shopify/operations/cart.test.ts`.
- Keep comments out of straightforward assignments, simple props, and obvious JSX structure.

**JSDoc/TSDoc:**
- JSDoc is not the default documentation style in application code. Prefer TypeScript types and readable names.
- File-level comments are used sparingly for test environment directives, such as `@vitest-environment jsdom` in `src/components/collection/product-card/product-card.test.tsx`.

## Function Design

**Size:** Keep functions scoped to one behavior. Extract helpers when they isolate validation, mapping, or adapter logic, such as `toQuickViewDetails()` in `src/app/api/products/[handle]/quick-view/route.ts`, `normalizeCartQuantity()` in `src/lib/cart/actions.ts`, and `makeShopifyCartPayload()` in `tests/fixtures/shopify/cart.ts`.

**Parameters:** Prefer typed object parameters for flexible clients and factories, as in `shopifyFetch({ query, variables, cache })` in `src/lib/shopify/client.ts` and `makeCart(overrides)` in `tests/fixtures/shopify/cart.ts`. Use positional parameters for compact domain operations where the order is obvious, such as `addToCartAction(variantId, quantity)`.

**Return Values:** Return domain types from data operations and actions (`Promise<Cart>`, `Promise<Cart | null>`), serializable response state for form actions (`CartLineFormState`), and `Response.json(...)` from route handlers.

## Module Design

**Exports:** Use named exports for components, lib modules, fixtures, and helpers. `src/components/ui/button/button.tsx`, `src/lib/shopify/client.ts`, and `tests/fixtures/shopify/cart.ts` all follow this pattern. Default exports are reserved for Next.js special files, config files, and Storybook meta objects.

**Barrel Files:** Component folders export through local `index.ts` files, and component domains may expose barrels such as `src/components/ui/index.ts`. Lib modules should be imported by explicit file path rather than broad barrels. Shopify public types are the exception: import from `src/lib/shopify/types/index.ts`.

---

*Convention analysis: 2026-06-11*
