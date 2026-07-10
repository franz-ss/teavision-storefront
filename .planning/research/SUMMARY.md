# v1.7 SEO / Migration Readiness — Research Summary

**Synthesized:** 2026-07-10 (inline; synthesizer subagent hit a transient API error, orchestrator synthesized from the four research files)
**Source files:** `URL-MIGRATION.md`, `SITEMAP-INVENTORY.md`, `CRAWLABILITY-SSR.md`, `HEADINGS-STRUCTURE.md`

## Overview

Milestone v1.7 closes the remaining SEO/crawlability gaps from the external consultant's migration review. All four items are **fixes to existing, well-understood code** — no new product capabilities. Every fork-API claim below was verified against `node_modules/next/dist/docs` (this is a heavily-modified Next.js 16 fork). Confidence is HIGH across all four.

## Per-Phase Findings

### Phase 24 — Sitemap & URL-inventory unblock

- **Recommended approach:** A **new secret-gated Route Handler** at `src/app/api/seo/url-inventory/route.ts`, modeled on the existing `src/app/api/draft/route.ts` (secret compared via `timingSafeEqual`, `logEvent`, 401/500 responses). Outputs CSV (default) of every URL, reusing the exact same operations the sitemap uses so the export can never disagree with the live sitemap.
- **Why not just decouple the sitemap from `DISABLE_INDEXING`:** blocked by a committed regression test — `scripts/component-contracts/noindex-mode.test.mjs` hard-locks the exact `if (isNoindexModeEnabled()) return []` source pattern and that `robots.ts` never disallows `/`. Weakening that gate breaks a deliberate defense-in-depth contract.
- **Data sources (all `'use cache'`, must run inside Next runtime → route handler, not a bare script):** `getLaunchSeoRouteExpectations()`, `getAllProducts()`, `getCollectionSummaries(250)`, `getBlog(DEFAULT_BLOG_HANDLE)`; absolute URLs via `getSiteUrl()` (canonical production host).
- **Guardrails:** route lives under `/api/` (already robots-disallowed unconditionally) + explicit `X-Robots-Tag: noindex, nofollow` + `SEO_URL_EXPORT_SECRET` + `SEO_URL_EXPORT_ENABLED` flag for easy teardown. `sitemap.ts`/`robots.ts` untouched.
- **New files:** route + `route.test.ts` (test:integration) + `.env.example` entries.
- **Dependencies:** none upstream. **This phase unblocks the consultant's 301 sheet, which Phase 25 depends on** → do this first.

### Phase 25 — `/blog/` canonical listing migration

- **Recommended approach:** Restructure the route folder `src/app/(storefront)/blogs/[blog]/` → literal `src/app/(storefront)/blog/`, dropping the vestigial `[blog]` dynamic segment (single-blog storefront; `generateStaticParams` only ever returns `teavision-blogs`; `dynamicParams` effectively banned under `cacheComponents`). Minimal-diff fallback (keep `[blog]`, change the static param value) is possible but keeps dead flexibility — not preferred.
- **301 mechanism (fork-verified):** `next.config.ts` `redirects()` with `permanent: true` → **308** (method-preserving; SEO-equivalent to 301 — flag this to whoever validates the consultant's sheet). One wildcard rule `'/blogs/teavision-blogs/:path*' → '/blog/:path*'` covers all article/pagination/search/tagged sub-routes; query strings pass through automatically.
- **Consistency is centralized:** canonical, sitemap, atom, breadcrumb and in-app links all flow through `getBlogPath`/`getArticlePath`/`getTagPath` in `src/lib/blog/operations.ts` — updating those three is the single edit point.
- **Manual fixes (bypass the helpers):** `src/components/layout/header/nav/data.ts` and `footer/data.ts` hardcode `/blogs/teavision-blogs` → must change to `/blog` (prefer calling `getBlogPath()`).
- **Watch-outs:** (1) point the existing `/blogs/journal` rules **directly** at `/blog`, not at `/blogs/teavision-blogs`, to avoid a double-hop redirect chain. (2) Ship folder rename + helper change + redirects **atomically**. (3) Canonicalize on `/blog` not `/blog/` (framework strips trailing slash by default). (4) Audit Sanity `seo.canonicalPath` overrides for the old path. (5) Add `/blog` rows to `src/lib/seo/launch-route-matrix.ts` (expect 308) so the redirect/canonical/sitemap agreement is test-enforced.
- **Dependencies:** the base-path move is self-contained. Slug-level 301 mappings from the consultant's sheet are a **placeholder** layered on top — do not invent them; the wildcard handles the structural move.

### Phase 26 — Heading structure fixes

- **Ask (a) product accordion titles → H2:** wrap `{item.title}` in `<h2>` inside `<summary>` at `products/[handle]/page.tsx:359-370`; move typographic classes onto the `<h2>`, keep layout classes on `<summary>`, add `shrink-0` to the chevron. `<h2>` in `<summary>` is valid HTML and the recommended accessible pattern — **do not** add `role="button"`/`aria-expanded` (native `<details>` semantics already expose state).
- **Ask (b) collection story content H3/H4 → H2/H3:** the collection story and product description **currently share** the `compact` `ShopifyHtmlVariant` (`html-content.ts`). Editing `compact` in place would change the product description too. Fix = **new isolated `collectionStory` variant**: widen the type, add a `collectionStory` class map (heading sizes shifted so visual size is preserved), add `collectionStory: { h1:'h3', h2:'h3', h3:'h2', h4:'h3' }` to `SHOPIFY_HTML_HEADING_TRANSFORMS`, add `sanitizeShopifyCollectionStoryHtml()`, and swap the one call site in `page-content.tsx`. `compact` stays byte-for-byte unchanged (its existing unit test is the regression guard).
- **Note:** `RichText`'s `variant="disclosure"` is a *different* axis (wrapper spacing only) — don't conflate it with `ShopifyHtmlVariant`.
- **Files:** `html-content.ts` (+test), `page-content.tsx` (call site), product `page.tsx` (accordion), `story-disclosure.stories.tsx` (fixture drift).
- **Dependencies:** none. Fully independent, parallelizable.

### Phase 27 — Collection & product server-render shell

- **Root cause (fork-verified):** both `collections/[handle]/page.tsx` and `products/[handle]/page.tsx` `await searchParams` at the very top, which — under `cacheComponents` — forces the whole tree into one `<Suspense fallback={null}>`, so the initial static shell (H1, hero, grid) is empty for non-JS crawlers.
- **Fix (fork-prescribed "push dynamic access down"):** keep the outer component driven only by `params` (build-time, no Suspense); **hoist the already-`'use cache'` default (page-1, default-sort, no-filter) fetch above Suspense** and render H1/hero/JSON-LD/first grid rows from it into the static shell; narrow Suspense to a small `searchParams`-only leaf whose **fallback is the default render itself** (not a skeleton) so the canonical URL shows correct content with no visible swap. Product page: move the `variant` param off the server path into `ProductForm`'s own `useSearchParams()` with a local Suspense.
- **No URL/cache changes:** cache tags, `generateStaticParams`, and `RelatedProducts`/`CustomersAlsoBought` (already isolated in nested `fallback={null}`) are untouched. This is a Suspense-placement refactor only.
- **Watch-outs:** keep LCP element (gallery/H1) outside Suspense; keep `notFound()` for unknown handle in the params-only pre-Suspense portion; reserve grid `min-height` to avoid CLS on non-default query swaps; don't let a shared helper await `searchParams` from the static portion; don't worsen the separate known multiple-H1-on-soft-nav issue.
- **Files:** collection `page.tsx` + `page-content.tsx` (+ `page-helpers.ts` check), product `page.tsx`, `product-form.tsx`.
- **Dependencies:** none on other phases. The shipped blog fix (commit `28b9f886`) is the reference pattern.

## Cross-Cutting Watch-Outs

- **`permanent: true` = 308, not literal 301** — SEO-equivalent; align any validation/expectation with the 308 precedent already in `launch-route-matrix.ts`.
- **Keep staging unindexed** — do not touch `sitemap.ts`/`robots.ts` noindex behavior (test-locked). Phase 24's export route is the safe path.
- **Don't touch the shared `compact` sanitizer variant** — always add a new variant for collection-story headings.
- **Canonical / sitemap / 301 / internal-link agreement** must land atomically for the `/blog` move; centralized helpers make this one coordinated edit.
- **LCP / multiple-H1 regressions** — keep LCP elements above Suspense; verify raw `h1` count doesn't regress.

## Suggested Build Order & Dependencies

1. **Phase 24 first** — unblocks the consultant's 301 sheet (which Phase 25's slug-level redirects depend on). Self-contained.
2. **Phases 26 and 27 are independent** of 24/25 and of each other — can proceed in parallel any time.
3. **Phase 25** — the base-path move is independent, but its *slug-level* redirect mappings wait on the consultant's sheet (placeholder). Structural move can be planned/built now; final redirect rows filled when the sheet lands.

Recommended sequence: **24 → (26, 27 in parallel) → 25** (25 last so the consultant's sheet has maximum time to arrive, though its structural work isn't blocked).

## SYNTHESIS COMPLETE
