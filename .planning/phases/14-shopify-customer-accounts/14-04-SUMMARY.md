---
phase: 14-shopify-customer-accounts
plan: 04
subsystem: cart-checkout-identity
tags: [shopify-customer-account, cart, checkout-handoff, buyer-identity, playwright, codegen]
requires:
  - 14-01
  - 14-02
provides:
  - Storefront CartBuyerIdentityUpdate mutation and generated types
  - Buyer-identity-aware cart creation and sync operations
  - Login-time and pre-checkout cart identity sync
  - POST `/cart/checkout` handoff route with blocked identity-sync recovery
  - Compact cart account context UI and Storybook states
  - Fake-Shopify E2E coverage for signed-in checkout handoff and sync failure
affects: [cart, checkout-handoff, customer-account-session, fake-shopify-tests]
tech-stack:
  added: []
  patterns:
    - Cart client leaves import cart actions without pulling customer-session crypto by using a server-only dynamic session import inside actions.
    - Checkout handoff is a route boundary that redirects externally only after terms and buyer identity checks pass.
    - Fake checkout assertions inspect the local route Location header or local blocked state instead of loading real checkout.
key-files:
  created:
    - src/app/(storefront)/cart/checkout/route.ts
    - src/app/(storefront)/cart/checkout/route.test.ts
    - src/app/(storefront)/cart/_components/account-context.tsx
    - src/app/(storefront)/cart/_components/account-context.stories.tsx
  modified:
    - src/lib/shopify/queries/cart.graphql
    - src/lib/shopify/types/generated/gql.ts
    - src/lib/shopify/types/generated/graphql.ts
    - src/lib/shopify/operations/cart.ts
    - src/lib/cart/actions.ts
    - src/app/(storefront)/cart/_components/checkout-form.tsx
    - src/app/(storefront)/cart/page.tsx
    - src/app/(storefront)/account/callback/route.ts
    - src/app/(storefront)/account/logout/route.ts
    - tests/mocks/shopify-graphql-server.ts
    - tests/e2e/cart-checkout.spec.ts
key-decisions:
  - "CartFields selects schema-supported buyer identity fields only: customer id, email, phone, and countryCode."
  - "The checkout form posts to `/cart/checkout`; direct checkout anchors are no longer rendered."
  - "Identity-sync failure blocks signed-in checkout and offers retry, sign-in, and support paths without guest fallback."
patterns-established:
  - "Fake Storefront can deterministically reject `CartBuyerIdentityUpdate` via the `force-identity-sync-failure` test token."
  - "Logout attempts to clear buyer identity through Storefront but preserves the cart cookie and cart lines."
requirements-completed:
  - CART-01
  - CART-02
duration: 23 min
completed: 2026-06-19
---

# Phase 14 Plan 04: Cart Buyer Identity Sync And Blocked Checkout Handoff Summary

**Signed-in customer identity is attached to carts and verified before checkout, with fake-only blocked checkout coverage**

## Performance

- **Duration:** 23 min
- **Started:** 2026-06-19T11:55:10+08:00
- **Completed:** 2026-06-19T12:17:52+08:00
- **Tasks:** 5
- **Files modified:** 25

## Accomplishments

- Added `CartBuyerIdentityUpdate` to Storefront GraphQL, ran `pnpm codegen`, and exported the generated document/types through the Storefront type barrel.
- Added buyer-identity-aware `createCart`, `syncCartBuyerIdentity`, and `tryClearCartBuyerIdentity` operations with fake Storefront support.
- Updated cart Server Actions so signed-in cart creation includes buyer identity, login sync does not create empty carts, pre-checkout sync blocks failure, and no token is returned to UI.
- Replaced direct checkout links with POST `/cart/checkout`, terms validation, missing-cart recovery, identity-sync failure recovery, and external checkout redirect only after success.
- Added `CartAccountContext` and Storybook states for signed-in, sync-pending, and blocked sync-failed checkout.
- Extended fake-Shopify E2E coverage for signed-in checkout handoff and deterministic buyer identity sync failure, without visiting real Shopify checkout.

## Task Commits

1. **Plan 14-04 code and tests** - `97790fb` (`feat(14-04): sync account identity before checkout`)

**Plan metadata:** pending in docs commit.

## Files Created/Modified

- `src/lib/shopify/queries/cart.graphql` and `src/lib/shopify/types/generated/*` - Buyer identity cart fields and update mutation.
- `src/lib/shopify/operations/cart.ts` - Buyer identity create/sync/clear operations.
- `src/lib/cart/actions.ts` - Cart cookie helper, session-aware cart creation, sync helper, and checkout handoff preparation.
- `src/app/(storefront)/cart/checkout/route.ts` - Pre-checkout POST route boundary.
- `src/app/(storefront)/cart/_components/*` - Account context and POST checkout form updates.
- `src/app/(storefront)/account/callback/route.ts` and `logout/route.ts` - Login-time sync and logout identity clearing hooks.
- `tests/mocks/shopify-graphql-server.ts` and `tests/e2e/cart-checkout.spec.ts` - Fake Storefront identity state, deterministic failure, and browser coverage.

## Decisions Made

- Removed unsupported selected fields from `CartFields` after live schema validation rejected `customer.emailAddress` and selected `companyLocationId`; `companyLocationId` remains available as an input field.
- Kept the cart account context compact and recovery-oriented instead of adding account dashboard content to the cart.
- Asserted fake checkout handoff through the route response `Location` header in E2E so no external checkout page needs to load.

## Deviations from Plan

None - plan behavior executed as written. The inline GSD run used one code/test commit for the plan instead of one commit per task.

## Issues Encountered

- Initial codegen failed on unsupported selected cart buyer identity fields. The query was reduced to schema-supported fields and codegen passed.
- Storybook initially pulled customer-session crypto through the cart action module. Moving the session read behind a dynamic server-only helper kept browser story imports clean.
- A stale local Next dev process blocked the first Playwright run; it was stopped, and the fake-Shopify E2E suite passed.

## Verification

- `pnpm codegen` - passed after schema-supported query adjustment.
- `pnpm test:unit -- src/lib/shopify/operations/cart.test.ts` - passed, 1 file / 10 tests.
- `pnpm test:integration -- src/lib/cart/actions.test.ts "src/app/(storefront)/cart/checkout/route.test.ts" "src/app/(storefront)/account/**/*.test.ts"` - passed, 8 files / 33 tests.
- `pnpm typecheck` - passed.
- `pnpm test:stories` - passed, 100 files / 350 tests.
- `pnpm test:e2e` - passed, 3 fake-Shopify browser tests.
- `pnpm lint` - passed.
- Acceptance grep confirmed buyer identity generated types, no direct checkout URL in `checkout-form.tsx`, blocked recovery copy/actions, deterministic fake sync failure, and no customer token serialization in cart UI/actions.
- Pre-commit hooks ran `pnpm lint` and `pnpm test:contracts` successfully.

## User Setup Required

No real checkout testing was performed. Store-owner approval remains required before testing Shopify hosted checkout, payments, shipping rates, taxes, order creation, or success redirects.

## Next Phase Readiness

Plan 14-05 can finish account link migration, legacy redirects/bridge pages, readiness docs, and final Phase 14 coverage.

---

*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-19*
