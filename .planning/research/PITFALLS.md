# Pitfalls Research

**Domain:** Shopify Customer Accounts for Tea Vision
**Researched:** 2026-06-19
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Rebuilding classic password forms against the wrong API

**What goes wrong:**
The headless app implements `/account/login`, `/account/register`, and password reset as custom password forms, but the selected Shopify path is modern Customer Account API OAuth.

**Why it happens:**
The live Liquid theme uses classic Shopify customer forms, so exact UI parity can look like exact implementation parity.

**How to avoid:**
Make a plan decision that v1.3 uses Customer Account API. Preserve public URLs and visual intent, but route account auth through Shopify-hosted OAuth.

**Warning signs:**
New Storefront `customerAccessTokenCreate`, `customerCreate`, or password-reset mutations appear in the plan without an explicit legacy fallback decision.

**Phase to address:**
Phase 14 auth foundation.

---

### Pitfall 2: Token leakage into client components

**What goes wrong:**
Access or refresh tokens are exposed to browser JavaScript or props.

**Why it happens:**
OAuth implementations often start in client components for convenience.

**How to avoid:**
Keep OAuth callback, token refresh, session read, and Customer Account API fetches in server-only modules and HTTP-only cookies or a server store.

**Warning signs:**
`access_token`, `refresh_token`, or ID token data appears in React props, localStorage, sessionStorage, or non-HTTP-only cookies.

**Phase to address:**
Phase 14 auth foundation.

---

### Pitfall 3: Customer data cached globally

**What goes wrong:**
Account profile, address, or order data leaks between users because it is cached like product/collection data.

**Why it happens:**
The current app intentionally uses Cache Components for public Shopify data.

**How to avoid:**
Mark Customer Account API fetches as dynamic/session-scoped and avoid global `use cache` around customer data.

**Warning signs:**
Account operations use `cacheTag()` or long cache life intended for public product data.

**Phase to address:**
Phase 14 account operations.

---

### Pitfall 4: Checkout does not recognize the signed-in customer

**What goes wrong:**
Customer signs in, but checkout still behaves like guest checkout because the cart was never associated with buyer identity.

**Why it happens:**
The current cart flow only stores a Shopify cart ID cookie.

**How to avoid:**
Add `cartBuyerIdentityUpdate` after login and before checkout, using the Customer Account buyer token path Shopify documents for cart identity.

**Warning signs:**
Auth pages work, but Storefront cart operations never mention buyer identity.

**Phase to address:**
Phase 14 cart identity integration.

---

### Pitfall 5: Wholesale/customer pricing promises diverge from checkout

**What goes wrong:**
The app displays customer-specific savings that checkout does not honor.

**Why it happens:**
The Liquid theme contains SAW/WCP/Locksmith snippets that compute or gate behavior from customer tags, while the current headless app has only public cart/product pricing.

**How to avoid:**
Treat B2B/wholesale pricing as a separate verified path. Prefer native Shopify B2B/catalog behavior and buyer identity; avoid client-only discount calculations.

**Warning signs:**
Plans propose reading customer tags and applying discounts in UI without an authoritative Shopify cart/checkout confirmation.

**Phase to address:**
Phase 14 should document the decision; deeper pricing migration can be a later phase if admin setup is not ready.

---

### Pitfall 6: Real checkout testing breaks project safety rules

**What goes wrong:**
Automated tests hit Shopify hosted checkout, payment, shipping, tax, order creation, or success redirects without approval.

**Why it happens:**
Account launch naturally touches checkout identity, which feels like it needs an end-to-end real checkout test.

**How to avoid:**
Keep v1.3 tests at unit/integration/fake-Shopify browser coverage for local cart-to-checkout handoff only.

**Warning signs:**
Tests navigate past `checkoutUrl` into hosted Shopify checkout in CI or local automation.

**Phase to address:**
Phase 14 verification.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Stateless encrypted token cookie | No database needed | Harder revocation/audit; possible cookie size pressure | Acceptable for launch if documented and tested. |
| One account mega-plan | Faster planning | Higher security and sequencing risk | Avoid; split auth/data/UI/cart identity tasks. |
| Defer reorder | Reduces launch scope | Less parity with Liquid theme | Acceptable if account/order basics ship first. |
| Hardcode Shopify auth endpoints | Quick first request | Breaks when Shopify config changes | Never; use discovery endpoints. |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Customer Account OAuth | Using localhost callback | Use an HTTPS tunnel for local development and configured callback/logout URLs. |
| Customer Account scopes | Missing protected customer data access | Request required protected data access before relying on name/email/order fields. |
| Storefront cart | Assuming login automatically updates cart | Explicitly call cart buyer identity update. |
| GraphQL codegen | Mixing Storefront and Customer Account schemas | Separate generated outputs and import through barrels. |
| Theme parity | Copying Liquid snippets directly | Recreate behavior through typed headless boundaries. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Heavy order queries | Slow account dashboard | Query recent orders on dashboard, paginate full history. | Customers with many historical orders. |
| Dynamic auth in entire header | Broad dynamic rendering | Keep header link simple; protect account routes/actions. | Every page pays auth cost. |
| Overfetching addresses/orders | More API cost and latency | DTO-specific queries and pagination. | Higher account usage. |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Missing state/nonce/PKCE validation | OAuth CSRF/interception risk | Short-lived cookies, strict validation, one-time use. |
| Logging PII/tokens | Privacy and credential exposure | Redact tokens and avoid logging customer payloads. |
| Trusting client-submitted customer IDs | Cross-customer mutation risk | Derive customer identity only from verified session. |
| Missing action guards | Unauthorized profile/address mutation | Call `requireCustomerSession()` in every mutation route/action. |
| Guest order email lookup | Privacy leak | Restrict order history to authenticated customer data. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Login page instantly redirects without context | Feels jarring compared with live theme | Branded sign-in entry page with clear action and Shopify auth redirect. |
| Password reset/register dead ends | Users follow old links and get stuck | Preserve legacy routes with clear modern account copy or redirects. |
| Empty order/address pages feel broken | Customers think data failed | Warm empty states and links back to shopping/account actions. |
| Address validation errors hidden | Users cannot fix forms | Normalize Shopify `userErrors` to field/global messages. |

## "Looks Done But Isn't" Checklist

- [ ] **Auth:** Login/logout works but token refresh is untested.
- [ ] **Session:** Protected pages redirect, but Server Actions do not verify session.
- [ ] **Orders:** Dashboard shows orders, but pagination/order detail is missing.
- [ ] **Addresses:** CRUD works, but default address behavior is unverified.
- [ ] **Checkout:** Account pages work, but checkout is not tied to buyer identity.
- [ ] **Migration:** `/account/register`, `/account/recover`, and footer/header links are not handled.
- [ ] **Testing:** Real checkout was accidentally included instead of fake-Shopify handoff.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong legacy auth path | HIGH | Stop, decide modern vs legacy, replace custom password forms with OAuth or explicitly accept legacy Storefront API. |
| Token leakage | HIGH | Rotate/revoke credentials, remove client exposure, add regression tests. |
| Global customer cache | HIGH | Purge caches, remove `use cache`, audit operation wrappers. |
| Missing cart identity | MEDIUM | Add buyer identity update and pre-checkout sync; retest fake checkout handoff. |
| B2B price mismatch | HIGH | Remove misleading UI, verify with Shopify-native cart/checkout data, replan pricing. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Wrong auth model | Phase 14 auth foundation | OAuth routes use Customer Account API; legacy routes redirect/bridge intentionally. |
| Token leakage | Phase 14 auth foundation | Grep/test no token storage in client/localStorage/sessionStorage. |
| Global cache leak | Phase 14 account data | Account operations are dynamic/session-scoped. |
| Missing cart identity | Phase 14 checkout bridge | Fake-Shopify cart buyer identity update is asserted before checkout handoff. |
| B2B price mismatch | Phase 14 scope decision | Plan explicitly defers or verifies customer pricing path. |

## Sources

- Shopify Customer Account API docs listed in `STACK.md`
- Local Next 16 authentication docs
- `D:/Work/teavision/teavision-theme/snippets/saw_cart.liquid`
- `D:/Work/teavision/teavision-theme/snippets/wcp_discount.liquid`
- `D:/Work/teavision/teavision-theme/assets/customer-reorder.js`
- Current project cart and Shopify operation files

---
*Pitfalls research for: Shopify Customer Accounts*
*Researched: 2026-06-19*
