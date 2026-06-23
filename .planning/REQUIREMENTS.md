# Requirements: Teavision Headless Storefront v1.4

**Defined:** 2026-06-22
**Core Value:** Customers can confidently choose the right bulk product, quantity, and price path before checkout.

## v1 Requirements

Requirements for v1.4 Production Readiness 100/100. Each maps to roadmap phases.

### Security

- [x] **SEC-01**: Site owner can verify `pnpm audit --audit-level moderate` has no critical or high findings and no launch-relevant moderate findings.
- [x] **SEC-02**: User receives production responses with tested security headers across storefront, account, cart, policy, and API surfaces.
- [x] **SEC-03**: Site can enforce or stage a CSP that allows required Shopify, Sanity, Searchanise, Trustoo, and analytics assets without unsafe broad rules.
- [x] **SEC-04**: Customer can start Shopify account login without prefetch or CORS errors, and production OAuth callback/logout URLs are verified.
- [x] **SEC-05**: Public form and search abuse controls are production-explicit through provider protection, durable limiting, or a documented fail-closed policy.

### Legal, SEO, And Consent

- [x] **LEGAL-01**: User can access privacy, terms, shipping, returns/refunds, and cookie/privacy preference pages without 404s.
- [x] **LEGAL-02**: Legacy Shopify policy URLs and footer/legal links redirect or resolve correctly.
- [ ] **SEO-01**: Site owner can flip launch indexing safely, with robots, sitemap, canonicals, structured data, and noindex behavior verified.
- [x] **CONSENT-01**: Visitor consent defaults are set before analytics or advertising tags load.
- [x] **CONSENT-02**: Shopify Customer Privacy API integration is evaluated or wired where Shopify-managed pixels or checkout consent apply.

### Analytics

- [x] **ANALYTICS-01**: Site emits consent-aware ecommerce events for product view, search, add-to-cart, cart update, checkout start, and purchase or checkout evidence where possible.
- [x] **ANALYTICS-02**: GA4, GTM, Meta, Klaviyo, or disabled/fake destinations are configured safely with test evidence and no secrets in client code.
- [x] **ANALYTICS-03**: Launch runbook includes analytics destination verification before and after cutover.

### Operations

- [x] **OPS-01**: Production exposes a safe health/readiness endpoint with no secrets or PII.
- [x] **OPS-02**: Errors, checkout failures, provider failures, and route/action failures are observable in the chosen monitoring stack.
- [x] **OPS-03**: Logs are structured and redact tokens, customer PII, message bodies, and provider payloads.
- [x] **OPS-04**: Launch runbook covers alerts, rollback, backups/platform recovery, owner approvals, and post-launch monitoring.

### Performance, UX, And QA

- [ ] **PERF-01**: Home and PDP Lighthouse/Core Web Vitals evidence no longer shows launch-blocking LCP regressions.
- [x] **UX-01**: Audit UX/accessibility polish items are resolved or documented as non-blocking, including mobile text wrapping and duplicate skip links.
- [x] **QA-01**: Local production e2e is unblocked and passes without relying on an already-running dev server.
- [x] **QA-02**: Final readiness audit script/report proves build, lint, typecheck, unit, integration, Storybook, e2e, dependency audit, headers, policy routes, SEO, performance, and browser smoke checks.
- [x] **QA-03**: Shopify hosted checkout, payment, shipping, tax, order creation, success redirect, Customer Account OAuth, protected customer data, and B2B pricing checks have owner-approved test evidence or explicit owner-blocked status.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Measurement

- **ATTR-01**: Server-side Meta Conversions API and Klaviyo event delivery are implemented if marketing requires server-side attribution after launch.
- **ATTR-02**: Revenue, conversion, and organic-search dashboards compare post-launch performance against the pre-launch baseline automatically.

### Platform Hardening

- **RATE-01**: A durable rate-limit store replaces memory-only limiting if provider-level protection is unavailable or insufficient.
- **SYN-01**: Synthetic production monitoring runs scheduled browser checks for search, cart, account login, policy pages, and checkout handoff.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Redesigning storefront visuals | v1.4 is a readiness hardening milestone, not a visual redesign. |
| Replacing Shopify hosted checkout | Shopify remains authoritative for checkout, payment, tax, shipping, and orders. |
| Running real checkout/payment/order tests without owner approval | Project rules require store-owner approval before real Shopify hosted checkout testing. |
| Rewriting legal policy substance without owner/legal review | Engineering can provide routes and placeholders, but legal promises require owner/legal approval. |
| Reinstalling Liquid theme scripts wholesale | Third-party Liquid snippets are not stable headless contracts and can hurt CSP, consent, and performance. |
| Building personalization, A/B testing, or multi-market expansion | These are separate post-launch growth projects. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 | Phase 15 | Complete |
| SEC-02 | Phase 15 | Complete |
| SEC-03 | Phase 15 | Complete |
| SEC-04 | Phase 15 | Complete |
| SEC-05 | Phase 15 | Complete |
| LEGAL-01 | Phase 16 | Complete |
| LEGAL-02 | Phase 16 | Complete |
| SEO-01 | Phase 16 | Blocked |
| CONSENT-01 | Phase 16 | Complete |
| CONSENT-02 | Phase 16 | Complete |
| ANALYTICS-01 | Phase 16 | Complete |
| ANALYTICS-02 | Phase 16 | Complete |
| ANALYTICS-03 | Phase 16 | Complete |
| OPS-01 | Phase 17 | Complete |
| OPS-02 | Phase 17 | Complete |
| OPS-03 | Phase 17 | Complete |
| OPS-04 | Phase 17 | Complete |
| PERF-01 | Phase 17 | Blocked |
| UX-01 | Phase 17 | Complete |
| QA-01 | Phase 17 | Complete |
| QA-02 | Phase 17 | Complete |
| QA-03 | Phase 17 | Complete |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-06-22*
*Last updated: 2026-06-23 after Phase 17 strict readiness evidence*
