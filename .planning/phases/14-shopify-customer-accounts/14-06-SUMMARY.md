---
phase: 14-shopify-customer-accounts
plan: 06
subsystem: customer-account-api-schema
tags: [shopify-customer-account, oauth, graphql, fake-api, vitest]
requires:
  - 14-01
  - 14-02
  - 14-03
  - 14-04
provides:
  - Verified OAuth start origin canonicalization and configured-origin callback redirects
  - Verified raw Customer Account Authorization token transport
  - Current-schema Customer Account fake API payloads for profile, address, order, and tracking data
  - Stale Customer Account schema rejection in fake API tests
affects: [customer-account-api, account-oauth, fake-shopify-tests]
tech-stack:
  added: []
  patterns:
    - GraphQL AST-based stale Customer Account selection detection in the fake API
    - Fake Customer Account mutations reject unsupported profile and address input fields
key-files:
  created: []
  modified:
    - src/lib/shopify/customer-account/operations.test.ts
    - tests/mocks/customer-account-api-server.ts
key-decisions:
  - "The fake Customer Account API now rejects stale schema selections with GraphQL parsing rather than line-based string matching."
  - "Valid app aliases such as phone: phoneNumber, provinceCode: zoneCode, and countryCodeV2: territoryCode remain supported at the GraphQL boundary."
patterns-established:
  - "Current-schema fake Customer Account responses return nested email/phone objects, aliased address fields, and trackingInformation connections."
requirements-completed:
  - AUTH-01
  - AUTH-02
  - AUTH-03
  - AUTH-04
  - AUTH-05
  - ACCT-01
  - ACCT-03
  - ADDR-01
  - ADDR-02
  - ORD-01
  - ORD-02
  - ORD-03
  - ORD-04
  - CART-01
  - SEC-01
  - SEC-02
  - SEC-03
  - SEC-04
duration: 10 min
completed: 2026-06-22
---

# Phase 14 Plan 06: OAuth And Customer Account Schema Gap Summary

**Customer Account local verification now catches stale live-Shopify schema failures before UAT.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-06-22T11:00:00+08:00
- **Completed:** 2026-06-22T11:09:56+08:00
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- Confirmed the existing login-start and callback route handlers already canonicalize to `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI` before state/callback redirects.
- Confirmed the Customer Account transport sends the raw access token in `Authorization`.
- Hardened the fake Customer Account API so stale scalar `emailAddress`/`phoneNumber` and old local fields such as `provinceCode`, `countryCodeV2`, `phone`, `trackingCompany`, and `trackingInfo` fail locally.
- Updated fake Customer Account mutation and order responses to use current-schema profile, address, and tracking payloads.

## Task Commits

1. **Task 3: Harden fake Customer Account API against stale schema** - `7031808` (`fix(14-06)`)

## Files Created/Modified

- `tests/mocks/customer-account-api-server.ts` - Uses GraphQL AST checks, rejects unsupported mutation input keys, returns current-schema order/profile payloads, and handles top-level default address updates.
- `src/lib/shopify/customer-account/operations.test.ts` - Verifies tracking mapping, default-address mutation behavior, and stale schema rejection.

## Decisions Made

Used the GraphQL parser for stale-field detection so valid aliases remain accepted while old Customer Account field selections fail.

## Deviations from Plan

Existing route-handler, transport, and operation fixes for Tasks 1 and 2 were already present in the working tree before this gap run. This execution verified them and completed the remaining fake API hardening.

**Total deviations:** 0 auto-fixed.
**Impact:** No scope expansion; the plan's local drift-detection goal is stronger.

## Issues Encountered

The first stale-field guard rejected the inner scalar of valid nested `emailAddress { emailAddress }` and `phoneNumber { phoneNumber }` selections. The parser check was corrected to reject only top-level scalar misuse.

## Verification

- `pnpm test:unit -- src/lib/shopify/customer-account/client.test.ts src/lib/shopify/customer-account/operations.test.ts tests/setup/customer-account-smoke.test.ts` - passed.
- `pnpm test:integration -- "src/app/(storefront)/account/login/start/route.test.ts" "src/app/(storefront)/account/callback/route.test.ts"` - passed.
- Pre-commit hook ran `pnpm lint` and `pnpm test:contracts` - passed.

## User Setup Required

No new setup. Live Shopify Customer Account OAuth retesting still requires configured Shopify Customer Accounts, protected data access, and HTTPS callback/logout URLs.

## Next Phase Readiness

Plan 14-07 can close the profile phone affordance gap on top of the corrected Customer Account writable-field boundary.

## Self-Check: PASSED

- Summary created.
- Task commit exists.
- Targeted verification passed.
- No real Shopify hosted checkout or payment testing was run.

---
*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-22*
