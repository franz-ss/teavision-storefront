# Roadmap: Teavision Headless Storefront

## Milestones

- ✅ **v1.0 Headless Storefront Launch** — Phases 1–11 (shipped 2026-06-11) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.1 Blog Performance** — Phase 12 (shipped 2026-06-12) — see `milestones/v1.1-ROADMAP.md`
- ✅ **v1.2 SEO-Safe PLP Pagination Parity** — Phase 13 (shipped 2026-06-12) — see `milestones/v1.2-ROADMAP.md`
- 🚧 **v1.3 Shopify Customer Accounts** — Phase 14 (executing 2026-06-19)

## Phases

<details>
<summary>✅ v1.0 Headless Storefront Launch (Phases 1–11) — SHIPPED 2026-06-11</summary>

- [x] Phase 1: Bulk Savings PDP and Cart Parity (1/1 plans) — completed 2026-05-26
- [x] Phase 2: Searchanise API Search Results (1/1 plans) — completed 2026-05-27
- [x] Phase 4: Footer 1:1 Parity (1/1 plans) — completed 2026-05-29
- [x] Phase 5: Codebase Review Remediation (5/5 plans) — completed 2026-06-02
- [x] Phase 6: Prevent the site from being indexed (1/1 plans) — completed 2026-06-03
- [x] Phase 8: Optimized Collection Quick Add (1/1 plans) — completed 2026-06-03
- [x] Phase 9: Collection Product Card Improvements — closed superseded: CARD-02..06 delivered via 11-08; CARD-01 replaced by the owner-approved vertical card
- [x] Phase 10: Cart/Checkout Critical Flow Tests (4/4 plans) — completed (verified; executed alongside the roadmap phases)
- [x] Phase 11: Full Visual Redesign (22/22 plans) — completed 2026-06-11

Full phase details: `milestones/v1.0-ROADMAP.md` · Audit: `milestones/v1.0-MILESTONE-AUDIT.md`

</details>

<details>
<summary>✅ v1.1 Blog Performance (Phase 12) — SHIPPED 2026-06-12</summary>

- [x] Phase 12: Optimize /blogs/teavision-blogs loading and image rendering (4/4 plans) — completed 2026-06-12

Full phase details: `milestones/v1.1-ROADMAP.md` · Audit: `milestones/v1.1-MILESTONE-AUDIT.md`

</details>

<details>
<summary>✅ v1.2 SEO-Safe PLP Pagination Parity (Phase 13) — SHIPPED 2026-06-12</summary>

- [x] Phase 13: Production-parity collection pagination (2/2 plans) — completed 2026-06-12

Full phase details: `milestones/v1.2-ROADMAP.md` · Audit: `milestones/v1.2-MILESTONE-AUDIT.md`

</details>

### 🚧 v1.3 Shopify Customer Accounts

- [ ] **Phase 14: Shopify Customer Accounts** — Add modern Shopify Customer Account API authentication, protected account pages, address management, order history, cart buyer identity sync, and migration parity decisions for the Tea Vision account experience. (2/5 plans complete)

## Progress

| Phase                                      | Milestone | Plans Complete | Status     | Completed  |
| ------------------------------------------ | --------- | -------------- | ---------- | ---------- |
| 1. Bulk Savings PDP and Cart Parity        | v1.0      | 1/1            | Complete   | 2026-05-26 |
| 2. Searchanise API Search Results          | v1.0      | 1/1            | Complete   | 2026-05-27 |
| 4. Footer 1:1 Parity                       | v1.0      | 1/1            | Complete   | 2026-05-29 |
| 5. Codebase Review Remediation             | v1.0      | 5/5            | Complete   | 2026-06-02 |
| 6. Prevent site indexing                   | v1.0      | 1/1            | Complete   | 2026-06-03 |
| 8. Optimized Collection Quick Add          | v1.0      | 1/1            | Complete   | 2026-06-03 |
| 9. Collection Product Card Improvements    | v1.0      | —              | Superseded | 2026-06-11 |
| 10. Cart/Checkout Critical Flow Tests      | v1.0      | 4/4            | Complete   | —          |
| 11. Full Visual Redesign                   | v1.0      | 22/22          | Complete   | 2026-06-11 |
| 12. Optimize blog loading                  | v1.1      | 4/4            | Complete   | 2026-06-12 |
| 13. Production-parity collection pagination | v1.2      | 2/2            | Complete   | 2026-06-12 |
| 14. Shopify Customer Accounts              | v1.3      | 2/5            | In Progress | —          |

## Phase Details

### Phase 14: Shopify Customer Accounts

**Goal:** Add modern Shopify Customer Account API authentication and account self-service to the headless storefront while preserving Tea Vision's account, address, order-history, and checkout identity expectations.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, ACCT-01, ACCT-02, ACCT-03, ADDR-01, ADDR-02, ADDR-03, ADDR-04, ADDR-05, ORD-01, ORD-02, ORD-03, ORD-04, CART-01, CART-02, MIG-01, MIG-02, MIG-03, SEC-01, SEC-02, SEC-03, SEC-04

**Depends on:** Phase 10 cart/checkout critical-flow test patterns; current Next.js 16 App Router Shopify Storefront architecture; Shopify admin Customer Account API setup.

**Success Criteria:**
1. A customer can sign in through Shopify Customer Account API OAuth, maintain a secure server-owned session, access protected account pages, and log out.
2. Account dashboard/profile, saved addresses, default address, paginated orders, and order detail pages render through Customer Account API data with redesigned Tea Vision UI.
3. Address and supported profile mutations use Server Actions or Route Handlers that verify the customer session, normalize Shopify user errors, and never expose tokens to client code.
4. Logged-in customer identity is synced to the Shopify cart before checkout, and cart-to-checkout coverage remains limited to fake-Shopify tests unless the store owner approves real checkout testing.
5. Legacy account routes, header/footer links, reorder behavior, guest-order expectations, and B2B/customer-pricing parity are either implemented, redirected, or explicitly documented as deferred/admin-dependent.

**Notes for planning:**
- Use Customer Account API as the primary path; do not recreate classic password forms unless the owner explicitly chooses the legacy Storefront customer API fallback.
- Customer Account API setup requires Shopify customer accounts, Headless/Hydrogen channel credentials, protected customer data access, configured HTTPS callback/logout URLs, and an HTTPS tunnel for local OAuth testing.
- Keep Customer Account API types separate from Storefront generated types and import through local barrels.
- Customer data must be session-scoped and should not use public product/collection cache tags.
- Reorder and customer-specific pricing are parity findings from `teavision-theme`; only ship them in Phase 14 if the implementation can stay checkout-authoritative.

**Plans:** 2/5 plans complete

**Wave 1**
- [x] 14-01: Customer Account API foundation and OAuth session

**Wave 2 *(blocked on Wave 1 completion)***
- [x] 14-02: Protected account dashboard and order history
- [ ] 14-03: Address book and supported profile mutations

**Wave 3 *(blocked on Wave 1 completion)***
- [ ] 14-04: Cart buyer identity sync and blocked checkout handoff

**Wave 4 *(blocked on Waves 1-3 completion)***
- [ ] 14-05: Migration parity, account entry links, readiness docs, and final coverage

**Cross-cutting constraints:**
- Customer Account tokens, refresh material, and pending OAuth state stay in secure HttpOnly server-owned cookies.
- Customer/account data is session-scoped, no-store, and never cached with public product/collection tags.
- Server Actions and Route Handlers verify the customer session before mutating profile, address, cart identity, or checkout handoff state.
- Real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, and success-redirect tests stay blocked until store-owner approval.
- Account UI uses the approved warm Tailwind token system, `cn()`, route-local client leaves, and Storybook state coverage.

## Next

Execute Phase 14 with `$gsd-execute-phase 14`.
