# Research: Sitemap/Robots Behavior & Safe Staging URL Inventory

**Milestone:** v1.7 SEO / Migration Readiness — Phase 24
**Researched:** 2026-07-10
**Overall confidence:** HIGH (fork docs verified + full read of every relevant source/test file)

---

## Sitemap/Robots API (fork-verified)

Verified against this fork's bundled docs (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` and `robots.md`, plus `04-functions/generate-sitemaps.md`). Next 16.2.9, matches installed `package.json`.

- **`app/sitemap.ts`** exports a default function returning `MetadataRoute.Sitemap` — `Array<{ url, lastModified?, changeFrequency?, priority?, alternates?, images?, videos? }>`. Can be `async`. This fork's version-history note (v16.0.0) only changed `generateSitemaps`' `id` to a `Promise<string>` — no breaking change to the plain single-file `sitemap.ts` shape used in this repo.
- **`app/robots.ts`** exports a default function returning `MetadataRoute.Robots` — `{ rules: RuleOrRules, sitemap?: string | string[], host?: string }`.
- Both files are **special Route Handlers, cached by default** unless they use a Request-time API or dynamic config (doc: "Good to know" callout in both files). Neither of this repo's `sitemap.ts`/`robots.ts` reads request-time APIs, so both are static/cached at build — consistent with observed behavior (no per-request divergence).
- **Size/count constraint:** Google's limit is **50,000 URLs per sitemap file** (stated directly in the `generateSitemaps` doc example comment) and the well-known **50MB uncompressed** sitemaps.org limit. Splitting requires either nested `sitemap.xml` per route segment or the `generateSitemaps()` function, which produces `/…/sitemap/[id].xml` and receives `id` as `Promise<string>` in this fork (v16 change, confirmed).
- No fork-specific deviation found for either file convention — behavior matches current upstream Next.js metadata routes.

---

## Options for URL Inventory

### (a) Decouple `sitemap.ts` from `DISABLE_INDEXING`, keep per-page noindex + robots noindex
**Rejected — blocked by an existing committed regression test, not just a style preference.**

`scripts/component-contracts/noindex-mode.test.mjs` (run via `pnpm test:contracts`, part of the launch-safety contract suite) hard-asserts the *exact source pattern* in `src/app/sitemap.ts`:

```js
assert.match(
  sitemap,
  /if\s*\(\s*isNoindexModeEnabled\(\)\s*\)\s*{\s*return\s*\[\]\s*}/s,
)
```

and separately asserts `robots.ts` **never** disallows `/` (`assert.doesNotMatch(robots, /disallow:\s*['"]\/['"]/)`) — i.e. the current design *intentionally* relies on `sitemap.ts` returning `[]` as the primary noindex-mode safeguard, precisely because `robots.txt` stays permissive (`allow: '/'`) even in noindex mode. Removing or weakening the `isNoindexModeEnabled()` gate in `sitemap.ts` is a deliberate contract break the codebase's own test suite is designed to catch. Changing this invariant to unblock one consultant hand-off is disproportionate and reduces defense-in-depth for the actual production noindex-mode contract.

### (b) Separate one-off URL export reusing the same operations
**This is the right *mechanism*, but the export cannot be a bare Node script.**

`getAllProducts` (`src/lib/shopify/operations/product.ts`) and `getCollectionSummaries` (`src/lib/shopify/operations/collection.ts`) are marked `'use cache'` and call `cacheTag`/`cacheLife` from `next/cache`. Blog data (`getBlog`, `src/lib/blog/operations.ts`) is the same shape, backed by Sanity via `sanityFetch`, also `'use cache'`. These directives only compile/execute inside the Next.js server runtime (build or a running Next server) — a plain script run via `node scripts/x.mjs` outside that runtime cannot import and call them directly (confirmed by precedent: the existing `scripts/seo/probe-launch-seo.mjs` avoids this entirely by regex-parsing `launch-route-matrix.ts` source text and doing raw HTTP `fetch()` against a running base URL rather than importing the operations).

So "reuse the same operations" in practice means: **a Next.js Route Handler**, not an npm script. A route handler is part of the compiled app and can call `'use cache'` functions exactly like a Server Component.

### (c) Gated debug route
**Recommended — combine (b)'s data source with (c)'s access control.**

This repo already has a precedent for exactly this shape: `src/app/api/draft/route.ts` (Sanity preview) — a `GET` route handler gated by a server-only secret compared with `timingSafeEqual`, structured logging via `logEvent`, and explicit 401/500 error responses. Building the URL-inventory export the same way is the lowest-risk option: no changes to `sitemap.ts`/`robots.ts`/the noindex contract, and it lives under `/api/` — already disallowed for crawlers regardless of `DISABLE_INDEXING` state (`DISALLOWED_PATHS` in `robots.ts` includes `/api/` unconditionally).

---

## Recommendation

**Build a new gated Route Handler**, e.g. `src/app/api/seo/url-inventory/route.ts`, following the `src/app/api/draft/route.ts` pattern exactly:

1. **Secret gate.** Require a query param (or header) secret compared via `timingSafeEqual` against a new server-only env var (e.g. `SEO_URL_EXPORT_SECRET`, ≥32 chars, same length-floor pattern as `MIN_PREVIEW_SECRET_LENGTH` in `draft/route.ts`). Return `401` on mismatch/missing, `500` if the env var isn't configured. Log rejects/accepts via `logEvent` without leaking the secret or request body (per `docs/conventions.md` rate-limit logging rule).
2. **Data assembly**, independent of `isNoindexModeEnabled()` — this route's whole purpose is to work *regardless* of noindex mode:
   - `getLaunchSeoRouteExpectations()` (`src/lib/seo/launch-route-matrix.ts`) for all static/legal/redirect routes — already carries `expectedStatus`, `canonicalPath`, `shouldAppearInSitemap`.
   - `getAllProducts()` (`src/lib/shopify/operations/product.ts`) for every product handle + `updatedAt`.
   - `getCollectionSummaries(250)` (`src/lib/shopify/operations/collection.ts`) for every collection handle + `updatedAt`.
   - `getBlog(DEFAULT_BLOG_HANDLE)` (`src/lib/blog/operations.ts`) for blog listing + articles, reusing `getArticlePath`/`getBlogPath`/`isLocalCanonicalPath` exactly as `sitemap.ts` already does — this guarantees the export and the eventual live sitemap can never disagree on URL shape.
   - Build absolute URLs with `getSiteUrl(path)` (`src/lib/seo/site-url.ts`) so the export always reflects the **canonical production host**, not whatever host is serving the route (see host-mismatch guardrail below).
3. **Output format: CSV**, `Content-Type: text/csv; charset=utf-8`, one row per URL with columns: `url, type (static|legal|redirect|product|collection|blog|article), lastModified, shouldAppearInSitemap, shouldIndexWhenEnabled`. CSV is directly consumable in Excel/Sheets for building a 301 redirect sheet — no bespoke tooling required on the consultant's side. (A `?format=json` fallback is trivial to add if useful, but CSV should be the default deliverable.)
4. **Delivery to the consultant:** share the full URL (`https://<staging-host>/api/seo/url-inventory?secret=…`) and secret out-of-band (password manager / 1Password link), not via the site itself. Nothing is linked from any page, so there is no discovery path other than the shared URL.
5. **Response headers:** add `X-Robots-Tag: noindex, nofollow` explicitly on this route's response as defense-in-depth (belt-and-braces on top of the existing `/api/` robots.txt disallow) — this fork doesn't currently set `X-Robots-Tag` anywhere (`securityHeaders` in `src/lib/security/headers.ts` — grep confirms no existing `X-Robots-Tag` usage in `src/`).
6. **Lifecycle:** gate the whole route behind an explicit `SEO_URL_EXPORT_ENABLED` env flag (mirrors the `RATE_LIMIT_ALLOW_MEMORY_FALLBACK`-style explicit-flag convention already used elsewhere in this codebase) so it can be trivially disabled/removed once the consultant has pulled the export, rather than living indefinitely as an unauthenticated-adjacent surface.
7. **Test coverage:** add `src/app/api/seo/url-inventory/route.test.ts` under `pnpm test:integration` (same bucket as `draft/route.test.ts`), asserting: 401 on bad/missing secret, 500 on missing env config, CSV output shape, and — critically — a regression test asserting this route does **not** import or re-implement the `isNoindexModeEnabled()` gate (i.e. locking in "this route is intentionally noindex-mode-independent" the same way `noindex-mode.test.mjs` locks in that `sitemap.ts` is noindex-mode-*dependent*).

This gives the consultant a complete, accurate, production-URL-shaped inventory today, without touching the noindex contract, without waiting for cutover, and without any risk of staging appearing in a public sitemap.

---

## Keep-Staging-Unindexed Guardrails

With the recommended approach, `sitemap.ts`/`robots.ts` are **untouched** — all existing guardrails stay exactly as they are today:

| Guardrail | Current mechanism | Status after Phase 24 |
|---|---|---|
| Sitemap emptiness on staging | `sitemap.ts`: `if (isNoindexModeEnabled()) return []` | Unchanged — still locked by `noindex-mode.test.mjs` |
| No `Sitemap:` line in robots.txt on staging | `robots.ts`: omits `sitemap:` key when noindex mode on | Unchanged |
| Per-page indexing signal | `withNoindexRobots()` (`src/lib/seo/noindex.ts`) merges `{ index: false, follow: false, noarchive: true }` into every page's `Metadata['robots']`, applied in `src/app/layout.tsx` | Unchanged — this is the **actual** mechanism keeping staging out of the index (see finding below) |
| `robots.txt` crawl policy | **Important finding:** `robots.ts` does **not** disallow `/` even in noindex mode — it stays `allow: '/'`, disallowing only `DISALLOWED_PATHS` (`/api/`, `/account*`). This is intentional and test-locked (`assert.doesNotMatch(robots, /disallow:\s*['"]\/['"]/)`). Staging is **crawlable but not indexable** by design — Google can fetch pages, sees `noindex`, and drops them from the index, at the cost of some crawl budget. This is *not* a gap introduced by Phase 24; it predates this research. | Unchanged, flagged for awareness |
| New export route exposure | `/api/` already globally disallowed in `robots.ts` regardless of mode; add explicit secret gate + `X-Robots-Tag: noindex, nofollow` on the new route | New guardrail, part of Phase 24 deliverable |

**Recommendation for Phase 24 scope:** do not touch the `robots.txt` `allow: '/'` behavior — it's an existing, deliberate, tested design decision (crawl-but-noindex, not crawl-block), and changing it is out of scope for "unblock the consultant." If the team later wants staging fully uncrawlable (not just unindexed), that requires HTTP Basic Auth or a platform-level access gate (e.g. Vercel Deployment Protection / password protection) — a separate, larger decision than this phase's URL-inventory need, and no such mechanism currently exists in this repo (no `middleware.ts` found).

---

## Pitfalls

1. **Leaking staging into the index.** Not a risk from the recommended approach (route lives under `/api/`, gated by secret, `X-Robots-Tag: noindex`, and doesn't touch `sitemap.ts`). Would have been a real risk under Option (a): even though individual pages still carry `noindex` meta, publishing a real `/sitemap.xml` on a `DISABLE_INDEXING=true` deployment increases *discoverability* of every staging URL to any crawler that finds the sitemap (sitemaps are not secret — nothing stops a bot from requesting `/sitemap.xml` directly even if unlinked), which is the exact behavior the team encoded a regression test to prevent.

2. **Sitemap host mismatch vs canonical host.** `SITE_URL` (`src/lib/seo/site-url.ts`) reads `SITE_URL`/`NEXT_PUBLIC_SITE_URL` env vars and falls back to `https://www.teavision.com.au` in non-production runtime, normalizing apex → `www`. `.env.example` sets `SITE_URL=https://teavision.com.au` (apex, normalized to `www`). **If staging's env vars don't override `SITE_URL` to the actual staging host** (e.g. `teavision-storefront.vercel.app`, per `docs/launch/seo-audit-staging-analysis.md`), then any sitemap/URL export generated while running on staging will list **production** URLs (`https://www.teavision.com.au/...`), not the host actually serving the page. For the recommended export route this is *correct and desired* — the consultant wants the canonical production URL shape for redirect planning, not the ephemeral Vercel preview host. But it's worth stating explicitly in the phase so nobody "fixes" the export to use `request.url`'s host by mistake, which would reintroduce host mismatch against the real migration target.

3. **Stale `lastmod`.** `STATIC_LAST_MODIFIED = '2026-06-02'` in `sitemap.ts` is a hardcoded constant used for all static/legal/redirect-adjacent pages — it does not reflect actual last-edit dates and was clearly set once at Phase 18 SEO work and never revisited. Product/collection/article dates come from real Shopify/Sanity `updatedAt`/`publishedAt` fields and are accurate. The one-off export should carry this same constant through for static pages (for consistency with the eventual live sitemap) but the phase should flag `STATIC_LAST_MODIFIED` as increasingly stale — consider deriving it from git history or a CMS field in a future phase rather than a hand-set literal.

4. **Exceeding 50k-URL / 50MB sitemap limits.** Not a near-term concern for this catalog size (products + collections + articles + ~20 static/legal routes is far under 50,000), but the *pattern* is worth locking in now: if the export or the live sitemap ever approaches the limit, use `generateSitemaps()` (confirmed in this fork's docs, `id` now a `Promise<string>` per v16.0.0) to shard rather than hand-rolling pagination. No action needed now; note only.

---

## Files/Functions Involved

**Read/verified as ground truth for this research:**
- `src/app/sitemap.ts` — `sitemap()` default export, `STATIC_PAGES`, `getSitemapUrl`
- `src/app/robots.ts` — `robots()` default export, `DISALLOWED_PATHS`
- `src/lib/seo/noindex.ts` — `isNoindexModeEnabled`, `withNoindexRobots`, `NOINDEX_ROBOTS`
- `src/lib/env/server.ts` — `isNoindexModeEnabledFromEnv` (reads `DISABLE_INDEXING` via `truthyEnv`)
- `src/lib/seo/site-url.ts` — `SITE_URL`, `getSiteUrl`, apex→www normalization, prod-vs-non-prod fallback
- `src/lib/seo/launch-route-matrix.ts` — `getLaunchSeoRouteExpectations`, `STATIC_LAUNCH_ROUTE_EXPECTATIONS`, `LEGAL_ROUTE_EXPECTATIONS`, `REDIRECT_ROUTE_EXPECTATIONS`
- `src/lib/shopify/operations/product.ts` — `getAllProducts` (`'use cache'`)
- `src/lib/shopify/operations/collection.ts` — `getCollectionSummaries` (`'use cache'`)
- `src/lib/blog/operations.ts` — `getBlog`, `DEFAULT_BLOG_HANDLE`, `getArticlePath`, `getBlogPath`, `isLocalCanonicalPath` (Sanity-backed, `'use cache'`)
- `src/app/api/draft/route.ts` — precedent pattern for secret-gated route handler (`timingSafeEqual`, `logEvent`, error-response shape) to model the new export route on
- `scripts/component-contracts/noindex-mode.test.mjs` — the committed contract test that **blocks Option (a)**; locks `sitemap.ts`'s `if (isNoindexModeEnabled()) return []` and `robots.ts`'s `allow: '/'` behavior
- `scripts/seo/probe-launch-seo.mjs` — existing precedent for a Node-side SEO tooling script; confirms the codebase's existing pattern is regex-parsing source + raw `fetch()` against a running host, **not** importing `'use cache'` operations into a bare script — evidence for why the new export must be a route handler, not a script
- `docs/launch/analytics-and-indexing-runbook.md` — confirms `DISABLE_INDEXING=true` is the deliberate launch-environment default and documents the cutover flip
- `docs/launch/seo-audit-staging-analysis.md`, `docs/launch/seo-url-parity-register.md` — confirm staging host (`teavision-storefront.vercel.app`) and production host (`https://www.teavision.com.au`) identities for the host-mismatch pitfall
- `next.config.ts`, `src/lib/security/headers.ts` (grepped) — confirmed no existing `X-Robots-Tag` header or `middleware.ts` anywhere in the repo

**New files this phase should create:**
- `src/app/api/seo/url-inventory/route.ts` — the gated export route handler
- `src/app/api/seo/url-inventory/route.test.ts` — integration test, added to the `test:integration` script bucket
- New env var(s): `SEO_URL_EXPORT_SECRET`, `SEO_URL_EXPORT_ENABLED` (document in `.env.example`)

---

## Sources

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` (fork-bundled, HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` (fork-bundled, HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-sitemaps.md` (fork-bundled, HIGH confidence, v16.0.0 change note)
- All repository source/test files listed above (HIGH confidence, direct read)
