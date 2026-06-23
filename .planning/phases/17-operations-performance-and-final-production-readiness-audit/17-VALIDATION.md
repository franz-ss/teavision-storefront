---
phase: 17
slug: operations-performance-and-final-production-readiness-audit
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-23
---

# Phase 17 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest, Node test runner, Playwright, Lighthouse |
| **Config file** | `vitest.config.mts`, `playwright.config.ts`, planned `playwright.production.config.ts` |
| **Quick run command** | `pnpm test:unit -- src/lib/observability src/lib/readiness` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm build && pnpm test:unit && pnpm test:integration && pnpm test:contracts && pnpm test:security && pnpm test:e2e:production` |
| **Estimated runtime** | ~20-40 minutes for final audit depending on Lighthouse/e2e |

---

## Sampling Rate

- **After every task commit:** Run the task's narrow verify command.
- **After every plan wave:** Run `pnpm lint`, `pnpm typecheck`, and wave-owned tests.
- **Before `$gsd-verify-work`:** Run `node scripts/launch/run-final-readiness-audit.mjs` or document exactly which owner-gated checks are pending.
- **Max feedback latency:** 10 minutes for code/helper tasks, 40 minutes for full final audit.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 17-01-01 | 01 | 1 | OPS-01 | T-17-01 | Public health returns safe shallow fields only | unit/integration | `pnpm test:integration -- "src/app/api/health/route.test.ts"` | yes | pending |
| 17-01-02 | 01 | 1 | OPS-01, QA-02 | T-17-02 | Deep readiness reports config/provider blockers without exposing secrets | unit/node | `node --test scripts/launch/probe-readiness.test.mjs` | planned | pending |
| 17-01-03 | 01 | 1 | OPS-04 | T-17-03 | Runbook documents reversible launch gates and owner-controlled checks | docs/probe | `node scripts/launch/probe-readiness.mjs --mode docs` | planned | pending |
| 17-02-01 | 02 | 1 | OPS-02, OPS-03 | T-17-04 | Redaction removes PII, tokens, checkout URLs, raw payloads | unit | `pnpm test:unit -- src/lib/observability/logger.test.ts` | planned | pending |
| 17-02-02 | 02 | 1 | OPS-02 | T-17-05 | Server errors route through instrumentation when provider config exists | type/unit | `pnpm typecheck && pnpm test:unit -- src/lib/observability/logger.test.ts` | planned | pending |
| 17-02-03 | 02 | 1 | OPS-02, OPS-03 | T-17-06 | Revenue/provider call sites log structured redacted events | unit/integration | `pnpm test:unit -- src/lib/contact/actions.test.ts src/lib/shopify/client.test.ts` | planned | pending |
| 17-03-01 | 03 | 2 | QA-01 | T-17-07 | Production-like Playwright starts build/start lifecycle itself | e2e | `pnpm test:e2e:production -- tests/e2e/cart-checkout.spec.ts` | planned | pending |
| 17-03-02 | 03 | 2 | QA-01, QA-03 | T-17-08 | Browser tests stop at fake checkout and fake OAuth boundaries | e2e | `pnpm test:e2e:production` | planned | pending |
| 17-04-01 | 04 | 2 | PERF-01 | T-17-09 | Lighthouse evidence captures LCP/CLS/INP/TBT for launch representatives | node | `node scripts/performance/probe-lighthouse.mjs --start-server --base-url http://127.0.0.1:4173` | planned | pending |
| 17-04-02 | 04 | 2 | UX-01 | T-17-10 | Mobile wrapping and duplicate skip-link issues are tested or documented | story/e2e | `pnpm test:stories && pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts` | planned | pending |
| 17-05-01 | 05 | 3 | QA-02 | T-17-11 | Final audit aggregates all automated checks and evidence | node | `node scripts/launch/run-final-readiness-audit.mjs --dry-run` | planned | pending |
| 17-05-02 | 05 | 3 | QA-03, OPS-04 | T-17-12 | Owner-gated checks are approved/pending/owner-blocked, never fabricated | docs/node | `node scripts/launch/run-final-readiness-audit.mjs --evidence-file docs/launch/final-production-readiness-report.md` | planned | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

Existing infrastructure covers the phase foundations:

- `pnpm test:unit`
- `pnpm test:integration`
- `pnpm test:e2e`
- `pnpm test:stories`
- `pnpm test:contracts`
- `pnpm test:security`
- `scripts/security/probe-production-security.mjs`
- `scripts/seo/probe-launch-seo.mjs`
- `tests/mocks/run-fake-shopify-server.ts`
- `tests/mocks/customer-account-api-server.ts`

Wave 0 is complete; Phase 17 adds launch-specific scripts and a production-like e2e config.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shopify hosted checkout, payment, shipping, tax, order creation, success redirect | QA-03 | Requires store-owner approval and Shopify dev/test-store configuration | Follow `docs/testing/cart-checkout-uat.md`; record approval, date, tester, store, scenarios, and evidence. |
| Live Customer Account OAuth and protected customer data | QA-03 | Requires Shopify admin credentials, protected data scopes, callback/logout configuration, and HTTPS callback | Follow `docs/testing/customer-accounts-setup.md`; record approval, callback/logout URL proof, tester, and result. |
| B2B/customer-specific pricing parity | QA-03 | Requires authoritative Shopify admin/customer/company-location setup | Record approved test customer/company, expected Shopify behavior, cart/checkout evidence, and owner sign-off. |
| Search Console sitemap submission and URL inspection | QA-03 | Requires owner property access | Follow `docs/launch/analytics-and-indexing-runbook.md`; record property, URL, timestamp, and proof. |

---

## Validation Sign-Off

- [x] All tasks have automated verify commands or explicit manual owner gates.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers existing test infrastructure.
- [x] No watch-mode flags.
- [x] Feedback latency targets defined.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending execution
