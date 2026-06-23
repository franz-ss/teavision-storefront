---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 07
subsystem: launch-readiness
tags: [seo, indexing, final-audit, performance, launch-readiness]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: strict final readiness audit and fake-provider production lifecycle from plans 17-05 and 17-06
provides:
  - Parameterized fake-provider production lifecycle indexing mode
  - Final audit lifecycle profiles for noindex and launch-indexing probes
  - Contract coverage that enabled SEO cannot reuse a noindex build
  - Regenerated readiness evidence with enabled SEO passing
affects: [phase-17-final-audit, seo-evidence, launch-indexing, performance-evidence]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Fake-provider production lifecycle defaults to noindex and requires explicit disableIndexing false for launch-indexing evidence
    - Final readiness live probes switch lifecycle profiles before build-time SEO evidence
    - Owner-gated Search Console proof remains separate from automated code readiness scoring

key-files:
  created:
    - .planning/phases/17-operations-performance-and-final-production-readiness-audit/17-07-SUMMARY.md
  modified:
    - scripts/performance/probe-lighthouse.mjs
    - scripts/performance/probe-lighthouse.test.mjs
    - scripts/launch/run-final-readiness-audit.mjs
    - scripts/launch/run-final-readiness-audit.test.mjs
    - scripts/component-contracts/noindex-mode.test.mjs
    - docs/launch/seo-route-evidence.md
    - docs/launch/final-production-readiness-report.md
    - docs/launch/performance-evidence.md

key-decisions:
  - "Enabled SEO evidence is proven by building the owned fake-provider production lifecycle with DISABLE_INDEXING=false, not by deleting withNoindexRobots."
  - "Security headers and disabled SEO continue to run against DISABLE_INDEXING=true; enabled SEO starts a distinct indexable lifecycle."
  - "Search Console remains owner-gated pending evidence and does not affect automated code readiness scoring."
  - "The regenerated final report is 94/100 and remains Not launch-ready solely because performance still fails."

patterns-established:
  - "Use lifecycleProfile: noindex or indexable on required live final-audit checks that depend on build-time env."
  - "Restart the owned production lifecycle when required live checks need a different indexing profile."

requirements-completed: [SEO-01, QA-02]

# Metrics
duration: 17 min
completed: 2026-06-23
---

# Phase 17 Plan 07: Launch-Indexing Lifecycle Summary

**Final readiness now proves enabled SEO against a launch-indexing build while preserving noindex safety and owner-gated Search Console proof**

## Performance

- **Duration:** 17 min
- **Started:** 2026-06-23T13:14:34Z
- **Completed:** 2026-06-23T13:31:56Z
- **Tasks:** 4
- **Files modified:** 9

## Accomplishments

- Added a `disableIndexing` option to the fake-provider production lifecycle, defaulting to noindex mode for existing performance probes.
- Split final-readiness live checks into `noindex` and `indexable` lifecycle profiles so enabled SEO is built with `DISABLE_INDEXING=false`.
- Added contract coverage that protects `withNoindexRobots` and verifies enabled SEO fails if indexable routes render noindex.
- Regenerated launch evidence: `seo enabled` now passes, Search Console rows remain pending, and the final report is `94/100` with only `performance` failing.

## Task Commits

Each task was committed atomically:

1. **Task 1: Parameterize the fake-provider production lifecycle indexing mode** - `12c1085a` (fix)
2. **Task 2: Run disabled and enabled SEO probes against distinct lifecycle profiles** - `fb9644b9` (fix)
3. **Task 3: Update noindex contract tests to protect both modes** - `51170946` (test)
4. **Task 4: Regenerate enabled SEO and readiness evidence** - `9facb926` (docs)

**Plan metadata:** this summary and planning-state updates are captured in the final metadata commit.

## Files Created/Modified

- `scripts/performance/probe-lighthouse.mjs` - Adds `disableIndexing` lifecycle configuration and passes options into `startProductionLifecycle`.
- `scripts/performance/probe-lighthouse.test.mjs` - Covers default noindex lifecycle env and explicit launch-indexing env.
- `scripts/launch/run-final-readiness-audit.mjs` - Adds lifecycle profiles and restarts the owned server when a live check needs a different indexing mode.
- `scripts/launch/run-final-readiness-audit.test.mjs` - Covers lifecycle profile assignment, profile switching, `--no-start-server` failures, and owner-gated Search Console scoring separation.
- `scripts/component-contracts/noindex-mode.test.mjs` - Guards the final audit indexable lifecycle and the SEO probe's `!hasNoindex` requirement.
- `docs/launch/seo-route-evidence.md` - Records local disabled and enabled SEO proof while keeping launch-host and Search Console proof pending.
- `docs/launch/final-production-readiness-report.md` - Regenerated report with `seo enabled` PASS and `performance` as the only failed automated check.
- `docs/launch/performance-evidence.md` - Refreshed by the final audit command with current local Lighthouse failures.

## Decisions Made

- Enabled SEO is proven through an explicit launch-indexing build profile instead of removing noindex helpers from route metadata.
- Required live final-audit checks that depend on build-time env get an explicit lifecycle profile.
- Owner-gated Search Console proof remains `pending`, `owner-blocked`, or `approved` only with dated owner evidence.
- Performance remains out of scope for this plan and is left as the single automated blocker for plan 17-08.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `pnpm audit:readiness` exited 1 after regenerating the report because `performance` still fails with seven route-level local Lighthouse FAIL rows. This is the pre-existing PERF-01 blocker assigned to plan 17-08; enabled SEO now passes.
- The audit command also refreshed `docs/launch/performance-evidence.md` with current lab metrics. The file was committed with Task 4 so the final report and referenced evidence stay in sync.

## Known Stubs

- `docs/launch/seo-route-evidence.md` keeps product structured-data proof pending until a representative product path and Shopify storefront credentials are available. This is an intentional owner/environment-gated evidence item.
- `docs/launch/final-production-readiness-report.md` keeps Shopify hosted checkout, payment, shipping, tax, order, success redirect, live Customer Account OAuth, protected customer data, B2B/customer pricing, and Search Console rows `pending`. These are owner-gated launch proof rows, not automated code stubs.

## User Setup Required

None - no new service credentials are required by this plan. Owner-gated Search Console and Shopify/admin launch proof remain pending until the owner provides access or dated evidence.

## Next Phase Readiness

Plan 17-08 can focus on the remaining performance blocker. The SEO indexing gap is closed in local fake-provider production evidence: disabled SEO runs with `DISABLE_INDEXING=true`, enabled SEO runs with `DISABLE_INDEXING=false`, and Search Console proof remains honest and owner-gated.

## Self-Check: PASSED

- Found summary file: `.planning/phases/17-operations-performance-and-final-production-readiness-audit/17-07-SUMMARY.md`
- Found task commits: `12c1085a`, `fb9644b9`, `51170946`, `9facb926`

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-23*
