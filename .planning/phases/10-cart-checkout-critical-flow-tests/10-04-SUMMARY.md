---
phase: 10-cart-checkout-critical-flow-tests
plan: 04
status: completed
completed_at: 2026-06-04
---

# Plan 04 Summary: Fake Cart E2E And Hosted Checkout UAT Gate

## Result

Completed. A deterministic Playwright flow now covers the local cart revenue path against fake Shopify, and hosted Shopify checkout validation is documented as a gated manual UAT process until the development store is ready.

## Implemented

- Added `tests/e2e/cart-checkout.spec.ts` for PDP add-to-cart, success feedback, header cart badge, cart line/subtotal, quantity update, remove-to-empty, and fake checkout URL handoff.
- Configured Playwright web servers for the fake Shopify GraphQL service and local Next dev server.
- Blocked third-party network hosts during E2E.
- Added `docs/testing/cart-checkout-uat.md` with staged checkout UAT coverage for customer information, addresses, shipping, billing, payment success/failure, order summary, order creation, redirects, and recovery paths.
- Updated `.planning/codebase/TESTING.md` with the new test hierarchy, commands, fake Shopify policy, UAT gate, and residual gaps.

## Verification

- `pnpm test:e2e` passed: 1 Chromium test.
- `pnpm lint` passed.
- `pnpm test:contracts` passed.
- `pnpm build` passed.

## Explicit Checkout Gate

Hosted Shopify checkout, payment, order creation, shipping-rate, tax, billing, and success-redirect tests were not executed. This is intentional and follows the user's instruction to wait until the development store is set up and explicit checkout testing approval is given.

## Deviations

- The E2E suite uses `next dev` with fake Shopify instead of a production web server. The production build was run separately and passed.
