# Phase 14: Shopify Customer Accounts - Context

**Gathered:** 2026-06-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 14 delivers modern Shopify Customer Account support for the headless storefront: OAuth login/logout/callback, secure server-owned account sessions, protected `/account` routes, dashboard/profile details, address management, order history and order detail pages, cart buyer identity sync before checkout, and migration parity decisions for legacy account behavior.

This phase clarifies how to implement the v1.3 account experience. It does not add classic password-based account forms, client-side customer-specific pricing, guest order lookup, real checkout/payment/order testing, or Shopify theme edits.

</domain>

<decisions>
## Implementation Decisions

### OAuth And Session Experience
- **D-01:** Login must return customers to their original intent: the account page, checkout flow, or protected URL they tried to reach.
- **D-02:** Protected account routes redirect unauthenticated customers to `/account/login` with a preserved return path, then return them after OAuth succeeds.
- **D-03:** Expired or unrefreshable sessions clear local session cookies, preserve the protected URL as the return path, and show a clear sign-in-again message.
- **D-04:** Logout clears local session cookies and uses Shopify's discovered logout endpoint so Shopify-hosted account state is ended too.
- **D-05:** Missing or incomplete Customer Account setup must fail fast with developer-facing setup guidance. Do not silently hide account features or use stub customer data.
- **D-06:** OAuth callback validation failures for `state`, `nonce`, or PKCE reject the callback, clear pending auth cookies, avoid token exchange/use, show a safe verification-failed message, and offer a fresh login.
- **D-07:** Session, refresh, and pending-auth material must stay in secure HttpOnly server-owned cookies. Do not expose customer tokens to browser JavaScript.
- **D-08:** Header and footer account links point into the headless account routes. Missing required setup fails fast rather than quietly hiding links.
- **D-45:** Header account access uses an account icon in the existing right-side icon cluster beside search and cart.
- **D-46:** The header account icon always links to `/account`; the account route owns signed-in handling and redirects unauthenticated customers to login as needed.
- **D-47:** Mobile uses the same header account icon only. Do not duplicate account access as a separate mobile-menu row by default.

### Account Dashboard Shape
- **D-09:** `/account` leads with recent orders and default address so returning customers can quickly check order state, delivery context, and account details.
- **D-10:** Profile editing is limited to fields safely supported by Shopify Customer Account API. Do not add custom preferences or invented account fields in this phase.
- **D-11:** No-order states should confirm the account is ready and offer clear paths back to shopping or support.
- **D-12:** Wholesale/B2B signals may be shown only when Shopify exposes them clearly, and only as informational context. Do not promise custom prices or calculate discounts in the UI.
- **D-13:** Include a compact account/order support block that links to contact or support routes without dominating the dashboard.
- **D-14:** Account pages use warm, restrained, work-focused panels, tables, and lists that fit the current redesign and support repeat self-service tasks.
- **D-15:** Valid sessions with partial data failures render the loaded dashboard sections and show scoped section-level errors for failed sections. Do not log customers out for provider/data failures.
- **D-16:** Logout is available as a secondary account action, not a primary dashboard CTA.
- **D-48:** Customers without Shopify-exposed wholesale/company signals get a neutral dashboard with normal order/address/profile surfaces and compact support links. Do not upsell wholesale status inside the account dashboard.
- **D-49:** Wholesale pricing questions from account pages route to existing wholesale/contact paths such as `/pages/wholesale-account-request`, `/pages/wholesale`, or support/contact. Do not create client-side pricing logic or new B2B surfaces in Phase 14.

### Address And Order Self-Service
- **D-17:** The address book puts the default address first, followed by the rest of the addresses with edit, delete, and set-default actions.
- **D-18:** Address add/edit uses dedicated form pages such as `/account/addresses/new` and `/account/addresses/[id]/edit`.
- **D-19:** Address deletion requires a clear confirmation step before the destructive server mutation.
- **D-20:** Order history shows a practical summary: order number/name, date, financial status, fulfillment status, total, and a link to details.
- **D-21:** Order detail pages include customer-useful line items, quantities, prices/totals, financial and fulfillment status, shipping address when available, and tracking links when Shopify provides them.
- **D-22:** Guest orders use clear account-only messaging: the account shows orders tied to the signed-in Shopify customer, and guest-order questions route to support/contact. Do not build guest lookup in Phase 14.
- **D-23:** Shopify mutation user errors are normalized into field-level messages where possible, with a form-level fallback.
- **D-24:** If a default-address mutation succeeds but refreshing the address list fails, confirm the action and show a scoped refresh-to-see-latest-addresses fallback.
- **D-25:** Address forms are Australia-first with sensible defaults for Teavision's primary customer base while still allowing Shopify-supported international addresses if available.
- **D-26:** Order history uses predictable pagination backed by Customer Account API cursors. Do not use infinite scroll or recent-only history.
- **D-27:** Reorder is documented and deferred unless it can safely use authoritative Shopify cart actions for currently available variants without price promises.
- **D-28:** Order statuses use customer-friendly normalized labels that preserve Shopify financial/fulfillment state accuracy.

### Cart Identity And Checkout Handoff
- **D-29:** Buyer identity sync runs after login when a cart exists, and is checked/synced again before checkout handoff.
- **D-30:** If buyer identity sync fails before checkout, block checkout handoff with a clear recovery path instead of silently continuing as guest.
- **D-31:** Cart surfaces show subtle signed-in/account context near checkout without turning the cart into an account dashboard.
- **D-32:** Logout with an existing cart preserves cart lines while removing or detaching buyer identity from the cart if Shopify supports it.
- **D-33:** Carts created while signed in include buyer identity from the start when safely available.
- **D-34:** Buyer identity may enable Shopify-authoritative account/company context, but the UI must not promise B2B/customer pricing unless cart or checkout data returns it authoritatively.
- **D-35:** Pre-checkout identity sync is tested with fake-Shopify unit/integration/e2e boundaries only. Do not run real checkout, payment, tax, shipping-rate, order-creation, or success-redirect tests without store-owner approval.
- **D-36:** Signing in must not create an empty cart. Create or sync a cart only when an actual cart action needs it.
- **D-50:** If pre-checkout buyer identity sync fails, checkout remains blocked until resolved. Do not offer a silent guest-checkout fallback.
- **D-51:** The primary recovery action for blocked checkout is retrying buyer identity sync from the cart/checkout handoff path.
- **D-52:** Blocked checkout states also offer secondary actions to sign in again and contact support.
- **D-53:** Cart account context stays subtle near checkout controls, such as a compact "checking out as..." or account-status line. Do not turn the cart into an account dashboard.
- **D-54:** Company/location context may affect checkout preparation only when Shopify/cart supports it authoritatively. Do not invent a manual company selector or pricing UI in Phase 14.

### Migration Parity Boundaries
- **D-37:** Important legacy account URLs are preserved with headless routes or redirects. Unsupported classic paths redirect to modern login or a clear explanatory page.
- **D-38:** Replace `https://mrtea.com.au/account/login` with Teavision's owned headless account route, and document the old link as stale unless the owner confirms accounts are intentionally split across domains.
- **D-39:** Classic register/reset paths redirect or bridge to Shopify Customer Account OAuth with clear explanatory copy. Do not rebuild classic password forms.
- **D-40:** Reorder parity is documented and deferred by default unless implementation can safely use authoritative cart actions and current Shopify variant availability.
- **D-41:** B2B/customer-specific pricing parity is documented as admin-dependent and checkout-authoritative. Record what Shopify exposes, what needs Shopify admin/B2B setup, and avoid client-side pricing promises.
- **D-42:** Account navigation uses one stable account entry route, `/account`. The account route owns signed-in versus sign-in behavior; the header does not need a state-aware label for Phase 14.
- **D-43:** Legacy account links from emails/bookmarks preserve safe return or context parameters where useful, ignore Liquid/template-only or unknown parameters, and route into the modern account flow.
- **D-44:** Launch readiness must include an explicit Customer Account API setup checklist covering Shopify customer accounts, Headless/Hydrogen channel credentials, protected customer data, callback/logout URLs, HTTPS tunnel, and owner approvals.
- **D-55:** Classic register/reset/password routes should bridge or redirect into modern OAuth with explanatory copy when needed. Do not rebuild classic password forms.
- **D-56:** Unmapped legacy account routes show an account-focused explanatory page with a modern sign-in path and support/contact fallback instead of a generic 404.
- **D-57:** Keep the account icon visible even when setup is missing; route rendering fails fast with setup guidance rather than hiding the feature.
- **D-58:** Customer Account API setup guidance belongs in Phase 14 docs/context and developer-facing error messages, not a new customer-facing or internal preflight route by default.
- **D-59:** Missing required account setup fails closed with a clear operator/developer error, including in production. Do not serve fake, stubbed, or partial account experiences.
- **D-60:** Launch-blocking setup prerequisites include Shopify customer accounts, Headless/Hydrogen channel credentials, protected customer data access, callback/logout URLs, HTTPS tunnel/dev callback setup, and owner approval boundaries.
- **D-61:** Readiness docs must include an explicit blocked gate for real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, and success-redirect testing until store-owner approval.

### Agent Discretion
- Downstream agents may choose exact component boundaries, route filenames, mutation grouping, form validation helpers, and test file layout as long as they follow the decisions above, project conventions, and the Shopify/Next.js constraints.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope And Requirements
- `.planning/PROJECT.md` - Current v1.3 milestone goal, active requirements, out-of-scope boundaries, and pricing/cart source-of-truth decisions.
- `.planning/REQUIREMENTS.md` - AUTH, ACCT, ADDR, ORD, CART, MIG, and SEC requirements for Phase 14.
- `.planning/ROADMAP.md` - Phase 14 goal, success criteria, dependencies, and planning notes.
- `.planning/STATE.md` - Current project state, accumulated decisions, known pending todo for Phase 14, and deferred B2B/pricing items.

### Phase 14 Contracts And Research
- `.planning/phases/14-shopify-customer-accounts/14-RESEARCH.md` - Current Shopify Customer Account API, OAuth/session, Customer Account GraphQL, cart buyer identity, Next.js 16, and validation research.
- `.planning/phases/14-shopify-customer-accounts/14-UI-SPEC.md` - Approved visual and interaction contract for account routes, cart account context, header/footer account entry, and required Storybook states.
- `.planning/phases/14-shopify-customer-accounts/14-VALIDATION.md` - Phase validation strategy, Wave 0 fake API/test fixture requirements, per-task verification map, and manual-only Shopify approval gates.

### Prior Discovery And Migration Context
- `docs/teavision-project-reference.md` - Historical account route/domain notes, including `mrtea.com.au`, account template expectations, and wholesale/customer-service context.
- `docs/teavision-phase-1-audit.md` - Original parity audit noting header/footer login mismatch, B2B-first storefront reality, and customer account uncertainty.
- `docs/testing/cart-checkout-refinement-rationale.md` - Existing cart ownership/testing rationale; cart identity remains server-owned and fake-Shopify coverage protects cart-to-checkout behavior.

### Shopify API References
- `https://shopify.dev/docs/api/customer/latest` - Customer Account API authentication, OIDC discovery endpoints, OAuth authorization code flow, PKCE, token exchange, logout, and GraphQL endpoint discovery.
- `https://shopify.dev/docs/api/storefront/latest/mutations/cartBuyerIdentityUpdate` - Storefront mutation for associating buyer identity with a cart before checkout.
- `https://shopify.dev/docs/api/storefront/latest/input-objects/cartbuyeridentityinput` - Buyer identity fields including customer access token, email, phone, country, company location, and checkout preferences.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/shopify/client.ts` - Existing Shopify GraphQL transport pattern for typed documents, headers, HTTP/API error handling, and no-stub fail-fast behavior.
- `src/lib/shopify/operations/cart.ts` - Existing cart operation module to extend with buyer identity mutation and identity-aware cart creation when supported.
- `src/lib/cart/actions.ts` - Existing server-owned cart cookie and Server Action boundary for cart reads/mutations; Phase 14 should extend this pattern rather than adding client-side cart state.
- `src/lib/shopify/env.ts` and `src/lib/env/*` - Existing environment reader/fail-fast pattern for Shopify and server/public envs.
- `src/components/ui/section/section.tsx` and shared UI primitives - Account pages should reuse existing warm design primitives and token utilities rather than inventing a new visual system.
- `src/components/layout/header/*` and `src/components/layout/footer/*` - Account entry links connect here; footer currently has the stale external login link in `src/components/layout/footer/data.ts`.
- `src/components/layout/header/header.tsx` - Account access should be added to the existing right-side icon cluster beside search and cart, linking to `/account`.
- `src/app/(storefront)/cart/_components/checkout-form.tsx` and `src/app/(storefront)/cart/_components/view.tsx` - Checkout controls are the right place for subtle account context and blocked identity-sync recovery states.
- `tests/mocks/shopify-graphql-server.ts`, `tests/fixtures/shopify/*`, and `tests/e2e/cart-checkout.spec.ts` - Existing fake-Shopify cart-to-checkout coverage should be extended for buyer identity and blocked checkout; do not exercise hosted Shopify checkout.

### Established Patterns
- Server Components fetch data through `src/lib/*/operations` helpers; mutations live in `'use server'` action modules or route handlers.
- Runtime request APIs such as `cookies()` stay outside cached functions. Customer/account data is session-scoped and must not use public product/collection cache tags.
- Cart state is stored only as the Shopify cart ID in the `teavision_cart` HttpOnly cookie. Account session data should follow the same server-owned direction with stricter token handling.
- Dynamic App Router params use the Next.js 16 `params: Promise<{...}>` pattern.
- Tailwind 4 token classes and `cn()` are required for class composition; no raw hex/rgb classes, inline styles, CSS modules, or cool gray palette additions.
- Generated Shopify Storefront types are imported through `src/lib/shopify/types/index.ts`; Customer Account API types should have their own local barrel and should not be mixed into generated Storefront internals directly.
- Customer/account fetches should use a dedicated Customer Account API boundary rather than extending the Storefront `shopifyFetch()` contract directly, because auth headers, endpoint, PII handling, and cache policy differ.
- Current standard test scripts use explicit whitelists in places; Phase 14 plans must ensure newly added unit/integration tests are wired into the relevant `package.json` scripts or covered by the selected verification command.

### Integration Points
- New account routes belong under `src/app/(storefront)/account` and adjacent route-local `_components`/`_lib` folders unless a component is genuinely reusable and deserves Storybook coverage.
- Login/logout/callback route handlers need to coordinate with secure cookies, discovered Shopify endpoints, return paths, and OAuth validation state.
- Protected account pages need session-scoped Customer Account API operations for dashboard, profile, addresses, and orders.
- Cart checkout handoff needs a pre-checkout identity sync path and fake-Shopify tests around Server Actions/route-handler boundaries.
- Header/footer account links need migration from external/stale routes to owned headless account routes.
- Legacy account compatibility routes need a safe allowlist for return/context parameters and an explanatory fallback page for unmapped classic account URLs.
- Wave 0 should establish the fake Customer Account/OIDC fixture, Customer Account fixtures, and Storefront fake responses for `CartBuyerIdentityUpdate` and identity-aware `CartCreate` before feature tasks depend on them.

</code_context>

<specifics>
## Specific Ideas

- `/account` should feel like a practical self-service workspace, not a marketing page.
- Use recent orders plus default address as the dashboard's first signal.
- Use dedicated address form pages instead of modals or inline edit-heavy address lists.
- Keep account support visible but compact.
- Treat B2B, wholesale status, and reorder as parity findings unless Shopify/cart/checkout data makes them authoritative.
- Header account entry is an icon-only route to `/account`, including on mobile.
- Buyer identity sync failures should feel recoverable: retry first, then sign in again or contact support.
- Setup/readiness failures are operator-facing launch blockers, not customer-facing feature toggles.
- The approved UI contract keeps account pages practical and restrained: no marketing hero, no shadcn, no duplicate mobile account menu row, and required Storybook states for dashboard, orders, addresses, cart checkout context, and login/bridge states.
- Validation should start with fake Customer Account and fake Shopify buyer-identity coverage before implementation waves, while real Customer Account OAuth and hosted checkout remain manual/approval-gated.

</specifics>

<deferred>
## Deferred Ideas

- Guest order lookup remains deferred unless privacy, identity verification, and business need are explicitly approved.
- Custom account preferences remain deferred to the v2 `PREF-01` requirement.
- Reorder remains deferred unless a Phase 14 plan proves it can safely use authoritative Shopify cart actions, current variant availability, and no price promises.
- Customer-specific/B2B price displays remain deferred/admin-dependent unless Shopify cart or checkout returns authoritative pricing.

</deferred>

---

*Phase: 14-Shopify Customer Accounts*
*Context gathered: 2026-06-19*
