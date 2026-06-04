---
phase: 10-cart-checkout-critical-flow-tests
plan: 01
status: completed
completed_at: 2026-06-04
---

# Plan 01 Summary: Test Infrastructure And Fake Shopify Boundary

## Result

Completed. The repo now has an approved Phase 10 test runner exception, Vitest and Playwright dependencies, unit/integration/E2E scripts, shared Vitest setup, Playwright configuration, typed Shopify fixtures, a stateful fake Shopify GraphQL server, and a guarded test-only Storefront endpoint override.

## Implemented

- Updated `AGENTS.md` to allow Vitest and Playwright for revenue-critical cart/checkout coverage while keeping Storybook as the component documentation surface.
- Added `test:unit`, `test:integration`, and `test:e2e` scripts without removing `test:contracts` or `test:stories`.
- Added Vitest, React Testing Library, jsdom, Playwright, Vite React, and TypeScript path alias support.
- Added `SHOPIFY_STOREFRONT_TEST_URL` guarded by `SHOPIFY_STOREFRONT_TEST_MODE=true` or `NODE_ENV=test`.
- Preserved production credential fail-fast behavior when no guarded test endpoint is active.
- Added reusable money, product, and cart fixture factories.
- Added a fake Shopify Storefront GraphQL server for product/cart operations and a Playwright third-party network blocker.
- Added a smoke test proving fake cart create/read works without live Shopify.

## Verification

- `pnpm test:unit` passed, including `tests/setup/smoke.test.ts`.
- `pnpm typecheck` passed.
- `pnpm test:contracts` passed.
- `pnpm build` passed.
- Local versions confirmed: Vitest `4.1.8`, Playwright `1.60.0`.

## Deviations

- The plan mentioned `SHOPIFY_STOREFRONT_GRAPHQL_URL`; implementation uses `SHOPIFY_STOREFRONT_TEST_URL` to make the test-only purpose explicit.
- `pnpm exec vitest --version` and `pnpm exec playwright --version` were flaky in this Windows shell, so local `.cmd` shims were used for version confirmation.
