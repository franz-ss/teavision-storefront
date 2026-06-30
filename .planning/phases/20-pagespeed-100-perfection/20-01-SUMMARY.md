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
affects: [20-pagespeed-100-perfection remaining tasks, future performance phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "fetchPriority=\"high\" combined with preload on the single launch-critical LCP image (hero only) — Next.js 16 emits <link rel=preload as=image fetchpriority=high> AND sets fetchpriority=high on the rendered <img>; verified directly against get-img-props.js/image-component.js runtime source, not just docs prose"
    - "Dynamic import('@sentry/nextjs') inside a DSN guard for client-side lazy SDK loading, mirroring the existing server-side runtime-gated import pattern in src/instrumentation.ts"

key-files:
  created: []
  modified:
    - src/components/homepage/hero/hero.tsx
    - scripts/component-contracts/launch-image-performance.test.mjs
    - next.config.ts
    - instrumentation-client.ts

key-decisions:
  - "Verified the preload+fetchPriority combination against Next.js 16 runtime source (get-img-props.js, image-component.js) rather than relying solely on plan-cited doc line numbers, after discovering the installed docs literally say 'when not to use preload: when fetchPriority is used' — confirmed it is not a thrown runtime error and IS the mechanism that makes the preload <link> itself carry fetchpriority=high"
  - "Updated the image-performance contract test to exempt only the homepage hero from the preload+fetchPriority guard, keeping the guard intact for product-gallery, product-card, and collection hero components"
  - "instrumentation-client.ts onRouterTransitionStart is a stably-typed (href: string, navigationType: string) => void function that delegates to the lazily-loaded Sentry.captureRouterTransitionStart once the dynamic import resolves; no-ops safely before that and when DSN is unset"

patterns-established:
  - "Verify next/image prop interaction claims against node_modules/next/dist runtime source when an installed-docs citation is incomplete or seemingly contradictory, before editing test guards based on the claim"

requirements-completed: [PSI-03, PSI-08, PSI-05, PSI-06]

# Metrics
duration: in progress (paused at Task 4 checkpoint)
completed: pending
---

# Phase 20 Plan 01: Homepage PSI Screenshot Fixes (Tasks 1-3 of 5) Summary

**Hero fetchPriority=high + AVIF output + lazy-loaded client Sentry SDK, verified against Next.js 16 runtime source; paused at the blocking inlineCss decision checkpoint awaiting real post-deploy PSI numbers.**

## Performance

- **Started:** 2026-06-30T23:33:00Z (approx, worktree branch-check time)
- **Paused at checkpoint:** 2026-06-30T23:43:32Z
- **Tasks completed:** 3 of 5 (Task 4 is a blocking checkpoint:decision; Task 5 depends on it)
- **Files modified:** 4

## Accomplishments

- Added `fetchPriority="high"` to the homepage hero `<Image>` (kept `preload`, `fill`, `sizes="100vw"`, `alt=""`), so the emitted `<link rel="preload" as="image" fetchpriority="high">` and the rendered `<img>` both carry `fetchpriority=high` — directly targets the real-PSI "LCP request discovery" audit's one failing check and its 2,040ms resource-load-delay.
- Enabled `images.formats: ['image/avif', 'image/webp']` in `next.config.ts` so AVIF-capable browsers receive the existing AVIF hero asset directly instead of a larger transcoded WebP (real-PSI "Improve image delivery" ~9 KiB finding).
- Rewrote `instrumentation-client.ts` to dynamically `import('@sentry/nextjs')` only inside the `NEXT_PUBLIC_SENTRY_DSN` guard, removing the top-level static import that shipped the ~142KB Sentry browser SDK (and its legacy polyfills) on every cold route load regardless of DSN. `onRouterTransitionStart` is still exported with a stable typed signature and safely no-ops until/unless Sentry loads.

## Task Commits

1. **Task 1: Add fetchPriority="high" to the homepage hero LCP image** - `cc4c77b5` (feat)
2. **Task 2: Enable AVIF image output** - `97658490` (feat)
3. **Task 3: Lazy-load the client Sentry SDK** - `c9f28cbf` (feat)

Task 4 (checkpoint:decision, `gate="blocking"`) and Task 5 are not yet executed — this plan is paused awaiting human-supplied real PSI numbers per the checkpoint protocol.

## Files Created/Modified

- `src/components/homepage/hero/hero.tsx` - hero `<Image>` now carries `fetchPriority="high"` alongside the existing `preload`
- `scripts/component-contracts/launch-image-performance.test.mjs` - preload+fetchPriority guard now exempts only the homepage hero; all other launch-critical Image usages (product gallery, product card, collection heroes) keep the original guard
- `next.config.ts` - `images.formats: ['image/avif', 'image/webp']` added; no other images-config keys touched
- `instrumentation-client.ts` - top-level static `@sentry/nextjs` import removed; SDK now loaded via `import('@sentry/nextjs')` inside the DSN guard; `onRouterTransitionStart` re-implemented as a typed delegating wrapper

## Decisions Made

- **Verified the preload+fetchPriority combination against Next.js runtime source, not just docs prose.** The installed Next.js 16 docs (`node_modules/next/dist/docs/.../image.md`) literally list "when the `fetchPriority` property is used" under "When not to use [preload]" — which reads as a contradiction to the plan's framing. Before editing the contract test, I traced the actual runtime implementation (`shared/lib/get-img-props.js` lines 397-405, 569, 584; `client/image-component.js` lines 209-233) to confirm: (a) `preload`+`priority` and `preload`+`loading='lazy'` throw at runtime, but `preload`+`fetchPriority` does NOT throw; (b) `ImagePreload` spreads `getDynamicProps(imgAttributes.fetchPriority)` into the preloaded `<link>`'s options, so the combination is exactly what makes the preload `<link>` itself carry `fetchpriority="high"` — the precise mechanism the real-PSI "LCP request discovery" audit checks for. This confirms the plan's instruction was correct in outcome, and the doc's "when not to use" bullet is advisory guidance for the general case (most images use one or the other), not a hard runtime restriction for the single dedicated LCP hero.
- **Contract-test exemption scoped narrowly.** Rather than weakening the guard repo-wide, the test now only exempts `src/components/homepage/hero/hero.tsx`'s `fill` Image block; product-gallery, product-card, and both collection-hero components still fail the test if they ever combine `preload` with `fetchPriority="high"`.
- **onRouterTransitionStart typed without `any`.** Used an explicit `CaptureRouterTransitionStart = (href: string, navigationType: string) => void` type (matching both Next's internal `onRouterTransitionStart` hook signature in `app-router-instance.d.ts` and Sentry's `captureRouterTransitionStart` signature) rather than deriving via `typeof import(...)`, since the dynamic-import value isn't available at the type level until the promise resolves.

## Deviations from Plan

None - plan executed exactly as written for Tasks 1-3. The "doc verification" above was read_first due diligence (the plan instructed exactly this: "confirm the exact emitted markup against image.md"), not a deviation — it surfaced that the actual mechanism needed runtime-source confirmation beyond the cited doc line numbers, and the outcome matches the plan's required acceptance criteria exactly.

## Issues Encountered

- This worktree had no `node_modules` directory of its own; `pnpm lint`/`pnpm typecheck` triggered a fresh `pnpm install` on first use (or resolved upward to the main repo's pnpm store), after which all tooling (lint, typecheck, `node --test`, pre-commit hooks running all 55 component-contract/eslint-rule tests) ran successfully with no environment issues.

## User Setup Required

None - no external service configuration required for Tasks 1-3.

## Next Phase Readiness

**BLOCKED at Task 4 (checkpoint:decision, gate=blocking).** This task requires real Google PageSpeed Insights numbers measured on `/` AFTER Tasks 1-3 are deployed to the public preview (`https://teavision-storefront.vercel.app`) — data this worktree agent cannot produce, since it cannot deploy or run real PSI. See the CHECKPOINT REACHED report returned alongside this summary for the exact decision needed (enable vs. skip `experimental.inlineCss`) and what the human user must supply.

Task 5 (regression sweep + before/after evidence doc) cannot start until Task 4's decision is resolved, since its evidence doc and verification depend on Task 4's outcome.

---
*Phase: 20-pagespeed-100-perfection*
*Completed: pending (paused at Task 4 checkpoint)*
