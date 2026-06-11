# Phase 12 Research: Blog Listing Loading And Image Rendering

**Date:** 2026-06-11
**Phase:** 12 - optimize /blogs/teavision-blogs loading and image rendering
**Recommendation:** Ship the image/preload path first, then apply default-listing query/CDN trimming only after webhook invalidation is verified.

## Research Question

How should `/blogs/teavision-blogs` be optimized for faster perceived loading and cleaner image rendering while preserving the Phase 11 Tea Journal design, tag/search behavior, and Sanity freshness expectations?

## Sources Reviewed

- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheLife.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheTag.md`
- Sanity image transformations: https://www.sanity.io/docs/apis-and-sdks/image-urls
- Sanity `next-sanity/image`: https://www.sanity.io/docs/nextjs/next-sanity-image-component
- Sanity perspectives / published CDN reads: https://www.sanity.io/docs/visual-editing/visual-editing-client-stega
- Sanity GROQ perspectives: https://www.sanity.io/docs/content-lake/groq-introduction
- Sanity Next.js 16 / next-sanity v13 note: https://www.sanity.io/docs/help/nextjs-16-sanitylive-status

## Current Code Findings

- `src/components/blog/hero/hero.tsx` always renders `Image preload`, including the Suspense fallback from `src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx`.
- `src/components/blog/featured-articles/featured-articles.tsx` currently passes `preload={index === 0}` into the first featured article card, so the hero and first card can compete for early bandwidth.
- `src/lib/sanity/queries/blog.ts` already fetches `metadata.lqip`, but `src/lib/blog/operations.ts` drops it when reshaping `BlogImage`.
- `getSanityImageUrl()` currently applies only `auto('format')`; it does not bound width, quality, or fit by use case.
- `blogListingQuery` fetches all article summaries and `bodyText`, then `ListingContent` filters, de-dupes featured posts, and paginates in memory.
- The existing Sanity webhook route already calls `revalidateTag('blog')`, `revalidateTag('blog-${slug}')`, and article tags when payload slug data is available.
- `getBlog()` and `getArticle()` already use `'use cache'`, `cacheTag()`, and `cacheLife('hours')`.
- `next.config.ts` has `cacheComponents: true`, allows `cdn.sanity.io`, and restricts image qualities to `[68, 75]`.

## Technical Findings

### Next Image

Next 16's `Image` supports `preload`, `sizes`, `quality`, `placeholder`, and `blurDataURL`. Remote images need explicit width/height or `fill`; remote blur placeholders must be provided manually. Missing `sizes` on responsive/fill images can cause unnecessarily large downloads. `preload` inserts an early `<link>` and should be reserved for the intended LCP image.

Implication for Phase 12:

- Add a `preload` control to the blog `Hero` and use `preload={false}` for Suspense fallback output.
- Keep the real hero as the only preloaded image for the default listing unless no real hero exists and a deliberate fallback rule is needed.
- Remove featured-card preloading on the listing route unless later measurement proves the card is the actual LCP.
- Use `placeholder="blur"` only when `blurDataURL` exists.

### Sanity Images

Sanity image URLs support `auto=format`, integer `w`/`h`, `fit=max` to avoid upscaling, and `q` for quality. Sanity notes that limiting the number of sizes/crops improves cache reuse. `next-sanity/image` can bypass the Next optimization proxy and use Sanity's CDN-aware loader, but the current code already uses `next/image` and remote patterns.

Implication for Phase 12:

- Keep `next/image` for the low-risk implementation.
- Extend `getSanityImageUrl()` with typed options such as width, height, quality, and fit.
- Use bounded source URLs by use case:
  - Hero: large enough for full-bleed desktop, quality aligned to `next.config.ts`.
  - Featured card: medium responsive width.
  - Standard card: smaller responsive width.
- Do not invent dimensions when Sanity metadata is missing; keep current fallback surfaces.

### Sanity Published Reads And CDN

Sanity documents published perspective reads as suitable for CDN caching with `useCdn: true`, while draft/raw/release preview paths require `useCdn: false`. This project currently uses `perspective: 'published'` and `stega: false`, so published blog reads are eligible if webhook invalidation works. The project is also already on `next-sanity` v13, which Sanity identifies as resolving a Next.js 16 SanityLive request-overage issue; the route does not currently use `SanityLive`.

Implication for Phase 12:

- Verify webhook payload shape before changing `useCdn`.
- If verified, switch only published blog reads to CDN-backed delivery or introduce a safe published client option.
- Keep `cacheLife('hours')` per D-08.
- Do not add SanityLive or preview/draft behavior in this phase.

### Query Trimming

The current all-articles query is behaviorally useful for tag/search pages because filtering and counts happen in memory. For the unfiltered default listing, the route only needs blog metadata, hero image, featured posts, the first page of latest articles excluding featured IDs, and enough pagination metadata to render controls.

Implication for Phase 12:

- Add a separate default-listing query/helper rather than replacing `getBlog()` globally.
- Use it only when there is no active tag and no `?q=` query.
- Keep tag pages and search pages on the existing all-articles fallback path.
- Make query trimming optional during execution if preserving exact listing behavior becomes risky.

## Recommended Plan Shape

1. Wave 1 - Image and preload discipline:
   - Carry LQIP through `BlogImage`.
   - Add bounded image URL options.
   - Make the fallback hero non-preloading.
   - Stop article cards from competing with the hero preload on this route.
   - Verify desktop and mobile route rendering.

2. Wave 2 - CDN and default-listing query trim:
   - Verify or fix webhook slug/tag invalidation first.
   - Add CDN-backed published reads only after invalidation evidence exists.
   - Add a light default listing query/helper gated to unfiltered `/blogs/teavision-blogs`.
   - Preserve `getBlog()` for tag/search fallback.

## Risks And Mitigations

- **Risk:** Duplicate preloads persist if both Suspense fallback and resolved hero render `preload`.
  **Mitigation:** Make fallback hero explicitly `preload={false}` and audit generated head links in browser evidence.

- **Risk:** Query trim breaks tag/search pagination or article counts.
  **Mitigation:** Use a separate default-listing helper and preserve existing full-blog path for filtered modes.

- **Risk:** CDN-backed reads show stale published content after Sanity edits.
  **Mitigation:** Verify webhook payload slug handling and route tags before enabling CDN-backed reads.

- **Risk:** Image URL constraints crop or upscale editorial images unexpectedly.
  **Mitigation:** Use `fit=max` by default for constrained URLs and only crop when an existing UI aspect ratio already crops via CSS.

## Verification Recommendation

- `pnpm lint`
- `pnpm build`
- Browser evidence for `/blogs/teavision-blogs` at desktop and mobile widths:
  - page renders and layout remains Phase 11 consistent
  - fallback hero does not create a competing preload
  - only intended hero image preloads above the fold
  - blur placeholders appear where Sanity LQIP exists
  - card fallback surfaces remain stable when metadata is incomplete
- If CDN reads change, webhook invalidation is verified with a signed or locally simulated Sanity payload that includes `blogSlug` / `articleSlug` coverage.

## RESEARCH COMPLETE

