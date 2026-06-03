---
phase: 08-optimized-collection-quick-add
plan: 01
status: complete
completed_at: "2026-06-03T17:09:15+08:00"
requirements:
  - CQA-01
  - CQA-02
  - CQA-03
  - CQA-04
  - CQA-05
  - CQA-06
commits:
  - 78fd865 feat(08-01): add listing quick-add data contract
  - aa38d15 feat(08-01): add collection quick-add button
  - 986a5bc feat(08-01): restore optimized collection card quick-add
---

# 08-01 Summary: Optimized Listing Quick Add

## What Changed

Collection and search listing products now carry a minimal `quickAdd` contract. `CollectionProductSummary.quickAdd` is populated only when the listing source can prove a product has exactly one available variant; otherwise it is `null`.

Implemented eligibility rule:

- Shopify collection listings query `variants(first: 2)` with only `id`, `title`, and `availableForSale`.
- If that bounded probe returns exactly one variant and it is available, `quickAdd` contains that variant id/title.
- If the probe returns zero, two, or an unavailable variant, `quickAdd` is `null`.
- Searchanise summaries follow the same rule after defensive `unknown` narrowing, using fallback `add_to_cart_id` only when it can form a single available variant.

`QuickAddButton` is the only new client leaf. It reuses `useAddToCart`, calls the existing cart Server Action path through that hook, and renders accessible pending, success, and error feedback. `ProductCard` remains a Server Component and renders:

- `Add to cart` for available products with `quickAdd`.
- an `Add to cart` trigger for available products without `quickAdd`; this opens Quick View for explicit variant selection instead of adding a guessed variant.
- no purchase action for sold-out products.
- `More info` for all products.

The old full `ProductPurchaseForm` was not restored to listing cards.

## Verification

Passed:

- `pnpm codegen`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm build-storybook`
- `pnpm test:contracts` through commit hooks

Targeted source checks passed:

- `collection.graphql` contains `variants(first: 2)`.
- `collection.graphql` no longer fetches listing `options`.
- `ProductCard` has no `ProductPurchaseForm` import/render.
- `ProductCard` has no `'use client'` directive.
- `QuickAddButton` uses `useAddToCart` and renders `role="status"` / `role="alert"` feedback.

Automated Chrome checks against the built Storybook bundle passed:

- `Collection/ProductCard Default`: `Add to cart` shown, `Quick View` absent, screenshot non-empty.
- `Collection/ProductCard Multi Variant`: `Quick View` shown, `Add to cart` absent, screenshot non-empty.
- `Collection/ProductCard Sold Out`: purchase actions absent, `More info` remains, screenshot non-empty.
- `Collection/QuickAddButton Success`: mocked add shows `Added to cart`.
- `Collection/QuickAddButton Add To Cart Error`: mocked failure shows retryable error.
- `Collection/QuickAddButton Pending`: button disables during pending mock action.
- `Collection/QuickAddButton Sold Out`: disabled sold-out state renders.

Live app smoke checks on the existing `localhost:3000` dev server passed:

- `/collections/all` rendered 4 enabled `Add to cart` buttons, 15 `Quick View` buttons, and 24 `More info` links.
- `/search?q=tea` rendered 9 enabled `Add to cart` buttons, 15 `Quick View` buttons, and 24 `More info` links.
- On `/collections/all`, Chrome clicked `Add 2003Y Mini Ripe Pu-erh Tea Brick (250g/box) to cart` and the page rendered `Added to cart`.

## Residual Risk

The restored affordance still creates one tiny client island per eligible card. That is intentionally much lighter than restoring `ProductPurchaseForm`, but a future optimization could consolidate list-level cart feedback if eligible-card counts grow substantially.

The shared `ProductQuickView` remains per-card for multi-variant products. A shared list-level Quick View controller is a reasonable follow-up if PLP hydration budgets tighten further.
