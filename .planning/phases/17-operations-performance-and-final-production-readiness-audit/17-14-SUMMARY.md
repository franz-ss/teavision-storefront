---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 14
subsystem: performance
tags: [performance, cls, account, render-shell, contracts]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: cart/search/privacy render-shell remediation from 17-13
provides:
  - Stable account route/loading/login/dashboard first-viewport geometry
  - Reserved local account login panel footprint
  - Static render-shell contracts for account, cart, search, and privacy launch surfaces
affects: [performance-evidence, account, cart, search, privacy-policy, PERF-01]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Keep account route surfaces server-owned while reserving identical loading/login/dashboard geometry
    - Use fixed-file component contracts for launch shell regressions
    - Scope Tailwind canonical-class exceptions to explicit launch performance contracts

key-files:
  created:
    - scripts/component-contracts/render-shell-performance.test.mjs
    - .planning/phases/17-operations-performance-and-final-production-readiness-audit/17-14-SUMMARY.md
  modified:
    - scripts/check-tailwind-classes.mjs
    - scripts/component-contracts/account-performance.test.mjs
    - src/app/(storefront)/account/layout.tsx
    - src/app/(storefront)/account/loading.tsx
    - src/app/(storefront)/account/login/page.tsx
    - src/app/(storefront)/account/page.tsx
    - src/app/(storefront)/account/_components/login-panel/login-panel.tsx

key-decisions:
  - "Account loading, login, and dashboard wrappers use the same literal `min-h-[34rem] md:min-h-[32rem]` geometry so the contract can reject the old tokenized form."
  - "The Tailwind canonical-class checker allows that literal geometry only in the four account wrapper files required by 17-14."
  - "Render-shell contracts lock the 17-13 cart/search/privacy decisions before final strict performance evidence reruns."

patterns-established:
  - "When launch performance plans require a literal Tailwind class, any canonical-checker exception must be file-scoped and token-scoped."
  - "Route-shell regression tests should read fixed source files rather than scanning generated output or node_modules."

requirements-completed: [UX-01, QA-02]
requirements-addressed: [PERF-01]

# Metrics
duration: 10 min
completed: 2026-06-24
---

# Phase 17 Plan 14: Account CLS and Render-Shell Contract Summary

**Account route geometry is stabilized and the 17-13/17-14 shell remediations are now guarded before final performance evidence reruns.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-06-24T04:58:30Z
- **Completed:** 2026-06-24T05:08:38Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Replaced the account layout, loading, login, and dashboard wrapper geometry with identical `min-h-[34rem] md:min-h-[32rem]` classes.
- Added `min-h-72` and `content-start` to the local account login panel while preserving `prefetch={false}` on the Shopify sign-in link.
- Updated the account performance contract to reject the old `min-h-136 md:min-h-128` wrapper geometry and require the reserved login-panel footprint.
- Added `render-shell-performance.test.mjs` to guard the cart session waterfall fix, cart fallback footprint, streamed search hero/results split, privacy copy sizing, and account shell geometry.
- Added a narrow Tailwind canonical-class exception for the four account wrapper files and the two literal geometry tokens required by this plan.

## Task Commits

The implementation landed as one verified commit because the first Task 1 commit attempt was blocked by the intentionally stale account contract:

1. **Tasks 1-2: Stabilize account geometry and guard render shells** - `6609ef4b` (`perf(17-14): stabilize account and render shells`)

Plan metadata and this summary are captured in the final metadata commit.

## Files Created/Modified

- `src/app/(storefront)/account/layout.tsx` - Reserves stable route-level account geometry.
- `src/app/(storefront)/account/loading.tsx` - Matches account loading geometry to login/dashboard wrappers.
- `src/app/(storefront)/account/login/page.tsx` - Matches local login bridge geometry.
- `src/app/(storefront)/account/page.tsx` - Matches account dashboard wrapper geometry.
- `src/app/(storefront)/account/_components/login-panel/login-panel.tsx` - Reserves sign-in card content footprint and keeps `prefetch={false}`.
- `scripts/component-contracts/account-performance.test.mjs` - Guards bracketed account geometry and login-panel footprint.
- `scripts/component-contracts/render-shell-performance.test.mjs` - Guards cart/search/privacy/account render-shell contracts.
- `scripts/check-tailwind-classes.mjs` - Allows the plan-required literal account geometry in only the four account wrapper files.

## Decisions Made

- Kept the account route server-owned and did not change Customer Account routing, login-start, callback, logout, protected-data, or B2B pricing behavior.
- Chose a token-scoped Tailwind checker exception instead of weakening the global canonical-class rule. Without this, `pnpm lint` rejected the exact literal classes required by the 17-14 acceptance criteria.
- Kept the render-shell test as a fixed-file source contract so it guards launch decisions without scanning generated files or relying on brittle comment grep.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added a scoped Tailwind canonical-class exception**

- **Found during:** Task 1 lint verification
- **Issue:** `pnpm lint` rejected `min-h-[34rem] md:min-h-[32rem]` because the repo checker canonicalizes them to `min-h-136 md:min-h-128`, while the plan explicitly required the bracketed literal classes and contracts that fail if the old geometry returns.
- **Fix:** Added a file-scoped and token-scoped exception in `scripts/check-tailwind-classes.mjs` for only the four account wrapper files and only the two plan-required classes.
- **Files modified:** `scripts/check-tailwind-classes.mjs`
- **Verification:** Targeted lint and full contract tests passed after the exception.
- **Committed in:** `6609ef4b`

---

**Total deviations:** 1 auto-fixed (blocking)
**Impact on plan:** The final implementation preserves the plan's literal acceptance contract while keeping the Tailwind checker strict everywhere else.

## Issues Encountered

- The first commit attempt failed pre-commit because `account-performance.test.mjs` still asserted the old geometry. Updating the contract resolved the hook failure.

## Verification

- `node --test scripts/component-contracts/account-performance.test.mjs scripts/component-contracts/render-shell-performance.test.mjs` - PASS, 4/4 tests.
- `pnpm test:contracts` - PASS, 49/49 tests.
- `pnpm lint -- "src/app/(storefront)/account/layout.tsx" "src/app/(storefront)/account/loading.tsx" "src/app/(storefront)/account/login/page.tsx" "src/app/(storefront)/account/page.tsx" "src/app/(storefront)/account/_components/login-panel/login-panel.tsx" scripts/component-contracts/account-performance.test.mjs scripts/component-contracts/render-shell-performance.test.mjs` - PASS.
- `pnpm typecheck` - PASS.
- `pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts` - PASS, 10/10 tests.

## Auth Gates

None.

## Known Stubs

Production smoke continues to use fake Shopify and fake Customer Account providers. No real Shopify hosted checkout, payment, shipping, tax, order creation, success redirect, live OAuth, protected customer data, or B2B pricing test was run.

## Threat Flags

None. The new contracts read local source files only and do not expose secrets, PII, cart IDs, checkout URLs, raw provider payloads, or owner-gated data.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 17-15 can now regenerate strict performance evidence, final readiness evidence, and Phase 17 verification with account CLS and render-shell regressions guarded.

## Self-Check: PASSED

- Found summary file: `.planning/phases/17-operations-performance-and-final-production-readiness-audit/17-14-SUMMARY.md`
- Found implementation commit: `6609ef4b`
- Confirmed account wrapper files contain the exact `min-h-[34rem] md:min-h-[32rem]` class.
- Confirmed login panel contains `min-h-72`, `content-start`, and `prefetch={false}`.
- Confirmed production smoke passes 10/10 against the fake-provider production lifecycle.

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-24*
