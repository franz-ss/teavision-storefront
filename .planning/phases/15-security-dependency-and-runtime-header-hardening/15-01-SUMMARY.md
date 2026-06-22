---
phase: 15-security-dependency-and-runtime-header-hardening
plan: 01
subsystem: infra
tags: [dependencies, audit, next, pnpm, supply-chain]
requires: []
provides:
  - "Patched dependency baseline with zero critical/high pnpm audit findings"
  - "Phase 15 dependency audit evidence with residual moderate rationale"
affects: [security, dependencies, headers, runtime-hardening]
tech-stack:
  added: [vite]
  patterns:
    - "pnpm 11 overrides live in pnpm-workspace.yaml"
    - "Residual moderate audit findings require runtime-exposure classification"
key-files:
  created:
    - ".planning/phases/15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md"
  modified:
    - "package.json"
    - "pnpm-lock.yaml"
    - "pnpm-workspace.yaml"
key-decisions:
  - "Use pnpm-workspace.yaml for active pnpm 11 overrides because package.json pnpm.overrides is ignored."
  - "Use direct dev vite@8.0.16 instead of a vite@^8 override so Storybook/Vitest get the patched Vite line without breaking Sanity's Vite 7 peer tree."
  - "Patch runtime-adjacent uuid exposure through resend@6.14.0 and @sanity/uuid@3.0.3, leaving only Sanity CLI/tooling uuid residuals."
patterns-established:
  - "Dependency audit evidence records baseline, direct upgrades, active overrides, residual exposure, and verification commands."
requirements-completed: [SEC-01]
duration: 16 min
completed: 2026-06-22
---

# Phase 15 Plan 01: Dependency Audit Remediation and Evidence Summary

**Patched Next/Sanity/Storybook dependency graph with zero critical or high audit findings and documented tooling-only moderate residuals.**

## Performance

- **Duration:** 16 min
- **Started:** 2026-06-22T17:59:58+08:00
- **Completed:** 2026-06-22T18:15:51+08:00
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Captured baseline `pnpm audit --audit-level moderate --json` evidence: 1 critical, 16 high, 18 moderate, 10 low.
- Upgraded the vulnerable direct/runtime and tooling parents, including `next@16.2.9`, `eslint-config-next@16.2.9`, `next-sanity@13.1.1`, Storybook `10.4.6`, `@graphql-codegen/cli@7.1.3`, `lighthouse@13.4.0`, and `resend@6.14.0`.
- Added active pnpm 11 workspace overrides for `@sanity/uuid@3.0.3`, `postcss@8.5.15`, and `sanity@5.29.0`.
- Verified final security threshold: `pnpm audit --audit-level high` exits 0; final moderate audit has 0 critical, 0 high, 4 moderate, and 1 low.

## Task Commits

Each task was committed atomically:

1. **Task 1: Capture baseline audit evidence and classify runtime exposure** - `2c65669` (chore)
2. **Task 2: Apply direct patch upgrades and targeted overrides** - `934f975` (chore)
3. **Task 3: Verify dependency remediation and finalize audit evidence** - `8d9c686` (chore)

## Files Created/Modified

- `.planning/phases/15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md` - Baseline/final audit evidence, remediation log, residual rationale, verification matrix.
- `package.json` - Direct dependency and devDependency patch upgrades, including direct dev `vite@8.0.16`.
- `pnpm-lock.yaml` - pnpm-resolved patched dependency graph.
- `pnpm-workspace.yaml` - Active pnpm 11 overrides for patched transitive parents.

## Decisions Made

- Active overrides live in `pnpm-workspace.yaml` because pnpm 11.5.2 ignores `package.json#pnpm.overrides`.
- Direct `vite@8.0.16` is safer than a `vite@^8.0.0` override because the override made pnpm expect Vite 8 inside Sanity's Vite 7 toolchain.
- `resend@6.14.0` removes the runtime `svix -> uuid@10.0.0` path; the remaining UUID advisory is limited to Sanity CLI tooling.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Planned pnpm command rejected by current pnpm**
- **Found during:** Task 2 (Apply direct patch upgrades and targeted overrides)
- **Issue:** `pnpm up ... --latest` with explicit versions failed with `ERR_PNPM_LATEST_WITH_SPEC`.
- **Fix:** Ran the same pinned upgrade list without `--latest`.
- **Files modified:** `package.json`, `pnpm-lock.yaml`, `.planning/phases/15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md`
- **Verification:** Direct package versions updated; `pnpm peers check` passed; audit high threshold passed.
- **Committed in:** `934f975`

**2. [Rule 3 - Blocking] pnpm 11 ignores package.json overrides**
- **Found during:** Task 2 (Apply direct patch upgrades and targeted overrides)
- **Issue:** `pnpm install` warned that `package.json#pnpm.overrides` is ignored in pnpm 11.
- **Fix:** Moved active overrides to `pnpm-workspace.yaml`.
- **Files modified:** `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.planning/phases/15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md`
- **Verification:** Overrides appear in `pnpm-lock.yaml`; `pnpm peers check` passed.
- **Committed in:** `934f975`, `8d9c686`

**3. [Rule 2 - Missing Critical] Runtime-adjacent UUID path needed parent patching**
- **Found during:** Task 3 (Verify dependency remediation and finalize audit evidence)
- **Issue:** Residual `uuid@10.0.0` initially remained under `resend -> svix`, a runtime email dependency path.
- **Fix:** Upgraded `resend` to `6.14.0` and pinned `@sanity/uuid` to `3.0.3`; only Sanity CLI tooling retains a UUID moderate residual.
- **Files modified:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.planning/phases/15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md`
- **Verification:** `pnpm why uuid` shows remaining `uuid@10.0.0` only under `@sanity/cli -> typeid-js`; `pnpm audit --audit-level high` passed.
- **Committed in:** `8d9c686`

---

**Total deviations:** 3 auto-fixed (1 missing critical, 2 blocking). **Impact:** All deviations reduced dependency risk or restored tool compatibility. No generated Shopify files were touched.

## Issues Encountered

- Current pnpm rejected the planned `--latest` command form with explicit versions.
- pnpm 11 requires overrides in workspace settings.
- Residual `pnpm audit --audit-level moderate` exits 1 by design because 4 moderate and 1 low findings remain, all documented as non-storefront-runtime/tooling residuals.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 15-02 can start from a patched dependency baseline: Next is on `16.2.9`, critical/high audit findings are eliminated, peer dependencies pass, build passes, and residual moderate findings are documented for final verification.

---
*Phase: 15-security-dependency-and-runtime-header-hardening*
*Completed: 2026-06-22*
