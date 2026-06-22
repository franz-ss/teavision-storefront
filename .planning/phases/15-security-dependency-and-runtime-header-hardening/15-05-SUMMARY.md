---
phase: 15-security-dependency-and-runtime-header-hardening
plan: 05
subsystem: evidence
tags: [runtime-probe, headers, audit, phase-evidence]
requires: [15-02, 15-03, 15-04]
provides:
  - "Repeatable production response security probe"
  - "Final Phase 15 runtime security evidence"
  - "Updated dependency audit final verification"
affects: [security, evidence, launch-readiness, runtime-hardening]
tech-stack:
  added: []
  patterns:
    - "Built local production server probes validate actual response headers"
    - "Evidence separates automated fake/local proof from owner-gated live Shopify proof"
key-files:
  created:
    - "scripts/security/probe-production-security.mjs"
    - ".planning/phases/15-security-dependency-and-runtime-header-hardening/15-RUNTIME-SECURITY-EVIDENCE.md"
  modified:
    - "package.json"
    - ".planning/phases/15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md"
key-decisions:
  - "Use a markdown-table probe script that exits non-zero on missing required headers, x-powered-by leakage, or unexpected enforced CSP."
  - "Record pnpm audit moderate as expected exit 1 due documented low/moderate tooling residuals, while audit high exits 0."
  - "Do not claim live Shopify Customer Account OAuth or hosted checkout proof without owner/admin approval."
patterns-established:
  - "Phase evidence files include command status, route probe output, and owner-gated status."
requirements-completed: [SEC-01, SEC-02, SEC-03, SEC-04, SEC-05]
duration: 13 min
completed: 2026-06-22
---

# Phase 15 Plan 05: Final Runtime Security Probe and Phase Evidence Summary

**Added a repeatable production response probe and captured final Phase 15 evidence for dependencies, headers/CSP, account OAuth boundaries, and abuse controls.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-06-22T18:49:00+08:00
- **Completed:** 2026-06-22T19:02:12+08:00
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Created `scripts/security/probe-production-security.mjs`, which fetches representative routes and validates required security headers.
- Added `test:security` to `package.json`.
- Ran the final Phase 15 verification command set: audit, lint, typecheck, build, unit, integration, contracts, and fake-Shopify e2e.
- Started a built local production server with safe local account redirect values and ran the security probe against seven representative routes.
- Captured `15-RUNTIME-SECURITY-EVIDENCE.md` with requirement coverage, command statuses, probe table, CSP mode, owner-gated items, account proof, and abuse-control evidence.
- Updated `15-DEPENDENCY-AUDIT.md` with final Phase 15 command counts and probe evidence.

## Task Commits

Plan work was committed as:

1. **Task 1: Add a production security probe script** - `65c3883` (test)
2. **Tasks 2 and 3: Capture final runtime evidence and owner-gated notes** - `d9e382a` (docs)

## Files Created/Modified

- `scripts/security/probe-production-security.mjs` - Repeatable markdown-table response header probe.
- `package.json` - Added `test:security`.
- `.planning/phases/15-security-dependency-and-runtime-header-hardening/15-RUNTIME-SECURITY-EVIDENCE.md` - Final Phase 15 runtime security evidence.
- `.planning/phases/15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md` - Final verification counts and probe reference.

## Verification

- `node scripts/security/probe-production-security.mjs` without a base URL - passed expected usage failure.
- `pnpm audit --audit-level moderate` - exit 1 with documented residual 1 low and 4 moderate; no critical/high.
- `pnpm audit --audit-level high` - exit 0.
- `pnpm lint` - passed.
- `pnpm typecheck` - passed.
- `pnpm build` - passed, 75 static pages generated.
- `pnpm test:unit` - passed, 51 files and 200 tests.
- `pnpm test:integration` - passed, 9 files and 43 tests.
- `pnpm test:contracts` - passed, 38 subtests.
- `pnpm test:e2e` - passed, 4 fake-Shopify tests.
- `node scripts/security/probe-production-security.mjs http://127.0.0.1:4316` - passed, 7 representative routes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Windows Start-Process could not launch the pnpm shim directly**
- **Found during:** Task 2 production server probe
- **Issue:** `Start-Process` resolved `pnpm` to a non-Win32 shim and failed with `%1 is not a valid Win32 application`.
- **Fix:** Launched through `cmd.exe /c`.
- **Verification:** Later server launch reached Next.js readiness.

**2. [Rule 3 - Blocking] `pnpm start -- -p` passed the separator through to Next**
- **Found during:** Task 2 production server probe
- **Issue:** Next interpreted `-p` as a project directory after pnpm passed `"--"`.
- **Fix:** Used `pnpm exec next start -p 4316`.
- **Verification:** Built server became ready and probe passed.

**3. [Rule 2 - Missing Critical] Storefront fake endpoint is intentionally blocked in production runtime**
- **Found during:** Task 2 probe setup
- **Issue:** The plan's sample safe Storefront test env cannot be used with `next start` because `getStorefrontEndpoint()` rejects local test endpoints in production.
- **Fix:** Ran the header probe against the built app without enabling Storefront test endpoints, while using safe local Customer Account callback/logout env values and not initiating hosted checkout or live OAuth.
- **Verification:** Probe passed across representative routes; evidence documents this boundary.

---

**Total deviations:** 3 auto-fixed. **Impact:** Probe remained local and repeatable; evidence does not overstate live Shopify proof.

## Issues Encountered

- `pnpm audit --audit-level moderate` still exits 1 by design because low/moderate tooling residuals remain. `pnpm audit --audit-level high` exits 0.
- `pnpm test:e2e` emitted existing Next development warnings about cache bypass and `/teavision.svg` LCP loading, but all fake-Shopify tests passed.

## User Setup Required

- Live Shopify Customer Account OAuth remains owner/admin-gated.
- Hosted checkout, payment, shipping-rate, tax, order creation, success redirect, protected customer data, and B2B pricing remain Phase 17 owner-gated.

## Next Phase Readiness

Phase 15 is ready for verification/closeout. Phase 16 can build on a staged report-only CSP baseline, tested security headers, documented dependency residuals, account OAuth local/fake evidence, and explicit form/search abuse-control posture.

---
*Phase: 15-security-dependency-and-runtime-header-hardening*
*Completed: 2026-06-22*
