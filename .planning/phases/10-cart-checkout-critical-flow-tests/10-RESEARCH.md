# Phase 10: Cart and Checkout Critical Flow Tests - Research

**Date:** 2026-06-04
**Mode:** Multi-pass architecture, business logic, frontend testing, QA automation, and failure-scenario review

## RESEARCH COMPLETE

## Current Architecture

The storefront is a headless Shopify app using Next.js 16 App Router and React 19. Product, collection, cart, and checkout data come from Shopify Storefront GraphQL.

Cart state is server-owned:

1. Product and listing client leaves call `addToCartAction(variantId, quantity)`.
2. `src/lib/cart/actions.ts` reads the `teavision_cart` HTTP-only cookie.
3. Missing cart cookies create a Shopify cart and set the cookie.
4. Existing cookies call `getCart(cartId)`. A `null` cart is deleted and recreated in the add flow.
5. Cart mutations call `src/lib/shopify/operations/cart.ts`.
6. `/cart` renders fresh cart data through `getCartAction()`.
7. Checkout is an external handoff via `cart.checkoutUrl`.

There is no local checkout application. Customer information validation, shipping address validation, billing address validation, shipping method selection, payment method selection, order creation, payment processing, success redirects, shipping calculations, and tax calculations happen inside Shopify hosted checkout.

## Existing Coverage

- Storybook interaction stories already cover parts of `ProductPurchaseForm` and `CartLineActions`.
- `package.json` includes `typecheck`, `test:contracts`, `test:stories`, lint, build, and Storybook commands.
- There is no app-wide Vitest/Jest/Playwright test suite.
- `.planning/codebase/TESTING.md` still says cart changes require manual add, update, remove, empty cart, and checkout handoff checks.

## Review Pass Synthesis

### Architecture Review Agent

Key findings:

- Cart operations are intentionally uncached and use `cache: 'no-store'`.
- Header cart count freshness depends on `router.refresh()` from `useAddToCart` and cart page revalidation.
- `getOrCreateCart()` recovers from `getCart()` returning `null`, but not necessarily from thrown invalid-cart errors.
- `getCartAction()` returns `null` for stale carts but does not delete stale cookies.
- Server action testing is hard because cookies, Shopify operations, validation, error mapping, and revalidation live in one module.

Plan impact:

- Add server-action integration tests for cookie lifecycle and stale cart behavior.
- Add architecture contract tests for uncached cart operations and cart-cookie options.
- Add Playwright flow coverage for header badge refresh.

### Business Logic Review Agent

Key findings:

- Highest-value path is cart-to-checkout revenue integrity.
- Bulk tier UI promises must reconcile with Shopify-reported cart and checkout totals.
- PDP quantity logic is stricter than quick-view/listing quantity logic.
- Large carts over 100 lines are a wholesale-buyer risk because `cart.graphql` fetches `lines(first: 100)`.
- Discount-code support may be checkout-only today, but project reference material mentions discount-code actions.

Plan impact:

- P0 coverage includes add-to-cart, cart persistence, checkout URL handoff, bulk/discount display, and inventory rejection.
- P2 coverage documents the 100-line cap and discount-code scope decision.
- Real Shopify UAT must verify hosted checkout totals for bulk/promotional products.

### Frontend Testing Expert Agent

Key findings:

- Storybook is currently the best component interaction surface.
- Extracting a `CartView` from the async server page would make cart render states easy to test with fixtures.
- Use existing dependency injection points: `CartLineActions.action`, product form `addToCart`, and `onCartChanged`.
- Avoid snapshots and class assertions; use roles, names, status, alert, disabled, and href behavior.

Plan impact:

- UI tests extend existing stories instead of duplicating them in a second harness unless Vitest/RTL adds value.
- Add Storybook plays for cart render states, product add-to-cart payloads, error reset, pending states, and checkout handoff rendering.

### QA Automation Agent

Key findings:

- Recommended hierarchy: Vitest/RTL for units/components, Vitest Node for server/action integration, Playwright for E2E.
- Next docs caution against direct unit testing of async Server Components; prefer E2E or extracted sync views.
- Because Shopify calls happen server-side, Playwright browser route interception is insufficient. Use a test-only Storefront GraphQL endpoint override.
- Keep existing `node:test` contract checks unless a broader migration is needed.

Plan impact:

- Add `vitest.config.mts`, test setup, fixtures, fake Shopify server, and Playwright config.
- Keep Playwright specs thin and deterministic.
- Add CI-friendly scripts but do not force external providers into CI.

### Edge Case and Failure Scenario Agent

Key findings:

- Highest-risk gaps are invalid/expired cart cookies, Shopify API/network errors, removed variants, quantity tampering, concurrent updates, route refresh, and checkout URL validity.
- Server currently truncates decimal quantities with `Math.trunc`, which may conflict with the user-facing "whole number" copy.
- Quick-view has retry UI for product fetch but generic add-to-cart failure handling.
- Discount allocations should be covered for automatic, custom, code, and unknown/null titles.

Plan impact:

- Unit/integration test cases explicitly cover quantity `0`, negative, `NaN`, decimal, huge values, invalid form data, stale line IDs, Shopify user errors, and generic failures.
- E2E tests include delayed fake mutations and state refresh checks.

## Highest-Risk Seams

| Risk | Impact | Evidence | Test response |
|------|--------|----------|---------------|
| Stale cart cookie recovery is inconsistent | User cannot add or view cart after Shopify invalidates cart | `src/lib/cart/actions.ts` | Server-action integration tests with missing, null, and thrown cart reads |
| Header badge can stay stale | Users doubt add-to-cart worked | `src/components/product/use-add-to-cart.ts`, header `CartCount` | Playwright add-to-cart flow with fake Shopify |
| Checkout URL may be stale or malformed | Revenue loss at checkout handoff | `src/lib/shopify/operations/cart.ts`, `/cart/page.tsx` | Mapper contract plus cart view/E2E handoff assertion |
| Bulk savings UI can overpromise | Price trust and conversion loss | `BulkSavings`, Shopify cart discounts | Fixture tests plus real staged Shopify UAT |
| Inventory races and removed variants | Add-to-cart failures near purchase intent | `addToCartAction`, Shopify `userErrors` | Server-action error mapping and UI failure stories |
| Cart line cap hides lines over 100 | Wholesale cart management risk | `cart.graphql lines(first: 100)` | Contract test documenting cap and product decision note |
| Hosted checkout is outside repo | False confidence if local tests pretend to validate payment | Project reference, cart page link | Explicit staged checkout UAT checklist |

## Recommended Test Stack

- **Unit and component:** Vitest + React Testing Library where Storybook is not enough; Storybook plays for most existing client leaves.
- **Integration:** Vitest Node for server actions, Shopify operations, route handlers, transport boundary, cookie behavior, and fake GraphQL fixtures.
- **E2E:** Playwright against production build with a local fake Shopify endpoint and blocked third-party hosts.
- **Manual/UAT:** Staged Shopify checkout for hosted customer, shipping, billing, payment, order, tax, shipping-rate, and success redirect coverage.

## Research Recommendations

1. Keep the browser suite small: two to five cart E2E flows are enough if unit/integration coverage is strong.
2. Move business-logic edge cases down to server-action and operation tests.
3. Do not unit-test async Server Components directly; extract a `CartView` or use E2E.
4. Do not mock Shopify inside production code. Add a test-only endpoint override guarded by an explicit test env var.
5. Update `.planning/codebase/TESTING.md` after implementation so future work stops treating cart QA as manual-only.
