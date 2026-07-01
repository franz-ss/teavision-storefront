# SEO Audit PDF — Full Codebase Compliance Audit

**Source document:** `SEO Audit - Teavision Staging Site.pdf` (16 pages, external SEO consultant)
**Audited artifact:** the consultant tested the **stale** staging deploy `teavision-storefront.vercel.app` (Rich Results crawl 24 Jun 2026, PSI 25 Jun 2026 — a build predating Phase 18/19/20).
**This audit:** current codebase at repo HEAD `1b4630be` (v1.5 milestone closed), **2026-07-01**.
**Method:** every PDF page + screenshot reviewed visually and via extracted text; every requirement re-verified against current code with `file:line` evidence by a 7-theme verification pass plus an independent adversarial re-check (14 agents, 0 findings refuted). Cross-checked by hand against the headline files.
**Fixes applied in this pass:** **none — this is an audit-only pass.** Every "Fix applied" cell reads `None (audit-only)`. See the remediation plan for what to implement next.

Related prior docs: [seo-audit-staging-analysis.md](seo-audit-staging-analysis.md) · [seo-audit-pages-2-9-response.md](seo-audit-pages-2-9-response.md) · [seo-audit-remediation.md](seo-audit-remediation.md) · [seo-url-parity-register.md](seo-url-parity-register.md) · [homepage-performance-fixes.md](homepage-performance-fixes.md)

---

## 1. High-level summary of overall codebase condition

The storefront is in **strong SEO health**. Of the consultant's ~20 discrete points, the large majority were **already fixed** in Phase 18–20 (the consultant audited a pre-fix staging build) or are **false negatives** (they tested only `/` and one blog-tag page). Verified against current code:

- **Already compliant / fixed:** `lang="en-AU"`; brand-suffix removed on home/collection/service titles (product keeps it, as requested); canonical + sitemap + robots all on `www` host; robots disallows `/account*` + login; blog-tag pages `noindex` and excluded from the sitemap; read-more below the grid; collection/product pages are **server-rendered** (the "CSR/skeleton" claim is stale — commit `308f470e` removed the skeleton fallback); Service / LocalBusiness / FAQ / Review schema all present on their own templates; nested-product and legacy-policy 301s wired.
- **Two literal consultant requests are deliberately NOT met (documented owner decision D-08, accept-risk):** (1) multiple/per-visit-changing H1s from `cacheComponents` React `<Activity>` route retention; (2) banner-mode collection pages expose only an 11px mono breadcrumb crumb as their `<h1>` instead of a displayed heading. Both are intentional and test-guarded; see Critical Issues.
- **Genuinely open (non-decision) items:** apex→www **301 redirect** (Vercel infra, not code); per-page production `noindex` on `/account` auth routes (defence-in-depth — `withNoindexRobots` is a no-op unless `DISABLE_INDEXING=true`); migration slug-parity 301s pending owner export; blog `/blog/` slug deferred; schema enrichment (LocalBusiness geo/hours, Organization sameAs/logo, Product Offer fields).
- **Fixed in this engagement (2026-07-01):** header interactive islands (mobile nav + search overlay/autocomplete) are now `next/dynamic({ssr:false})` and load on open — initial JS dropped ~12 KiB raw / ~3.6 KiB gzip on every route; verified live. See PDF-16 row.
- **Correction to prior draft (2026-07-01):** the "add `browserslist`" recommendation was withdrawn after verifying the fork's build logic. `getSupportedBrowsers` ([node_modules/next/dist/build/get-supported-browsers.js:31-35](../../node_modules/next/dist/build/get-supported-browsers.js)) falls back to `MODERN_BROWSERSLIST_TARGET` = `['chrome 111','edge 111','firefox 111','safari 16.4']` when no config is present, so the app's JS is **already** compiled to modern targets by default; adding a matching `browserslist` is a no-op and a broader one would ship *more* legacy JS. The audit's "legacy JS ~14 KiB" was fully neutralised by gating the Sentry chunk, not partially.
- **Misleading staging metrics:** the audit's **SEO 61** is the `DISABLE_INDEXING` staging artifact; the **LCP 3.5s** is a Lighthouse Lantern lab artifact — post-fix production PSI measured **Perf 95, Speed Index 1.9s, TBT 30ms, CLS 0**.

**Overall compliance: ~85% fully compliant, ~10% compliant-by-documented-decision, ~5% open (mostly infra/owner-gated).** No code defect threatens indexation or rankings. The single most consequential product decision to revisit is the banner-mode displayed H1 (SEO value on top-of-funnel category pages).

---

## 2. Comprehensive audit table

Status labels: **Fixed · Partially fixed · Not fixed · Needs investigation · Blocked · Compliant · Not compliant.** Priority: Critical/High/Medium/Low/None. Fix applied is `None (audit-only)` for every row (no code changed this pass).

| PDF pg | Requirement / screenshot | Related file / module | Area | Issue or task | Current status | Compliance | What needs to be done | Fix applied | Remaining work | Priority | Risk / impact | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | URL scheme `/collections/<name>`, `/products/<name>`, `/pages/<name>` is fine | `src/app/(storefront)/collections/[handle]/`, `/products/[handle]/`, `/pages/[...slug]/` | Routing | Confirm endorsed URL shapes exist | Compliant | Compliant | None | None (audit-only) | None | None | None | Route tree matches; `/pages` served by explicit routes + `[...slug]` catch-all w/ `RESERVED_HANDLES` guard |
| 1 | Verify slugs intact after migration; 301 changed slugs | `next.config.ts:15`, `seo-url-parity-register.md` | URL parity | No per-slug 301 map beyond nested-product/policy; needs owner migration export | Needs investigation | Partially compliant | Obtain sanitized owner/SEO slug export; add two-source-confirmed 301s; crawl after cutover | None (audit-only) | Owner export + any 301s at migration | Medium | If slugs changed and no export supplied, changed URLs 404 and lose link equity | Correctly gated on owner data (app can't invent mappings); tracked as Open in register |
| 1 | (bonus) Legacy Shopify nested product path | `next.config.ts:18-20` | Redirects | `/collections/:h/products/:p` → `/products/:p` | Fixed | Compliant | None | None (audit-only) | Verify on prod host post-cutover | None | None | `permanent:true` emits HTTP 308 (permanent, preserves equity for GET) |
| 1 | (bonus) Legacy policy URLs | `src/lib/legal/policies.ts:131`, `next.config.ts:22` | Redirects | `/policies/*` + `/7868339/policies/*.html` → canonical policy pages | Fixed | Compliant | None | None (audit-only) | None | None | None | `getPolicyRedirects()` spread into `redirects()` |
| 2,3,6,7 | Multiple / per-visit-changing H1s on collection & product pages (heading inspector accumulates H1s from other pages; p7: same URL → "Aussie Chai" then "Aniseed Whole") | `next.config.ts:9`, `tests/e2e/h1-correctness.spec.ts`, `seo-audit-pages-2-9-response.md` | H1 / Cache Components | `cacheComponents:true` keeps ≤3 prior routes in hidden `<Activity display:none>`; their `<h1>`s persist in the live DOM during SPA soft-nav | Not compliant | Not compliant (by documented decision) | Decide: keep accept-risk (documented) OR add mitigation (cap retained routes / make hidden subtrees inert). No runtime mitigation exists today | None (audit-only) | Owner decision; optional mitigation | Low (true SEO) / Medium (optics) | Googlebot renders each URL statelessly (no soft-nav) → sees 1 H1; a11y tree excludes `display:none`. Real cost = recurring auditor confusion + the p7 "smoking gun" credibility liability | Per-route single-H1 invariant enforced by `h1-correctness.spec.ts:44-45` + `page-content.test.tsx:500` |
| 2,5 | Banner/main-category collections don't visibly display the H1; "display the H1" + brief intro above the grid | `src/app/(storefront)/collections/[handle]/_components/hero.tsx:65-70` | H1 / banner mode | Banner mode's only `<h1>` is the breadcrumb crumb styled `type-mono-meta text-gold-deep` (11px mono), inline in the `<nav>`; no displayed heading, no intro paragraph | Not compliant | Not compliant (by documented decision) | D-08 keeps it compact; if SEO pushes back, re-enable the reverted visible H1+intro (existed in `41753db2`, reverted `48193d0d`), sized tastefully | None (audit-only) | Owner design decision | Medium | Crumb IS a real indexable user-visible `<h1>` (not black-hat as consultant claims), but 11px gives the primary keyword little prominence and forgoes topical intro copy on top-of-funnel pages; banner title is an `<img>` (not crawlable text) | `page-content.test.tsx:504` locks the crumb markup |
| 4 | "Read more" content should be BELOW the product grid | `page-content.tsx:302-311` | Content order | Read-more placement | Fixed | Compliant | None | None (audit-only) | None | None | None | `StoryDisclosure` renders after `ProductList` (grid 262-300); locked by `page-content.test.tsx:512-515` |
| 5 | Above grid: Banner (optional) + H1 + brief intro + breadcrumb | `hero.tsx:24-76` | Layout | Banner mode has banner + crumb-H1 + breadcrumb but no displayed heading and no intro paragraph | Partially fixed | Partially compliant | Add a short visible intro to banner mode; promote a displayed heading (ties to banner-H1 decision) | None (audit-only) | Owner design decision | Medium | Structure ~right; the H1 prominence + intro are the gap | Green-band & rich-hero variants already do this |
| 6 | Black Teas (green-band) is the GOOD example: large visible H1 + intro + breadcrumb | `hero.tsx:127-140`, `collection-rich-hero.tsx:22-29` | H1 / green-band | Non-banner variants render a large visible single H1 + intro | Compliant | Compliant | None | None (audit-only) | None | None | None | `text-[clamp(2.4rem,5vw,4rem)]` display H1 + intro `<p>` |
| 6,7 | Product pages: one stable H1 = product title | `products/[handle]/page.tsx:317`, `tests/e2e/h1-correctness.spec.ts:29` | H1 / product | Per-route the PDP renders exactly one `<h1>`; breadcrumb current item is a `<span>` | Compliant | Compliant | None (p7 symptom is the shared Activity issue) | None (audit-only) | None | None | Fresh crawl sees only "Aussie Chai" | Single-H1 e2e assertion at line 45 |
| 8 | Simplify blog listing slug `/blogs/teavision-blogs/` → `/blog/` (+301) at migration | `src/lib/blog/operations.ts:252`, register | Blog slug | No `/blog` route/redirect; `getBlogPath` returns `/blogs/<handle>` | Not fixed | Not compliant | Deferred per decision 18-03; if owner opts in, add `/blog` route/redirect + 301 + repoint `getBlogPath` consumers | None (audit-only) | Owner/SEO decision at migration | Low | Current URLs work + internally consistent; deferring costs only a longer URL. If adopted later, MUST ship 301s | Tracked Open in register :71 |
| 8,9 | Remove auto `\| Teavision` suffix from Home / Collection / Service titles | `layout.tsx:47`, `page.tsx:35`, `collections/[handle]/page.tsx:46`, service pages `title:{absolute}` | Metadata / title | Suffix overflow on SEO-target pages | Fixed | Compliant | None | None (audit-only) | None | None | None | Template `%s \| Teavision`; home/collection/category + all named service pages use `title:{absolute}` |
| 8 | Product pages MAY keep the suffix | `products/[handle]/page.tsx:114` | Metadata / title | Product retains suffix | Compliant | Compliant | None | None (audit-only) | None | None | None | Plain-string `title: product.title` → template appends ` \| Teavision` |
| 8,9 | (edge) Generic CMS `/pages/[...slug]` inherits the suffix | `pages/[...slug]/page.tsx:68,72` | Metadata / title | Catch-all uses plain title, not absolute | Compliant | Partially compliant | Optional: switch to `title:{absolute}` if a CMS page becomes a pixel-sensitive SEO target | None (audit-only) | Optional | Low | Arbitrary CMS pages, not audit's named targets; long titles could truncate in SERP | Diverges from the absolute pattern used elsewhere |
| 9 | Meta descriptions intact (no action) | `page.tsx:36`, `collections/[handle]/page.tsx:32`, `products/[handle]/page.tsx:110` | Metadata / desc | Descriptions present + truncated | Compliant | Compliant | None | None (audit-only) | None | None | None | `truncateMetaDescription` + fallbacks; product sliced to 160 |
| 9 | Internal linking present (You Might Like / Related Products) | `related-products.tsx`, `customers-also-bought.tsx`, `sidebar.tsx:47` | Internal linking | Related-content blocks render | Compliant | Compliant | None | None (audit-only) | None | None | None | RelatedProducts + CustomersAlsoBought on PDP; "You Might Like" collection sidebar |
| 9,10 | `<html lang>` should be `en-AU` (view-source showed `en`) | `layout.tsx:68` | Metadata / lang | Root lang value | Fixed | Compliant | None | None (audit-only) | None | None | None | `<html lang="en-AU">`; `og:locale=en_AU` |
| 10 | (edge) `global-error.tsx` renders own `<html lang="en">` | `src/app/global-error.tsx:19` | Metadata / lang | Root error boundary hardcodes `en` | Not fixed | Not compliant | Change to `lang="en-AU"` for consistency | None (audit-only) | 1-line change | Low | Shown only on catastrophic render failure; no indexable content; not an audited page | `not-found.tsx` correctly inherits `en-AU` |
| 10 | Serve/redirect strongest `https+www`; redirect all variations (apex→www, http→https) with 301 | `src/lib/seo/site-url.ts:8-10`; **no** `middleware.ts`/`vercel.json` | Host redirect | Canonical host forced to www in code, but **no 301 redirect** for the apex/other hosts | Not fixed | Not compliant | Configure apex→www 301 in **Vercel** domain settings (www primary, redirect apex); do NOT add a `middleware`/`next.config` host rule (would break `*.vercel.app` previews) | None (audit-only) | Vercel infra + post-deploy verify | Medium | Canonical mitigates, but without a hard 301 the apex can resolve 200 → duplicate-host crawling / equity dilution | The one consultant item code genuinely cannot satisfy |
| 10 | Canonical host = www everywhere | `site-url.ts:9`, `layout.tsx:45` | Canonical | `normalizeSiteOrigin` forces apex→www; `metadataBase=SITE_URL` | Fixed | Compliant | None | None (audit-only) | None | None | Low | All canonicals/OG/sitemap on www; prod throws if `SITE_URL` unset (fail-fast) | — |
| 10,11 | robots.txt Sitemap should use strongest (www) host | `src/app/robots.ts:28` | robots.txt | Sitemap directive `${SITE_URL}/sitemap.xml` → www | Fixed | Compliant | None | None (audit-only) | None | None | Low | Consultant screenshot showed apex sitemap (stale build) | — |
| 10 | robots.txt: disallow Login & Account URLs | `src/app/robots.ts:6-13` | robots.txt | Disallows `/api/`, `/account`, `/account/`, `/account/login`, `/account/callback`, `/account/logout` | Fixed | Partially compliant | Optionally simplify to `['/api/','/account']` (prefix covers register/recover/reset/activate) | None (audit-only) | Optional | Low | `/account` bare prefix covers auth sub-paths for most crawlers | register/recover/reset/activate not enumerated (rely on prefix) |
| 10 | Defence-in-depth: per-page `noindex` on account/auth routes | `account/login/page.tsx` (no metadata), `account/*`, `src/lib/seo/noindex.ts:18-27` | Robots / noindex | `withNoindexRobots` is a **no-op unless `DISABLE_INDEXING=true`** → account pages carry **no production noindex**; login/register/recover/reset/activate export no metadata | Not fixed | Not compliant | Add `robots:{index:false,follow:true}` to account auth pages + `account/layout.tsx` so the tree stays noindex in production even if robots.txt is bypassed | None (audit-only) | Add explicit `index:false` metadata | Medium | robots.txt blocks crawling but not indexing of link-discovered URLs; bare `/account/register` could surface | The 4 account pages calling `withNoindexRobots` get no prod directive today |
| 11 | Canonical tags intact | `layout.tsx:45`, `page.tsx:42`, blog `metadata.ts:65` | Canonical | Self-referencing canonicals on www | Compliant | Compliant | None | None (audit-only) | None | None | Low | Relative canonicals resolve against `metadataBase` (www) | — |
| 11 | Blog TAG pages should be `noindex` (avoid cannibalising blog listing) | `blogs/[blog]/_lib/metadata.ts:45-68` | Blog tag noindex | `noIndex = seo.noIndex \|\| activeTag \|\| q` → `robots:{index:false, follow:!noIndex}` | Fixed | Compliant | None | None (audit-only) | None | None | Low | Preserves link crawlability while de-indexing tag/search variants | — |
| 11 | Blog tag pages not in sitemap | `src/app/sitemap.ts:75-92` | Sitemap | Sitemap emits base listing + articles only; no tag routes | Fixed | Compliant | None | None (audit-only) | None | None | Low | grep `/tagged` in sitemap.ts → 0 matches | — |
| 11 | Staging must not leak into index | `robots.ts:22-24`, `sitemap.ts:35-37`, `noindex.ts:8-27` | Staging noindex | `DISABLE_INDEXING` forces site-wide `noindex,nofollow,noarchive` + drops sitemap | Compliant | Compliant | Keep `DISABLE_INDEXING=true` on staging, unset in prod | None (audit-only) | Operational env posture | None | Correctly isolates staging | — |
| 12 | Organisation schema present | `src/components/homepage/content.ts:75-87`, `page.tsx:48-53` | Schema / Organization | Present but thin | Compliant | Compliant | Enrich: `sameAs` (4 social links exist in contact `page-data.ts`), `foundingDate`, `@id`, real logo (currently `favicon.ico`) | None (audit-only) | Optional enrichment | Low | 16×16 favicon logo may be rejected under Google logo guidelines; weaker entity signals | Homepage-only by design; no layout emits JSON-LD |
| 12 | Product schema present; Reviews "not present" | `products/[handle]/page.tsx:181-203`, gate `:59-78` | Schema / Product+Review | Product+Offer present; AggregateRating gated on real Trustoo data | Compliant | Compliant | Consultant "Reviews missing" is a FALSE NEGATIVE (tested homepage). Enrich Offer: `priceValidUntil`, `itemCondition`, shipping/return | None (audit-only) | Optional Offer enrichment | Medium | No-review products correctly omit rating (avoids Google violation); missing Offer fields can suppress Merchant rich results | Gate: `rating>0 && <=5 && Integer reviewCount>0` |
| 12 | Service schema "not present, need to add" | `pages/{custom-tea-blends,tea-bag-manufacturer,private-label-packing,bulk-wholesale-supply}/_components/json-ld.tsx` | Schema / Service | FALSE NEGATIVE — Service present on 4 service pages | Compliant | Compliant | Tell consultant to validate the service URLs, not `/`. Optional: `serviceType`, provider `@id` | None (audit-only) | Optional enrichment | Low | Not on homepage (what consultant tested) | provider is inline stub, not `@id` ref |
| 12 | Local Business schema "not present, need to add" | `pages/contact/_components/json-ld.tsx:56-63` | Schema / LocalBusiness | Present on `/pages/contact` (name/url/tel/email/PostalAddress) but incomplete | Partially fixed | Partially compliant | Add `geo` GeoCoordinates + `openingHoursSpecification`; `@id` unify with Organization; confirm NAP w/ owner | None (audit-only) | Add geo + hours; unify `@id` | Medium | Missing geo/hours are the two fields Google most wants for local rich results / map eligibility | Address = 29 Palladium Circuit, Clyde North VIC 3978 (not Melbourne) |
| 12 | Reviews schema "not present, need to add" | `products/[handle]/page.tsx:196-202` | Schema / Review | FALSE NEGATIVE — AggregateRating on PDPs with real data | Compliant | Compliant | Validate a PDP with reviews, not `/`. Optional: per-review `Review` nodes | None (audit-only) | Optional | Low | Correctly conditional | — |
| 12 | FAQs schema "not present, need to add" | `pages/{faq,bulk-wholesale-supply,how-long-does-bulk-tea-last}/_components/json-ld.tsx` | Schema / FAQPage | FALSE NEGATIVE — FAQPage on 3 pages | Compliant | Compliant | Validate `/pages/faq` etc., not `/`. Homepage FAQ intentionally emits no FAQPage (defensible post-2023 Google FAQ policy) | None (audit-only) | None required | Low | — | — |
| 12 | (bonus) Breadcrumb/CollectionPage/WebPage schema | `products/page.tsx:205`, `collections/[handle]/_components/json-ld.tsx`, contact/[...slug] json-ld | Schema / Breadcrumb | Present broadly across templates | Compliant | Compliant | None | None (audit-only) | None | None | None | Strengthens the false-negative rebuttal; `serializeInlineJson` escapes `<`→`<` (XSS-safe) |
| 13 | Rich Results (homepage) = "1 valid item: Organization" | `content.ts:75`, per-route schema | Rich results | Organization-only on homepage is by design | Compliant | Compliant | None | None (audit-only) | Optional: re-run Rich Results on prod www | None | None | Product/Breadcrumb on PDP, CollectionPage/ItemList on collections |
| 13 | CSR issue on collection/product; use SSR | `collections/[handle]/page.tsx:65-71`, `products/[handle]/page.tsx:440-448` | SSR / crawlability | Both routes are async Server Components; `Suspense fallback={null}`; no route `loading.tsx` | Fixed | Compliant | None (claim is stale) | None (audit-only) | Optional: refresh consultant evidence on prod | None | None | H1, `id="product-grid"`, "Add to Cart", JSON-LD all in first byte stream |
| 14 | Skeleton-only screenshots (CSR evidence) | commit `308f470e`, `page.tsx` Suspense | SSR / skeleton | Skeleton fallback removed (`308f470e` "keep SEO route content after hydration") | Fixed | Compliant | None | None (audit-only) | None | None | None | Only `loading.tsx` is scoped to `/account`; verified via `git show` |
| 14 | (evidence) Crawlable-HTML probe / CI guard | `scripts/seo/probe-crawlable-html.mjs`, `scripts/component-contracts/collection-page.test.mjs`, `package.json:11` | CI / evidence | Source-level contract test in CI (`pnpm test:contracts`) locks SSR; byte-stream probe is manual | Compliant | Partially compliant | Optional: wire `probe-crawlable-html.mjs --start-server` into CI/evidence; record run in `seo-route-evidence.md` | None (audit-only) | Optional CI wiring | Low | Regression to a skeleton fallback fails the build via contract test; only external byte-stream proof is manual | `probe-crawlable-html.test.mjs` exists but isn't run by any script |
| 15 | LCP 3.5s (POOR); reduce LCP | `hero/hero.tsx:32-33`, `homepage-performance-fixes.md` | CWV / LCP | Hero preload+`fetchPriority=high` shipped; post-fix prod LCP 3.0s | Partially fixed | Compliant | None launch-blocking; monitor field CWV | None (audit-only) | Optional byte-weight reduction (fonts/JS) | Low | Residual ~3.0s simulated LCP is a Lantern artifact (observed load-delay ~10ms, hero paints ~150ms); tracks total page weight | Prod PSI: Perf 95, SI 1.9s, TBT 30ms, CLS 0 |
| 15 | SEO score 61 | `noindex.ts`, `env/server.ts:27-28`, `.env.example:25` | SEO score | `DISABLE_INDEXING=true` on staging fails Lighthouse "blocked from indexing" | Compliant | Compliant | Launch-gate: set `DISABLE_INDEXING=false`, confirm indexable + non-empty sitemap | None (audit-only) | Flip flag at launch | Low | Not a defect; risk is forgetting to flip at launch (covered by launch checklist) | Tracked in `.planning/PROJECT.md:90` |
| 16 | Reduce unused JS (~88KiB Sentry chunk) | `instrumentation-client.ts:10-31` | Perf / JS | Sentry SDK now dynamic `import()` gated behind DSN | Fixed | Compliant | None | None (audit-only) | None | None | None | Prod: unused-JS 88→25 KiB; chunk gated (commits `c9f28cbf`,`1ba2ef8e`) |
| 16 | Legacy JS (~14KiB) | `instrumentation-client.ts`, `get-supported-browsers.js:31-35`, `homepage-performance-fixes.md:50` | Perf / legacy JS | The ~14KiB legacy polyfills lived in the always-on Sentry chunk (now gated) | Fixed | Compliant | None. Adding `browserslist` is a **no-op**: the fork already defaults to `chrome 111/edge 111/firefox 111/safari 16.4` when no config is present; a broader list would ship more legacy JS | None (audit-only) | None (browserslist recommendation withdrawn — verified no-op) | Low | Negligible residual on modern browsers | Optional explicit `browserslist` pin buys documentation, not bytes |
| 16 | Reduce shared-shell JS: code-split nav/search islands | `header/header.tsx`, `mega-nav.tsx`, `mega-nav.stories.tsx` | Perf / bundle | `'use client'` Header statically imported MobileMegaNav + SearchOverlay (+ search autocomplete) into the shared bundle loaded on every route | Fixed | Compliant | Done — both are now `dynamic(..., { ssr:false })` with gated mount `{open && …}`; desktop hover mega-panels intentionally left static (first-hover latency tradeoff) | **Applied 2026-07-01**: `header.tsx` dynamic imports + gated mounts; removed the `MobileMegaNav` re-export from `mega-nav.tsx`; repointed `mega-nav.stories.tsx` to `./mobile-mega-nav` | Optional follow-up: desktop mega-panels (measure hover latency first) | Low (was Medium) | Initial JS −~12 KiB raw / −3.6 KiB gzip on **every** route (homepage 809.6→797.2 raw, 245.3→241.6 gzip); both islands absent from initial scripts | Verified: typecheck+lint+build+story-test green; search overlay + mobile nav open/close confirmed live in preview |
| 16 | Render-blocking CSS (~540ms) | `next.config.ts` (no `experimental`) | Perf / CSS | `experimental.inlineCss` measured and rejected | Not fixed | Not compliant | None recommended; inlineCss regressed every metric (bloats HTML ~59KB). Future: critical-CSS extraction if field CWV needs it | None (audit-only) | Optional future critical-CSS | Low | Cost remains on cold loads but small (prod SI 1.9s); skip is measurement-backed | Doc: LCP 4111→4335, FCP 1208→1387 with inlineCss |
| 16 | Improve image delivery (~9KiB) | `next.config.ts:33-35` | Perf / images | AVIF/WebP negotiation enabled | Fixed | Compliant | None | None (audit-only) | None (`minimumCacheTTL` deferred, out of scope) | None | None | Hero served AVIF 15.4KB (commit `97658490`) |
| 16 | (follow-up) Drop competing below-fold preload | `homepage/tea-journal/tea-journal.tsx` | Perf / preload | Below-fold Tea Journal preload removed | Fixed | Compliant | None | None (audit-only) | None | None | None | Measured FCP −155ms / SI −256ms / −45KB (commit `e0ba5ec0`) |

---

## 3. Page-by-page compliance report

| PDF pg | Topic | Verdict |
|---|---|---|
| 1 | Site structure & URLs | **Compliant.** URL scheme intact; nested-product + policy 301s wired. Slug-parity 301s pending owner migration export (Medium). |
| 2 | Collection multiple H1s + hidden banner H1 | **Not compliant (by decision D-08).** Both are intentional accept-risk; per-route single-H1 guaranteed + tested. |
| 3 | Leaked H1s from other pages | **Not compliant (by decision).** Same `cacheComponents` Activity retention; invisible to Googlebot. |
| 4 | Read-more below grid | **Compliant (fixed).** Locked by test. |
| 5 | Above-grid structure (banner+H1+intro+breadcrumb) | **Partially compliant.** Structure right; banner-mode lacks displayed H1 + intro. |
| 6 | Green-band good example + product H1 | **Compliant.** Green-band = large visible H1 + intro; PDP one H1 per route. |
| 7 | Product H1 changes per visit (smoking gun) | **Not compliant (by decision).** Per-route HTML correct; accumulation is the Activity artifact. |
| 8 | Blog `/blog/` slug + title suffix | **Mixed.** Suffix removed (Compliant); `/blog/` slug deferred to migration (Low). |
| 9 | Title suffix, meta desc, internal linking, lang | **Compliant.** `en-AU`, product keeps suffix, descriptions + internal links present. |
| 10 | view-source `en`, apex→www, robots login/account + sitemap host | **Mostly compliant.** lang/robots/sitemap fixed; apex→www **301 is open (Vercel infra)**; account per-page noindex open (Medium). |
| 11 | robots body, canonical, blog-tag noindex | **Compliant (fixed).** Tag pages noindex + excluded from sitemap. |
| 12 | Schema Service/LocalBusiness/Reviews/FAQ "missing" | **Compliant — false negative.** All present per-template; LocalBusiness enrichment (geo/hours) recommended. |
| 13 | Rich Results (Organization only) + CSR claim | **Compliant.** Organization-only by design; pages are SSR (CSR claim stale). |
| 14 | Skeleton screenshots (CSR evidence) | **Compliant (fixed `308f470e`).** No skeleton shell served. |
| 15 | CWV LCP 3.5s / SEO 61 | **Compliant.** SEO 61 = staging noindex artifact; LCP = Lantern lab artifact (prod Perf 95). |
| 16 | LCP root causes (render-block CSS, unused/legacy JS) | **Partially fixed.** Sentry+AVIF+preload fixed; header code-split (Medium) + browserslist (Low) + inlineCss (skip, measured) open. |

---

## 4. Critical issues to address first

There are **no Critical (indexation/ranking-breaking) code defects.** Ranked by real priority:

1. **Apex→www 301 redirect (Medium, infra — launch blocker).** Configure in Vercel domain settings (www primary; redirect `teavision.com.au` → `www`). Do **not** add a `middleware.ts`/`next.config` host rule (breaks `*.vercel.app` previews). PDF p10.
2. **Banner-mode displayed H1 + intro (Medium, product decision).** The one item with genuine on-page SEO value the site currently forgoes on top-of-funnel category pages. Needs owner sign-off (reverses D-08). PDF p2/p5.
3. **Per-page production `noindex` on `/account` auth routes (Medium, defence-in-depth).** `withNoindexRobots` is inert in production; add explicit `robots:{index:false}` to login/register/recover/reset/activate + `account/layout.tsx`. PDF p10.
4. **Migration slug-parity 301s (Medium, owner-gated).** Blocked pending the owner/SEO slug-change export; add two-source-confirmed 301s before/at cutover. PDF p1.
5. ~~**Header island code-splitting (Medium, perf).**~~ ✅ **Done 2026-07-01** — `MobileMegaNav` + `SearchOverlay` lazy-loaded; −~12 KiB raw/route. (Optional follow-up: desktop hover mega-panels.) PDF p16.
6. **LocalBusiness schema enrichment (Medium).** Add `geo` + `openingHoursSpecification` for local rich-result eligibility. PDF p12.
7. **Multiple/changing H1s decision (Low true risk / Medium optics).** Either keep documented accept-risk or add an Activity mitigation — mainly to stop recurring auditor confusion. PDF p2/3/7.

**Launch-gate reminder (not a defect):** flip `DISABLE_INDEXING=false` in production; this alone converts the audit's SEO 61 into a passing score.

---

## 5. Step-by-step remediation plan

**Phase A — Launch-blocking infra & config (owner + 1 dev, ~½ day)**
1. Vercel: set `www.teavision.com.au` primary, redirect apex → www (and confirm http→https). Set prod `SITE_URL=https://www.teavision.com.au`. Verify `curl -I https://teavision.com.au/` returns 308→www.
2. Confirm prod env `DISABLE_INDEXING` **unset/false**; re-run PSI + Rich Results on the www prod URL to replace the consultant's stale evidence.
3. Obtain the owner/SEO slug-change export; encode any changed-slug 301s in `next.config.ts redirects()` per the two-source rule in `seo-url-parity-register.md`; crawl to confirm zero 404s.

**Phase B — Low-risk code hardening (1 dev, ~½ day)**
4. Add explicit `robots:{index:false, follow:true}` to `account/login|register|recover|reset/[id]|activate/[id]/page.tsx` and `account/layout.tsx`.
5. `global-error.tsx:19` → `lang="en-AU"`.
6. ~~Add `browserslist`~~ — **withdrawn.** Verified no-op: Next 16 fork already compiles to modern targets by default (`get-supported-browsers.js:31-35`); the flagged legacy JS was the now-gated Sentry chunk.

**Phase C — Schema enrichment (1 dev, ~½ day; owner confirms facts)**
7. LocalBusiness (`pages/contact/_components/json-ld.tsx`): add `geo` GeoCoordinates + `openingHoursSpecification`; set `@id = ${SITE_URL}/#organization`.
8. Organization (`components/homepage/content.ts`): add `sameAs` (the 4 social links in contact `page-data.ts`), `foundingDate` (owner-confirmed, ~2014), `@id`, and a real logo asset (replace `favicon.ico`).
9. Product Offer (`products/[handle]/page.tsx`): add `priceValidUntil`, `itemCondition: NewCondition`, and merchant return/shipping policy.

**Phase D — Owner design decisions (needs sign-off)**
10. Banner-mode collections: decide whether to restore a displayed `<h1>` + short intro (re-enable reverted `41753db2`, sized tastefully) or keep D-08. Preview before implementing (per house preference).
11. `cacheComponents` H1 accumulation: keep documented accept-risk, or add a mitigation (cap retained routes / make hidden `<Activity>` subtrees inert). Update `seo-team-recheck-report.md` messaging either way.

**Phase E — Perf polish (optional, post-launch, measure first)**
12. ✅ **Done 2026-07-01** — `next/dynamic` the header islands: `MobileMegaNav` + `SearchOverlay` lazy (`ssr:false`, gated mount), −~12 KiB raw/route, live-verified. Remaining optional: desktop hover mega-panels (measure first-hover latency before splitting).
13. Blog `/blog/` slug simplification at migration (route/redirect + 301 + `getBlogPath` consumers) if owner opts in.
14. Wire `probe-crawlable-html.mjs --start-server` into CI/evidence and record a dated run in `seo-route-evidence.md`.

---

## 6. Recommended tests & validation

**Automated (already green — keep as regression gates):**
- `pnpm test:contracts` — `collection-page.test.mjs` locks SSR (no skeleton fallback, single `<PageContent>`/`<ProductContent>`).
- `pnpm exec playwright test tests/e2e/h1-correctness.spec.ts` — one visible `<h1>` per standalone route load.
- `page-content.test.tsx` — read-more after grid; banner crumb-H1 markup.
- `node scripts/seo/probe-crawlable-html.mjs --start-server` — H1/grid/buy-section/JSON-LD precede any skeleton marker in the raw stream.

**Add/run for the remediation above:**
- After Phase A: `curl -I https://teavision.com.au/` (expect 308→www); `curl -sS -H 'Accept-Encoding: identity' https://www.teavision.com.au/products/<h> | grep -iE '<h1|Add to Cart|ld\+json'`; Google Rich Results + URL Inspection on the www prod URLs (validate schema on per-template URLs: contact/faq/services/product — **not** `/`).
- After Phase B: assert account auth routes emit `<meta name="robots" content="noindex">` in production build (add an integration test).
- After Phase C: validate each JSON-LD type in the Rich Results Test / Schema Markup Validator.
- Perf: `pnpm test:performance` (Lighthouse harness) + real PSI on the deployed www URL before/after any Phase E change; re-check the launch-image contract test.
- Regression sweep for any change: `pnpm lint && pnpm typecheck && pnpm build`.

---

## 7. Final checklist

**✅ Complete / compliant (verified in current code)**
- URL scheme; nested-product + policy 301s
- `lang="en-AU"`; title brand-suffix removed (home/collection/service); product keeps suffix
- Meta descriptions; internal linking
- Canonical + sitemap + robots on www; robots disallows `/account*`+login
- Blog-tag `noindex` + sitemap exclusion; staging `DISABLE_INDEXING` isolation
- Read-more below grid
- SSR of collection/product (skeleton fallback removed); crawlable-HTML CI guard
- Schema present: Organization, WebSite, Product, Offer, gated AggregateRating, Service, LocalBusiness, FAQPage, BreadcrumbList, CollectionPage/ItemList
- Perf: Sentry gated, AVIF, hero `fetchPriority=high`, below-fold preload dropped (prod Perf 95 / SI 1.9s)
- Header interactive islands (mobile nav + search) lazy-loaded via `next/dynamic` — done 2026-07-01, −~12 KiB raw/route

**🟡 Pending (open code/enrichment work)**
- Account auth per-page production `noindex`
- `global-error.tsx` lang; `/pages/[...slug]` absolute title (optional)
- LocalBusiness geo/hours; Organization sameAs/foundingDate/@id/logo; Product Offer fields
- Optional: desktop hover mega-panel splitting (measure first); probe-in-CI wiring

**⛔ Blocked (external/owner-gated)**
- Apex→www 301 (Vercel infra)
- Migration slug-parity 301s (owner/SEO export)
- Blog `/blog/` slug (migration decision)
- LocalBusiness/Organization factual fields (owner confirmation)

**🔍 Needs review (owner/SEO decision, not a bug)**
- Banner-mode displayed H1 + intro (reverses D-08)
- `cacheComponents` H1-accumulation accept-risk vs mitigation
- Whether to keep render-blocking-CSS as-is (inlineCss measured net-negative)

**🚩 Launch gate**
- Set `DISABLE_INDEXING=false` in production (converts SEO 61 → passing); re-audit the www prod URLs.
