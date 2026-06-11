---
phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering
verified: 2026-06-11T13:00:00Z
status: gaps_found
score: 6/9 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 5/7
  gaps_closed:
    - "Default listing preserves existing behavior for all plausible CMS states (D-12) — WR-01 coalesce() guard confirmed present at blog.ts:175 and 184"
    - "Hero image blur placeholder does not crash the route on malformed LQIP data (D-12) — WR-07 Boolean(heroImage?.lqip) guard confirmed in hero.tsx:42"
  gaps_remaining:
    - "Phase 11 behavior regression: featured articles excluded from tag/search results (CR-01)"
    - "Scheduled posts leak through featuredPosts dereference on default listing (CR-02)"
  regressions:
    - "CR-01: featured-post exclusion applied unconditionally on filtered path — Phase 11 had conditional exclusion"
gaps:
  - truth: "Tag and search results include featured articles (Phase 11 behavior preserved)"
    status: failed
    reason: "CR-01 (regression from 12-REVIEW.md): Phase 12 refactor of listing-content.tsx removed the Phase 11 conditional ternary `isFiltered ? filteredArticles : filteredArticles.filter(...)`, replacing it with unconditional `filteredArticles.filter((article) => !featuredIds.has(article.id))` on the filtered path. Featured articles are now silently excluded from every tag page and every ?q= search result. A search or tag page that matches only featured articles renders EmptyState ('0 articles') even though published matching articles exist. Confirmed by diffing fafbf6a (Phase 11 final) against HEAD in listing-content.tsx:82-84."
    artifacts:
      - path: "src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx"
        issue: "Lines 82-84: `filteredArticles.filter((article) => !featuredIds.has(article.id))` — unconditional exclusion. Phase 11 (commit fafbf6a) used `isFiltered ? filteredArticles : filteredArticles.filter(...)` so featured articles appeared in filtered results."
    missing:
      - "On the filtered path, paginate filteredArticles directly without excluding featuredIds. The featuredArticles/featuredIds computation (lines 72-76) and the getFeaturedArticles import become dead code and should be removed along with this fix."
      - "Restore pre-Phase-12 semantics: featured articles are only excluded from the main article grid on the unfiltered default listing (where they appear in the FeaturedArticles section). On tag and search pages they must be included like any other article."

  - truth: "Default listing does not render scheduled or slug-less featured posts (D-12, behavior preservation)"
    status: failed
    reason: "CR-02 (new finding from 12-REVIEW.md): The featuredPosts[]->{...} dereference in defaultBlogListingQuery (blog.ts:166-168) has no post-projection filter for `defined(slug) && publishedAt <= now()`. Every article query in the same file has these guards (lines 172-174, 181-183, 188-190). The heavy getBlog() path was protected by in-memory intersection in getFeaturedArticles(); the new getDefaultBlogListing() bypasses that and does `rawFeatured.slice(0, 2).map(...)` directly. Consequences: (1) embargo leak — scheduled posts render publicly before their publish date; (2) guaranteed-404 links because blogArticleQuery requires publishedAt <= now(); (3) slug-less posts produce handle: article._id fallback links that 404."
    artifacts:
      - path: "src/lib/sanity/queries/blog.ts"
        issue: "Lines 166-168: `featuredPosts[]->{...}` — no defined(slug) or publishedAt <= now() post-projection filter. All other article queries in the file carry these guards."
      - path: "src/lib/blog/operations.ts"
        issue: "Lines 474-477: `rawFeatured.slice(0, 2).map(...)` — no publish-date or slug guard applied before rendering."
    missing:
      - "Add a post-projection filter in GROQ: `featuredPosts[]->{${sanityBlogPostSummaryLightFields}}[defined(slug) && publishedAt <= now()]` to align the light path with the publish-safety guarantees on every other article query."
human_verification:
  - test: "Open /blogs/teavision-blogs with Sanity Studio's featuredPosts field cleared or unset for the blog document"
    expected: "Article grid renders normally with latest published articles; no '0 articles' empty state. (Tests WR-01 coalesce fix — now believed fixed)"
    why_human: "Requires live Sanity + Next.js environment with real CMS data"
  - test: "Observe /blogs/teavision-blogs hero at desktop (1440px) and mobile (375px). Check LQIP blur-in and no JS error when LQIP is absent or empty string."
    expected: "Blur-in transition when LQIP is valid base64; no render crash for empty/absent LQIP. (Tests WR-07 Boolean guard — now believed fixed)"
    why_human: "Requires live browser to observe next/image placeholder rendering behavior"
  - test: "Navigate to a tag page (e.g. /blogs/teavision-blogs/tagged/matcha) and a search result (?q=matcha) where some matching articles are also in the featured posts list"
    expected: "Featured articles appear in the tag/search grid alongside non-featured articles (Phase 11 behavior). Currently BROKEN — this test should FAIL until CR-01 is fixed."
    why_human: "Requires live Sanity data with known featured + tagged overlap to produce a meaningful test"
  - test: "Configure a future-dated (publishedAt > now()) featured post in Sanity Studio; load /blogs/teavision-blogs unfiltered default listing"
    expected: "Scheduled post does NOT appear in the FeaturedArticles section. Currently BROKEN — this test should FAIL until CR-02 is fixed."
    why_human: "Requires live Sanity environment and editorial control to create a scheduled post"
---

# Phase 12: Optimize /blogs/teavision-blogs Loading and Image Rendering — Verification Report (Re-verification)

**Phase Goal:** Optimize `/blogs/teavision-blogs` loading and image rendering while preserving Phase 11 Tea Journal behavior and design.
**Verified:** 2026-06-11T13:00:00Z
**Status:** gaps_found
**Re-verification:** Yes — after gap-closure plan 12-03 (WR-01 coalesce guard + WR-07 Boolean LQIP guard)

---

## Re-Verification Summary

Previous verification (score 5/7) identified two BLOCKER gaps: WR-01 (GROQ null-propagation blanks listing when featuredPosts is unset) and WR-07 (empty-string LQIP crashes the hero render). Both were fixed by plan 12-03. However, the fresh code review (12-REVIEW.md) found two new Critical findings — CR-01 and CR-02 — introduced by the Phase 12 refactor that are not covered by the prior 7-truth set. This re-verification expands the truth set to 9 to account for them.

**WR-01 (prior blocker):** VERIFIED FIXED — `coalesce()` confirmed at blog.ts:175 and 184.
**WR-07 (prior blocker):** VERIFIED FIXED — `Boolean(heroImage?.lqip)` confirmed at hero.tsx:42.
**CR-01 (new blocker):** FAILED — featured-article exclusion on filtered path is a Phase 11 behavior regression.
**CR-02 (new blocker):** FAILED — scheduled/slug-less featured posts leak through the default listing without publish guards.

---

## Goal Achievement

### Observable Truths

The phase goal includes "preserving Phase 11 Tea Journal behavior and design." This requires that filtering/search paths work correctly (CR-01) and that content safety guarantees from the heavy path carry over to the new light path (CR-02).

| #  | Truth                                                                                              | Status             | Evidence                                                                                                                                                                                                                                    |
|----|----------------------------------------------------------------------------------------------------|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | Sanity LQIP is carried through BlogImage and wired to blur placeholders in Hero and ArticleCard (D-10) | VERIFIED           | `BlogImage.lqip?: string \| null` in operations.ts:38; `reshapeImage()` sets `lqip: asset.metadata?.lqip ?? null`; `Hero` gates placeholder/blurDataURL on `hasLqip`; `ArticleCard` uses truthy lqip check at article-card.tsx:100         |
| 2  | Sanity image URLs are bounded by use case (D-11)                                                   | VERIFIED           | `IMAGE_OPTIONS_HERO` (1920/q75), `IMAGE_OPTIONS_FEATURED_CARD` (900/q75), `IMAGE_OPTIONS_CARD` (640/q68) in operations.ts:115-117; `getSanityImageUrl()` applies `auto('format')`, `fit(fit)`, bounded width; matches next.config.ts qualities |
| 3  | Only the intended listing hero is preloaded; fallback hero and article cards do not compete (D-09) | VERIFIED           | `ListingPage` passes `preload={false}` on Suspense fallback `<Hero>` at listing-page.tsx:13; `FeaturedArticles` no longer passes `preload={index === 0}`; `ArticleCard` defaults `preload={false}`                                           |
| 4  | CDN-backed published Sanity reads are enabled with verified webhook cache invalidation (D-05,D-07,D-08) | VERIFIED       | `sanityPublishedFetch()` via `getSanityCdnClient()` (useCdn: true, perspective: 'published') in client.ts:33-59; webhook route.ts confirms `revalidateTag('blog', ...)` always fires; `cacheLife('hours')` unchanged                        |
| 5  | Default listing uses a lighter query path; tag/search pages keep getBlog() fallback (D-01,D-02,D-03) | VERIFIED         | `ListingContent` detects `isFiltered = Boolean(tag \|\| normalizedQuery)` at line 25; unfiltered path calls `getDefaultBlogListing()`; filtered path calls `getBlog()` + in-memory filtering                                               |
| 6  | Default listing renders published articles when the blog document has no featuredPosts attribute (D-12, WR-01) | VERIFIED (fixed) | `coalesce(*[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref, [])` confirmed present at blog.ts:175 and 184; zero unwrapped occurrences; matches plan 12-03 acceptance criteria                           |
| 7  | Hero image blur placeholder does not crash the route on malformed LQIP data (D-12, WR-07)         | VERIFIED (fixed)   | `const hasLqip = Boolean(heroImage?.lqip)` confirmed at hero.tsx:42; `!= null` form gone; lines 56-57 (placeholder/blurDataURL consumers) unchanged and correct                                                                            |
| 8  | Tag and search results include featured articles (Phase 11 behavior preserved)                     | FAILED (BLOCKER)   | CR-01 regression: listing-content.tsx:82-84 now uses unconditional `filteredArticles.filter((article) => !featuredIds.has(article.id))`. Phase 11 (commit fafbf6a) used `isFiltered ? filteredArticles : filteredArticles.filter(...)` — on the filtered path, featured articles were returned without exclusion. Diff of fafbf6a..HEAD confirms the ternary was dropped. |
| 9  | Default listing does not render scheduled or slug-less featured posts (D-12, behavior preservation) | FAILED (BLOCKER)  | CR-02: `featuredPosts[]->{...}` dereference at blog.ts:166-168 has no `defined(slug) && publishedAt <= now()` post-projection filter. All article queries in the file (lines 172-174, 181-183, 188-190) carry these guards. `getDefaultBlogListing()` applies `rawFeatured.slice(0, 2).map(...)` directly at operations.ts:475-477 without any publish/slug guard, bypassing the protection that `getFeaturedArticles()` provided on the heavy path. |

**Score:** 7/9 truths verified (6 previously-verified + 2 new failures from CR-01/CR-02, offset by 2 prior-gap closures)

---

### Required Artifacts

| Artifact                                                                          | Expected                                                           | Status              | Details                                                                                                                      |
|-----------------------------------------------------------------------------------|--------------------------------------------------------------------|---------------------|------------------------------------------------------------------------------------------------------------------------------|
| `src/lib/blog/operations.ts`                                                      | BlogImage.lqip, IMAGE_OPTIONS_*, getDefaultBlogListing()          | VERIFIED            | lqip at line 38; constants at 115-117; getDefaultBlogListing at 451-513                                                     |
| `src/lib/sanity/client.ts`                                                        | getSanityImageUrl() with options, sanityPublishedFetch()           | VERIFIED            | SanityImageUrlOptions at 62-67; getSanityImageUrl() at 69-91; sanityPublishedFetch() at 55-59                               |
| `src/lib/sanity/queries/blog.ts`                                                  | defaultBlogListingQuery with coalesce() guards, light fields       | VERIFIED (defect)   | Query exists; coalesce() present x2 at lines 175,184; DEFECT: featuredPosts dereference at 166-168 has no publish/slug guard |
| `src/lib/sanity/types.ts`                                                         | SanityDefaultBlogListingResult, SanityArticleTagArrays             | VERIFIED            | SanityArticleTagArrays at 137-140; SanityDefaultBlogListingResult at 148-153                                                |
| `src/components/blog/hero/hero.tsx`                                               | preload prop, Boolean LQIP guard, blur placeholder support         | VERIFIED            | preload prop at line 19; `Boolean(heroImage?.lqip)` at line 42; placeholder/blurDataURL at lines 56-57                     |
| `src/components/ui/article-card/article-card.tsx`                                 | lqip field on featuredImage type, conditional blur placeholder     | VERIFIED            | lqip at line 18; Boolean check + blur wiring at 100-101                                                                     |
| `src/components/blog/featured-articles/featured-articles.tsx`                     | No preload on featured cards                                       | VERIFIED            | No preload prop passed to ArticleCard in featured-articles.tsx                                                              |
| `src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx`                  | preload={false} on Suspense fallback Hero                          | VERIFIED            | Line 13: `<Hero preload={false} />`                                                                                         |
| `src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx`               | Dual-path gating + correct featured exclusion semantics            | STUB (defective)    | isFiltered gate at line 25 is correct. DEFECT: filtered path at lines 82-84 unconditionally excludes featured articles — a Phase 11 regression |

---

### Key Link Verification

| From                                  | To                             | Via                              | Status           | Details                                                                                          |
|---------------------------------------|--------------------------------|----------------------------------|------------------|--------------------------------------------------------------------------------------------------|
| `listing-content.tsx`                 | `getDefaultBlogListing()`      | import + conditional call        | WIRED            | Line 10 import, line 31 call on `!isFiltered` path                                              |
| `listing-content.tsx`                 | `getBlog()`                    | import + conditional call        | WIRED            | Line 9 import, line 65 call on `isFiltered` path                                               |
| `listing-content.tsx`                 | featured-article exclusion     | featuredIds filter on filtered path | NOT_WIRED (regression) | Lines 82-84 exclude featured articles unconditionally. Phase 11 conditional logic dropped. |
| `getDefaultBlogListing()`             | `defaultBlogListingQuery`      | import + sanityPublishedFetch    | WIRED            | operations.ts:7 import, line 463 fetch call                                                    |
| `defaultBlogListingQuery`             | featuredPosts publish guard    | post-projection filter           | NOT_WIRED        | blog.ts:166-168 dereferences featuredPosts with no `defined(slug) && publishedAt <= now()` filter |
| `listing-page.tsx`                    | `Hero` with `preload={false}`  | Suspense fallback                | WIRED            | Line 13: `<Hero preload={false} />`                                                             |
| `reshapeImage()`                      | `lqip: asset.metadata?.lqip`   | direct field read                | WIRED            | operations.ts:163                                                                               |
| `Hero`                                | LQIP blur placeholder          | `Boolean(heroImage?.lqip)` guard | WIRED            | Lines 42/56-57 — fixed truthy guard, correct                                                    |
| `ArticleCard`                         | LQIP blur placeholder          | truthy check → placeholder       | WIRED            | Lines 100-101 — correct Boolean check                                                          |
| `getSanityImageUrl()`                 | bounded URL                    | options param → builder chain    | WIRED            | client.ts:69-91; width/height/quality/fit applied                                              |

---

### Data-Flow Trace (Level 4)

| Artifact                  | Data Variable                        | Source                                                       | Produces Real Data                                 | Status                                                                              |
|---------------------------|--------------------------------------|--------------------------------------------------------------|----------------------------------------------------|-------------------------------------------------------------------------------------|
| `listing-content.tsx`     | `listingData` (unfiltered)           | `getDefaultBlogListing()` → `sanityPublishedFetch` → CDN     | Yes — GROQ query with DB fetch                     | FLOWING (featuredPosts unguarded — CR-02)                                           |
| `listing-content.tsx`     | `blogData` (filtered)                | `getBlog()` → `sanityPublishedFetch` → CDN                   | Yes — GROQ query with DB fetch                     | FLOWING (CR-01: featured-exclusion logic corrupts result set)                       |
| `Hero`                    | `heroImage.lqip`                     | `reshapeImage()` → `asset.metadata?.lqip`                    | Yes — Sanity asset metadata                        | FLOWING (Boolean guard now correct)                                                 |
| `ArticleCard`             | `article.featuredImage.lqip`         | `reshapeImage()` → `asset.metadata?.lqip`                    | Yes — Sanity asset metadata                        | FLOWING                                                                             |

---

### Behavioral Spot-Checks

Step 7b: SKIPPED — production build requires SITE_URL and SHOPIFY_* environment variables not available in this environment. TypeScript and compilation stages confirmed passing per SUMMARY evidence and 12-03-SUMMARY self-check (pnpm typecheck exits 0 after both fixes).

---

### Probe Execution

No probe scripts declared in PLAN frontmatter. No conventional `scripts/*/tests/probe-*.sh` files found. Step 7c: SKIPPED.

---

### Requirements Coverage

ROADMAP.md states `Requirements: TBD`. No REQUIREMENTS.md file exists in `.planning/`. Requirement traceability is not a failure gate for this phase.

---

### Anti-Patterns Found

| File                                                                                | Line(s)  | Pattern                                                                              | Severity | Impact                                                                                                          |
|-------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------|
| `src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx`                 | 82-84    | Unconditional featured-post exclusion on filtered path (Phase 11 ternary dropped)   | BLOCKER  | Featured articles invisible on every tag/search page; EmptyState shown even when featured articles match query |
| `src/lib/sanity/queries/blog.ts`                                                    | 166-168  | `featuredPosts[]->{...}` with no `defined(slug) && publishedAt <= now()` filter     | BLOCKER  | Scheduled posts leak publicly on default listing; their links 404 because blogArticleQuery requires publishedAt <= now() |
| `src/lib/blog/operations.ts`                                                        | 474-477  | `rawFeatured.slice(0, 2).map(...)` with no publish/slug guard                       | BLOCKER  | Same root as CR-02 above — ingests unguarded featuredPosts at the operation layer                               |
| `src/lib/blog/operations.ts`                                                        | 474, 479 | `as SanityBlogPostSummary[]` type assertions                                        | WARNING  | Lies about bodyText presence; `Omit<..., 'bodyText'>` cast back to full type; bodyText is undefined at runtime |
| `src/lib/blog/operations.ts`                                                        | 460-461, 484-486 | Offset computed from unclamped page before totalCount known                 | WARNING  | Out-of-range `?page=` returns empty grid while pagination claims valid page — contradictory UI                  |
| `src/lib/sanity/client.ts`                                                          | 44-49    | `sanityFetch` (token-aware) has zero callers — dead export                          | INFO     | Dead code; only the definition matches repo-wide search                                                         |

No `TBD`, `FIXME`, or `XXX` markers found in modified files.

---

### Human Verification Required

Phase 12 does not add new user interactions. Visual design must match Phase 11 Tea Journal. The following items cannot be verified programmatically without a live environment. Items 3 and 4 are expected to FAIL until the CR-01 and CR-02 gaps are fixed.

#### 1. Default listing renders correctly when blog has no configured featuredPosts

**Test:** Open `/blogs/teavision-blogs` with Sanity Studio's featuredPosts field cleared or unset for the blog document.
**Expected:** Article grid renders normally — latest published articles appear; no "0 articles" empty state.
**Why human:** Requires live Sanity + Next.js environment. WR-01 (coalesce fix) is believed fixed — this check confirms the fix in production.

#### 2. Hero renders correctly with real LQIP data and without LQIP data

**Test:** Observe `/blogs/teavision-blogs` hero at desktop (1440px) and mobile (375px). Check blur-in transition visible when LQIP is valid base64; no JS error when LQIP is absent or empty string.
**Expected:** Blur-in effect when LQIP is valid; no render crash for empty/absent LQIP.
**Why human:** Requires live browser to observe next/image placeholder behavior. WR-07 (Boolean guard) is believed fixed.

#### 3. Tag page includes featured articles matching the tag filter

**Test:** Navigate to a tag page (e.g. `/blogs/teavision-blogs/tagged/matcha`) where at least one featured article carries that tag. Verify the featured article appears in the results grid.
**Expected:** Featured articles matching the tag appear in the grid alongside non-featured articles (Phase 11 behavior).
**Why human:** Requires live Sanity data with known featured + tagged overlap. NOTE: This test is expected to FAIL until CR-01 is fixed. Do not mark Phase 12 complete until this passes.

#### 4. Default listing does not render scheduled featured posts

**Test:** Configure a future-dated (`publishedAt > now()`) article as a featuredPost in Sanity Studio; load `/blogs/teavision-blogs` unfiltered.
**Expected:** The scheduled post does NOT appear in the FeaturedArticles section.
**Why human:** Requires live Sanity environment and editorial control to create a scheduled post. NOTE: This test is expected to FAIL until CR-02 is fixed.

---

### Gaps Summary

Two new blockers were found by the 12-REVIEW.md code review (CR-01 and CR-02). The two prior blockers (WR-01, WR-07) are now closed by plan 12-03. The phase cannot be considered complete because it explicitly includes "preserving Phase 11 Tea Journal behavior and design," and both new blockers are regressions against that contract.

**Blocker 1 — CR-01: Featured articles excluded from tag and search results (Phase 11 regression):**

Phase 11 `listing-content.tsx` (commit fafbf6a) used:
```tsx
const mainArticles = isFiltered
  ? filteredArticles                                           // included featured on filtered path
  : filteredArticles.filter((article) => !featuredIds.has(article.id))
```

Phase 12 replaced this with:
```tsx
const mainArticles = filteredArticles.filter(
  (article) => !featuredIds.has(article.id),  // always excluded — regression
)
```

The filtered path renders no `FeaturedArticles` section, so featured articles are now entirely invisible on every tag page and every `?q=` search. If a user searches for a keyword that only matches featured articles, they see "0 articles." Fix: paginate `filteredArticles` directly on the filtered path without the exclusion filter, and remove the now-dead `getFeaturedArticles`/`featuredIds` computation.

**Blocker 2 — CR-02: Scheduled/unpublished featured posts appear on default listing:**

The `defaultBlogListingQuery` `featuredPosts[]->{...}` dereference (blog.ts:166-168) has no `defined(slug) && publishedAt <= now()` guard. The heavy `getBlog()` path protected against this through `getFeaturedArticles()` in-memory intersection, but `getDefaultBlogListing()` bypasses that and renders `rawFeatured.slice(0, 2)` directly. An editor featuring a scheduled post causes: (1) embargo leak — the title, excerpt, and image render publicly before the publish date; (2) guaranteed-404 card links because `blogArticleQuery` requires `publishedAt <= now()`. Fix: add `[defined(slug) && publishedAt <= now()]` as a post-projection filter in the `featuredPosts[]->{...}` projection in `defaultBlogListingQuery`.

**Advisory warnings (not blocking on the nominal default-listing path, but introduced by this phase and worth tracking):**

- WR-01 (carried from review): Out-of-range `?page=` renders an empty grid with a contradictory non-zero article count and highlighted last-page pagination (pagination inconsistency between old `paginateArticles` clamping behavior and new server-paginated path).
- WR-02: Featured posts beyond the first two vanish entirely from the default listing (different behavior from `getBlog()` path which renders all configured featured posts).
- WR-03: `as SanityBlogPostSummary[]` type assertions hide the light query's actual runtime shape (`bodyText` is `undefined` but claimed as `string | null`).
- WR-04: Reading time on the default listing always displays "1 min read" (excerpt-length fallback is a constant, not an approximation).
- WR-05: `findTagBySlug` throws unhandled `URIError` on malformed tag slugs — attacker-reachable 500.

---

_Verified: 2026-06-11T13:00:00Z_
_Verifier: Claude (gsd-verifier)_
_Re-verification: Yes — after gap-closure plan 12-03_
