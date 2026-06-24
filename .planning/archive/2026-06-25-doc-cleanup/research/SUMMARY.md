# Project Research Summary

**Project:** Teavision Headless Storefront
**Domain:** Headless Shopify ecommerce production-readiness remediation
**Researched:** 2026-06-22
**Confidence:** HIGH

## Executive Summary

v1.4 should treat "100/100 production readiness" as a measurable launch-hardening program, not as a broad polish pass. The current audit blockers map cleanly to eight workstreams: dependency/security cleanup, security headers/CSP, Customer Account OAuth launch behavior, legal/policy/SEO route coverage, consent-aware analytics, observability/operations, performance remediation, and final automated plus owner-gated launch evidence.

The most urgent technical issue is the dependency audit: `pnpm audit --audit-level moderate` currently reports 45 advisories including 1 critical and 16 high findings. Next.js 16.2.4 is directly affected by several high/moderate advisories fixed in 16.2.5/16.2.6, and transitive tooling paths include critical `shell-quote` plus high `undici`, `vite`, `ws`, and `form-data` findings. A perfect readiness score requires resolving or explicitly proving non-runtime residuals.

The second key risk is that production-readiness cannot be fully automated: Shopify hosted checkout, payment, tax, shipping, Customer Account OAuth, protected customer data, and B2B/company pricing still depend on Shopify admin configuration and store-owner approval. The milestone should separate code-complete evidence from owner/admin-gated launch evidence, then produce a final score artifact.

## Key Findings

### Recommended Stack

**Core technologies:**
- Next.js 16.2.6+ patch line: removes known current high/moderate Next advisories.
- Next response headers via `next.config.ts`: matches local Next 16 docs and keeps header policy centralized.
- Static/report-only CSP first: lower risk with Cache Components/PPR than nonce CSP, which can force dynamic rendering.
- Sentry/OTel/Vercel-equivalent observability: required because the repo currently has no external error tracking.
- Google consent mode + GA4 ecommerce recommended events + Shopify Customer Privacy API: consent-aware tracking for headless Shopify.
- Playwright/Lighthouse/header probes: repeatable final readiness evidence.

### Expected Features

**Must have:**
- Clean dependency audit policy and patches.
- Global security headers, including CSP or staged CSP report-only, HSTS, content-type, referrer, permissions, frame protection, and no `x-powered-by`.
- OAuth/login-start route hardening to avoid prefetch/cross-origin CORS failures.
- Legal/policy route and legacy redirect coverage.
- Consent-aware analytics and ecommerce event adapter.
- Health/readiness endpoint, monitoring/error tracking, redacted structured logs, and alert/runbook coverage.
- Performance fixes for home/PDP LCP.
- Full production-smoke and launch-audit script.
- Owner-approved Shopify launch test matrix.

**Should have:**
- Synthetic post-launch monitoring.
- Search Console/404/revenue monitoring checklist.
- Durable rate limiting or documented provider-level protection.
- Webhook observability for ignored topics and revalidation outcomes.

**Defer:**
- Server-side Meta/Klaviyo conversion APIs unless marketing requires them for launch.
- Personalization, A/B testing, international expansion, and pricing-system migrations.

### Architecture Approach

Keep changes inside established Next/App Router boundaries: security headers in config plus `lib/security`, analytics in a consent-aware adapter, policy routes under storefront pages or redirects, health under API route handlers, observability in instrumentation/logging helpers, and launch evidence in docs/scripts. Avoid redesigning the storefront or changing commerce authority: Shopify remains authoritative for prices, cart, checkout, customer data, payments, tax, shipping, and orders.

**Major components:**
1. Dependency/security hardening boundary: package upgrades, overrides, and audit evidence.
2. Runtime protection boundary: headers/CSP, account OAuth, rate limiting, webhook visibility.
3. Compliance/SEO boundary: policy routes, privacy/cookie content, redirects, sitemap/noindex/canonical checks.
4. Measurement boundary: consent banner/API, GA4/Meta/Klaviyo adapters, ecommerce event tests.
5. Operations boundary: health, monitoring, logging, alerts, backups/runbook, final score artifact.

### Critical Pitfalls

1. **Vague 100/100 scope**: fix by converting the audit into atomic requirements and a final evidence table.
2. **Known vulnerabilities left in dependencies**: fix critical/high advisories before launch.
3. **CSP breaking revenue scripts**: inventory third-party hosts and test report-only/static CSP before enforcing.
4. **OAuth route prefetch CORS**: use non-prefetched OAuth-start links and verify Shopify HTTPS callback settings.
5. **Legal policy 404s**: own headless routes/redirects for privacy, shipping, returns, terms, cookies, and old Shopify policy URLs.
6. **Consent drift**: initialize consent defaults before tags and coordinate Shopify Customer Privacy API where needed.
7. **Fake checkout mistaken for launch readiness**: require owner-approved Shopify test-mode or refunded real-order evidence.
8. **Noindex left on at launch**: make noindex flip and sitemap/Search Console checks explicit gates.

## Implications for Roadmap

### Phase 15: Security, Dependency, and Runtime Header Hardening

**Rationale:** Known critical/high advisories and missing security headers are launch blockers.
**Delivers:** Dependency patch/override plan, clean audit policy, global security headers, CSP strategy, account OAuth prefetch fix, header/security tests.
**Addresses:** Security headers, dependency audit, OAuth CORS, rate-limit production stance.
**Avoids:** Shipping known vulnerabilities or brittle CSP.

### Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage

**Rationale:** Policy 404s, cookie/consent gaps, and missing conversion tracking block trust, compliance, and launch visibility.
**Delivers:** Policy routes/redirects, cookie/privacy review hooks, consent-aware analytics adapter, GA4 ecommerce event tests, sitemap/noindex/redirect checks.
**Addresses:** Legal/compliance, analytics, SEO fundamentals.
**Avoids:** Tracking before consent and policy-route launch failures.

### Phase 17: Operations, Performance, and Final Production-Readiness Audit

**Rationale:** A 100/100 launch needs monitoring, health, performance evidence, e2e confidence, and owner-gated Shopify launch proof.
**Delivers:** Health/readiness endpoint, observability/logging/alerts/runbook, LCP remediation, local production e2e unblock, final audit script/report, owner-gated Shopify checklist.
**Addresses:** Operational readiness, reliability, performance, checkout/payment/tax/shipping/OAuth UAT.
**Avoids:** "Works locally" launch with no observability or external checkout evidence.

### Phase Ordering Rationale

- Patch dependencies and headers before analytics/consent so security policy does not need to be rewritten after third-party script inventory.
- Legal/policy/SEO and analytics belong together because privacy/cookie disclosures must match actual tracking behavior.
- Performance/operations/final audit come last because they validate the integrated result across real pages and launch workflows.

### Research Flags

- **Phase 15:** Read local Next 16 docs before code changes; especially headers and CSP trade-offs.
- **Phase 16:** Confirm owner/legal content for policy pages; do not invent legal promises.
- **Phase 16:** Confirm exact analytics destinations: GA4, GTM, Meta, Klaviyo, Shopify pixels.
- **Phase 17:** Confirm production host: Vercel docs are relevant only if deployment is Vercel.
- **Phase 17:** Confirm owner approval before hosted checkout/payment/order tests.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against local package state, pnpm audit, Next docs, Shopify docs, Google docs, OWASP. |
| Features | HIGH | Derived directly from production-readiness audit findings and primary-source launch expectations. |
| Architecture | HIGH | Matches existing codebase architecture and avoids new platform migrations. |
| Pitfalls | HIGH | Based on observed audit failures and official guidance for headers, consent, Shopify, SEO, WCAG, and web vitals. |

**Overall confidence:** HIGH

### Gaps to Address During Planning/Execution

- Exact production hosting/observability provider must be confirmed before implementing alerts/drains.
- Exact analytics destinations and IDs must be provided by the owner; code should support disabled/fake mode safely.
- Legal policy text needs owner/legal approval; engineering can guarantee routes, redirects, metadata, and content placeholders but not legal correctness.
- Hosted checkout/payment/tax/shipping/order tests require explicit owner approval and Shopify test-mode configuration.
- B2B/company pricing checks require authoritative Shopify admin/customer account setup and test customers.

## Sources

### Primary

- OWASP HTTP Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OWASP Content Security Policy Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Next.js headers docs: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
- Next.js CSP guide: https://nextjs.org/docs/app/guides/content-security-policy
- Next.js OpenTelemetry guide: https://nextjs.org/docs/app/guides/open-telemetry
- Shopify Customer Account API setup: https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started
- Shopify Customer Account authentication: https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers
- Shopify Customer Privacy API: https://shopify.dev/docs/api/customer-privacy
- Shopify store policies: https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos
- Shopify test orders: https://help.shopify.com/en/manual/checkout-settings/test-orders
- Google Consent Mode: https://developers.google.com/tag-platform/security/guides/consent
- GA4 ecommerce measurement: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- web.dev Web Vitals: https://web.dev/articles/vitals
- Google Search Central site moves: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Google Search Central robots.txt: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- OAIC Australian Privacy Principles: https://www.oaic.gov.au/privacy/australian-privacy-principles
- ACCC consumer guarantees: https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees
- ACMA spam rules: https://www.acma.gov.au/avoid-sending-spam
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Vercel Observability: https://vercel.com/docs/observability
- Sentry Next.js docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/

---
*Research completed: 2026-06-22*
*Ready for roadmap: yes*
