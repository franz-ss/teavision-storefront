# Phase 12: optimize /blogs/teavision-blogs loading and image rendering - Context

**Gathered:** 2026-06-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Optimize the `/blogs/teavision-blogs` listing route's loading behavior and image rendering quality while preserving the Phase 11 Tea Journal design and existing blog, tag, search, newsletter, and contact behavior.

The phase must focus on:

- Above-the-fold image preload discipline.
- Sanity image rendering quality through blur placeholders and bounded image URLs.
- A contained, default-listing-first Sanity query trim if it stays low risk.
- Safe published-content delivery improvements through Sanity CDN only when cache invalidation is verified.

This phase does not add blog capabilities, redesign the Tea Journal UI, rebuild tag/search behavior, or set hard local performance targets.

</domain>

<decisions>
## Implementation Decisions

### Aggressiveness

- **D-01:** Phase 12 should include image cleanup plus contained query trimming, not a full broad performance rewrite.
- **D-02:** Query trimming should target the unfiltered default `/blogs/teavision-blogs` listing first: hero, featured articles, and first page of latest articles.
- **D-03:** Tag pages and `?q=` search should keep the existing all-articles fallback path so counts, matching, and pagination behavior remain unchanged.
- **D-04:** Image/preload/LQIP improvements are must-have. Default-listing query trimming is a contained second task and may be skipped if it threatens existing behavior.

### Freshness

- **D-05:** Published Sanity blog reads may use CDN-backed delivery where safe.
- **D-06:** A short editorial lag of a few minutes is acceptable for public published blog content if webhook/tag invalidation is in place.
- **D-07:** Before enabling CDN-backed blog reads, the plan must verify or fix Sanity webhook/cache tag invalidation.
- **D-08:** Keep the current `cacheLife('hours')` timing for blog reads in this phase. Do not move blog content to `cacheLife('days')` or introduce a custom editorial cache profile yet.

### Image Experience

- **D-09:** Use a one-LCP-image policy. Only the intended above-the-fold hero image should preload; fallback hero output and featured/article cards must not compete for early image bandwidth unless the planner finds a clear no-real-hero exception.
- **D-10:** Carry Sanity `metadata.lqip` through the blog image model and use `placeholder="blur"` / `blurDataURL` where available.
- **D-11:** Generate bounded Sanity image URLs by use case, with sensible maximum widths and quality for hero and article-card images, then let `next/image` serve responsive variants.
- **D-12:** If Sanity image metadata is incomplete, keep safe fallback rendering: article cards use the existing warm placeholder/surface behavior and the hero uses its known fallback image. Do not invent dimensions or hide articles.

### Measurement

- **D-13:** Verification must include `pnpm lint`, `pnpm build`, and browser evidence on the real `/blogs/teavision-blogs` route.
- **D-14:** Do not require hard before/after numeric performance targets. Local LCP and transfer numbers can vary too much to be a reliable completion gate for this phase.
- **D-15:** Browser evidence should focus on desktop and mobile widths for `/blogs/teavision-blogs`, confirming the page renders, the above-fold images look sane, and duplicate/competing preload behavior has been addressed.
- **D-16:** If CDN-backed Sanity reads change, Sanity webhook/cache invalidation must be an explicit verification item.

### Codex's Discretion

- Exact implementation boundaries for the optional default-listing query trim.
- Exact maximum widths and qualities for bounded Sanity URLs, as long as they match the route's real rendered sizes and existing `next.config.ts` image quality constraints.
- Whether the one-LCP-image policy is implemented through component props, conditional `preload`, or a small helper, provided existing component APIs stay simple.
- How to capture browser evidence, as long as it is route-level and covers desktop and mobile widths.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project And Prior Decisions

- `.planning/ROADMAP.md` - Phase 12 roadmap entry and dependency on Phase 11.
- `.planning/PROJECT.md` - Project value, active constraints, and behavior-preservation decisions.
- `.planning/REQUIREMENTS.md` - Existing storefront requirements and Phase 11 redesign requirements.
- `.planning/STATE.md` - Recent project decisions and milestone state.
- `.planning/phases/11-full-visual-redesign/11-CONTEXT.md` - Tea Journal is part of the full visual redesign; preserve behavior and the new design system.

### Codebase Maps

- `.planning/codebase/STACK.md` - Next.js 16, React 19, Tailwind 4, Storybook, Sanity/Shopify environment.
- `.planning/codebase/ARCHITECTURE.md` - Server Component data flow, cached operations, and route/component layer boundaries.
- `.planning/codebase/CONVENTIONS.md` - Next 16 patterns, Tailwind token conventions, named exports, and `cn()` usage.

### Next.js 16 Docs

- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` - Cache Components and Suspense behavior.
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` - Remote image sizing, blur placeholders, and image optimization basics.
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` - `Image` props including `preload`, `sizes`, `placeholder`, and `blurDataURL`.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheLife.md` - Cache profiles and why blog content can use longer profiles, though this phase keeps `hours`.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheTag.md` - Cache tag invalidation requirements.

### Blog Route And Components

- `src/app/(storefront)/blogs/[blog]/page.tsx` - Blog listing route entry.
- `src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx` - Suspense boundaries and current `Hero` fallback.
- `src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx` - Current full-blog fetch, tag/search filtering, featured articles, pagination, newsletter, and contact sections.
- `src/app/(storefront)/blogs/[blog]/_components/hero-slot.tsx` - Hero data fetch and search/RSS wiring.
- `src/components/blog/hero/hero.tsx` - Current hero image preload and fallback image behavior.
- `src/components/blog/featured-articles/featured-articles.tsx` - Current first featured article preload behavior.
- `src/components/blog/article-results/article-results.tsx` - Listing result composition and tag navigation.
- `src/components/blog/article-list/article-list.tsx` - Article grid using `ArticleCard`.
- `src/components/ui/article-card/article-card.tsx` - Article image rendering, `preload` prop, `sizes`, and fallback surface.

### Sanity And Image Data

- `src/lib/blog/operations.ts` - `BlogImage`, `reshapeImage`, `getBlog`, filtering, pagination, and cache tags.
- `src/lib/sanity/client.ts` - Sanity client, current `useCdn: false`, and `getSanityImageUrl`.
- `src/lib/sanity/queries/blog.ts` - Blog listing query, summary fields, and existing `metadata.lqip` selection.
- `src/lib/sanity/types.ts` - Sanity image metadata and LQIP types.
- `next.config.ts` - Enabled Cache Components, allowed remote image domains, and allowed image qualities.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `Hero` in `src/components/blog/hero/hero.tsx` already centralizes the blog hero and can receive richer image data or preload controls.
- `ArticleCard` in `src/components/ui/article-card/article-card.tsx` already supports a `preload` prop and renders a stable placeholder when image metadata is incomplete.
- `reshapeImage` in `src/lib/blog/operations.ts` is the right boundary for carrying Sanity LQIP and bounded image URLs into UI components.
- `getSanityImageUrl` in `src/lib/sanity/client.ts` is the right utility boundary for Sanity image URL generation behavior.

### Established Patterns

- Blog data reads already use `'use cache'`, `cacheTag('blog', ...)`, and `cacheLife('hours')`.
- Runtime route values are behind Suspense boundaries, matching Next 16 Cache Components guidance.
- Remote images use `next/image` with `remotePatterns` covering Shopify, legacy Teavision CDN, and Sanity CDN.
- Styling must stay within the Phase 11 token system and component conventions.

### Integration Points

- The current `ListingPage` fallback renders `<Hero />`, which currently preloads the fallback hero image. Planning should address this so fallback UI does not emit an unintended competing preload.
- `FeaturedArticles` currently preloads the first featured article card. Planning should decide how this interacts with the one-LCP-image policy.
- `blogListingQuery` currently returns all article summaries and `bodyText` for the listing. The optional query trim should avoid changing tag/search behavior by leaving those modes on the existing path.
- Sanity `metadata.lqip` is already queried but dropped by `BlogImage`; passing it through is a low-risk image rendering improvement.

</code_context>

<specifics>
## Specific Ideas

- The first implementation should make the obvious image wins hard to miss: no fallback hero preload, no featured-card preload competing with a real hero, and Sanity blur placeholders where LQIP exists.
- The default-listing query trim should be planned as a second task after image wins, with an explicit escape hatch if keeping tag/search behavior unchanged becomes awkward.
- Browser evidence should inspect the actual `/blogs/teavision-blogs` route at desktop and mobile widths rather than relying only on Storybook.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering*
*Context gathered: 2026-06-11*
