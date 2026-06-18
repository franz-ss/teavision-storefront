# Feature Research

**Domain:** Shopify Customer Accounts for Tea Vision
**Researched:** 2026-06-19
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Sign-in entry and logout | Live site exposes `/account/login`; users expect account access from header/footer. | MEDIUM | Modern implementation starts Shopify-hosted OAuth rather than classic password form submission. |
| Session persistence | Customers should remain signed in across refreshes and protected routes. | MEDIUM | Needs secure token/session storage and refresh behavior. |
| Protected account dashboard | Live theme shows order history and account details on `/account`. | MEDIUM | Should use Customer Account API and server-side guards. |
| Profile details | Users expect to view and update name/contact fields. | MEDIUM | Requires protected customer data access and `customerUpdate`. |
| Address management | Theme supports saved addresses, add/edit/delete, and default address. | HIGH | Needs mutations, validation display, and default-address support from current schema. |
| Order history | Theme shows paginated orders with financial/fulfillment status and totals. | HIGH | Requires order scopes, pagination, empty states, and detail route. |
| Cart customer identity sync | Checkout should recognize the logged-in customer. | MEDIUM | Add Storefront `cartBuyerIdentityUpdate` using Customer Account buyer token. |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Theme-parity account UX in the redesign system | Keeps migration feeling continuous for returning customers. | MEDIUM | Reuse visible labels and information architecture from the Liquid theme, adapted to warm-paper system. |
| Reorder from order history | Strong B2B convenience feature for recurring bulk buyers. | HIGH | Theme uses a third-party reorder script; headless should use cart actions instead. |
| B2B/company-aware checkout identity | Enables future customer-specific catalog/pricing workflows. | HIGH | Needs Shopify admin decisions and possibly B2B company location handling. |
| Legacy URL preservation | Reduces migration friction from `/account/login`, `/account/register`, `/account/addresses`, and order URLs. | MEDIUM | Some legacy password/reset URLs may redirect to modern account auth rather than custom forms. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Exact classic email/password forms | Live theme has them today. | Conflicts with modern Customer Account API and hosted auth model. | Preserve route and design intent while starting Shopify auth. |
| Showing customer-tag discounts in client code | Theme SAW/WCP snippets did this in Liquid. | Can leak tags/discount logic and diverge from checkout. | Use Shopify buyer identity/B2B catalogs or server-verified pricing only. |
| Full real checkout automation | Gives confidence. | Project rules prohibit real hosted checkout/payment/order tests without owner approval. | Fake-Shopify checkout handoff tests. |
| Guest order lookup by arbitrary email | Convenient for support. | High privacy risk and not Customer Account API's normal authenticated model. | Explain that order history is for orders associated with the signed-in customer. |

## Feature Dependencies

```text
Customer Account API setup
    -> OAuth/session routes
        -> protected account dashboard
            -> profile/address/order mutations
        -> cart buyer identity sync
            -> checkout recognition

Theme parity review
    -> account route map
    -> reorder/B2B decisions
```

### Dependency Notes

- **All account pages require auth foundation:** The account dashboard, profile, addresses, and orders all need a reliable server-side session.
- **Cart identity depends on auth:** Checkout recognition should only run after Customer Account auth succeeds or before checkout with a refreshable session.
- **Reorder depends on order history and cart actions:** It should be deferred until order data and cart mutation boundaries are stable.
- **B2B pricing depends on Shopify configuration:** Do not assume customer tags from the Liquid theme translate directly to headless Customer Account behavior.

## MVP Definition

### Launch With (v1.3)

- [ ] Customer Account API OAuth/session foundation.
- [ ] `/account/login`, `/account/auth`, `/account/authorize`, `/account/logout`, and protected `/account`.
- [ ] Account dashboard with profile summary, default address, and recent orders.
- [ ] Address CRUD/default address management.
- [ ] Paginated order history and order detail.
- [ ] Cart buyer identity sync before checkout.
- [ ] Header/footer account links and stale `mrtea.com.au` login cleanup.
- [ ] Fake-Shopify tests for account session and cart identity boundaries.

### Add After Validation (v1.x)

- [ ] Reorder from order history using headless cart actions.
- [ ] B2B/company location selection if Shopify B2B is configured.
- [ ] Session DB/KV if stateless cookie limitations appear.

### Future Consideration (v2+)

- [ ] Customer-specific wholesale catalog/pricing migration if not covered by native Shopify setup.
- [ ] Account preferences, saved lists, or subscriptions.
- [ ] Support-side guest order lookup, only with explicit privacy design.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| OAuth/session foundation | HIGH | HIGH | P1 |
| Account dashboard/profile | HIGH | MEDIUM | P1 |
| Address management | HIGH | HIGH | P1 |
| Order history/detail | HIGH | HIGH | P1 |
| Cart buyer identity sync | HIGH | MEDIUM | P1 |
| Legacy account route preservation | MEDIUM | MEDIUM | P1 |
| Reorder | MEDIUM | HIGH | P2 |
| B2B/customer-specific pricing | HIGH | HIGH | P2/P3 pending admin decision |

## Competitor Feature Analysis

| Feature | Live Tea Vision Liquid theme | Current headless app | v1.3 approach |
|---------|------------------------------|----------------------|---------------|
| Login/register/recover | Classic Shopify customer forms | Missing | Modern Shopify Customer Account auth with preserved entry routes. |
| Account dashboard | Native Liquid `customer.orders` and default address | Missing | Customer Account API dashboard. |
| Addresses | Native Liquid address forms and Shopify JS helpers | Missing | Server Actions + Customer Account API mutations. |
| Orders | Native Liquid order list/detail with statuses/tracking | Missing | Customer Account API order connections and detail pages. |
| Reorder | Third-party script building `/cart/variant:qty` URLs | Missing | Optional headless cart action implementation after core account parity. |
| Wholesale/customer pricing | SAW/WCP/Locksmith snippets using customer/tags | Missing | Explicit decision: native Shopify B2B/buyer identity first, no client-only pricing promises. |

## Sources

- `D:/Work/teavision/teavision-theme/templates/customers/login.liquid`
- `D:/Work/teavision/teavision-theme/templates/customers/account.liquid`
- `D:/Work/teavision/teavision-theme/templates/customers/addresses.liquid`
- `D:/Work/teavision/teavision-theme/templates/customers/order.liquid`
- `D:/Work/teavision/teavision-theme/assets/customer-reorder.js`
- https://www.teavision.com.au/account/login
- Shopify Customer Account API documentation listed in `STACK.md`

---
*Feature research for: Shopify Customer Accounts*
*Researched: 2026-06-19*
