# Stack Research

**Domain:** Headless Shopify ecommerce production-readiness remediation
**Researched:** 2026-06-22
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version / Target | Purpose | Why Recommended |
|------------|------------------|---------|-----------------|
| Next.js | Upgrade from 16.2.4 to at least 16.2.6; prefer latest compatible 16.x patch | Storefront runtime, App Router, Cache Components, headers, image optimization | Current audit reports multiple high/moderate Next.js advisories patched in 16.2.5/16.2.6. Production launch should not ship known framework security advisories. |
| React | Keep aligned with Next-supported 19.x | UI runtime | React 19.2.4 is already installed; do not create an unrelated framework migration during hardening. |
| Tailwind CSS | Keep Tailwind 4.2.x unless audit fix requires a patch | Design-token utility system | Existing storefront conventions rely on Tailwind 4 tokens and no raw color classes. |
| Shopify Storefront + Customer Account APIs | Existing 2026-04 Storefront API; Customer Account OAuth configured in Shopify Headless/Hydrogen settings | Commerce, cart, checkout handoff, customer account session | Shopify remains source of truth for prices, checkout, taxes, shipping, customer identity, and orders. |
| Next.js `headers()` config | Next 16 docs: `next.config.ts` `async headers()` | Security response headers | Next provides route-wide response header configuration. Local docs are present under `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md`. |
| Next.js CSP guidance | Next 16 App Router CSP guide | Content Security Policy | Nonce CSP can force dynamic rendering and conflict with PPR/static shells, so the first production pass should use a static CSP/report-only ramp unless strict nonce CSP is explicitly required. |

### Supporting Libraries / Services

| Library / Service | Version / Target | Purpose | When to Use |
|-------------------|------------------|---------|-------------|
| Sentry for Next.js or equivalent | Current package compatible with Next 15+/App Router | Error, trace, logs, release tracking | Use if no platform-native observability is already committed; repo currently has no external error tracking dependency. |
| OpenTelemetry | Next instrumentation support or provider SDK | Vendor-neutral traces | Use for server route/action latency and third-party call visibility; Next recommends OpenTelemetry for instrumentation. |
| Vercel Observability / Runtime Logs / Drains / Alerts | Deployment-plan dependent | Runtime logs, dashboards, log forwarding, alerts | Use if production hosting is Vercel as earlier project docs recommend. Otherwise map equivalent capabilities in the chosen host. |
| Google Tag / GTM Consent Mode | Current Google Tag Platform consent mode | Consent-aware analytics and ads tags | Use before GA4/GTM/Ads tags read or store user data. Default consent state must be set before tags fire. |
| GA4 ecommerce events | Current GA4 recommended ecommerce events | Product/search/cart/checkout/purchase analytics | Use the recommended event names and `items` array model so reports populate correctly. |
| Shopify Customer Privacy API | Browser API from Shopify | Sync consent to Shopify-managed pixels, audiences, and checkout surfaces | Use when Shopify pixels or customer privacy settings are active and a headless banner must coordinate with Shopify. |
| Playwright + Lighthouse | Existing dependencies | Production-smoke and page-performance gates | Keep, but fix local e2e port/server lifecycle and add launch audit scripts so readiness is repeatable. |

### Development / Verification Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `pnpm audit --audit-level moderate` | Dependency gate | Current state: 45 advisories: 10 low, 18 moderate, 16 high, 1 critical. A 100/100 milestone requires zero critical/high and no launch-relevant moderate findings. |
| Lighthouse CLI | Performance, accessibility, SEO, best-practices evidence | Current audit showed home LCP 4.6s and PDP LCP 6.0s. Target should be LCP <= 2.5s lab for representative pages, with page-specific budgets documented. |
| Playwright | Browser smoke/e2e coverage | Fix current port conflict and validate account login links do not prefetch/cross-origin-fail, cart-to-checkout handoff, legal routes, consent, analytics stubs, and headers. |
| Header probe script | Security header regression test | Assert CSP, HSTS, X-Frame-Options or `frame-ancestors`, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP/CORP where applicable, and no `x-powered-by`. |
| Rich Results / structured data validation | SEO validation | Use Google tools on representative production/staging URLs after noindex launch gate is flipped. |

## Installation / Upgrade Direction

```bash
# First implementation phase should determine exact patch set from lockfile.
pnpm up next eslint-config-next @storybook/nextjs-vite
pnpm up @graphql-codegen/cli next-sanity sanity storybook vite vitest lighthouse
pnpm audit --audit-level moderate
```

Add observability/analytics packages only after choosing the provider and consent model:

```bash
# Example only; choose provider during implementation.
pnpm add @sentry/nextjs
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Static/report-only CSP first | Full nonce CSP from day one | Use nonce CSP only if compliance requires it and the team accepts dynamic-rendering/PPR trade-offs. |
| Sentry or platform observability | Console logs only | Console-only is not enough for launch because alerting, release correlation, and error aggregation are missing. |
| Consent-aware first-party analytics wrapper | Direct GTM snippets scattered in components | Direct snippets are faster to add but create consent drift, CSP sprawl, and hard-to-test ecommerce events. |
| Shopify-hosted checkout test order | Fake-only checkout tests | Fake tests remain valuable, but production readiness needs owner-approved Shopify test-mode or refunded real-order evidence. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Shipping with known critical/high advisories | Audit score cannot reach 100/100 while known exploitable dependencies remain. | Patch, override, or remove vulnerable dependency paths. |
| Next OAuth-start route rendered through default prefetching `<Link>` | Local audit observed CORS noise because the internal login start route redirects cross-origin during prefetch. | Use plain `<a>` or `prefetch={false}` for OAuth-start routes. |
| Blanket `unsafe-inline` CSP in production | Weakens the main value of CSP and masks third-party script inventory. | Static allowlisted CSP, report-only ramp, and nonce/SRI where required. |
| In-memory rate limiting as the only production abuse control | Serverless/multi-instance deployments reset and do not coordinate counters. | External/provider protection or durable KV/Redis limiter, with explicit fail-closed behavior. |
| Analytics before consent defaults | Tags can read consent state too late or set storage before consent. | Initialize consent defaults before loading analytics/ads pixels. |
| Noindex left enabled at launch | Organic pages remain excluded from search. | Launch gate checklist that flips `DISABLE_INDEXING=false` only when SEO checks pass. |

## Version Compatibility

| Package / Surface | Compatible With | Notes |
|-------------------|-----------------|-------|
| `next@16.2.4` | Not production-ready per audit | Multiple advisories patched in `>=16.2.5` and one in `>=16.2.6`; use at least `16.2.6`. |
| `eslint-config-next@16.2.4` | Should track Next patch | Keep aligned with the Next runtime patch. |
| `next-sanity` / `sanity` | Needs audit-driven patching | Current transitive advisories include `form-data`, `undici`, `dompurify`, `js-yaml`, `uuid`. |
| `@graphql-codegen/cli` | Needs audit-driven patching | Critical `shell-quote` path is from codegen CLI. |
| Storybook/Vite/Vitest | Needs audit-driven patching | Current high Vite/ws/undici advisories are mostly dev-tool paths, but 100/100 requires clean policy or documented non-runtime exception. |

## Sources

- OWASP HTTP Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OWASP Content Security Policy Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- Next.js headers docs: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
- Next.js CSP guide: https://nextjs.org/docs/app/guides/content-security-policy
- Next.js OpenTelemetry guide: https://nextjs.org/docs/app/guides/open-telemetry
- Sentry Next.js docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Vercel Observability: https://vercel.com/docs/observability
- Vercel Runtime Logs: https://vercel.com/docs/logs/runtime
- Vercel Drains: https://vercel.com/docs/drains
- Google consent mode: https://developers.google.com/tag-platform/security/guides/consent
- GA4 ecommerce events: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- Shopify Customer Privacy API: https://shopify.dev/docs/api/customer-privacy
- Shopify Customer Account API setup: https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/getting-started

---
*Stack research for: Teavision v1.4 Production Readiness 100/100*
*Researched: 2026-06-22*
