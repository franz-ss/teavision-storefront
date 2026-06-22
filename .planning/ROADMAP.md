# Roadmap: Teavision Headless Storefront

## Milestones

- ✅ **v1.0 Headless Storefront Launch** — Phases 1–11 (shipped 2026-06-11) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.1 Blog Performance** — Phase 12 (shipped 2026-06-12) — see `milestones/v1.1-ROADMAP.md`
- ✅ **v1.2 SEO-Safe PLP Pagination Parity** — Phase 13 (shipped 2026-06-12) — see `milestones/v1.2-ROADMAP.md`
- ✅ **v1.3 Shopify Customer Accounts** — Phase 14 (shipped 2026-06-22) — see `milestones/v1.3-ROADMAP.md`
- ◆ **v1.4 Production Readiness 100/100** — Phases 15–17 (active)

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

<details>
<summary>✅ v1.3 Shopify Customer Accounts (Phase 14) — SHIPPED 2026-06-22</summary>

- [x] Phase 14: Shopify Customer Accounts (9/9 plans) — completed 2026-06-22

Full phase details: `milestones/v1.3-ROADMAP.md` · Audit: `milestones/v1.3-MILESTONE-AUDIT.md`

</details>

### ◆ v1.4 Production Readiness 100/100

- [ ] **Phase 15: Security, Dependency, and Runtime Header Hardening** — remove known security launch blockers, add tested production headers/CSP, fix account OAuth-start behavior, and make abuse controls explicit. (0/5 plans ready)
- [ ] **Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage** — close legal/policy route gaps, consent-aware analytics instrumentation, and launch indexing/SEO verification. (0/TBD plans)
- [ ] **Phase 17: Operations, Performance, and Final Production-Readiness Audit** — add health/observability/runbook coverage, remediate performance/UX/e2e gaps, and produce the final 100/100 audit evidence. (0/TBD plans)

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
| 14. Shopify Customer Accounts              | v1.3      | 9/9            | Complete   | 2026-06-22 |
| 15. Security, Dependency, and Runtime Header Hardening | v1.4 | 4/5 | In Progress|  |
| 16. Legal, Consent, Analytics, and SEO Launch Coverage | v1.4 | 0/TBD | Planned | — |
| 17. Operations, Performance, and Final Production-Readiness Audit | v1.4 | 0/TBD | Planned | — |

## Phase Details

### Phase 15: Security, Dependency, and Runtime Header Hardening

**Goal:** Remove known security launch blockers and establish tested runtime protections before adding or verifying additional third-party integrations.

**Requirements:** SEC-01, SEC-02, SEC-03, SEC-04, SEC-05

**Depends on:** v1.3 Customer Account implementation; local Next.js 16 docs for headers/CSP; current dependency audit output; production-readiness audit evidence from 2026-06-22.

**Success Criteria:**
1. `pnpm audit --audit-level moderate` has no critical/high findings and no launch-relevant moderate findings, or any residual dev-only moderate finding is explicitly justified with no runtime exposure.
2. Representative production responses include the approved security headers and no `x-powered-by` leakage.
3. CSP is either enforced or staged report-only with explicit source allowlists for required Next, Shopify, Sanity, Searchanise, Trustoo, analytics, image, and font assets.
4. Customer account login-start links no longer prefetch into cross-origin OAuth redirects, and production callback/logout origins match Shopify settings.
5. Form/search abuse protection is production-explicit through provider-level protection, durable limiting, or fail-closed configuration documentation.

**Notes for planning:**
- Read `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md` and `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` before code changes.
- Avoid nonce CSP unless the plan explicitly accepts the dynamic-rendering/PPR trade-offs.
- Keep rate-limit improvements aligned with existing `src/lib/rate-limit/` boundaries and `.env.example`.

**Plans:**

**Wave 1**
- [ ] `15-01` — Dependency Audit Remediation and Evidence

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] `15-02` — Security Headers and Report-Only CSP Baseline
- [ ] `15-03` — Customer Account OAuth-Start Prefetch and Origin Hardening
- [ ] `15-04` — Public Form and Search Abuse-Control Posture

**Wave 3** *(blocked on Wave 2 completion)*
- [ ] `15-05` — Final Runtime Security Probe and Phase Evidence

**Cross-cutting constraints:**
- Live Shopify Customer Account OAuth, hosted checkout, payment, shipping, tax, order, and success-redirect testing remain owner-gated unless approval is recorded.
- Phase 15 evidence must separate automated local/fake proof from owner/admin-gated live proof.
- Dependency remediation must avoid `pnpm codegen` and generated Shopify type churn unless an upgrade genuinely requires it.

### Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage

**Goal:** Close trust, compliance, conversion-measurement, and launch-indexing gaps that block a production-ready ecommerce launch.

**Requirements:** LEGAL-01, LEGAL-02, SEO-01, CONSENT-01, CONSENT-02, ANALYTICS-01, ANALYTICS-02, ANALYTICS-03

**Depends on:** Phase 15 CSP/security policy; owner-approved legal/policy content or placeholders; confirmed analytics destinations; Shopify Customer Privacy API decision.

**Success Criteria:**
1. Privacy, terms, shipping, returns/refunds, cookie/privacy preferences, footer legal links, `/policies/*`, and legacy Shopify policy URLs resolve or redirect without 404s.
2. Launch indexing can be flipped safely with verified robots, sitemap, canonical, noindex, and structured-data behavior.
3. Consent defaults are initialized before analytics or advertising tags can load, and Shopify Customer Privacy API usage is wired or explicitly ruled out.
4. Ecommerce analytics events are emitted through a typed consent-aware adapter and verified against fake or approved destinations.
5. The launch runbook includes pre-cutover and post-cutover analytics destination verification steps.

**Notes for planning:**
- Do not invent legal promises; route/content scaffolding can land before owner/legal copy approval only if the limitation is documented.
- Confirm whether GA4, GTM, Meta, Klaviyo, Shopify pixels, and Search Console are available before implementation.
- Analytics tests must not send real production events from CI.

**Plans:** TBD by `$gsd-plan-phase 16`

### Phase 17: Operations, Performance, and Final Production-Readiness Audit

**Goal:** Prove the storefront is operationally ready to launch with monitoring, performance, e2e, owner-gated Shopify test evidence, and a repeatable final 100/100 readiness audit.

**Requirements:** OPS-01, OPS-02, OPS-03, OPS-04, PERF-01, UX-01, QA-01, QA-02, QA-03

**Depends on:** Phases 15 and 16; chosen production hosting/monitoring stack; store-owner approval for hosted checkout/payment/order testing; Shopify admin test configuration.

**Success Criteria:**
1. A safe health/readiness endpoint reports deploy readiness without exposing secrets, tokens, customer PII, or raw provider payloads.
2. The chosen monitoring/logging stack captures app errors, checkout failures, provider failures, route/action failures, release context, and alerts or escalation paths.
3. Home and PDP performance evidence no longer shows launch-blocking LCP regressions, and audit UX/accessibility polish items are resolved or explicitly non-blocking.
4. Local production e2e runs from a controlled server lifecycle and passes without depending on a pre-existing dev server.
5. A final production-readiness report proves all automated checks and records owner-approved Shopify hosted checkout, payment, shipping, tax, order, success redirect, Customer Account OAuth, protected customer data, and B2B pricing evidence or explicit owner-blocked status.

**Notes for planning:**
- Do not run real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests without store-owner approval.
- If production hosting is not Vercel, map observability requirements to the actual provider rather than assuming Vercel-specific APIs.
- The final report is the source of truth for the requested production-readiness score.

**Plans:** TBD by `$gsd-plan-phase 17`

## Next

Start Phase 15 with `$gsd-discuss-phase 15`, or skip directly to `$gsd-plan-phase 15`.
