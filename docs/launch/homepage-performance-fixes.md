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

## After — pending real-PSI confirmation

**No post-deploy real PSI numbers exist yet for `/`.** The four code-level fixes above
are complete and each individually verified by automated checks (component-contract
tests, typecheck, static assertions on the emitted markup/config). However, the
holistic real-PSI "after" score for `/` — LCP, Speed Index, and overall Performance
score — has **not** been independently confirmed against the deployed preview.

**Recommendation:** Before treating this plan's PSI-improvement objective as fully
closed, run a real Google PageSpeed Insights scan against the deployed preview
(`https://teavision-storefront.vercel.app/`) and compare the resulting LCP / Speed
Index / Performance score against the before baseline in this document. Expected
direction (per the diagnosis in `20-PSI-EVIDENCE.md`): LCP toward ~1.5s, Speed Index
down with it, Performance score into the mid-90s — but this expectation is not yet
verified by measurement.

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
