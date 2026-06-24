# Feature Research

**Domain:** Headless Shopify ecommerce production readiness
**Researched:** 2026-06-22
**Confidence:** HIGH

## Feature Landscape

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clean dependency audit | Launching ecommerce with known critical/high advisories is unacceptable. | MEDIUM | Patch direct deps, transitive tooling deps, and document non-runtime exceptions only if unavoidable. |
| Production security headers | Modern browsers use headers to reduce XSS, clickjacking, MIME sniffing, referrer leakage, and permissions abuse. | MEDIUM | Add response headers globally and test them in `next start`. |
| Account OAuth production correctness | Customer account login must not throw browser CORS errors or depend on mismatched callback origins. | MEDIUM | Disable prefetch for OAuth-start routes; verify Shopify HTTPS callback/logout settings. |
| Legal and policy routes | Ecommerce visitors expect privacy, terms, refund/return, and shipping policy pages to resolve. | LOW-MEDIUM | Current local audit found several missing policy routes/legacy redirects. |
| Consent-aware analytics | Ecommerce launch needs conversion visibility without uncontrolled tracking. | MEDIUM-HIGH | Consent defaults must load before Google/Meta/Klaviyo tags; Shopify Customer Privacy API should be considered for Shopify-managed surfaces. |
| GA4 ecommerce event coverage | Merchants need product view, search, add-to-cart, checkout, and purchase visibility. | MEDIUM | Use recommended GA4 ecommerce event names and item arrays. |
| Health/readiness endpoint | Production operators need a fast signal for app, env, and critical dependency readiness. | LOW-MEDIUM | Current audit found `/health`, `/api/health`, `/status`, `/api/status` all 404. |
| Monitoring, logs, alerts | Launch requires error rate, route failures, checkout failures, and third-party degradation visibility. | MEDIUM | Choose Sentry/Vercel/OTel stack and redact PII. |
| Launch UAT gates | Payments, shipping, taxes, order creation, checkout success redirect, Customer Account OAuth, and B2B pricing require owner-approved real or test-mode evidence. | HIGH | Must respect no real checkout testing without store-owner approval. |
| Performance budgets | Home/PDP LCP issues block a perfect readiness score. | MEDIUM-HIGH | Current Lighthouse LCP was 4.6s home and 6.0s PDP; target good Web Vitals thresholds. |
| SEO launch checks | Noindex flip, sitemap, robots, canonicals, redirects, structured data, and policy redirects must be verified. | MEDIUM | Google warns robots.txt is not an indexing-block mechanism; noindex must be used intentionally and removed at launch. |
| Repeatable audit script | A 100/100 claim needs reproducible evidence. | MEDIUM | Combine build, test, audit, browser smoke, Lighthouse, headers, policy routes, and health checks. |

### Differentiators / Strong Launch Practices

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Readiness dashboard/runbook | Gives the owner a single launch go/no-go surface. | MEDIUM | Include env matrix, credentials, checkout permissions, rollback, support contacts. |
| Synthetic monitoring after deploy | Catches broken checkout/login/policy routes before customers report them. | MEDIUM | Can use host monitoring, external uptime checks, or Playwright scheduled smoke. |
| Structured third-party degradation logging | Makes Searchanise, Trustoo, Resend, Sanity, and Shopify issues diagnosable. | MEDIUM | Log route, provider, status/code, duration, and correlation ID; no PII. |
| Consent-debug test fixtures | Prevents analytics regressions without hitting real ad platforms in CI. | MEDIUM | Fake `dataLayer` and pixel adapters; browser tests assert event payload shape. |
| Launch score artifact | Converts the original audit into a pass/fail checklist with evidence links. | LOW | Useful for owner sign-off and future audits. |

### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| "Just add GTM everywhere" | Fast analytics setup | Consent/CSP/performance drift; hard to test. | Typed analytics adapter and consent-gated script loading. |
| Ignore dev-only audit findings | Some advisories are not runtime | A perfect score needs a clear policy and proof; dev tooling can still affect CI/build machines. | Patch where possible; document accepted dev-only residuals only after proving no production exposure. |
| Real checkout testing without approval | Completes end-to-end confidence | Could create real orders, charges, fulfillment, emails, ERP side effects. | Use Shopify test mode/Bogus Gateway or owner-approved refunded real-order test. |
| Soft-redirect all 404s to home | Hides errors from customers | Creates soft 404 SEO risk and masks redirect defects. | Map valuable legacy URLs; keep honest 404/410 for invalid URLs. |
| Legal boilerplate without owner review | Faster policy pages | Incorrect legal promises can be worse than missing routes. | Route coverage plus owner/legal review checklist. |

## Feature Dependencies

```text
Dependency audit cleanup
    -> production build/test confidence
    -> final readiness audit

Security headers + CSP
    -> third-party script inventory
    -> analytics/consent implementation

Legal policy routes
    -> footer/policy links
    -> cookie consent/privacy disclosures

Consent defaults
    -> analytics tags
    -> GA4/Meta/Klaviyo ecommerce events

Health endpoint + observability
    -> launch runbook
    -> post-launch monitoring

Shopify admin/customer account setup
    -> real OAuth testing
    -> hosted checkout/payment/tax/shipping/order UAT

Performance remediation
    -> Lighthouse/Core Web Vitals evidence
    -> final launch score
```

## MVP Definition

### Launch With (v1.4)

- [ ] Dependency audit has no critical/high findings and no launch-relevant moderate findings.
- [ ] Production security headers pass automated probes.
- [ ] Account login/OAuth route behavior is production-safe and tested.
- [ ] Legal/policy/cookie routes and legacy redirects resolve.
- [ ] Consent-aware analytics foundation and ecommerce event adapter are verified with fakes or approved staging destinations.
- [ ] Health/readiness endpoint and observability hooks exist.
- [ ] Home/PDP performance concerns are remediated and measured.
- [ ] Local production e2e, build, lint, typecheck, unit, integration, Storybook, Lighthouse, header, policy, and SEO probes pass.
- [ ] Owner/admin-gated hosted checkout, Customer Account OAuth, tax, shipping, payment, order, and B2B pricing tests are documented with pass/fail status.
- [ ] Final production-readiness score artifact records 100/100 or exact remaining owner-blocked exceptions.

### Add After Validation

- [ ] Full server-side conversion APIs for Meta/Klaviyo if client-side analytics proves insufficient.
- [ ] External durable rate limiter if hosting/provider-level protection is not enough.
- [ ] Search Console and revenue dashboard automation after real traffic flows.

### Future Consideration

- [ ] A/B testing/personalization.
- [ ] Multi-market/multi-currency expansion.
- [ ] Replacing legacy HulkApps fallback with fully Shopify-native pricing operations.

## Feature Prioritization Matrix

| Feature | User / Business Value | Implementation Cost | Priority |
|---------|-----------------------|---------------------|----------|
| Dependency audit cleanup | HIGH | MEDIUM | P1 |
| Security headers/CSP | HIGH | MEDIUM | P1 |
| OAuth/login behavior | HIGH | MEDIUM | P1 |
| Legal/policy routes | HIGH | LOW-MEDIUM | P1 |
| Health/observability | HIGH | MEDIUM | P1 |
| Checkout/OAuth launch UAT documentation | HIGH | HIGH due external approval | P1 |
| Consent-aware analytics | HIGH | MEDIUM-HIGH | P1 |
| Performance remediation | HIGH | MEDIUM-HIGH | P1 |
| SEO/noindex/sitemap/redirect checks | HIGH | MEDIUM | P1 |
| Accessibility/mobile polish from audit | MEDIUM | LOW-MEDIUM | P2 |
| Durable rate limiter | MEDIUM-HIGH | MEDIUM | P2 unless provider protection absent |
| Server-side conversion APIs | MEDIUM | HIGH | P3 for launch unless required by marketing |

## Sources

- OWASP HTTP Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- MDN Content Security Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
- Google Consent Mode: https://developers.google.com/tag-platform/security/guides/consent
- GA4 recommended events: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- GA4 ecommerce measurement: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- Shopify Customer Privacy API: https://shopify.dev/docs/api/customer-privacy
- Shopify store policies: https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos
- Shopify test orders: https://help.shopify.com/en/manual/checkout-settings/test-orders
- Shopify Payments test mode: https://help.shopify.com/en/manual/payments/shopify-payments/testing-shopify-payments
- web.dev Web Vitals: https://web.dev/articles/vitals
- Google Search Central site moves: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

---
*Feature research for: Teavision v1.4 Production Readiness 100/100*
*Researched: 2026-06-22*
