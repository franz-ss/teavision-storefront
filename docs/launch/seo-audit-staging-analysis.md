# SEO Audit (Staging) — Page-by-Page Analysis & Action Plan

**Source:** "SEO Audit - Teavision Staging Site.pdf" (16 pages), external SEO consultant
**Audited site:** `teavision-storefront.vercel.app` (this codebase — headless Shopify + Next.js 16 App Router)
**Analysis date:** 2026-06-29 · **Repo HEAD at analysis:** `40bceea3`
**Method:** Every PDF page + screenshot reviewed visually; every finding then verified against the actual repository code.

---

## Executive summary — the single most important takeaway

**Most of the audit's findings are already fixed in the current codebase — the consultant audited a stale staging deployment** (built before the Phase 18 SEO commit `804d9257` and the recent heading/hydration commits). Verified against live code:

| Already fixed (consultant saw stale build) | Genuinely open |
| --- | --- |
| `lang="en-AU"` ✅ · title brand-suffix removed on home/collection/service ✅ · canonical/sitemap on `www` ✅ · robots disallows account/login ✅ · tagged-blog `noindex` ✅ · Service/LocalBusiness/FAQ/Review schema ✅ · "Read more" already below product grid ✅ · product/collection content server-rendered (no skeleton) ✅ | **① Multiple / changing H1s** on collection & product pages · **② "Hidden" H1 on banner-mode collections** · partial: LCP/JS perf · infra: apex→www redirect · hardening: account/login per-page `noindex` |

**Two real code defects remain — and they are the audit's headline complaint (H1s):**

1. **🔴 Multiple & per-visit-changing H1s (CRITICAL, confirmed, NOT fixed by recent work).** Root cause: `cacheComponents: true` ([next.config.ts:9](../../next.config.ts)) makes Next.js 16 keep up to **3 previously-visited routes mounted in hidden `<Activity>` (display:none) containers** instead of unmounting them. Their `<h1>`s stay in the live DOM, so a DOM-reading SEO crawler sees the visible page H1 **plus** leaked H1s from recently-visited pages — and the set changes with navigation history. This is exactly the "`/products/aussie-chai` shows *Aussie Chai* then *Aniseed Whole*" behaviour on page 7. **Each route's HTML is individually correct (one H1); the defect only appears in the accumulated multi-route browser DOM** — which is why the team's prior single-route rechecks marked it "pass."

2. **🟠 "Hidden" H1 on banner-mode collection pages (HIGH, confirmed — caused by recent commits).** On collections whose Shopify description embeds a banner image, the page's only `<h1>` is rendered as an **11px mono-uppercase breadcrumb crumb** (`type-mono-meta`, [hero.tsx:65](../../src/app/(storefront)/collections/[handle]/_components/hero.tsx)). It's not literally `sr-only`, but there is no visually meaningful page heading — substantively what the auditor flagged.

**Recommended first move:** redeploy staging from current `main` and have the consultant re-audit — that clears ~6 false positives. Then fix the two real H1 issues.

---

## Page-by-page analysis

### Page 1 — On-Page SEO intro: Site structure, URLs & Homepage headings
- **Shows:** Audit opening. Site-structure/URL conventions (`/collections/…`, `/products/…`, `/pages/…`) deemed fine. Homepage heading structure (H1/H2/H3) deemed good. Screenshot: homepage with the Detailed SEO Extension panel open; arrow points to the H1 *"Australia's #1 tea company."*
- **Issue:** None substantive. Note re: verifying URL slugs survived migration, with 301s during migration.
- **Current state:** Homepage heading hierarchy is correct ([hero.tsx:42](../../src/components/homepage/hero/hero.tsx) H1).
- **Impact:** Low — informational.
- **Fix:** No code change. During migration, diff old↔new slugs and add 301s. ✅ No action now.

### Page 2 — Collection pages: multiple H1s + hidden main-category H1
- **Shows:** Two screenshots of the *Wholesale Bulk Tea* collection. Top: SEO panel with **multiple H1 entries** flagged (red arrows). Bottom: heading panel where the **main H1 text isn't visually displayed**.
- **Issue:** (a) Multiple H1s per collection page; (b) main-category collections don't show a visible H1 (auditor calls hidden-text a black-hat pattern to avoid).
- **Current state:** (a) = **Issue ①** — leaked H1s from hidden `<Activity>` routes (cacheComponents). (b) = **Issue ②** — banner-mode H1 rendered at 11px in the breadcrumb.
- **Impact:** High. Multiple/ambiguous H1s dilute the page's primary keyword signal; an imperceptible H1 weakens topical relevance and looks like cloaking to a crawler.
- **Fix:** ① disable Activity route-retention (see Action 2); ② give banner-mode a real visible `<h1>` (see Action 3).

### Page 3 — Collection H1s leaking from *other* pages
- **Shows:** Two more collection screenshots (Organic Black Tea listings) with heading panels listing long heading sets pulled from **other Main Category pages and the Homepage**.
- **Issue:** Leaked headings originate from content *not on the page*.
- **Current state:** **Issue ①.** The hidden retained routes contribute their headings; the set depends on browsing path ("different every time").
- **Impact:** High — confuses crawlers about page topic; inflates H1/H2 counts.
- **Fix:** Action 2 (eliminate retained hidden-route DOM).

### Page 4 — "Read more" content placement + leaked homepage headings
- **Shows:** `/collections/wholesale-bulk-tea` with the heading outline showing homepage items leaking in — *"Australia's #1 tea company"*, *"Explore Our Product Range"*, and the product-range mega-menu list. Note: move the "Read more" content **below** the product grid.
- **Issue:** (a) Homepage headings leaking onto a collection (Issue ①); (b) long "Read more" description should sit after the grid.
- **Current state:** (a) **Issue ①.** (b) **Already fixed** — `StoryDisclosure` ("Read more about …") already renders *after* the grid ([page-content.tsx:302](../../src/app/(storefront)/collections/[handle]/_components/page-content.tsx)); a test locks `product-grid` before "Read more." Consultant saw a stale build.
- **Impact:** (a) High; (b) none (already correct).
- **Fix:** Action 2 for (a); for (b) redeploy + re-audit.

### Page 5 — Desired above-grid structure
- **Shows:** *Wholesale Bulk Tea* with banner image + grid. Above the grid the auditor wants **only**: optional banner image, H1, brief intro, breadcrumb.
- **Issue:** Above-grid content should be minimal.
- **Current state:** Matches the intended structure **except** the H1 is the 11px breadcrumb crumb (Issue ②). Brief intro renders in green-band mode but not banner mode.
- **Impact:** Medium — the layout is right; the H1 prominence is the gap.
- **Fix:** Action 3 (add visible banner-mode H1; optionally add brief intro to banner mode).

### Page 6 — A good collection example + product-page H1 issue intro
- **Shows:** *Black Teas* collection — banner + breadcrumb + visible **H1** + intro, then grid (arrows mark breadcrumb & H1). This is the green-band mode that works. Text introduces the **same multiple-H1 issue on product pages**, "different every time."
- **Issue:** Product pages share the per-visit changing-H1 problem.
- **Current state:** *Black Teas* (no embedded image → green-band mode) shows a proper H1 ([hero.tsx:127](../../src/app/(storefront)/collections/[handle]/_components/hero.tsx)). Product pages exhibit **Issue ①**.
- **Impact:** High (product pages); the *Black Teas* example confirms the desired pattern.
- **Fix:** Action 2; make banner-mode match this green-band H1 prominence (Action 3).

### Page 7 — 🔴 The smoking gun: product H1 changes on the same URL
- **Shows:** **Two loads of the same URL `/products/aussie-chai`.** Load 1 heading outline H1 = **"Aussie Chai"** (correct). Load 2 H1 = **"Aniseed Whole"** — a *different product*. Surrounding leaked headings differ too (different related-product lists).
- **Issue:** The H1 (and heading set) is non-deterministic per visit on a fixed URL.
- **Current state:** **Issue ① — definitively confirmed.** The product route's own HTML has exactly one H1 (the product title, [products/[handle]/page.tsx:317](../../src/app/(storefront)/products/[handle]/page.tsx)). The extra/changing H1 is a previously-visited product's `<h1>` retained in a hidden `<Activity>` boundary (cacheComponents keeps up to 3 prior routes; `MAX_BF_CACHE_ENTRIES`).
- **Impact:** **Critical.** Google's primary-heading signal becomes unstable; a crawler running JS can pick up the wrong product's H1. Directly undermines per-product ranking.
- **Fix:** **Action 2** — the top-priority code fix.

### Page 8 — More product H1 evidence; blog URL slug; title suffix intro
- **Shows:** Two product screenshots with leaked headings (arrows). Text: Service/Generic/Blog pages structurally fine. Suggest simplifying the blog listing slug `/blogs/teavision-blogs/` → `/blog/`. Page-title brand suffix overflows pixel width.
- **Issue:** (a) Product H1 leak (Issue ①); (b) blog slug too long; (c) auto brand-suffix in `<title>`.
- **Current state:** (a) Issue ①. (b) Route is `/blogs/[blog]` (`DEFAULT_BLOG_HANDLE='teavision-blogs'`); no `/blog` route yet — **defer to migration** (301 via `next.config.ts redirects()`). (c) **Already fixed** — home/collection/service use `title:{absolute:…}` (bypasses the `%s | Teavision` template); products keep the suffix by design.
- **Impact:** (a) High; (b) low (cosmetic URL, migration); (c) none (fixed) — minor pixel-trim copy optional.
- **Fix:** Action 2; defer slug to migration; optional title copy-trim (Action 7).

### Page 9 — Title suffix (cont.), meta description, internal linking, lang tag
- **Shows:** *Wholesale Bulk Tea* with the SEO Overview panel (Title/Description/URL/Canonical/Robots/H1 counts). Text: meta descriptions intact; natural internal links via "You Might Like"/"Related Products"; **`lang` should be `en-AU`**.
- **Issue:** lang tag = `en`.
- **Current state:** **Already fixed** — `<html lang="en-AU">` ([layout.tsx:63](../../src/app/layout.tsx)) and `og:locale='en_AU'`. (Residual: [global-error.tsx:19](../../src/app/global-error.tsx) still `lang="en"` — rare error page only.)
- **Impact:** Low/none (fixed). Optional consistency tweak.
- **Fix:** Redeploy + re-audit; optionally set `global-error.tsx` to `en-AU` (Action 7).

### Page 10 — `view-source` lang="en"; www vs non-www; robots.txt
- **Shows:** `view-source:teavision-storefront.vercel.app` — raw HTML begins `<html lang="en">` (arrow). Text: strongest URL = `https://www.teavision.com.au/` but site resolves non-www with no redirect of variants; robots.txt notes.
- **Issue:** (a) lang en (stale — see p9); (b) non-www host with no apex→www redirect.
- **Current state:** (a) Fixed in code. (b) Canonical/sitemap already normalize to **www** in production ([site-url.ts](../../src/lib/seo/site-url.ts) forces apex→www); the **host redirect itself is infra** — no `middleware.ts`, no apex→www rule in `next.config.ts`.
- **Impact:** (b) Medium — without the redirect, both hosts can be reachable, splitting signals (canonical mitigates but redirect is best practice).
- **Fix:** Action 4 — set production `SITE_URL=https://www.teavision.com.au` and add Vercel apex→www domain redirect (do **not** redirect the `*.vercel.app` staging host).

### Page 11 — robots.txt body; canonical; indexable pages (blog tags)
- **Shows:** `/robots.txt`: `User-Agent:* / Allow:/ / Disallow:/api/ / Sitemap: https://teavision.com.au/sitemap.xml`. Canonical "intact." Suggest **noindex blog tag pages** to avoid cannibalising the blog listing.
- **Issue:** (a) robots: only `/api/` disallowed + apex sitemap host; (b) blog tag pages indexable.
- **Current state:** **Already fixed** — [robots.ts](../../src/app/robots.ts) now disallows `/api/`, `/account*`, `/account/login`, etc., and emits the sitemap on `www`; tagged blog routes emit `robots:{index:false, follow:true}` ([blogs/[blog]/_lib/metadata.ts](../../src/app/(storefront)/blogs/[blog]/_lib/metadata.ts)) and are excluded from the sitemap. Consultant saw the pre-`804d9257` build.
- **Impact:** Low/none (fixed). (On staging, `DISABLE_INDEXING` masks everything to `noindex,nofollow` — expected.)
- **Fix:** Redeploy + re-audit. Optional: per-page `noindex` on account/login for defence-in-depth (Action 5).

### Page 12 — Blog tag page canonical/robots + missing schema list
- **Shows:** `/blogs/teavision-blogs/tagged/green-tea` ("Green Tea Articles"). Overview panel: self-referential canonical (apex host), **Robots/X-Robots-Tag = Missing**. Text lists schema: Organisation ✅, Product ✅, **Service / Local Business / Reviews / FAQ = "Not present, need to add."**
- **Issue:** (a) Tag page indexable; (b) four schema types "missing."
- **Current state:** (a) **Fixed** (see p11). (b) **False negative** — the consultant tested only the homepage. Service, LocalBusiness, FAQ, and Review/AggregateRating **are implemented**, scoped to their own templates: LocalBusiness on `/pages/contact`, Service on the four services pages, FAQ on `/pages/faq` + `bulk-wholesale-supply`, AggregateRating on product pages (gated on real Trustoo data). The homepage intentionally carries only Organization + WebSite.
- **Impact:** (b) None functionally — but worth re-validating the right URLs and optionally enriching the LocalBusiness/Organization nodes (founding date, `sameAs`, credentials).
- **Fix:** Tell the consultant to validate per-template URLs, not `/`. Optional schema enrichment (Action 7).

### Page 13 — Rich Results Test (homepage) + CSR claim
- **Shows:** Google Rich Results Test of `…vercel.app/` — "1 valid item detected: **Organization**." Text: CSR issue on collection/product pages; crawlers see JS not HTML; recommends SSR.
- **Issue:** (a) Only Organization detected; (b) claimed CSR.
- **Current state:** (a) Expected — homepage only emits Organization + WebSite by design (other schema lives on its own routes). (b) **Misread / stale** — collection & product pages are **Server Components** that fetch Shopify data server-side and stream full HTML; there is no `loading.tsx` and Suspense uses `fallback={null}`. `scripts/seo/probe-crawlable-html.mjs` asserts the H1, product grid, buy section, and JSON-LD appear **before** any skeleton marker in the raw byte stream.
- **Impact:** Low — content is crawlable on current build.
- **Fix:** No code change; prove with `curl`/probe and re-audit (Action 1). The *real* H1 problem is Issue ① (DOM persistence), not CSR.

### Page 14 — Skeleton screenshots ("CSR" evidence)
- **Shows:** `/collections/wholesale-bulk-tea` and `/products/organic-masala-chai` rendering only **gray skeleton placeholders** in the main content area (pink-boxed).
- **Issue:** First view shows skeletons, implying client-rendered content.
- **Current state:** **Stale build.** Commit `308f470e` ("keep SEO route content after hydration") removed the old conditional Suspense fallback that produced exactly this thin shell. Current routes server-render real content in the first byte stream.
- **Impact:** Would be high *if* still present; on current code it's resolved.
- **Fix:** Action 1 — redeploy, then run the `probe-crawlable-html` script and `curl -H 'Accept-Encoding: identity'` to demonstrate H1/grid/JSON-LD with JS disabled. Optionally wire the probe into CI.

### Page 15 — Core Web Vitals (mobile Lighthouse, homepage)
- **Shows:** PSI mobile: Performance **88**, Accessibility 97, Best Practices 96, **SEO 61**, Agentic 2/2. FCP 1.2s ✅, **LCP 3.5s** ⚠️ (arrow), TBT 90ms ✅, CLS 0 ✅, Speed Index 4.7s ⚠️.
- **Issue:** LCP 3.5s; SEO score 61.
- **Current state:** LCP element = hero AVIF (already a ~24KB preloaded `next/image`). The ~2.4s FCP→LCP gap appears on every route → render-blocking CSS + client-JS hydration, not image weight. **SEO 61 is a staging artifact**: `DISABLE_INDEXING` forces `noindex`, which fails Lighthouse's "page is blocked from indexing" audit. Production (indexing on) will score far higher.
- **Impact:** Medium — LCP 3.5s is above the 2.5s "good" threshold on mobile; SEO 61 is misleading on staging.
- **Fix:** Action 6 (perf) — and re-audit production for the true SEO score.

### Page 16 — LCP root causes (Lighthouse insights)
- **Shows:** Two boxed items. **Insights → Render-blocking requests (~690ms savings):** two CSS chunks (~19.3KiB/600ms + ~2.9KiB/150ms). **Diagnostics → Reduce unused JavaScript (~88KiB):** a ~141.8KiB JS chunk with ~87.7KiB unused. Also: Forced reflow, LCP request discovery, Improve image delivery (~9KiB), Legacy JS (~14KiB), 1 long main-thread task.
- **Issue:** Render-blocking CSS + large unused JS bundle delaying LCP.
- **Current state:** Single Tailwind v4 global sheet = the render-blocking CSS. The `'use client'` `Header` statically imports `MegaNav`, `MobileMegaNav`, `SearchOverlay` + many icons into the shared bundle (the unused JS). No `browserslist` config → SWC ships legacy transpile helpers (~14KiB).
- **Impact:** Medium — these are the concrete LCP levers.
- **Fix:** Action 6 — `next/dynamic` the non-first-paint Header islands, add `browserslist`, tune hero image (`quality`, AVIF `formats`). Don't reintroduce `unoptimized` (a contract test forbids it; it was already reverted).

---

## Comparison table

| Pg | Screenshot / section | Issue | Current state (verified in code) | Impact | Recommended fix | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Homepage + SEO panel | URL/structure & homepage headings OK | Correct | Low | None; verify slugs at migration | — |
| 2 | Wholesale Bulk Tea, multiple/hidden H1 | Multiple H1s + invisible main-cat H1 | ① Activity DOM leak; ② 11px breadcrumb H1 | High | Action 2 + Action 3 | 🔴/🟠 |
| 3 | Two collections, leaked headings | H1s from other pages | ① cacheComponents retention | High | Action 2 | 🔴 |
| 4 | /collections/wholesale-bulk-tea outline | Homepage headings leak; move Read-more below grid | ① leak; Read-more **already** below grid | High / none | Action 2; redeploy+re-audit | 🔴/✅ |
| 5 | Banner + grid | Above-grid should be banner+H1+intro+breadcrumb | Layout right; H1 = tiny crumb (②) | Medium | Action 3 | 🟠 |
| 6 | Black Teas (good) + product intro | Product pages multiple H1 | Green-band H1 correct; products = ① | High | Action 2 (+3 parity) | 🔴 |
| 7 | **/products/aussie-chai ×2 → "Aussie Chai" then "Aniseed Whole"** | H1 changes per visit on same URL | ① **confirmed** (hidden `<Activity>` H1s) | **Critical** | **Action 2** | 🔴 |
| 8 | Product screenshots; blog slug; title suffix | Product H1 leak; `/blog/` slug; title suffix | ① leak; slug = migration; suffix **already removed** | High / low / none | Action 2; defer slug; opt. copy | 🔴 |
| 9 | Overview panel; lang | lang should be en-AU | **Already `en-AU`** | None | Redeploy+re-audit; opt. global-error | ✅ |
| 10 | view-source lang="en"; www | non-www, no apex→www redirect | Canonical/sitemap on www; redirect = infra | Medium | Action 4 | 🟡 |
| 11 | robots.txt; blog tag index | robots thin; tag pages indexable | **Both already fixed** | Low/none | Redeploy+re-audit; opt. Action 5 | ✅ |
| 12 | Blog tag page; schema list | Tag indexable; 4 schema "missing" | Tag **noindexed**; schema **present** (homepage-only false negative) | None | Validate per-template URLs; opt. enrich | ✅ |
| 13 | Rich Results (homepage); CSR | Only Org detected; CSR claim | By design; pages **are SSR** | Low | Action 1 (prove); re-audit | ✅ |
| 14 | Skeleton screenshots | Crawlers see skeletons | **Stale build** (fixed by `308f470e`) | Low (now) | Action 1 | ✅ |
| 15 | PSI mobile scores | LCP 3.5s; SEO 61 | LCP render-delay; **SEO 61 = staging noindex** | Medium | Action 6; re-audit prod | 🟡 |
| 16 | Lighthouse insights | Render-blocking CSS; ~88KiB unused JS | Tailwind sheet; client Header bundle; no browserslist | Medium | Action 6 | 🟡 |

Legend: 🔴 Critical · 🟠 High · 🟡 Medium · ✅ Already fixed / verify by redeploy.

---

## Action plan (prioritized)

### Action 1 — Redeploy staging from current `main`, then re-audit *(foundational, do first)*
Roughly 6 of the audit items are already fixed in code but were tested on a stale build. Clearing them first stops wasted back-and-forth and isolates the two real defects.
1. Trigger a fresh Vercel deploy of HEAD (`40bceea3`) to `teavision-storefront.vercel.app`; confirm the deployed SHA includes `804d9257` and `308f470e`.
2. Prove crawlability with JS disabled:
   ```bash
   curl -sS -H 'Accept-Encoding: identity' https://teavision-storefront.vercel.app/products/organic-masala-chai | grep -iE '<h1|Add to Cart|application/ld\+json'
   pnpm build && node scripts/seo/probe-crawlable-html.mjs --start-server \
     --collection-route /collections/wholesale-bulk-tea --product-route /products/organic-masala-chai
   ```
3. Send the consultant a short note: lang, title suffix, canonical/sitemap host, robots, blog-tag noindex, schema coverage, read-more order, and SSR were all fixed in Phase 18 / recent commits; please re-test the latest deploy and validate schema on per-template URLs (contact/faq/services/product), not just `/`.

### Action 2 — 🔴 Fix multiple / per-visit-changing H1s *(top code priority)*
**Verify the root cause (2 min):** on staging, navigate Home → `/products/aussie-chai` → `/products/aniseed-whole`, then in DevTools run `document.querySelectorAll('h1').length` and map their text. You'll see >1 H1, with the inactive ones inside a `display:none` Activity container.

**Remediation — choose one:**
- **Preferred:** turn **off** `cacheComponents` ([next.config.ts:9](../../next.config.ts)) so prior routes unmount on navigation (`MAX_BF_CACHE_ENTRIES` drops 3→1). This is the only option that *guarantees* one H1 in the live DOM. **Caveat:** the app relies on `'use cache'`/`cacheLife`/`cacheTag` and PPR streaming; migrate those to the non-cache-components model (`unstable_cache` / route `revalidate`) on a branch, then re-run the build + `probe-crawlable-html` before flipping.
- **Stopgap (keep Cache Components):** force full-document navigation for SEO-critical product/collection links (`prefetch={false}` + hard nav) so no Activity DOM accumulates; or pin Next.js until an official Activity opt-out ships (none exists in 16.2.9). Degrades SPA UX.

**Regression guard (either way):** add a Playwright test that navigates Home→ProductA→ProductB and asserts `await page.locator('h1').count() === 1` on the **raw DOM** — *not* `getByRole('heading')`, which is a11y-filtered and will falsely pass. **Correct the stale claims** in `.planning/forensics/seo-audit-recheck-20260626.md` and `docs/launch/seo-team-recheck-report.md` to note single-route HTML was clean but the multi-route Activity DOM was the actual defect.

### Action 3 — 🟠 Restore a visible H1 on banner-mode collections
In [hero.tsx](../../src/app/(storefront)/collections/[handle]/_components/hero.tsx) banner branch (~lines 47–72): change the breadcrumb current-page `<h1>` back to a `<span>`, and add a real heading below the `<nav>`:
```tsx
<h1 className="font-display text-ink mt-4 text-balance text-[clamp(2rem,4vw,3.1rem)] leading-[1.06]">
  {collectionTitle}
</h1>
```
Use `text-ink` (paper background), not `text-paper`. Keep exactly one `<h1>`. Update [page-content.test.tsx](../../src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx) (~471–516): keep the one-H1 assertion, drop the `type-mono-meta`/`not type-display` H1 assertions, assert the breadcrumb crumb is now a `<span aria-current="page">`. This reverses the deliberate "compact banner heading" visual choice, so **get design sign-off** (per the project's preview-first preference) — e.g. moderate heading below the banner.

### Action 4 — 🟡 Production host: SITE_URL=www + apex→www redirect *(infra)*
1. Set production `SITE_URL=https://www.teavision.com.au` (apex is auto-normalized anyway). Keep staging on `DISABLE_INDEXING=true` and do **not** point staging `SITE_URL` at www.
2. Add the apex→www (and HTTP→HTTPS) redirect via **Vercel's domain settings** (assign `teavision.com.au` as a redirect to `www`). Avoid a `middleware.ts`/`next.config.ts` host rule — it would also fire on the `*.vercel.app` staging host and break previews. (`SITE_URL` is read once at module load — redeploy to apply.)

### Action 5 — 🟡 Defence-in-depth: per-page `noindex` on account/login
robots.txt `Disallow` blocks crawling but not indexing of discovered URLs. Add `robots: { index: false, follow: false }` metadata to `account/login`, `register`, `recover`, `reset/[id]`, `activate/[id]`, and the account pages (the login page currently exports no `metadata`). Merge with `withNoindexRobots` so they stay `noindex` even when production indexing is enabled.

### Action 6 — 🟡 LCP / bundle performance
1. **Code-split non-first-paint Header islands** ([header.tsx](../../src/components/layout/header/header.tsx)): `const SearchOverlay = dynamic(() => import('./search-overlay').then(m => m.SearchOverlay), { ssr: false })` (renders only when open); same for `MobileMegaNav`. Removes the bulk of the ~88KiB unused JS.
2. **Add `browserslist`** to `package.json` (e.g. `["chrome >= 111","edge >= 111","firefox >= 111","safari >= 16","not dead"]`) to drop legacy transpile helpers (~14KiB).
3. **Image:** add `formats: ['image/avif','image/webp']` to `next.config.ts` images; keep hero `preload`; set `quality={68}`; verify `sizes="100vw"` yields a sensible mobile candidate. **Do not** use `unoptimized` (contract test forbids it; already reverted).
4. Re-run `pnpm test:performance` + the launch-image contract test. Re-measure LCP on staging before/after. Re-audit **production** for the true SEO score (staging's 61 is the `noindex` artifact).

### Action 7 — ⚪ Optional polish
- `global-error.tsx` `lang="en"` → `en-AU` (consistency only).
- Trim Home/Collections-index `<title>` copy if still pixel-over budget (plain string edits).
- Enrich LocalBusiness/Organization JSON-LD (`foundingDate:'2014'`, `sameAs`, ACO/USDA credentials, `@id`) — confirm NAP/cert claims with the store owner; address is Clyde North VIC, not literally Melbourne.
- `/blogs/teavision-blogs/` → `/blog/` slug: implement at migration via the `get*Path` helpers + a 301 in `next.config.ts redirects()`.
- Add the `probe-crawlable-html` script to CI as a release gate.

---

### Priority ladder
1. **Action 1** (redeploy + re-audit) — unblocks everything.
2. **Action 2** (changing H1s) — the only critical, un-fixed defect.
3. **Action 3** (banner-mode visible H1).
4. **Action 4** (apex→www) — launch blocker (infra).
5. **Actions 5–6** (account noindex, LCP).
6. **Action 7** (polish / migration items).
