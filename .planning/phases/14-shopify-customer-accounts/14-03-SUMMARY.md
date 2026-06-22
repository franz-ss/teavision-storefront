---
phase: 14-shopify-customer-accounts
plan: 03
subsystem: account-profile-addresses
tags: [shopify-customer-account, server-actions, profile, addresses, storybook, vitest]
requires:
  - 14-01
  - 14-02
provides:
  - Authenticated profile and address Server Actions
  - Supported profile/contact edit page
  - Default-first saved address book
  - Dedicated add/edit address form pages
  - Accessible delete-address confirmation dialog
  - Shopify user-error normalization for field and form messages
affects: [account-routes, customer-account-api, address-book, account-ui]
tech-stack:
  added: []
  patterns:
    - Server pages pass Server Actions into route-local client leaves to keep Storybook/browser imports away from server-only crypto.
    - Customer Account mutations revalidate `/account` plus the relevant account subpath after success.
    - Address form actions omit unchecked `defaultAddress` rather than sending an explicit false.
key-files:
  created:
    - src/lib/shopify/customer-account/actions.ts
    - src/lib/shopify/customer-account/actions.test.ts
    - src/app/(storefront)/account/profile/page.tsx
    - src/app/(storefront)/account/addresses/page.tsx
    - src/app/(storefront)/account/addresses/new/page.tsx
    - src/app/(storefront)/account/addresses/[id]/edit/page.tsx
    - src/app/(storefront)/account/_components/profile-form.tsx
    - src/app/(storefront)/account/_components/address-book.tsx
    - src/app/(storefront)/account/_components/address-form.tsx
    - src/app/(storefront)/account/_components/delete-address-dialog.tsx
    - src/app/(storefront)/account/_lib/address-formatting.ts
  modified:
    - package.json
    - src/lib/shopify/customer-account/operations.ts
    - src/lib/shopify/customer-account/types.ts
key-decisions:
  - "Profile edits are limited to first name, last name, and phone; email remains read-only with Shopify sign-in helper copy."
  - "Client form components receive action props from protected Server Components instead of importing the server-action module directly."
  - "Default address update returns refresh guidance as a success state if the mutation succeeds but the follow-up dashboard refresh fails."
patterns-established:
  - "Account form state lives in Customer Account types so Storybook and client leaves do not import server-only action modules for types."
  - "Address book sorts the default address first through a pure helper covered by unit tests and Storybook play assertions."
requirements-completed:
  - ACCT-02
  - ACCT-03
  - ADDR-01
  - ADDR-02
  - ADDR-03
  - ADDR-04
  - ADDR-05
duration: 22 min
completed: 2026-06-19
---

# Phase 14 Plan 03: Address Book And Supported Profile Mutations Summary

**Profile editing, saved address management, Shopify user-error normalization, and accessible delete confirmation**

## Performance

- **Duration:** 22 min
- **Started:** 2026-06-19T11:33:15+08:00
- **Completed:** 2026-06-19T11:55:10+08:00
- **Tasks:** 4
- **Files modified:** 20

## Accomplishments

- Added Customer Account mutation operations for profile updates, address create/update/delete, set-default, and normalized Shopify user errors.
- Added authenticated Server Actions that require a customer session before parsing IDs, revalidate account paths after success, and return safe form states.
- Added `/account/profile`, `/account/addresses`, `/account/addresses/new`, and `/account/addresses/[id]/edit` protected pages.
- Built route-local ProfileForm, AddressBook, AddressForm, and DeleteAddressDialog client leaves with Storybook states.
- Added default-first address formatting/sorting helpers, field-level ARIA error wiring, Australia-first address defaults, and the required destructive confirmation copy.

## Task Commits

1. **Plan 14-03 code and tests** - `69643bd` (`feat(14-03): add account profile and address management`)

**Plan metadata:** pending in docs commit.

## Files Created/Modified

- `src/lib/shopify/customer-account/actions.ts` - Authenticated profile/address Server Actions and revalidation behavior.
- `src/lib/shopify/customer-account/operations.ts` - Customer Account API profile/address mutation GraphQL operations and user-error normalization.
- `src/app/(storefront)/account/profile/page.tsx` - Protected profile edit page.
- `src/app/(storefront)/account/addresses/*` - Protected address book, new address, and edit address pages.
- `src/app/(storefront)/account/_components/*` - Profile form, address book, address form, delete dialog, and Storybook states.
- `src/app/(storefront)/account/_lib/address-formatting.ts` - Address lines and default-first sorting helpers.
- `package.json` - Integration script includes Customer Account Server Action tests.

## Decisions Made

- Kept email read-only because this implementation only exposes Customer Account API supported profile/contact fields locally.
- Passed Server Actions from protected Server Components into client leaves so Storybook does not import the server-only session/crypto module.
- Omitted unchecked `defaultAddress` from address mutation payloads instead of sending an explicit false.

## Deviations from Plan

None - plan behavior executed as written. The inline GSD run used one code/test commit for the plan instead of one commit per task.

## Issues Encountered

- Storybook initially failed because client components directly imported the Server Action module, which reaches `node:crypto` through session sealing. Passing actions as props from Server Components fixed the browser-runner boundary cleanly.

## Verification

- `pnpm test:unit -- src/lib/shopify/customer-account "src/app/(storefront)/account/_lib"` - passed, 8 files / 24 tests.
- `pnpm test:integration` - passed, 7 files / 22 tests.
- `pnpm typecheck` - passed.
- `pnpm test:stories` - passed, 99 files / 345 tests.
- `pnpm lint` - passed.
- Acceptance grep confirmed required action/session, form autocomplete, delete-dialog, awaited params, and no `customerId` reads in `actions.ts`.
- Pre-commit hooks ran `pnpm lint` and `pnpm test:contracts` successfully.

## User Setup Required

No new setup beyond the Customer Account env and Shopify admin prerequisites from Plan 14-01.

## Next Phase Readiness

Plan 14-04 can connect signed-in customer identity to cart checkout handoff using the authenticated session and fake-Shopify checkout boundary.

---

*Phase: 14-shopify-customer-accounts*
*Completed: 2026-06-19*
