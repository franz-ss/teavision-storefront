# Phase 14: Shopify Customer Accounts - Research

**Researched:** 2026-06-19
**Status:** Complete
**Mode:** Forced refresh via `$gsd-plan-phase 14 --research`

## Executive Summary

Phase 14 should use Shopify's modern Customer Account API as the primary account system. The current public Shopify docs expose `2026-04` as the latest stable Customer Account API version, with `2026-07` available only as an unstable release candidate. The safe implementation shape for this repo is:

1. Add a separate Customer Account API boundary under `src/lib/shopify/customer-account/` or an equivalent dedicated local module. Do not mix Customer Account API types into the existing Storefront generated types.
2. Implement OAuth/OIDC start, callback, refresh, and logout through Route Handlers and Server Actions that use server-owned, HttpOnly, sealed cookies for pending auth and customer session material.
3. Render protected account routes through request-scoped Server Components and Customer Account API operations with `cache: 'no-store'`; never use public product/collection cache tags for customer data.
4. Add account dashboard, profile, address, order history, and order detail pages as practical self-service surfaces using the existing warm Teavision design primitives.
5. Extend cart operations with `cartBuyerIdentityUpdate` and identity-aware cart creation/handoff. Use fake-Shopify unit/integration/e2e tests for local coverage and keep real hosted checkout testing blocked until store-owner approval.
6. Preserve legacy account links with redirects or bridge pages, replacing the stale `mrtea.com.au/account/login` footer link and adding a header account icon that always points to `/account`.

Planning must pause before PLAN.md generation because Phase 14 has frontend indicators and `14-UI-SPEC.md` is missing. Per the `gsd-plan-phase` UI Design Contract Gate, run `$gsd-ui-phase 14` or rerun plan-phase with `--skip-ui` before creating PLAN files.

## Sources Reviewed

### Official Shopify Docs

- `https://shopify.dev/docs/api/customer/latest` - Customer Account API latest stable docs, version list, OAuth/OIDC flow, token exchange, refresh, nonce/state, logout, and GraphQL API.
- `https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started` - Setup requirements for customer accounts, Headless/Hydrogen channel, Customer Account API credentials, and admin setup.
- `https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers` - OAuth 2.0 with PKCE, protected customer data access, secure token storage, and customer queries.
- `https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/hydrogen` - Public HTTPS local domain requirement, callback/logout URL setup, Customer Account API client, and cart association guidance.
- `https://shopify.dev/docs/api/customer/latest/queries/customer` - Customer query fields, address connection, pagination, and protected customer data requirements.
- `https://shopify.dev/docs/api/customer/latest/mutations/customerUpdate` - Supported profile mutation fields and user error shape.
- `https://shopify.dev/docs/api/customer/latest/mutations/customerAddressCreate` - Address creation mutation and write scope.
- `https://shopify.dev/docs/api/customer/latest/mutations/customerAddressUpdate` - Address update mutation, `defaultAddress` flag, and user error shape.
- `https://shopify.dev/docs/api/customer/latest/mutations/customerAddressDelete` - Address delete mutation and deleted ID response.
- `https://shopify.dev/docs/api/customer/latest/objects/Order` - Order fields, status fields, line items, fulfillment, totals, status page URL, and order query.
- `https://shopify.dev/docs/api/storefront/latest/mutations/cartBuyerIdentityUpdate` - Storefront cart buyer identity mutation for logged-in customer, B2B company location, and checkout preferences.
- `https://shopify.dev/docs/api/storefront/latest/input-objects/cartbuyeridentityinput` - `customerAccessToken`, `companyLocationId`, `countryCode`, `email`, `phone`, and preferences fields.
- `https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage` - Cart object relationships, full cart ID requirement, and buyer identity role in checkout handoff.
- `https://shopify.dev/docs/storefronts/headless/bring-your-own-stack/b2b` - Customer Accounts access token use for Storefront buyer identity and B2B company location context.

### Local Next.js 16 Docs

- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md` - `cookies()` is async; cookie writes/deletes are only available in Server Functions and Route Handlers.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` - Route Handlers use Web `Request`/`Response`; `params` is a promise.
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` - Server Functions are directly POSTable and must verify authentication/authorization internally.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` - Dynamic route `params` must be awaited.
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` - Request-time APIs require Suspense; uncached request data should stream at request time.
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache-private.md` - Private cache exists but is experimental and not available in Route Handlers; Phase 14 should use explicit no-store request-scoped fetches instead.

### Local Project Artifacts

- `AGENTS.md` - Next 16 rules, Tailwind 4 tokens, no `any`, no client-side cart store, and checkout testing restrictions.
- `.planning/REQUIREMENTS.md` - AUTH, ACCT, ADDR, ORD, CART, MIG, and SEC requirements for Phase 14.
- `.planning/ROADMAP.md` - Phase 14 goal, success criteria, dependencies, and planning notes.
- `.planning/phases/teavision-14-shopify-customer-accounts/14-CONTEXT.md` - Locked decisions D-01 through D-61.
- `.planning/milestones/v1.0-phases/10-cart-checkout-critical-flow-tests/*` - Fake-Shopify testing strategy and checkout UAT boundary.
- `src/lib/shopify/client.ts`, `src/lib/shopify/env.ts`, `src/lib/shopify/operations/cart.ts`, `src/lib/cart/actions.ts` - Existing Storefront transport, fail-fast env, no-store cart operations, and server-owned cart cookie pattern.
- `src/app/(storefront)/cart/_components/checkout-form.tsx`, `view.tsx` - Current checkout handoff UI and cart surface.
- `src/components/layout/header/header.tsx`, `src/components/layout/footer/data.ts` - Header account icon insertion point and stale footer login link.
- `tests/mocks/shopify-graphql-server.ts`, `playwright.config.ts`, `tests/e2e/cart-checkout.spec.ts` - Existing fake-Shopify and cart-to-checkout test seam.

## Key Findings

### Customer Account API Setup

- Shopify Customer Account API is a GraphQL API authenticated by a customer-scoped access token.
- Admin setup is a launch blocker: customer accounts must be enabled, the Headless or Hydrogen sales channel must be installed/configured, Customer Account API credentials must exist, protected customer data access must cover the needed customer/order fields, callback/logout URLs must be configured, and local OAuth needs a public HTTPS tunnel because localhost callback URLs are not supported.
- The current repo has only Storefront env (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`) plus fake Storefront test env. Phase 14 needs separate Customer Account env and setup validation. Suggested server-side names:
  - `SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID`
  - `SHOPIFY_CUSTOMER_ACCOUNT_API_URL` or a deterministic construction from `SHOPIFY_STORE_DOMAIN` plus API version
  - `SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET`
  - `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI`
  - `SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI`
- Missing setup should throw developer/operator-facing errors; do not hide account links or serve stub customer data.

### OAuth, Session, And Logout

- The OAuth flow must use state, nonce, and PKCE. The callback must reject mismatched `state`, nonce, or missing verifier before token exchange or token use.
- Shopify's OpenID configuration exposes authorization, token, and end-session endpoints. Login should discover endpoints at runtime or cache endpoint metadata safely without mixing it with customer data.
- Token exchange returns access token, refresh token, id token, and expiration. Refresh should happen server-side before customer data fetches when possible. If refresh fails, clear cookies and redirect to login with a sign-in-again message and preserved return path.
- Logout must clear local cookies and redirect through Shopify's discovered `end_session_endpoint` with `id_token_hint` so Shopify-hosted account state is ended too.
- Session and pending OAuth data should be sealed/encrypted and stored only in secure HttpOnly cookies. This project has no database session layer, so a sealed-cookie approach avoids client JavaScript exposure while preserving the repo's server-owned state pattern. The session secret must be required in production and tests should prove token values are not logged or exposed.

### Customer GraphQL Shape

- Read operations should include customer summary, default address, addresses connection, orders connection, and individual order lookup by ID.
- Profile mutation should be limited to Customer Account API supported fields such as first and last name. Do not invent preferences or custom fields.
- Address operations map cleanly to `customerAddressCreate`, `customerAddressUpdate`, and `customerAddressDelete`. `customerAddressUpdate` accepts `defaultAddress: true`, so "set default" can use the same mutation with an address ID.
- User errors are returned as arrays with `field` and `message`. Server Actions should normalize these into field-level messages where possible, with a form-level fallback.
- Order history and order detail pages should use cursor pagination. Required display fields are order name/number, processed/created date, financial status, fulfillment status, total, line items, shipping address when present, fulfillment/tracking when present, and status page URL when available.

### Cart Buyer Identity

- Storefront `cartBuyerIdentityUpdate` accepts a buyer identity with `customerAccessToken`, `companyLocationId`, `countryCode`, `email`, `phone`, and preferences. Cart creation can also accept buyer identity.
- Shopify's B2B/headless docs state that the Customer Accounts `access_token` can be used as the Storefront `customerAccessToken` for contextualized Storefront/cart buyer identity; Hydrogen also exposes a buyer token specifically for cart identity.
- Buyer identity can affect cart pricing and checkout context. This repo must treat cart/checkout as authoritative and avoid client-side B2B/customer pricing promises.
- Sync points:
  - After login, if a cart cookie already exists, call `cartBuyerIdentityUpdate`.
  - When a signed-in user creates a cart through `addToCartAction`, include buyer identity in `cartCreate` when available.
  - Before checkout handoff, verify/sync buyer identity. If sync fails, block checkout and show retry, sign-in-again, and contact support actions.
  - On logout, preserve cart lines and detach buyer identity if Shopify supports a safe empty/anonymous update path. If detachment is unsupported, document the residual behavior and re-sync as guest only through supported Storefront behavior.
- Existing fake-Shopify tests can be extended to support `CartBuyerIdentityUpdate`, identity-aware `CartCreate`, and blocked checkout states without touching live checkout.

### Next.js 16 And Caching Constraints

- `cookies()` is async and request-scoped. Account helpers that read cookies must be async and must not be wrapped in public `use cache`.
- Cookie setting/deleting belongs in Route Handlers or Server Actions, not Server Component rendering.
- Server Actions are directly POSTable, so every Customer Account mutation action must verify the customer session and ownership/ID input before calling Shopify.
- Account pages that read session cookies and Customer Account data are dynamic. Use Suspense/loading skeletons for account sections; do not globally cache customer data.
- Dynamic account/order/address params use `params: Promise<{...}>` and must be awaited before use.

### Codebase Fit

- Reuse the existing transport/error style from `shopifyFetch()` but create a separate `customerAccountFetch()` because Customer Account API uses bearer customer auth, different endpoint/env, and different PII rules.
- Storefront generated types live in `src/lib/shopify/types/generated/` and are imported through `src/lib/shopify/types/index.ts`; Customer Account API types need a separate local barrel, not direct imports from Storefront generated internals.
- Existing codegen is Storefront-only. Either add a separate Customer Account codegen target with its own output folder and env, or handwrite narrow local Customer Account types/mappers for this phase. Do not merge Customer Account schema into the Storefront generated folder.
- Account route-only UI belongs under `src/app/(storefront)/account/_components` and `_lib` unless a component is shared enough to live under `src/components/` and earn Storybook coverage.
- Use `Section`, `Card`, `Button`, `TextInput`, form primitives, `cn()`, lucide icons, warm token classes, and route-local loading skeletons. Avoid a marketing account landing page; `/account` should be the usable dashboard.

## Recommended File Areas For Planning

- `src/lib/shopify/customer-account/env.ts`
- `src/lib/shopify/customer-account/oauth.ts`
- `src/lib/shopify/customer-account/session.ts`
- `src/lib/shopify/customer-account/client.ts`
- `src/lib/shopify/customer-account/types.ts`
- `src/lib/shopify/customer-account/operations.ts`
- `src/lib/shopify/customer-account/actions.ts`
- `src/lib/shopify/queries/cart.graphql`
- `src/lib/shopify/operations/cart.ts`
- `src/lib/cart/actions.ts`
- `src/app/(storefront)/account/**`
- `src/app/(storefront)/cart/_components/checkout-form.tsx`
- `src/app/(storefront)/cart/_components/view.tsx`
- `src/components/layout/header/header.tsx`
- `src/components/layout/footer/data.ts`
- `tests/mocks/shopify-graphql-server.ts`
- `tests/fixtures/shopify/cart.ts`
- `tests/e2e/cart-checkout.spec.ts`
- `docs/testing/customer-accounts-setup.md`

## Suggested Plan Split

1. **14-01 Customer Account API foundation and OAuth session**
   - Env/readiness checks, endpoint discovery, PKCE/state/nonce, sealed cookies, login start/callback/logout, refresh, Customer Account fetch client, initial tests.
   - Covers AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, SEC-01, SEC-02, SEC-03, SEC-04.
2. **14-02 Protected account shell, dashboard, profile summary, and orders**
   - Protected `/account` shell, dashboard, profile summary, no-order state, recent orders, paginated orders, order details, scoped section errors.
   - Covers ACCT-01, ACCT-02 read portion, ACCT-03, ORD-01, ORD-02, ORD-03, ORD-04.
3. **14-03 Address book and supported profile mutations**
   - Profile update Server Action, address list/default ordering, add/edit/delete/default forms, user error normalization, confirmation states.
   - Covers ACCT-02 mutation portion, ADDR-01, ADDR-02, ADDR-03, ADDR-04, ADDR-05.
4. **14-04 Cart buyer identity sync and blocked checkout handoff**
   - `cartBuyerIdentityUpdate`, identity-aware cart creation, login-time sync, pre-checkout sync, blocked checkout UI, fake-Shopify coverage only.
   - Covers CART-01, CART-02 and Phase 10 dependency.
5. **14-05 Migration parity, header/footer account entry, readiness docs, and final coverage**
   - Header account icon, footer login replacement, legacy account redirects/bridge pages, setup/readiness docs, deferred reorder/B2B notes, final E2E/docs.
   - Covers MIG-01, MIG-02, MIG-03, SEC-04 residual docs, and launch readiness.

## Validation Architecture

Testing should follow the Phase 10 exception already approved in `AGENTS.md`.

### Automated Layers

- **Unit (`pnpm test:unit`)**
  - PKCE/state/nonce generation and verification.
  - Return path allowlist/normalization.
  - Session sealing/unsealing and expiry checks.
  - Customer Account GraphQL user error normalization.
  - Customer Account operation mappers for customer, addresses, orders, and order details.
  - Storefront cart buyer identity operation variables and error handling.
- **Integration (`pnpm test:integration`)**
  - Login start route creates pending auth cookie and redirects to Shopify authorization endpoint.
  - Callback rejects invalid state/nonce/verifier and clears pending auth cookies.
  - Callback exchanges code and stores sealed session without exposing tokens.
  - Logout clears local session and redirects to Shopify end-session endpoint.
  - Account Server Actions reject missing/expired session and normalize Shopify user errors.
  - Cart checkout handoff blocks when pre-checkout identity sync fails.
- **Storybook (`pnpm test:stories`, `pnpm build-storybook`)**
  - Account dashboard states: loaded, no orders, partial section error, wholesale-neutral, support block.
  - Orders list/detail states: empty, paginated, tracking present/absent, long line item names.
  - Address states: default first, edit/delete/set-default, field errors, delete confirmation.
  - Cart checkout blocked/signed-in context states.
- **E2E (`pnpm test:e2e`)**
  - Fake Customer Account OAuth callback path, protected route redirect, account dashboard render, address mutation happy path, pre-checkout identity sync, blocked checkout recovery.
  - Stop at fake checkout URL/handoff. Do not run live Shopify checkout/payment/tax/shipping/order/success redirect tests.
- **Build/quality**
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpm codegen` only if a Customer Account API codegen target is added and credentials are available.

### Manual-Only / Gated Validation

- Real Shopify Customer Account OAuth with the dev store and HTTPS tunnel.
- Protected customer data access approval in Shopify admin.
- Real Shopify hosted checkout, payment, shipping-rate, tax, order creation, and success redirect.
- Any B2B/company-location behavior beyond authoritative Shopify/cart data returned by the configured store.

These remain blocked until the Shopify dev store is configured and the store owner explicitly approves each live-account or live-checkout test boundary.

## Threats To Carry Into PLAN.md

- **T-14-01 OAuth CSRF/replay:** state, nonce, and PKCE must be generated with secure randomness, stored server-side/HttpOnly, validated on callback, and cleared on failure.
- **T-14-02 Token exposure:** access, refresh, id token, and customer PII must not reach browser JavaScript, logs, analytics, client props, or Storybook fixtures with real data.
- **T-14-03 Session fixation/expiry:** expired or unrefreshable sessions must be cleared before protected data fetches and must preserve safe return paths only.
- **T-14-04 Open redirect:** `returnTo` and legacy route parameters must be same-origin path-only values with an allowlist/sanitizer.
- **T-14-05 Account mutation authorization:** every Server Action must require a valid customer session and must not trust client-provided customer IDs.
- **T-14-06 Cart identity mismatch:** checkout must not proceed as guest if signed-in buyer identity sync fails.
- **T-14-07 Customer data caching leak:** customer/account fetches must be `no-store` and must not use shared product/collection cache tags.
- **T-14-08 Real checkout boundary breach:** automated tests must not hit live checkout/payment/tax/shipping/order endpoints without explicit owner approval.

## Out Of Scope / Deferred

- Classic password register/login/reset forms.
- Guest order lookup.
- Client-side B2B/customer pricing calculations.
- Reorder unless it can be implemented using authoritative cart actions without price promises; default recommendation is to document/defer.
- Editing `teavision-theme`.
- Live hosted checkout testing before approval.

## RESEARCH COMPLETE

