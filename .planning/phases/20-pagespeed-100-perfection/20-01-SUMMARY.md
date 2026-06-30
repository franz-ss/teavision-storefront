---
phase: 20-pagespeed-100-perfection
plan: 01
subsystem: performance
tags: [nextjs, image-optimization, sentry, fetchpriority, avif, bundle-size, pagespeed]

# Dependency graph
requires:
  - phase: 18-seo-audit-remediation
    provides: honest Core Web Vitals evidence reconciliation and crawlable-HTML/single-H1 guards this plan must not regress
provides:
  - homepage hero LCP image with fetchPriority="high" (fixes 2,040ms resource-load-delay)
  - AVIF image output enabled via next.config.ts images.formats
  - lazy-loaded client Sentry SDK (dynamic import gated on NEXT_PUBLIC_SENTRY_DSN)
  - measured skip-inlinecss decision for render-blocking CSS, documented with rationale and caveats
  - docs/launch/homepage-performance-fixes.md before/after evidence note (after = pending real-PSI confirmation)
affects: [20-pagespeed-100-perfection remaining tasks, future performance phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "fetchPriority=\"high\" combined with preload on the single launch-critical LCP image (hero only) — Next.js 16 emits <link rel=preload as=image fetchpriority=high> AND sets fetchpriority=high on the rendered <img>; verified directly against get-img-props.js/image-component.js runtime source, not just docs prose"
    - "Dynamic import('@sentry/nextjs') inside a DSN guard for client-side lazy SDK loading, mirroring the existing server-side runtime-gated import pattern in src/instrumentation.ts"
    - "experimental.inlineCss left unset (skip decision) — documented rationale in docs/launch/homepage-performance-fixes.md rather than silently omitted, including the explicit caveat that the decision was made without a post-deploy real-PSI re-measurement"

key-files:
  created:
    - docs/launch/homepage-performance-fixes.md
  modified:
    - src/components/homepage/hero/hero.tsx
    - scripts/component-contracts/launch-image-performance.test.mjs
    - next.config.ts
    - instrumentation-client.ts

key-decisions:
  - "Verified the preload+fetchPriority combination against Next.js 16 runtime source (get-img-props.js, image-component.js) rather than relying solely on plan-cited doc line numbers, after discovering the installed docs literally say 'when not to use preload: when fetchPriority is used' — confirmed it is not a thrown runtime error and IS the mechanism that makes the preload <link> itself carry fetchpriority=high"
  - "Updated the image-performance contract test to exempt only the homepage hero from the preload+fetchPriority guard, keeping the guard intact for product-gallery, product-card, and collection hero components"
  - "instrumentation-client.ts onRouterTransitionStart is a stably-typed (href: string, navigationType: string) => void function that delegates to the lazily-loaded Sentry.captureRouterTransitionStart once the dynamic import resolves; no-ops safely before that and when DSN is unset"
  - "Task 4 decision: skip experimental.inlineCss. next.config.ts has no experimental block / inlineCss key. Rationale: Tasks 1-3 remove the largest Slow-4G bandwidth costs (142KB Sentry chunk + LCP preload-priority delay) from the homepage's early critical path and are expected to substantially close the LCP/Speed Index gap on their own, making the architectural tradeoff of inlineCss (losing cross-navigation CSS caching) not worth it for a 540ms render-blocking-CSS finding. This decision was made on engineering judgment at the owner's explicit instruction to proceed without first deploying and re-measuring real PSI on / — documented honestly as such, with no fabricated PSI numbers, in docs/launch/homepage-performance-fixes.md."
  - "docs/launch/homepage-performance-fixes.md 'after' section explicitly states no post-deploy real-PSI re-measurement exists yet for /, and recommends the owner run one against the deployed preview before treating the PSI-improvement objective as fully closed. The four code-level fixes are individually verified by automated checks; the holistic real-PSI score is not yet independently confirmed."

patterns-established:
  - "Verify next/image prop interaction claims against node_modules/next/dist runtime source when an installed-docs citation is incomplete or seemingly contradictory, before editing test guards based on the claim"
  - "When a checkpoint decision must proceed without the originally-required verification data (here: real post-deploy PSI numbers), document the decision rationale AND the fact that it bypassed the original verification step, rather than fabricating the missing data or silently omitting the gap"

requirements-completed: [PSI-03, PSI-05, PSI-06, PSI-07, PSI-08]

# Metrics
duration: ~2.5 hours across two sessions (Tasks 1-3, then Tasks 4-5 after checkpoint resolution)
completed: 2026-07-01
---

# Phase 20 Plan 01: Homepage PSI Screenshot Fixes Summary

**Hero fetchPriority=high + AVIF output + lazy-loaded client Sentry SDK + a measured (owner-directed) skip-inlinecss decision, all verified regression-free; real post-deploy PSI confirmation is the one remaining open item.**

## Performance

- **Started:** 2026-06-30T23:33:00Z (approx, worktree branch-check time)
- **Paused at checkpoint:** 2026-06-30T23:43:32Z
- **Resumed and completed:** 2026-07-01
- **Tasks completed:** 5 of 5
- **Files modified:** 4 modified, 1 created

## Accomplishments

- Added `fetchPriority="high"` to the homepage hero `<Image>` (kept `preload`, `fill`, `sizes="100vw"`, `alt=""`), so the emitted `<link rel="preload" as="image" fetchpriority="high">` and the rendered `<img>` both carry `fetchpriority=high` — directly targets the real-PSI "LCP request discovery" audit's one failing check and its 2,040ms resource-load-delay.
- Enabled `images.formats: ['image/avif', 'image/webp']` in `next.config.ts` so AVIF-capable browsers receive the existing AVIF hero asset directly instead of a larger transcoded WebP (real-PSI "Improve image delivery" ~9 KiB finding).
- Rewrote `instrumentation-client.ts` to dynamically `import('@sentry/nextjs')` only inside the `NEXT_PUBLIC_SENTRY_DSN` guard, removing the top-level static import that shipped the ~142KB Sentry browser SDK (and its legacy polyfills) on every cold route load regardless of DSN. `onRouterTransitionStart` is still exported with a stable typed signature and safely no-ops until/unless Sentry loads.
- Resolved the Task 4 checkpoint as `skip-inlinecss`: `next.config.ts` has no `experimental.inlineCss` key. The decision and its rationale — including the explicit caveat that it was made at the owner's instruction without a post-deploy real-PSI re-measurement — are documented in `docs/launch/homepage-performance-fixes.md`.
- Authored `docs/launch/homepage-performance-fixes.md`: records the four PSI screenshot findings and their fixes, the real-PSI "before" baseline from `20-PSI-EVIDENCE.md`, the Task 4 decision and rationale, an honest "after" section stating real-PSI re-measurement is pending (not fabricated), and a no-regressions statement citing every guard that was run and passed.
- Ran the full regression sweep: `pnpm lint`, `pnpm typecheck`, `pnpm build`, all 39 component-contract tests (`node --test scripts/component-contracts/*.test.mjs`), the Phase 18 crawlable-HTML probe (`node scripts/seo/probe-crawlable-html.mjs --start-server`), and the Phase 19 single-visible-H1 e2e suite (`pnpm exec playwright test tests/e2e/h1-correctness.spec.ts`, 3 tests) — all green.

## Task Commits

1. **Task 1: Add fetchPriority="high" to the homepage hero LCP image** - `cc4c77b5` (feat)
2. **Task 2: Enable AVIF image output** - `97658490` (feat)
3. **Task 3: Lazy-load the client Sentry SDK** - `c9f28cbf` (feat)
4. *(interim)* SUMMARY.md paused at Task 4 checkpoint - `5226b318` (docs)
5. **Task 4: Record skip-inlinecss decision** - `14673748` (docs)
6. **Task 5: Regression sweep + finalize evidence doc** - `b5a79d74` (docs)

## Files Created/Modified

- `src/components/homepage/hero/hero.tsx` - hero `<Image>` now carries `fetchPriority="high"` alongside the existing `preload`
- `scripts/component-contracts/launch-image-performance.test.mjs` - preload+fetchPriority guard now exempts only the homepage hero; all other launch-critical Image usages (product gallery, product card, collection heroes) keep the original guard
- `next.config.ts` - `images.formats: ['image/avif', 'image/webp']` added; no other images-config keys touched; no `experimental.inlineCss` (skip decision)
- `instrumentation-client.ts` - top-level static `@sentry/nextjs` import removed; SDK now loaded via `import('@sentry/nextjs')` inside the DSN guard; `onRouterTransitionStart` re-implemented as a typed delegating wrapper
- `docs/launch/homepage-performance-fixes.md` (created) - the four findings/fixes table, the Task 4 inlineCss decision and rationale, the real-PSI before baseline, an honest pending-confirmation "after" section, and the no-regressions statement

## Decisions Made

- **Verified the preload+fetchPriority combination against Next.js runtime source, not just docs prose.** The installed Next.js 16 docs (`node_modules/next/dist/docs/.../image.md`) literally list "when the `fetchPriority` property is used" under "When not to use [preload]" — which reads as a contradiction to the plan's framing. Before editing the contract test, the actual runtime implementation (`shared/lib/get-img-props.js` lines 397-405, 569, 584; `client/image-component.js` lines 209-233) was traced to confirm: (a) `preload`+`priority` and `preload`+`loading='lazy'` throw at runtime, but `preload`+`fetchPriority` does NOT throw; (b) `ImagePreload` spreads `getDynamicProps(imgAttributes.fetchPriority)` into the preloaded `<link>`'s options, so the combination is exactly what makes the preload `<link>` itself carry `fetchpriority="high"` — the precise mechanism the real-PSI "LCP request discovery" audit checks for.
- **Contract-test exemption scoped narrowly.** Rather than weakening the guard repo-wide, the test only exempts `src/components/homepage/hero/hero.tsx`'s `fill` Image block; product-gallery, product-card, and both collection-hero components still fail the test if they ever combine `preload` with `fetchPriority="high"`.
- **onRouterTransitionStart typed without `any`.** Used an explicit `CaptureRouterTransitionStart = (href: string, navigationType: string) => void` type (matching both Next's internal `onRouterTransitionStart` hook signature and Sentry's `captureRouterTransitionStart` signature) rather than deriving via `typeof import(...)`, since the dynamic-import value isn't available at the type level until the promise resolves.
- **Task 4: skip-inlinecss, decided without a post-deploy real-PSI re-measurement, at the owner's explicit instruction.** The plan's Task 4 checkpoint originally called for deploying Tasks 1-3, re-running real PSI on `/`, and then choosing enable vs. skip based on the measured numbers. The owner responded "proceed with the recommendation" without first supplying a fresh real-PSI re-measurement. The recommendation (skip-inlinecss) was adopted on engineering judgment: Tasks 1-3 remove the two largest Slow-4G bandwidth costs identified in the before-baseline (the 142KB Sentry chunk and the LCP preload-priority delay), which is expected to substantially close the LCP/Speed Index gap and make the inlineCss tradeoff (losing cross-navigation CSS caching, for a 540ms render-blocking-CSS finding) not worth it. This is documented explicitly as engineering judgment made without fresh measurement, not as a verified-by-data decision — no PSI numbers were fabricated for this decision.
- **Task 5 evidence doc: honest "after" framing.** `docs/launch/homepage-performance-fixes.md` reports the real "before" baseline (Perf ~86, LCP 3.4s/2,040ms resource-load-delay, SI 5.1s, CLS 0, from `20-PSI-EVIDENCE.md`) but explicitly states that no post-deploy real-PSI numbers exist for the "after" state. It documents that the four code-level fixes are individually verified by automated checks, but the holistic real-PSI improvement on `/` has not been independently confirmed, and recommends the owner run a real PSI scan against the deployed preview to confirm the expected improvement (LCP toward ~1.5s, Speed Index down, Performance into the mid-90s) before treating this plan's PSI objective as fully closed.

## Deviations from Plan

None affecting scope or architecture. One process note:

- **[Environment setup] Worktree was missing `.env.local`.** `pnpm build` failed on `/_not-found` page-data collection with "Missing required environment variable: SITE_URL" because this worktree had no local `.env.local` (it is git-ignored and not part of any commit). Copied the existing `.env.local` from the main checkout (`D:/Work/teavision/teavision.com.au/.env.local`) into the worktree — a local filesystem operation only, not staged or committed (confirmed via `git status --porcelain` showing no change). This is Rule 3 (auto-fix blocking issue) and is not a package-manager install, so no checkpoint was required. Not documented as a code deviation since no tracked file was touched.

Tasks 1-3 executed exactly as written (see "Decisions Made" above for the doc-verification due diligence performed during Task 1, which was read_first due diligence, not a deviation). Task 4's checkpoint resolution (skip-inlinecss without a fresh real-PSI re-measurement) was directed explicitly by the owner and is documented above and in the evidence doc, not treated as a silent deviation.

## Issues Encountered

- This worktree had no `node_modules` directory of its own initially; `pnpm lint`/`pnpm typecheck` triggered a fresh `pnpm install` on first use (or resolved upward to the main repo's pnpm store), after which all tooling (lint, typecheck, `node --test`, pre-commit hooks running all 55 component-contract/eslint-rule tests) ran successfully with no environment issues.
- Worktree was missing `.env.local` (see Deviations above) — resolved by copying the file locally, not committing it.

## User Setup Required

**Recommended before treating this plan's PageSpeed objective as fully closed:** run a real Google PageSpeed Insights scan against the deployed preview (`https://teavision-storefront.vercel.app/`) and compare LCP / Speed Index / Performance score against the before baseline recorded in `docs/launch/homepage-performance-fixes.md`. This was not performed as part of this plan — the owner directed proceeding with the skip-inlinecss recommendation without first supplying this re-measurement. If the real-PSI re-measurement later shows render-blocking CSS still materially hurting LCP/Speed Index after Tasks 1-3, `experimental.inlineCss` should be revisited as a follow-up, measured against TTFB and repeat-visit impact before being enabled.

## Next Phase Readiness

All 5 tasks of 20-01 are complete and committed. The four homepage `/` PSI screenshot findings (LCP/fetchpriority, image delivery, unused+legacy JS, render-blocking CSS) each have a code-level fix or a documented, rationale-backed skip decision. The full no-regression sweep (lint, typecheck, build, 39 component-contract tests, Phase 18 crawlable-HTML probe, Phase 19 single-visible-H1 e2e) is green.

The one open item carried forward: a real post-deploy PSI re-measurement on `/` has not been performed to confirm the expected LCP/Speed Index/Performance improvement. This is explicitly flagged (not silently dropped) in both this summary and `docs/launch/homepage-performance-fixes.md` as the recommended next step before the phase's PageSpeed-100 objective is considered verified end-to-end.

---
*Phase: 20-pagespeed-100-perfection*
*Completed: 2026-07-01*
