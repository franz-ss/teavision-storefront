# Pitfalls Research

**Domain:** Headless Shopify ecommerce production-readiness remediation
**Researched:** 2026-06-22
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Perfect Score as Vague Scope

**What goes wrong:**
The team chases a symbolic 100/100 without enumerating measurable pass/fail checks.

**Why it happens:**
Production readiness spans security, UX, legal, analytics, operations, and external Shopify admin gates.

**How to avoid:**
Convert the audit into atomic requirements and a final score artifact with evidence for each category.

**Warning signs:**
Requirements say "improve readiness" but do not specify headers, routes, tests, metrics, or owner-gated checks.

**Phase to address:**
Requirements and roadmap creation; final audit phase.

---

### Pitfall 2: Shipping Known Vulnerabilities

**What goes wrong:**
Known critical/high advisories remain in runtime or build dependencies.

**Why it happens:**
Transitive advisories are tedious and often sit in tooling packages.

**How to avoid:**
Patch direct dependencies, use overrides only when reviewed, remove unused tooling if necessary, and document any non-runtime residuals.

**Warning signs:**
`pnpm audit --audit-level moderate` still exits non-zero with critical/high advisories.

**Phase to address:**
Dependency and framework hardening.

---

### Pitfall 3: CSP Blocks Revenue-Critical Scripts

**What goes wrong:**
Strict headers break Searchanise, Trustoo, Shopify pixels, consent tools, analytics, fonts, images, checkout, or account routes.

**Why it happens:**
CSP is added without a third-party inventory or report-only ramp.

**How to avoid:**
Start with an explicit allowlist, test with production-smoke pages, use report-only first if needed, and keep CSP source lists in code/tests.

**Warning signs:**
Console CSP violations, missing recommendation widgets, no analytics events, blocked images/fonts/scripts.

**Phase to address:**
Security headers and analytics/third-party integration.

---

### Pitfall 4: OAuth Start Routes Prefetch Cross-Origin Redirects

**What goes wrong:**
Next link prefetch hits an internal login-start route that redirects to another origin, causing CORS/preflight noise or broken login behavior.

**Why it happens:**
OAuth redirect endpoints are rendered as ordinary internal `<Link>` navigation.

**How to avoid:**
Use plain anchors or disable prefetch for OAuth-start links; verify production origin and Shopify callback/logout URL allowlist.

**Warning signs:**
Browser console CORS errors on login page before the user clicks sign in.

**Phase to address:**
Account launch gate hardening.

---

### Pitfall 5: Legal Pages Resolve in Shopify Admin but 404 in Headless

**What goes wrong:**
Footer/policy links, `/policies/*`, `/pages/privacy-policy`, or legacy policy URLs fail on the headless app.

**Why it happens:**
Shopify policy pages are not automatically mirrored into custom Next routes.

**How to avoid:**
Add owned routes/redirects and audit every footer/account/checkout policy URL locally and in production.

**Warning signs:**
404s for privacy policy, shipping policy, refund policy, terms, cookie preferences, or old Shopify policy HTML URLs.

**Phase to address:**
Legal/compliance and SEO route coverage.

---

### Pitfall 6: Consent Banner Does Not Control All Trackers

**What goes wrong:**
Pixels or analytics fire before consent defaults or outside the banner's control.

**Why it happens:**
Third-party snippets are loaded independently across components.

**How to avoid:**
Centralize script loading and event dispatch; set Google consent defaults before tags; coordinate Shopify Customer Privacy API if Shopify pixels are used.

**Warning signs:**
Tag Assistant warnings, events before consent, cookie changes before user choice, or Shopify checkout consent mismatch.

**Phase to address:**
Analytics and consent implementation.

---

### Pitfall 7: Health Check Leaks Secrets or Hits Expensive APIs

**What goes wrong:**
Readiness endpoint exposes token presence, customer data, or performs slow live dependency calls on every probe.

**Why it happens:**
Health checks are added late as debugging endpoints.

**How to avoid:**
Return safe status/config presence only, shallow optional dependency checks, and no secret values or PII.

**Warning signs:**
Health JSON includes env values, emails, tokens, raw third-party errors, or slow response times.

**Phase to address:**
Operations and monitoring.

---

### Pitfall 8: Fake Checkout Tests Mistaken for Launch Approval

**What goes wrong:**
Local fake-Shopify e2e passes, but real hosted checkout fails due taxes, shipping, payment mode, identity sync, customer account scopes, or success redirect.

**Why it happens:**
External Shopify admin settings are not owned by the codebase.

**How to avoid:**
Keep fake tests, but require owner-approved Shopify test-mode or refunded real-order evidence before go-live.

**Warning signs:**
Launch checklist says checkout tested but has no Shopify test order evidence.

**Phase to address:**
Checkout and external launch gates.

---

### Pitfall 9: Optimizing Lighthouse by Hiding Real Content

**What goes wrong:**
Performance work improves lab score but removes useful PDP/home content, product imagery, or SEO content.

**Why it happens:**
LCP pressure creates incentives to defer everything.

**How to avoid:**
Optimize the real LCP element, image sizes, priority hints, server response, and component hydration while preserving revenue/SEO content.

**Warning signs:**
Hero/PDP content changes unexpectedly or the page feels empty above the fold.

**Phase to address:**
Performance remediation.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Use `unsafe-inline` broadly | CSP stops breaking scripts | Weak XSS protection and poor audit posture | Only temporary report-only/debugging, never final without rationale. |
| Accept memory rate limiting | No infrastructure dependency | Bypass across serverless instances | Only if provider edge protection is documented and explicit. |
| Leave `pnpm audit` red | Saves upgrade time | Launch blocker and future upgrade pile-up | Never for critical/high; maybe documented dev-only moderate with proof. |
| Manual launch checklist only | Fast documentation | Checks become stale and non-repeatable | Only for owner/admin-gated external steps. |
| Console logs only | Easy debugging | No alerts, aggregation, retention, or owner-visible reliability | Not acceptable for production launch. |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Shopify Customer Account API | Using localhost or mismatched callback URL | Use HTTPS callback/logout URLs in Shopify settings; tunnel for local OAuth. |
| Shopify checkout | Testing without owner approval | Use Bogus Gateway/Shopify Payments test mode or approved refunded real order. |
| Google tags | Loading before consent default | Set default consent state before tags execute. |
| Shopify Customer Privacy API | Banner only updates local cookie | Apply consent decisions to Shopify-managed pixels/checkout where needed. |
| Sentry/logging | Sending PII or tokens in errors | Redact customer/order/token fields and add correlation IDs. |
| Search Console launch | Leaving noindex enabled | Include noindex flip and sitemap submission in launch gate. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Oversized hero/PDP images | LCP > 2.5s | Responsive sizes, correct priority/preload, optimized source dimensions | Immediately on mobile/slow 4G. |
| Heavy third-party scripts in head | Long main-thread work, delayed LCP/INP | Consent-gated lazy loading, minimal critical tags | As soon as analytics/reviews/search widgets are enabled. |
| Cart enrichment fan-out | Slow cart and checkout handoff | Use skinny cart-specific queries/cache and avoid PDP-only fields | Multi-line carts. |
| Sitemap full-catalog fetch | Slow sitemap route/build | Skinny sitemap query and chunking when needed | Catalog growth. |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Missing HSTS/CSP/frame/referrer/content-type headers | XSS/clickjacking/sniffing/referrer leakage | Add tested security header set. |
| Over-broad CSP connect/script sources | Third-party or injection surface too permissive | Inventory hosts and keep least-privilege allowlists. |
| Raw provider error logging | PII/token leakage | Redacted structured logs. |
| Trusting unsanitized forwarded IP headers | Rate-limit bypass | Use trusted platform header or edge protection. |
| Unknown webhook topics ignored silently | Stale content/pricing after admin changes | Log topic and delivery ID; expand coverage for launch-relevant topics. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Policy/legal 404s | Trust and compliance failure | Resolve all policy links and legacy URLs. |
| Mobile text wrap in hero stats | Unpolished first impression | Responsive copy/spacing that prevents awkward word splitting. |
| Duplicate skip links | Screen reader/keyboard noise | Single consistent skip link. |
| Ambiguous form failures | Users cannot recover | WCAG-aligned text errors and live-region notifications. |
| Login page console errors | Trust and QA concern | Prevent OAuth prefetch CORS path. |

## Looks Done But Isn't Checklist

- [ ] **Security headers:** Present on `/`, PDP, cart, account, policy pages, and API routes where applicable.
- [ ] **CSP:** Does not block Next assets, Shopify CDN, Sanity CDN, Searchanise, Trustoo, consent, analytics, or checkout/account flows.
- [ ] **Policies:** `/pages/privacy-policy`, `/pages/shipping-policy`, `/policies/*`, and old Shopify policy HTML URLs route or redirect correctly.
- [ ] **Analytics:** Events are observed in fake tests and approved destinations; consent defaults fire before tags.
- [ ] **Checkout:** Fake e2e plus owner-approved Shopify test evidence exist.
- [ ] **Health:** Endpoint returns safe JSON, no secrets, no PII, useful status.
- [ ] **Noindex:** `DISABLE_INDEXING=false` build emits indexable metadata and non-empty sitemap before launch.
- [ ] **Audit:** Production-readiness script can be rerun from clean checkout.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| CSP blocks third-party script | MEDIUM | Switch to report-only or adjust allowlist, rerun smoke tests, inspect violations. |
| Dependency patch breaks Next/build | MEDIUM-HIGH | Bisect direct dependency updates, use lockfile overrides, run full test/build matrix. |
| Shopify checkout test creates real order | HIGH | Cancel/refund per owner process, verify no fulfillment side effects, update runbook. |
| Noindex remains after launch | HIGH | Flip env, redeploy/rebuild, submit sitemap, request indexing on key URLs. |
| Analytics events missing | MEDIUM | Use Tag Assistant/debug destinations, verify consent state and event adapter payloads. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Known vulnerabilities | Dependency/security hardening | `pnpm audit --audit-level moderate`; no critical/high. |
| Missing security headers | Security headers phase | HTTP probe against production server. |
| OAuth prefetch/CORS | Account launch gate phase | Playwright console/network assertion. |
| Missing policies | Legal/SEO phase | Route status probes and sitemap/footer link checks. |
| Consent drift | Analytics/consent phase | Fake dataLayer/pixel tests and destination debug evidence. |
| Fake-only checkout | External launch gate phase | Owner-approved Shopify test-mode evidence. |
| LCP too slow | Performance phase | Lighthouse/Web Vitals evidence on home/PDP/PLP/cart. |
| No repeatable score | Final audit phase | Score artifact with evidence links and command output. |

## Sources

- OWASP HTTP Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OWASP CSP Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Next.js CSP guide: https://nextjs.org/docs/app/guides/content-security-policy
- Shopify Customer Account API setup: https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started
- Shopify test orders: https://help.shopify.com/en/manual/checkout-settings/test-orders
- Google consent mode: https://developers.google.com/tag-platform/security/guides/consent
- Shopify Customer Privacy API: https://shopify.dev/docs/api/customer-privacy
- Google robots.txt guide: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Google noindex guide: https://developers.google.com/search/docs/crawling-indexing/block-indexing
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C form notifications: https://www.w3.org/WAI/tutorials/forms/notifications/

---
*Pitfalls research for: Teavision v1.4 Production Readiness 100/100*
*Researched: 2026-06-22*
