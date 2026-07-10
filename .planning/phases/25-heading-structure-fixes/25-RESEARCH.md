# Phase 25: Heading structure fixes — Research

**Date:** 2026-07-10  
**Status:** Complete

## Current implementation

- `src/lib/shopify/html-content.ts` centralizes trusted Shopify HTML sanitization: tag and class allowlists, safe links/images, typography classes, heading transforms, and table wrappers.
- The shared `compact` variant currently maps source `h1`/`h2` to `h3`. It is used for product descriptions and the collection read-more path. The product-description call and its behavior must remain unchanged.
- Product disclosures in `src/app/(storefront)/products/[handle]/page.tsx` are server-rendered native `details`/`summary` elements. The first panel is opened with `open={index === 0}` and the title is currently text directly within `summary`.
- Collection read-more HTML is prepared by `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`, then passed as branded `SanitizedHtml` through `StoryDisclosure` to `RichText variant="disclosure"`. The RichText variant controls presentation only.

## Recommended implementation approach

1. Preserve the existing product disclosure `details`/`summary` structure, first-panel-open behavior, labels, chevron, and server rendering. Place each title in an `h2` inside the existing `summary`; move title typography to the heading while retaining the summary layout classes and a shrink/wrap-safe heading next to the chevron. Do not add roles, ARIA-expanded state, handlers, or client state.
2. Add an isolated `collectionStory` sanitizer variant and public `sanitizeShopifyCollectionStoryHtml()` entry point. Update only the collection read-more call site to use it; do not alter `sanitizeShopifyCompactHtml()` or product description rendering.
3. Model collection-story heading conversion as a per-source heading output tag and class, rather than a tag-only map. Source `h3` must become `h2` with the existing compact `h3` visual class, and source `h4` must become `h3` with the existing compact `h4` visual class. A simple map cannot retain source-specific visuals when multiple sources converge on `h3`.
4. Keep the existing collection path boundaries intact: non-rich-hero story content remains after the product grid, and the rich-hero path remains unchanged. Update the StoryDisclosure Storybook fixture to use the sanitized `h2`/`h3` outcome.

## Test and verification requirements

- Extend `src/lib/shopify/html-content.test.ts` with `collectionStory` assertions: source `h3` → `h2`, `h4` → `h3`, expected visual classes, and unchanged safe handling for other heading levels. Preserve compact tests as the regression proof for product descriptions.
- Extend `src/app/(storefront)/products/[handle]/page.test.tsx`: one page `h1`; each disclosure remains `details > summary` containing an `h2`; first panel remains open; no `role="button"` or `aria-expanded`. Keep the imported-description compact regression test.
- Extend `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx`: a non-rich-hero fixture demonstrates sanitized story `h2`/`h3` output after `id="product-grid"`, while rich-hero assertions remain unchanged.
- Update `src/components/collection/story-disclosure/story-disclosure.stories.tsx` fixture while retaining Default, Open, and mobile-overflow coverage. Inspect the story at mobile width for native keyboard toggle, focus behavior, chevron/open state, and long-title wrapping.

## Validation commands

```bash
pnpm vitest run src/lib/shopify/html-content.test.ts "src/app/(storefront)/products/[handle]/page.test.tsx" "src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx"
pnpm test:unit
pnpm typecheck
pnpm lint
```

## Constraints and pitfalls

- Do not introduce a general rich-text normalization policy; the behavior must be collection-story-only.
- Do not replace native disclosures with scripted controls or ARIA emulation.
- Do not change the shared `compact` API, heading transform behavior, or product-description call site.
- Preserve the existing safe sanitizer allowances and branded `SanitizedHtml` data flow.
