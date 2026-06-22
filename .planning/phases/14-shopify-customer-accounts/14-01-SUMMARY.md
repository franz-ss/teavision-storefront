---
phase: 14-shopify-customer-accounts
plan: 01
subsystem: auth
tags: [shopify-customer-account, oauth, pkce, cookies, route-handlers, vitest]
requires: []
provides:
  - Customer Account API env validation and endpoint discovery
  - OAuth PKCE/state/nonce helpers and login/callback/logout route handlers
  - Sealed HttpOnly customer session and pending-auth cookies
  - Customer Account fetch client and initial read operations
  - Fake Customer Account API/OIDC test server and fixtures
  - OAuth login page and Storybook states
affects: [account-routes, customer-account-api, cart-identity, migration-parity]
tech-stack:
  added: []
  patterns:
    - Separate Customer Account API boundary under src/lib/shopify/customer-account
    - Server-owned sealed cookies for account session and pending OAuth state
    - Fake Customer Account API server for local unit and integration tests
key-files:
  created:
    - src/lib/shopify/customer-account/env.ts
    - src/lib/shopify/customer-account/discovery.ts
    - src/lib/shopify/customer-account/oauth.ts
    - src/lib/shopify/customer-account/session.ts
    - src/lib/shopify/customer-account/client.ts
    - src/lib/shopify/customer-account/operations.ts
    - src/app/(storefront)/account/login/start/route.ts
    - src/app/(storefront)/account/callback/route.ts
    - src/app/(storefront)/account/logout/route.ts
    - src/app/(storefront)/account/_components/login-panel.tsx
    - tests/mocks/customer-account-api-server.ts
    - tests/fixtures/shopify/customer-account.ts
  modified:
    - .env.example
    - package.json
key-decisions:
  - "Customer Account API has its own local type and transport boundary instead of using Storefront generated types."
  - "Session and pending OAuth material are sealed with AES-256-GCM and stored only in HttpOnly cookies."
  - "Integration script keeps the documented account glob and explicitly lists current account route tests because Vitest did not match route-group globs on Windows."
patterns-established:
  - "Customer account fetches default to cache: 'no-store' and redact token-like values from GraphQL errors."
  - "OAuth callback fails closed by clearing pending auth and redirecting to the verification-failed login state."
requirements-completed:
  - AUTH-01
  - AUTH-02
  - AUTH-03
  - AUTH-04
  - AUTH-05
  - SEC-01
  - SEC-02
  - SEC-03
  - SEC-04
duration: 38 min
completed: 2026-06-19
---

# Phase 14 Plan 01: Customer Account OAuth Foundation Summary

**Customer Account OAuth with PKCE/state/nonce, sealed HttpOnly sessions, fake OIDC/API coverage, and a Shopify sign-in entry page**

## Performance

- **Duration:** 38 min
- **Started:** 2026-06-19T10:40:00+08:00
- **Completed:** 2026-06-19T11:18:17+08:00
- **Tasks:** 5
- **Files modified:** 27

## Accomplishments

- Added the fake Customer Account API/OIDC server, customer/address/order fixtures, and smoke test used by later account plans.
- Added Customer Account env validation, OIDC discovery, OAuth helpers, token exchange, sealed session cookies, fetch client, and read operations.
- Added login start, callback, and logout route handlers with fake-Shopify integration tests for PKCE redirect, state mismatch, session creation, and logout cleanup.
- Added the `/account/login` page and route-local `LoginPanel` Storybook states for normal, expired, and verification-failed sign-in.

## Task Commits

1. **Plan 14-01 code and tests** - `ac2bda4` (`feat(14-01): add customer account oauth foundation`)

**Plan metadata:** pending in docs commit.

## Files Created/Modified

- `src/lib/shopify/customer-account/*` - Customer Account API config, discovery, OAuth, session, client, operations, types, and unit tests.
- `src/app/(storefront)/account/login/start/route.ts` - OAuth authorization start with safe return path and pending auth cookie.
- `src/app/(storefront)/account/callback/route.ts` - Callback validation, token exchange, nonce check, and session creation.
- `src/app/(storefront)/account/logout/route.ts` - Local session cleanup and discovered Shopify logout redirect.
- `src/app/(storefront)/account/_components/login-panel.tsx` - Compact Shopify sign-in panel with approved account states.
- `tests/mocks/customer-account-api-server.ts` - Fake discovery, token, logout, and Customer Account GraphQL boundary.
- `.env.example` - Customer Account setup variables and HTTPS callback note.
- `package.json` - Integration test command includes account route-handler tests.

## Decisions Made

- Kept Customer Account API types local and narrow; Storefront generated types remain isolated behind `src/lib/shopify/types/index.ts`.
- Used Node crypto AES-256-GCM sealing to avoid adding a session dependency while keeping session and pending-auth cookies server-owned.
- Retained the documented account test glob in `package.json`, and added explicit route test paths because Vitest did not pick up route-group account tests from the glob on Windows.

## Deviations from Plan

None - plan behavior executed as written. The inline GSD run used one code/test commit for the plan instead of one commit per task.

## Issues Encountered

- Order detail mapping initially expected GraphQL connection-shaped `lineItems`, while the fake fixture used a plain array. The mapper now accepts both shapes and the unit suite passes.
- Prettier cannot infer a parser for `.env.example`; TypeScript/TSX files were formatted and `.env.example` was left as edited.
- Vitest did not discover account route-group files via the account glob on Windows. Explicit account route test files were added to the integration script.

## Verification

- `pnpm test:unit -- tests/setup/customer-account-smoke.test.ts` - passed.
- `pnpm test:unit -- src/lib/shopify/customer-account tests/setup/customer-account-smoke.test.ts` - passed.
- `pnpm test:integration` - passed, 5 files / 15 tests.
- `pnpm typecheck` - passed.
- `pnpm lint` - passed.
- `pnpm test:stories` - passed, 92 files / 318 tests.
- Pre-commit hooks ran `pnpm lint` and `pnpm test:contracts` successfully.

## User Setup Required

No separate USER-SETUP file was generated. Operators must provide the new Customer Account env vars and configure Shopify callback/logout URLs before live account testing.

## Next Phase Readiness

Plan 14-02 can build protected account pages on top of `requireCustomerAccountSession()`, `getCustomerAccountDashboard()`, `getCustomerAccountOrders()`, and `getCustomerAccountOrder()`.

---

*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-19*
