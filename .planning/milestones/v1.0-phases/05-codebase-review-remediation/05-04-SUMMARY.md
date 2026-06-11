---
phase: 05-codebase-review-remediation
plan: 04
status: complete
completed_at: '2026-06-02T16:23:40.220Z'
requirements:
  - AUDIT-07
  - AUDIT-08
  - AUDIT-10
---

# Plan 05-04 Summary: Component Architecture and TypeScript Maintainability Refactors

## Result

Completed. Route files are more orchestration-focused, Shopify-aware components now live in product/route domains instead of `ui`, add-to-cart behavior has one shared client controller, repeated Shopify reshapers have one source of truth, and Portable Text CMS blocks now narrow runtime shapes before rendering.

## What Changed

- Split product route-owned recommendation and analytics work into `src/app/(storefront)/products/[handle]/_components/*` and `_lib/*`.
- Split collections index image rendering into `src/app/(storefront)/collections/_components/collection-card-image.tsx`.
- Split the wholesale route into route-owned hero, stats, supply-path, inclusion, and content modules under `src/app/(storefront)/pages/wholesale/_components` and `_lib`.
- Moved the Shopify-aware recommendation card from `src/components/ui/product-card` to `src/components/product/recommendation-product-card`, then removed the old `ui` export.
- Added Storybook coverage for `RecommendationProductCard`, `Header`, and collection `SortSelect`.
- Added `src/components/product/use-add-to-cart.ts` and reused it across PDP product form, listing purchase form, and quick-view add-to-cart.
- Refactored contact and homepage contact forms to use existing `FormLabel`, `TextInput`, and `Textarea` primitives.
- Added `src/lib/shopify/operations/mappers.ts` for shared money, image, and product-rating reshaping across cart, collection, and product operations.
- Replaced weak Portable Text image, callout, table, and cell assertions with focused runtime guards.
- Updated `scripts/create-component.mjs` so newly scaffolded components use `cn()` with `className`.
- Updated the reduced-motion contract test to follow the moved card/image ownership paths.

## Verification

- `pnpm typecheck` passed.
- `pnpm lint` passed.
- `pnpm build` passed.
- `pnpm build-storybook` passed.
- `pnpm test:contracts` passed.
- `pnpm test:stories` passed.
- Source self-checks passed:
  - `src/components/ui/product-card/product-card.tsx` no longer exists.
  - `src/components/product/recommendation-product-card/recommendation-product-card.tsx` exists.
  - `src/lib/shopify/operations/mappers.ts` exists and is the only source defining `reshapeMoney`, `reshapeImage`, and `parseProductRating`.
  - `src/components/product/use-add-to-cart.ts` exists.
  - Targeted Portable Text broad casts are no longer present.
- Production route checks via `next start` on a temporary port passed:
  - `/collections` returned `200` and rendered `Wholesale range`, `Browse all products`, and `Popular paths`.
  - `/collections/all` returned `200` and rendered `Quick View` and `Next products`.
  - `/products/aniseed-whole` returned `200` and rendered `Add to Cart`, `Related products`, and `Reviews`.
  - `/pages/wholesale` returned `200` and rendered `Wholesale accounts`, `Apply for wholesale`, `Supply pathways`, and `Direct contact`.
  - `/pages/contact` returned `200` and rendered `Name`, `Email`, and `Message`.
  - `/` returned `200` and rendered homepage contact/newsletter markers.
  - `/api/products/aniseed-whole/quick-view` returned `200` with keys `description,handle,id,images,options,priceRange,title,variants`.

## Notes

- The in-app browser tool was not available after tool discovery in this session, so route verification used production-server HTTP/HTML checks instead of visual screenshots.
- The Searchanise "Customers Who Bought This Product Also Bought" PDP block remains environment-gated by `NEXT_PUBLIC_SEARCHANISE_ENABLED` and `NEXT_PUBLIC_SEARCHANISE_API_KEY`; absence of that title during local HTTP checks was expected.
- `ProductContent` remains local to the PDP route because it is the route's primary server data/render boundary. The extracted route-owned components are the non-trivial recommendation and analytics helpers identified by the review.

## Files Touched

- `scripts/component-contracts/button-system.test.mjs`
- `scripts/create-component.mjs`
- `src/app/(storefront)/collections/page.tsx`
- `src/app/(storefront)/collections/_components/collection-card-image.tsx`
- `src/app/(storefront)/pages/wholesale/page.tsx`
- `src/app/(storefront)/pages/wholesale/_components/supply-paths.tsx`
- `src/app/(storefront)/pages/wholesale/_components/wholesale-hero.tsx`
- `src/app/(storefront)/pages/wholesale/_components/wholesale-inclusions.tsx`
- `src/app/(storefront)/pages/wholesale/_components/wholesale-stats.tsx`
- `src/app/(storefront)/pages/wholesale/_lib/wholesale-content.ts`
- `src/app/(storefront)/products/[handle]/page.tsx`
- `src/app/(storefront)/products/[handle]/_components/customers-also-bought.tsx`
- `src/app/(storefront)/products/[handle]/_components/related-products.tsx`
- `src/app/(storefront)/products/[handle]/_lib/shopify-analytics.ts`
- `src/components/blog/portable-text/portable-text.tsx`
- `src/components/collection/product-card/product-purchase-form.tsx`
- `src/components/collection/sort-select/sort-select.stories.tsx`
- `src/components/contact/contact-form/contact-form.tsx`
- `src/components/homepage/contact-form/contact-form.tsx`
- `src/components/layout/header/header.stories.tsx`
- `src/components/product/index.ts`
- `src/components/product/product-form/product-form.tsx`
- `src/components/product/product-quick-view/product-quick-view.tsx`
- `src/components/product/recommendation-product-card/index.ts`
- `src/components/product/recommendation-product-card/recommendation-product-card.stories.tsx`
- `src/components/product/recommendation-product-card/recommendation-product-card.tsx`
- `src/components/product/related-products-carousel/related-products-carousel.tsx`
- `src/components/product/use-add-to-cart.ts`
- `src/components/ui/index.ts`
- `src/components/ui/product-card/index.ts`
- `src/components/ui/product-card/product-card.stories.tsx`
- `src/components/ui/product-card/product-card.tsx`
- `src/lib/shopify/operations/cart.ts`
- `src/lib/shopify/operations/collection.ts`
- `src/lib/shopify/operations/mappers.ts`
- `src/lib/shopify/operations/product.ts`
