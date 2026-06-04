# Testing Patterns

**Analysis Date:** 2026-05-26
**Updated:** 2026-06-04 for Phase 10 cart and checkout-handoff test infrastructure

## Test Framework

**Primary Component Verification:**

- Storybook 10.3.5 with `@storybook/nextjs-vite`.
- Addons include docs, a11y, onboarding, Vitest addon, and Chromatic.
- Stories live beside components as `*.stories.tsx`.

**Script and Contract Tests:**

- Node built-in `node:test` is used for local script/custom-rule tests.
- Examples: `scripts/eslint-rules/no-raw-section.test.mjs`, `scripts/eslint-rules/no-raw-button.test.mjs`, `scripts/component-contracts/button-system.test.mjs`.

**Package-Level Test Runner:**

- Phase 10 adds an approved Vitest and Playwright exception for revenue-critical cart and checkout-handoff coverage.
- Storybook remains the preferred component documentation and interaction surface.
- Vitest covers Shopify transport, cart operations, Server Actions, and route handlers.
- Playwright covers a thin fake-Shopify browser flow for local cart-to-checkout handoff.
- Real Shopify hosted checkout UAT is documented but blocked until the Shopify dev store is configured and the store owner explicitly approves checkout testing.

## Run Commands

```bash
pnpm lint
pnpm build
pnpm codegen
pnpm storybook
pnpm build-storybook
pnpm test:contracts
pnpm test:unit
pnpm test:integration
pnpm test:e2e
node --test scripts/eslint-rules/no-raw-section.test.mjs
node --test scripts/eslint-rules/no-raw-button.test.mjs
node --test scripts/eslint-rules/no-button-style-class.test.mjs
node --test scripts/component-contracts/button-system.test.mjs
```

For a single Storybook story, open:

```text
http://localhost:6006/?path=/story/<story-id>
```

## Test File Organization

**Stories:**

- Co-located with component implementation files.
- Pattern: `src/components/<domain>/<component>/<component>.stories.tsx`.
- Story titles use domain names such as `UI/Button` and `Ui/QuantityStepper`.

**Node Tests:**

- Custom ESLint rule tests live beside rules in `scripts/eslint-rules/`.
- Source contract checks live in `scripts/component-contracts/`.

**Vitest Tests:**

- `src/lib/shopify/client.test.ts` covers transport behavior and the test-only fake endpoint.
- `src/lib/shopify/operations/cart.test.ts` covers cart operation variables, `no-store`, mapping, checkout URL, discounts, and user errors.
- `src/lib/cart/actions.test.ts` covers cart cookie lifecycle, Server Actions, quantity policy, stale carts, safe errors, and `/cart` revalidation.
- `src/app/api/products/[handle]/quick-view/route.test.ts` covers quick-view route success and failure behavior.
- `tests/setup/smoke.test.ts` proves shared fixtures and fake Shopify can create/read a cart.

**E2E Directory:**

- `tests/e2e/cart-checkout.spec.ts` covers a thin fake-Shopify cart flow and stops at the checkout URL.
- E2E must not navigate into real Shopify checkout until the dev store gate is cleared.

## Story Structure

**Storybook Pattern:**

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Add to Cart', variant: 'primary' },
}
```

**Interactive Story Pattern:**

- Use a `render` function with local React state for controlled components.
- Example: `src/components/ui/quantity-stepper/quantity-stepper.stories.tsx`.

## Node Test Structure

**Custom ESLint Rule Pattern:**

```js
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ESLint } from 'eslint'

test('reports invalid pattern', async () => {
  const messages = await lintText(code, filePath)
  assert.ok(messages.some((message) => message.ruleId === 'teavision/rule'))
})
```

**Source Contract Pattern:**

- Tests read source files as text and assert important class/variant/API contracts.
- Example: `scripts/component-contracts/button-system.test.mjs` checks 44px touch targets, variant names, and reduced-motion expectations.

## Mocking

**Current State:**

- Vitest uses direct module mocks for Next server-only boundaries such as `next/headers`, `next/cache`, and Shopify operations.
- `tests/mocks/shopify-graphql-server.ts` provides a stateful fake Storefront GraphQL server for local server-side Shopify calls.
- `tests/mocks/third-party-network.ts` blocks analytics, payment, Searchanise, Trustoo, Resend-like, and other third-party calls in Playwright.
- Storybook stories pass static args, render controlled state, or inject action functions.
- Node contract tests use real ESLint instances and filesystem reads.

**What to Mock:**

- If adding test infrastructure later, mock Shopify, Trustoo, Searchanise, Resend, and network calls at boundaries.
- Keep pure helpers unmocked.

## Fixtures and Factories

**Current State:**

- Shared Shopify fixtures live under `tests/fixtures/shopify/`.
- Use `makeMoney`, `makeVariant`, `makeCartLine`, `makeCart`, and `makeShopifyCartPayload` for reusable cart/product fixtures.
- Stories can import shared fixtures through the root alias when the fixture is reused by multiple tests.
- Keep one-off sample props local to a story/test unless reuse is real.

## Coverage

**Requirements:**

- No coverage target is configured.
- Storybook a11y and visual/manual review are the main UI quality gates.
- `pnpm lint` and `pnpm build` are required before claiming code is complete.

**Configuration:**

- `vitest.config.mts` configures app-level Vitest setup and path aliases.
- Storybook Vitest addon remains installed for Storybook's own test surface.
- `playwright.config.ts` starts a fake Shopify server and a local Next server for fake-only E2E handoff coverage.

## Test Types

**Component Stories:**

- Scope: UI primitives and domain components under `src/components/`.
- New components should include a Storybook story.
- Prefer representative states: default, loading, disabled, variants, empty/error states where applicable.

**Static Contract Tests:**

- Scope: Local ESLint rules and design-system source invariants.
- Use when enforcing anti-regression constraints that lint/build alone will not catch.

**Build and Type Checks:**

- `pnpm build` validates Next/TypeScript production build behavior.
- `pnpm codegen` validates Shopify GraphQL selection sets against the configured schema when credentials are available.

**Manual Flow Checks:**

- Storefront data depends on Shopify credentials outside test mode.
- Product/cart changes should use unit, integration, Storybook, and fake-only E2E checks first.
- Hosted checkout UAT is documented in `docs/testing/cart-checkout-uat.md`, but execution is blocked until the Shopify dev store is ready and explicitly approved.
- Review-driven refinement rationale for the cart and checkout test slice is documented in `docs/testing/cart-checkout-refinement-rationale.md`.

## Common Verification Matrix

**UI Component Change:**

- Add/update `*.stories.tsx`.
- Run `pnpm lint`.
- Run Storybook and inspect target story.
- Run `pnpm build` if the component is route-critical or uses Next APIs.

**Shopify Query/Type Change:**

- Update `src/lib/shopify/queries/*.graphql`.
- Run `pnpm codegen`.
- Update `src/lib/shopify/types/index.ts`.
- Run `pnpm lint` and `pnpm build`.

**Cart or Server Action Change:**

- Run `pnpm test:unit`.
- Run `pnpm test:integration`.
- Run `pnpm test:stories` when UI states change.
- Run `pnpm test:e2e` for local fake-Shopify cart handoff changes.
- Do not run real Shopify hosted checkout UAT until the dev store is ready and explicitly approved.

**Hosted Checkout UAT:**

- Use `docs/testing/cart-checkout-uat.md`.
- Validate customer, shipping, billing, payment, order, tax, shipping, and success states only against the approved Shopify dev store.
- Keep production payment credentials, production fulfilment, and production communications disabled.

## Residual Gaps

- Cart discount-code entry is not present in the Next storefront; discount-code behavior is checkout-only unless a separate cart discount feature is added.
- `src/lib/shopify/queries/cart.graphql` currently fetches `lines(first: 100)`. Tests document this cap; pagination or warning UI is a separate product decision.
- Local tests prove checkout URL handoff, not hosted payment/order behavior.
- Dev-store hosted checkout UAT remains blocked until store setup is complete.

**Custom ESLint Rule Change:**

- Run the matching `node --test scripts/eslint-rules/*.test.mjs`.
- Run `pnpm lint`.

---

_Testing analysis: 2026-05-26_
_Update when test infrastructure or verification gates change_
