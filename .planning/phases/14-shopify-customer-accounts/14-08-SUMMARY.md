---
phase: 14-shopify-customer-accounts
plan: 08
subsystem: account-link-evidence
tags: [account-links, footer, header, storybook, playwright]
requires:
  - 14-05
provides:
  - Direct header and footer account href evidence in fake-Shopify browser coverage
  - Footer text-link story fixture without stale external customer-login URL
affects: [header, footer, account-migration, fake-shopify-tests]
tech-stack:
  added: []
  patterns:
    - Protected account redirects are verified separately from direct link href evidence
key-files:
  created: []
  modified:
    - src/components/layout/footer/link/link-item.stories.tsx
key-decisions:
  - "The isolated footer External story now uses a non-account external terms link so it cannot be mistaken for production Login behavior."
patterns-established:
  - "Account-link UAT evidence should inspect anchor hrefs before navigating into protected routes."
requirements-completed:
  - MIG-01
  - MIG-02
  - SEC-04
duration: 4 min
completed: 2026-06-22
---

# Phase 14 Plan 08: Account Link Evidence Gap Summary

**Account link evidence now distinguishes owned `/account` hrefs from expected protected-route redirects.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-22T11:13:00+08:00
- **Completed:** 2026-06-22T11:15:02+08:00
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Confirmed existing E2E coverage directly asserts the header Account link and footer Login link use `/account` before route navigation.
- Confirmed the same browser test treats `/account/login?returnTo=%2Faccount` as expected protected-route behavior, not link-target evidence.
- Replaced the stale `mrtea.com.au/account/login` isolated footer Storybook fixture with a non-account external terms example.

## Task Commits

1. **Task 2: Remove stale mrtea account fixture from footer Storybook story** - `ca961f0` (`test(14-08)`)

## Files Created/Modified

- `src/components/layout/footer/link/link-item.stories.tsx` - Uses an external terms page example instead of an account Login fixture.

## Decisions Made

Kept production header/footer data unchanged because the owned `/account` targets were already correct.

## Deviations from Plan

Task 1 was already satisfied by existing fake-Shopify E2E href assertions. This run verified that coverage and completed the remaining Storybook fixture cleanup.

**Total deviations:** 0 auto-fixed.
**Impact:** No scope expansion.

## Issues Encountered

The first focused E2E run was blocked by an existing `next dev` process on port 3000. That specific process was stopped and the Playwright grep passed.

## Verification

- `pnpm test:e2e -- tests/e2e/cart-checkout.spec.ts --grep "account migration links and legacy routes use the modern bridge"` - passed.
- Pre-commit hook ran `pnpm lint` and `pnpm test:contracts` - passed.

## User Setup Required

None.

## Next Phase Readiness

Plan 14-09 can polish the compact legacy bridge surface.

## Self-Check: PASSED

- Summary created.
- Task commit exists.
- Focused browser verification passed.

---
*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-22*
