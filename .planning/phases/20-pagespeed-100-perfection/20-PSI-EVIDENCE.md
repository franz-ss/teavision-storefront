# Phase 20 — Real PSI Baseline (owner-supplied, 2026-06-30)

**Source:** Owner ran Google PageSpeed Insights against the live public preview **`https://teavision-storefront.vercel.app`** and supplied the report screenshots in-session on 2026-06-30.
**Tool:** Lighthouse 13.4.0, Emulated Moto G Power, **Slow 4G** throttling, HeadlessChromium 146.0.7680.177, single page session, initial page load.
**Captured:** 2026-06-30, 3:35 PM GMT+8.

> This is the Wave-1 `/` baseline. It **confirms the preview exists, is public, and is PSI-fetchable** (research Open Questions 1 & 2 answered: host **is** Vercel). It also **partially overturns the research's central hypothesis**: on this real *image* route the LCP gap is a **genuine, fixable defect**, not a simulate-throttle artifact. The lab-artifact theory still likely holds for the *text*-LCP routes (cart/search/privacy), which are not yet measured on real PSI — Wave 1 must still measure all 9 routes.

## Homepage `/` — metrics

| Metric | Value | Status |
| --- | --- | --- |
| First Contentful Paint | 1.1 s | ✅ green |
| Total Blocking Time | 90 ms | ✅ green |
| Cumulative Layout Shift | 0 | ✅ perfect |
| Largest Contentful Paint | **3.4 s** | 🟧 needs improvement |
| Speed Index | **5.1 s** | 🟧 needs improvement |

Estimated Performance score from these metrics (Lighthouse weights TBT 30 / LCP 25 / CLS 25 / FCP 10 / SI 10): **~86** (not shown in the screenshot; derived). The two orange metrics (LCP, SI) are the entire gap and share one root cause.

## LCP breakdown — the smoking gun

LCP element = the homepage hero AVIF (`main#main-content > div.bg-paper > section.relative > img.absolute`, served via `/_next/image?url=…homepage-hero-tea-harvest-lcp.avif`, **14.8 KiB**).

| LCP subpart | Duration |
| --- | --- |
| Time to first byte | 410 ms |
| **Resource load delay** | **2,040 ms** ← 60% of LCP |
| Resource load duration | 720 ms |
| Element render delay | 30 ms |

The browser idles **~2 seconds before it starts downloading a 14.8 KiB image**. That is a real prioritization/critical-path defect, not measurement noise.

## Failing / flagged audits (homepage `/`)

1. **LCP request discovery** — ✅ not lazy-loaded, ✅ discoverable in initial document (the `preload` `<link>` is present), ⛔ **`fetchpriority=high` should be applied to the image preload request**. ← the direct cause of the 2,040 ms resource-load-delay.
2. **Render-blocking requests — est. 540 ms.** Two stylesheets block first render: `…lpg.css` 19.3 KiB / 600 ms + `…2k3.css` 2.9 KiB / 150 ms.
3. **Reduce unused JavaScript — est. 88 KiB.** A single first-party chunk `3cagti3ou0q1b.js` = **141.9 KiB transfer, 87.6 KiB unused** — almost certainly the always-on Sentry browser SDK (research finding: ~138 KiB on all routes).
4. **Legacy JavaScript — est. 14 KiB.** The same `3cagti3ou0q1b.js` chunk ships transpiled polyfills (`Array.prototype.at`/`flat`/`flatMap`, `Object.fromEntries`/`hasOwn`, `String.prototype.trimEnd`/`trimStart`). Gating Sentry removes these too.
5. **Improve image delivery — est. 9 KiB** (hero ~4.7 KiB). The source is `.avif` but, with `images.formats` unset (WebP-only), it's re-encoded to a larger WebP for AVIF-capable browsers. Enabling AVIF output recovers this.

## Diagnosis — three reinforcing causes of the 2,040 ms delay

On Slow-4G (~1.6 Mbps ≈ 200 KB/s), the hero image is queued behind everything else on the early critical path:
- **Missing `fetchpriority=high`** → the preloaded hero is not prioritized over render-blocking CSS and the large JS chunk.
- **Render-blocking CSS (540 ms)** → blocks first render and competes for the early pipe.
- **142 KiB Sentry chunk** → consumes ~0.7 s of the early bandwidth window.

All three fixes attack the same binding metric. Expected effect: LCP toward **~1.5 s**, Speed Index down with it, Performance into the **mid-90s**. A literal mobile 100 stays hard (Speed Index is stubborn), documented per D-04.

## Implications for the plans

- **20-02 must add `fetchPriority="high"` to the hero** and target the PSI "LCP request discovery" audit passing — this REVERSES the plan's original "no fetchPriority" line for the hero. `fetchPriority` is a distinct, current `next/image` prop (image.md:287–289, recommended for LCP), NOT the deprecated `priority` prop (image.md:293) — so D-10 is honored. See refined **D-10** and new **D-15** in 20-CONTEXT.md.
- **Render-blocking CSS is a confirmed 540 ms lever** — elevate the `experimental.inlineCss` evaluation (currently 20-03) and/or address in 20-02; it is no longer "negligible."
- **Wave 1 (20-01)** host-confirmation checkpoint is largely answered: preview is Vercel, public, PSI-reachable. Remaining checkpoint items: PSI auth-bypass confirmed off, the real product/collection/blog slugs, desktop scope (yes per D-07), and whether `NEXT_PUBLIC_SENTRY_DSN` is set on preview. Wave 1 extends this `/` baseline to the other 8 routes and root-causes each.

## Not yet measured (Wave 1 must capture)

- Real PSI for the other 8 routes: `/products/<handle>`, `/collections/all`, `/cart`, `/search?q=tea`, `/account`, `/pages/privacy-policy`, `/blogs/teavision-blogs`, one blog article — mobile **and** desktop.
- Whether the text-LCP routes (cart/search/privacy) collapse toward FCP on real PSI (confirming the lab-artifact theory for those).
- The `/account` CLS-0.128 shifting element on real PSI.
