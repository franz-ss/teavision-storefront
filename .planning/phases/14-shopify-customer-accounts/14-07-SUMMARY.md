---
phase: 14-shopify-customer-accounts
plan: 07
subsystem: account-profile-ui
tags: [shopify-customer-account, profile, server-actions, storybook, react]
requires:
  - 14-03
provides:
  - Writable profile shape limited to first and last name
  - Server Action boundary that ignores stale phone form data
  - Read-only account-managed phone display in the profile form
  - Storybook coverage for present and unavailable read-only phone states
affects: [account-profile, customer-account-actions, account-ui]
tech-stack:
  added: []
  patterns:
    - Unsupported Customer Account fields are displayed as account-managed read-only values, not disabled inputs
key-files:
  created: []
  modified:
    - src/app/(storefront)/account/_components/profile-form/profile-form.tsx
    - src/app/(storefront)/account/_components/profile-form/profile-form.stories.tsx
key-decisions:
  - "Phone remains readable in the account profile but is no longer presented as an editable Shopify-persisted field."
patterns-established:
  - "Profile read-only identity fields use the same warm paper block treatment as email."
requirements-completed:
  - ACCT-02
  - ACCT-03
  - SEC-02
  - SEC-04
duration: 5 min
completed: 2026-06-22
---

# Phase 14 Plan 07: Read-Only Profile Phone Gap Summary

**Profile phone is visible as Shopify-managed account information without an editable control.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-22T11:10:00+08:00
- **Completed:** 2026-06-22T11:12:51+08:00
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Confirmed the type and Server Action boundary already excludes unsupported phone writes and ignores stale `phone` form data.
- Updated `ProfileForm` copy to explain that email and phone are managed through Shopify account sign-in.
- Added a read-only phone block that shows the current phone number or a clear unavailable state.
- Extended Storybook play coverage to assert there is no editable Phone textbox while the read-only value is visible.

## Task Commits

1. **Task 2: Render phone as read-only account-managed information** - `2005965` (`fix(14-07)`)

## Files Created/Modified

- `src/app/(storefront)/account/_components/profile-form/profile-form.tsx` - Adds the read-only phone display and Shopify-managed helper copy.
- `src/app/(storefront)/account/_components/profile-form/profile-form.stories.tsx` - Adds phone-present and phone-unavailable assertions.

## Decisions Made

Used a read-only text block instead of a disabled input so customers do not infer that phone changes will save from this form.

## Deviations from Plan

Task 1 was already satisfied by existing `types.ts`, `actions.ts`, and `actions.test.ts` code. This run verified it and completed the missing UI/story behavior.

**Total deviations:** 0 auto-fixed.
**Impact:** No scope expansion.

## Issues Encountered

The narrow Storybook `--testNamePattern` returned zero matching stories in this runner, so the full Storybook suite was run for real browser-story evidence.

## Verification

- `pnpm test:integration -- src/lib/shopify/customer-account/actions.test.ts` - passed.
- `pnpm test:stories` - passed, 102 files / 355 tests.
- Pre-commit hook ran `pnpm lint` and `pnpm test:contracts` - passed.

## User Setup Required

None.

## Next Phase Readiness

Plan 14-08 can close the account-link evidence gap.

## Self-Check: PASSED

- Summary created.
- Task commit exists.
- Targeted integration and Storybook verification passed.

---
*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-22*
