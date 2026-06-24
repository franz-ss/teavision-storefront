# Architecture Research

**Domain:** Headless Shopify production-readiness hardening
**Researched:** 2026-06-22
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
Browser
  |
  |-- Storefront pages (RSC + focused client leaves)
  |-- Consent banner / analytics adapter
  |-- Account OAuth links (no prefetch)
  |
Next.js App Router
  |
  |-- Security headers from next.config.ts
  |-- Policy/legal routes and legacy redirects
  |-- Health/readiness route handlers
  |-- Server Actions and route handlers
  |-- Analytics event adapter / server-side event route if needed
  |-- Observability instrumentation and redacted logging
  |
External systems
  |
  |-- Shopify Storefront API / hosted checkout / Customer Account API
  |-- Shopify Customer Privacy API / pixels / policies
  |-- Sanity
  |-- Searchanise / Trustoo / HulkApps / Resend
  |-- Observability backend / deployment platform
  |-- GA4 / GTM / Meta / Klaviyo
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Security headers module | Single source for production header values and tests | Constants used by `next.config.ts` headers and header probe tests. |
| CSP inventory | Track allowed script/connect/image/frame origins | Markdown/runbook plus tests to detect missing or overly broad directives. |
| Account login links | Route users to Shopify-hosted Customer Account OAuth | Use plain anchor or Link with `prefetch={false}` for redirecting OAuth-start routes. |
| Policy route layer | Serve privacy/terms/shipping/return/cookie pages and redirects | Static app routes or Shopify page-backed routes with redirect mappings for old policy URLs. |
| Consent and analytics adapter | Gate third-party scripts and emit typed ecommerce events | Client leaf that initializes consent defaults before tag loading; test with fake destinations. |
| Health/readiness handlers | Report deploy readiness and shallow dependency config | `/api/health` or `/healthz` JSON; avoid exposing secrets; include env/config presence only. |
| Observability instrumentation | Capture errors, performance spans, logs, release metadata | Sentry/OTel/Vercel instrumentation with PII redaction and route/action context. |
| Launch audit command | Repeatable 100/100 evidence | Script/README sequence that runs build, tests, probes, Lighthouse, and owner-gated checklist. |

## Recommended Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── health/route.ts              # readiness/health JSON
│   │   └── analytics/route.ts           # optional server-side event ingestion
│   └── (storefront)/
│       ├── pages/privacy-policy/        # missing legal route coverage
│       ├── pages/shipping-policy/
│       └── pages/returns-refunds/
├── components/
│   └── analytics/                       # consent banner / client event bridge if reusable
├── lib/
│   ├── analytics/                       # typed ecommerce events and provider adapters
│   ├── observability/                   # logger, redaction, provider init helpers
│   ├── security/                        # header constants and CSP policy builder
│   ├── seo/                             # route/sitemap/noindex/redirect helpers
│   └── launch/                          # readiness checklist helpers if implemented
docs/
├── launch-readiness.md                  # operational runbook
└── testing/
    └── production-readiness-audit.md    # repeatable audit steps/results
scripts/
└── production-readiness-audit.mjs       # optional probe orchestrator
```

### Structure Rationale

- **`lib/security/`:** avoids scattering header strings through `next.config.ts` and tests.
- **`lib/analytics/`:** keeps events typed and consent-aware; avoids ad hoc `dataLayer.push()` calls in product/cart code.
- **`lib/observability/`:** creates a PII-redacted logging boundary for public forms, Shopify/third-party failures, and checkout redirects.
- **`docs/launch-readiness.md`:** owner/admin-gated steps need a durable artifact because not everything can be automated.

## Architectural Patterns

### Pattern 1: Centralized Header Policy

**What:** Define a production header set once, apply globally through `next.config.ts`, and assert in HTTP probes.
**When to use:** Any launch hardening phase touching CSP, HSTS, frame protection, referrer policy, permissions policy, or X-Content-Type-Options.
**Trade-offs:** Static CSP is easier to preserve caching, but less strict than nonce-based CSP.

### Pattern 2: Consent-First Analytics Adapter

**What:** Initialize consent defaults before loading tags, then route commerce events through typed local helpers.
**When to use:** GA4/GTM/Meta/Klaviyo or Shopify pixels on a headless storefront.
**Trade-offs:** More upfront plumbing, but prevents untestable tracking sprawl and helps CSP stay understandable.

### Pattern 3: Operational Readiness as Code + Runbook

**What:** Automate what can be measured and document owner/admin-gated checks with evidence fields.
**When to use:** Production launch readiness, especially checkout/payment/customer-data tests.
**Trade-offs:** Some "100/100" criteria still depend on external setup; the artifact should distinguish code-complete from owner-blocked.

### Pattern 4: Redacted Structured Logs

**What:** Log event type, route, provider, status/code, latency, and correlation ID, but not customer names, emails, addresses, tokens, or submitted message bodies.
**When to use:** Contact forms, newsletter, account sessions, webhooks, Shopify/customer APIs, checkout redirects.
**Trade-offs:** Less raw debugging detail, but safer for privacy and monitoring.

## Key Data Flows

1. **OAuth login:** User clicks account sign-in -> non-prefetched login-start anchor -> server constructs Shopify authorization URL -> browser redirects to Shopify -> callback exchanges code -> HttpOnly session -> protected account route.
2. **Consent and analytics:** Page loads -> consent defaults set -> consent banner reads/writes preferences -> allowed tags load -> product/cart/search/checkout events emit typed payloads -> fake adapters verify in CI; real destinations verified in staging/production.
3. **Checkout handoff:** Cart page/checkout route -> signed-in buyer identity sync if present -> Shopify checkout URL -> hosted checkout -> payment/tax/shipping/order/success redirect verified only under approved Shopify testing mode.
4. **Launch audit:** Build/tests -> HTTP route probes -> header/security probes -> policy route probes -> Lighthouse -> Playwright production smoke -> dependency audit -> owner-gated checklist -> score artifact.
5. **Observability:** Route/action/provider failure -> redacted logger/Sentry span -> alert/dashboard -> runbook triage.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Pre-launch/staging | Fake providers, deterministic Playwright, report-only CSP, manual owner sign-off checklist. |
| Launch traffic | Real monitoring and alerts, noindex flipped, sitemap submitted, checkout/payment verified, rollback documented. |
| Post-launch growth | Durable rate limiting, synthetic monitors, Search Console/revenue dashboards, scheduled dependency audits. |

## Anti-Patterns

### Anti-Pattern 1: Header Strings Only in Documentation

**What people do:** Say "add security headers" in a checklist but never assert them in production.
**Why it's wrong:** Headers regress quietly.
**Do this instead:** Add HTTP probes that fail when headers are missing or weakened.

### Anti-Pattern 2: Treating Legal Pages as CMS Afterthoughts

**What people do:** Footer links or old Shopify policy URLs 404 on the headless site.
**Why it's wrong:** Users and auditors treat policy routes as launch basics.
**Do this instead:** Own route/redirect coverage and require owner/legal review of content.

### Anti-Pattern 3: Analytics Before Consent

**What people do:** Load GTM/GA/Meta scripts first, add a banner later.
**Why it's wrong:** Default consent can be read too late; CSP and privacy behavior drift.
**Do this instead:** Consent defaults first, then provider loading and event dispatch.

### Anti-Pattern 4: Owner-Gated Tests Hidden in "Done"

**What people do:** Mark checkout/payment/tax tests done based on local fakes.
**Why it's wrong:** Shopify hosted checkout and payment settings are external and can fail after fake tests pass.
**Do this instead:** Separate local/fake pass from owner-approved Shopify test-mode evidence.

## Integration Points

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Shopify Customer Account API | HTTPS callback/logout URLs configured in Shopify Headless/Hydrogen settings | Web callback URLs must use HTTPS; local testing needs a tunnel. |
| Shopify checkout/payments | Test orders through Bogus Gateway or Shopify Payments test mode | Do not run real payment/order tests without owner approval. |
| Shopify Customer Privacy API | Browser consent API for Shopify-managed pixels/checkout | Needed if Shopify privacy settings/pixels are active in headless context. |
| GA4/GTM | Consent-aware tag load and recommended ecommerce events | Verify dataLayer/event payloads locally; verify real receipts in staging/production. |
| Meta/Klaviyo | Optional browser/server events | Use after consent/privacy model and marketing destinations are confirmed. |
| Observability provider | Next instrumentation/Sentry SDK/Vercel logs/drains | Must capture app errors, route/action failures, and release metadata. |
| Search Console | Sitemap submission and coverage monitoring | Launch runbook should include noindex flip, sitemap submission, 404 monitoring. |

## Sources

- Next.js local docs: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md`
- Next.js local docs: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`
- Next.js local docs: `node_modules/next/dist/docs/01-app/02-guides/open-telemetry.md`
- Shopify Customer Account API setup: https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started
- Shopify Customer Account authentication: https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/authenticate-customers
- Shopify Customer Privacy API: https://shopify.dev/docs/api/customer-privacy
- Shopify test orders: https://help.shopify.com/en/manual/checkout-settings/test-orders
- Google Consent Mode: https://developers.google.com/tag-platform/security/guides/consent
- Vercel Observability: https://vercel.com/docs/observability
- Sentry Next.js docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/

---
*Architecture research for: Teavision v1.4 Production Readiness 100/100*
*Researched: 2026-06-22*
