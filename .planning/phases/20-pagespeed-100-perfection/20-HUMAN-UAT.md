---
status: complete
phase: 20-pagespeed-100-perfection
source: [20-VERIFICATION.md]
started: 2026-07-01T00:00:00Z
updated: 2026-07-01T09:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Real post-deploy PSI re-measurement on `/`
expected: Deploy the current commit set (`cc4c77b5`, `97658490`, `c9f28cbf`, `14673748`, `b5a79d74`, `1ba2ef8e`) to the public preview and re-run Google PageSpeed Insights (mobile, Slow 4G, same methodology as `20-PSI-EVIDENCE.md`) against `/`. The "LCP request discovery" audit's `fetchpriority=high` check should pass; the ~142KB Sentry unused/legacy-JS flags should clear; the AVIF image-delivery finding should clear; LCP should trend materially down from 3.4s (expected direction ~1.5s per the plan's own diagnosis); Speed Index should improve; Performance score should trend into the mid-90s; CLS should stay 0; render-blocking CSS (540ms) is expected to remain since `inlineCss` was skipped — confirm this is truly negligible post-fix rather than newly dominant.
result: issue
reported: |
  Owner ran PSI mobile (Moto G Power, Lighthouse 13.4.0, Slow 4G) on the deployed preview `https://teavision-storefront.vercel.app/`, captured 2026-07-01 08:53 GMT+8. Three runs:
    - Run 1 (cold): Perf 93, LCP 3.1s, SI 3.7s, TBT 20ms, CLS 0, FCP 1.1s
    - Run 3 (warm, cache primed): Perf 95, LCP 3.0s, SI 1.9s, TBT 30ms, CLS 0, FCP 1.1s
  6 of 7 expected outcomes MET: fetchpriority=high live (verified in deployed HTML on both <img> and preload link); AVIF output live (Content-Type: image/avif, 15.4KB served); Sentry unused/legacy-JS flags cleared (88→25 KiB unused, 14 KiB legacy); Performance in mid-90s (95); Speed Index improved (5.1→1.9s, now green); CLS 0.
  1 of 7 MISSED: LCP did NOT trend materially down — 3.4s → 3.0s only (target ~1.5s). Warm re-measurement (X-Vercel-Cache: HIT) ruled out the cold-cache hypothesis: warm LCP (3.0s) ≈ cold LCP (3.1s), so LCP is genuinely stuck ~3.0s, not a cache artifact. LCP is the sole orange metric on an otherwise all-green report.
severity: minor
root_causes:
  - "Competing below-the-fold `as=image` preload. src/components/homepage/tea-journal/tea-journal.tsx:71 sets `preload={index === 0}` on the first Tea Journal article's featured Sanity image (sizes '(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw'). Tea Journal is below the fold, so Next.js emits a second `<link rel=preload as=image>` (verified in deployed HTML: the cdn.sanity.io 1254x836 jpg preload) with NO fetchpriority. On Slow 4G (~200 KB/s) this lands in the early discovery set and contends with the hero image for the narrow pipe, diluting the hero's fetchpriority=high and inflating LCP resource-load-delay."
  - "540ms render-blocking CSS remains. next.config.ts has no `experimental.inlineCss` (skip decision was owner-directed in 20-01 WITHOUT a post-deploy re-measurement — see 20-01-SUMMARY.md:71,:106; original plan criterion 20-01-PLAN.md:21 was 'keep only if it improves PSI without a TTFB regression'). Two render-blocking stylesheets (19.3KB/600ms + 2.9KB/150ms) block first render and compete for the early Slow-4G pipe before the hero can paint. Now that JS and image are optimized, this is proportionally the dominant remaining critical-path cost."

## Summary

total: 1
passed: 0
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Real post-deploy PSI on `/` shows LCP trending materially toward ~1.5s (the phase's PageSpeed-100 objective), not merely mid-90s Performance with a stuck 3.0s LCP."
  status: resolved
  resolution: "not-a-defect + partial-improvement. Investigated both diagnosed root causes with the local Lighthouse harness (scripts/performance/probe-lighthouse.mjs, same Lighthouse 13.4.0 / simulated Slow-4G as PSI, production build) on 2026-07-01. Finding: the 3.0s LCP is a Lantern simulate-throttling ARTIFACT, not a real loading defect — the hero's observed resource-load-delay is ~10ms and it paints in ~150ms; the 20-01 fetchpriority/AVIF/Sentry fixes are live and effective. Lantern reports ~3-4s because it completes the tiny 14KB hero near the end of the ~720KB total page download. Three controlled experiments: (baseline LCP 3884/FCP 1363/SI 1586); (drop below-fold Tea Journal preload → LCP 4111/FCP 1208/SI 1330/-45KB — FCP/SI win, LCP flat=noise, KEPT and committed as perf(20) e0ba5ec0); (+experimental.inlineCss → LCP 4335/FCP 1387/SI 1452/+59KB — regressed everything, REVERTED). No hero/preload/CSS change moves the simulated LCP because the hero is already optimally prioritized. The only remaining lever is total byte-weight (fonts/JS), which carries CLS/branding risk and was not pursued for launch. Owner decision (2026-07-01): accept the 95 score, treat the lab LCP as the documented artifact it is, rely on field/real-user CWV. Full evidence: docs/launch/homepage-performance-fixes.md."
  severity: minor
  test: 1
  artifacts:
    - "src/components/homepage/tea-journal/tea-journal.tsx (below-fold preload removed — perf(20) commit e0ba5ec0)"
    - "next.config.ts (experimental.inlineCss measured and rejected — reverted, no change)"
    - "docs/launch/homepage-performance-fixes.md (post-deploy real-PSI + local experiment evidence, inlineCss measured-skip confirmation)"
