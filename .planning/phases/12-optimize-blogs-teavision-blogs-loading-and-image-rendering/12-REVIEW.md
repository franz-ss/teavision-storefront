# Phase 12: Code Review Report

---
phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering
reviewed: 2026-06-11T11:38:59Z
depth: standard
files_reviewed: 11
files_reviewed_list:
  - src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx
  - src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx
  - src/components/blog/featured-articles/featured-articles.tsx
  - src/components/blog/hero/hero.stories.tsx
  - src/components/blog/hero/hero.tsx
  - src/components/ui/article-card/article-card.stories.tsx
  - src/components/ui/article-card/article-card.tsx
  - src/lib/blog/operations.ts
  - src/lib/sanity/client.ts
  - src/lib/sanity/queries/blog.ts
  - src/lib/sanity/types.ts
findings:
  critical: 0
  warning: 8
  info: 4
  total: 12
status: issues_found
---

**Reviewed:** 2026-06-11T11:38:59Z
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Narrative Findings (AI reviewer)

## Summary

Reviewed the Phase 12 blog-listing optimization: the new light default-listing GROQ path (`defaultBlogListingQuery` + `getDefaultBlogListing`), the CDN-backed `sanityPublishedFetch`, bounded `getSanityImageUrl` options, LQIP blur placeholders in `Hero`/`ArticleCard`, and the `ListingContent` gating between the light and full paths. Cross-referenced supporting files (`listing.ts`, `hero-slot.tsx`, `env.ts`, `next.config.ts`, the Sanity webhook route, `article-results.tsx`) and verified Next.js 16 `next/image` accepts the `preload` prop (it does; `priority` is the deprecated alias).

The image/LQIP work and route gating are sound, and GROQ parameters are passed safely (no injection). However, the new GROQ query has correctness gaps around `featuredPosts` (null-propagation can blank the entire listing; featured posts bypass the publish-date guard the old path enforced; featured posts beyond the first two vanish entirely), server-side pagination mishandles out-of-range pages, and the CDN client change silently drops the read token while leaving the token-aware path as dead code. No Critical findings — none of these are exploitable or data-destructive — but several Warnings describe user-visible incorrect behavior under plausible CMS states and should be fixed before this ships.

No convention violations found: no default component exports (Storybook `meta` default exports are the established pattern), no `any`, `cn()` used for composition, token classes only, no `'use client'` on the changed files.

## Warnings

### WR-01: Default listing GROQ filter null-propagates when the blog has no `featuredPosts`, hiding every article

**File:** `src/lib/sanity/queries/blog.ts:170-185`
**Issue:** Both the `articles` filter and `totalCount` use `!(_id in *[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref)`. If the blog document has no `featuredPosts` attribute (never configured, or cleared in Sanity Studio), the subexpression evaluates to `null`, `_id in null` evaluates to `null`, and `!null` is `null` under GROQ three-valued logic — so the filter fails for **every** article. Result: the unfiltered `/blogs/[handle]` listing renders the empty state with "0 articles" even though published articles exist. An empty array `[]` is safe; only the missing/null attribute breaks. This is one CMS edit away from blanking the blog's front page.
**Fix:** Wrap the ref list in `coalesce()` in both places:

```groq
!(_id in coalesce(*[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref, []))
```

### WR-02: Default-listing featured posts bypass the publish-date and slug guards the full path enforces

**File:** `src/lib/sanity/queries/blog.ts:166-168`, `src/lib/blog/operations.ts:474-477`
**Issue:** `defaultBlogListingQuery` dereferences `featuredPosts[]->{...}` with no `publishedAt <= now()` or `defined(slug.current)` condition, and `getDefaultBlogListing` consumes `rawFeatured.slice(0, 2)` directly. The full path (`getBlog` → `getFeaturedArticles`) only keeps featured posts that also appear in the published `articles` list, so it filters these out. On the new light path, a future-dated (scheduled) featured post is shown publicly before its publish date — breaking the embargo every other query in this file enforces — and a slugless featured post falls back to `handle: article._id` (operations.ts:214), producing a broken link like `/blogs/teavision-blogs/<documentId>` that 404s.
**Fix:** Filter before slicing in `getDefaultBlogListing`:

```ts
const now = Date.now()
const featuredArticles = rawFeatured
  .filter((a) => a.slug && a.publishedAt && Date.parse(a.publishedAt) <= now)
  .slice(0, 2)
  .map((a) => reshapeArticleSummary(a, IMAGE_OPTIONS_FEATURED_CARD))
```

(Note: `Date.now()` inside `'use cache'` is evaluated at cache-fill time, same as `now()` in the GROQ filter — acceptable here, or push the condition into GROQ for consistency.)

### WR-03: Featured posts beyond the first two disappear from the default listing entirely

**File:** `src/lib/blog/operations.ts:474-477`, `src/lib/sanity/queries/blog.ts:175`
**Issue:** The GROQ `articles` filter excludes **all** `featuredPosts` refs, but the component only displays `rawFeatured.slice(0, 2)`. If an editor configures three or more featured posts, posts #3+ are excluded from the article grid (and from `totalCount`) yet never rendered in the featured band — they become invisible on the unfiltered listing. The full path behaves differently: `getFeaturedArticles` renders *all* preferred featured posts (its first loop has no cap; only the backfill loop stops at 2), so the two paths diverge as soon as a third featured post exists.
**Fix:** Make the display cap and the exclusion set agree. Either cap the exclusion in GROQ to the first two refs (`featuredPosts[0...2]._ref` in the `articles` and `totalCount` filters) or render all featured posts in the band. Apply the same cap (or no cap) to `getFeaturedArticles` so the unfiltered and tag/search paths agree.

### WR-04: Out-of-range `?page=` returns an empty grid while pagination claims a valid current page

**File:** `src/lib/blog/operations.ts:460-461, 484-486`
**Issue:** `offset` is computed from the **raw** requested page (`(page - 1) * ARTICLES_PER_PAGE`) before `totalCount` is known, but `currentPage` is clamped to `totalPages` after the fetch. For `/blogs/teavision-blogs?page=99` on a 2-page blog, the GROQ slice returns `[]`, yet the response reports `currentPage: 2`, `totalArticles: N`. `ArticleResults` then renders the "N articles" header, an empty `ArticleList` (not the `EmptyState`, since `totalArticles > 0`), and a `Pagination` showing page 2 as active — a contradictory, broken page. The in-memory `paginateArticles` used by the filtered path clamps *before* slicing, so the two paths disagree.
**Fix:** Detect the mismatch and recover — e.g. after the fetch, if `pageArticles.length === 0 && totalArticles > 0 && page > 1`, re-run the articles slice with the clamped page (or `notFound()` for out-of-range pages, matching whatever the filtered path's UX should be). Alternatively fetch `totalCount` first and clamp before computing `offset`.

### WR-05: Type assertions paper over the light query shape (`bodyText` does not exist at runtime)

**File:** `src/lib/blog/operations.ts:474, 479`; `src/lib/sanity/types.ts:148-153`
**Issue:** `data.articles as SanityBlogPostSummary[]` widens `Omit<SanityBlogPostSummary, 'bodyText'>[]` back to the full type, asserting that `bodyText: string | null` exists when it is `undefined` at runtime. Likewise `(data.blog.featuredPosts ?? []) as SanityBlogPostSummary[]` relies on `SanityBlog.featuredPosts` being typed for the *full* summary fields even though `defaultBlogListingQuery` selects the light fields. The code only works because `normalizeBodyText` happens to use optional chaining despite its `string | null` signature. These assertions defeat the type system in exactly the way the project's "no `any`" rule exists to prevent, and any future code that trusts `bodyText: string | null` on these objects will break silently.
**Fix:** Type the light shape honestly. Change `reshapeArticleSummary` to accept `Omit<SanityBlogPostSummary, 'bodyText'> & { bodyText?: string | null }`, update `normalizeBodyText` to `(bodyText: string | null | undefined)`, and remove both `as` casts. Add a `SanityDefaultBlog` type (featuredPosts: light summaries) for the light query's `blog` field instead of reusing `SanityBlog`.

### WR-06: CDN client silently drops the Sanity read token; all blog reads now depend on the dataset being public

**File:** `src/lib/sanity/client.ts:33-49, 55-60`
**Issue:** Every blog operation (`getBlog`, `getArticle`, `getDefaultBlogListing`, `getHomepageArticles`) was switched to `sanityPublishedFetch`, which uses `getSanityCdnClient` — built **without** the token that `getSanityClient` conditionally includes. `getSanityReadToken()` exists precisely because `SANITY_API_READ_TOKEN` may be configured; if the dataset is (or later becomes) private, every blog read fails with 401 and there is no fail-fast signal — the comment's "no auth token is required" precondition is asserted, not enforced. Meanwhile the token-aware `sanityFetch` retains zero callers (see IN-01), so the failure mode has no escape hatch in code.
**Fix:** Enforce the precondition instead of documenting it:

```ts
function getSanityCdnClient() {
  const config = getSanityConfig()
  if (getSanityReadToken()) {
    // Private dataset: CDN-cached unauthenticated reads will 401. Fall back
    // to the authenticated client rather than failing every blog read.
    return getSanityClient()
  }
  return createClient({ ...config, useCdn: true, perspective: 'published', stega: false })
}
```

### WR-07: Hero LQIP check accepts empty string, producing a `placeholder="blur"` render crash path

**File:** `src/components/blog/hero/hero.tsx:42, 56-57`
**Issue:** `const hasLqip = heroImage?.lqip != null` is true for `lqip: ''`, which yields `placeholder="blur"` with `blurDataURL=''`. `next/image` throws at render time when `placeholder` is `blur` and `blurDataURL` is falsy for a remote image — taking down the hero (and the route, absent an error boundary) on malformed CMS data. `ArticleCard` (article-card.tsx:100) already uses the safe truthy check, so the two components are inconsistent.
**Fix:** Use a truthy check, matching `ArticleCard`:

```ts
const hasLqip = Boolean(heroImage?.lqip)
```

### WR-08: Webhook-purge → stale-CDN race can re-pin stale content for the full `cacheLife('hours')` window

**File:** `src/lib/sanity/client.ts:24-31` (safety claim), `src/lib/blog/operations.ts:391, 434, 458, 521`
**Issue:** The documented invalidation chain is: Sanity webhook → `revalidateTag(..., { expire: 0 })` → next request refetches. With `useCdn: true`, that refetch hits Sanity's apicdn, which is eventually consistent — the webhook fires at publish time, typically *before* CDN edges have the new document. If the first post-purge request lands inside that propagation window, the **stale** payload is cached again under `'use cache'` + `cacheLife('hours')`, and nothing re-invalidates it until the cache expires hours later. The comment in `client.ts` presents webhook invalidation as the safety condition without acknowledging this race.
**Fix:** Either accept and document the race explicitly (it degrades freshness, not correctness), or mitigate: have the webhook handler issue a delayed second `revalidateTag` (e.g. after 60s via a queued/deferred invalidation), or use a shorter `cacheLife` profile for blog tags so a stale re-pin self-heals quickly.

## Info

### IN-01: `sanityFetch` and the token-aware `getSanityClient` path are now dead code

**File:** `src/lib/sanity/client.ts:11-22, 44-49`
**Issue:** After the migration to `sanityPublishedFetch`, `sanityFetch` has zero callers (`getSanityClient` survives only as its implementation detail). Dead exports invite drift.
**Fix:** Remove `sanityFetch`, or keep it with a comment reserving it for future draft/preview reads — ideally as part of the WR-06 fallback so it earns its keep.

### IN-02: Reading time on the default listing collapses to ~1 min for every article

**File:** `src/lib/blog/operations.ts:222`, `src/lib/sanity/queries/blog.ts:122-126`
**Issue:** With `bodyText` omitted, `estimateReadingTime(bodyText || excerpt)` runs on a ≤180-char excerpt (~30 words), so effectively every card on the unfiltered listing shows "1 min read". The same article on a tag/search page (full path, with `bodyText`) and on its article page shows the real value — visibly inconsistent metadata for the same card across views. The query comment declares this acceptable, but the cross-view inconsistency is worth a deliberate decision.
**Fix:** Either store a precomputed reading time on the Sanity document (computed at publish), or fetch a cheap word count (e.g. `"bodyWordCount": length(string::split(pt::text(body), " "))`) in the light query — far cheaper than full `pt::text` transfer while keeping values consistent. Otherwise hide the reading-time label on the light path.

### IN-03: Tag dedup semantics differ between the light and full paths

**File:** `src/lib/blog/operations.ts:305-309` vs `490-495`
**Issue:** The default listing builds `allTags` via `uniqueLabels` (case-insensitive dedup, first-seen casing wins); tag/search pages build tags via `getUniqueArticleTags` (case-sensitive `Set`). If the CMS contains `"Matcha"` and `"matcha"`, the unfiltered listing shows one chip while tag pages show two. Cosmetic, but the nav flickers between views.
**Fix:** Have `getUniqueArticleTags` delegate to `uniqueLabels` before sorting so both paths share one dedup rule.

### IN-04: `ogImage` URLs are generated unbounded

**File:** `src/lib/blog/operations.ts:175`
**Issue:** `reshapeSeo` calls `reshapeImage(seo?.ogImage ?? null)` with no `imageOptions`, so OG image URLs carry no width bound — original-resolution assets are referenced in social metadata, contrary to the phase's "bounded Sanity image URL generation" goal (1200px is the OG sweet spot).
**Fix:** Add an `IMAGE_OPTIONS_OG = { width: 1200, quality: 75, fit: 'max' }` constant and pass it in `reshapeSeo`.

---

_Reviewed: 2026-06-11T11:38:59Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
