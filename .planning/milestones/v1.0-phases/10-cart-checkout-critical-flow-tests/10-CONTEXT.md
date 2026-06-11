# Phase 10: Cart and Checkout Critical Flow Tests - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning
**Source:** User request plus local architecture analysis and five review passes
**Roadmap status:** Standalone Phase 5 testing follow-up. This artifact is not yet promoted into `.planning/ROADMAP.md` because the worktree already has active Phase 9 planning/source edits.
**Current checkout constraint:** Do not execute real Shopify hosted checkout UAT, payment tests, order creation tests, or external checkout smoke tests until the Shopify dev store is set up and the store owner explicitly confirms checkout testing may begin.

<domain>
## Phase Boundary

Create a comprehensive, maintainable test strategy before writing tests for the revenue-critical cart and checkout flows in the Teavision headless Shopify storefront.

This phase plans coverage for:

- Cart creation, add, update, remove, persistence, stale-session recovery, pricing, discounts, inventory errors, and UI feedback.
- Checkout handoff through Shopify `cart.checkoutUrl`.
- Hosted checkout validation through UAT/smoke coverage, because customer, shipping, billing, payment, order creation, and payment processing are owned by Shopify hosted checkout, not this Next app.
- Test infrastructure needed to support unit, integration, Storybook interaction, and E2E tests without hitting live Shopify in CI.

</domain>

<decisions>
## Implementation Decisions

### Scope

- D-01: Treat Shopify as the source of truth for cart, checkout, discounts, tax, shipping, orders, and payments.
- D-02: Do not build tests for internal checkout screens that do not exist in this codebase.
- D-03: Test the local checkout responsibility as a correct, fresh, external handoff to `cart.checkoutUrl`.
- D-04: Validate Shopify-hosted customer information, shipping address, billing address, shipping method, payment method, order creation, payment processing, success redirects, tax, and shipping through staged Shopify checkout UAT or optional external checkout smoke tests, not local unit tests.

### Test Strategy

- D-05: Put most edge cases in unit and integration tests around `src/lib/cart/actions.ts`, `src/lib/shopify/operations/cart.ts`, and `src/lib/shopify/client.ts`.
- D-06: Use Storybook interaction tests for client leaves that already accept injected actions or `addToCart` functions.
- D-07: Use Playwright only for a thin set of high-value browser flows: PDP add to cart, header badge refresh, cart update/remove, empty cart, and checkout handoff.
- D-08: Do not hit real Shopify, payment providers, analytics, Searchanise, Trustoo, or Resend in CI. Use deterministic fakes and typed fixtures.
- D-09: Keep tests behavior-driven: assert visible outcomes, roles, accessible names, returned action states, Shopify operation variables, cookie effects, and final URLs rather than implementation details.

### Maintainability

- D-10: Preserve the existing Storybook-first component testing style and add Vitest/RTL only for behavior that Storybook cannot validate well.
- D-11: Keep async Server Component page coverage in E2E or an extracted presentational view, aligning with the local Next 16 testing docs.
- D-12: Add seams only when they reduce real test friction: pure helper exports, fixture factories, a fake Shopify GraphQL endpoint override, and a cart view extraction are acceptable.

### Planning Traceability

- D-13: Treat this as a follow-up to Phase 5 `AUDIT-04` and `AUDIT-10`, not as the active roadmap Phase 10, until the roadmap owner promotes it.
- D-14: Because the user explicitly requested a unit/integration/E2E hierarchy, the implementation plan must reconcile the current `AGENTS.md` "No test runner outside Storybook" rule by documenting an approved exception or updating the testing policy before adding Vitest or Playwright.
- D-15: The fake Shopify endpoint override must be a first-class implementation task, because Playwright browser request interception cannot intercept server-side Shopify calls.
- D-16: Hosted Shopify checkout UAT is gated. Until the dev store exists, Phase 10 may document the checklist and may test only local/fake checkout handoff behavior; it must not run real Shopify checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests.

</decisions>

<canonical_refs>

## Canonical References

### Project Rules

- `AGENTS.md` - Next 16, App Router, cart architecture, Storybook, and codebase constraints.
- `docs/conventions.md` - file placement, component boundaries, named exports, and styling constraints.
- `.planning/codebase/TESTING.md` - current test posture and manual cart verification gap.
- `.planning/codebase/ARCHITECTURE.md` - cart flow and data layer map.
- `.planning/codebase/INTEGRATIONS.md` - Shopify cart and hosted checkout boundaries.
- `.planning/codebase/CONCERNS.md` - known cart/checkout test gaps.
- `docs/teavision-project-reference.md` - high-stakes commerce risk notes and hosted checkout decision.

### Cart and Checkout Source

- `src/lib/cart/actions.ts` - cart cookie lifecycle, server actions, quantity normalization, error mapping, revalidation.
- `src/lib/shopify/operations/cart.ts` - Shopify cart mutations, `no-store` reads, user error handling, cart reshaping.
- `src/lib/shopify/client.ts` - Storefront GraphQL transport, env validation, HTTP/GraphQL errors.
- `src/lib/shopify/queries/cart.graphql` - cart fields, discount allocations, 100-line cap, checkout URL.
- `src/app/(storefront)/cart/page.tsx` - cart render, discount display, subtotal, shipping/tax copy, checkout link.
- `src/app/(storefront)/cart/_components/cart-line-actions.tsx` - update/remove client leaf.
- `src/components/product/use-add-to-cart.ts` - add-to-cart pending/success/error state and route refresh.
- `src/components/product/product-form/product-form.tsx` - PDP add-to-cart, quantity bounds, bulk tier selection.
- `src/components/collection/product-card/product-purchase-form.tsx` - collection/listing add-to-cart leaf.
- `src/components/product/product-quick-view/product-quick-view.tsx` - quick-view data load, retry, variant selection, add-to-cart.
- `src/components/ui/quantity-stepper/quantity-stepper.tsx` - quantity clamp and control behavior.
- `src/components/ui/price/price.tsx` - money display.

### Next 16 Testing Docs

- `node_modules/next/dist/docs/01-app/02-guides/testing/index.md` - test hierarchy and async Server Component caution.
- `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md` - Vitest setup and unit/component guidance.
- `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md` - Playwright setup and production-build E2E guidance.
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md` - cart reads must stay outside cached scopes.
  </canonical_refs>

<specifics>
## Specific Ideas

- Extract a route-only `CartView` from `src/app/(storefront)/cart/page.tsx` so cart rendering can be covered with typed cart fixtures without mocking `getCartAction()`.
- Add a small test-only Shopify GraphQL URL override so server-side Playwright flows can point at a local fake Storefront API. Browser route interception alone cannot catch server-side Shopify calls.
- Add fixture builders: `makeMoney`, `makeVariant`, `makeCartLine`, `makeCart`, `makeShopifyCartPayload`.
- Add a stateful fake Shopify cart server keyed by GraphQL operation names: `GetProduct`, `CartCreate`, `CartLinesAdd`, `GetCart`, `CartLinesUpdate`, `CartLinesRemove`.
- Lock cart architecture with contract tests: cart operations use `cache: 'no-store'`, cart cookie stays httpOnly/sameSite/path-scoped, and no localStorage/client cart store appears.
- Keep real Shopify checkout coverage as explicit staged UAT, especially address validation, shipping methods, tax, payment method, order creation, and success redirects. Do not execute that UAT until the dev store setup is complete.
  </specifics>

<deferred>
## Deferred Ideas

- Cart discount-code entry is not present in the current app. Confirm whether discount codes are intentionally checkout-only before planning code or tests for cart-level discount-code mutations.
- Cart line pagination beyond 100 lines is a business/product decision. The current plan documents and tests the cap; implementation of pagination or warning UI should be a separate feature if required.
- Production monitoring and error tracking for cart failures remain outside this test-strategy phase.
  </deferred>

---

_Phase: 10-cart-checkout-critical-flow-tests_
_Context gathered: 2026-06-04_
