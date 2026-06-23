---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 08
subsystem: launch-performance-readiness
tags: [performance, lighthouse, final-audit, launch-readiness, acceptance-gates]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: strict performance semantics, launch-indexing lifecycle, and final audit runner from plans 17-06 and 17-07
provides:
  - Route-level Lighthouse LCP element/resource/observed-URL diagnostics
  - Targeted PDP and account geometry performance remediation
  - Explicit final-report evidence that no dated performance acceptance artifact was supplied
  - Regenerated strict local Lighthouse evidence and final readiness report with performance blocking launch
affects: [phase-17-final-audit, performance-evidence, launch-readiness, PERF-01]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Strict performance FAIL rows remain launch-blocking unless strict metrics pass or dated owner/staging/field evidence exists
    - Final readiness reports acceptance absence explicitly rather than implying a non-blocking exception
    - Lighthouse diagnostics capture LCP selector, snippet/label, resource URL, and observed URL for route-specific remediation

key-files:
  created:
    - .planning/phases/17-operations-performance-and-final-production-readiness-audit/17-08-SUMMARY.md
  modified:
    - scripts/performance/probe-lighthouse.mjs
    - scripts/performance/probe-lighthouse.test.mjs
    - scripts/launch/run-final-readiness-audit.mjs
    - scripts/launch/run-final-readiness-audit.test.mjs
    - src/components/product/product-gallery/product-gallery.tsx
    - src/app/(storefront)/account/layout.tsx
    - src/app/(storefront)/account/loading.tsx
    - src/app/(storefront)/account/login/page.tsx
    - src/app/(storefront)/account/page.tsx
    - docs/launch/performance-evidence.md
    - docs/launch/final-production-readiness-report.md

key-decisions:
  - "No dated owner, staging, or field Core Web Vitals performance acceptance evidence was provided, so no performance-acceptance artifact was created."
  - "Performance FAIL rows remain blocking in the final readiness report; the report stays 94/100 and Not launch-ready."
  - "Acceptance absence is rendered as evidence text, not as an override path, so the audit cannot accidentally treat local performance failures as non-blocking."

patterns-established:
  - "Use route-level LCP diagnostics before changing image priority, layout geometry, or route waterfalls."
  - "Record manual acceptance absence explicitly when strict launch gates remain failed."

requirements-completed: [UX-01, QA-02]
requirements-addressed: [PERF-01, UX-01, QA-02]

# Metrics
duration: 9h 25m including checkpoint wait
completed: 2026-06-23
---

# Phase 17 Plan 08: Performance Diagnostics And Strict Blocking Summary

**Route-level Lighthouse diagnostics and final readiness evidence that keeps performance launch-blocking without dated acceptance proof**

## Performance

- **Duration:** 9h 25m wall time including checkpoint wait
- **Started:** 2026-06-23T13:43:49Z
- **Completed:** 2026-06-23T23:08:46Z
- **Tasks:** 4
- **Files modified:** 11

## Accomplishments

- Added Lighthouse diagnostics for LCP element selector/label/snippet, LCP resource URL, observed URL, JSON summary shape, and warmup controls.
- Applied targeted remediation supported by diagnostics: PDP gallery no longer combines preload with eager/high priority, and account login/account surfaces reserve more stable geometry.
- Preserved strict performance blocking after the checkpoint decision: no `docs/launch/performance-acceptance.md` was created, and the final report records no dated owner/staging/field acceptance evidence.
- Regenerated strict evidence. All seven representative routes still fail local mobile Lighthouse thresholds, so the final report remains `94/100` and `Not launch-ready`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Lighthouse diagnostics for the current blockers** - `1c878d63` (fix)
2. **Task 2: Remediate route-level LCP and CLS causes** - `8bf470c0` (fix)
3. **Task 3: Validate any non-blocking performance exception before the audit may pass** - `3d504b49` (fix)
4. **Task 4: Regenerate strict performance evidence** - `766289c5` (docs)

**Plan metadata:** this summary and planning-state updates are captured in the final metadata commit.

## Files Created/Modified

- `scripts/performance/probe-lighthouse.mjs` - Adds LCP diagnostics, route warmup controls, JSON summary fields, and regenerated remediation/evidence rendering.
- `scripts/performance/probe-lighthouse.test.mjs` - Covers diagnostic extraction, warmup flags, cold-run mode, JSON summary fields, and evidence sections.
- `scripts/launch/run-final-readiness-audit.mjs` - Renders the absence of dated performance acceptance evidence as a blocking report status.
- `scripts/launch/run-final-readiness-audit.test.mjs` - Verifies failed performance does not produce a launch-ready report and records blocking acceptance wording.
- `src/components/product/product-gallery/product-gallery.tsx` - Keeps the first PDP image eager/high priority without combining it with preload.
- `src/app/(storefront)/account/layout.tsx` - Adds stable account shell geometry.
- `src/app/(storefront)/account/loading.tsx` - Aligns loading geometry with the account shell.
- `src/app/(storefront)/account/login/page.tsx` - Reserves stable login bridge geometry.
- `src/app/(storefront)/account/page.tsx` - Reserves stable dashboard/login-wrapper geometry.
- `docs/launch/performance-evidence.md` - Records the latest strict local Lighthouse metrics and LCP diagnostics.
- `docs/launch/final-production-readiness-report.md` - Records `94/100`, performance `FAIL`, no dated acceptance artifact, and `Not launch-ready`.

## Decisions Made

- No performance acceptance artifact was created because the user selected the strict-blocking path without owner, staging, or field Core Web Vitals evidence.
- The final audit runner was not given a non-blocking performance override. It only records that no dated acceptance evidence was supplied.
- `PERF-01` remains blocked. `UX-01` and `QA-02` remain satisfied because UX polish and audit honesty are covered while strict performance still fails.

## Deviations from Plan

None - plan executed along the user-selected strict-blocking checkpoint path.

## Issues Encountered

- `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --json-summary` exits `1` as expected because seven strict route rows remain `FAIL`.
- `pnpm audit:readiness` exits `1` as expected because `performance` is the only failed automated check. The report is intentionally `Not launch-ready`.
- The final audit output still prints the existing rate-limit fail-closed advisory during command output, but the generated report records the automated check failure as performance only.

## Verification

- `node --test scripts/performance/probe-lighthouse.test.mjs` - PASS, 17 tests.
- `node --test scripts/launch/run-final-readiness-audit.test.mjs` - PASS, 17 tests.
- `pnpm lint -- src/components/homepage/hero/hero.tsx src/components/product/product-gallery/product-gallery.tsx src/components/collection/product-card/product-card.tsx "src/app/(storefront)/collections/[handle]/_components/product-list.tsx" "src/app/(storefront)/account/page.tsx" "src/app/(storefront)/account/loading.tsx"` - PASS.
- `pnpm typecheck` - PASS.
- `pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts` - PASS, 10 tests.
- `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --json-summary` - expected FAIL, 7/7 route rows failed strict performance thresholds and evidence was regenerated.
- `pnpm audit:readiness` - expected FAIL, report regenerated as `94/100` and `Not launch-ready`.
- Pre-commit hooks after Task 3 and Task 4 - PASS: Tailwind class check, ESLint, and component-contract tests.

## Auth Gates

None.

## Known Stubs

None. Stub-pattern scan found only documentation text explaining that the fake Shopify product no longer uses an empty placeholder, plus normal null/empty-array control flow in scripts and tests.

## Threat Flags

None. The plan did not introduce new network endpoints, auth paths, schema changes, or new file-access trust boundaries beyond the planned local evidence and report-generation surfaces.

## User Setup Required

None - no external service configuration was added. A future non-blocking performance exception still requires dated owner, staging, or field Core Web Vitals evidence before it can be represented as launch-acceptable.

## Next Phase Readiness

Plan 17-09 can reconcile final Phase 17 evidence with one blocker still open: `PERF-01` remains launch-blocking until strict local/staging/field performance is green or a valid dated acceptance artifact is supplied. The current final readiness report is honest and not launch-ready.

## Self-Check: PASSED

- Found summary file: `.planning/phases/17-operations-performance-and-final-production-readiness-audit/17-08-SUMMARY.md`
- Found task commits: `1c878d63`, `8bf470c0`, `3d504b49`, `766289c5`
- Confirmed `docs/launch/performance-acceptance.md` does not exist.
- Confirmed `docs/launch/final-production-readiness-report.md` does not contain `100/100` or `Accepted non-blocking` while performance rows are `FAIL`.

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-23*
