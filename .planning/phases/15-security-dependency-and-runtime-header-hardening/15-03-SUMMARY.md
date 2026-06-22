---
phase: 15-security-dependency-and-runtime-header-hardening
plan: 03
subsystem: customer-accounts
tags: [oauth, prefetch, account, launch-gate]
requires: [15-01]
provides:
  - "Direct OAuth-start account links opt out of Next prefetch"
  - "Fake/local proof for OAuth-start forwarded-origin behavior"
  - "Owner-gated live OAuth evidence checklist"
affects: [security, account, oauth, checkout-handoff]
tech-stack:
  added: []
  patterns:
    - "Only direct /account/login/start buttons disable Next prefetch"
    - "Component tests mock the Button boundary to assert LinkProps pass-through"
key-files:
  created:
    - "src/app/(storefront)/account/_components/login-panel/login-panel.test.tsx"
  modified:
    - "src/app/(storefront)/account/_components/login-panel/login-panel.tsx"
    - "src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.tsx"
    - "src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.test.tsx"
    - "src/app/(storefront)/account/login/start/route.test.ts"
    - "docs/testing/customer-accounts-setup.md"
key-decisions:
  - "Disable prefetch only on direct Shopify Customer Account OAuth-start links."
  - "Use fake/local route tests for forwarded origin behavior and do not call live Shopify OAuth."
  - "Document live OAuth evidence as blocked until owner/admin approval is recorded."
patterns-established:
  - "Account component tests can mock the shared Button component to assert non-DOM LinkProps such as prefetch."
requirements-completed: [SEC-04]
duration: 8 min
completed: 2026-06-22
---

# Phase 15 Plan 03: Customer Account OAuth-Start Prefetch and Origin Hardening Summary

**Prevented direct Customer Account OAuth-start links from prefetching, extended fake/local origin tests, and documented the live OAuth approval gate.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-22T18:27:21+08:00
- **Completed:** 2026-06-22T18:34:20+08:00
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Added `prefetch={false}` to the primary Shopify sign-in buttons in `LoginPanel` and `LegacyBridge`.
- Left ordinary `/account`, contact, collection, and other internal navigation links unchanged.
- Added component regression coverage that fails if the primary OAuth-start button loses `prefetch={false}`.
- Extended `/account/login/start` route tests with a forwarded host/proto case so correctly forwarded production-origin requests proceed to fake OAuth instead of canonicalizing again.
- Documented Phase 15 OAuth launch evidence, including required callback/logout env vars, local/fake coverage, and owner/admin-gated live OAuth proof.

## Task Commits

Each task was committed atomically:

1. **Task 1: Disable prefetch on direct OAuth-start buttons** - `81edc4f` (fix)
2. **Task 2: Extend component and route coverage for OAuth-start behavior** - `808b28f` (test)
3. **Task 3: Document Phase 15 account launch evidence and owner gates** - `1103598` (docs)

## Files Created/Modified

- `src/app/(storefront)/account/_components/login-panel/login-panel.tsx` - Primary Shopify sign-in button now passes `prefetch={false}`.
- `src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.tsx` - Legacy bridge primary Shopify sign-in button now passes `prefetch={false}`.
- `src/app/(storefront)/account/_components/login-panel/login-panel.test.tsx` - New prop-level regression test for LoginPanel OAuth-start prefetch behavior.
- `src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.test.tsx` - Extended prop-level regression coverage for LegacyBridge.
- `src/app/(storefront)/account/login/start/route.test.ts` - Added forwarded host/proto origin coverage.
- `docs/testing/customer-accounts-setup.md` - Added Phase 15 OAuth Launch Evidence section.

## Decisions Made

- The shared `Button` primitive already accepts `LinkProps`, so it was not changed.
- Storybook remained unchanged because rendered DOM cannot reliably expose a false boolean `prefetch` prop.
- Live Shopify Customer Account OAuth remains owner/admin-gated and was not executed.

## Verification

- `pnpm typecheck` - passed.
- `pnpm test:integration -- "src/app/(storefront)/account/**/*.test.ts" "src/app/(storefront)/account/**/*.test.tsx"` - passed, 8 files and 40 tests.
- `node -e "...customer-accounts-setup.md..."` doc marker check - passed with `OK`.
- `pnpm test:e2e` - passed, 4 fake-Shopify Playwright tests.

## Deviations from Plan

### Intentional Test Placement

**1. Added `login-panel.test.tsx` instead of extending Storybook interactions**
- **Reason:** `prefetch={false}` is a React/Next Link prop, not a rendered DOM attribute, so a focused component test with a mocked Button boundary provides stronger regression coverage.
- **Files modified:** `src/app/(storefront)/account/_components/login-panel/login-panel.test.tsx`
- **Verification:** Account integration test command passed.
- **Committed in:** `808b28f`

---

**Total deviations:** 1 intentional test-placement choice. **Impact:** Better automated proof for the exact prop boundary without changing runtime behavior.

## Issues Encountered

- `pnpm test:e2e` emitted existing Next development warnings about server cache bypass and `/teavision.svg` LCP loading, but all fake-Shopify tests passed.

## User Setup Required

- Live Shopify Customer Account OAuth still requires owner/admin approval and matching Shopify admin callback/logout URLs before manual execution.

## Next Phase Readiness

Plan 15-04 can start with account OAuth-start prefetch risk mitigated and fake/local account evidence in place.

---
*Phase: 15-security-dependency-and-runtime-header-hardening*
*Completed: 2026-06-22*
