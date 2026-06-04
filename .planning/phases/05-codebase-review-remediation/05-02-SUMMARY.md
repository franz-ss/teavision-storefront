---
phase: 05-codebase-review-remediation
plan: 02
status: complete
completed_at: '2026-06-02T15:39:36.465Z'
requirements:
  - AUDIT-04
  - AUDIT-05
  - AUDIT-10
---

# Plan 05-02 Summary: Testing, Reliability, and Security Hardening

## Result

Completed. The storefront now has first-class runnable quality gates, broader interaction stories for risky cart/product/form paths, production-capable rate-limit boundaries, and safer failure handling for webhooks, quick-view, codegen, Trustoo ratings, and legacy HulkApps enrichment.

## What Changed

- Added `typecheck`, `test:contracts`, and `test:stories` scripts to `package.json`.
- Updated `.husky/pre-commit` to run lint plus contract tests, and `.husky/pre-push` to run lint, typecheck, contract tests, and build.
- Repaired the stale homepage button contract in `scripts/component-contracts/button-system.test.mjs`.
- Added/expanded Storybook interaction coverage for PDP add-to-cart, product-card add-to-cart, cart line actions, homepage contact, and homepage newsletter states.
- Added test seams to product/cart client leaves so stories can mock server actions without mutating Shopify state.
- Added `src/lib/rate-limit/index.ts` with a server-only limiter boundary, durable-store interface, client IP helper, and explicit production fallback warnings.
- Integrated rate limiting into contact/newsletter actions and search suggestions.
- Added Shopify page webhook topic handling for `page` and `pages` cache tags.
- Wrapped quick-view product fetches in stable JSON 404/503 behavior.
- Validated Shopify codegen env vars before schema URL/header construction.
- Shortened degraded Trustoo/HulkApps enrichment cache behavior and added non-secret telemetry.
- Added contract coverage for rate-limit wiring and production boundary hardening.
- Documented production rate-limit expectations in `docs/conventions.md`.

## Verification

- `pnpm typecheck` passed.
- `pnpm test:contracts` passed.
- `pnpm lint` passed.
- `pnpm build` passed.
- `pnpm test:stories` passed.
- Quick-view API check: `GET /api/products/not-a-real-product/quick-view` returned `404` with JSON body `{ "message": "Product not found" }`.
- Search suggestions limiter check: 62 repeated requests with the same forwarded IP returned 60 `200` responses followed by 2 `429` responses with JSON body `{ "message": "Too many search requests. Please wait a moment.", "products": [] }`.

## Notes

- The new Storybook `play` functions make the flows executable/testable in Storybook and compile under `storybook build`; the project still does not have a separate browser interaction test runner configured.
- Rate limiting is production-capable through the helper interface and deployment documentation, but the in-memory fallback remains best-effort and should be paired with provider-level or KV-backed protection in production.

## Files Touched

- `.husky/pre-commit`
- `.husky/pre-push`
- `package.json`
- `codegen.ts`
- `docs/conventions.md`
- `scripts/component-contracts/button-system.test.mjs`
- `scripts/component-contracts/production-boundaries.test.mjs`
- `scripts/component-contracts/rate-limit.test.mjs`
- `src/app/(storefront)/cart/_components/cart-line-actions.tsx`
- `src/app/(storefront)/cart/_components/cart-line-actions.stories.tsx`
- `src/app/api/products/[handle]/quick-view/route.ts`
- `src/app/api/search/suggestions/route.ts`
- `src/app/api/webhooks/shopify/route.ts`
- `src/components/collection/product-card/product-purchase-form.tsx`
- `src/components/collection/product-card/product-purchase-form.stories.tsx`
- `src/components/homepage/contact-form/contact-form.stories.tsx`
- `src/components/homepage/contact-form/contact-form.tsx`
- `src/components/homepage/newsletter/newsletter.stories.tsx`
- `src/components/product/product-form/product-form.stories.tsx`
- `src/components/product/product-form/product-form.tsx`
- `src/lib/contact/actions.ts`
- `src/lib/rate-limit/index.ts`
- `src/lib/reviews/trustoo.ts`
- `src/lib/shopify/operations/product.ts`
