# Stack Research

**Domain:** Shopify Customer Accounts for a Next.js 16 headless storefront
**Researched:** 2026-06-19
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Shopify Customer Account API | 2026-04 latest | Customer profile, address, and order data | Shopify's recommended cross-platform method for authenticated customer data. |
| OAuth 2.0 / OpenID Connect | Shopify discovery endpoints | Customer authentication | Required by Customer Account API; supports hosted login and persistent Shopify customer identity. |
| Next.js App Router Route Handlers | 16.2.x | OAuth start/callback/logout endpoints | Fits current app architecture and keeps token exchange server-side. |
| React Server Components + Server Actions | React 19 | Protected account reads and mutations | Matches current project conventions for server-owned data and mutations. |
| Shopify Storefront API | 2026-04 | Cart and checkout handoff | Existing source of truth for carts; must add cart buyer identity sync. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `jose` or equivalent Web Crypto helpers | TBD | Encrypt/sign customer session cookies or token envelopes | Use if the project chooses stateless encrypted HTTP-only sessions. |
| Existing `vitest` and `@playwright/test` | Current repo versions | Unit/integration/fake-Shopify coverage | Extend current cart/checkout testing pattern without real hosted checkout. |
| Existing GraphQL Code Generator | Current repo version | Generate typed Customer Account operations | Add a separate Customer Account output, not direct imports from generated Storefront types. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| HTTPS tunnel such as ngrok | Local OAuth callback testing | Shopify Customer Account API does not support localhost or HTTP callback URLs. |
| Shopify Headless or Hydrogen sales channel | Customer Account API credentials | Required for Customer Account API setup. |
| Storybook | Account component review | Required for reusable components in `src/components/account/*`. |

## Installation

No large framework addition is recommended. Add only a minimal crypto/session helper dependency if Web Crypto alone is not ergonomic enough.

```bash
pnpm add jose
pnpm codegen
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Customer Account API | Legacy Storefront customer API | Only if the business explicitly requires classic password login/register/reset parity over Shopify's current recommendation. |
| Secure HTTP-only session cookie | Database/KV-backed sessions | Use DB/KV if refresh token rotation, revocation, multi-device sessions, or audit logs are required immediately. |
| Separate Customer Account GraphQL types | Reusing Storefront generated types | Never reuse Storefront generated types for Customer Account operations; schemas differ. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Custom client-side password forms for modern Customer Accounts | Customer Account API authentication is OAuth/OIDC and Shopify-hosted, not classic password form submission. | `/account/login` as a branded entry page that starts Shopify auth. |
| Browser-exposed access or refresh tokens | Customer tokens unlock protected customer data. | HTTP-only encrypted cookie or server-side session store. |
| Client-side customer-tag pricing decisions | Pricing can diverge from checkout and leak business logic. | Shopify buyer identity, B2B/company/catalog configuration, or server-side verified pricing integration. |
| Real hosted checkout tests | Project rules prohibit real checkout/payment/shipping/tax/order tests without owner approval. | Fake-Shopify unit/integration/e2e coverage for cart-to-checkout handoff. |

## Stack Patterns by Variant

**If v1.3 uses a stateless session:**
- Store an encrypted token envelope in an HTTP-only, secure, SameSite=Lax cookie.
- Keep PKCE verifier, state, nonce, and return URL in short-lived HTTP-only cookies.
- Refresh access tokens server-side and retry once on expiry.

**If v1.3 requires revocation/audit:**
- Store only an opaque session ID in the browser.
- Keep encrypted access/refresh tokens in DB/KV with expiry, rotated refresh tokens, user-agent hash, and created/updated timestamps.

**If wholesale/B2B pricing must ship in the same milestone:**
- Prefer native Shopify B2B/customer identity/catalog paths.
- Treat legacy SAW/WCP/Locksmith snippets from `teavision-theme` as parity references, not executable headless contracts.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.2.x | async cookies/headers/params | Account routes and guards must follow local Next 16 docs. |
| Customer Account API 2026-04 | Shopify customer accounts | Requires customer accounts enabled and Headless/Hydrogen channel configuration. |
| Storefront API 2026-04 | Current cart code | Add `cartBuyerIdentityUpdate`; do not use Customer Account buyer token for Storefront customer queries. |

## Sources

- https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started
- https://shopify.dev/docs/api/customer/latest
- https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/customer-accounts
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/customer-accounts
- Local Next 16 docs: `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- Local theme reference: `D:/Work/teavision/teavision-theme/templates/customers/*.liquid`

---
*Stack research for: Shopify Customer Accounts*
*Researched: 2026-06-19*
