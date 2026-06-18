# Research Summary

**Domain:** Shopify Customer Accounts for Tea Vision
**Researched:** 2026-06-19
**Confidence:** HIGH

## Executive Summary

v1.3 should implement modern Shopify Customer Account API support as one tightly scoped milestone: OAuth/session foundation, account dashboard/profile, address management, order history/detail, and cart buyer identity sync. The sibling Liquid theme is a strong UX and parity reference, but its classic customer forms, third-party reorder script, and SAW/WCP/Locksmith customer-tag pricing snippets should not be copied directly into the headless app.

The first roadmap phase should be Phase 14 and should build the full customer-account MVP vertically enough that auth, protected account data, address/order workflows, and checkout identity are tested together. Reorder and B2B/customer-specific pricing should be explicit stretch/follow-up decisions unless Shopify admin configuration is ready.

## Stack Additions

- Shopify Customer Account API 2026-04.
- OAuth/OIDC with discovery endpoints, state, nonce, and PKCE/confidential-client handling.
- Server-only session module using encrypted HTTP-only cookies initially, with DB/KV as optional hardening.
- Separate Customer Account GraphQL operations and generated types.
- Storefront `cartBuyerIdentityUpdate` operation added to the existing cart boundary.

## Table Stakes

- `/account/login` entry route and logout.
- OAuth callback/session persistence.
- Protected `/account` dashboard.
- Profile details view/update.
- Address list/create/update/delete/default.
- Paginated order history and order detail.
- Cart buyer identity sync before checkout.
- Header/footer account links with stale `mrtea.com.au` login cleanup.

## Watch Out For

- Modern Customer Accounts are not classic Liquid password forms. Preserve URLs and intent, not necessarily form mechanics.
- Shopify does not support localhost/HTTP callbacks for Customer Account API; local development needs HTTPS tunneling.
- Customer Account API requires protected customer data access for first name, last name, email, and order-related use.
- Customer data must not be globally cached like public product/collection data.
- Do not expose access or refresh tokens to browser JavaScript.
- Do not promise customer-specific discounts unless Shopify cart/checkout confirms them.
- Real hosted checkout/payment/shipping/tax/order tests remain prohibited without owner approval.

## Recommended Milestone Shape

| Phase | Name | Purpose |
|-------|------|---------|
| 14 | Shopify Customer Accounts | Build auth/session, account pages, address/order workflows, cart buyer identity, migration routes, and tests as one coherent account MVP. |

If the roadmapper chooses to split, preserve this dependency order:

1. Auth/session/client foundation.
2. Account dashboard/profile/address/order surfaces.
3. Cart buyer identity/checkout handoff.
4. Reorder/B2B parity decisions or deferred follow-up.

## Suggested Requirement Categories

- **AUTH:** Customer Account API setup, login, logout, session persistence, protected routes.
- **ACCT:** Dashboard and profile details/update.
- **ADDR:** Address CRUD/default address sync.
- **ORD:** Order history, order detail, statuses, pagination.
- **CART:** Buyer identity update and checkout handoff.
- **MIG:** Legacy route/header/footer parity.
- **SEC:** token handling, protected data, no real checkout tests, no customer data cache leaks.

## Key Open Decisions

1. Use Customer Account API as the primary path unless the owner explicitly asks for legacy password form parity.
2. Decide whether v1.3 includes reorder or only prepares order/cart foundations for a follow-up.
3. Decide whether customer-specific/B2B pricing is in scope for implementation or only research/decision capture.
4. Confirm Shopify admin prerequisites: Customer Accounts enabled, Headless/Hydrogen sales channel configured, callback/logout URLs, scopes/protected data access, and development HTTPS tunnel.

## Sources

- `STACK.md`
- `FEATURES.md`
- `ARCHITECTURE.md`
- `PITFALLS.md`
- https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started
- https://shopify.dev/docs/api/customer/latest
- https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/customer-accounts
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/customer-accounts
- https://www.teavision.com.au/account/login

---
*Research summary for: Shopify Customer Accounts*
*Researched: 2026-06-19*
