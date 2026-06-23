# Operations Launch Runbook

This runbook is the operator-facing launch watch for the Next.js storefront.
It covers automated readiness checks, first response, rollback, reversible
environment gates, owner approval gates, and week-one monitoring. Real hosted
checkout/payment/order testing requires store-owner approval before execution.

## Launch Watch

Monitor these launch-critical signals during cutover and the first operating
window. Use Sentry issues/events for app error tracking, Vercel deployment and
runtime logs for launch-day triage, and the private readiness probe for local
documentation/config evidence.

| Signal | Source | Severity | First responder | Escalation |
| --- | --- | --- | --- | --- |
| deploy failure | Vercel deployment status and build logs | Critical | Engineering owner | Roll back or redeploy after env/build fix |
| `/api/health` failure | Vercel runtime logs, production health probe, `/api/health` response | Critical | Engineering owner | Roll back if the current deployment caused the failure |
| checkout handoff errors | Sentry, Vercel runtime logs, `checkout_handoff_failed` events | Critical | Engineering owner | Store owner if customer checkout is blocked |
| cart buyer identity sync failures | Sentry, Vercel runtime logs, `cart_buyer_identity_sync_failed` events | Critical | Engineering owner | Store owner if signed-in checkout is blocked |
| account/OAuth errors | Sentry, Vercel runtime logs, `account_oauth_failed` and `customer_account_failed` events | High | Engineering owner | Store owner for Shopify Customer Account admin/config evidence |
| Shopify Storefront API failures | Sentry, Vercel runtime logs, `shopify_storefront_failed` events | Critical | Engineering owner | Store owner if catalog/cart reads are unavailable |
| Customer Account API failures | Sentry, Vercel runtime logs, `customer_account_failed` events | High | Engineering owner | Store owner if account access or protected data scope is blocked |
| Sanity failures | Sentry, Vercel runtime logs, `sanity_failed` or `sanity_webhook_rejected` events | Medium | Engineering owner | Content owner if editorial publishing is blocked |
| Searchanise failures | Sentry, Vercel runtime logs, `searchanise_failed` events | Medium | Engineering owner | Disable/degrade search features if product discovery is affected |
| Trustoo/HulkApps degradations | Sentry, Vercel runtime logs, `trustoo_failed` and `hulkapps_failed` events | Medium | Engineering owner | Store owner if pricing/review parity becomes launch-blocking |
| contact/newsletter/NPD/wholesale provider failures | Sentry, Vercel runtime logs, `contact_provider_failed` events | Medium | Engineering owner | Store owner if lead capture is unavailable |
| webhook rejected events | Sentry, Vercel runtime logs, `shopify_webhook_rejected` and `sanity_webhook_rejected` events | High | Engineering owner | Rotate/reconfigure secrets if signatures or HMAC validation fail |
| elevated server route/action errors | Sentry issues, Vercel runtime logs, Next `onRequestError`, `route_action_failed` events | High | Engineering owner | Roll back if the issue is release-correlated |

Vercel runtime logs are acceptable for launch-day triage. For longer retention,
alert routing, or cross-provider analysis, configure Sentry, Vercel Log Drains,
or another approved observability provider before relying on the data beyond
the host retention window.

## Alerts And Escalation

Escalate immediately when any launch-critical signal stays unhealthy after a
single retry:

| Signal | First response | Escalation |
| --- | --- | --- |
| deploy failure | Check build logs and env availability | Engineering owner |
| health failure | Check `/api/health`, release, and runtime logs | Engineering owner |
| checkout handoff errors | Disable new launch changes if cart handoff is affected | Engineering owner + store owner |
| cart buyer identity sync failures | Confirm signed-in checkout sync events are not rising | Engineering owner + store owner |
| account/OAuth errors | Verify Customer Account env and Shopify admin callback/logout URLs | Engineering owner + store owner |
| provider failures | Identify Shopify, Sanity, Searchanise, Trustoo, HulkApps, analytics, or email boundary | Engineering owner |
| webhook rejected events | Verify webhook secrets, HMAC/signature headers, and sender configuration | Engineering owner |
| elevated server route/action errors | Inspect redacted runtime logs, Sentry events, and affected routes/actions | Engineering owner |

Do not paste customer PII, tokens, cart IDs, checkout URLs, order details, raw
provider payloads, or submitted message bodies into incident notes.

## Rollback

Use Vercel instant rollback when a launch deploy causes customer-visible
checkout, account, search, policy, or elevated server-error regressions.

Rollback steps:

1. Identify the last known good production deployment.
2. Run Vercel instant rollback from the deployment dashboard or approved CLI
   workflow.
3. Confirm `/api/health` returns 200 on the rolled-back release.
4. Re-run smoke checks for home, collection, PDP, cart, account, legal routes,
   search, and checkout handoff.
5. Record the deployment ID, rollback time, reason, verifier, and residual
   follow-up in the Evidence Log.

Rollback does not approve real hosted checkout/payment/order testing. That
testing still requires store-owner approval and the approved Shopify test
boundary.

## Platform Recovery

If the host, Shopify, Sanity, Searchanise, analytics, email, or reviews
provider is degraded:

- Confirm whether the failure is platform-wide, credential-related, or caused
  by the current deploy.
- Keep customer-facing errors generic and actionable.
- Prefer reversible env gates before code changes when a provider is optional.
- For revenue-critical Shopify Storefront, cart, checkout handoff, and account
  failures, escalate to the engineering owner and store owner.
- Record provider status, affected routes, customer impact, mitigation, and
  follow-up owner in the Evidence Log.

## Reversible Env Gates

Use these environment gates to recover without code changes:

| Gate | Purpose | Recovery use |
| --- | --- | --- |
| `DISABLE_INDEXING` | Controls launch indexing/noindex behavior | Set `true` if SEO launch evidence fails or rollback requires re-blocking crawlers |
| `NEXT_PUBLIC_ANALYTICS_MODE` | Controls analytics destination mode | Set `fake` or disabled mode if approved analytics destinations misbehave |
| CSP/reporting controls | Controls staged content security policy reporting | Tighten or relax report-only controls based on approved source failures |
| provider env gates | Controls optional provider availability | Disable optional analytics, Searchanise, reviews, email, or other provider integrations when they degrade the storefront |

Never add private API keys to `NEXT_PUBLIC_*` variables. Treat all
non-`NEXT_PUBLIC_` values as server-only.

## Owner Approval Gates

These checks require owner approval or owner-provided evidence before being
marked approved:

- owner-approved Shopify hosted checkout/payment/order evidence
- Shopify hosted checkout, shipping-rate, tax, order creation, and success
  redirect proof
- live Customer Account OAuth proof
- protected customer data access approval
- B2B/customer pricing parity proof
- Search Console sitemap submission and URL inspection proof
- production analytics destination IDs and purchase/order tracking proof

Real hosted checkout/payment/order testing requires store-owner approval before
execution. Do not run production checkout, payment, shipping-rate, tax,
order-creation, success-redirect, or purchase analytics tests without dated
approval and an approved test boundary.

## Week-One Monitoring Checklist

Run this checklist daily for the first week after launch:

- Confirm `/api/health` is responding with safe public fields only.
- Review Sentry issues for new checkout, account, provider, webhook, and
  route/action errors.
- Review Vercel runtime errors, deploy health, rollback history, and elevated
  server route/action errors.
- Review checkout handoff events and cart buyer identity sync failures.
- Review account OAuth events, Customer Account API failures, and protected
  route failures.
- Review provider warnings for Shopify, Sanity, Searchanise, Trustoo,
  HulkApps, contact, newsletter, NPD, wholesale, email, and analytics
  destinations.
- Confirm `DISABLE_INDEXING` and `NEXT_PUBLIC_ANALYTICS_MODE` are still set to
  the owner-approved launch values.
- Confirm CSP/reporting controls do not show launch-blocking required source
  failures.
- Confirm owner-gated Shopify, Customer Account, B2B, and Search Console
  evidence is approved, pending, or owner-blocked.
- Confirm final owner-gate status is recorded for hosted checkout/payment/order
  testing before any real Shopify hosted checkout, payment, shipping-rate, tax,
  order-creation, or success-redirect test is run.
- Record actions and evidence in the Evidence Log.

## Evidence Log

| Date | Environment | Check | Status | Evidence | Owner/Verifier |
| --- | --- | --- | --- | --- | --- |
| Pending | Local/CI | Health route safety | Pending | `pnpm test:integration -- "src/app/api/health/route.test.ts"` | Engineering |
| Pending | Local/CI | Deep readiness docs mode | Pending | `node scripts/launch/probe-readiness.mjs --mode docs` | Engineering |
| Pending | Production | Deploy and health watch | Pending | Deployment ID, `/api/health` result, runtime log review | Engineering |
| Pending | Production | Vercel instant rollback proof | Pending | Rollback deployment ID or "not needed" note | Engineering |
| Pending | Local/CI | Final production-readiness audit | Pending | `pnpm audit:readiness` and `docs/launch/final-production-readiness-report.md` | Engineering |
| Owner-gated | Shopify | Hosted checkout/payment/order proof | Pending owner approval | Approved test plan and dated evidence | Owner/Engineering |
| Owner-gated | Shopify | Customer Account OAuth and protected data proof | Pending owner approval | Shopify admin configuration and live OAuth result | Owner/Engineering |
| Owner-gated | Google Search Console | Sitemap submission and URL inspection | Pending owner access | Property, URL, timestamp, and result | Owner |
