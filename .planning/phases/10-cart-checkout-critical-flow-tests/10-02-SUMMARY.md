---
phase: 10-cart-checkout-critical-flow-tests
plan: 02
status: completed
completed_at: 2026-06-04
---

# Plan 02 Summary: Cart Server And Shopify Boundary Tests

## Result

Completed. Cart transport, Shopify cart operations, cart Server Actions, and quick-view route behavior now have automated tests that avoid live Shopify and focus on business outcomes at the boundary.

## Implemented

- Added `src/lib/shopify/client.test.ts` for credential handling, guarded test endpoint routing, variables, TypedDocumentNode printing, HTTP failures, and GraphQL errors.
- Added `src/lib/shopify/operations/cart.test.ts` for cart read/create/add/update/remove operations, `cache: 'no-store'`, `userErrors`, missing cart, checkout URL, totals, missing images, and discount allocation mapping.
- Added `src/lib/cart/actions.test.ts` for cookie lifecycle, add/update/remove actions, stale cart recovery, thrown stale cart behavior, quantity normalization, max-quantity errors, invalid form data, safe form messages, and `/cart` revalidation.
- Added `src/app/api/products/[handle]/quick-view/route.test.ts` for success shape, product-not-found 404, and fetch-failure 503.

## Verification

- `pnpm test:unit` passed: 3 files, 14 tests.
- `pnpm test:integration` passed: 2 files, 10 tests.
- `pnpm typecheck` passed.
- `pnpm lint` passed after fixing one import-order violation in `actions.test.ts`.

## Residual Notes

- The `lines(first: 100)` cart query cap is documented in the cart operation test as a known contract, not changed in this phase.
- These tests verify local business logic and Storefront API boundaries, not Shopify hosted checkout behavior.

