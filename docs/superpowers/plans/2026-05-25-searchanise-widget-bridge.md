# Searchanise Widget Bridge Implementation Plan

> **For Evan:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan.

## Goal

Add Searchanise product recommendations to the Next.js product detail page while preserving the existing Shopify recommendation carousel as a no-config and failure fallback.

## Constraints

- Keep layouts and product pages as Server Components.
- Use a narrow Client Component boundary for `next/script` events and DOM observation.
- Load Searchanise only when `NEXT_PUBLIC_SEARCHANISE_ENABLED=true` and `NEXT_PUBLIC_SEARCHANISE_API_KEY` is present.
- Reuse the legacy Shopify widget id `1T8K1Y6Q6G8R3B3`.
- Keep existing `getRelatedProducts` behavior available for disabled/missing/failure states.
- Add Storybook coverage for the new product component.

## Implementation Steps

1. Scaffold `src/components/product/searchanise-recommendations/` with the repo component generator.
2. Replace the scaffolded story first so the desired component API is explicit: `fallback`, `widgetId`, `fallbackDelayMs`, and `className`.
3. Implement `SearchaniseRecommendations` as a small Client Component that:
   - renders the Searchanise mount point;
   - observes whether Searchanise inserts content;
   - swaps to fallback after the loader is ready and no content appears within the delay;
   - swaps immediately to fallback if the loader reports failure.
4. Implement `SearchaniseScriptLoader` as a Client Component using `next/script` with `afterInteractive`, `onReady`, and `onError`.
5. Export the component from the product barrel.
6. Wire the script loader into `src/app/(storefront)/layout.tsx`.
7. Wire the widget into `src/app/(storefront)/products/[handle]/page.tsx`, keeping the Shopify carousel fallback.
8. Add Searchanise/snize styling in `src/app/globals.css` using existing CSS variables and warm design tokens.
9. Add public Searchanise env keys to `.env.example`.

## Verification

1. Run `pnpm lint`.
2. Run `pnpm build`.
3. Run `pnpm build-storybook`.
4. Run the dev server and verify the disabled configuration keeps the native carousel path available.
5. Verify enabled-without-valid-key behavior falls back cleanly without crashing.
