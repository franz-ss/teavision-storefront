# Phase 15 Runtime Security Evidence

## Requirement Coverage

| Requirement | Status | Evidence |
|-------------|--------|----------|
| SEC-01 | Complete | `pnpm audit --audit-level high` exits 0. `pnpm audit --audit-level moderate` reports only 1 low and 4 moderate residuals documented in `15-DEPENDENCY-AUDIT.md`. |
| SEC-02 | Complete | Built local production probe passed for storefront, collection, cart, account, contact, and API routes with required security headers and no `x-powered-by`. |
| SEC-03 | Complete | CSP is staged as `Content-Security-Policy-Report-Only`; no enforced `Content-Security-Policy` header is emitted in Phase 15. |
| SEC-04 | Complete for local/fake proof; live proof owner-gated | Direct `/account/login/start` buttons use `prefetch={false}`. Integration/e2e tests cover fake/local account paths and cart checkout handoff. Live Shopify Customer Account OAuth remains owner/admin-gated. |
| SEC-05 | Complete | Production rate limiting fails closed unless explicit provider protection or trusted-header memory fallback is configured. Contact, wholesale, custom blend, NPD order, newsletter, and search suggestions have automated coverage. |

## Automated Verification

| Command | Exit | Evidence |
|---------|------|----------|
| `pnpm audit --audit-level moderate` | 1 | Expected residual: 5 vulnerabilities, 1 low and 4 moderate; 0 critical and 0 high. |
| `pnpm audit --audit-level high` | 0 | Passed launch-blocker threshold; output still reports only 1 low and 4 moderate. |
| `pnpm lint` | 0 | Tailwind class check and ESLint passed. |
| `pnpm typecheck` | 0 | `tsc --noEmit` passed. |
| `pnpm build` | 0 | Next.js 16.2.9 production build passed with Cache Components enabled and 75 static pages generated. |
| `pnpm test:unit` | 0 | 51 files, 200 tests passed. |
| `pnpm test:integration` | 0 | 9 files, 43 tests passed. |
| `pnpm test:contracts` | 0 | 38 Node contract subtests passed. |
| `pnpm test:e2e` | 0 | 4 fake-Shopify Playwright tests passed; tests stop at fake checkout handoff. |
| `node scripts/security/probe-production-security.mjs http://127.0.0.1:4316` | 0 | Built local production response probe passed on all representative routes. |

## Production Response Probe

Probe environment:

- Built with `pnpm build`, served with `pnpm exec next start -p 4316`.
- Customer Account env used local callback/logout URLs for the probe: `http://127.0.0.1:4316/account/callback` and `http://127.0.0.1:4316/account/login`.
- Rate-limit memory fallback was explicitly enabled for the local probe with `RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true` and `RATE_LIMIT_TRUSTED_IP_HEADER=x-forwarded-for`.
- Shopify Storefront test endpoint mode was not used with `next start` because production runtime rejects local Storefront test endpoints by design; the probe did not initiate hosted checkout or live Customer Account OAuth.

| Route | Status | Headers | Result |
| --- | ---: | --- | --- |
| / | 200 | required headers present | PASS |
| /collections/all | 200 | required headers present | PASS |
| /cart | 200 | required headers present | PASS |
| /account | 200 | required headers present | PASS |
| /account/login | 200 | required headers present | PASS |
| /pages/contact | 200 | required headers present | PASS |
| /api/search/suggestions?q=tea | 200 | required headers present | PASS |

Header assertions:

- `x-powered-by` absent.
- `strict-transport-security` present.
- `x-content-type-options` equals `nosniff`.
- `referrer-policy` equals `strict-origin-when-cross-origin`.
- `permissions-policy` present.
- `x-frame-options` equals `SAMEORIGIN`.
- `content-security-policy-report-only` present.
- Enforced `content-security-policy` absent.

## Dependency Audit

See `15-DEPENDENCY-AUDIT.md` for baseline, remediation, residual rationale, and final command evidence.

Final counts:

| Severity | Count | Runtime launch blocker |
|----------|------:|------------------------|
| Critical | 0 | No |
| High | 0 | No |
| Moderate | 4 | No; residuals are documented as tooling paths. |
| Low | 1 | No |

Residual packages remain in Sanity CLI/tooling, ESLint config tooling, and Lighthouse/Sentry audit tooling paths. The runtime-adjacent `resend -> svix -> uuid` path was removed by upgrading `resend` to `6.14.0`.

## Security Headers and CSP

Global headers are applied from `next.config.ts` via `headers()` and the centralized `src/lib/security/headers.ts` helper.

Required headers:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy-Report-Only`

CSP mode: `report-only`.

Current allowlist domains and schemes:

- `self`
- `blob:`
- `data:`
- `https://cdn.shopify.com`
- `https://www.teavision.com.au`
- `https://cdn.sanity.io`
- `https://searchserverapi.com`
- `https://searchserverapi1.com`
- `https://api.trustoo.io`
- `https://*.myshopify.com`
- `https://*.shopify.com`
- `https://maps.google.com`

Phase 15 intentionally does not pre-allow GA4, GTM, Meta, Klaviyo, or Shopify pixels; those decisions belong to Phase 16.

## Account OAuth Evidence

Automated local/fake proof:

- `LoginPanel` and `LegacyBridge` direct Shopify sign-in buttons pass `prefetch={false}` for `/account/login/start` links.
- `login/start/route.test.ts` covers localhost canonicalization and forwarded `x-forwarded-host`/`x-forwarded-proto` behavior without calling live Shopify OAuth.
- `callback` and `logout` route tests run against fake/local Customer Account endpoints.
- `pnpm test:e2e` covers header/footer account links, legacy account bridge routes, and cart buyer-identity checkout handoff using fake Shopify data.

Live proof:

- Live Shopify Customer Account OAuth was not executed in Phase 15.
- Owner/admin approval, configured callback URL, configured logout URL, tester, date, store/admin context, and pass/fail result must be recorded before claiming live OAuth proof.

## Abuse-Control Evidence

Production posture:

- `checkRateLimit()` returns a limited result in production unless rate limiting is explicit.
- `RATE_LIMIT_EXTERNAL_PROTECTION=true` accepts provider/CDN/WAF protection.
- `RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true` requires `RATE_LIMIT_TRUSTED_IP_HEADER`.
- Accepted trusted headers are `x-forwarded-for`, `x-real-ip`, and `cf-connecting-ip`.

Covered public surfaces:

- Contact enquiries.
- Wholesale account requests.
- Custom tea blend enquiries.
- New product development order form.
- Newsletter signup.
- `/api/search/suggestions`.

Diagnostics:

- Touched Resend provider failure paths log only structured `{ surface, status }` records.
- Submitted names, emails, phone numbers, message bodies, request headers, tokens, and provider payload objects are not logged by touched paths.

## Owner-Gated Items

- Live Shopify Customer Account OAuth remains blocked until owner/admin approval and Shopify admin callback/logout URL configuration are recorded.
- Shopify hosted checkout, payment, shipping-rate, tax, order creation, success redirect, protected customer data, and B2B pricing tests remain Phase 17 owner-gated.
- Phase 15 e2e tests stop at fake checkout handoff and do not load hosted Shopify checkout.

## Commands Run

| Command | Status |
|---------|--------|
| `node scripts/security/probe-production-security.mjs` without a base URL | Passed expected usage failure. |
| `pnpm audit --audit-level moderate` | Exit 1; residual 1 low and 4 moderate, no high/critical. |
| `pnpm audit --audit-level high` | Exit 0. |
| `pnpm lint` | Exit 0. |
| `pnpm typecheck` | Exit 0. |
| `pnpm build` | Exit 0. |
| `pnpm test:unit` | Exit 0. |
| `pnpm test:integration` | Exit 0. |
| `pnpm test:contracts` | Exit 0. |
| `pnpm test:e2e` | Exit 0. |
| `node scripts/security/probe-production-security.mjs http://127.0.0.1:4316` | Exit 0. |
