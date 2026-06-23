---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 06
subsystem: launch-readiness
tags: [performance, lighthouse, final-audit, seo, launch-readiness]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: performance evidence and final readiness audit from plans 17-04 and 17-05
provides:
  - Strict performance readiness semantics for Lighthouse metric FAIL rows
  - Final audit required live-server probes that fail instead of skipping by default
  - Regenerated honest launch evidence with blocking SEO/performance status
affects: [phase-17-final-audit, launch-readiness, performance-evidence, seo-evidence]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Strict local Lighthouse FAIL rows set a nonzero readiness exit unless explicitly allowed
    - Final readiness starts the fake-provider production lifecycle for required live probes
    - Explicit CLI skip flags are the only source of skipped automated checks in the final audit

key-files:
  created:
    - .planning/phases/17-operations-performance-and-final-production-readiness-audit/17-06-SUMMARY.md
  modified:
    - scripts/performance/probe-lighthouse.mjs
    - scripts/performance/probe-lighthouse.test.mjs
    - scripts/launch/run-final-readiness-audit.mjs
    - scripts/launch/run-final-readiness-audit.test.mjs
    - docs/launch/performance-evidence.md
    - docs/launch/final-production-readiness-report.md

key-decisions:
  - "Performance metric FAIL rows are launch-blocking by default; evidence-only diagnostics require --allow-metric-failures."
  - "Final readiness required live-server probes are PASS/FAIL evidence and are not excluded from the score merely because a server was initially absent."
  - "The current final readiness report intentionally blocks launch while enabled SEO/noindex and local Lighthouse performance failures remain."

patterns-established:
  - "Use --json-summary on performance evidence when another readiness command needs structured route status counts."
  - "Call probe scripts directly from the final audit when package-manager argument forwarding would change script argv semantics."

requirements-completed: [QA-02]

# Metrics
duration: 2h 43m
completed: 2026-06-23
---

# Phase 17 Plan 06: Strict Readiness Evidence Summary

**Strict Lighthouse metric gating and final audit scoring that blocks launch on required SEO/performance failures**

## Performance

- **Duration:** 2h 43m
- **Started:** 2026-06-23T09:18:21Z
- **Completed:** 2026-06-23T12:01:29Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Changed `pnpm test:performance` so route-level `FAIL` metrics make the command exit nonzero by default, while `--allow-metric-failures` remains available for explicit evidence-only diagnostics.
- Added `--json-summary` output for performance rows so the final audit can capture pass/warn/fail/blocking counts and route metrics.
- Changed the final readiness audit so required security and SEO live-server probes are `PASS` or `FAIL` in default runs, not `SKIPPED` because no server was already running.
- Regenerated performance and final readiness evidence. Current result is honest: `88/100`, no default skipped live probes, `seo enabled` and `performance` failing, and launch marked `Not launch-ready`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Make performance metric failures block readiness by default** - `5ef27319` (fix)
2. **Task 2: Make the final audit own required live-server probes** - `8e226ae7` (fix)
3. **Deviation: Fix security probe argument forwarding exposed by strict live probes** - `93759df0` (fix)
4. **Task 3: Re-run strict evidence and record the honest launch decision** - `668057ea` (docs)

**Plan metadata:** this summary and tracking updates are captured in the final metadata commit.

## Files Created/Modified

- `scripts/performance/probe-lighthouse.mjs` - Adds strict metric-failure exit semantics, `--allow-metric-failures`, `--json-summary`, and launch-blocking evidence copy.
- `scripts/performance/probe-lighthouse.test.mjs` - Covers new flags, JSON summary shape, and strict FAIL-row readiness behavior.
- `scripts/launch/run-final-readiness-audit.mjs` - Starts the owned production-like lifecycle for required live probes, fails unreachable required probes, uses strict performance JSON output, and renders required-check scoring.
- `scripts/launch/run-final-readiness-audit.test.mjs` - Covers the new runner flags, required live-probe failure behavior, performance failure launch blocking, and direct security-probe command.
- `docs/launch/performance-evidence.md` - Records current strict local Lighthouse evidence with seven launch-blocking FAIL rows.
- `docs/launch/final-production-readiness-report.md` - Records the current final audit as `88/100` and `Not launch-ready`.

## Decisions Made

- Required automated checks stay in the denominator unless an explicit skip flag is used.
- Owner-gated Shopify/admin proof remains separate and pending; no owner approvals were fabricated.
- Current local evidence blocks launch rather than claiming readiness: enabled SEO still renders noindex and all representative Lighthouse routes remain metric FAIL.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Final audit passed a package-manager separator to the security probe**
- **Found during:** Task 3 (Re-run strict evidence and record the honest launch decision)
- **Issue:** Once required live-server probes stopped skipping, `pnpm test:security -- http://127.0.0.1:4173` forwarded the literal `--` as the script's first argument, producing usage output instead of header evidence.
- **Fix:** Changed the final audit matrix to call `node scripts/security/probe-production-security.mjs http://127.0.0.1:4173` directly and added test coverage for the command.
- **Files modified:** `scripts/launch/run-final-readiness-audit.mjs`, `scripts/launch/run-final-readiness-audit.test.mjs`
- **Verification:** `node --test scripts/launch/run-final-readiness-audit.test.mjs`; `pnpm audit:readiness`
- **Committed in:** `93759df0`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** The fix made the audit evidence more truthful. Security headers now pass from actual probe output instead of failing on argument parsing.

## Issues Encountered

- `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --json-summary` exited 1 as expected because seven representative routes still have Lighthouse metric `FAIL` rows.
- `pnpm audit:readiness` exited 1 as expected after writing the report. The final report now blocks launch on `seo enabled` and `performance` while leaving owner-gated Shopify/admin proof pending.
- The audit run surfaced the existing rate-limit fail-closed message during command output, but the final report's failed checks are the required enabled SEO and performance gates.

## User Setup Required

None - no new service credentials are required by this plan. Owner-gated Shopify hosted checkout/payment/shipping/tax/order/success redirect, live Customer Account OAuth, protected customer data, B2B/customer pricing, and Search Console proof remain pending until the owner provides approval and evidence.

## Next Phase Readiness

Phase 17 now has strict final evidence rather than a false `100/100`. The remaining launch blockers are explicit: enabled SEO/indexing still fails while the local server is noindexed, and strict local Lighthouse evidence records seven performance FAIL rows.

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-23*
