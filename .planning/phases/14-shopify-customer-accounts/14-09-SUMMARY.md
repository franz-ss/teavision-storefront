---
phase: 14-shopify-customer-accounts
plan: 09
subsystem: legacy-account-bridge-ui
tags: [account-migration, storybook, typography, responsive, vitest]
requires:
  - 14-05
provides:
  - Compact legacy account bridge heading typography
  - Desktop and mobile Storybook fit assertions for register and recover bridge headings
  - Regression test preventing `type-heading-01` from returning to the compact bridge card
  - No-password bridge behavior preserved
affects: [legacy-account-routing, account-ui, storybook]
tech-stack:
  added: []
  patterns:
    - Storybook play functions can measure rendered line count and horizontal overflow for compact account surfaces
key-files:
  created: []
  modified:
    - src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.tsx
    - src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.stories.tsx
    - src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.test.tsx
key-decisions:
  - "LegacyBridge uses `type-heading-04` inside the compact card instead of page-scale `type-heading-01`."
patterns-established:
  - "Bridge stories assert no horizontal overflow and bounded line counts at desktop and mobile Storybook viewports."
requirements-completed:
  - MIG-02
  - MIG-03
  - SEC-04
duration: 7 min
completed: 2026-06-22
---

# Phase 14 Plan 09: Legacy Account Bridge Visual Gap Summary

**Legacy account bridge headings now fit the compact card at desktop and mobile widths.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-22T11:16:00+08:00
- **Completed:** 2026-06-22T11:18:48+08:00
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Replaced `type-heading-01` with compact `type-heading-04` typography for `LegacyBridge`.
- Added balanced, constrained heading width treatment inside the compact card.
- Added shared Storybook play assertions for register and recover bridge headings at desktop and `mobile1` viewports.
- Added a focused integration test that fails if `type-heading-01` returns.
- Preserved Shopify-hosted sign-in copy, primary sign-in href, contact support action, and no-password behavior.

## Task Commits

1. **Task 1 and 2: Compact legacy bridge typography and coverage** - `3a01068` (`fix(14-09)`)

## Files Created/Modified

- `src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.tsx` - Uses compact card heading typography.
- `src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.stories.tsx` - Adds desktop and mobile rendered-fit assertions.
- `src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.test.tsx` - Adds the `does not use type-heading-01` regression test.

## Decisions Made

Kept the existing props contract and local primitives so the route bridge pages did not need server-route or copy changes.

## Deviations from Plan

None - plan executed as written.

**Total deviations:** 0 auto-fixed.
**Impact:** No scope expansion.

## Issues Encountered

The narrow Storybook `--testNamePattern` skipped all stories in this runner, so the full Storybook suite was run to exercise the new bridge assertions.

## Verification

- `pnpm test:integration -- "src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.test.tsx" -t "does not use type-heading-01"` - passed.
- `pnpm test:integration -- "src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.test.tsx"` - passed.
- `pnpm test:stories` - passed, 102 files / 357 tests.
- Pre-commit hook ran `pnpm lint` and `pnpm test:contracts` - passed.

## User Setup Required

None.

## Next Phase Readiness

All Phase 14 gap-closure plans now have implementation commits, summaries, and targeted verification. The phase is ready for final verification.

## Self-Check: PASSED

- Summary created.
- Task commit exists.
- Targeted integration and full Storybook verification passed.

---
*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-22*
