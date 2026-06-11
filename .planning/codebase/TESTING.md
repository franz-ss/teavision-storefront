# Testing Patterns

**Analysis Date:** 2026-06-11

## Test Framework

**Runner:**
- Vitest 4.1.8 for unit and integration tests. Config: `vitest.config.mts`.
- Playwright 1.60.0 for browser E2E coverage of the fake-Shopify cart checkout handoff. Config: `playwright.config.ts`.
- Node's built-in `node:test` runner for custom ESLint rule and component contract tests under `scripts/eslint-rules/*.test.mjs` and `scripts/component-contracts/*.test.mjs`.
- Storybook 10.4.1 with `@storybook/nextjs-vite`, `@storybook/addon-vitest`, docs, a11y, and Chromatic integration. Config: `.storybook/main.ts` and `.storybook/preview.ts`.

**Assertion Library:**
- Vitest tests use `expect` from `vitest`.
- Playwright E2E tests use `expect` from `@playwright/test`.
- Node contract tests use `node:assert/strict`.

**Run Commands:**
```bash
pnpm test:unit          # Run selected Vitest unit tests for helpers, Shopify transport, operations, and UI behavior
pnpm test:integration   # Run Vitest boundary tests for Server Actions and route handlers
pnpm test:e2e           # Run Playwright fake-Shopify cart-to-checkout browser coverage
pnpm test:contracts     # Run Node test contracts for custom ESLint rules and structural component checks
pnpm test:stories       # Run Storybook stories through the Vitest browser integration
pnpm lint               # Run Tailwind class checks and ESLint
pnpm typecheck          # Run TypeScript type checking
pnpm storybook          # Start Storybook on port 6006 for interactive component review
```

## Test File Organization

**Location:**
- Unit tests are co-located beside the source under test: `src/lib/shopify/client.test.ts`, `src/lib/shopify/operations/cart.test.ts`, `src/components/ui/quantity-stepper/quantity-stepper.test.tsx`.
- Route-scoped tests live beside route files: `src/app/api/products/[handle]/quick-view/route.test.ts`, `src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts`.
- Component stories are co-located as `*.stories.tsx`: `src/components/ui/button/button.stories.tsx`, `src/app/(storefront)/cart/_components/view.stories.tsx`.
- E2E tests live under `tests/e2e/`, with mock servers and network helpers under `tests/mocks/`.
- Shared test fixtures live under `tests/fixtures/shopify/`.
- Script-level contract tests live under `scripts/component-contracts/` and `scripts/eslint-rules/`.

**Naming:**
- Use `*.test.ts` for TypeScript helper and operation tests.
- Use `*.test.tsx` for component and route-scoped React tests.
- Use `*.spec.ts` for Playwright E2E tests, as in `tests/e2e/cart-checkout.spec.ts`.
- Use `*.test.mjs` for Node runner tests in `scripts/`.
- Use `*.stories.tsx` for Storybook stories.

**Structure:**
```text
src/
├── lib/<domain>/<module>.test.ts
├── components/<domain>/<component>/<component>.test.tsx
├── components/<domain>/<component>/<component>.stories.tsx
└── app/**/_components/<component>.test.tsx

tests/
├── e2e/*.spec.ts
├── fixtures/shopify/*.ts
└── mocks/*.ts

scripts/
├── component-contracts/*.test.mjs
└── eslint-rules/*.test.mjs
```

## Test Structure

**Suite Organization:**
```typescript
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { shopifyFetch } from '@/lib/shopify/client'

import { getCart } from './cart'

vi.mock('@/lib/shopify/client', () => ({
  shopifyFetch: vi.fn(),
}))

const shopifyFetchMock = shopifyFetch as unknown as Mock<
  (options: ShopifyFetchCall) => Promise<unknown>
>

describe('Shopify cart operations', () => {
  beforeEach(() => {
    shopifyFetchMock.mockReset()
  })

  test('getCart maps cart payloads and uses no-store reads', async () => {
    shopifyFetchMock.mockResolvedValueOnce({ cart: makeShopifyCartPayload() })

    await expect(getCart('gid://shopify/Cart/test-cart')).resolves.toMatchObject({
      totalQuantity: 1,
    })
  })
})
```

**Patterns:**
- Reset or clear mocks in `beforeEach()`: `src/lib/cart/actions.test.ts` uses `vi.clearAllMocks()`, while `src/lib/shopify/operations/cart.test.ts` uses `mockReset()`.
- Use `await expect(promise).resolves` and `await expect(promise).rejects` for async behavior, as in `src/lib/shopify/client.test.ts`.
- Use `renderToStaticMarkup()` for static HTML contract checks where full browser interaction is unnecessary: `src/components/collection/product-card/product-card.test.tsx` and `src/components/ui/quantity-stepper/quantity-stepper.test.tsx`.
- Use React `act()` plus `createRoot()` for targeted client interaction tests: `src/components/product/product-form/product-form.test.tsx`.
- Use role- and accessible-name selectors in Playwright: `page.getByRole('button', { name: 'Add to Cart' })` in `tests/e2e/cart-checkout.spec.ts`.
- Route-handler tests call exported route functions directly with `Request` and a promised `params` context: `src/app/api/products/[handle]/quick-view/route.test.ts`.

## Mocking

**Framework:** Vitest `vi.mock`, `vi.fn`, `vi.stubEnv`, `vi.stubGlobal`; Playwright route interception; local fake Shopify HTTP server.

**Patterns:**
```typescript
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('@/lib/shopify/operations/cart', () => ({
  addCartLines: vi.fn(),
  createCart: vi.fn(),
  getCart: vi.fn(),
  removeCartLines: vi.fn(),
  updateCartLines: vi.fn(),
}))

const cookiesMock = cookies as unknown as Mock<() => Promise<CookieStore>>
```

**What to Mock:**
- Mock Next.js runtime APIs at Server Action boundaries: `next/headers` and `next/cache` in `src/lib/cart/actions.test.ts`.
- Mock Shopify transport when testing operations: `shopifyFetch` in `src/lib/shopify/operations/cart.test.ts`.
- Mock Shopify operations when testing route handlers and Server Actions: `getProduct` in `src/app/api/products/[handle]/quick-view/route.test.ts`.
- Mock `next/navigation` for client components that call `useRouter()`: `src/components/collection/product-card/product-card.test.tsx`.
- Stub environment variables with `vi.stubEnv()` and clean them with `vi.unstubAllEnvs()` in env-sensitive tests such as `src/lib/shopify/client.test.ts`.
- Stub `fetch` with `vi.stubGlobal()` for low-level HTTP client tests in `src/lib/shopify/client.test.ts`.
- Use `tests/mocks/shopify-graphql-server.ts` for browser E2E so the app exercises real HTTP GraphQL calls without real Shopify checkout or payment flows.
- Use `tests/mocks/third-party-network.ts` to block unexpected external browser requests during Playwright tests.

**What NOT to Mock:**
- Do not run real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests until store-owner approval exists.
- Do not hit production Shopify in tests; Playwright config injects fake local Shopify values in `playwright.config.ts`.
- Do not mock the function under test. Mock its external boundary instead, such as `shopifyFetch` for operation tests or `getProduct` for route tests.
- Do not mock simple pure helpers when direct assertions are cheap; test them directly as in `src/lib/shopify/quantity-rules.test.ts` and `src/lib/seo/site-url.test.ts`.

## Fixtures and Factories

**Test Data:**
```typescript
export function makeCart(overrides: Partial<Cart> = {}): Cart {
  const lines = overrides.lines ?? [makeCartLine()]
  const totalQuantity =
    overrides.totalQuantity ??
    lines.reduce((total, line) => total + line.quantity, 0)

  return {
    id: 'gid://shopify/Cart/test-cart',
    checkoutUrl: 'https://checkout.test/cart/test-cart',
    totalQuantity,
    cost: {
      totalAmount: makeMoney('24.00'),
      subtotalAmount: makeMoney('24.00'),
    },
    lines,
    ...overrides,
  }
}
```

**Location:**
- Shopify fixtures live in `tests/fixtures/shopify/cart.ts`, `tests/fixtures/shopify/product.ts`, and `tests/fixtures/shopify/money.ts`.
- E2E fake service helpers live in `tests/mocks/shopify-graphql-server.ts`, `tests/mocks/run-fake-shopify-server.ts`, and `tests/mocks/third-party-network.ts`.
- Inline data is acceptable for narrow component tests when it is local to one behavior, as in `src/components/product/product-form/product-form.test.tsx`.

## Coverage

**Requirements:** No numeric coverage threshold is enforced in `package.json` or `vitest.config.mts`.

**View Coverage:**
```bash
pnpm test:unit          # Primary regression suite; no coverage reporter configured
pnpm test:integration   # Boundary regression suite; no coverage reporter configured
```

## Test Types

**Unit Tests:**
- Cover pure helpers, low-level clients, Shopify operation mapping, component static markup contracts, and narrowly scoped UI interactions.
- Examples: `src/lib/env/read.test.ts`, `src/lib/seo/site-url.test.ts`, `src/lib/shopify/client.test.ts`, `src/lib/shopify/operations/product.test.ts`, `src/components/ui/quantity-stepper/quantity-stepper.test.tsx`.

**Integration Tests:**
- Cover Server Action and route-handler boundaries with mocked downstream dependencies.
- `pnpm test:integration` runs `src/lib/cart/actions.test.ts` and `src/app/api/products/[handle]/quick-view/route.test.ts`.
- Server Actions are tested with mocked cookies, cache revalidation, and Shopify operations in `src/lib/cart/actions.test.ts`.
- Route handlers are tested by calling exported handlers directly and asserting JSON responses and HTTP statuses in `src/app/api/products/[handle]/quick-view/route.test.ts`.

**E2E Tests:**
- Playwright tests are limited to fake-Shopify cart-to-checkout handoff coverage in `tests/e2e/cart-checkout.spec.ts`.
- `playwright.config.ts` starts both `tests/mocks/run-fake-shopify-server.ts` and `next dev`, injects local Shopify test env vars, runs Chromium only, disables full parallelism, and retains traces on failure.
- Tests must use fake checkout URLs such as `https://checkout.test/cart/fake-cart` and must not exercise real hosted checkout or payment flows.

**Storybook Tests:**
- Stories are the preferred component documentation and interaction surface.
- `pnpm test:stories` uses `vitest.storybook.config.mts` with `@storybook/addon-vitest` and browser Playwright Chromium.
- Story discovery includes `src/components/**/*.stories.*` and `src/app/**/_components/**/*.stories.*` from `.storybook/main.ts`.

**Contract Tests:**
- `pnpm test:contracts` runs Node tests for static source contracts that lint or type tests do not capture.
- Custom ESLint rules are tested through `ESLint.lintText()` in files such as `scripts/eslint-rules/no-raw-button.test.mjs`.
- Structural and design contracts are checked by reading source files and matching stable patterns in `scripts/component-contracts/button-system.test.mjs`.

## Common Patterns

**Async Testing:**
```typescript
await expect(
  shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
).rejects.toThrow('Missing Shopify credentials')

await expect(getCart(cart.id)).resolves.toMatchObject({
  checkoutUrl: cart.checkoutUrl,
})
```

**Error Testing:**
```typescript
shopifyFetchMock.mockResolvedValueOnce({
  cartLinesAdd: {
    cart: null,
    userErrors: [{ message: 'Not enough merchandise available' }],
  },
})

await expect(addCartLines(cart.id, lines)).rejects.toThrow(
  'Not enough merchandise available',
)
```

**DOM and Browser Testing:**
```typescript
const html = renderToStaticMarkup(<ProductCard product={product} />)
expect(html).toContain('aspect-square')

await page.getByRole('button', { name: 'Add to Cart' }).click()
await expect(page.getByText('5 added to cart')).toBeVisible()
```

---

*Testing analysis: 2026-06-11*
