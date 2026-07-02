# Project Research - Stack

**Milestone:** v1.6 Sanity CMS Homepage Integration
**Date:** 2026-07-02

## Existing Stack

The storefront already has the required integration packages:

- `next@16.2.9`
- `react@19.2.4`
- `next-sanity@13.1.1`
- `@sanity/image-url@2.1.1`
- `@portabletext/react@6.2.0`

The sibling Studio at `../teavision-cms` already has the required authoring stack:

- `sanity@5.28.0`
- `@sanity/client@7.22.1`
- `@sanity/vision@5.27.0`
- `@sanity/icons@3.7.4`
- `@sanity/schema@5.28.0`
- React 19

## Recommended Stack Changes

No new production dependency is required for the first pass.

Use the packages already present:

- `next-sanity` for GROQ, webhook parsing, and optional Draft Mode / Visual Editing helpers.
- `@sanity/image-url` for hotspot/crop-aware image URLs.
- Existing `src/lib/sanity/client.ts` for published reads.
- Existing Next 16 Cache Components functions: `'use cache'`, `cacheTag()`, and `cacheLife()`.

Defer Visual Editing / Presentation additions until after Draft Mode is stable. If approved later, add `sanity/presentation` in the Studio and `next-sanity/visual-editing` / `next-sanity/draft-mode` in the storefront through the already installed `next-sanity` package surface before adding new dependencies.

## Integration Constraints

- Keep the Studio in `../teavision-cms`. Do not embed a second Studio in the Next storefront.
- Keep storefront app code under `src/`.
- Keep Shopify authoritative for product, collection, cart, checkout, discounts, and pricing.
- Keep the homepage route and section components as Server Components except existing interactive leaves.
- Preserve v1.5 homepage PageSpeed behavior, especially the hero LCP image strategy.
- Preserve Phase 16/18/19 SEO behavior: noindex launch gate, canonical `/`, crawlable HTML, structured data, and one visible H1 per standalone route load.
- Do not introduce redundant file prefixes inside scoped folders; use names like `hero.ts`, `cta.ts`, and `faq.ts` under `objects/homepage/`.

## Current Project Fit

The storefront Sanity boundary is already server-only and authenticated:

- `src/lib/sanity/env.ts` reads `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, optional API version, read token, and webhook secret.
- `src/lib/sanity/client.ts` creates a `next-sanity` client with `useCdn: false`, `perspective: 'published'`, and `stega: false`.
- `src/lib/blog/operations.ts` uses `'use cache'`, `cacheTag()`, and `cacheLife('hours')`.
- `src/app/api/webhooks/sanity/route.ts` uses `parseBody()` from `next-sanity/webhook` and calls `revalidateTag()`.

That means the safest homepage approach is to extend the existing manual cache/webhook model rather than switching the whole Sanity layer to `defineLive` in the same milestone.

## Version-Specific Notes

Sanity's current Next.js docs say `next-sanity` is the official toolkit for Server Components, App Router data caching, Draft Mode, Visual Editing, Live Content, webhook validation, GROQ helpers, Portable Text, and image URL support. The same docs note that `defineLive` is recommended for many new applications, but manual cache strategies remain appropriate for apps that need fine-grained control.

Local Next 16 docs matter for this repo:

- Cached functions cannot read `cookies()`, `headers()`, or `searchParams` directly. Draft Mode status is a special allowed read, but route handlers must still enable/disable draft mode outside cached scopes.
- Draft Mode forces cached functions to re-execute per request and prevents draft results from being saved to the cache.
- Dynamic `generateMetadata()` should use cached external data when the page is otherwise prerenderable.
- `next/image` requires `alt`, needs `sizes` for responsive/fill images, and supports `preload`/`fetchPriority`; deprecated `priority` remains off-limits per project decisions.

## Sources

- Local: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`
- Local: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/draft-mode.md`
- Local: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
- Local: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
- Sanity: https://www.sanity.io/docs/nextjs/introduction
- Sanity: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs
- Sanity: https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs
- Sanity: https://www.sanity.io/docs/nextjs/validating-sanity-webhooks-nextjs
