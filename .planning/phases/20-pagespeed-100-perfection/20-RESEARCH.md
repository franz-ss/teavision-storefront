# Phase 20: PageSpeed 100/100 — Research

This document synthesizes seven verified per-dimension research passes into one grounded, prioritized brief for the gsd-planner. The goal of Phase 20 is a genuine Google PageSpeed Insights / Lighthouse 100 across Performance, Accessibility, Best Practices, and SEO on the representative routes where physically achievable, and an honest, documented "best alternative" where not. Every load-bearing claim below has been cross-checked against the codebase, the fork's own docs (`node_modules/next/dist/docs/`), and the installed Lighthouse 13.4.0 config; verdict corrections have been folded in and low-confidence/contradicted claims dropped or flagged.

The single most important framing: the prior "all 7 routes FAIL LCP" evidence was captured on a **local Windows `next start` lab** under Lighthouse default mobile simulated throttling (Slow-4G + 4× CPU), and three text-LCP routes with **no LCP image** (cart/search/privacy) post the *same* ~3.9s LCP as the image routes while FCP stays ~1.2s and TTFB is 3–8ms. That pattern is simulated-throttle lab modeling, not a production server defect. Phase 20 must reproduce on a real public PSI run before remediating (locked decision D-03), or it will repeat Phase 17's image churn.

---

## Executive Summary

1. **The local LCP "failures" are almost certainly measurement artifact, not a production defect.** Text-LCP routes (cart/search/privacy — no image) show the identical ~1.2s-FCP → ~3.9s-LCP gap as image routes, with 3–8ms TTFB and green TBT/CLS. This is the Lighthouse *simulate* throttling model (4× CPU + Slow-4G) applied on a loaded dev box, not real LCP. **Prove it on real PSI against a public noindexed preview before spending any remediation effort** (D-01, D-03). This is the highest-leverage hypothesis in the whole phase.

2. **The evidence pipeline has a measurement gap that must be closed first.** The local harness (`scripts/performance/probe-lighthouse.mjs`) runs all four Lighthouse categories but `summarizeLhr` only extracts the **Accessibility** score (line 673) — Best Practices and SEO scores are computed and discarded, and no real PSI run exists in the repo at all. The headline "100/100" in `final-production-readiness-report.md` is an automated pass-ratio (`round(passed/nonSkipped*100)`), **not** a Lighthouse Performance score; the only Lighthouse number ever recorded is local Performance 94 and per-route Accessibility 95–97.

3. **The two real, high-leverage Performance code wins are config-level, not churn.** (a) `images.formats` is unset, so the optimizer emits **WebP-only** — AVIF is silently off, and the 24KB local hero AVIF is transcoded to a likely-larger WebP for AVIF-capable browsers. (b) There are **zero resource hints** (no preconnect to `cdn.shopify.com`, the LCP-image origin on PDP/collections). Both are low-effort, low-risk, and directly target real-world LCP.

4. **The biggest always-on JS weight is the Sentry browser SDK (~138 KB gz / 452 KB raw), shipped on all 46 routes.** It is ~52% of every route's client JS and the only third-party-adjacent JS a cold PSI run actually executes (analytics are consent-default-deny and emit nothing cold). It is bundled unconditionally because `instrumentation-client.ts` top-level `import * as Sentry` runs regardless of DSN. Gating/lazy-loading it is the largest TBT/INP lever — though current TBT (45–67ms) has comfortable headroom, so this improves the report more than it moves the score.

5. **Accessibility 100 is genuinely achievable and the fix surface is narrow.** Every route fails exactly *one* audit — `color-contrast` (three warm tokens: `ink-faint`, `gold`, `gold-deep` at small sizes, plus over-image hero text) — and two routes (/account, /search) additionally fail `heading-order`. Fixes: nudge two OKLCH token lightness values, restrict `text-gold` to dark backgrounds, add an opaque hero scrim, and fix heading order via footer `h3→h2` + an sr-only h2. All warm-palette- and D-09-compliant.

6. **SEO 100 is physically impossible on the noindexed preview.** Lighthouse 13.4's `is-crawlable` audit is weighted at ~31% of the SEO category *specifically so a `noindex` page fails the category* — the noindexed preview ceilings at **~69/100 SEO** by design. The only honest path to a 100 SEO number is a separate short-lived **indexable** build (`DISABLE_INDEXING=false`) scored once and never submitted to Search Console.

7. **Best Practices 100 is achievable tags-off, but the "tags live" ceiling is unmeasured and may be unfixable.** `deprecations` and `third-party-cookies` are each ~18.5% of the category; a single third-party cookie or console error from GA4/GTM/Meta/Searchanise when consent is granted can drop Best Practices below 100. Document the tags-on ceiling honestly (D-05) rather than gaming it.

8. **Fork gotcha to NOT chase:** the Sentry `webpack` option in `next.config.ts:72-74` is the **second argument to `withSentryConfig`** (a Sentry build option), not a Next webpack config — it does **not** trigger Next 16's "webpack config present → Turbopack build fails" guard. The build runs on Turbopack normally. Do not open a build-risk workstream here.

---

## Achievability Assessment

| Category | Realistic 100 on representative routes? | Why | Best alternative if not 100 |
|---|---|---|---|
| **Performance** | **Hard** (Likely on text-LCP routes; Hard on image-LCP routes, esp. tags-live) | Score is TBT 30% / LCP 25% / CLS 25% / FCP 10% / SI 10%. CLS=0 (6/7 routes), TBT 45–67ms, FCP ~1.2s are all green-capable. The binding constraint is **LCP on image routes** under simulated mobile throttle, plus the unmeasured tags-live ceiling. A literal 100 across all routes on throttled mobile is not reliably reachable for a content-rich storefront. | Score of record = real PSI on noindexed preview (D-01). After AVIF + preconnect + warm cache, text-LCP routes very likely clear; for image-LCP routes accept a documented high-90s with a root-caused, owner-signed waiver (as Phase 17 did) — the residual gap is throttle modeling of a correctly-sized hero, not a fixable defect. Document the cold/default-deny vs tags-live delta. |
| **Accessibility** | **Yes** | Binary, deterministic axe audits (not lab-noise). Entire gap is `color-contrast` (all routes) + `heading-order` (/account, /search). No name/label/alt/ARIA failures. Fix surface is 2 token lightness nudges + 1 scrim + heading-order markup. | N/A — 100 is the target and is attainable. Only genuine effort is the hero over-image scrim (axe samples the image, so no text-color change alone clears it). |
| **Best Practices** | **Likely (tags-off) / Conditional (tags-live)** | Tags-off build: HTTPS+HSTS, no deprecated image API (uses `preload` not `priority`), stable aspect ratios, `valid-source-maps` weight 0, console-clean on healthy routes. Risk is entirely the live vendors: `deprecations` (18.5%) + `third-party-cookies` (18.5%) + `errors-in-console` (3.7%). | Measure tags-live once with consent granted; if a vendor sets a third-party cookie or throws you cannot fix, document the honest tags-on ceiling. Do NOT enforce CSP for a score (`csp-xss` is weight 0). |
| **SEO** | **No on the noindexed preview / Yes on an indexable build** | `is-crawlable` is weighted ~31% of the category by design; the noindexed preview's `<meta name="robots" content="noindex">` ceilings SEO at **~69/100** (verified math: 9/13.043 = 69.0%). Everything else (titles, descriptions, canonical, crawlable anchors, image-alt, robots.txt) is structurally satisfied. | Score SEO on a throwaway short-lived **indexable** build (`DISABLE_INDEXING=false`), captured once via PSI, never linked or submitted to Search Console. Keep the public preview noindexed for launch safety. Document that the preview's ~69 is *intentionally* depressed by the launch-safety noindex. |

---

## Root-Cause Analysis: The LCP Gap

The prior local evidence (`docs/launch/performance-evidence.md`, 2026-06-26, `next start` at 127.0.0.1:4173, Lighthouse 13.4.0 default mobile simulate throttle):

| Route | LCP type | Local LCP | FCP | Likely true cause | Lab-artifact vs real-defect | Confirming probe |
|---|---|---|---|---|---|---|
| `/` | image (hero AVIF) | 4812ms | ~1.2s | Simulated-throttle LCP model on hero image; AVIF transcoded to WebP; no preconnect to image origin | **Mostly artifact**, small real margin from WebP-transcode + cold transform | Real PSI (warm) after `formats:[avif,webp]` + preconnect |
| `/products/<handle>` | image (gallery) | 3919ms | ~1.3s | Same; plus PDP gallery double-resize (Shopify `?width=800` → `/_next/image`) under-serves 2×-DPR | **Mostly artifact** + minor real soft-image | Real PSI on a *real* Shopify product (local fixture is a local image) |
| `/collections/all` | image (first card) | 3842ms | ~1.2s | Same; 3 cards preloaded contend for bandwidth | **Mostly artifact** | Real PSI; reduce preload 3→1 |
| `/cart` | **text** (no LCP image) | 3982ms | ~1.2s | **No image to optimize** — pure simulate render-delay model | **Artifact** (strongest evidence: text node, ~2.7s after FCP, 3ms TTFB) | Real PSI — expected to collapse toward FCP |
| `/search?q=tea` | **text** | 3830ms | ~1.2s | Same | **Artifact** | Real PSI |
| `/account` (login bridge) | **text** + CLS 0.128 | 4974ms | 2564ms | Measures `/account/login?returnTo=…` redirect bridge; CLS is login-bridge geometry, axe exposes no node | **Artifact** (redirect target, not a stable page) | Real PSI on the actual final URL; question whether to score this route at all |
| `/pages/privacy-policy` | **text** | 3912ms | ~1.2s | Same | **Artifact** | Real PSI |

**Note on "cold transform":** the verdict for caching/measurement corrected an earlier overstatement — the harness **warms assets by default** (`assetWarmup:true`, `warmupRuns:1`, fetches `/_next/image` + static/font from discovered HTML before the measured run). So discovered-asset transforms were *not* literally cold; the residual gap is best attributed to **Lighthouse's simulated-throttle LCP model** (4× CPU + Slow-4G applied to the trace), not cold transforms. (Font preloads are the exception: they ship as HTTP `Link` headers, so the harness's HTML-only asset discovery never warms fonts — a separate blind spot.)

**Recommended FIRST deliverable — a measurement + root-cause spike (Wave 1):**
1. Stand up a **public, auth-disabled, noindexed preview** (host TBD — Vercel is implied by `teavision-storefront.vercel.app` in the SEO audit docs but is **not confirmed in-repo**: no `vercel.json`, no `.vercel/`, no `vercel` in `package.json`).
2. Script `scripts/performance/probe-psi.mjs` against the PSI REST API (`pagespeedonline.runpagespeed?url=&strategy=mobile&category=…`) writing `docs/launch/psi-evidence.md`. Run cold then warm (twice) to populate the edge image cache.
3. Extend `summarizeLhr` to record **Best Practices and SEO** category scores (and the Performance score, not just pass/fail bands), plus per-audit failure enumeration for a11y.
4. Capture `Content-Encoding` (expect `br` on the real host), `Cache-Control` on `_next/static` (expect immutable), and edge TTFB from an AU region.
5. Reconcile local↔PSI: treat the local Windows absolute LCP as directional only; PSI is the score of record.

---

## Per-Dimension Findings

### 1. Measurement strategy & Lighthouse scoring model

**Current state (verified):** Lighthouse 13.4.0 installed; PSI and local Lighthouse run the *same engine and same default mobile profile* (`throttlingMethod: 'simulate'`, `mobileSlow4G` = 150ms RTT / 1.6Mbps down / 750**Kbps** up, 4× CPU, Moto G Power 412×823 @ DSF 1.75). The probe passes no `--throttling-method`, inheriting `simulate`. Metric weights verified **directly in codebase** (`node_modules/lighthouse/core/config/default-config.js`): FCP 10, SI 10, LCP 25, **TBT 30, CLS 25** (TBT+LCP+CLS = 80%), INP weight 0.

**Key findings:**
- Per-metric mobile log-normal control points (verified in source): LCP 2500/4000ms, FCP 1800/3000ms, SI 3387/5800ms, TBT 200/600ms, CLS 0.1/0.25.
- **Corrected green-100 ceilings** (the original finding was over-strict; verdict replicated the actual `getLogNormalScore` curve): a metric scores ~0.995 at roughly **LCP ~1557ms, FCP ~1076ms, SI ~1970ms, TBT ~66ms, CLS ~0.040** — not the tighter <1200/<900/<1300 originally stated.
- A rounded **100 requires the weighted sum ≥0.995, not every metric ≥0.995.** CLS=0.000 on 6/7 routes banks 25% of slack that offsets a slightly-under metric elsewhere.
- The 750 figure is **upload Kbps**, not RTT — do not quote "750ms RTT." The lantern model RTT is 150ms.
- A fresh noindexed preview has **no CrUX field data**, so only the **lab** Performance score is available pre-launch. The field "tags live" cost is only observable post-launch via CrUX.

**Recommendations:** Make scripted PSI the score of record; keep local as the reconciled inner loop; surface `lhr.categories.performance.score` in the harness; do NOT adopt WebPageTest (different model — reconciliation problem).

**Flagged/dropped:** The "PSI runs on calibrated cloud hardware near origin" explanation for lower LCP is *secondary/unconfirmable*; the dominant delta is the simulate model + dev-box CPU trace. The hero `fetchPriority` recommendation is reframed below under Images.

### 2. Image optimization (LCP / CLS)

**Current state (verified):** `next.config.ts:33-51` sets only `qualities:[68,75]` + 3 remotePatterns. **`formats`, `minimumCacheTTL`, `deviceSizes`, `imageSizes` all unset** → fork defaults: `formats:['image/webp']` (AVIF off), `minimumCacheTTL:14400` (4h). sharp 0.34.5 + next 16.2.9 installed (AVIF encode available). Hero = local 24KB AVIF (`homepage-hero-tea-harvest-lcp.avif`), rendered `fill sizes="100vw" preload`, no placeholder. All paths use the correct Next 16 `preload` prop — **zero deprecated `priority`/`eager`/`fetchPriority`** on `next/image`. CLS 0.000 on all image routes.

**Key findings:**
- **AVIF is silently disabled site-wide.** The 24KB hero AVIF is re-encoded to a likely-larger WebP for AVIF-capable browsers — a bytes regression on the most important LCP image. Highest-leverage, lowest-risk image fix.
- **Corrected: the hero file is actually 1440×650**, but `content.ts:114-115` *declares* 1440×810 (stale/incorrect). Harmless today (the `<Image>` uses `fill`, never reads those dims), but a latent data bug that would surface in any static-import/LQIP refactor. Fix `content.ts` to 1440×650.
- No above-the-fold image has an LQIP/blur placeholder (string `src` blocks Next's auto-blur; needs a static import or hand-made `blurDataURL`).
- Collection pages preload the **first 3 cards** (`priority={index<3}`); the fork doc warns against multiple LCP-candidate preloads. Reduce to 1.
- PDP gallery double-resizes Shopify images (pins `?width=800` then re-optimizes through `/_next/image`) and caps at 800px — under-serves 2×-DPR of its declared `sizes` (up to 38rem). **Scoped correction:** this is a *code-path inference for real Shopify products only*; the local lab fixture is a local image and does not exercise the Shopify pin.
- Oversized source PNGs in `/public` (e.g. `organic-herbs-and-spices.png` = 9.9MB exact, 33 PNGs >1MB, ~99MB total) are off the LCP path (re-optimized + below-fold) but bloat the repo and are a latent regression risk.

**Recommendations:** Add `formats:['image/avif','image/webp']`; fix `content.ts` hero dims to 1440×650; add a hand-made hero `blurDataURL`; reduce collection preloads 3→1; raise/remove the PDP 800px cap (e.g. 1280px); raise `minimumCacheTTL` to ~31 days; prune/downscale unused PNGs. **Do NOT** chase the lab LCP with more image churn (D-03) or swap `preload` back to `priority` (D-10).

### 3. Font loading

**Current state (empirically verified):** Four self-hosted `next/font/google` families (Spectral 400/500, Hanken Grotesk variable, Space Mono 400/700, **Caveat — unused**), all `display:'optional'`, latin subset. **D-11 confirmed by curl:** font preloads emit ONLY as an HTTP `Link: rel=preload; as="font"` response header (620 bytes, 5 woff2), **zero `<link as=font>` tags in `<head>`** — diverging from the fork's own `font.md:148`. The LCP image preload rides a *separate* channel (in-head `<link as=image>`), so fonts and the LCP image do not contend.

**Key findings:**
- **Zero font-driven CLS by construction:** `display:optional` never swaps after first paint, and `adjustFontFallback` emits metric-matched fallback `@font-face` (ascent/descent/line-gap-override + size-adjust, verified verbatim in served CSS). The /account CLS 0.128 is login-bridge geometry, not fonts.
- The recent Space Mono `preload:true` fix (commit 8412b3ca) is correct and necessary — Space Mono drives always-visible above-the-fold chrome (header utility bar, footer, mega panels); without preload, `display:optional` locks the fallback.
- **Caveat is dead weight** — loaded but never rendered (only in `layout.tsx` + `globals.css:9`).
- Harness blind spot: `discoverWarmupAssetUrls` parses only in-HTML preload tags, so fonts (header-only) are never warmed; the harness cannot regression-detect a dropped font preload.
- Production risk: a reverse proxy/CDN can strip/truncate the `Link` response header (the fork's `reactMaxHeadersLength.md` explicitly warns of this) — unlike in-head image preloads, which survive. Must verify on the real preview edge.

**Recommendations:** Remove Caveat (and update `scripts/component-contracts/performance-fonts.test.mjs`). Keep everything else as-is — do NOT switch to `display:swap` or add preconnect (would regress CLS=0). Add a `Link`-header font-warmup/assertion to the harness. Verify the preview edge preserves the `Link` header.

**Caveat:** font loading is *not* what blocks Performance 100 — it is canonical best-practice already. No font change moves the LCP gap.

### 4. JavaScript, CSS & bundles

**Current state (verified):** Turbopack build, all scripts `async` (zero render-blocking JS), polyfill chunk `noModule`-gated (39.5 KB gz, skipped by modern Chrome/Lighthouse). Per-route modern JS ~259–281 KB gz; non-Sentry/non-polyfill baseline ~121 KB gz. Single shared Tailwind 4 CSS ~18.7 KB gz, render-blocking `<link>` (small, not a meaningful blocker). 53 client components, all on interactive leaves. No `next/dynamic`. lucide-react already in the fork's default `optimizePackageImports`. embla code-split per route. sanitize-html/@portabletext never reach the client (both carry `import 'server-only'`).

**Key findings:**
- **Sentry SDK = 451,939 bytes raw / 141,456 bytes gz (~138 KB), in `firstLoadChunkPaths` for all 46 routes** (build-verified via `route-bundle-stats.json`). ~52% of every route's client JS, doubling a healthy 121 KB baseline on pure-text routes, for zero benefit when DSN is unset. Bundled unconditionally because `instrumentation-client.ts:1` top-level `import * as Sentry` runs regardless of the runtime DSN guard.
- The fork ships `next experimental-analyze` (Turbopack-only); `@next/bundle-analyzer` (Webpack) does NOT apply.
- Async script count is **per-route** (11–12 leaf scripts + 1 noModule), not a flat 12.
- `excludeTracing:true` is a **real** Sentry option (`tracesSampleRate:0` makes tracing dead weight) but its tree-shake efficacy under **Turbopack is unverified** — measure before/after; prefer the conditional/no-op client SDK (removes ~138 KB with certainty).

**Recommendations (highest-leverage in the dimension):** Gate/lazy-init or no-op the client Sentry SDK behind a DSN check (`src/instrumentation.ts` already uses the exact runtime-gated `await import` pattern, lowering risk — but the no-op file must still export `onRouterTransitionStart`). Adopt `next experimental-analyze` to baseline before/after. Add a per-route JS-byte budget assertion to the readiness probe. Leave Tailwind CSS, lucide, and embla as-is (already optimal).

**Honest caveat:** trimming Sentry improves TBT/INP and the unused-JS audit but is **not guaranteed to move LCP** (the binding constraint). The unused-JS/legacy-JS audits are already structurally satisfied.

### 5. Third-party scripts strategy

**Current state (verified):** Unusually disciplined. **Trustoo = 100% server-side** (`'use cache'` fetch in a Server Component, zero client JS). **/search = server-side Searchanise API** (`import 'server-only'`), no widget JS. The only client third party is the **Searchanise recommendation widget** — already IntersectionObserver-gated (`rootMargin:'800px 0px'`) + `strategy="lazyOnload"`, below-fold on PDP/cart with a server-rendered fallback. **Analytics (GA4/GTM/Meta/Klaviyo) double-gated:** mode (`fake`/`disabled`) AND consent-default-deny (`DEFAULT_CONSENT analytics:false`) — a cold PSI run loads **zero analytics bytes**.

**Key findings:**
- **Measurement gap (central):** all prior evidence was captured with `NEXT_PUBLIC_ANALYTICS_MODE='fake'` and `SEARCHANISE_ENABLED='false'` (`probe-lighthouse.mjs:167-169`, applied to both build and start). Documented LCP failures are categorically **not** caused by third parties; the "tags live" ceiling is **unmeasured**.
- **Corrected: there is no always-on default-denied gtag bootstrap.** With `DEFAULT_CONSENT analytics:false`, the consent-init script, gtag loader, GTM, Meta, and Klaviyo all render nothing. The cold-run conclusion is *stronger* than originally stated, but the mechanism described was wrong.
- **Corrected host:** the recs widget loads `init.js` from `searchserverapi.com` (script-src); the server search API uses `searchserverapi1.com` (connect-src). Note `searchserverapi.com` is **not** in connect-src — a latent CSP-enforcement gap for the widget's runtime XHRs.
- PDP Shopify-analytics inline scripts (`page.tsx:251-271`) fire unconditionally (gated only by product id, not consent/pixel flag) but are **inert** (set `window.ShopifyAnalytics.meta`/`__st` only; no tracker JS loads).
- The Sentry SDK is the **one unconditionally-executing** piece (covered above) — not consent-gated, easy to overlook because it's first-party.

**Recommendations:** Add a "tags-live" harness mode (test GA4 id + Searchanise enabled + seeded `teavision_consent=granted`) to measure the worst case; report cold/default-deny and consented numbers side by side. Keep consent-default-deny + lazyOnload as primary strategy. Consent-gate the inert PDP inline scripts (compliance hygiene, ~zero perf value). `dns-prefetch` (not preconnect) for consent-gated hosts; preconnect only `cdn.shopify.com`.

### 6. Caching, network & server response

**Current state (verified):** No custom `Cache-Control` headers — only security headers on `/:path*`. Next **force-applies** `public, max-age=31536000, immutable` on `_next/static` (cannot be overridden; platform-independent). `next start` (local lab) emits **gzip**; the real host (if Vercel) serves **brotli** at the edge. `cacheComponents:true`; `'use cache'` + `cacheTag` + `cacheLife('hours'|'minutes')` correctly applied across product/collection/blog/Trustoo. PPR active (static shell streams). Shopify transport uses `cache:'no-store'`, delegating caching to the enclosing `'use cache'` scope.

**Key findings:**
- Same two config gaps as Images: **`formats` (AVIF off)** and **`minimumCacheTTL` (4h default)**.
- **Zero resource hints** despite dependence on `cdn.shopify.com`, `searchserverapi.com`, `api.trustoo.io`, `googletagmanager`.
- **Corrected: brotli does NOT help LCP images.** Vercel excludes already-compressed image formats (JPEG/PNG/WebP/AVIF) from compression — brotli helps HTML/JS/CSS/SVG/JSON only. The image-LCP routes' LCP lever is AVIF + sizing + preconnect, not compression.
- **Corrected: `next start` on `127.0.0.1` is a secure context** — `is-on-https` generally *passes* on loopback; the issue is it's not *representative* of the real HTTPS deployment (HSTS, redirects, mixed-content from third parties differ). Verify on the real preview.
- **Flagged unverified:** the "static HTML edge-cached up to 31 days" figure is a Vercel-default assumption; this app sets no custom `Cache-Control` on HTML routes. The `_next/static` immutable ~1yr is confirmed (Next-forced).
- **Corrected build legend:** only `/account/logout` + `/api/*` are `ƒ` Dynamic; the other `/account/*` routes are `◐` PPR.

**Recommendations:** Run PSI on the warm preview FIRST (measurement only, D-03). Add `formats:['image/avif','image/webp']`; add `<link rel=preconnect>` to `cdn.shopify.com` + `dns-prefetch` for consent-gated hosts (in the server layout so it lands in `<head>`); raise `minimumCacheTTL`. Document that immutable+brotli+edge-cache are platform-provided (not `next.config.ts`) to prevent Phase-17-style "fixing a non-issue." Promote CSP from Report-Only to enforced is a **Best-Practices** item, not Performance — and only after a clean report-only run.

### 7. Accessibility (to 100)

**Current state (live-axe verified):** Strong baseline — single skip link, proper landmarks, all icon buttons carry `aria-label` (enforced at the type level in `icon-button.tsx`), decorative icons `aria-hidden`, forms labeled, `StarRating` `role="img"`+label, payment SVGs `<title>`+`aria-labelledby`, `prefers-reduced-motion` honored. **The ONLY failing scored audits are `color-contrast` (every route) and `heading-order` (/account, /search).** Live scores: / 97, privacy 96, cart 96, /account 95, /search 95 — matching the evidence A11y column exactly.

**Key findings (from raw axe nodes, not inference):**
- **`color-contrast`** from three warm tokens at small sizes: `text-ink-faint` (#6c7872, 4.0–4.48:1, widest — 66 files), `text-gold` (#cca464, ~2.14:1 on light), `text-gold-deep` (#a27742, 3.35–3.92:1). Plus over-image hero text and the `bg-ink/40` trust strip where **axe samples the image (#9da09a), so no text-color change alone fixes it** — needs an opaque scrim.
- **Completeness correction:** the homepage *also* fails `color-contrast` on multiple `text-ink-faint` nodes (testimonials cite, contact form labels, popular-searches) — broader than the summary implied, but the `ink-faint` token nudge covers them all.
- **`heading-order`:** /account fails on the footer `<h3>` columns (h1→h3 skip); /search fails on product-card `<h3>` titles after the `<h1>` with no intervening `<h2>`.
- Lighthouse a11y is **binary per audit** — fixing 19 of 20 contrast nodes still scores 0. Every failing node on a route must clear.

**Recommendations (all warm-palette + D-09 compliant):** Darken `--color-ink-faint` (~L50%) and `--color-gold-deep` (~L52%) in OKLCH (keep hue/chroma). Restrict `text-gold` to dark backgrounds. Add an opaque hero scrim / denser `bg-ink/40` band (CSS only, no LCP regression). Fix heading-order via footer `h3→h2` (`link-list.tsx`, `quality-column.tsx`, `newsletter-column.tsx`) + an sr-only `<h2>` "Search results" on /search. Re-run on the preview and confirm on real PSI (over-image sampled background can vary by viewport).

### 8. Best Practices & SEO (to 100)

**Current state (verified):** SEO — every route applies `withNoindexRobots` (noindex meta when `DISABLE_INDEXING=true`); titles/descriptions/canonical/OG present; image API uses `preload` not deprecated `priority`. Best Practices — HSTS+preload, `poweredByHeader:false`, no public source maps, stable aspect ratios, CSP in **Report-Only**. **Measurement gap:** harness runs both categories but records neither.

**Key findings:**
- **SEO `is-crawlable` weight = 93/23 ≈ 31%** (verified directly in installed config), *by design* so noindex fails the category. Noindexed-preview SEO ceilings at **~69/100** (verified: 9/13.043 = 69.0% best case).
- **Best Practices total weight = 27**, heavyweights `is-on-https`(5), `deprecations`(5), `third-party-cookies`(5); **corrected enumeration adds `paste-preventing-inputs`(3)** (unlikely to fail here — no paste-blocked password/2FA inputs), plus several weight-1 audits. `valid-source-maps` and `csp-xss` are **weight 0**.
- **Dropped citations:** the original "SEO restructure" external sources (a placeholder GitHub issue #12345 and a DebugBear article that *contradicts* the claim) are wrong — the authoritative proof is the installed `default-config.js`: SEO = `is-crawlable`(93/23) + 9 weight-1 audits + `structured-data`(0). tap-targets/viewport/font-size are NOT in SEO in v13.
- **Tap-targets is now an Accessibility audit** (`target-size`), not SEO — do not chase it under SEO.

**Recommendations:** Score SEO on a temporary **indexable** build as the SEO score of record; document the preview's intentional ~69. Extend `summarizeLhr` to capture BP+SEO scores. Run a "tags live" Best Practices measurement and itemize vendor console errors / deprecated APIs / third-party cookies. Do **not** enable `productionBrowserSourceMaps` (weight 0, leaks source). Verify HTTPS/HSTS on the real preview.

### Cross-cutting: Next.js 16 framework levers

- `next/image` `priority` is **deprecated** → use `preload` (codebase already migrated). `cacheComponents:true` **IS** PPR (`experimental.ppr`/`experimental_ppr` removed). Route-segment `dynamic`/`revalidate`/`fetchCache` **removed** under Cache Components — use `'use cache'` + `cacheLife`/`cacheTag`. `images.qualities` defaults `[75]` and is required (project's `[68,75]` correct). `next lint` removed; `middleware`→`proxy` (no edge in proxy).
- **`experimental.inlineCss`** (inline `<style>` for Tailwind) is a real FCP/LCP lever — production-only, global, re-downloads CSS per HTML response (TTFB cost for returning visitors). A/B on PSI, do not adopt blind.
- **`unstable_instant = { prefetch: 'static' }`** validates the static shell at dev/build time — useful dev-time guardrail for the Cache-Components structure.
- **Dropped build-risk claim:** the Sentry `webpack` option is the 2nd arg to `withSentryConfig` (a Sentry build option), confirmed in `next.config.ts:72-74`. It does NOT trigger Next 16's webpack-config-fails-Turbopack guard. The build runs on Turbopack normally.

---

## Impact × Effort Prioritization

Sorted high-impact/low-effort first. "Wave" maps to the plan structure below.

| # | Recommendation | Dimension | Impact | Effort | Risk | Wave |
|---|---|---|---|---|---|---|
| 1 | Stand up public noindexed preview + scripted PSI (`probe-psi.mjs`); make PSI the score of record | Measurement | High | Med | Low (keep noindex + auth off) | **1** |
| 2 | Extend `summarizeLhr` to record Performance/Best-Practices/SEO scores + per-audit a11y enumeration | Measurement | High | Low | None | **1** |
| 3 | Add `images.formats: ['image/avif','image/webp']`; re-baseline LCP warm | Images/Caching | High | Low | First-encode slower + 2× cache; warm before measuring | **2** |
| 4 | Add preconnect `cdn.shopify.com` + dns-prefetch consent-gated hosts (server layout `<head>`) | Caching | Med | Low | Over-preconnect waste; scope to image routes | **2** |
| 5 | Fix `content.ts` hero dims 1440×810 → 1440×650 | Images | Low | Low | None (latent-bug fix) | **2** |
| 6 | Darken `--color-ink-faint` (~L50%) + `--color-gold-deep` (~L52%) OKLCH | A11y | High | Low | Re-run axe all routes | **4** |
| 7 | Fix heading-order: footer `h3→h2` + sr-only `<h2>` on /search | A11y | High | Low | Footer change is global; verify outlines | **4** |
| 8 | Gate/no-op/lazy-init client Sentry SDK behind DSN check | JS/bundles | High | Med | Must preserve `onRouterTransitionStart` export; lose very-early error capture | **3** |
| 9 | Add opaque hero scrim / denser trust-strip band (CSS only) | A11y | High | Med | Aesthetic — preview for owner approval | **4** |
| 10 | Restrict `text-gold` to dark backgrounds (audit all usages) | A11y | Med | Med | Gold eyebrows on light shift to gold-deep | **4** |
| 11 | Reduce collection preloads 3 → 1 | Images | Med | Low | Verify first DOM card = visual first | **2** |
| 12 | Raise `minimumCacheTTL` to ~31 days | Images/Caching | Low | Low | Stale if source replaced at same URL (Shopify URLs versioned) | **2** |
| 13 | Add hero `blurDataURL` LQIP | Images | Med | Low | Keep fill+sizes+preload+alt="" | **2** |
| 14 | Add "tags-live" harness mode + measure consented worst case | Third-party | High | Med | Real GA4/Meta calls — use throwaway id | **3** |
| 15 | Raise/remove PDP gallery 800px Shopify cap | Images | Med | Low | Larger fetch; keep quality=68 | **2** |
| 16 | Remove unused Caveat font (+ update contract test) | Fonts | Low | Low | Update `performance-fonts.test.mjs` same change | **2** |
| 17 | Add per-route JS-byte-weight assertion to readiness probe | JS/bundles | Med | Low | None | **3** |
| 18 | `next experimental-analyze` baseline before/after Sentry | JS/bundles | Med | Low | Experimental flag; diagnostic only | **3** |
| 19 | Score SEO on temporary indexable build; document preview ~69 | SEO | High | Low | Must never link/submit indexable build | **4** |
| 20 | Run tags-live Best Practices; itemize vendor cookies/console/deprecations | Best Practices | High | Med | May reveal unfixable ceiling — document honestly | **4** |
| 21 | Consent-gate inert PDP Shopify inline scripts | Third-party | Med | Low | Verify checkout doesn't read `__st` pre-consent | **3** |
| 22 | Add `Link`-header font-warmup/assertion to harness | Fonts | Med | Med | Parse header format correctly | **3** |
| 23 | Verify preview edge preserves font `Link` header (curl -D) | Fonts/Caching | Med | Low | Stripped header → fallback locks | **1** |
| 24 | Evaluate `experimental.inlineCss` via A/B PSI | Next 16 | Med | Low | Hurts returning visitors (TTFB); measure both | **3** |
| 25 | Prune/downscale oversized `/public` PNGs | Images | Low | Med | Verify references before deleting | **5** |
| 26 | Final evidence doc; supersede PERF-01 acceptance | Measurement | High | Low | None | **5** |

---

## Recommended Plan & Wave Structure

The phase's working assumption is a set of requirements **PSI-01..PSI-15** (proposed mapping below; the planner owns final IDs). The decomposition is deliberately measurement-first to honor D-03 and avoid Phase-17 churn.

**Wave 1 — Measurement + root-cause spike & preview deploy** (covers PSI-01, PSI-02, PSI-03)
- Stand up public, auth-disabled, **noindexed** preview (belt-and-suspenders: Vercel header noindex if Vercel + app `DISABLE_INDEXING=true`). Confirm the host (open question).
- Build `scripts/performance/probe-psi.mjs` (PSI REST, mobile; desktop if in scope) → `docs/launch/psi-evidence.md`. Run cold+warm.
- Extend `summarizeLhr` to record Performance/BP/SEO category scores + per-audit a11y enumeration.
- Capture edge headers (Content-Encoding, `_next/static` Cache-Control, font `Link` header, AU TTFB).
- **Gate:** PSI numbers exist for all 9 routes; lab↔PSI reconciliation documented; root cause of each LCP confirmed as artifact or real defect. *Only then proceed.*

**Wave 2 — Image / font / CWV config wins** (covers PSI-04, PSI-05, PSI-06)
- `images.formats:['image/avif','image/webp']`; `minimumCacheTTL` ~31d; preconnect `cdn.shopify.com` + dns-prefetch consent hosts; fix `content.ts` hero dims; hero `blurDataURL`; collection preloads 3→1; PDP 800px cap raise; remove Caveat font (+ contract test). Re-measure warm PSI per route.

**Wave 3 — JS / third-party / caching hardening** (covers PSI-07, PSI-08, PSI-09, PSI-10)
- Gate/no-op/lazy-init client Sentry SDK; `next experimental-analyze` before/after + JS-byte-budget assertion; "tags-live" harness mode + consented measurement; consent-gate inert PDP inline scripts; font `Link`-header warmup/assertion; A/B `experimental.inlineCss`.

**Wave 4 — A11y / Best Practices / SEO to 100** (covers PSI-11, PSI-12, PSI-13)
- A11y: ink-faint + gold-deep OKLCH nudges; restrict text-gold; hero scrim (owner preview first); heading-order markup. Re-axe all routes to zero scored failures.
- SEO: score on a temporary indexable build; document the noindexed ~69.
- Best Practices: tags-live measurement + itemized ceiling; verify HTTPS/HSTS on preview.

**Wave 5 — Final evidence + supersede PERF-01** (covers PSI-14, PSI-15)
- Consolidated `psi-evidence.md` with cold/default-deny vs tags-live deltas, per-category final scores, and honest waivers where 100 is not physically reachable. Supersede `performance-acceptance.md` / PERF-01. Optional `/public` PNG cleanup.

**Proposed requirement mapping:**
- PSI-01 public noindexed preview; PSI-02 scripted PSI score-of-record; PSI-03 harness records all category scores + per-audit a11y.
- PSI-04 AVIF + minimumCacheTTL; PSI-05 resource hints; PSI-06 hero/collection/PDP image tuning + LQIP + font cleanup.
- PSI-07 Sentry payload reduction; PSI-08 bundle analysis + JS budget; PSI-09 tags-live third-party ceiling; PSI-10 caching/inlineCss evaluation.
- PSI-11 Accessibility 100 (contrast + heading-order); PSI-12 SEO 100 on indexable build (+ documented preview ~69); PSI-13 Best Practices 100 tags-off + tags-live ceiling.
- PSI-14 consolidated evidence + honest waivers; PSI-15 supersede PERF-01.

---

## Validation Architecture

Every remediation is verified against the **score of record (real PSI)** plus deterministic local guards. This section also defines the regression guards that protect prior phases.

**Primary — real PSI (the score of record, D-01):**
- `scripts/performance/probe-psi.mjs` runs the PSI REST API (mobile; desktop if in scope) per route, writing machine-readable JSON + `docs/launch/psi-evidence.md`. Each Wave 2/3 change is verified by a warm PSI re-run vs the Wave 1 baseline. Two profiles are recorded where relevant: **cold/default-deny** (consent unset — the legitimate CWV basis) and **tags-live** (consent granted — the documented ceiling).

**Inner loop — local Lighthouse harness (`probe-lighthouse.mjs`):**
- Keep `simulate`/mobile (matches PSI). Extend `summarizeLhr` to surface Performance/BP/SEO category scores and **enumerate failing a11y audits** (not just the number). Treat the existing pass/fail thresholds (LCP 2500/CLS 0.1/TBT 300) as a **regression tripwire only** — absolute local LCP is directional, reconciled to PSI. Add a per-route **JS-byte budget** so the Sentry win can't silently regress, and a **font `Link`-header warmup/assertion** to close the font blind spot.

**Accessibility — axe-via-Lighthouse + raw nodes:**
- Re-run accessibility-only against all 9 routes; assert **zero scored failing audits** per route (binary). Validate contrast with an OKLCH→WCAG script (the same method used in research) confirming ink-faint/gold-deep clear 4.5:1 at 11px on paper/paper-2/card/gold-tint *before* committing token values. Confirm the over-image hero scrim on **real PSI** (sampled background varies by viewport).

**Best Practices / SEO:**
- SEO 100 verified on a **temporary indexable build** (`DISABLE_INDEXING=false`) via PSI, captured once, then torn down. Best Practices verified on the **real HTTPS preview** (so `is-on-https`/HSTS are representative), tags-off for the 100 claim and tags-on for the documented ceiling.

**Contract / unit tests:**
- Update `scripts/component-contracts/performance-fonts.test.mjs` when removing Caveat (else it fails on the asserted caveat block). Keep the existing `product-card.test.tsx` assertions that exactly one `<link rel=preload as=image>` renders and no `loading="eager"`/`fetchPriority="high"` regression (guards D-10).
- Existing image-preload, font display:optional, and no-deprecated-`priority` assertions stay green through all waves.

**Regression guards for Phase 18 (crawlable HTML) and Phase 19 (single visible H1) — REQUIRED:**
- Any Cache-Components / streaming / Suspense / `'use cache'` boundary change (notably the Sentry gating, `inlineCss`, or any hero/JSON-LD adjustment) **must** re-run the existing SEO probes (`scripts/seo/probe-launch-seo.mjs`) and the H1 invariant test. The static shell must still contain the crawlable H1/content; JSON-LD scripts on PDP must stay server-rendered. The fork's `<Activity>` DOM-retention mechanism (the known multiple-H1 bug, per project memory) means H1/SEO must be re-verified after *any* streaming-adjacent edit, not assumed.
- A11y heading-order fixes use footer `h3→h2` + an **sr-only** `<h2>` only — **no second visible `<h1>`**, no visible-heading restructure (honors D-09 single-visible-H1).
- The image AVIF/scrim/LQIP changes are CSS/config only and must not regress the rendered `preload` posture (D-10) — verified by the existing `product-card` test plus a warm PSI LCP re-check.

**CI posture:** PSI API is primary evidence; optionally add an LHCI gate later that *calls the PSI API* (one scoring model — do NOT add WebPageTest or a second throttling model).

---

## Risks & Pitfalls

**Measurement / process:**
- **Do not treat local LCP (3.8–4.9s) as a production figure.** It's the simulate-throttle model on a dev box; reproduce on PSI before remediating (D-03) or repeat Phase-17 churn.
- A fresh noindexed preview has **no CrUX field data** — only the lab score is available pre-launch. The tags-live field cost is observable only post-launch via CrUX.
- The cold PSI run *always* sees consent default-deny (clean profile, no localStorage) and never loads GA4 — a cold 100 does **not** prove the consented experience is 100. State which scenario each number represents.
- Don't confuse the readiness "100/100" (automated pass-ratio) with a Lighthouse category score.

**Fork-specific Next 16 gotchas (training-data traps):**
- `next/image` `priority` is **deprecated** — never re-add it; use `preload` (already done).
- **No `experimental.ppr` / `experimental_ppr`** — `cacheComponents:true` IS PPR; the flags are removed.
- Route-segment `dynamic`/`revalidate`/`fetchCache` **removed** under Cache Components — use `'use cache'` + `cacheLife`/`cacheTag`. Any `dynamic='force-static'` advice is wrong here.
- `images.qualities` defaults `[75]` and is required; out-of-allowlist quality is **coerced**, not errored.
- The Sentry `webpack` option is a **Sentry build option (2nd arg)**, not a Next webpack config — **no** Turbopack build failure. Do not open a build-risk workstream.
- `next/script worker` strategy does **not** work in App Router.
- A stray `<Suspense fallback={null}>` above `<body>` opts the whole app out of the static shell — the storefront layout is currently safe; keep it that way.

**Image / caching:**
- **AVIF cold-transform paradox:** enabling AVIF can make the *first* cold run look slower (~50% longer encode) while improving warm/field LCP. Always warm then measure.
- **Local-AVIF transcode trap:** the 24KB hero AVIF is currently transcoded to a larger WebP — enabling AVIF output fixes this; do not "optimize" it into a regression.
- `minimumCacheTTL` has **no invalidation API** — rely on Shopify's versioned URLs if raising it.
- **Brotli does not compress images** — it won't reduce LCP-image bytes on image routes.
- Only **one** LCP candidate per viewport — adding preload/fetchPriority to multiple images causes contention and can worsen LCP.

**Fonts / third-party:**
- `display:optional` requires the preload for any above-the-fold text in that font, or the fallback locks for the session (the Space Mono bug). Don't set `preload:false` on a used font.
- Font `Link` response headers can be stripped/truncated by a proxy/CDN (unlike in-head image preloads) — verify on the preview edge.
- **Sentry is the one tag a cold run executes** — easy to overlook because it's first-party.
- Preconnecting consent-gated hosts before consent opens connections the gate is meant to prevent — use `dns-prefetch` for those.

**A11y / BP / SEO:**
- Lighthouse a11y is **binary per audit** — partial contrast fixes score zero; clear *every* node.
- Over-image text cannot be fixed by text color (axe samples the image) — needs an opaque scrim.
- Footer `<h3>` rides every page — fix heading-order centrally, not per route.
- **SEO 100 is impossible on the noindexed preview (~69 by design)** — score on an indexable build, and never let Google index a pre-launch build.
- Enforcing CSP yields **no** Best-Practices score gain (`csp-xss` weight 0) and risks breaking inline scripts.
- Don't enable public source maps for `valid-source-maps` (weight 0; leaks source).

---

## Open Questions (RESOLVED)

> **Resolution status (2026-06-30):** Q1/Q2 (host + public PSI reachability) — **RESOLVED**: the public Vercel preview `https://teavision-storefront.vercel.app` was successfully fetched by real PSI (see the Addendum above + `20-PSI-EVIDENCE.md`). Q3 (desktop scope) — **RESOLVED**: in scope per D-07 (capture mobile + desktop). Q4 (SEO on a separate indexable build) — **RESOLVED**: yes, per D-04 and plan `20-04` (throwaway indexable build scored once; preview ~69 documented as intentional). Q5/Q6 (which production tags ship / `NEXT_PUBLIC_SENTRY_DSN` on preview) — **assigned** to the `20-01` Task-1 decision checkpoint. Q7 (consent-gated tags under a headless PSI crawl) — **accepted limitation**; CrUX is the true signal post-launch. Q8 (`/account` as a representative route) — **RETAINED** per D-07. Q9 (real product/collection/blog slugs) — **assigned** to the `20-01` Task-1 checkpoint. Q10 (hero scrim visual sign-off) — **owner gate** in `20-04` Task 2. Q11 (gate readiness on scored a11y/BP/SEO audits) — **folded into** `20-05`. The original questions are retained below for traceability.

1. **Host confirmation.** Is the deploy actually Vercel? No `vercel.json`/`.vercel/`/`vercel` in `package.json`; only `teavision-storefront.vercel.app` in SEO audit docs. The entire "auto x-robots-tag noindex + Deployment-Protection toggle + brotli edge" recipe depends on this. The host-agnostic core (public + app-level `DISABLE_INDEXING=true` + auth off + PSI API) is durable regardless.
2. **Can a public, auth-disabled, noindexed preview be stood up** (Deployment Protection / auth wall blocks the PSI fetcher; bypass tokens can't be supplied by PSI's crawler)?
3. **Is desktop in scope**, or mobile-only (the prior evidence and harness are mobile)?
4. **Do we score SEO on a separate indexable build** (the only path to SEO 100) or accept the documented ~69 on the noindexed preview as the D-04 "best alternative"?
5. **Which production tags ship at launch?** `.env.example` ships analytics `fake`, Searchanise disabled, no GA4/GTM/Meta/Klaviyo ids. If most tags are off at launch, the tags-live ceiling is largely moot and Performance/Best-Practices 100 is near-certain. Need owner confirmation.
6. **Is `NEXT_PUBLIC_SENTRY_DSN` set on preview/prod?** If unset, the ~138 KB Sentry client chunk is pure dead weight and the gating fix is risk-free.
7. **Will consent-gated tags fire under a headless PSI crawl** (no consent interaction)? If blocked behind the banner, the tags-live PSI run understates real cost — CrUX is the only true signal.
8. **Should `/account` (a login-redirect bridge with no stable content, robots-disallowed) be a representative Performance-100 route at all?**
9. **Real product/collection handles + a real blog article slug** for the PSI preview (the local harness uses a fake `/products/test-standard-tea` with a local image — not representative of real Shopify image weights).
10. **Does the owner accept the denser hero scrim / trust-strip band visually?** (Per project memory: preview designs before implementing.)
11. **Should the readiness harness gate (FAIL) on any scored a11y/BP/SEO audit**, not just record the number?

---

## References

**Codebase — config & infra:**
- `D:\Work\teavision\teavision.com.au\next.config.ts` (cacheComponents:true L9; images qualities `[68,75]` L34, no `formats`/`minimumCacheTTL`; security headers; Sentry `webpack` opt is 2nd-arg L72-74)
- `src\lib\security\headers.ts` (CSP Report-Only L131; per-tag origins L35-89; HSTS+preload)
- `src\lib\seo\noindex.ts`, `src\app\robots.ts`, `src\app\sitemap.ts`, `src\lib\env\server.ts` (DISABLE_INDEXING L27-29)
- `src\app\layout.tsx` (next/font setup; `<html lang="en-AU">`), `src\app\globals.css` (@theme tokens; `prefers-reduced-motion` L304-313)
- `src\app\(storefront)\layout.tsx` (no Suspense above body — static shell preserved)

**Codebase — components:**
- `src\components\homepage\hero\hero.tsx`, `src\components\homepage\content.ts` (hero src L112; declared dims 810 stale — file is 1440×650)
- `src\components\product\product-gallery\product-gallery.tsx`, `src\components\collection\product-card\product-card.tsx`, `src\app\(storefront)\collections\[handle]\_components\product-list.tsx`
- `src\app\(storefront)\products\[handle]\page.tsx` (Shopify inline analytics L251-271; JSON-LD; Suspense)
- `src\lib\reviews\trustoo.ts` (server-side `'use cache'`), `src\lib\searchanise\search.ts` (server-only)
- `src\components\product\searchanise-recommendations\searchanise-script-loader.tsx` (lazyOnload L68; init.js host `searchserverapi.com`)
- `src\components\analytics\destination-loader\destination-loader.tsx`, `src\lib\consent\adapter.ts` (DEFAULT_CONSENT analytics:false)
- `instrumentation-client.ts` (top-level `import * as Sentry`), `src\instrumentation.ts` (runtime-gated `await import` pattern)
- Footer: `link-list.tsx`, `quality-column.tsx`, `newsletter-column.tsx` (h3 → h2 targets); `eyebrow.tsx`, `icon-button.tsx`, `star-rating.tsx`

**Codebase — harness & evidence:**
- `scripts\performance\probe-lighthouse.mjs` (mobile/headless, default throttle; warmup L1053-1142; `summarizeLhr` a11y-only L673; env fake/disabled L167-169)
- `scripts\launch\run-final-readiness-audit.mjs` (pass-ratio score L509; perf acceptance L352-381)
- `scripts\seo\probe-launch-seo.mjs`, `scripts\component-contracts\performance-fonts.test.mjs`, `src\components\collection\product-card\product-card.test.tsx`
- `docs\launch\performance-evidence.md`, `docs\launch\performance-acceptance.md`, `docs\launch\final-production-readiness-report.md`, `docs\launch\seo-audit-pdf-compliance-2026-06-30.md`
- `.next\diagnostics\route-bundle-stats.json` (Sentry chunk `0favquk__4m47.js` 451,939 raw / 141,456 gz in all 46 routes' firstLoad)

**Next 16 fork docs (`node_modules/next/dist/docs/`):**
- `01-app/03-api-reference/02-components/image.md` (preload vs deprecated priority L265-293; formats default ['image/webp'] L738; minimumCacheTTL 14400 L783; AVIF 20%/50% L770; SVG auto-unoptimized L937)
- `02-components/font.md` (preload-as-head-tag L148 — diverges from observed Link-header behavior), `02-components/script.md` (strategies; worker pages-only)
- `05-config/01-next-config-js/`: `cacheComponents.md` (IS PPR; Activity DOM-retention L36-40), `headers.md` (force-immutable L397), `compress.md` (gzip default L8), `inlineCss.md`, `reactMaxHeadersLength.md` (proxy truncation warning), `productionBrowserSourceMaps.md`
- `03-file-conventions/02-route-segment-config/index.md` (dynamic/revalidate/fetchCache removed), `instant.md` (unstable_instant)
- `02-guides/upgrading/version-16.md` (priority deprecated, PPR flag removed, minimumCacheTTL 60s→4h, qualities→[75], next lint removed, middleware→proxy), `02-guides/package-bundling.md` (next experimental-analyze, Turbopack-only)

**Lighthouse 13.4.0 (installed):**
- `node_modules/lighthouse/core/config/default-config.js` (weights FCP10/SI10/LCP25/TBT30/CLS25; SEO is-crawlable 93/23; BP total 27)
- `node_modules/lighthouse/core/config/constants.js` (simulate, mobileSlow4G 150ms/1.6Mbps/750Kbps-up, 4× CPU, Moto G Power)
- `node_modules/.pnpm/@paulirish+trace_engine@0.0.65/.../Statistics.js` (log-normal curve — green-100 ceilings)

**Sentry (build-option structure verification):**
- `node_modules/@sentry/nextjs/build/cjs/config/withSentryConfig/deprecatedWebpackOptions.js`, `getFinalConfigObjectBundlerUtils.js` (webpack opt is Sentry-namespaced; Turbopack-aware)

**External (web):**
- developer.chrome.com Lighthouse performance/accessibility/seo scoring; is-crawlable, third-party-facades docs
- vercel.com/docs (edge caching; compression brotli-first, excludes images) — *host assumption unverified in-repo*
- GoogleChrome/lighthouse docs/throttling.md (simulate vs packet-level)
- web.dev optimize-cls; simonhearne.com layout-shifts-webfonts; debugbear.com (lighthouse-performance, simulated-throttling, why-PSI-differs)

---

## Research Coverage Note

This RESEARCH.md was produced by an 11-dimension parallel research+verify workflow (2026-06-30, 21 agents, ~2.7M tokens). Nine dimensions completed and were adversarially fact-checked against the codebase, the installed Lighthouse 13.4.0 config, and the Next fork docs. Two agents hit transient API rate limits and did not return structured output: the dedicated **LCP root-cause** agent and the **INP/CLS interactivity** agent. Their topics are still covered here: LCP root-cause is synthesized in *Root-Cause Analysis: The LCP Gap* from the verified measurement/images/caching dimensions; CLS is covered (the `/account` 0.128 attributed to login-bridge geometry) but the **exact shifting element on `/account/login` is not yet pinpointed** — that diagnosis is assigned to the Wave 1 measurement spike. INP does not affect the Lighthouse **lab** Performance score (lab weight 0; TBT is the in-lab proxy and is already green at 45–67ms); INP is a field/CrUX metric to confirm post-launch.

---

## Addendum — Real PSI Baseline (2026-06-30) corrects the central hypothesis

After this research was synthesized, the owner supplied a **real Google PSI run for `/`** against the public Vercel preview `https://teavision-storefront.vercel.app` (full detail in `20-PSI-EVIDENCE.md`). It **partially overturns the "LCP is simulate-throttle artifact" hypothesis** for image routes:

- Homepage `/`: FCP 1.1s ✅, TBT 90ms ✅, CLS 0 ✅, but **LCP 3.4s** and **Speed Index 5.1s** (est. Performance ~86).
- The LCP breakdown shows **Resource load delay = 2,040 ms** on a 14.8 KiB hero image — a real critical-path defect, not lab noise.
- Root cause is concrete and threefold: (1) the hero preload **lacks `fetchpriority=high`** (PSI "LCP request discovery" audit fails on exactly this); (2) **render-blocking CSS ≈ 540 ms** (two stylesheets) — this **upgrades** the earlier "CSS is a negligible blocker" finding; (3) the **~142 KiB always-on Sentry chunk** (88 KiB unused + 13.9 KiB legacy polyfills) consuming the early Slow-4G bandwidth window.

**Corrections to the body above:**
- The "almost certainly measurement artifact" framing holds only for the **text-LCP routes** (cart/search/privacy), still unmeasured on real PSI. For **image routes** the LCP defect is real and fixable.
- **`fetchPriority="high"` on the hero is now the single highest-leverage fix** and is the prescribed remediation (see refined D-10 / new D-15). The body's blanket caution against `fetchPriority` conflated it with the deprecated `priority` prop — they are distinct (image.md:287–289 recommends `fetchPriority="high"` for LCP).
- Render-blocking CSS (540 ms measured) elevates the `experimental.inlineCss` evaluation from "nice to have" to a real lever.
