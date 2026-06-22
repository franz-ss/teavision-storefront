---
phase: 14-shopify-customer-accounts
plan: 05
subsystem: migration-readiness
tags: [shopify-customer-account, migration, legacy-routes, launch-readiness, playwright, storybook]
requires:
  - 14-01
  - 14-02
  - 14-03
  - 14-04
provides:
  - Header account icon link to `/account`
  - Footer Login link replacement for owned account routing
  - Legacy account bridge routes for register, recover, reset, activate, and unknown classic account paths
  - Safe legacy return/context parameter normalization
  - Customer Account setup, manual approval, reorder, and B2B/customer-pricing readiness documentation
  - Final fake-Shopify migration browser smoke coverage
affects: [account-navigation, legacy-account-routing, launch-readiness, fake-shopify-tests]
tech-stack:
  added: []
  patterns:
    - Legacy bridge UI stays route-local and presentational so Storybook does not import server-only Customer Account crypto helpers.
    - Legacy account return values reuse the account/cart/checkout-safe return boundary and ignore unknown parameter names.
    - Real checkout testing remains an operator-approved manual gate; automated browser coverage stops at fake checkout URLs.
key-files:
  created:
    - src/app/(storefront)/account/_lib/legacy-routing.ts
    - src/app/(storefront)/account/_lib/legacy-routing.test.ts
    - src/app/(storefront)/account/_components/legacy-bridge.tsx
    - src/app/(storefront)/account/_components/legacy-bridge.stories.tsx
    - src/app/(storefront)/account/_components/legacy-bridge.test.tsx
    - src/app/(storefront)/account/register/page.tsx
    - src/app/(storefront)/account/recover/page.tsx
    - src/app/(storefront)/account/reset/[id]/page.tsx
    - src/app/(storefront)/account/activate/[id]/page.tsx
    - src/app/(storefront)/account/[...legacy]/page.tsx
    - docs/testing/customer-accounts-setup.md
  modified:
    - .env.example
    - src/components/layout/header/header.tsx
    - src/components/layout/footer/data.ts
    - tests/e2e/cart-checkout.spec.ts
key-decisions:
  - "The header account icon always links to `/account`; account route protection owns signed-in versus sign-in behavior."
  - "Legacy account bridges explain Shopify-hosted Customer Account sign-in instead of recreating password/register/reset forms."
  - "Reorder remains deferred unless future work uses authoritative cart actions, current variant availability, and no price promises."
  - "B2B/customer-specific pricing remains Shopify-admin-dependent and checkout/cart-authoritative; the headless UI must not calculate it client-side."
requirements-completed:
  - MIG-01
  - MIG-02
  - MIG-03
  - SEC-04
duration: 22 min
completed: 2026-06-19
---

# Phase 14 Plan 05: Migration Parity, Account Entry Links, Readiness Docs, And Final Coverage Summary

**Account entry and legacy migration surfaces now route to the modern Shopify Customer Account flow, with launch readiness documented and fake-only coverage extended**

## Performance

- **Duration:** 22 min
- **Started:** 2026-06-19T12:17:52+08:00
- **Completed:** 2026-06-19T12:39:21+08:00
- **Tasks:** 4
- **Files modified:** 15

## Accomplishments

- Added one `/account` icon link to the existing header right-side icon cluster and replaced the stale `mrtea.com.au` footer Login link with the owned headless account route.
- Added safe legacy account routing helpers and tests for classic return/context parameters, rejecting external URLs, protocol-relative URLs, Liquid/template-looking values, unknown params, and unsupported destinations.
- Added bridge pages for `/account/register`, `/account/recover`, `/account/reset/[id]`, `/account/activate/[id]`, and catch-all `/account/[...legacy]`.
- Added the `LegacyBridge` route-local UI component with Storybook states for register, recover, verification failed, and unknown route copy.
- Created `docs/testing/customer-accounts-setup.md` with Shopify admin setup, Customer Account env, local HTTPS OAuth testing, protected data access, automated boundary, manual checkout approval gate, reorder parity, B2B/customer pricing parity, and launch checklist.
- Added integration and Playwright coverage for the bridge component, account link migration, legacy route fallback, no password inputs, and fake checkout URL boundary.

## Task Commits

1. **Header/footer owned account links** - `2695685` (`feat(14-05): add owned account entry links`)
2. **Legacy bridge routes and helper tests** - `2f41a2d` (`feat(14-05): bridge legacy account routes`)
3. **Launch readiness docs and env example** - `1a4bc86` (`docs(14-05): document customer account launch readiness`)
4. **Final migration smoke coverage** - `a422e13` (`test(14-05): cover account migration smoke paths`)

**Plan metadata:** pending in docs commit.

## Files Created/Modified

- `src/components/layout/header/header.tsx` and `src/components/layout/footer/data.ts` - Owned account entry links.
- `src/app/(storefront)/account/_lib/legacy-routing.ts` and `.test.ts` - Legacy return/context normalization and route copy.
- `src/app/(storefront)/account/_components/legacy-bridge.*` - Bridge UI, Storybook states, and jsdom integration coverage.
- `src/app/(storefront)/account/register/page.tsx`, `recover/page.tsx`, `reset/[id]/page.tsx`, `activate/[id]/page.tsx`, and `[...legacy]/page.tsx` - Classic account bridge pages.
- `docs/testing/customer-accounts-setup.md` and `.env.example` - Customer Account setup and readiness documentation.
- `tests/e2e/cart-checkout.spec.ts` - Fake-browser migration smoke coverage.

## Decisions Made

- Kept the account icon visible and always linked to `/account`; no state-aware label or duplicate mobile menu account row was added.
- Used explanatory bridge pages instead of redirects for classic account routes so bookmarked/email links have a clear recovery path.
- Kept Storybook args literal for `LegacyBridge` to avoid importing server-only Customer Account routing helpers into the browser story bundle.
- Documented reorder and B2B/customer pricing as deferred/admin-dependent rather than implementing client-side pricing or historic reorder replay.

## Deviations from Plan

None - plan behavior executed as written. A route-local jsdom integration test was added alongside Playwright smoke coverage to satisfy the account `*.test.tsx` integration boundary.

## Issues Encountered

- Storybook initially failed because `legacy-bridge.stories.tsx` imported the server-side legacy routing helper, which pulled `node:crypto` into the browser test. The story now passes literal props, matching the existing login-panel story pattern.
- The first final E2E run was blocked by a stale local `next dev` process. The reported PID was stopped and the fake-Shopify browser suite passed.

## Verification

- `pnpm lint` - passed.
- `pnpm typecheck` - passed.
- `pnpm test:unit -- "src/app/(storefront)/account/_lib/legacy-routing.test.ts"` - passed, 1 file / 4 tests.
- `pnpm test:integration -- "src/app/(storefront)/account/**/*.test.tsx"` - passed through the integration suite, 8 files / 33 tests.
- `pnpm test:stories` - passed, 101 files / 354 tests.
- `pnpm test:e2e` - passed, 4 fake-Shopify browser tests.
- Plan-level `pnpm test:unit` - passed, 48 files / 173 tests.
- Plan-level `pnpm test:integration` - passed, 8 files / 33 tests.
- `pnpm build` - passed with Next.js 16.2.4 and Cache Components enabled.
- Acceptance grep confirmed `/account` header/footer links, safe legacy return tests, no password inputs, required Storybook states, setup docs sections, and fake checkout URL assertions.

## User Setup Required

Store-owner approval remains required before any real Shopify hosted checkout, payment, shipping-rate, tax, order creation, or success redirect testing. Customer Account launch also requires Shopify admin setup for customer accounts, Headless/Hydrogen credentials, protected customer data access, callback/logout URLs, and HTTPS tunnel testing.

## Next Phase Readiness

All five Phase 14 implementation plans now have summaries and passing automated verification. Phase 14 is ready for goal-level verification and roadmap completion.

## Self-Check: PASSED

- All created files exist.
- All required task commits exist.
- All acceptance criteria were verified.
- Plan-level verification passed.

---

*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-19*
