---
phase: 12
plan: 01
subsystem: blog
tags: [blog, images, performance, sanity, preload, lqip]
dependency_graph:
  requires: []
  provides:
    - bounded-sanity-image-urls
    - blog-image-lqip
    - hero-preload-discipline
    - card-blur-placeholders
  affects:
    - src/lib/blog/operations.ts
    - src/lib/sanity/client.ts
    - src/components/blog/hero/hero.tsx
    - src/components/ui/article-card/article-card.tsx
    - src/components/blog/featured-articles/featured-articles.tsx
    - src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx
tech_stack:
  added: []
  patterns:
    - Sanity image URL builder with bounded width/height/quality/fit options
    - Conditional next/image blur placeholder from Sanity LQIP
    - preload=false on Suspense fallback hero to prevent competing LCP preload
key_files:
  created: []
  modified:
    - src/lib/blog/operations.ts
    - src/lib/sanity/client.ts
    - src/components/blog/hero/hero.tsx
    - src/components/blog/hero/hero.stories.tsx
    - src/components/ui/article-card/article-card.tsx
    - src/components/ui/article-card/article-card.stories.tsx
    - src/components/blog/featured-articles/featured-articles.tsx
    - src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx
decisions:
  - D-04: Image/preload/LQIP improvements implemented
  - D-09: One-LCP-image policy enforced via preload=false on fallback hero and no card preloading
  - D-10: Sanity metadata.lqip carried through BlogImage and used as blurDataURL where available
  - D-11: Bounded Sanity URLs by use case (hero 1920px/q75, featured card 900px/q75, card 640px/q68)
  - D-12: Safe fallback rendering preserved for all null/missing metadata cases
  - D-13 and D-15: Lint and TypeScript both pass; build TypeScript phase passes
metrics:
  duration: ~25 min
  completed: 2026-06-11
  tasks: 5
  files: 8
---

# Phase 12 Plan 01: Blog Image Rendering And Preload Discipline Summary

One-liner: Sanity LQIP wired to blur placeholders, Sanity image URLs bounded by use case, and the listing hero made the only preloaded image on the blog route.

## Objective

Make /blogs/teavision-blogs use one intended above-the-fold preload, carry Sanity LQIP into rendered images, and generate bounded Sanity image URLs without changing Tea Journal layout or route behavior.

## What Was Built

### Task 1: Carry LQIP through BlogImage (feat 6f8431e)

Added lqip optional string or null to BlogImage in src/lib/blog/operations.ts. Updated reshapeImage() to read asset.metadata?.lqip and include it in the returned BlogImage. The field is optional so existing callers and test stubs that do not provide it are unaffected.

### Task 2: Bounded Sanity image URL options (feat 6f8431e, same commit)

Extended getSanityImageUrl() in src/lib/sanity/client.ts with a typed SanityImageUrlOptions parameter (width, height, quality, fit). Default quality is 75 and default fit is max (no upscaling). Added use-case constants:

- IMAGE_OPTIONS_HERO: width 1920, quality 75, fit max
- IMAGE_OPTIONS_FEATURED_CARD: width 900, quality 75, fit max
- IMAGE_OPTIONS_CARD: width 640, quality 68, fit max

Updated getBlog() to use hero options for the blog heroImage, featured card options for featuredPosts, and card options for all articles. Sanity image URLs now include auto=format, bounded w, and q parameters.

### Task 3: Hero preload explicit and fallback-safe (feat cc6d304)

Rewrote Hero in src/components/blog/hero/hero.tsx:
- Added preload boolean prop (default true)
- Changed image prop type from ShopifyImage to a local HeroImage (url, altText, lqip)
- Added placeholder=blur and blurDataURL when heroImage.lqip exists
- Removed the ShopifyImage import

Updated ListingPage in src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx to pass preload=false to the Suspense fallback Hero. The resolved hero (via HeroSlot) renders with preload=true (default), making it the only preloaded image on the route.

### Task 4: Stop card images competing with hero preload (feat 0767bf0)

- Removed preload={index === 0} from FeaturedArticles - featured cards never preload on the listing route
- Added lqip optional field to the ArticleCardArticle.featuredImage inline type
- Added conditional placeholder=blur / blurDataURL to ArticleCard when featuredImage.lqip is present
- Added WithBlurPlaceholder story to article-card.stories.tsx

### Task 5: Route-level verification

- ESLint: passed across all 8 modified files
- TypeScript (tsc --noEmit): passed with no errors
- next build TypeScript phase: passed (14.7s)
- Build fails at collect page data stage due to SITE_URL environment variable missing in worktree context - pre-existing env var requirement unrelated to code changes

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1+2  | 6f8431e | feat(12-01): carry Sanity lqip through BlogImage and add bounded image URL options |
| 3    | cc6d304 | feat(12-01): make hero preload explicit and disable it on Suspense fallback |
| 4    | 0767bf0 | feat(12-01): stop featured card images from competing with hero preload; add blur placeholders |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed BlogImage.lqip type to optional**
- Found during: Task 1 implementation; TypeScript check in Task 5
- Issue: lqip: string | null (required) broke all existing story stubs and test data
- Fix: Changed to lqip optional string or null - semantically equivalent; reshapeImage() emits null for missing metadata
- Files modified: src/lib/blog/operations.ts
- Commit: 6f8431e

**2. [Rule 1 - Bug] Fixed reshapeArticleSummary .map() callback incompatibility**
- Found during: Task 5 TypeScript check
- Issue: data.articles.map(reshapeArticleSummary) passed Array index (number) as second argument conflicting with new imageOptions param
- Fix: Wrapped in arrow functions at all call sites
- Files modified: src/lib/blog/operations.ts
- Commit: 6f8431e

**3. [Rule 1 - Bug] Fixed hero.stories.tsx CmsContent stub type error**
- Found during: Task 5 TypeScript check
- Issue: CmsContent story had width and height on image prop which are not in HeroImage type
- Fix: Removed width and height from story stub
- Files modified: src/components/blog/hero/hero.stories.tsx
- Commit: cc6d304

**4. [Rule 3 - Blocking] Approved pnpm native builds in worktree**
- Found during: Task 1 first commit attempt
- Issue: Worktree pnpm install blocked on ERR_PNPM_IGNORED_BUILDS for esbuild, sharp, unrs-resolver
- Fix: Added allowBuilds to worktree pnpm-workspace.yaml - worktree-local only, not staged

## Browser Evidence

TypeScript and compilation stages pass. Full production build requires SITE_URL and Shopify env vars not present in worktree.

Expected on /blogs/teavision-blogs:
- Fallback hero: preload=false - no competing preload link
- Resolved hero: preload=true (default) - one preload link for intended LCP
- Featured cards: no preload (removed preload={index === 0})
- Sanity images: bounded CDN URLs with auto=format, bounded w, q parameters
- Where LQIP exists: blur placeholder with base64 blurDataURL

## Known Stubs

None.

## Threat Flags

No new network endpoints, auth paths, or trust boundary changes.

## Self-Check: PASSED

Commits verified: 6f8431e, cc6d304, 0767bf0 - all FOUND on main branch.
