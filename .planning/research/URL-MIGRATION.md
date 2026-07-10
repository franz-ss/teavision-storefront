# Research: SEO-Safe URL Migration — `/blogs/teavision-blogs` → `/blog`

**Scope:** Phase 24 (URL inventory unblock) and Phase 25 (`/blog/` canonicalization) of v1.7 SEO milestone.
**Researched:** 2026-07-10
**Confidence:** HIGH for fork API claims (verified against `node_modules/next/dist/docs`), HIGH for codebase integration points (verified by reading source), MEDIUM for the architectural recommendation (opinionated, not mandated by docs).

---

## Redirect Mechanism (fork-verified)

**Verdict: use `next.config.ts` → `redirects()`. This is unchanged and current in this fork.** Do not build a `proxy.ts` for this migration.

Verified against `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md`:

- `redirects` is an async function in `next.config.ts` returning `{ source, destination, permanent }` objects.
- `permanent: true` → **308** status (not literally 301 — Next.js deliberately uses 307/308 instead of 302/301 to preserve the HTTP method on redirect; this is the current, correct "permanent redirect" mechanism and is SEO-equivalent to a 301 for link-equity/indexing purposes). Cite this precisely when the consultant's sheet says "301" — the fork's permanent redirect is a 308, by design, not a bug.
- Wildcard matching: `source: '/old/:path*'` matches nested paths (`/old/a/b/c`), and query strings on the incoming request pass through automatically to the destination. This is exactly the mechanism the codebase already uses for `/blogs/journal/:path*` → `/blogs/teavision-blogs/:path*`.
- **Execution order** (confirmed in `03-file-conventions/proxy.md`, "Execution order" section): `headers` (next.config) → `redirects` (next.config) → Proxy → `beforeFiles` rewrites → filesystem routes → dynamic routes → `fallback` rewrites. **`redirects()` fires before the filesystem is checked**, so config-level redirects work correctly even after the old `/blogs/[blog]` route folder is deleted — there is no risk of a race or a stale route intercepting the redirect.

### Fork breaking change discovered: Middleware → Proxy

This fork's docs directory has **no `middleware.md`** — only `proxy.md`, which states: *"The `middleware` file convention is deprecated and has been renamed to `proxy`."* (Next.js 16.0.0 version history confirms: "Middleware is deprecated and renamed to Proxy.") The project has **no `middleware.ts` or `proxy.ts`** at any level (`src/` or root) — confirmed by directory search. This is relevant context but not required for Phase 25: config-level `redirects()` is the correct mechanism for deterministic, build-time-known legacy→canonical 301(308) mappings. Proxy/Middleware would only be justified for request-time conditional logic (e.g., per-header or per-cookie redirects), which this migration does not need.

### Code-shaped example (matches existing project pattern)

```ts
// next.config.ts
async redirects() {
  return [
    {
      source: '/collections/:handle/products/:productHandle',
      destination: '/products/:productHandle',
      permanent: true,
    },
    // Canonical blog listing move. Both legacy aliases collapse directly to
    // /blog — do NOT chain through /blogs/teavision-blogs (see Pitfalls).
    {
      source: '/blogs/teavision-blogs',
      destination: '/blog',
      permanent: true,
    },
    {
      source: '/blogs/teavision-blogs/:path*',
      destination: '/blog/:path*',
      permanent: true,
    },
    {
      source: '/blogs/journal',
      destination: '/blog',
      permanent: true,
    },
    {
      source: '/blogs/journal/:path*',
      destination: '/blog/:path*',
      permanent: true,
    },
    ...getPolicyRedirects(),
  ]
},
```

Also verified: `permanentRedirect()` from `next/navigation` (`04-functions/permanentRedirect.md`) issues a 308 when called inside a Server Component/Route Handler/Server Action. This is the *in-route* equivalent and is already used correctly elsewhere in the blog route tree for pagination normalization (`if (pageNumber <= 1) redirect(getBlogPath(blog))`, using the temporary `redirect()`, not `permanentRedirect()` — that's correct there since it's a canonicalization of page 1, not a permanent legacy-URL alias). For the `/blogs/teavision-blogs` → `/blog` migration specifically, use `next.config.ts` `redirects()`, not `permanentRedirect()` — it's deterministic, doesn't require rendering a route segment, and matches the existing `/blogs/journal` and policy-redirect conventions in this codebase.

---

## `/blog/` Migration Plan (canonical + sitemap + links + 301)

### Recommendation: collapse the `[blog]` dynamic segment into a literal `blog` folder

This is a **single-blog storefront**. Evidence:
- `generateStaticParams()` in every route under `blogs/[blog]/` returns only `{ blog: DEFAULT_BLOG_HANDLE }` (`'teavision-blogs'`) — never any other handle.
- `cacheComponents: true` is set in `next.config.ts`, and per your own prior finding (`project_cachecomponents_params_suspense` memory), `dynamicParams` is effectively banned under Cache Components — no handle outside `generateStaticParams()` can ever render.
- `normalizeBlogHandle()` / `LEGACY_BLOG_HANDLE` exist purely to alias the one legacy Shopify blog handle (`journal`) onto the one real handle (`teavision-blogs`).

The `[blog]` URL segment is therefore vestigial — it's a single-value dynamic param masquerading as multi-blog support that doesn't exist. The SEO-correct fix is not just an alias swap (`teavision-blogs` → `blog` as a new literal string interpolated into the same `[blog]` slot) but **restructuring the route folder to a literal `blog/` segment**, matching Next.js App Router convention (folder name = URL segment) and removing a whole class of future path-generation bugs. This also directly matches the SEO audit's own recommendation already recorded in `docs/launch/seo-url-parity-register.md` (row: *"SEO audit page 8 recommends optional simplification to `/blog/` during migration"*, currently logged as an **owner/operator handoff**, not yet app-implemented).

**If Phase 25 instead prefers a minimal-diff approach** (keep `[blog]` dynamic segment, just rename the one static param value from `teavision-blogs` to `blog`), that also works mechanically — but it preserves dead flexibility this codebase doesn't use and keeps `normalizeBlogHandle()`/`LEGACY_BLOG_HANDLE` logic around indefinitely. State this as the fallback, not the primary recommendation.

### Required route tree change

```
src/app/(storefront)/blogs/[blog]/     →   src/app/(storefront)/blog/
  page.tsx                                   page.tsx
  page/[page]/page.tsx                       page/[page]/page.tsx
  search/page.tsx                            search/page.tsx
  search/_components/results.tsx             search/_components/results.tsx
  tagged/[tag]/page.tsx                      tagged/[tag]/page.tsx
  tagged/[tag]/page/[page]/page.tsx          tagged/[tag]/page/[page]/page.tsx
  [article]/page.tsx                         [article]/page.tsx
  atom/route.ts                              atom/route.ts
  _components/*                              _components/*
  _lib/metadata.ts                           _lib/metadata.ts
```

Every `params: Promise<{ blog: string; ... }>` type loses the `blog` key (or, under the minimal-diff fallback, keeps it but `generateStaticParams` returns `'blog'` instead of `'teavision-blogs'`).

### Canonical / sitemap / internal-link consistency — already centralized, one edit point

This codebase already routes **every** blog URL through helpers in `src/lib/blog/operations.ts`:

| Helper | Used for |
|---|---|
| `getBlogPath(blogHandle)` | canonical (`_lib/metadata.ts`), sitemap (`sitemap.ts`), atom feed self-link, breadcrumb `Link href`, "Back to Tea Journal" link |
| `getArticlePath(blogHandle, articleHandle)` | article canonical, sitemap article URLs, atom entries, prev/next article links, JSON-LD `mainEntityOfPage` |
| `getTagPath(blogHandle, tag)` | tag chip links, tag-listing canonical via `getListingHref` |
| `getListingHref(...)` (`src/lib/blog/listing.ts`) | pagination canonical/hrefs |

**This means updating `getBlogPath`, `getArticlePath`, and `getTagPath` in one file makes canonical tags, `sitemap.ts`, the atom feed, and all in-app `<Link>` hrefs agree automatically** — this is the single most important integration point and the reason this migration is low-risk *if* you don't miss the two files below that bypass the helpers.

```ts
// src/lib/blog/operations.ts — literal /blog base, no handle interpolation
export function getBlogPath(): string {
  return '/blog'
}

export function getArticlePath(articleHandle: string): string {
  return `/blog/${articleHandle}`
}

export function getTagPath(tag: string): string {
  return `/blog/tagged/${slugifyTag(tag)}`
}
```

(Signature change drops the now-meaningless `blogHandle` parameter — every call site currently passes `DEFAULT_BLOG_HANDLE` or `normalizedBlog` and gets no value from it. Every call site in `_lib/metadata.ts`, `[article]/page.tsx`, `atom/route.ts`, `sitemap.ts`, `tea-journal.tsx`, `tag-filter-nav.tsx`, `article-list.tsx`, `featured-articles.tsx` needs the argument dropped. If you don't want that churn, keep the parameter but hardcode the return to `/blog` regardless of its value — functionally identical, less diff, slightly worse API clarity.)

### Two files bypass the helpers — must be updated by hand

```
src/components/layout/header/nav/data.ts   — DIRECT_LINKS: { href: '/blogs/teavision-blogs', label: 'Tea Journal' }
src/components/layout/footer/data.ts       — MAIN_MENU_LINKS: { href: '/blogs/teavision-blogs', label: 'Tea Journal' }
```

These are literal strings, not helper calls. Left unchanged, they become **internal links to a redirected URL** (see Pitfalls) — the exact defect class Phase 25 must avoid. Fix: either update the literal string to `/blog`, or (preferred, prevents recurrence) import `getBlogPath()` in both files and call it instead of hardcoding.

### Trailing slash: canonicalize on `/blog`, not `/blog/`

No `trailingSlash` config exists in `next.config.ts` (confirmed absent). Per `node_modules/next/dist/docs/.../trailingSlash.md`, **Next.js's default behavior already redirects `/blog/` → `/blog`** (trailing-slash stripping is the framework default when `trailingSlash` is unset/false). Every other route in this project (`/pages/wholesale`, `/collections/:handle`, etc.) is already trailing-slash-free.

Treat the milestone's "`/blog/`" phrasing as informal shorthand for "the `/blog` path," not a literal instruction to canonicalize with a trailing slash. **Do not** set `permanent: true` redirects, canonical tags, or sitemap entries with a trailing `/blog/` — that would either (a) rely on the framework's automatic trailing-slash redirect to silently correct it (adding an avoidable extra hop for anyone linking to `/blog/` verbatim), or (b) require `trailingSlash: true` project-wide, which is a much bigger, unrelated change affecting every route. Flag this explicitly to whoever supplies the consultant's redirect sheet — if their sheet lists `/blog/` as a destination, normalize it to `/blog` before encoding it.

---

## Article & Sub-route Handling

**Recommendation: restructure in place (rename the folder), not "keep old + add redirect to a duplicate."** All article and listing sub-routes move under the new `/blog` base, using the exact same relative shape they have today:

| Old | New |
|---|---|
| `/blogs/teavision-blogs` | `/blog` |
| `/blogs/teavision-blogs/page/2` | `/blog/page/2` |
| `/blogs/teavision-blogs/search?q=...` | `/blog/search?q=...` |
| `/blogs/teavision-blogs/tagged/chai` | `/blog/tagged/chai` |
| `/blogs/teavision-blogs/tagged/chai/page/2` | `/blog/tagged/chai/page/2` |
| `/blogs/teavision-blogs/some-article-handle` | `/blog/some-article-handle` |
| `/blogs/teavision-blogs/atom` | `/blog/atom` |

Because every sub-route is a **path segment**, not a query param, a single wildcard redirect rule covers all of them without enumerating individual articles or tags:

```ts
{ source: '/blogs/teavision-blogs/:path*', destination: '/blog/:path*', permanent: true }
```

Confirmed against `redirects.md`: `:path*` matches zero-or-more nested segments (so it covers `/tagged/chai/page/2` in one rule), and **query strings on the incoming request pass through to the destination automatically** — so `?q=` on `/blogs/teavision-blogs/search?q=oolong` correctly becomes `/blog/search?q=oolong` without a separate rule for the search route.

Do not build per-article 301 rules for this base-path change — that's only necessary for articles whose **handle/slug** is also changing (a different, content-level concern, which is what Phase 24's URL inventory and the consultant's redirect sheet are actually for). This wildcard rule handles the structural base-path move; the consultant's sheet handles any slug-level changes layered on top of it.

---

## Pitfalls & Prevention

### 1. Redirect chain: `journal` → `teavision-blogs` → `blog` (double hop)
**Risk:** The existing rule (`/blogs/journal/:path*` → `/blogs/teavision-blogs/:path*`) plus a new rule (`/blogs/teavision-blogs/:path*` → `/blog/:path*`) does **not** auto-collapse. Next.js's `redirects()` array is evaluated per-request against the incoming path; if a client requests `/blogs/journal/some-post`, it will be issued a 308 to `/blogs/teavision-blogs/some-post`, and only on the *next* request will the second rule fire, issuing a *second* 308 to `/blog/some-post`. That's a real double-redirect chain, which wastes crawl budget and (in some tools) triggers "redirect chain" SEO warnings.
**Prevention:** Rewrite the `journal` rules to point directly at `/blog`, not at `/blogs/teavision-blogs` (shown in the code example above). Never let a legacy alias redirect to another redirect's source.

### 2. Canonical/sitemap pointing at a soon-to-be-redirected URL
**Risk:** If `getBlogPath`/`getArticlePath` aren't updated in the same change as the `next.config.ts` redirects, the app will emit canonical tags, sitemap URLs, and internal `<Link>` hrefs that point at `/blogs/teavision-blogs/...` — which now 308s. Search engines treat a canonical URL that itself redirects as a signal problem (canonical should point at the final destination, not a hop).
**Prevention:** Ship the `operations.ts` helper change, the route-folder rename, and the `next.config.ts` redirects in the **same deployment**. Since canonical/sitemap/atom/internal-links are all sourced from the same helpers, this is one coordinated edit, not four separate ones — but it must land atomically (don't merge the redirect rules before the route folder exists at `/blog`, or you'll 404 all blog traffic in between).

### 3. Orphaned internal links (the two hardcoded files)
**Risk:** `header/nav/data.ts` and `footer/data.ts` hardcode `/blogs/teavision-blogs` as a literal string, bypassing `getBlogPath()`. If missed, the site's own primary nav and footer will link to a redirected URL on every single page — the most-crawled internal links on the site pointing at a 308.
**Prevention:** Explicit checklist item (see Files/Functions below). Prefer replacing the literal string with a `getBlogPath()` call to make this class of bug structurally impossible in future migrations.

### 4. Sanity-authored `canonicalPath` overrides
**Risk:** `BlogSeo.canonicalPath` (`article.seo.canonicalPath`, `blogData.seo.canonicalPath`) comes from Sanity CMS content, not code. If any article/blog document has a manually-set canonical override containing a literal `/blogs/teavision-blogs/...` string, updating `operations.ts` won't fix it — `generateListingMetadata`/`generateMetadata` prefer the CMS-supplied `canonicalPath` over the computed one when present (see `_lib/metadata.ts`: `!activeTag && currentPage === 1 && blogData.seo.canonicalPath ? blogData.seo.canonicalPath : ...`, and article `page.tsx`: `article.seo.canonicalPath ?? getArticlePath(...)`).
**Prevention:** This is a content audit, not a code change — flag it for Phase 24's URL inventory. Query Sanity for any `seo.canonicalPath` field containing `/blogs/teavision-blogs` and update or clear those fields as part of the migration, or the canonical tag will silently keep pointing at the old URL for that specific document regardless of what the code does.

### 5. Apex/www and protocol redirects — don't duplicate at the app layer
**Risk:** Adding an app-level host redirect (e.g., in `next.config.ts` or a new `proxy.ts`) for apex→www or http→https, on top of DNS/platform-level redirects, creates a chain (`teavision.com.au` → `www.teavision.com.au` → app 308 for `/blog` → ...).
**Prevention:** This is already handled correctly: `src/lib/seo/site-url.ts` normalizes `SITE_URL` to the `www` origin for canonical/sitemap/OG absolute-URL construction (defense-in-depth so metadata is always right regardless of host), while the actual host-level 301 lives at DNS/platform per `docs/launch/seo-url-parity-register.md` ("owner/operator handoff", explicitly kept out of app code). Don't add a second host-redirect layer in the app for this migration — keep host normalization exactly where it already lives.

### 6. `permanent: true` is a 308, not literally "301"
**Risk:** If the consultant's redirect sheet or a validation script asserts a literal `301` status code, it will fail against this fork's actual behavior.
**Prevention:** Document that `permanent: true` in this Next.js version issues **308** (method-preserving permanent redirect), which is the modern, correct equivalent of a 301 for SEO purposes — confirmed in the fork's own redirects.md rationale. Update any test/expectation (e.g., `src/lib/seo/launch-route-matrix.ts` already correctly encodes `expectedStatus: 308` for its existing redirect rows — follow that precedent for the new `/blog` rows, don't introduce a `301` expectation anywhere).

### 7. `dynamicParams` / Cache Components interaction if the `[blog]` segment is kept
**Risk:** If Phase 25 takes the fallback (minimal-diff, keep `[blog]` dynamic segment, just change the static param value), remember `cacheComponents: true` is set project-wide, and per prior project findings `dynamicParams` is effectively banned — `generateStaticParams()` must be the *complete* set of renderable values for every affected route (`page.tsx`, `page/[page]/page.tsx`, `search/page.tsx`, `tagged/[tag]/page.tsx`, `tagged/[tag]/page/[page]/page.tsx`, `[article]/page.tsx`). Missing an update to any one of these six `generateStaticParams()` functions when renaming the handle value will 404 that entire route tree, not fall back to SSR.
**Prevention:** This risk disappears entirely under the primary recommendation (drop the `[blog]` segment, make `blog` a literal folder) — one more reason to prefer it over the fallback.

### 8. Launch SEO route matrix doesn't currently track blog routes
**Observation (not a blocker):** `src/lib/seo/launch-route-matrix.ts` — the project's existing single source of truth for "what routes should return what status, be canonical, be in the sitemap" — has no entries for any `/blogs/*` or (future) `/blog/*` paths today. `APP_OWNED_REDIRECT_EXPECTATIONS` currently only covers the collection/product redirect. Since this file already drives an automated test suite pattern (`REDIRECT_CHECKS`, `expectedStatus: 308`), Phase 25 should add `/blog` entries here (both the new canonical listing row and the `/blogs/teavision-blogs` + `/blogs/journal` redirect rows) so the redirect/canonical/sitemap agreement this document describes is enforced by a test, not just code review.

---

## Files/Functions to Change

| File | Change |
|---|---|
| `next.config.ts` | Update `/blogs/journal` and `/blogs/journal/:path*` destinations to point directly at `/blog` / `/blog/:path*`; add `/blogs/teavision-blogs` → `/blog` and `/blogs/teavision-blogs/:path*` → `/blog/:path*` (both `permanent: true`) |
| `src/app/(storefront)/blogs/[blog]/**` | Move/rename entire folder tree to `src/app/(storefront)/blog/` (drop `[blog]` segment per primary recommendation, or rename the static param value under the fallback) |
| `src/lib/blog/operations.ts` | Update `getBlogPath`, `getArticlePath`, `getTagPath` to return `/blog`-rooted paths; drop `blogHandle` param if going with the primary recommendation; review `normalizeBlogHandle`/`LEGACY_BLOG_HANDLE` for continued relevance |
| `src/lib/blog/listing.ts` | `getListingHref` — no logic change needed, just flows through updated `getBlogPath`/`getTagPath` |
| `src/app/sitemap.ts` | No direct change required — verify it re-derives correctly once `operations.ts` is updated (it already imports `getBlogPath`/`getArticlePath`) |
| `src/app/(storefront)/blog/_lib/metadata.ts` (moved) | No canonical-logic change needed — verify `getListingHref`/`getBlogPath` calls still resolve correctly post-move |
| `src/app/(storefront)/blog/atom/route.ts` (moved) | No logic change — feed self-link derives from `getBlogPath` |
| `src/components/layout/header/nav/data.ts` | Change hardcoded `href: '/blogs/teavision-blogs'` → `/blog` (or call `getBlogPath()`) |
| `src/components/layout/footer/data.ts` | Change hardcoded `href: '/blogs/teavision-blogs'` → `/blog` (or call `getBlogPath()`) |
| `src/components/homepage/content.ts` | `blogHandle: 'teavision-blogs'` config value — remove or ignore if `blogHandle` param is dropped from helpers |
| `src/lib/seo/launch-route-matrix.ts` | Add `/blog` canonical-page expectation and `/blogs/teavision-blogs` + `/blogs/journal` redirect expectations (308) to keep the project's automated SEO checklist in sync |
| Sanity CMS content (`seo.canonicalPath` fields) | Content audit (Phase 24 inventory) — check for any article/blog documents with a manually-set canonical override containing the old path |
| Tests referencing `/blogs/teavision-blogs` | `src/lib/blog/operations.test.ts`, `src/components/blog/hero/hero.stories.tsx`, `src/components/blog/featured-articles/featured-articles.test.tsx`, `src/components/ui/article-card/article-card.test.tsx`, `src/components/ui/article-card/article-card.stories.tsx`, and the Playwright/seo-audit test touched in the "add static listing routes" commit (`seo-audit-page-html.test.mjs`) |
| `docs/launch/seo-url-parity-register.md` | Update the `/blog/` row from "owner/operator handoff, pending" to reflect the now-app-implemented redirect once Phase 25 ships |

---

## Sources

- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md` (HIGH — fork-verified, current API)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` (HIGH — fork-verified, confirms middleware→proxy rename and redirect execution order)
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/permanentRedirect.md` (HIGH — fork-verified)
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/trailingSlash.md` (HIGH — fork-verified)
- `next.config.ts`, `src/lib/blog/operations.ts`, `src/lib/blog/listing.ts`, `src/app/sitemap.ts`, `src/lib/seo/site-url.ts`, `src/lib/seo/launch-route-matrix.ts`, `src/lib/legal/policies.ts`, `src/app/robots.ts`, full `src/app/(storefront)/blogs/[blog]/**` route tree, `src/components/layout/header/nav/data.ts`, `src/components/layout/footer/data.ts`, `src/components/homepage/content.ts`, `src/components/homepage/tea-journal/tea-journal.tsx` (HIGH — direct source read)
- `docs/launch/seo-url-parity-register.md` (HIGH — existing project SEO audit record; confirms `/blog/` was already flagged by the external SEO auditor as the recommended simplification, currently unimplemented)
- `git log` / `git show` on commits `28b9f886` (add static listing routes) and `b6664834` (redirect legacy journal handle) — confirms current state has no existing `/blog` route and the journal alias is the most recent precedent for this exact redirect pattern
