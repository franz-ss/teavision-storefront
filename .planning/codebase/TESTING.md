# Testing Patterns

**Analysis Date:** 2026-05-26

## Test Framework

**Primary Component Verification:**
- Storybook 10.3.5 with `@storybook/nextjs-vite`.
- Addons include docs, a11y, onboarding, Vitest addon, and Chromatic.
- Stories live beside components as `*.stories.tsx`.

**Script and Contract Tests:**
- Node built-in `node:test` is used for local script/custom-rule tests.
- Examples: `scripts/eslint-rules/no-raw-section.test.mjs`, `scripts/eslint-rules/no-raw-button.test.mjs`, `scripts/component-contracts/button-system.test.mjs`.

**Package-Level Test Runner:**
- `package.json` does not define a `test` script.
- `AGENTS.md` states there is no test runner outside Storybook. Treat Node tests as targeted contract checks to run directly when editing the relevant scripts/rules.

## Run Commands

```bash
pnpm lint
pnpm build
pnpm codegen
pnpm storybook
pnpm build-storybook
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

**No E2E Directory:**
- There is no committed Playwright/Cypress/e2e test suite.

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
- No dedicated mocking framework is configured.
- Storybook stories pass static args or render controlled state.
- Node tests use real ESLint instances and filesystem reads.

**What to Mock:**
- If adding test infrastructure later, mock Shopify, Trustoo, Searchanise, Resend, and network calls at boundaries.
- Keep pure helpers unmocked.

## Fixtures and Factories

**Current State:**
- Stories usually define inline sample props.
- There is no shared `test-utils` or fixtures directory.
- Use small local fixtures near the story/test unless reuse becomes real.

## Coverage

**Requirements:**
- No coverage target is configured.
- Storybook a11y and visual/manual review are the main UI quality gates.
- `pnpm lint` and `pnpm build` are required before claiming code is complete.

**Configuration:**
- Storybook Vitest addon is installed, but no app-wide Vitest/Jest config exists.
- Node tests are run directly.

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
- Storefront data depends on real Shopify credentials, so product/cart changes often need manual dev-server verification.
- Use product, collection, cart, contact, and Storybook paths appropriate to the change.

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
- Run `pnpm lint` and `pnpm build`.
- Manually test add, update, remove, empty cart, and checkout handoff against a real Shopify cart.

**Custom ESLint Rule Change:**
- Run the matching `node --test scripts/eslint-rules/*.test.mjs`.
- Run `pnpm lint`.

---

*Testing analysis: 2026-05-26*
*Update when test infrastructure or verification gates change*
