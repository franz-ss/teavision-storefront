# Phase 17: Operations, Performance, and Final Production-Readiness Audit - Research

**Researched:** 2026-06-23
**Status:** Complete
**Confidence:** High

## RESEARCH COMPLETE

## Executive Summary

Phase 17 should be planned as five connected launch-readiness workstreams:

1. Safe public health plus private/deep readiness evidence.
2. Observability and redacted logging at revenue and provider boundaries.
3. Production-like local e2e against fake Shopify and fake Customer Account providers.
4. Lighthouse/Core Web Vitals plus UX/accessibility launch polish evidence.
5. A final readiness audit script and report that separates automated code readiness from owner-gated Shopify/admin launch proof.

The key planning constraint is that "ready to launch" cannot mean "automated tests clicked real Shopify checkout." Owner approval remains mandatory for hosted checkout, payment, shipping, tax, order creation, success redirect, live Customer Account OAuth, protected customer data, B2B pricing, and Search Console proof. Automated code readiness can reach 100/100, but those owner/admin gates must be recorded as approved, pending, or owner-blocked.

## Current Codebase Findings

### Existing Assets To Reuse

- `playwright.config.ts` starts fake Shopify and a Next app, but the app command is `corepack pnpm exec next dev -p ${PORT}`. Phase 17 must add a production-like path using `next build`/`next start` or a dedicated Playwright project/config so `QA-01` does not depend on a dev server.
- `tests/mocks/run-fake-shopify-server.ts`, `tests/mocks/shopify-graphql-server.ts`, and `tests/mocks/customer-account-api-server.ts` already provide safe fake-provider boundaries.
- `tests/e2e/cart-checkout.spec.ts` covers cart mutation, fake checkout handoff, signed-in buyer identity sync, and prevents navigation to hosted Shopify checkout.
- `tests/e2e/consent.spec.ts` covers consent UI and local storage behavior from Phase 16.
- `scripts/security/probe-production-security.mjs` already checks production security headers across representative routes and exits non-zero on failures.
- `scripts/seo/probe-launch-seo.mjs` already checks disabled/enabled indexing, redirects, sitemap, canonicals, noindex, structured data, and runbook evidence.
- `docs/testing/customer-accounts-setup.md`, `docs/testing/cart-checkout-uat.md`, and `docs/launch/analytics-and-indexing-runbook.md` already capture owner-gated launch proof areas.

### Missing Operational Boundaries

- No `src/instrumentation.ts` or root `instrumentation.ts` exists yet.
- `package.json` has no Sentry package.
- There is no shared server logging/redaction helper. Current logging is scattered through `console.warn`, `console.error`, route error boundaries, contact actions, Trustoo, HulkApps fallback, and provider clients.
- No public health/readiness route exists.
- No deep readiness script currently aggregates env, Shopify/Sanity/Searchanise/Customer Account config, security headers, SEO/indexing, analytics mode, production e2e, and owner-gated launch states.
- No final readiness report source of truth exists.

## External Guidance Checked

- Local Next.js 16 docs confirm App Router route handlers use the Web `Request`/`Response` APIs, default `GET` handler caching changed in v15, and dynamic route handler `params` are promises. A health route can be implemented as `src/app/api/health/route.ts` with explicit safe headers and `runtime = 'nodejs'` if server env checks are needed.
- Local Next.js 16 docs confirm `instrumentation.ts` belongs at project root or inside `src` when a project uses `src`, and `onRequestError` can capture server errors for render, route, action, and proxy contexts.
- Next.js OpenTelemetry docs recommend `@vercel/otel` for provider-neutral instrumentation; Sentry's Next.js manual setup covers Next.js 15+ App Router/Turbopack and Sentry config files. For this project, a Sentry-style setup is acceptable, but the plan should keep provider-specific code behind a small telemetry boundary so it can map to Vercel/OTel if Sentry is not the final provider.
- Vercel Observability docs confirm the production host can provide runtime logs and observability events, while longer retention or external routing may need log drains.
- Shopify docs confirm Storefront Cart API returns a checkout URL for handoff and Shopify help docs confirm test orders require Bogus Gateway or Shopify Payments test mode. This supports the Phase 17 boundary: local tests stop at fake checkout URL; real checkout/payment/order proof stays owner-approved.
- Web Vitals guidance confirms good thresholds: LCP at or below 2.5s, CLS at or below 0.1, and INP at or below 200ms. Lighthouse can run from CLI/Node and should produce artifacts rather than relying on one-off screenshots.

## Architecture Recommendations

### 1. Health and Deep Readiness

Use a two-tier model:

- Public route: `src/app/api/health/route.ts`
  - Returns only safe fields: `status`, `service`, `release`, `timestamp`.
  - Does not expose provider names, env names, secrets, customer data, raw errors, or diagnostics.
  - Should not perform live provider writes or expensive reads.
- Deep readiness script: `scripts/launch/probe-readiness.mjs`
  - Runs locally/operator-side.
  - Verifies production-required env, Shopify Storefront config, Customer Account config, Sanity config/read path, Searchanise config/read path when enabled, analytics/indexing gates, security headers, SEO probes, and production e2e command status.
  - Emits a markdown/JSON-safe table and exits non-zero only on automated launch blockers.
  - Records owner-gated proof states as `approved`, `pending`, or `owner-blocked`, not as code failures.

### 2. Observability and Logging

Add a typed server observability boundary:

- `src/instrumentation.ts`
  - Registers Sentry/OTel only when configured.
  - Exports `onRequestError` and forwards redacted route/action/render error context.
- `src/lib/observability/logger.ts`
  - Exports event levels and typed event names.
  - Uses a redaction helper before sending anything to `console`, Sentry, or another sink.
- `src/lib/observability/redact.ts`
  - Redacts tokens/secrets, cookies, names, emails, phones, addresses, checkout URLs with sensitive params, raw provider payloads, message bodies, cart IDs unless hashed, and order IDs unless owner-approved.
- Call sites:
  - `src/app/(storefront)/cart/checkout/route.ts`
  - `src/lib/cart/actions.ts`
  - `src/lib/shopify/client.ts`
  - `src/lib/shopify/customer-account/client.ts`
  - `src/lib/shopify/customer-account/oauth.ts`
  - `src/lib/searchanise/search.ts`
  - `src/lib/reviews/trustoo.ts`
  - `src/lib/shopify/operations/product.ts` HulkApps fallback
  - `src/lib/contact/actions.ts`
  - `src/app/api/webhooks/shopify/route.ts`
  - `src/app/api/webhooks/sanity/route.ts`
  - root and segment `error.tsx` client boundaries can keep console output, but server errors should be captured through instrumentation.

Expected optional-provider degradations should log warnings. Revenue-critical failures should log errors: checkout handoff, cart buyer identity sync, account OAuth/session, provider writes, and route/action failures.

### 3. Production-Like E2E

Keep the existing default `pnpm test:e2e` behavior if useful, but add a production-like final path:

- `playwright.production.config.ts` or a second Playwright project using `webServer` commands:
  - fake Shopify server
  - fake Customer Account API server if needed
  - `corepack pnpm exec next build`
  - `corepack pnpm exec next start -p ${PORT}`
- A new command such as `pnpm test:e2e:production`.
- E2E files should prove cart-to-checkout handoff, signed-in buyer identity path, account bridge, consent smoke, and route smoke without real Shopify hosted checkout.

### 4. Performance and UX Evidence

Add a launch audit script rather than a manual-only checklist:

- `scripts/performance/probe-lighthouse.mjs`
  - Runs mobile Lighthouse against representative routes.
  - Emits JSON/markdown artifacts under `docs/launch/performance-evidence.md` or `.planning/evidence/`.
  - Uses practical gates: home and PDP no launch-blocking LCP regression; target LCP <= 2500ms where local/staging data is reliable; CLS <= 0.1; INP/TBT acceptable; misses documented with mitigation.
- Representative URLs:
  - `/`
  - `/products/test-standard-tea` for fake e2e or an owner-approved PDP path for staged/real data
  - `/collections/all`
  - one high-value collection
  - `/cart`
  - `/search?q=tea`
  - `/account` or account login/dashboard fake path
  - policy/static landing pages from Phase 16

UX polish should specifically test and document mobile text wrapping and duplicate skip-link issues, using Storybook/Playwright/a11y assertions where possible.

### 5. Final Readiness Audit

Create one source of truth:

- `scripts/launch/run-final-readiness-audit.mjs`
  - Orchestrates `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, `pnpm test:stories`, `pnpm test:contracts`, `pnpm test:security`, `pnpm audit --audit-level moderate`, `pnpm test:e2e:production`, SEO probe modes, readiness probe, performance probe, and browser smoke.
  - Supports `--skip-owner-gated` or `--evidence-file` so owner/admin evidence is read, not invented.
  - Writes `docs/launch/final-production-readiness-report.md`.
- `docs/launch/final-production-readiness-report.md`
  - Separates automated code readiness score from owner-gated launch gates.
  - Includes command, date, environment, commit/release id, result, evidence link, and owner/verifier.

## Validation Architecture

Phase 17 needs layered validation because no single test suite can prove launch readiness:

| Layer | Purpose | Candidate Command |
| --- | --- | --- |
| Unit | Redaction, logger, readiness parsing, evidence scoring, env checks | `pnpm test:unit -- src/lib/observability src/lib/readiness scripts/launch/*.test.mjs` |
| Integration | Route handlers and Server Action boundaries | `pnpm test:integration` |
| Contracts | Security headers, rate-limit, production boundaries, final audit source checks | `pnpm test:contracts` |
| E2E | Fake Shopify and fake Customer Account browser flows | `pnpm test:e2e:production` |
| Security/SEO | Phase 15 and Phase 16 inherited launch probes | `pnpm test:security` and `node scripts/seo/probe-launch-seo.mjs --mode runbook` |
| Performance | Mobile Lighthouse/Web Vitals launch representatives | `node scripts/performance/probe-lighthouse.mjs --start-server --base-url http://127.0.0.1:4173` |
| Final Audit | Aggregated readiness score and owner-gated table | `node scripts/launch/run-final-readiness-audit.mjs` |

Nyquist sampling rule for execution:

- After every task that modifies a helper, run its nearest unit test.
- After every task that modifies a route/action/provider boundary, run unit plus relevant integration tests.
- After every task that modifies Playwright or launch scripts, run the narrow script/test directly.
- After every wave, run `pnpm lint`, `pnpm typecheck`, and the wave-owned test commands.
- Before verification, run the final audit command or document why a provider/owner gate blocks only owner evidence, not code readiness.

## Risks and Pitfalls

- Public health routes can accidentally expose env names, provider names, secrets, or raw errors. Keep the route intentionally shallow.
- Sentry/observability setup can leak PII if breadcrumbs and event extras are not redacted before capture.
- Console logging raw provider errors can leak tokens, checkout URLs, message bodies, emails, phones, addresses, cart IDs, or order IDs.
- A Playwright `next dev` server is not sufficient for launch readiness because build/start differences can hide production issues.
- Lighthouse local runs can be noisy. Treat them as evidence and regression detection, not a theatrical perfect-score exercise.
- Owner-gated Shopify proof must be honest. Do not mark live checkout/payment/order/OAuth/B2B/Search Console proof as passed without dated owner approval and test context.

## Recommended Plan Breakdown

1. Health/readiness endpoint and deep readiness probe.
2. Observability, Sentry/OTel setup, and redacted logging at revenue/provider boundaries.
3. Production-like fake-provider e2e lifecycle.
4. Performance and UX/accessibility launch evidence.
5. Final readiness audit report and owner-gated launch matrix.

## Sources

- Next.js local docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`
- Next.js local docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md`
- Next.js local docs: `node_modules/next/dist/docs/01-app/02-guides/open-telemetry.md`
- Next.js local docs: `node_modules/next/dist/docs/01-app/02-guides/production-checklist.md`
- Sentry Next.js manual setup: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
- Vercel Observability: https://vercel.com/docs/observability
- Vercel Runtime Logs: https://vercel.com/docs/logs/runtime
- Shopify test orders: https://help.shopify.com/en/manual/checkout-settings/test-orders
- Shopify Storefront Cart API: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- Web Vitals thresholds: https://web.dev/articles/vitals
- Lighthouse overview: https://developer.chrome.com/docs/lighthouse/overview
