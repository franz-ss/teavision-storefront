---
phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering
reviewed: 2026-06-11T12:15:24Z
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
  critical: 2
  warning: 5
  info: 3
  total: 10
status: issues_found
---

# Phase 12: Code Review Report (Re-review after gap closure 12-03)

**Reviewed:** 2026-06-11T12:15:24Z
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Summary

Re-review of the blog listing optimization after gap-closure plan 12-03. **Both prior blockers are fixed and sound:**

- **Prior WR-01 (coalesce guard):** Verified present. `defaultBlogListingQuery` now wraps the featured-refs exclusion subquery in `coalesce(..., [])` at both the `articles` filter (`src/lib/sanity/queries/blog.ts:175`) and the `totalCount` filter (`src/lib/sanity/queries/blog.ts:184`). A blog with no `featuredPosts` no longer collapses the listing — `_id in []` evaluates correctly to false.
- **Prior WR-07 (empty-string LQIP):** Verified fixed. `hero.tsx` now computes `hasLqip = Boolean(heroImage?.lqip)` (`src/components/blog/hero/hero.tsx:42`) and gates both `placeholder` and `blurDataURL` on it (lines 56-57), so an empty-string LQIP can no longer be passed as `blurDataURL`. `article-card.tsx:100-101` uses the same truthiness-guard pattern correctly. The `preload` prop usage was verified against the bundled Next.js 16 docs — it is the correct replacement for the deprecated `priority` prop.

However, the fresh review found **two new blockers** introduced by this phase's refactor: the filtered (tag/search) path now silently excludes featured articles from results (a regression visible in the diff against `fafbf6a`), and the new light default-listing path renders featured posts without any published/slug guard, leaking scheduled content and producing guaranteed-404 links. Five warnings cover pagination edge cases, type-assertion lies around the light query shape, an always-wrong "1 min read" label, hidden featured posts beyond the first two, and a request-crashing `decodeURIComponent` call.

## Critical Issues

### CR-01: Featured articles are silently excluded from tag and search results (regression)

**File:** `src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx:72-88`
**Issue:** Before this phase, the filtered path used `mainArticles = isFiltered ? filteredArticles : filteredArticles.filter(a => !featuredIds.has(a.id))` — featured articles were only excluded from the grid on the *unfiltered* listing (where they render in their own `FeaturedArticles` section). The refactor moved the unfiltered listing to an early return, but the remaining filtered-path code now excludes featured IDs **unconditionally**:

```tsx
const mainArticles = filteredArticles.filter(
  (article) => !featuredIds.has(article.id),
)
```

The filtered path renders no `FeaturedArticles` section, so featured articles (including the two latest articles backfilled by `getFeaturedArticles` when fewer than two are configured) are invisible on every tag and search page. A search query or tag that only matches featured articles renders the `EmptyState` ("0 articles") even though matching published articles exist. This inverts the pre-existing behavior — a correctness regression on the search/tag feature.

**Fix:** On the filtered path, paginate `filteredArticles` directly and drop the featured-exclusion logic entirely (the `featuredArticles`/`featuredIds` computation at lines 72-76 becomes dead and should be removed along with the now-unused `getFeaturedArticles` import):

```tsx
const filteredArticles = filterArticles({
  articles: blogData.articles,
  activeTag,
  query: q,
})
const paginated = paginateArticles({
  articles: filteredArticles,
  page: parseListingPage(page),
})
```

### CR-02: Default listing renders scheduled/unpublished featured posts and links them to 404 pages

**File:** `src/lib/sanity/queries/blog.ts:166-168` and `src/lib/blog/operations.ts:474-477`
**Issue:** Every article subquery in this file filters on `defined(slug.current) && publishedAt <= now()`, but the `featuredPosts[]->{...}` dereference in `defaultBlogListingQuery` has **no filter at all**. Unlike the heavy path — where `getBlog()` passes featured posts through `getFeaturedArticles()`, which intersects them against the published `articles` list and drops anything unpublished — `getDefaultBlogListing` renders `rawFeatured.slice(0, 2)` directly:

```ts
const rawFeatured = (data.blog.featuredPosts ?? []) as SanityBlogPostSummary[]
const featuredArticles = rawFeatured
  .slice(0, 2)
  .map((a) => reshapeArticleSummary(a, IMAGE_OPTIONS_FEATURED_CARD))
```

Consequences when an editor features a future-dated (scheduled) post:
1. **Embargo leak** — the post's title, excerpt, and featured image render publicly on the default listing before its publish date (content disclosure).
2. **Guaranteed 404** — the card links to the article page, but `blogArticleQuery` requires `publishedAt <= now()`, so the link 404s.
3. A featured post with no slug gets the `handle: article._id` fallback (`operations.ts:213`), producing a broken `/blogs/{handle}/{_id}` link.

**Fix:** Filter the dereferenced featured posts in GROQ (post-projection filter shown; `slug` and `publishedAt` are projected fields):

```groq
featuredPosts[]->{
  ${sanityBlogPostSummaryLightFields}
}[defined(slug) && publishedAt <= now()]
```

Apply the same guard to `blogListingQuery`'s `featuredPosts` for defense-in-depth (currently protected only by the in-memory intersection in `getBlog`).

## Warnings

### WR-01: Out-of-range `?page` renders an empty grid with an inconsistent clamped page number

**File:** `src/lib/blog/operations.ts:460-486`
**Issue:** `offset` is computed from the **unclamped** page before the fetch, but `currentPage` is clamped to `totalPages` **after** the fetch:

```ts
const offset = (page - 1) * ARTICLES_PER_PAGE   // page=999 → offset=5988
...
const currentPage = Math.min(Math.max(1, page), totalPages)  // clamped to e.g. 3
```

For `/blogs/teavision-blogs?page=999`, the GROQ slice returns `[]`, yet `paginated` reports `currentPage = totalPages` with the real `totalArticles`. `ArticleResults` skips the `EmptyState` (because `totalArticles > 0`) and renders an empty article grid while the pagination control highlights the last page as current. The old in-memory `paginateArticles` clamped *before* slicing, so this URL previously showed the last page's articles — a behavior regression between the two paths.
**Fix:** Clamp before fetching. Either fetch `totalCount` first and clamp `page`, or detect the inconsistency and recover (`if (pageArticles.length === 0 && totalArticles > 0 && page > totalPages)` → refetch with clamped offset), or treat out-of-range pages as `notFound()` at the call site for both paths consistently.

### WR-02: Featured posts beyond the first two vanish entirely from the default listing

**File:** `src/lib/blog/operations.ts:476` vs `src/lib/sanity/queries/blog.ts:175,184`
**Issue:** The query excludes **all** `featuredPosts[]._ref` from both the article page and `totalCount`, but the component layer displays only `rawFeatured.slice(0, 2)`. If an editor configures three or more featured posts, posts 3+ are excluded from the main grid *and* not rendered in the featured section — they become unreachable from the default listing (only discoverable via tag/search/sitemap). Nothing enforces a max of two in the schema. The heavy path behaves differently again: `getFeaturedArticles` renders *all* configured featured posts (no slice), so the two paths disagree.
**Fix:** Align display with exclusion — either exclude only the first two refs in GROQ (`coalesce(*[...][0].featuredPosts[0...2]._ref, [])`) or render all configured featured posts instead of slicing to 2. Pick one cap and apply it to query, component, and `getFeaturedArticles`.

### WR-03: Type assertions hide the light query's actual shape (`bodyText` does not exist at runtime)

**File:** `src/lib/blog/operations.ts:474,479` and `src/lib/sanity/types.ts:105,148-153`
**Issue:** `data.articles` is correctly typed `Omit<SanityBlogPostSummary, 'bodyText'>[]` but is immediately cast away: `data.articles as SanityBlogPostSummary[]`. The cast claims `bodyText: string | null` exists; at runtime it is `undefined`. `reshapeArticleSummary` only survives because `normalizeBodyText` happens to use optional chaining (`bodyText?.replace`) beyond its declared `string | null` contract — any future code doing `if (article.bodyText !== null) article.bodyText.length` would crash. Similarly, `SanityBlog.featuredPosts` is declared `SanityBlogPostSummary[] | null`, but `defaultBlogListingQuery` fetches featured posts with the **light** fields (no `bodyText`), so the type lies for that query too — and makes the cast at line 474 a deceptive no-op.
**Fix:** Define `type SanityBlogPostSummaryLight = Omit<SanityBlogPostSummary, 'bodyText'>`, widen `reshapeArticleSummary` to accept it (or make `bodyText` optional in the param type), give the default-listing result a `blog` variant whose `featuredPosts` uses the light type, and delete both `as` casts.

### WR-04: Reading time on the default listing always displays "1 min read"

**File:** `src/lib/blog/operations.ts:222` (with `src/lib/sanity/queries/blog.ts:127-142`)
**Issue:** The light path has no `bodyText`, so `estimateReadingTime(bodyText || excerpt)` runs on the excerpt — capped at 180 characters (~30 words), `Math.ceil(30/220)` is always 1. Every card on the default listing shows "1 min read", while the *same article* shows its real reading time on tag/search pages and the article page. The query comment calls the excerpt fallback "acceptable", but the actual behavior is a constant, wrong value rendered to users plus a cross-page inconsistency — not an approximation.
**Fix:** Add a cheap server-side estimate to the light fields, e.g. `"bodyLength": length(pt::text(body))` in `sanityBlogPostSummaryLightFields` (transfers one integer, not the body text), and estimate `Math.max(1, Math.ceil(bodyLength / 5.5 / WORDS_PER_MINUTE))` when `bodyText` is absent. Alternatively persist a word count on the document at publish time.

### WR-05: `findTagBySlug` throws an unhandled `URIError` on malformed tag slugs (request 500)

**File:** `src/lib/blog/operations.ts:288-295`
**Issue:** `decodeURIComponent(slug)` throws `URIError: URI malformed` for inputs containing invalid percent-encoding. Next.js decodes route params once, so requesting `/blogs/teavision-blogs/tagged/%25zz` delivers the param value `%zz`, and the second decode here throws — an unhandled exception that 500s the request instead of rendering `notFound()`. Internally generated slugs (`slugifyTag`) never contain `%`, but this path is attacker-reachable via crafted URLs.
**Fix:**

```ts
export function findTagBySlug(tags: string[], slug?: string): string | null {
  if (!slug) return null
  let decoded: string
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    return null // malformed slug → caller renders notFound()
  }
  return tags.find((tag) => slugifyTag(tag) === slugifyTag(decoded)) ?? null
}
```

## Info

### IN-01: `sanityFetch` is now an unused export

**File:** `src/lib/sanity/client.ts:44-49`
**Issue:** After the migration to `sanityPublishedFetch`, no code in `src/` calls `sanityFetch` (verified by repo-wide search; only the definition matches). The token-bearing `getSanityClient` is now reachable only through this dead export.
**Fix:** Remove it, or document why the token-bearing fetch path is retained (e.g. future draft/preview mode).

### IN-02: Tag deduplication is case-sensitive on one path and case-insensitive on the other

**File:** `src/lib/blog/operations.ts:305-309` vs `src/lib/blog/operations.ts:490-495`
**Issue:** The default listing builds tag navigation via `uniqueLabels` (case-insensitive dedup, first-seen casing wins); tag/search pages use `getUniqueArticleTags`, which dedupes with a plain `Set` (case-sensitive). Tags differing only by case across articles (e.g. "Tea Bag" vs "tea bag") produce different tag navs depending on which page the user is on.
**Fix:** Implement `getUniqueArticleTags` on top of `uniqueLabels` so both paths share dedup semantics.

### IN-03: Heavy `getBlog()` still executes for the default listing route via HeroSlot and metadata

**File:** `src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx:14` (→ `hero-slot.tsx:15`, `_lib/metadata.ts:24`)
**Issue:** The phase's stated goal is to avoid the heavy `blogListingQuery` (every post plus `pt::text(body)`) on the unfiltered listing, but `HeroSlot` and `generateMetadata` both still call `getBlog()` on that same route just for blog title/description/heroImage. On every cache miss the heavy query still runs alongside the new light one. Performance is out of v1 review scope, so this is informational — flagged only because it bears directly on the phase objective.
**Fix:** Add a light blog-metadata query (blog document only, no articles) for hero/metadata, or have HeroSlot reuse `getDefaultBlogListing` data on the unfiltered path.

---

_Reviewed: 2026-06-11T12:15:24Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
