# Architecture Research

**Domain:** Shopify Customer Accounts for Tea Vision
**Researched:** 2026-06-19
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
Browser
  -> /account/login page
  -> /account/auth route handler
  -> Shopify hosted authorization
  -> /account/authorize callback
  -> encrypted HTTP-only session or server session store
  -> Customer Account API GraphQL client
  -> account pages and Server Actions

Existing cart flow
  -> teavision_cart cookie
  -> Storefront Cart API
  -> cartBuyerIdentityUpdate after login / before checkout
  -> Shopify checkoutUrl
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| OAuth route handlers | Start auth, handle callback, perform token exchange, logout | `src/app/(storefront)/account/auth/route.ts`, `authorize/route.ts`, `logout/route.ts`. |
| Session/DAL | Read, refresh, validate, and require customer session | Server-only helpers under `src/lib/shopify/customer-account/`. |
| Customer Account client | GraphQL fetch wrapper for customer-scoped operations | Similar to `shopifyFetch()`, but authenticated per customer and never cached globally. |
| Account operations | Profile, addresses, orders | `src/lib/shopify/customer-account/operations/*`. |
| Server Actions | Profile/address mutations | `'use server'` actions with session verification and normalized user errors. |
| Account routes | Dashboard, profile, addresses, orders | Server Components with client leaves only for forms/interactions. |
| Cart identity bridge | Associate current cart with signed-in customer | Extend existing cart operations with `cartBuyerIdentityUpdate`. |

## Recommended Project Structure

```text
src/
├── app/(storefront)/account/
│   ├── login/page.tsx
│   ├── auth/route.ts
│   ├── authorize/route.ts
│   ├── logout/route.ts
│   ├── page.tsx
│   ├── profile/page.tsx
│   ├── addresses/page.tsx
│   └── orders/[id]/page.tsx
├── components/account/
│   ├── nav.tsx
│   ├── summary.tsx
│   ├── order-list.tsx
│   ├── order-status-badge.tsx
│   ├── address-card.tsx
│   ├── address-form.tsx
│   └── profile-form.tsx
├── lib/shopify/customer-account/
│   ├── env.ts
│   ├── discovery.ts
│   ├── oauth.ts
│   ├── session.ts
│   ├── client.ts
│   ├── actions.ts
│   ├── operations/
│   ├── queries/
│   └── types/
└── lib/shopify/operations/cart.ts
```

### Structure Rationale

- **`app/(storefront)/account/`:** route ownership stays with storefront pages, matching existing app structure.
- **`components/account/`:** reusable UI with Storybook coverage; route-only markup can remain inline.
- **`lib/shopify/customer-account/`:** keeps Customer Account API schema, auth, and session boundaries separate from Storefront API operations.
- **Cart identity update in existing cart module:** checkout handoff belongs with current cart behavior, not a second cart implementation.

## Architectural Patterns

### Pattern 1: Discovery-first OAuth

**What:** Fetch Shopify OpenID and Customer Account API discovery endpoints instead of hardcoding auth/token/logout/API URLs.
**When to use:** Always for Customer Account API setup.
**Trade-offs:** Slight extra setup/caching, but avoids brittle endpoint assumptions.

### Pattern 2: Server-only session boundary

**What:** Store customer access/refresh tokens only in HTTP-only encrypted cookies or server-side storage. Client components receive DTOs, not tokens.
**When to use:** All account pages, Server Actions, and cart identity sync.
**Trade-offs:** More server plumbing, much lower token exposure risk.

### Pattern 3: No global cache for customer data

**What:** Product/collection fetches can use Cache Components, but customer data must be session-scoped and usually `no-store`.
**When to use:** Profile, addresses, order history, order detail.
**Trade-offs:** Account pages are dynamic, but avoid cross-customer data leakage.

### Pattern 4: Protected actions verify session at the mutation boundary

**What:** Server Actions and Route Handlers call `requireCustomerSession()` before mutating customer data.
**When to use:** Profile update, address create/update/delete/default, cart identity sync.
**Trade-offs:** Slight repetition, but layout guards alone are insufficient.

## Data Flow

### Auth Flow

```text
User opens /account/login
  -> clicks continue/sign in
  -> /account/auth sets state/nonce/verifier/returnTo cookies
  -> redirect to Shopify authorization endpoint
  -> Shopify redirects to /account/authorize?code=...&state=...
  -> route validates state and exchanges code
  -> stores encrypted session or server session
  -> syncs current cart buyer identity when possible
  -> redirects to /account or returnTo
```

### Account Data Flow

```text
Account page
  -> requireCustomerSession()
  -> Customer Account API operation
  -> DTO mapper
  -> Server Component render
  -> client form leaf for edits
  -> Server Action mutation
  -> revalidate/refresh and show normalized user errors
```

### Checkout Identity Flow

```text
Checkout form submit
  -> read teavision_cart cookie
  -> read/refresh customer session if present
  -> derive buyer identity token from Customer Account path
  -> Storefront cartBuyerIdentityUpdate
  -> redirect to Shopify checkoutUrl
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Launch | Stateless encrypted cookies are acceptable if token envelope size stays reasonable. |
| Growing usage | Move refresh tokens to DB/KV for revocation, rotation, and audit. |
| Heavy B2B | Add company/location selection and explicit customer pricing verification against Shopify. |

### Scaling Priorities

1. **First bottleneck:** OAuth/session bugs block all account value; build and test this first.
2. **Second bottleneck:** Order history payload size; paginate and query minimal fields.
3. **Third bottleneck:** B2B pricing parity; do not mix with core auth until business rules are confirmed.

## Anti-Patterns

### Anti-Pattern 1: One giant account action file

**What people do:** Put OAuth, profile, address, order, and cart identity behavior in one file.
**Why it's wrong:** The current project already has a large contact action concern; account security boundaries need sharper ownership.
**Do this instead:** Split session, client, operations, and mutation actions by responsibility.

### Anti-Pattern 2: Header becomes the auth system

**What people do:** Make global layout/header perform heavy session reads and treat UI hiding as authorization.
**Why it's wrong:** It increases dynamic rendering and leaves actions unprotected.
**Do this instead:** Link to `/account`; protect pages/actions in DAL and mutation boundaries.

### Anti-Pattern 3: Classic Liquid forms in a headless Customer Account API project

**What people do:** Rebuild `/account/login` as email/password submission because the theme used Liquid forms.
**Why it's wrong:** Modern Customer Account API uses Shopify-hosted OAuth.
**Do this instead:** Preserve route and UX intent while redirecting into Shopify auth.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Shopify Customer Account API | OAuth token + GraphQL | Requires protected customer data access for profile/order fields. |
| Shopify Storefront API | Existing `shopifyFetch()` | Add cart buyer identity update operation. |
| Shopify hosted checkout | Redirect only | Do not run real checkout tests without owner approval. |
| Theme reference | Read-only parity source | Do not edit `teavision-theme`. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Account session -> account operations | direct server import | Server-only, no client tokens. |
| Account session -> cart operations | server helper call | Used after login and before checkout. |
| Account pages -> UI components | DTO props | Keep generated GraphQL types behind the operations layer. |
| Route handlers -> cookies | async Next 16 APIs | Follow local Next docs. |

## Sources

- `src/lib/shopify/client.ts`
- `src/lib/cart/actions.ts`
- `src/lib/shopify/operations/cart.ts`
- `src/app/(storefront)/cart/_components/checkout-form.tsx`
- `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- Shopify Customer Account API documentation listed in `STACK.md`

---
*Architecture research for: Shopify Customer Accounts*
*Researched: 2026-06-19*
