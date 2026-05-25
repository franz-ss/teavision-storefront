# Searchanise Widget Bridge Design

**Date:** 2026-05-25
**Status:** Approved design, pending written spec review
**Scope:** Product detail page recommendation block

## Goal

Restore the Searchanise "Customers Who Bought This Product Also Bought" experience in the Next.js storefront while preserving the current native Shopify related-products carousel as a fallback.

The first implementation should be a lightweight widget bridge. It should let Searchanise keep ownership of its recommendation algorithm, widget analytics, merchandising settings, and generated product-card markup, while the Next.js app owns script loading, page placement, fallback behavior, and theme-level CSS polish.

## Current Context

The sibling `teavision-theme` project inserts the Searchanise recommendation widget with a generated mount element:

```liquid
<div class="searchanise-recommendations" id="1T8K1Y6Q6G8R3B3"></div>
```

That old theme also includes CSS for Searchanise-rendered `snize-*` classes. The current Next.js app does not load Searchanise. Its PDP recommendations are rendered by `RelatedProductsCarousel`, using Shopify Storefront API `productRecommendations` with the `RELATED` intent, plus a tag-based collection override for herbs.

## Proposed Architecture

Add a small product-domain component:

```text
src/components/product/searchanise-recommendations/
|-- searchanise-recommendations.tsx
|-- index.ts
`-- searchanise-recommendations.stories.tsx
```

The component should render a reserved widget region containing the Searchanise generated mount:

```tsx
<div className="searchanise-recommendations" id="1T8K1Y6Q6G8R3B3" />
```

Add a global Searchanise script loader in `src/app/(storefront)/layout.tsx` so it only affects customer-facing storefront pages. The loader should use `next/script` and read:

```text
NEXT_PUBLIC_SEARCHANISE_API_KEY
NEXT_PUBLIC_SEARCHANISE_ENABLED
```

When enabled, it should load:

```text
https://searchserverapi.com/widgets/shopify/init.js?a={NEXT_PUBLIC_SEARCHANISE_API_KEY}
```

The component should be a client component because it needs browser lifecycle checks for whether Searchanise renders content.

## PDP Behavior

On `/products/[handle]`, place the Searchanise widget where the current related-products section appears.

Behavior:

1. If Searchanise is disabled or the API key is missing, render the existing Shopify related-products carousel.
2. If Searchanise is enabled, render the Searchanise mount first.
3. If the widget does not populate within 2500 ms after the loader reports ready, show the existing Shopify related-products carousel.
4. If Searchanise renders content, keep the fallback hidden.

This keeps the existing customer experience intact if the third-party widget fails, is blocked, or cannot infer product context in the headless storefront.

## Styling

Port only the Searchanise recommendation styles needed for:

- `.snize-recommendation`
- `.snize-recommendation-title`
- `.snize-recommendation-results`
- product titles, prices, badges, and buttons inside recommendation cards

Styles should live in `src/app/globals.css` because Searchanise injects third-party class names outside React component ownership. Use existing Tailwind theme tokens and CSS variables where possible. Do not introduce raw cool-gray colors or a separate CSS module.

## Risks

The main unknown is product context. Searchanise's Shopify widgets were designed for Shopify theme pages. In a headless Next.js app, the widget may or may not infer the viewed product correctly from `/products/[handle]`.

Mitigation:

- Use the generated widget ID from the current theme first.
- Test on a real PDP with the Searchanise API key.
- If the widget does not render relevant recommendations, request Searchanise's headless or SPA product-context instructions, or copy the current generated manual widget snippet from the Searchanise admin.
- Keep the Shopify fallback in place until the Searchanise widget is verified on production-like pages.

## Validation

Implementation should be verified by:

- `pnpm lint`
- `pnpm build`
- Local PDP browser check with Searchanise disabled: native carousel appears.
- Local or preview PDP browser check with Searchanise enabled: Searchanise mount renders or fallback appears after timeout.
- Visual check on desktop and mobile for spacing, title styling, product cards, and no layout jump.

## References

- Searchanise recommendation widget docs: https://docs.searchanise.io/support/solutions/articles/11000047601-how-to-set-up-product-recommendations
- Manual recommendation widget install: https://docs.searchanise.io/add-recommendation-widgets-manually/
- Searchanise Shopify loader script note: https://searchanise.freshdesk.com/support/solutions/articles/36000431138-widgets-don-t-appear-when-shopify-pages-load
- Existing theme mount: `D:\Work\teavision\teavision-theme\layout\theme.liquid`
- Existing Next PDP: `src/app/(storefront)/products/[handle]/page.tsx`
