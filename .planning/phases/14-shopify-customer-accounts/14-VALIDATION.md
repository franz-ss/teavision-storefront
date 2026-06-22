---
phase: 14
slug: shopify-customer-accounts
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-19
---

# Phase 14 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest, Storybook Vitest, Playwright, Next.js build |
| **Config file** | `vitest.config.mts`, `vitest.storybook.config.mts`, `playwright.config.ts` |
| **Quick run command** | `pnpm test:unit -- <target>` or `pnpm test:integration -- <target>` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:integration && pnpm test:stories && pnpm test:e2e && pnpm build` |
| **Estimated runtime** | ~600 seconds full suite; targeted commands under ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run the targeted automated command listed for that task.
- **After every plan wave:** Run `pnpm lint && pnpm typecheck` plus the full test category touched by the wave.
- **Before `$gsd-verify-work`:** Full suite must be green unless live Shopify/account tests remain explicitly blocked.
- **Max feedback latency:** 90 seconds for targeted unit/integration checks; 600 seconds for final full suite.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | AUTH-01, SEC-01 | T-14-01 / T-14-04 | OAuth start generates state, nonce, PKCE, and safe return paths | unit | `pnpm test:unit -- src/lib/shopify/customer-account/*.test.ts` | W0 pending | pending |
| 14-01-02 | 01 | 1 | AUTH-02, AUTH-05, SEC-03 | T-14-02 / T-14-03 | Callback validates pending auth and stores sealed HttpOnly session only | integration | `pnpm test:integration -- "src/app/(storefront)/account/**/route.test.ts"` | W0 pending | pending |
| 14-01-03 | 01 | 1 | AUTH-03, SEC-01 | T-14-02 / T-14-03 | Logout clears local cookies and uses Shopify end-session endpoint | integration | `pnpm test:integration -- "src/app/(storefront)/account/**/route.test.ts"` | W0 pending | pending |
| 14-02-01 | 02 | 2 | ACCT-01, ORD-01, ORD-02, ORD-03 | T-14-07 | Customer/account reads are no-store and session scoped | unit | `pnpm test:unit -- src/lib/shopify/customer-account/operations.test.ts` | W0 pending | pending |
| 14-02-02 | 02 | 2 | AUTH-04, ACCT-03, ORD-04 | T-14-03 / T-14-07 | Protected pages redirect unauthenticated users and render scoped failures without logout | integration/story | `pnpm test:integration -- "src/app/(storefront)/account/**/*.test.tsx" && pnpm test:stories` | W0 pending | pending |
| 14-03-01 | 03 | 2 | ACCT-02, ADDR-02, ADDR-03, ADDR-04, ADDR-05 | T-14-05 | Server Actions verify session and normalize Shopify user errors | integration | `pnpm test:integration -- src/lib/shopify/customer-account/actions.test.ts` | W0 pending | pending |
| 14-03-02 | 03 | 2 | ADDR-01, ADDR-04 | T-14-05 | Default address ordering and delete confirmation are visible and testable | story | `pnpm test:stories` | W0 pending | pending |
| 14-04-01 | 04 | 3 | CART-01, CART-02 | T-14-06 / T-14-08 | Cart identity sync uses fake Shopify locally and never live checkout | unit/integration | `pnpm test:unit -- src/lib/shopify/operations/cart.test.ts && pnpm test:integration -- src/lib/cart/actions.test.ts` | existing plus W0 extension | pending |
| 14-04-02 | 04 | 3 | CART-01, CART-02 | T-14-06 / T-14-08 | Failed pre-checkout identity sync blocks checkout with retry/sign-in/support recovery | e2e/story | `pnpm test:e2e && pnpm test:stories` | existing plus W0 extension | pending |
| 14-05-01 | 05 | 4 | MIG-01, MIG-02, MIG-03 | T-14-04 / T-14-08 | Legacy account routes preserve safe context and never open-redirect | unit/integration | `pnpm test:integration -- "src/app/(storefront)/account/**/*.test.ts"` | W0 pending | pending |
| 14-05-02 | 05 | 4 | SEC-04 | T-14-08 | Setup docs and UAT checklist keep real hosted checkout blocked until approval | docs/build | `pnpm lint && pnpm build` | W0 pending | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

- [ ] `tests/mocks/customer-account-api-server.ts` or equivalent fake Customer Account API/OIDC fixture for OAuth discovery, token exchange, refresh, logout, customer query, order query, and customer/address mutations.
- [ ] `tests/mocks/shopify-graphql-server.ts` handles `CartBuyerIdentityUpdate` and identity-aware `CartCreate`.
- [ ] `tests/fixtures/shopify/customer-account.ts` or equivalent typed customer/address/order fixtures.
- [ ] `src/lib/shopify/customer-account/*.test.ts` stubs exist before helper implementation.
- [ ] No new test framework install required; existing Vitest, Storybook Vitest, and Playwright infrastructure is sufficient.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real Shopify Customer Account OAuth with HTTPS tunnel | AUTH-01, AUTH-02, AUTH-05, SEC-01 | Shopify does not support localhost callback URLs and requires configured Customer Account API credentials/protected data | After owner/admin setup, run dev server through an HTTPS tunnel, configure callback/logout URLs, sign in with a test customer, verify callback/session/logout without live checkout |
| Protected customer data scopes | SEC-04 | Shopify admin approval and protected customer data configuration cannot be proven locally | Confirm Customer Account API access includes needed customer, address, and order fields before production launch |
| Real hosted checkout, payment, shipping-rate, tax, order creation, success redirect | CART-02 | Project rule blocks live hosted checkout testing until store-owner approval | Use `docs/testing/customer-accounts-setup.md` or the phase readiness doc after explicit approval; do not execute during local automated tests |
| B2B/company-location pricing behavior | MIG-03 | Depends on Shopify B2B/admin setup and authoritative cart/checkout data | If Shopify exposes company/contact/location data, verify account display is informational and cart/checkout pricing remains Shopify-authoritative |

---

## Validation Sign-Off

- [x] All planned task areas have automated verify commands or Wave 0 dependencies.
- [x] Sampling continuity: no 3 consecutive task areas without automated verify.
- [x] Wave 0 lists all missing fake API and fixture references.
- [x] No watch-mode flags.
- [x] Targeted feedback latency under 90 seconds.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending

