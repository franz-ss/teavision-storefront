---
status: partial
phase: teavision-14-shopify-customer-accounts
source:
  - 14-01-SUMMARY.md
  - 14-02-SUMMARY.md
  - 14-03-SUMMARY.md
  - 14-04-SUMMARY.md
  - 14-05-SUMMARY.md
started: 2026-06-19T12:46:57.8047522+08:00
updated: 2026-06-22T10:22:15.2218088+08:00
---

## Current Test

[testing complete]

## Tests

### 1. Customer Account Sign-In Entry
expected: Visiting `/account/login` shows a compact Shopify sign-in panel with the primary action "Sign in with Shopify", account-oriented recovery states when requested, and no classic password form.
result: issue
reported: "After supplying the `.env` vars, the OAuth/account flow redirects to `localhost:3000/account/login?reason=verification-failed` and Chrome shows `ERR_SSL_PROTOCOL_ERROR` instead of returning to the account sign-in experience."
severity: blocker

### 2. Protected Account Dashboard
expected: Visiting `/account` while signed in shows the protected account workspace with recent orders, profile summary, default address, support paths, a quiet logout action, and scoped alerts if only one account section fails.
result: blocked
blocked_by: third-party
reason: "User reported same failure as Test 1; dashboard verification cannot proceed because the account OAuth flow redirects to `localhost:3000/account/login?reason=verification-failed` with `ERR_SSL_PROTOCOL_ERROR`."

### 3. Order History And Detail
expected: The account order history is cursor-paginated, uses a desktop table or mobile cards, and order detail pages show line items, totals, shipping address, fulfillment/payment status, and tracking links only when Shopify provides them.
result: blocked
blocked_by: third-party
reason: "User reported all same; order verification cannot proceed because the account OAuth flow redirects to `localhost:3000/account/login?reason=verification-failed` with `ERR_SSL_PROTOCOL_ERROR`."

### 4. Profile Editing
expected: The profile page lets a signed-in customer update supported fields, keeps email read-only with Shopify sign-in helper copy, surfaces Shopify field/form errors accessibly, and returns a clear success or recovery state.
result: issue
reported: "User reported that changing phone number does not work on the account profile page."
severity: major

### 5. Address Book Management
expected: The address book sorts the default address first, supports add/edit/default/delete flows, uses dedicated address form pages, and requires a confirmation dialog before deleting an address.
result: blocked
blocked_by: third-party
reason: "User reported all same; address verification cannot proceed because the account OAuth flow redirects to `localhost:3000/account/login?reason=verification-failed` with `ERR_SSL_PROTOCOL_ERROR`."

### 6. Cart Account Context
expected: The cart shows a compact signed-in account context near checkout controls, syncs buyer identity before checkout, and blocks checkout with retry, sign-in, and support recovery paths if identity sync fails.
result: blocked
blocked_by: third-party
reason: "User reported all same; cart account-context verification cannot proceed because the account OAuth flow redirects to `localhost:3000/account/login?reason=verification-failed` with `ERR_SSL_PROTOCOL_ERROR`."

### 7. Checkout Handoff Boundary
expected: Submitting checkout posts to `/cart/checkout`, validates terms and cart state, redirects to the fake checkout URL only after successful buyer identity sync, and does not visit real Shopify hosted checkout during automated testing.
result: blocked
blocked_by: third-party
reason: "User reported all same; checkout handoff verification cannot proceed because the account OAuth flow redirects to `localhost:3000/account/login?reason=verification-failed` with `ERR_SSL_PROTOCOL_ERROR`."

### 8. Header And Footer Account Links
expected: The header account icon links to `/account` with an accessible name, and the footer Login link points to the owned `/account` route rather than the old `mrtea.com.au` URL.
result: issue
reported: "Screenshot shows the account path resolving to `/account/login?returnTo=%2Faccount`; footer Login link target is not shown/verified, so the full header/footer link expectation is not confirmed."
severity: major

### 9. Legacy Account Bridge Routes
expected: Classic account routes such as register, recover, reset, activate, and unknown account paths show explanatory bridge pages for Shopify Customer Accounts, preserve only safe return/context values, and never show password inputs.
result: issue
reported: "Legacy account bridge UIs do not look good; screenshots show large wrapped headings on compact cards, making create/recover account bridge pages feel awkward and cramped."
severity: cosmetic

### 10. Launch Readiness Documentation
expected: `docs/testing/customer-accounts-setup.md` documents Customer Account admin setup, environment variables, local HTTPS OAuth testing, protected data access, manual checkout approval gates, reorder parity, B2B/customer-pricing parity, and launch checklist items.
result: pass

## Summary

total: 10
passed: 1
issues: 4
pending: 0
skipped: 0
blocked: 5

## Gaps

- truth: "Visiting `/account/login` shows a compact Shopify sign-in panel with the primary action \"Sign in with Shopify\", account-oriented recovery states when requested, and no classic password form."
  status: failed
  reason: "User reported: After supplying the `.env` vars, the OAuth/account flow redirects to `localhost:3000/account/login?reason=verification-failed` and Chrome shows `ERR_SSL_PROTOCOL_ERROR` instead of returning to the account sign-in experience."
  severity: blocker
  test: 1
  root_cause: "Account OAuth was started from `localhost` while Shopify was configured to callback to the ngrok HTTPS origin. The pending OAuth state cookie was scoped to localhost, so the ngrok callback could not verify it; callback redirects also used `request.url`, producing an HTTPS localhost failure URL behind the tunnel. After login reached `/account`, Customer Account GraphQL returned 401 because the client sent `Authorization: Bearer <token>` while Shopify Customer Account API expects the raw access token in the Authorization header. After the auth header was corrected, Shopify returned 400 because account operations still used stale Storefront/classic field shapes (`emailAddress` and `phoneNumber` as scalars, address `provinceCode`/`countryCodeV2`/`phone`, and old fulfillment tracking fields) instead of the current Customer Account API schema."
  artifacts:
    - path: "src/app/(storefront)/account/login/start/route.ts"
      issue: "Login start did not canonicalize to the configured callback origin before setting pending OAuth state."
    - path: "src/app/(storefront)/account/callback/route.ts"
      issue: "Callback redirects used request origin instead of the configured Customer Account callback origin."
    - path: "src/lib/shopify/customer-account/client.ts"
      issue: "Customer Account API requests used a Bearer-prefixed Authorization header instead of the raw access token expected by Shopify."
    - path: "src/lib/shopify/customer-account/operations.ts"
      issue: "Customer Account API queries and mutations used stale field names/input shapes that Shopify rejects with 400 Bad Request."
    - path: "tests/mocks/customer-account-api-server.ts"
      issue: "Fake Customer Account API server returned legacy-compatible payloads and did not reject stale field selections, masking live Shopify schema failures."
  missing:
    - "Canonicalize account login starts to SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI origin before setting pending OAuth state."
    - "Build callback success/failure redirects from the configured Customer Account callback origin."
    - "Send Customer Account API GraphQL requests with the raw access token in the Authorization header."
    - "Query nested Customer Account `emailAddress`/`phoneNumber`, alias current address fields back to app types, use current fulfillment tracking connections, and map address mutation variables to `phoneNumber`, `territoryCode`, `zoneCode`, plus top-level `defaultAddress`."
    - "Make the fake Customer Account API server return current-schema payloads and reject old Customer Account field selections."
- truth: "The header account icon links to `/account` with an accessible name, and the footer Login link points to the owned `/account` route rather than the old `mrtea.com.au` URL."
  status: failed
  reason: "User reported: Screenshot shows the account path resolving to `/account/login?returnTo=%2Faccount`; footer Login link target is not shown/verified, so the full header/footer link expectation is not confirmed."
  severity: major
  test: 8
  artifacts: []
  missing: []
- truth: "Classic account routes such as register, recover, reset, activate, and unknown account paths show explanatory bridge pages for Shopify Customer Accounts, preserve only safe return/context values, and never show password inputs."
  status: failed
  reason: "User reported: Legacy account bridge UIs do not look good; screenshots show large wrapped headings on compact cards, making create/recover account bridge pages feel awkward and cramped."
  severity: cosmetic
  test: 9
  artifacts: []
  missing: []
- truth: "The profile page lets a signed-in customer update supported fields, keeps email read-only with Shopify sign-in helper copy, surfaces Shopify field/form errors accessibly, and returns a clear success or recovery state."
  status: failed
  reason: "User reported: changing phone number does not work on the account profile page."
  severity: major
  test: 4
  root_cause: "Shopify Customer Account API `CustomerUpdateInput` currently supports `firstName` and `lastName` only. Phone number is readable through the customer profile but not writable through `customerUpdate`; the profile form exposed an editable phone input even though the server ultimately cannot persist that field."
  artifacts:
    - path: "src/app/(storefront)/account/_components/profile-form.tsx"
      issue: "Profile UI showed phone as an editable text input, implying the change would save."
    - path: "src/lib/shopify/customer-account/actions.ts"
      issue: "Profile action accepted stale phone form data before passing the profile payload toward the mutation boundary."
    - path: "src/lib/shopify/customer-account/types.ts"
      issue: "`CustomerAccountProfileInput` still included an unsupported `phone` field."
  missing:
    - "Remove profile phone from writable Customer Account input shape."
    - "Ignore stale profile `phone` form data at the server action boundary."
    - "Render phone as read-only account-managed information, matching the email treatment."
    - "Add Storybook coverage asserting there is no editable profile phone textbox."
