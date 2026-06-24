---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 10
subsystem: launch-readiness
tags: [performance, lighthouse, final-audit, verification, launch-readiness]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: strict performance evidence and final readiness report from 17-09
provides:
  - Repeatable performance diagnostics with timing, layout-shift, and warmed-asset evidence
  - Reduced launch font preload cost
  - Explicit dated performance-acceptance gate in the final audit runner
  - Regenerated final readiness report and Phase 17 verification preserving the PERF-01 blocker
affects: [performance-evidence, final-readiness, phase-17-verification, PERF-01]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Strict local performance remains blocking unless it passes or a dated acceptance artifact validates
    - Performance evidence records timing diagnostics and source-less layout shifts instead of hiding them
    - Final readiness cannot turn performance red into green without an explicit acceptance flag and valid artifact

key-files:
  created:
    - scripts/component-contracts/performance-fonts.test.mjs
    - scripts/component-contracts/account-performance.test.mjs
    - .planning/phases/17-operations-performance-and-final-production-readiness-audit/17-10-SUMMARY.md
  modified:
    - tests/mocks/run-next-production-server.mjs
    - scripts/performance/probe-lighthouse.mjs
    - scripts/performance/probe-lighthouse.test.mjs
    - scripts/launch/run-final-readiness-audit.mjs
    - scripts/launch/run-final-readiness-audit.test.mjs
    - src/app/layout.tsx
    - src/app/(storefront)/account/login/page.tsx
    - docs/launch/performance-evidence.md
    - docs/launch/final-production-readiness-report.md
    - .planning/phases/17-operations-performance-and-final-production-readiness-audit/17-VERIFICATION.md

key-decisions:
  - "No performance acceptance artifact was created because no dated owner, staging, or field Core Web Vitals acceptance evidence exists."
  - "The final audit stays 94/100 and Not launch-ready while strict performance remains red."
  - "Account CLS remains documented as a source-less Lighthouse layout shift after route geometry was stabilized and a browser PerformanceObserver check found no page-level CLS entries."
  - "Font preload was narrowed to the above-the-fold display weight/style set; secondary font variables remain available without preloading."

patterns-established:
  - "Use performance acceptance only through a valid file plus explicit --performance-acceptance flag."
  - "Treat local performance diagnostics as launch evidence; do not convert metric failures into warnings by default."
  - "Keep owner-gated Shopify/admin/Search Console proof separate from automated code readiness."

requirements-completed: [OPS-01, OPS-02, OPS-03, OPS-04, UX-01, QA-01, QA-02, QA-03, SEO-01]
requirements-addressed: [PERF-01]
requirements-blocked: [PERF-01]

# Metrics
duration: 61 min
completed: 2026-06-24
---

# Phase 17 Plan 10: Performance Gap Closure Summary

**Plan 17-10 improved the evidence and guardrails, but did not close the launch-blocking PERF-01 gap.**

## Performance

- **Started:** 2026-06-24T00:18:55Z
- **Completed:** 2026-06-24T01:19:10Z
- **Tasks:** 5
- **Files modified:** 13

## Accomplishments

- Made the local performance lifecycle more repeatable by adding process-tree cleanup, asset warmup, diagnostic timing fields, and route-level JSON/Markdown evidence.
- Reduced launch font preload pressure in `src/app/layout.tsx` by keeping only the required Spectral normal 400/500 preload set while preserving the other font variables without preload.
- Stabilized the account login bridge wrapper and added account geometry contract coverage; Lighthouse still reports the `/account` CLS source as unavailable.
- Added a strict performance-acceptance gate to the final audit runner. A local performance `FAIL` row can become accepted only when a valid artifact exists and the audit is run with `--performance-acceptance`.
- Regenerated `docs/launch/performance-evidence.md`, `docs/launch/final-production-readiness-report.md`, and this Phase 17 verification from current command output.

## Task Commits

Each implementation task was committed atomically:

1. **Task 1: Make local performance evidence repeatable and diagnostic enough to act on** - `967d3848` (`perf(17-10): add performance probe diagnostics`)
2. **Task 2: Reduce global/shared-shell resource pressure where evidence supports it** - `1dce993f` (`perf(17-10): reduce launch font cost`)
3. **Task 3: Reconcile remaining route-level metric failures with concrete evidence** - `73048dbc` (`perf(17-10): document route performance blockers`)
4. **Task 4: Require explicit dated acceptance before performance can become non-blocking** - `cd637b5a` (`test(17-10): gate performance acceptance evidence`)

Plan metadata, final regenerated evidence, and this summary are captured in the final metadata commit.

## Current Final Evidence

- `docs/launch/final-production-readiness-report.md` generated 2026-06-24T01:18:39.497Z and remains `94/100`, `Not launch-ready`.
- The report records 16/17 required automated checks passing, with `performance` as the only failed automated check.
- `docs/launch/performance-evidence.md` generated 2026-06-24T01:17:57.804Z and records seven strict local Lighthouse `FAIL` rows.
- No `docs/launch/performance-acceptance.md` artifact exists.

## Current Performance Rows

| Route | LCP | CLS | TBT | Status |
| --- | ---: | ---: | ---: | --- |
| `/` | 4938ms | 0.000 | 73ms | FAIL |
| `/products/test-standard-tea` | 4013ms | 0.000 | 56ms | FAIL |
| `/collections/all` | 3844ms | 0.000 | 47ms | FAIL |
| `/cart` | 3695ms | 0.000 | 54ms | FAIL |
| `/search?q=tea` | 3841ms | 0.000 | 52ms | FAIL |
| `/account` | 4675ms | 0.128 | 69ms | FAIL |
| `/pages/privacy-policy` | 3727ms | 0.000 | 67ms | FAIL |

## Deviations from Plan

None. The plan allowed two valid outcomes: strict green/accepted performance, or preserving the exact PERF-01 blocker with current evidence. Current evidence requires the blocker to remain.

## Issues Encountered

- `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --json-summary` exits `1` because all seven representative routes still fail strict local Lighthouse thresholds.
- `pnpm audit:readiness` exits `1` because the generated final report keeps `performance` as a required failed check.
- No dated owner, staging, or field Core Web Vitals acceptance evidence was supplied, so no acceptance artifact was created.

## Verification

- `node --test scripts/performance/probe-lighthouse.test.mjs scripts/component-contracts/performance-fonts.test.mjs` - PASS during Task 2.
- `node --test scripts/performance/probe-lighthouse.test.mjs scripts/component-contracts/account-performance.test.mjs` - PASS during Task 3.
- `node --test scripts/launch/run-final-readiness-audit.test.mjs` - PASS during Task 4.
- `pnpm typecheck` - PASS during Task 2.
- `pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts` - PASS during Task 2 and Task 3; final audit also records browser smoke PASS with 10 tests.
- `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --json-summary` - expected FAIL, exit 1, regenerated strict performance evidence.
- `pnpm audit:readiness` - expected FAIL, exit 1, regenerated final readiness report as `94/100`.
- `gsd-sdk query verify.schema-drift "17"` - PASS, no blocking schema drift.
- Final consistency assertion - PASS after verification update.

## Auth Gates

None.

## Known Stubs

None. Fake Shopify and fake Customer Account providers remain deliberate local production-test fixtures. Owner-gated rows remain pending proof, not fabricated automated evidence.

## Threat Flags

None. The plan changed diagnostics, local audit behavior, tests, and launch documentation. It did not add new production endpoints, auth privileges, or secret-bearing output.

## User Setup Required

Launch still requires one of these before Phase 17 can verify:

1. Remediate strict performance until Home/PDP and representative routes no longer fail local launch thresholds.
2. Provide a valid dated owner/staging/field Core Web Vitals acceptance artifact and rerun the final audit with `--performance-acceptance docs/launch/performance-acceptance.md`.

## Next Phase Readiness

There is no later phase that closes `PERF-01`. Phase 17 remains `gaps_found`, with the blocker now current, narrow, and guarded against accidental acceptance.

## Self-Check: PASSED

- Found summary file: `.planning/phases/17-operations-performance-and-final-production-readiness-audit/17-10-SUMMARY.md`
- Found task commits: `967d3848`, `1dce993f`, `73048dbc`, `cd637b5a`
- Confirmed final report does not say `100/100` while performance is failed.
- Confirmed no `docs/launch/performance-acceptance.md` exists.

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-24*
