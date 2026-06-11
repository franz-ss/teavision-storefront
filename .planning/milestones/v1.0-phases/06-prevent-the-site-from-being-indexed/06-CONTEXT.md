# Phase 06: Prevent the site from being indexed - Context

**Gathered:** 2026-06-03T09:38:25+08:00
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase adds temporary crawl and indexing controls for the headless storefront while launch readiness is gated. It must prevent search engines from indexing storefront pages without permanently damaging the SEO work completed in Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Indexing Switch Model

- **D-01:** Use an environment-controlled noindex mode rather than hard-coding the site into noindex forever. The planner should pick a clear boolean environment variable and a small shared helper so launch can intentionally flip indexing back on.
- **D-02:** Default behavior should be conservative for this immediate task: when the flag is enabled, every public storefront route should opt out of indexing; when disabled, the previous SEO/canonical/sitemap behavior should be restorable without a broad rewrite.

### Metadata Enforcement

- **D-03:** Treat route metadata as the primary indexing control. Emit `robots` metadata with `index: false`, `follow: false`, and `noarchive`-equivalent behavior where Next's metadata API supports it while noindex mode is active.
- **D-04:** Apply the metadata decision globally or through a shared metadata helper so homepage, products, collections, Shopify pages, custom pages, blog listings, blog articles, cart, search, and not-found behavior cannot drift.
- **D-05:** Preserve existing route-specific SEO metadata, canonicals, Open Graph data, and Sanity/Shopify noindex behavior; Phase 6 should layer temporary robots directives on top, not delete useful launch SEO work.

### Robots Strictness

- **D-06:** Do not rely on `robots.txt` disallow rules as the only indexing protection. Google needs to be able to crawl pages to see `noindex`, so blocking all HTML routes in robots can make deindexing less reliable.
- **D-07:** Keep the existing `/api/` disallow behavior. The planner may suppress sitemap references or add narrow crawler directives, but must not choose a blanket `Disallow: /` if the implementation also depends on page-level `noindex` being discovered.
- **D-08:** The roadmap success criterion that says "root robots surface disallows crawling for all user agents" should be interpreted through this discussion: the intent is preventing indexing, not making `noindex` invisible to crawlers.

### Sitemap Behavior

- **D-09:** While noindex mode is active, the sitemap should not invite indexing. Prefer returning an empty sitemap or no indexable storefront URLs over keeping the full product/collection/blog sitemap.
- **D-10:** When noindex mode is disabled, the sitemap should return to the Phase 5 behavior: static pages, products, collections, blog listings, canonical articles, and tags with durable `lastModified` values.

### Verification Expectations

- **D-11:** Verification should inspect built output or live local responses for `/robots.txt`, `/sitemap.xml`, and representative HTML metadata across homepage, product, collection, Shopify page, blog article, search, and cart.
- **D-12:** Run `pnpm lint` and `pnpm build` before claiming implementation complete. No new Storybook story is expected unless the implementation unexpectedly creates a UI component.

### the agent's Discretion

- The planner may decide whether the shared noindex helper lives under `src/lib/seo/`, route-local `_lib/`, or another existing SEO utility location, as long as it follows project conventions and avoids broad duplication.
- The planner may decide the exact environment variable name, but it should be explicit, documented in the plan, and not require Shopify credentials to evaluate.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning

- `.planning/ROADMAP.md` - Phase 6 goal, success criteria, and sequencing after Phase 5 SEO remediation.
- `.planning/PROJECT.md` - project constraints, Shopify source-of-truth decisions, and app architecture context.
- `.planning/REQUIREMENTS.md` - prior SEO and sitemap requirements, especially `AUDIT-03` and `AUDIT-09`.
- `.planning/phases/05-codebase-review-remediation/05-CONTEXT.md` - Phase 5 decisions about metadata, sitemap hygiene, JSON-LD safety, and Next 16 doc requirements.

### Local Codebase Maps

- `.planning/codebase/ARCHITECTURE.md` - App Router route layer, metadata entry points, and data flow.
- `.planning/codebase/CONCERNS.md` - fragile Next 16 API notes and SEO/product-page safety considerations.
- `.planning/codebase/TESTING.md` - lint/build verification expectations and absence of an app-wide test runner.
- `docs/conventions.md` - folder map and project conventions for new helpers.

### Next.js 16 Local Docs

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` - `app/robots.ts` file convention and `MetadataRoute.Robots` output.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` - `app/sitemap.ts` file convention and `MetadataRoute.Sitemap` output.
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` - static/generated metadata behavior and file-based metadata overview.

### External Search Guidance

- `https://developers.google.com/search/docs/crawling-indexing/block-indexing` - Google Search Central guidance that `noindex` must be visible to crawlers.
- `https://developers.google.com/search/docs/crawling-indexing/robots/intro` - Google Search Central robots.txt behavior and limits.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/app/robots.ts`: current robots route allows `/`, disallows `/api/`, and references `/sitemap.xml`.
- `src/app/sitemap.ts`: current sitemap returns static pages plus products, collections, blog listing, canonical articles, and tag pages.
- `src/app/layout.tsx`: root metadata defines `metadataBase`, title defaults, Open Graph, and Twitter metadata; it currently has no global robots directive.
- `src/app/(storefront)/blogs/[blog]/_lib/metadata.ts`: existing route metadata already conditionally emits `robots` for noindex blog listings/search states.
- `src/app/(storefront)/blogs/[blog]/[article]/page.tsx`: article metadata already uses article-level `seo.noIndex`.
- `src/app/(storefront)/search/page.tsx`: search route already emits `robots: { index: false }`.

### Established Patterns

- Route metadata is generated in Server Components or route files using `Metadata` from `next`.
- Dynamic route props use the Next 16 `params: Promise<...>` pattern and must be awaited before use.
- SEO-critical JSON-LD now uses `src/lib/seo/serialize-inline-json.ts`; keep SEO helper work under `src/lib/seo/` when it becomes shared.
- Source code lives under `src/`; do not recreate root-level `app/`, `components/`, or `lib/`.

### Integration Points

- Root metadata: `src/app/layout.tsx`.
- Robots file convention: `src/app/robots.ts`.
- Sitemap file convention: `src/app/sitemap.ts`.
- Representative route metadata: homepage, products, collections, Shopify pages, custom pages, blog listings/articles, cart, and search under `src/app/(storefront)/`.

</code_context>

<specifics>
## Specific Ideas

- Lock all four recommendations from the discussion: env flag, metadata-first noindex, robots that do not hide noindex from crawlers, and sitemap suppression while noindex mode is active.
- The implementation should be temporary and easy to reverse at launch.
- Avoid deleting useful SEO metadata; layer temporary noindex controls over it.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

_Phase: 06-prevent-the-site-from-being-indexed_
_Context gathered: 2026-06-03T09:38:25+08:00_
