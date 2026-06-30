# Requirements: Teavision Headless Storefront v1.4–v1.5

**Defined:** 2026-06-22 (v1.4) · 2026-06-30 (v1.5)
**Core Value:** Customers can confidently choose the right bulk product, quantity, and price path before checkout.

> v1.4 (Production Readiness 100/100) requirements are complete. v1.5 (Performance & PageSpeed 100) requirements (PSI-01..PSI-15) are defined below and map to Phase 20.

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
- [x] **SEO-01**: Site owner can flip launch indexing safely, with robots, sitemap, canonicals, structured data, and noindex behavior verified.
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

- [x] **PERF-01**: Home and PDP Lighthouse/Core Web Vitals evidence no longer shows launch-blocking LCP regressions, or dated acceptance marks local lab failures non-blocking.
- [x] **UX-01**: Audit UX/accessibility polish items are resolved or documented as non-blocking, including mobile text wrapping and duplicate skip links.
- [x] **QA-01**: Local production e2e is unblocked and passes without relying on an already-running dev server.
- [x] **QA-02**: Final readiness audit script/report proves build, lint, typecheck, unit, integration, Storybook, e2e, dependency audit, headers, policy routes, SEO, performance, and browser smoke checks.
- [x] **QA-03**: Shopify hosted checkout, payment, shipping, tax, order creation, success redirect, Customer Account OAuth, protected customer data, and B2B pricing checks have owner-approved test evidence or explicit owner-blocked status.

## v1.5 Requirements — Performance & PageSpeed 100

Requirements for v1.5. Each maps to Phase 20. The goal is a genuine Google PageSpeed Insights / Lighthouse 100 across all four categories on the representative routes where physically achievable, with honest documentation of any constrained ceilings.

### Measurement & Diagnosis

- [ ] **PSI-01**: A public, fetchable, **noindexed** preview deployment exists, and real Google PageSpeed Insights (mobile + desktop) results are captured as committed evidence for each representative route alongside the local Lighthouse harness; the local harness is reconciled against real PSI so it is a trustworthy inner-loop signal.
- [ ] **PSI-02**: The Phase 17 local-lab LCP/FCP discrepancy is reproduced and root-caused per route — true LCP element/resource and the genuine bottleneck (lab artifact vs. real defect) documented — before remediation begins.

### Core Web Vitals

- [ ] **PSI-03**: Largest Contentful Paint is "good" (≤ 2.5 s) on real PSI / reconciled lab across the representative routes.
- [ ] **PSI-04**: Cumulative Layout Shift is ≤ 0.1 on all representative routes, including `/account` (currently 0.128).
- [ ] **PSI-05**: Interaction to Next Paint is "good" (≤ 200 ms) and lab Total Blocking Time stays minimal; main-thread/JS work is bounded.

### Resource Optimization

- [ ] **PSI-06**: Unused/duplicate JavaScript is minimized, bundles are code-split, non-critical JS is deferred, and no render-blocking scripts remain in the critical path (justified by bundle-analysis evidence).
- [ ] **PSI-07**: Render-blocking and unused CSS is minimized; critical CSS is optimized/inlined where it helps.
- [ ] **PSI-08**: Images use correct format (AVIF/WebP), responsive `sizes`, explicit dimensions (no CLS), correct LCP `preload` discipline, and lazy/eager loading; no oversized/oversampled media.
- [ ] **PSI-09**: Fonts load non-render-blocking with critical-font preload, correct `font-display`, subsetting, and zero font-driven CLS.
- [ ] **PSI-10**: Static/immutable assets carry long-lived cache headers, responses are compressed (brotli/gzip), TTFB/server response is fast, and the critical-path request count is minimized — measured on the preview deployment.
- [ ] **PSI-11**: Searchanise, Trustoo, analytics, and Shopify scripts are consent-gated / lazy / deferred / facade-loaded off the critical path; the "production tags live" performance ceiling is measured and documented as an explicit limitation with the best-achievable alternative.

### Category Completeness

- [ ] **PSI-12**: Lighthouse Accessibility scores 100 on the representative routes (closing the current 95–97 gap) without regressing the warm/botanical design system.
- [ ] **PSI-13**: Lighthouse Best Practices scores 100 (HTTPS, no console errors, no deprecated APIs, correct image aspect ratios, valid source maps / CSP behavior).
- [ ] **PSI-14**: Lighthouse SEO category scores 100 on the representative routes, confirmed without regressing Phase 16/18/19 SEO work.

### Roadmap & Honesty

- [ ] **PSI-15**: A prioritized (impact × effort) remediation roadmap and a final evidence pack document achieved scores per route/category/device, explicitly state where a perfect 100 is and is not realistically achievable and the best alternative, and supersede/update the PERF-01 non-blocking acceptance with the real result (no fabricated pass).

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

| Feature                                                          | Reason                                                                                                    |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Redesigning storefront visuals                                   | v1.4 is a readiness hardening milestone, not a visual redesign.                                           |
| Replacing Shopify hosted checkout                                | Shopify remains authoritative for checkout, payment, tax, shipping, and orders.                           |
| Running real checkout/payment/order tests without owner approval | Project rules require store-owner approval before real Shopify hosted checkout testing.                   |
| Rewriting legal policy substance without owner/legal review      | Engineering can provide routes and placeholders, but legal promises require owner/legal approval.         |
| Reinstalling Liquid theme scripts wholesale                      | Third-party Liquid snippets are not stable headless contracts and can hurt CSP, consent, and performance. |
| Building personalization, A/B testing, or multi-market expansion | These are separate post-launch growth projects.                                                           |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement  | Phase    | Status   |
| ------------ | -------- | -------- |
| SEC-01       | Phase 15 | Complete |
| SEC-02       | Phase 15 | Complete |
| SEC-03       | Phase 15 | Complete |
| SEC-04       | Phase 15 | Complete |
| SEC-05       | Phase 15 | Complete |
| LEGAL-01     | Phase 16 | Complete |
| LEGAL-02     | Phase 16 | Complete |
| SEO-01       | Phase 16 | Complete |
| CONSENT-01   | Phase 16 | Complete |
| CONSENT-02   | Phase 16 | Complete |
| ANALYTICS-01 | Phase 16 | Complete |
| ANALYTICS-02 | Phase 16 | Complete |
| ANALYTICS-03 | Phase 16 | Complete |
| OPS-01       | Phase 17 | Complete |
| OPS-02       | Phase 17 | Complete |
| OPS-03       | Phase 17 | Complete |
| OPS-04       | Phase 17 | Complete |
| PERF-01      | Phase 17 | Complete |
| UX-01        | Phase 17 | Complete |
| QA-01        | Phase 17 | Complete |
| QA-02        | Phase 17 | Complete |
| QA-03        | Phase 17 | Complete |

**v1.5 (Performance & PageSpeed 100):** Phase 20 was replanned 2026-06-30 to a **lean scope** (owner directive D-16) covering only the homepage `/` PSI screenshot findings. The lean plan (`20-01`) addresses PSI-03/05/06/07/08; the rest are **Deferred** (preserved in `deferred/20-02..05-PLAN.md`).

| Requirement | Phase    | Status              |
| ----------- | -------- | ------------------- |
| PSI-03      | Phase 20 | Planning (lean)     |
| PSI-05      | Phase 20 | Planning (lean)     |
| PSI-06      | Phase 20 | Planning (lean)     |
| PSI-07      | Phase 20 | Planning (lean)     |
| PSI-08      | Phase 20 | Planning (lean)     |
| PSI-01      | Phase 20 | Deferred (post-lean) |
| PSI-02      | Phase 20 | Deferred (post-lean) |
| PSI-04      | Phase 20 | Deferred (post-lean) |
| PSI-09      | Phase 20 | Deferred (post-lean) |
| PSI-10      | Phase 20 | Deferred (post-lean) |
| PSI-11      | Phase 20 | Deferred (post-lean) |
| PSI-12      | Phase 20 | Deferred (post-lean) |
| PSI-13      | Phase 20 | Deferred (post-lean) |
| PSI-14      | Phase 20 | Deferred (post-lean) |
| PSI-15      | Phase 20 | Deferred (post-lean) |

**Coverage:**

- v1.4 requirements: 22 total — mapped to phases: 22 — unmapped: 0
- v1.5 requirements: 15 total — lean Phase 20 (`20-01`): 5 (PSI-03/05/06/07/08); deferred: 10; unmapped: 0

---

_Requirements defined: 2026-06-22 (v1.4), 2026-06-30 (v1.5)_
_Last updated: 2026-06-30 — added v1.5 Performance & PageSpeed 100 requirements (PSI-01..PSI-15) mapped to Phase 20_
