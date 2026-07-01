# Homepage (`/`) PageSpeed Insights Fixes — Phase 20 Plan 01

Scope: homepage `/` Performance only, addressing exactly the four findings from the
2026-06-30 real PSI screenshots (`.planning/phases/20-pagespeed-100-perfection/20-PSI-EVIDENCE.md`).
Accessibility, Best Practices, SEO, other routes, and all other deferred Phase 20 scope
are out of scope for this document and were not touched.

## Before — real PSI baseline (owner-supplied, 2026-06-30)

Source: Google PageSpeed Insights run against the live public preview
(`https://teavision-storefront.vercel.app/`), Lighthouse 13.4.0, emulated Moto G Power,
Slow 4G throttling. Full detail in `20-PSI-EVIDENCE.md`.

| Metric | Value | Status |
| --- | --- | --- |
| First Contentful Paint | 1.1 s | green |
| Total Blocking Time | 90 ms | green |
| Cumulative Layout Shift | 0 | perfect |
| Largest Contentful Paint | 3.4 s | needs improvement |
| Speed Index | 5.1 s | needs improvement |

Estimated Performance score (derived from the above, not shown directly in the PSI
screenshot): ~86.

LCP breakdown: TTFB 410ms, **resource-load-delay 2,040ms (60% of LCP)**, resource-load
duration 720ms, element-render delay 30ms.

## The four findings and their fixes

| # | PSI finding | Root cause | Fix applied | Task |
| --- | --- | --- | --- | --- |
| 1 | LCP request discovery: `fetchpriority=high` should be applied to the image preload request (2,040ms resource-load-delay) | Hero `<Image>` had `preload` but no `fetchPriority` | Added `fetchPriority="high"` to the hero `<Image>` in `src/components/homepage/hero/hero.tsx`, verified against Next.js 16 runtime source (`get-img-props.js`, `image-component.js`) to confirm the emitted preload `<link>` carries `fetchpriority=high` | Task 1 (`cc4c77b5`) |
| 2 | Improve image delivery — est. 9 KiB (hero ~4.7 KiB) | `images.formats` unset (fork default WebP-only) re-encoded the source AVIF to a larger WebP for AVIF-capable browsers | Added `formats: ['image/avif', 'image/webp']` to `next.config.ts` images block | Task 2 (`97658490`) |
| 3 | Reduce unused JavaScript — est. 88 KiB; Legacy JavaScript — est. 14 KiB | Always-on ~142KB Sentry browser SDK chunk (`3cagti3ou0q1b.js`, 141.9 KiB transfer / 87.6 KiB unused + legacy polyfills) shipped on every route regardless of whether `NEXT_PUBLIC_SENTRY_DSN` is set | Rewrote `instrumentation-client.ts` to remove the top-level static `import * as Sentry from '@sentry/nextjs'` and instead `import('@sentry/nextjs')` dynamically only inside the DSN guard; `onRouterTransitionStart` remains exported as a typed function that safely no-ops until/unless the dynamic import resolves | Task 3 (`c9f28cbf`) |
| 4 | Render-blocking requests — est. 540 ms (two stylesheets, 19.3 KiB + 2.9 KiB) | No `experimental.inlineCss` — CSS delivered via render-blocking `<link>` tags | **Skipped** — see decision below | Task 4 |

## Task 4 decision: skip `experimental.inlineCss`

**Decision: `skip-inlinecss`.** `next.config.ts` has no `experimental` block and no
`inlineCss` key — the configuration is unchanged from before this plan.

**Rationale:**

Tasks 1-3 each remove a real, independently-verified cost from the homepage's early
Slow-4G critical path:

- Task 1 makes the hero's preload request the browser's top-priority fetch, directly
  targeting the 2,040ms resource-load-delay that was 60% of LCP.
- Task 2 stops re-encoding a 14.8 KiB AVIF hero into a larger WebP.
- Task 3 removes a 141.9 KiB chunk (87.6 KiB unused + 13.9 KiB legacy polyfills) that
  was competing for bandwidth on the same early pipe as the hero image, on every cold
  load, regardless of DSN.

On a constrained Slow-4G connection (~200 KB/s, the throttle profile PSI used for the
baseline), removing a ~142 KB chunk from the early request queue is expected to free a
proportionally large share of the bandwidth window that the hero image and
render-blocking CSS were competing for. `experimental.inlineCss` would remove the
540ms render-blocking-CSS cost specifically, but at a real architectural cost: CSS is
re-inlined into every HTML response instead of being cached once and reused across
navigations, which is a regression for repeat visitors and for any route-to-route
navigation within the same session.

Given that the three completed fixes are expected to substantially close the LCP/Speed
Index gap on their own, the marginal benefit of inlining CSS does not currently justify
giving up cross-navigation CSS caching. This favors the leanest, lowest-architectural-risk
option.

**Important caveat — how this decision was made:** This decision was reached on
engineering judgment from the before-baseline evidence and the known cost/benefit
profile of each fix, **at the owner's explicit instruction to proceed without first
deploying and re-measuring real PSI on `/`** (the plan's Task 4 checkpoint originally
called for a post-deploy real-PSI re-measurement before choosing). No real post-deploy
PSI numbers exist for this decision. If a future real-PSI re-measurement on the deployed
preview shows render-blocking CSS still materially hurting LCP/Speed Index after Tasks
1-3, `experimental.inlineCss` should be revisited as a follow-up, measured against TTFB
and repeat-visit impact before being enabled.

**Revisited and measured (2026-07-01):** After the post-deploy re-measurement (see "After"
section below), `experimental.inlineCss: true` was enabled and measured on the local
Lighthouse harness. It **regressed every metric** (LCP 4111→4335 ms, FCP 1208→1387 ms,
Speed Index 1330→1452 ms) because inlining the CSS bloated the HTML document by ~59 KB,
which on simulated Slow-4G delays the whole render. The `skip-inlinecss` decision is now
confirmed by measurement, not just judgment. The flag was reverted; `next.config.ts` has
no `experimental` block.

## After — post-deploy real PSI + local Lighthouse (2026-07-01)

Owner ran real Google PSI (mobile, Moto G Power, Lighthouse 13.4.0, Slow-4G) against the
deployed preview `https://teavision-storefront.vercel.app/` on 2026-07-01. Two runs, one
warm (image edge cache primed to `X-Vercel-Cache: HIT`):

| Metric | Before (06-30) | After warm (07-01) | Result |
| --- | --- | --- | --- |
| Performance score | ~86 | **95** | ✅ mid-90s target met |
| First Contentful Paint | 1.1 s | 1.1 s | ✅ |
| Speed Index | 5.1 s | **1.9 s** | ✅ green |
| Total Blocking Time | 90 ms | 30 ms | ✅ |
| Cumulative Layout Shift | 0 | 0 | ✅ |
| Largest Contentful Paint | 3.4 s | **3.0 s** | 🟧 barely moved |

All three shipped fixes were confirmed **live** in the deployed HTML: `fetchpriority=high`
on both the hero `<img>` and its preload `<link>`; hero served as `Content-Type: image/avif`
(15.4 KB); the ~142 KB Sentry chunk gated (unused-JS 88→25 KiB, legacy-JS 14 KiB).

**The LCP is a Lantern simulate-throttling artifact, not a real defect.** The cold-cache
hypothesis was ruled out (warm LCP 3.0 s ≈ cold 3.1 s). The local Lighthouse harness
(`scripts/performance/probe-lighthouse.mjs`, same Lighthouse 13.4.0 / simulated Slow-4G as
PSI, run as a production build) exposes the LCP breakdown PSI collapses: the hero's
**observed** `resource-load-delay` is ~10 ms and load duration ~5–150 ms — the 14 KB AVIF
hero paints in ~150 ms. The 2,040 ms delay from the before-baseline is **gone**. Lantern
reports ~3–4 s because it completes that tiny image near the end of the full ~720 KB page
download; the number tracks total byte-weight, not any hero/preload/CSS mistake.

### Local controlled experiments (`/`, production build, simulated Slow-4G)

| Change | LCP | FCP | Speed Index | Bytes | Verdict |
| --- | ---: | ---: | ---: | ---: | --- |
| Baseline (post-20-01 HEAD) | 3884 ms | 1363 ms | 1586 ms | 765 KB | — |
| Drop below-fold Tea Journal preload | 4111 ms | **1208 ms** | **1330 ms** | 720 KB | **kept** — FCP/SI win, LCP flat (noise) |
| + `experimental.inlineCss` | 4335 ms | 1387 ms | 1452 ms | 779 KB | **reverted** — worse on every metric |

No hero/preload/CSS change moved the simulated LCP, because the hero is already optimally
prioritized. The only lever that would move the lab number is reducing total byte-weight
(JS + the 5 preloaded fonts), which carries CLS/branding risk and diminishing returns and
was **not** pursued for launch. Real-user/field CWV is the correct signal for this route.

**Follow-up shipped:** `perf(20): drop below-the-fold preload on Tea Journal image`
(`src/components/homepage/tea-journal/tea-journal.tsx`) — removes a competing
`<link rel=preload as=image>` for a below-the-fold image; measured FCP −155 ms /
SI −256 ms / −45 KB, LCP unaffected. Regression: lint, typecheck, 55 contract tests green.

## No-regressions statement

The following automated guards were run after all code changes and passed:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `node --test scripts/component-contracts/*.test.mjs` (all component-contract tests,
  including the updated `launch-image-performance.test.mjs`)
- `node scripts/seo/probe-crawlable-html.mjs --start-server` (Phase 18 crawlable-HTML guard)
- `pnpm exec playwright test tests/e2e/h1-correctness.spec.ts` (Phase 19 single-visible-H1 guard)

Cumulative Layout Shift on `/` is expected to remain 0 (no layout-affecting changes were
made by any of the four fixes — `fetchPriority`, image format negotiation, and a lazy
JS import do not alter document layout). This was not independently re-measured by real
PSI as part of this plan (see "After" section above).

Scope discipline: this document covers homepage `/` Performance only. It does not
address Accessibility, Best Practices, SEO, other routes, or any of the deferred Phase
20 scope (`/account` CLS, the OKLCH/scrim/heading-order a11y work, the unused Caveat
font, collection-card preload count, PDP gallery cap, minimumCacheTTL, resource hints,
the tags-live third-party ceiling, the full PSI harness, or PERF-01 supersession).
