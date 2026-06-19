# Phase 14: Shopify Customer Accounts - Pattern Map

**Mapped:** 2026-06-19
**Status:** Complete

## Purpose

This file maps Phase 14 plan targets to the existing codebase patterns that executors must read before implementation. It is derived from `14-CONTEXT.md`, `14-RESEARCH.md`, `14-UI-SPEC.md`, and the current source tree.

## Pattern Summary

| Area | Existing Pattern | Phase 14 Use |
|------|------------------|--------------|
| Shopify transport | `src/lib/shopify/client.ts`, `src/lib/shopify/env.ts` | Create a separate Customer Account API boundary with the same fail-fast posture, but bearer auth, OIDC discovery, no PII logging, and session-scoped `cache: 'no-store'` fetches. |
| Cart state | `src/lib/cart/actions.ts` | Keep cart ID in the server-owned `teavision_cart` cookie; add account-aware cart creation and checkout preparation without adding a client-side cart store. |
| Cart GraphQL | `src/lib/shopify/queries/cart.graphql`, `src/lib/shopify/operations/cart.ts` | Add `cartBuyerIdentityUpdate` and buyer-identity-aware `cartCreate` handling while preserving current cart reshaping and user error normalization. |
| Fake Shopify tests | `tests/mocks/shopify-graphql-server.ts`, `tests/fixtures/shopify/cart.ts`, `tests/e2e/cart-checkout.spec.ts` | Extend the operation-name fake server with Customer Account/OIDC fixtures and buyer identity operations. Continue to stop at fake checkout handoff. |
| App Router runtime APIs | `node_modules/next/dist/docs/01-app/.../cookies.md`, `route.md`, `dynamic-routes.md`, `mutating-data.md`, `caching.md` | Await `cookies()` and `params`; mutate cookies only in Route Handlers or Server Actions; verify auth in every Server Action; wrap request-time account data in Suspense/loading shells. |
| Account route UI | `src/app/(storefront)/cart/_components/view.tsx`, shared `Section`, `Card`, `Button`, form controls | Build practical route-local account workspaces with warm token classes, `cn()`, stable skeletons, semantic tables, accessible forms, and client leaves only for interactive controls. |
| Header and footer links | `src/components/layout/header/header.tsx`, `src/components/layout/footer/data.ts` | Add one icon-only `/account` header link in the right icon cluster and replace the stale external footer Login href with `/account`. |

## Concrete Code Patterns

### Separate API Boundaries

`shopifyFetch()` accepts a typed document or string, builds the Storefront endpoint through `getStorefrontEndpoint()`, defaults to `cache: 'no-store'`, throws on HTTP errors, and flattens GraphQL error messages. Phase 14 should reuse this shape for a new `customerAccountFetch()` but not reuse Storefront headers or generated Storefront types.

Required Phase 14 names:

- `getCustomerAccountConfig()`
- `discoverCustomerAccountEndpoints()`
- `customerAccountFetch<T>()`
- `getCustomerAccountSession()`
- `requireCustomerAccountSession()`
- `refreshCustomerAccountSession()`

### Server-Owned Cookies

`src/lib/cart/actions.ts` awaits `cookies()`, reads `teavision_cart`, deletes stale cart IDs, sets HttpOnly cookies with `sameSite: 'lax'`, `path: '/'`, and production-only `secure`, and never exposes cart state to a browser store. Phase 14 should use the same server-owned direction with stricter Customer Account cookie names:

- `teavision_customer_session`
- `teavision_customer_auth`
- `teavision_customer_flash`

Session and pending-auth cookies must be HttpOnly, sameSite `lax`, path `/`, and secure in production.

### Fake Operation Server

`tests/mocks/shopify-graphql-server.ts` reads GraphQL request bodies, extracts operation names, and writes deterministic JSON responses. Phase 14 should add either `tests/mocks/customer-account-api-server.ts` for OIDC/token/customer GraphQL or extend the existing fake server only where Storefront cart operations are involved. Customer Account fixtures belong in `tests/fixtures/shopify/customer-account.ts`.

### Route-Local UI

Route-only account components belong under:

- `src/app/(storefront)/account/_components/`
- `src/app/(storefront)/account/_lib/`

Shared components in `src/components/` need Storybook coverage. Most Phase 14 account components should stay route-local unless they are reused beyond account pages.

### Styling And Accessibility

Use only Tailwind token classes and `cn()` for conditionals. Account UI should use:

- `Section.Root` with `tone="surface"` or `tone="sunken"`
- `Section.Container` with `variant="base"` or `variant="compact"`
- `Card` with `tone="surface" | "sunken"`, `padding="lg"`, `radius="lg"`
- `Button` variants `brand`, `secondary`, `quiet`
- Existing `FormLabel`, `TextInput`, `Textarea`, `Select`, `Checkbox`, `Dialog`, and `Pagination`

Accessibility requirements to preserve in plans:

- Icon-only controls have `aria-label`.
- Form errors use `aria-describedby` and `role="alert"` where blocking.
- Mutation success uses `role="status"` or `aria-live="polite"`.
- Dialog deletion traps focus, supports Escape, and restores focus.
- Desktop order history uses table semantics; mobile cards preserve labels.

## PLAN COMPLETE INPUT

Executors should read this pattern map before any Phase 14 implementation plan, alongside `14-CONTEXT.md`, `14-RESEARCH.md`, `14-UI-SPEC.md`, and `14-VALIDATION.md`.

