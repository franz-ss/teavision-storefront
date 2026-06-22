---
phase: 14-shopify-customer-accounts
plan: 02
subsystem: account-dashboard-orders
tags: [shopify-customer-account, protected-routes, orders, dashboard, storybook, vitest]
requires:
  - 14-01
provides:
  - Protected account route shell, loading state, and scoped error boundary
  - Account dashboard with profile summary, default address, recent orders, support paths, and neutral wholesale copy
  - Cursor-paginated authenticated order history
  - Protected order detail pages with customer-scoped Customer Account API lookups
  - Storybook states for dashboard, order history, and order detail surfaces
affects: [account-routes, customer-account-api, account-ui, order-history]
tech-stack:
  added: []
  patterns:
    - Route-local account components under src/app/(storefront)/account/_components
    - Request-scoped protected account data with no public cache tags
    - Desktop semantic tables paired with mobile card layouts for account history
key-files:
  created:
    - src/app/(storefront)/account/layout.tsx
    - src/app/(storefront)/account/page.tsx
    - src/app/(storefront)/account/orders/page.tsx
    - src/app/(storefront)/account/orders/[orderId]/page.tsx
    - src/app/(storefront)/account/_components/dashboard.tsx
    - src/app/(storefront)/account/_components/order-history.tsx
    - src/app/(storefront)/account/_components/order-detail.tsx
    - src/app/(storefront)/account/_components/support-block.tsx
    - src/app/(storefront)/account/_components/status-pill.tsx
    - src/app/(storefront)/account/_lib/protection.ts
    - src/app/(storefront)/account/_lib/order-formatting.ts
  modified:
    - package.json
    - src/lib/shopify/customer-account/operations.ts
    - tests/mocks/customer-account-api-server.ts
key-decisions:
  - "ACCT-02 remains pending because Plan 14-02 delivered profile display only; update mutations are owned by Plan 14-03."
  - "Account section failures are scoped to the failed dashboard area so loaded profile/address/order data remains visible."
  - "Order detail pages accept only an order ID and rely on the authenticated Customer Account session for customer scoping."
patterns-established:
  - "Protected account pages call route-local `requireAccountSessionForPath()` before fetching Customer Account data."
  - "Order status formatting stays in `_lib/order-formatting.ts` and is covered by unit tests."
requirements-completed:
  - AUTH-04
  - ACCT-01
  - ACCT-03
  - ORD-01
  - ORD-02
  - ORD-03
  - ORD-04
duration: 15 min
completed: 2026-06-19
---

# Phase 14 Plan 02: Protected Account Dashboard And Orders Summary

**Protected `/account` workspace, paginated order history, and authenticated order detail pages**

## Performance

- **Duration:** 15 min
- **Started:** 2026-06-19T11:18:17+08:00
- **Completed:** 2026-06-19T11:33:15+08:00
- **Tasks:** 4
- **Files modified:** 22

## Accomplishments

- Added the protected account shell, loading skeleton, error boundary, and route-local session protection helper.
- Built the `/account` dashboard with recent orders, profile summary, default address, scoped section errors, support links, secondary logout, and approved neutral wholesale copy.
- Added cursor-paginated `/account/orders` history with desktop table and mobile card layouts.
- Added `/account/orders/[orderId]` detail pages with awaited Next.js 16 params, customer-scoped order lookups, line items, totals, shipping address, provided tracking URLs, and status page links.
- Added Storybook coverage for dashboard, order history, and order detail visual states, including empty, partial-error, tracking, and long-label cases.

## Task Commits

1. **Plan 14-02 code and tests** - `a2bbf63` (`feat(14-02): add protected account dashboard and orders`)

**Plan metadata:** pending in docs commit.

## Files Created/Modified

- `src/app/(storefront)/account/*` - Protected account layout, loading state, error boundary, dashboard page, order history page, and order detail page.
- `src/app/(storefront)/account/_components/*` - Dashboard, order history, order detail, support block, status pill, and Storybook states.
- `src/app/(storefront)/account/_lib/*` - Protected route helper and order status/date formatting helpers with tests.
- `src/lib/shopify/customer-account/operations.ts` - Dashboard partial-section error shaping for missing orders or addresses.
- `tests/mocks/customer-account-api-server.ts` - Fake API partial-section controls and GraphQL request recording.
- `package.json` - Integration test command includes account protected-route tests explicitly for Windows route-group discovery.

## Decisions Made

- Kept ACCT-02 pending because this plan displays supported profile/contact fields but does not yet update them.
- Rendered dashboard partial failures as scoped alerts instead of blanking the whole account surface.
- Kept customer scoping server-side by querying order details from the authenticated session without accepting a client-provided customer ID.

## Deviations from Plan

None - plan behavior executed as written. The inline GSD run used one code/test commit for the plan instead of one commit per task.

## Issues Encountered

- The integration test script still needs explicit account route files because Vitest does not match the documented route-group account glob on Windows.

## Verification

- `pnpm exec vitest run src/lib/shopify/customer-account/oauth.test.ts src/lib/shopify/customer-account/session.test.ts src/lib/shopify/customer-account/client.test.ts src/lib/shopify/customer-account/operations.test.ts "src/app/(storefront)/account/_lib/order-formatting.test.ts"` - passed, 5 files / 13 tests.
- `pnpm test:integration` - passed, 6 files / 16 tests.
- `pnpm typecheck` - passed.
- `pnpm test:stories` - passed, 95 files / 330 tests.
- `pnpm lint` - passed.
- Acceptance grep confirmed required dashboard/order literals, no `infinite` implementation, and no customer ID input on order detail fetches.

## User Setup Required

No new setup beyond the Customer Account env and Shopify admin prerequisites from Plan 14-01.

## Next Phase Readiness

Plan 14-03 can add profile/address Server Actions and address book UI on top of the protected account route shell and Customer Account operations boundary.

---

*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-19*
