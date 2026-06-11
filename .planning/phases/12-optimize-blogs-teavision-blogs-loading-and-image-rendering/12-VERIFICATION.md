---
phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering
verified: 2026-06-11T12:00:00Z
status: gaps_found
score: 5/7 must-haves verified
overrides_applied: 0
gaps:
  - truth: "Default listing preserves existing behavior for all plausible CMS states (D-12)"
    status: failed
    reason: "GROQ null-propagation (WR-01): defaultBlogListingQuery uses !(_id in *[...][0].featuredPosts[]._ref) without coalesce() on both the articles filter and totalCount. GROQ three-valued logic means !null = null, which fails the filter predicate for every article when a blog document has no featuredPosts attribute (never configured, or cleared in Studio). Result: the unfiltered listing renders an empty state with 0 articles even though published articles exist. This is a behavioral regression on the new code path absent from getBlog()."
    artifacts:
      - path: "src/lib/sanity/queries/blog.ts"
        issue: "Lines 175 and 184: !(_id in *[...][0].featuredPosts[]._ref) — missing coalesce() guard. Fix: wrap ref list in coalesce(..., []) in both places."
    missing:
      - "Apply coalesce() to featuredPosts[]._ref in both the articles filter and totalCount filter: !(_id in coalesce(*[_type == \"blog\" && slug.current == $blogHandle][0].featuredPosts[]._ref, []))"

  - truth: "Hero image blur placeholder does not crash the route on malformed LQIP data (D-12)"
    status: failed
    reason: "WR-07: hero.tsx line 42 uses heroImage?.lqip != null as the hasLqip check, which evaluates true for lqip: '' (empty string). This produces placeholder=\"blur\" with blurDataURL=\"\" on the next/image component, which throws at render time for remote images when blurDataURL is falsy. ArticleCard already uses the correct truthy check (Boolean(lqip)) at article-card.tsx:100 — the two components are inconsistent and Hero is the more critical fallback-to-crash path."
    artifacts:
      - path: "src/components/blog/hero/hero.tsx"
        issue: "Line 42: const hasLqip = heroImage?.lqip != null — unsafe for empty string lqip. Fix: const hasLqip = Boolean(heroImage?.lqip)"
    missing:
      - "Change line 42 from `heroImage?.lqip != null` to `Boolean(heroImage?.lqip)` to match the safe truthy check already used in ArticleCard"
---

# Phase 12: Optimize /blogs/teavision-blogs Loading and Image Rendering — Verification Report

**Phase Goal:** Optimize `/blogs/teavision-blogs` loading and image rendering while preserving Phase 11 Tea Journal behavior and design.
**Verified:** 2026-06-11T12:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

The phase goal resolves into seven observable truths derived from the locked decisions in 12-CONTEXT.md and 12-01-PLAN.md / 12-02-PLAN.md success criteria.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Sanity LQIP is carried through BlogImage and wired to blur placeholders in Hero and ArticleCard (D-10) | VERIFIED | `BlogImage.lqip?: string \| null` in operations.ts:38; `reshapeImage()` sets `lqip: asset.metadata?.lqip ?? null` at line 163; `Hero` uses `hasLqip` → `placeholder="blur"` / `blurDataURL`; `ArticleCard` uses truthy lqip check → same |
| 2 | Sanity image URLs are bounded by use case (D-11) | VERIFIED | `IMAGE_OPTIONS_HERO` (1920/q75), `IMAGE_OPTIONS_FEATURED_CARD` (900/q75), `IMAGE_OPTIONS_CARD` (640/q68) constants in operations.ts:115-117; `getSanityImageUrl()` in client.ts:69-91 applies `auto('format')`, `fit(fit)`, `quality(quality)`, bounded width; quality values match next.config.ts `qualities: [68, 75]` |
| 3 | Only the intended listing hero is preloaded; fallback hero and article cards do not compete (D-09) | VERIFIED | `ListingPage` passes `preload={false}` on the Suspense fallback `<Hero>` at listing-page.tsx:13; `HeroSlot` renders the real hero with default `preload={true}`; `FeaturedArticles` no longer passes `preload={index === 0}` (removed in commit 0767bf0); `ArticleCard` defaults `preload={false}` |
| 4 | CDN-backed published Sanity reads are enabled with verified webhook cache invalidation (D-05, D-07, D-08) | VERIFIED | `sanityPublishedFetch()` via `getSanityCdnClient()` (useCdn: true, perspective: 'published', stega: false) in client.ts:33-59; webhook route.ts confirms `revalidateTag('blog', { expire: 0 })` always fires, `revalidateTag('blog-${blogSlug}', ...)` fires when slug present; cache tags in getBlog()/getArticle()/getHomepageArticles() match webhook invalidation tags; `cacheLife('hours')` unchanged |
| 5 | Default listing uses a lighter query path; tag/search pages keep getBlog() fallback (D-01, D-02, D-03) | VERIFIED | `ListingContent` at listing-content.tsx:25-26 detects `isFiltered = Boolean(tag \|\| normalizedQuery)`; unfiltered path calls `getDefaultBlogListing()` with server-side pagination; filtered path calls `getBlog()` + in-memory filtering; newsletter, contact, and featured article sections preserved on both paths |
| 6 | Default listing preserves existing behavior for all plausible CMS states — safe fallback rendering (D-12) | FAILED (BLOCKER) | WR-01: `defaultBlogListingQuery` at blog.ts:175 and 184 uses `!(_id in *[...][0].featuredPosts[]._ref)` without `coalesce()`. When a blog document has `featuredPosts: null` or no `featuredPosts` attribute, GROQ evaluates `!null = null`, failing the filter for every article — blanking the unfiltered listing. The existing `getBlog()` path is unaffected because it fetches all articles without this subquery filter. This is a new behavioral regression introduced by this phase. |
| 7 | Hero image blur placeholder rendering is crash-safe for malformed LQIP data (D-12) | FAILED (BLOCKER) | WR-07: `hero.tsx:42` checks `heroImage?.lqip != null` which passes for `lqip: ''`. This produces `placeholder="blur"` with `blurDataURL=""` on the `next/image` — next/image throws at render for remote images when blurDataURL is falsy. `ArticleCard` already uses the safe `Boolean(lqip)` check (article-card.tsx:100), making the two components inconsistent. |

**Score:** 5/7 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/blog/operations.ts` | BlogImage.lqip, IMAGE_OPTIONS_*, getDefaultBlogListing() | VERIFIED | lqip at line 38; constants at 115-117; getDefaultBlogListing at 451-513; all commits on main |
| `src/lib/sanity/client.ts` | getSanityImageUrl() with options, sanityPublishedFetch() | VERIFIED | SanityImageUrlOptions at 62-67; getSanityImageUrl() at 69-91; sanityPublishedFetch() at 55-59 |
| `src/lib/sanity/queries/blog.ts` | defaultBlogListingQuery with light fields, server-side pagination | VERIFIED (with defect) | Query exists at line 153; light fields without bodyText at 127-142; server-side slice at 176; DEFECT: missing coalesce() at 175/184 |
| `src/lib/sanity/types.ts` | SanityDefaultBlogListingResult, SanityArticleTagArrays | VERIFIED | SanityArticleTagArrays at 137-140; SanityDefaultBlogListingResult at 148-153 |
| `src/components/blog/hero/hero.tsx` | preload prop, LQIP blur placeholder support | VERIFIED (with defect) | preload prop at line 19, used at 55; LQIP wired at 42/56-57; DEFECT: unsafe null check at 42 |
| `src/components/ui/article-card/article-card.tsx` | lqip field on featuredImage type, conditional blur placeholder | VERIFIED | lqip at line 18; safe Boolean check + blur wiring at 100-101 |
| `src/components/blog/featured-articles/featured-articles.tsx` | No preload on cards | VERIFIED | No preload prop passed to ArticleCard in featured-articles.tsx |
| `src/app/(storefront)/blogs/[blog]/_components/listing-page.tsx` | preload={false} on Suspense fallback Hero | VERIFIED | Line 13: `<Hero preload={false} />` |
| `src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx` | Dual-path gating: light vs getBlog() | VERIFIED | isFiltered gate at line 25; light path 29-60; filtered path 64-107 |
| `src/app/api/webhooks/sanity/route.ts` | Unknown-safe payload parsing, correct cache tags | VERIFIED | isRecord(), readSlug(), readString() helpers; revalidateTag('blog', ...) always fires; blog-slug and article-slug tags fired conditionally |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `listing-content.tsx` | `getDefaultBlogListing()` | import + conditional call | WIRED | Line 11 import, lines 31-32 call on `!isFiltered` path |
| `listing-content.tsx` | `getBlog()` | import + conditional call | WIRED | Line 9 import, line 65 call on `isFiltered` path |
| `getDefaultBlogListing()` | `defaultBlogListingQuery` | import + sanityPublishedFetch | WIRED | operations.ts:7 import, line 463 fetch call |
| `getDefaultBlogListing()` | `sanityPublishedFetch` | import + call | WIRED | operations.ts:12 import, line 463 call |
| `getBlog()` | `sanityPublishedFetch` | import + call | WIRED | operations.ts:12 import, line 393 call |
| `listing-page.tsx` | `Hero` with `preload={false}` | Suspense fallback | WIRED | Line 13: `<Hero preload={false} />` |
| `reshapeImage()` | `lqip: asset.metadata?.lqip` | direct field read | WIRED | operations.ts:163 |
| `Hero` | LQIP blur placeholder | `hasLqip` check → `placeholder`/`blurDataURL` | WIRED (defective) | Lines 42/56-57 — wired but unsafe null check |
| `ArticleCard` | LQIP blur placeholder | truthy check → `placeholder`/`blurDataURL` | WIRED | Lines 100-101 — correct Boolean check |
| `getSanityImageUrl()` | bounded URL | options param → builder chain | WIRED | client.ts:69-91; width/height/quality/fit applied |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `listing-content.tsx` | `listingData` (unfiltered) | `getDefaultBlogListing()` → `sanityPublishedFetch` → Sanity CDN | Yes — GROQ query with DB fetch | FLOWING (defect: null-propagation in GROQ filter) |
| `listing-content.tsx` | `blogData` (filtered) | `getBlog()` → `sanityPublishedFetch` → Sanity CDN | Yes — GROQ query with DB fetch | FLOWING |
| `Hero` | `heroImage.lqip` | `reshapeImage()` → `asset.metadata?.lqip` | Yes — Sanity asset metadata | FLOWING (defect: unsafe check) |
| `ArticleCard` | `article.featuredImage.lqip` | `reshapeImage()` → `asset.metadata?.lqip` | Yes — Sanity asset metadata | FLOWING |

---

### Behavioral Spot-Checks

Step 7b: SKIPPED — production build requires SITE_URL and SHOPIFY_* environment variables not available in this environment. TypeScript and compilation stages confirmed passing per SUMMARY evidence (tsc --noEmit: no errors; next build TypeScript phase: passed). No runnable entry point available for spot-checking without live credentials.

---

### Probe Execution

No probe scripts declared in PLAN frontmatter. No conventional `scripts/*/tests/probe-*.sh` files found in this repository. Step 7c: SKIPPED.

---

### Requirements Coverage

ROADMAP.md states `Requirements: TBD` and REQUIREMENTS.md was archived with the v1.0 milestone. Per verification instructions, requirement traceability is not a failure gate for this phase.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/lib/sanity/queries/blog.ts` | 175, 184 | Missing `coalesce()` on GROQ subquery ref list | BLOCKER | Null-propagation blanks entire default listing when blog has no featuredPosts |
| `src/components/blog/hero/hero.tsx` | 42 | `lqip != null` instead of `Boolean(lqip)` | BLOCKER | Empty-string LQIP produces `blurDataURL=""` → next/image render crash |
| `src/lib/blog/operations.ts` | 474-477 | No publish-date / defined-slug guard on featured posts slice | WARNING | Future-dated featured posts shown publicly on light path; scheduled posts break embargo |
| `src/lib/blog/operations.ts` | 474, 479 | `as SanityBlogPostSummary[]` type assertion | WARNING | Widens Omit type back to full type; bodyText absent at runtime; defeats type system |
| `src/lib/blog/operations.ts` | 460-461, 484-486 | Out-of-range page offset computed before totalCount known | WARNING | Out-of-range `?page=` returns empty grid while pagination claims valid page — contradictory UI |
| `src/lib/sanity/client.ts` | 33-42 | CDN client omits read token without enforcing public-dataset precondition | WARNING | If dataset becomes private, all blog reads fail with 401; no code-level fallback |
| `src/lib/sanity/client.ts` | 44-49 | `sanityFetch` (token-aware) has zero callers — dead export | INFO | Dead code; token-aware path has no escape hatch |
| `src/lib/blog/operations.ts` | 175 (via reshapeSeo) | `reshapeSeo` calls `reshapeImage(ogImage)` with no imageOptions | INFO | OG image URLs are unbounded (no width cap); contradicts D-11 goal |

No `TBD`, `FIXME`, or `XXX` markers found in modified files (confirmed via SUMMARY self-check and git log review).

---

### Human Verification Required

Phase 12 does not add new user interactions and produces no new UI surfaces. The visual design must match Phase 11 Tea Journal. These cannot be verified programmatically without a live environment.

#### 1. Default listing renders correctly when blog has no configured featuredPosts

**Test:** Open `/blogs/teavision-blogs` with Sanity Studio's featuredPosts field cleared or unset for the blog document.
**Expected:** Article grid renders normally — latest published articles appear; no "0 articles" empty state.
**Why human:** Requires live Sanity + Next.js environment. WR-01 (GROQ null-propagation) makes this path fail until the `coalesce()` fix is applied — this human check is only useful after the blocker is resolved.

#### 2. Hero renders correctly with real LQIP data and without LQIP data

**Test:** Observe `/blogs/teavision-blogs` in the browser at desktop (1440px) and mobile (375px) widths. Check that (a) the hero image shows a blurred thumbnail placeholder before full load when LQIP exists, and (b) no JavaScript error is thrown when LQIP is absent or an empty string.
**Expected:** Blur-in transition visible when lqip is a valid base64 data URL; no render crash for empty/absent lqip after WR-07 fix.
**Why human:** Requires live browser environment to observe placeholder rendering behavior. WR-07 is a crash-safety blocker; verify only after the truthy check fix is applied.

#### 3. Article card blur placeholders appear on the listing

**Test:** Load `/blogs/teavision-blogs` and observe article cards. Inspect network waterfall to confirm featured article images do not have preload `<link>` tags.
**Expected:** No `<link rel="preload">` for featured or default article card images. Hero has one `<link rel="preload">`.
**Why human:** Requires DevTools network inspection and visual observation of blur-in behavior.

#### 4. Tag and search routes still work correctly

**Test:** Navigate to a tag page (e.g. `/blogs/teavision-blogs/tagged/matcha`) and a search result (`?q=matcha`). Verify article count, tag filtering, and pagination still work.
**Expected:** Tag and search routes render correctly with in-memory filtering via `getBlog()`; featured articles not shown in filtered view (existing behavior).
**Why human:** Requires live Sanity data to produce meaningful test results.

---

### Gaps Summary

Two blockers prevent the phase goal from being fully achieved. Both were identified in the 12-REVIEW.md (WR-01, WR-07) but were not fixed before verification submission.

**Blocker 1 — WR-01 GROQ null-propagation (listing blanked with no featuredPosts):**
The `defaultBlogListingQuery` added by Plan 02 uses a subquery `!(_id in *[...][0].featuredPosts[]._ref)` to exclude featured posts from the article grid. When the blog document has no `featuredPosts` attribute (never configured, or cleared in Sanity Studio), GROQ evaluates `*[...][0].featuredPosts[]._ref` as `null`, and `!null` is `null` in GROQ three-valued logic — the filter fails for every article. This causes `articles: []` and `totalCount: 0`, rendering the empty state even when published articles exist. The existing `getBlog()` path fetches all articles without this filter and is not affected. Fix: wrap the ref list in `coalesce()` in both occurrences (`blog.ts:175` and `184`):

```groq
!(_id in coalesce(*[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref, []))
```

**Blocker 2 — WR-07 Hero LQIP empty-string crash:**
`hero.tsx:42` uses `heroImage?.lqip != null` which passes for `lqip: ''`. This produces `placeholder="blur"` with `blurDataURL=""` on the `<Image>` component. `next/image` throws at render time for remote images when `blurDataURL` is falsy, taking down the hero and the route (absent an error boundary). `ArticleCard` already uses the correct check (`Boolean(lqip)` via truthy evaluation at line 100). Fix: change line 42 to `const hasLqip = Boolean(heroImage?.lqip)`.

**Advisory warnings (not blocking phase goal on the nominal path, but introduced by this phase):**
- WR-02: Featured posts bypass the publish-date and slug guards on the light path — scheduled posts can surface early.
- WR-03: Featured posts beyond the first two vanish from the default listing (different from `getBlog()` behavior).
- WR-04: Out-of-range `?page=` renders contradictory empty grid + non-zero count.
- WR-05: Type assertions (`as SanityBlogPostSummary[]`) defeat the type system for the light path's omit shape.
- WR-06: CDN client silently drops the read token; no code-level fallback if dataset becomes private.

---

_Verified: 2026-06-11T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
