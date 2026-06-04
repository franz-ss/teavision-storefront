# Cart and Checkout Critical Flow Testing Strategy

**Status:** Planning artifact only. No tests have been written.
**Traceability:** Standalone Phase 5 follow-up for `AUDIT-04` and `AUDIT-10`; not yet added to `.planning/ROADMAP.md`.
**Checkout UAT gate:** Real Shopify hosted checkout testing is blocked until the dev store is set up and explicitly approved. This plan may test only fake/local checkout handoff and may document the hosted checkout checklist.

## Strategy and Rationale

The highest-value tests should protect the revenue path customers actually use:

1. Select a product variant and valid quantity.
2. Add it to Shopify cart through a Server Action.
3. Persist the Shopify cart ID in an HTTP-only cookie.
4. Render Shopify-reported line, subtotal, discount, and quantity data.
5. Update or remove lines safely.
6. Proceed to Shopify hosted checkout through the latest `cart.checkoutUrl`.

This app does not own a custom checkout. Customer information validation, shipping address validation, billing address validation, shipping method selection, payment method selection, order creation, payment processing, tax, shipping, success redirects, and hosted recovery states belong to Shopify checkout. The local test suite should verify the handoff. A staged Shopify UAT checklist should verify hosted checkout behavior after the dev store exists; until then, do not run real checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests.

## Test Hierarchy

| Layer               | Tool                              | Purpose                                                                                             |
| ------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| Unit                | Vitest                            | Pure helpers, fixture factories, transport behavior, quantity/error policy                          |
| Integration         | Vitest Node                       | `src/lib/cart/actions.ts`, `src/lib/shopify/operations/cart.ts`, `shopifyFetch()`, quick-view route |
| Component/story     | Storybook play tests              | Existing client leaves and extracted cart render states                                             |
| E2E                 | Playwright with fake Shopify      | Thin browser coverage of add-to-cart, header refresh, cart page, checkout handoff                   |
| Hosted checkout UAT | Shopify staging/test payment mode | Deferred until dev store setup; checklist only for now                                              |

## Coverage Matrix

| Feature                         | Priority | Coverage                                                                                                   |
| ------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| Add to cart from PDP            | P0       | Storybook payload tests, server-action tests, one E2E journey                                              |
| Add to cart from listing/card   | P1       | Storybook with injected `addToCart`                                                                        |
| Quick view add to cart          | P1       | Route integration plus Storybook fetch/add/retry states                                                    |
| Remove from cart                | P0       | Server-action integration, Storybook, E2E                                                                  |
| Update quantity                 | P0       | Server-action integration, Storybook, E2E                                                                  |
| Cart persistence                | P0       | Cookie lifecycle integration tests and E2E                                                                 |
| Price calculations              | P0       | Shopify operation mapper tests and cart view stories                                                       |
| Discounts/promotions            | P0       | Cart operation fixtures and cart view stories now; staged Shopify UAT after dev store setup                |
| Tax calculations                | P1       | Cart "calculated at checkout" render test now; staged Shopify UAT after dev store setup                    |
| Shipping calculations           | P1       | Cart "calculated at checkout" render test now; staged Shopify UAT after dev store setup                    |
| Inventory validation            | P0       | Server-action Shopify `userErrors` and Storybook sold-out/max states now; staged UAT after dev store setup |
| Product variant selection       | P0       | Product form and quick-view stories                                                                        |
| Edge cases and errors           | P0       | Missing/stale cookie, malformed form, invalid line, network/GraphQL/user errors                            |
| Customer information validation | P1       | Deferred hosted Shopify UAT after dev store setup                                                          |
| Shipping address validation     | P1       | Deferred hosted Shopify UAT after dev store setup                                                          |
| Billing address validation      | P1       | Deferred hosted Shopify UAT after dev store setup                                                          |
| Shipping method selection       | P1       | Deferred hosted Shopify UAT after dev store setup                                                          |
| Payment method selection        | P1       | Deferred hosted Shopify UAT after dev store setup                                                          |
| Order summary calculations      | P0       | Local cart subtotal now; hosted checkout subtotal comparison after dev store setup                         |
| Order creation flow             | P1       | Deferred hosted Shopify UAT with test order after dev store setup                                          |
| Payment processing flow         | P1       | Deferred hosted Shopify UAT with success and failure payment paths after dev store setup                   |
| Success states and redirects    | P1       | Deferred hosted Shopify UAT after dev store setup                                                          |
| API failure handling            | P0       | Unit, integration, Storybook, and E2E failure cases                                                        |
| Retry mechanisms                | P2       | Quick-view retry and add-to-cart resubmit paths                                                            |

## Risk Assessment

| Risk                                             | Impact                               | Mitigation                                                                   |
| ------------------------------------------------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| Cart add/update/remove silently breaks           | Direct revenue loss                  | P0 server-action and E2E coverage                                            |
| Stale cart cookie blocks shopper                 | Lost cart/session trust              | Missing, null, and thrown stale-cart tests                                   |
| Bulk savings display differs from Shopify totals | Price trust loss                     | Cart discount fixtures and staged bulk checkout UAT                          |
| Header badge stays stale after add               | User confusion                       | Playwright route refresh/header assertion                                    |
| Hosted checkout behavior is assumed              | Payment/address/shipping regressions | Explicit staged Shopify UAT checklist; execution gated until dev store setup |
| CI hits live Shopify or payment services         | Flaky or risky tests                 | Fake Storefront server and blocked third-party hosts                         |
| Cart over 100 lines hides lines                  | Wholesale management risk            | Contract test documenting `lines(first: 100)` plus follow-up decision        |
| Test suite becomes brittle                       | Slow, ignored tests                  | Behavior assertions, typed fixtures, thin E2E                                |

## Detailed Test Cases

### Cart Server Actions

- `getCartAction` returns `null` with no cookie.
- `getCartAction` returns cart with valid cookie.
- `addToCartAction` creates a cart, sets cookie, adds line, and revalidates `/cart`.
- `addToCartAction` reuses an existing cart.
- `addToCartAction` deletes stale null cart and recreates.
- `addToCartAction` handles or documents thrown stale-cart errors.
- Quantity validation covers `0`, negative, `NaN`, decimal, non-finite, and huge values.
- `updateCartLineAction` requires cookie and revalidates `/cart`.
- `removeCartLineAction` requires cookie and revalidates `/cart`.
- `cartLineFormAction` handles remove, update, invalid/missing fields, unknown intent, and generic thrown errors.

### Shopify Operations and Transport

- Cart reads and mutations call `shopifyFetch` with expected documents, variables, and `cache: 'no-store'`.
- `createCart`, `addCartLines`, `updateCartLines`, and `removeCartLines` throw joined Shopify `userErrors`.
- Cart mapper preserves checkout URL, totals, line costs, quantity, merchandise, images, and discounts.
- Discount allocations cover automatic, custom, code, and null/unknown title.
- `shopifyFetch()` covers missing credentials, non-OK HTTP, GraphQL errors, successful response, variables, and TypedDocumentNode printing.
- Quick-view route returns 404 for missing product and 503 for fetch failures.

### UI and Storybook

- Empty cart renders no checkout link.
- Populated cart renders item count, subtotal, discounts, shipping/tax copy, and checkout link.
- Long titles and missing images render safely.
- Cart line increase, decrease, remove, pending, and error states work through injected action.
- PDP submits selected variant and selected quantity.
- Bulk tier add submits the tier minimum quantity.
- Variant/quantity changes reset feedback.
- Product forms cover sold-out, max quantity, pending, success, and failure.
- Quick view covers fetch failure, invalid response, retry success, add failure, and add recovery.

### E2E

- PDP add-to-cart updates status, header badge, `/cart` line, subtotal, and checkout link.
- Cart update changes line quantity, subtotal, and header badge.
- Cart remove transitions to empty cart and removes checkout link.
- Add failure shows safe error and allows retry.
- Checkout handoff URL points to fake checkout URL for the current fake cart.

### Hosted Checkout UAT

Do not execute this checklist yet. It is blocked until the Shopify dev store is configured, test payments are safe, and the store owner explicitly approves hosted checkout testing.

- Cart subtotal and discounts match Shopify checkout subtotal before shipping and tax.
- Invalid customer information is rejected by Shopify checkout.
- Valid Australian shipping address returns shipping methods.
- Invalid or unsupported address shows a safe no-rate/error state.
- Billing same-as-shipping and different billing paths work.
- Test payment success creates a test order when available.
- Test payment failure shows recovery path.
- Success or thank-you state appears after successful checkout.

## Suggested File Structure

```text
vitest.config.mts
playwright.config.ts
tests/setup/vitest.ts
tests/fixtures/shopify/money.ts
tests/fixtures/shopify/product.ts
tests/fixtures/shopify/cart.ts
tests/fixtures/shopify/storefront-payloads.ts
tests/mocks/shopify-graphql-server.ts
tests/mocks/third-party-network.ts
tests/e2e/cart-checkout.spec.ts
src/lib/shopify/client.test.ts
src/lib/shopify/operations/cart.test.ts
src/lib/cart/actions.test.ts
src/app/api/products/[handle]/quick-view/route.test.ts
src/app/(storefront)/cart/_components/cart-view.tsx
src/app/(storefront)/cart/_components/cart-view.stories.tsx
```

## Reusable Utilities

```ts
import type { Cart, CartLine, Money } from '@/lib/shopify/types'

export function makeMoney(amount = '12.00', currencyCode = 'AUD'): Money {
  return { amount, currencyCode }
}

export function makeCartLine(overrides: Partial<CartLine> = {}): CartLine {
  return {
    id: 'gid://shopify/CartLine/1',
    quantity: 1,
    cost: {
      amountPerQuantity: makeMoney(),
      subtotalAmount: makeMoney(),
      totalAmount: makeMoney(),
    },
    discountAllocations: [],
    merchandise: {
      id: 'gid://shopify/ProductVariant/1',
      title: '50g Sample',
      price: makeMoney(),
      product: {
        handle: 'tea-masters-sencha',
        title: 'Tea Masters Sencha',
        featuredImage: null,
      },
    },
    ...overrides,
  }
}

export function makeCart(overrides: Partial<Cart> = {}): Cart {
  const lines = overrides.lines ?? [makeCartLine()]

  return {
    id: 'gid://shopify/Cart/1',
    checkoutUrl: 'https://checkout.test/cart/1',
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    cost: {
      subtotalAmount: makeMoney(),
      totalAmount: makeMoney(),
    },
    lines,
    ...overrides,
  }
}
```

## Architecture Gaps

| Gap                                                                                  | Recommendation                                                                    |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `AGENTS.md` currently says no runner outside Storybook                               | Document the approved Phase 10 exception before adding Vitest/Playwright          |
| `shopifyFetch()` has no fake endpoint seam                                           | Add a guarded test-only Storefront endpoint override                              |
| Cart actions mix cookies, Shopify calls, validation, error mapping, and revalidation | Extract pure helpers or use focused module mocks where extraction is not worth it |
| Cart render logic is embedded in async page                                          | Extract route-only `CartView`                                                     |
| `getCartAction()` does not clear stale null cookies                                  | Decide desired behavior and cover it                                              |
| Invalid cart ID throws are not normalized                                            | Normalize known invalid-cart errors if safe                                       |
| `checkoutUrl` is stringified without validation                                      | Add mapper test or URL validation                                                 |
| `lines(first: 100)` has no pagination                                                | Contract-test and decide follow-up                                                |
| Hosted checkout has no repeatable checklist                                          | Add UAT doc and launch gate                                                       |

## Review Passes Applied

- Architecture Review Agent
- Business Logic Review Agent
- Frontend Testing Expert Agent
- QA Automation Agent
- Edge Case and Failure Scenario Agent
- Plan Checker revision pass
