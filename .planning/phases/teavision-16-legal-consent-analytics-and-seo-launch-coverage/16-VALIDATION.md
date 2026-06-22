---
phase: 16
slug: legal-consent-analytics-and-seo-launch-coverage
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-22
---

# Phase 16 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x, Node test runner, Playwright local smoke tests |
| **Config file** | `vitest.config.mts`, `playwright.config.ts`, `package.json` scripts |
| **Quick run command** | `pnpm test:unit` plus targeted Node contract scripts for new route/SEO probes |
| **Full suite command** | `pnpm lint && pnpm build && pnpm test:unit && pnpm test:integration && pnpm test:contracts` |
| **Estimated runtime** | ~180 seconds for the full phase gate before any new Playwright smoke |

---

## Sampling Rate

- **After every task commit:** Run the targeted Vitest or Node contract command for the touched module, plus `pnpm lint` when TypeScript or React files change.
- **After every plan wave:** Run `pnpm test:unit`, the new SEO/route contract script, and any touched integration tests.
- **Before `$gsd-verify-work`:** Run `pnpm lint && pnpm build && pnpm test:unit && pnpm test:integration && pnpm test:contracts`, plus Playwright consent smoke only against fake/local destinations.
- **Max feedback latency:** 180 seconds for automated unit/contract feedback; Playwright smoke may exceed this and is wave/phase-gate only.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 01 | 1 | LEGAL-01, LEGAL-02 | T-16-01 | Legal routes and redirects expose no missing policy coverage and no silent draft/final mismatch. | unit + contract | `pnpm test:unit -- src/lib/legal` and `node scripts/seo/probe-launch-seo.mjs --mode redirects` | no, W0 | pending |
| 16-02-01 | 02 | 1 | CONSENT-01, CONSENT-02 | T-16-02 | Non-essential analytics/marketing are denied by default and cannot load before category consent. | unit + local smoke | `pnpm test:unit -- src/lib/consent` and `pnpm test:e2e -- consent` | no, W0 | pending |
| 16-02-02 | 02 | 1 | CONSENT-02 | T-16-03 | Shopify Customer Privacy API is isolated behind the central consent adapter or explicitly documented as not applicable. | unit + docs contract | `pnpm test:unit -- src/lib/consent` | no, W0 | pending |
| 16-03-01 | 03 | 2 | ANALYTICS-01, ANALYTICS-02 | T-16-04 | Required events pass through one typed adapter, respect consent, and use fake/test sinks in CI. | unit | `pnpm test:unit -- src/lib/analytics` | no, W0 | pending |
| 16-03-02 | 03 | 2 | ANALYTICS-03 | T-16-05 | Destination IDs and owner-gated production checks are documented without exposing secrets or sending CI events. | docs contract | `pnpm test:contracts` or markdown checklist script added by the plan | no, W0 | pending |
| 16-04-01 | 04 | 2 | SEO-01 | T-16-06 | Disabled and enabled indexing states verify robots, sitemap, canonicals, noindex, structured data, and no policy 404s. | contract + integration | `node scripts/component-contracts/noindex-mode.test.mjs` and `node scripts/seo/probe-launch-seo.mjs --mode disabled,enabled` | partial, W0 script needed | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/legal/policies.test.ts` - covers LEGAL-01 and LEGAL-02 policy registry, footer coverage, and redirect alias expectations.
- [ ] `scripts/seo/probe-launch-seo.mjs` - covers SEO-01 robots, sitemap, canonicals, noindex, structured data, policy redirects, and no 404s.
- [ ] `src/lib/consent/*.test.ts` - covers CONSENT-01 and CONSENT-02 defaults, preference persistence, category changes, and Shopify Customer Privacy API wrapper behavior.
- [ ] `src/lib/analytics/*.test.ts` - covers ANALYTICS-01 and ANALYTICS-02 typed event payloads, consent gating, destination routing, and fake/test sink behavior.
- [ ] A local-only Playwright consent smoke target or clearly scoped component/integration alternative for first-visit banner and preference changes.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Final owner/legal approval for policy wording | LEGAL-01 | The repo can prove route coverage and draft/approval state, but cannot approve legal promises. | Record approval source, approver, date, and proof in the launch evidence matrix. |
| Google Search Console sitemap submission and URL inspection | SEO-01 | Requires owner account access and production cutover state. | Document pre-cutover and post-cutover steps in the launch runbook; mark proof pending until access is provided. |
| Production GA4/GTM/Meta/Klaviyo/Shopify pixel destination verification | ANALYTICS-03 | Requires owner-approved IDs and external destination access. | Verify only after owner approval; local/CI tests must use fake sinks and must not send production analytics events. |
| Purchase/order analytics | ANALYTICS-01, ANALYTICS-03 | Hosted Shopify checkout/order creation is explicitly owner-gated. | Document as blocked pending approved Shopify checkout/order verification; do not run payment/order tests in CI. |

---

## Validation Sign-Off

- [ ] All tasks have automated verification or Wave 0 dependencies.
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify.
- [ ] Wave 0 covers all MISSING references.
- [ ] No watch-mode flags.
- [ ] Feedback latency < 180s for unit/contract feedback.
- [ ] `nyquist_compliant: true` set in frontmatter after Wave 0 is implemented and verified.

**Approval:** pending
