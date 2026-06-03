---
phase: 05-codebase-review-remediation
plan: 03
status: complete
completed_at: "2026-06-02T15:56:19.247Z"
requirements:
  - AUDIT-06
  - AUDIT-10
---

# Plan 05-03 Summary: PLP and Storefront Performance Remediation

## Result

Completed. Collection listing work is now bounded at the data layer, category pages push tag filtering into Shopify product filters, listing product summaries are smaller, product cards no longer hydrate per-card purchase forms, quick-view returns a smaller DTO, and Shopify image URL sizing is centralized.

## What Changed

- Added `COLLECTION_PRODUCT_PAGE_SIZE` with a 24-product default for collection product pages.
- Changed `getCollectionProductsWithFilters()` from an all-pages loop to a single bounded Shopify request with `pageInfo`.
- Added cursor support to collection route search params and a `Next products` link for continued browsing.
- Changed category PLPs to derive category tags from Shopify filter metadata, then refetch bounded products with a Shopify `{ tag }` product filter.
- Removed `options` and `variants` from `CollectionProductSummary`, the collection GraphQL query, Searchanise product mapping output, and listing story data.
- Removed the per-card `ProductPurchaseForm` from collection/search listing cards and replaced it with price, detail, and quick-view actions.
- Changed quick-view API responses to `ProductQuickViewDetails`, omitting full product-only fields such as `descriptionHtml`, `tags`, and `bulkPricingTiers`.
- Added a client-side quick-view response guard before trusting fetched modal data.
- Added `src/lib/shopify/image-url.ts` and replaced runtime Shopify `&width=` URL builders in cart, collections, collection hero, product cards, product quick-view image, and product gallery.
- Replaced deprecated Next Image `priority` usage with `preload` for true hero/gallery LCP images and removed logo preloading.

## Verification

- `pnpm codegen` passed after the collection GraphQL query change.
- `pnpm typecheck` passed.
- `pnpm test:contracts` passed.
- `pnpm lint` passed.
- `pnpm build` passed.
- `pnpm test:stories` passed.
- Production route checks via `next start`:
  - `/collections/all` returned `200`, rendered `Quick View`, and included `Next products`.
  - `/collections/all/categories_all-herbs` returned `200`, rendered category products, and did not show the empty state.
  - A rendered cursor URL from `/collections/all` returned `200`.
  - `/search?q=tea` returned `200` and rendered `Quick View`.
  - `/products/aniseed-whole` returned `200`.
  - `/api/products/aniseed-whole/quick-view` returned `200` with keys `description,handle,id,images,options,priceRange,title,variants`; it did not include `descriptionHtml`, `tags`, or `bulkPricingTiers`.

## Notes

- The in-app browser tool was not available after tool discovery in this session, so 05-03 route verification used production-server HTTP checks rather than visual browser screenshots.
- Header mega-nav code splitting was not expanded in this plan because the largest measurable win was removing per-card purchase form hydration and variant payloads from PLP/search listings. The header remains a candidate for a future focused split if bundle analysis shows it dominates.
- Cursor pagination is forward-only. It avoids unbounded initial fetches while preserving existing sort/filter/category URL semantics.

## Files Touched

- `src/app/(storefront)/cart/page.tsx`
- `src/app/(storefront)/collections/page.tsx`
- `src/app/(storefront)/collections/[handle]/_components/hero.tsx`
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`
- `src/app/(storefront)/collections/[handle]/_components/product-list.tsx`
- `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts`
- `src/app/(storefront)/collections/[handle]/_lib/page-types.ts`
- `src/app/(storefront)/pages/custom-tea-blends/_components/blend-image.tsx`
- `src/app/api/products/[handle]/quick-view/route.ts`
- `src/components/collection/product-card/product-card.stories.tsx`
- `src/components/collection/product-card/product-card.tsx`
- `src/components/layout/header/header.tsx`
- `src/components/product/product-gallery/product-gallery.tsx`
- `src/components/product/product-quick-view/product-quick-view-image.tsx`
- `src/components/product/product-quick-view/product-quick-view.tsx`
- `src/components/search/search-results-view/search-results-view.stories.tsx`
- `src/components/ui/product-card/product-card.tsx`
- `src/lib/searchanise/search.ts`
- `src/lib/shopify/image-url.ts`
- `src/lib/shopify/operations/collection.ts`
- `src/lib/shopify/queries/collection.graphql`
- `src/lib/shopify/types/generated/gql.ts`
- `src/lib/shopify/types/generated/graphql.ts`
- `src/lib/shopify/types/index.ts`
