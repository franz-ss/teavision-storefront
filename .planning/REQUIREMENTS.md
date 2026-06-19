# Requirements: Teavision Headless Storefront v1.3

**Defined:** 2026-06-19
**Core Value:** Customers can confidently choose the right bulk product, quantity, and price path before checkout.

## v1 Requirements

Requirements for v1.3 Shopify Customer Accounts. Each maps to roadmap phases.

### Authentication

- [x] **AUTH-01**: Customer can start sign-in from `/account/login` using Shopify Customer Account API OAuth.
- [x] **AUTH-02**: Customer can complete OAuth callback and receive a secure server-owned session.
- [x] **AUTH-03**: Customer can log out and have local session state cleared.
- [x] **AUTH-04**: Protected account routes redirect unauthenticated users safely.
- [x] **AUTH-05**: Session refresh/expiry is handled without exposing tokens to browser JavaScript.

### Account

- [x] **ACCT-01**: Customer can view an account dashboard with profile summary, default address, and recent orders.
- [x] **ACCT-02**: Customer can view and update supported profile/contact fields.
- [x] **ACCT-03**: Account UI follows the current redesign system and preserves Tea Vision theme intent.

### Addresses

- [x] **ADDR-01**: Customer can view saved addresses.
- [x] **ADDR-02**: Customer can add a new address.
- [x] **ADDR-03**: Customer can edit an existing address.
- [x] **ADDR-04**: Customer can delete an address.
- [x] **ADDR-05**: Customer can set or update the default address.

### Orders

- [x] **ORD-01**: Customer can view paginated order history.
- [x] **ORD-02**: Customer can view individual order details.
- [x] **ORD-03**: Customer can see order financial/fulfillment status, totals, line items, and tracking links when available.
- [x] **ORD-04**: Guest orders are handled with clear authenticated-account messaging.

### Cart And Checkout

- [x] **CART-01**: Logged-in customer identity is synced to the Shopify cart after login or before checkout.
- [x] **CART-02**: Cart-to-checkout handoff remains covered by fake-Shopify tests only.

### Migration And Parity

- [ ] **MIG-01**: Header/footer account links point to the headless account routes, not stale external domains.
- [ ] **MIG-02**: Legacy account URLs are preserved with redirects or bridge pages.
- [ ] **MIG-03**: Theme reorder and B2B/customer-pricing behavior is documented as implemented, deferred, or requiring Shopify admin decisions.

### Security

- [x] **SEC-01**: OAuth state/nonce/PKCE and callback validation are implemented.
- [x] **SEC-02**: Customer data fetches are session-scoped and not globally cached.
- [x] **SEC-03**: Customer Account API credentials, tokens, and PII are not logged or exposed.
- [x] **SEC-04**: Shopify protected customer data, callback/logout URLs, and HTTPS dev tunnel prerequisites are documented.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Reorder

- **REOR-01**: Customer can reorder all available line items from a previous order using the headless cart Server Actions.
- **REOR-02**: Customer sees unavailable-order-line handling before reorder items are added to cart.

### B2B And Wholesale

- **B2B-01**: Customer-specific or company-specific pricing is driven by Shopify-native B2B/catalog/cart data rather than client-side discount calculations.
- **B2B-02**: Customer can select an eligible company location before checkout if Shopify B2B is configured.

### Account Enhancements

- **PREF-01**: Customer can manage optional account preferences beyond Shopify's standard profile fields.
- **SUPP-01**: Support-safe guest order lookup is designed only if privacy, identity verification, and business need are explicitly approved.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Exact custom password-based registration/login/reset forms | Modern Shopify Customer Account API uses Shopify-hosted OAuth. Legacy Storefront customer API is only a fallback if the owner explicitly prioritizes classic form parity over the recommended path. |
| Client-side customer-tag discount calculation | Risks leaking pricing logic and diverging from Shopify checkout totals. |
| Real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests | Project rules require store-owner approval before any real hosted checkout testing. |
| Editing `teavision-theme` | The sibling theme is a reference source only. |
| Reinstalling Liquid theme apps or browser snippets | Third-party Liquid snippets are not stable headless contracts. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 14 | Complete |
| AUTH-02 | Phase 14 | Complete |
| AUTH-03 | Phase 14 | Complete |
| AUTH-04 | Phase 14 | Complete |
| AUTH-05 | Phase 14 | Complete |
| ACCT-01 | Phase 14 | Complete |
| ACCT-02 | Phase 14 | Complete |
| ACCT-03 | Phase 14 | Complete |
| ADDR-01 | Phase 14 | Complete |
| ADDR-02 | Phase 14 | Complete |
| ADDR-03 | Phase 14 | Complete |
| ADDR-04 | Phase 14 | Complete |
| ADDR-05 | Phase 14 | Complete |
| ORD-01 | Phase 14 | Complete |
| ORD-02 | Phase 14 | Complete |
| ORD-03 | Phase 14 | Complete |
| ORD-04 | Phase 14 | Complete |
| CART-01 | Phase 14 | Complete |
| CART-02 | Phase 14 | Complete |
| MIG-01 | Phase 14 | Pending |
| MIG-02 | Phase 14 | Pending |
| MIG-03 | Phase 14 | Pending |
| SEC-01 | Phase 14 | Complete |
| SEC-02 | Phase 14 | Complete |
| SEC-03 | Phase 14 | Complete |
| SEC-04 | Phase 14 | Complete |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---
*Requirements defined: 2026-06-19*
*Last updated: 2026-06-19 after roadmap creation*
