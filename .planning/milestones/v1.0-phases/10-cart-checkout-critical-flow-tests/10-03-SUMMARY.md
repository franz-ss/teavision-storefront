---
phase: 10-cart-checkout-critical-flow-tests
plan: 03
status: completed
completed_at: 2026-06-04
---

# Plan 03 Summary: Storybook Cart And Add-To-Cart Coverage

## Result

Completed. Cart rendering is now fixture-driven through a presentational `CartView`, and Storybook coverage was expanded across cart view states, cart line actions, PDP add-to-cart, collection card add-to-cart, and quick-view recovery states.

## Implemented

- Extracted `src/app/(storefront)/cart/_components/cart-view.tsx` from the cart route while leaving data fetching in `page.tsx`.
- Added `cart-view.stories.tsx` for empty, single-item, multi-item, discounted, missing-image, long-title, and checkout handoff states.
- Extended `cart-line-actions.stories.tsx` with increase, decrease, remove, and pending payload/state stories.
- Extended `product-form.stories.tsx` with selected quantity, selected variant, bulk tier, and feedback reset coverage.
- Extended `product-purchase-form.stories.tsx` with selected variant payload and no-quantity-stepper coverage.
- Extended `product-quick-view.stories.tsx` with invalid response, retry success, and add failure recovery coverage.

## Verification

- `pnpm test:stories` passed with a successful Storybook production build.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm build` passed.

## Residual Notes

- Storybook stories are behavior-oriented and fixture-backed; they do not call Shopify.
- `CartView` remains route-local under `src/app/(storefront)/cart/_components` because it is not a shared component library primitive.
