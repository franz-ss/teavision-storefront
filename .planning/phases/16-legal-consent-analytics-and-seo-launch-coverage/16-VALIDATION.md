---
phase: 16
slug: legal-consent-analytics-and-seo-launch-coverage
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-22
validated: 2026-06-23
---

# Phase 16 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x, Node test runner, Playwright local smoke tests |
| **Config file** | `vitest.config.mts`, `playwright.config.ts`, `package.json` scripts |
| **Quick run command** | `pnpm test:unit -- src/lib/legal/policies.test.ts src/lib/consent/adapter.test.ts src/lib/analytics/adapter.test.ts src/lib/seo/launch-route-matrix.test.ts src/lib/security/headers.test.ts src/components/analytics/destination-loader/destination-loader.test.tsx "src/app/(storefront)/cart/_components/checkout-form.test.tsx"` |
| **Full suite command** | `pnpm lint && pnpm build && pnpm test:unit && pnpm test:integration && pnpm test:contracts` plus `pnpm test:e2e -- tests/e2e/consent.spec.ts` when no existing Next dev server blocks Playwright webServer startup |
| **Estimated runtime** | ~180 seconds for unit/contract feedback; Playwright smoke depends on local dev server startup |

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
| 16-01-01 | 01 | 1 | LEGAL-01, LEGAL-02 | T-16-01 | Legal routes and redirects expose no missing policy coverage and no silent draft/final mismatch. | unit + contract + live probe | `pnpm test:unit -- src/lib/legal/policies.test.ts`; `node scripts/seo/probe-launch-seo.mjs --mode redirects`; `node scripts/seo/probe-launch-seo.mjs --mode enabled --base-url http://localhost:3000 --product-path /products/organic-coldandflu-tea` | yes | green |
| 16-02-01 | 02 | 1 | CONSENT-01, CONSENT-02 | T-16-02 | Non-essential analytics/marketing are denied by default and cannot load before category consent. | unit + component + local smoke | `pnpm test:unit -- src/lib/consent/adapter.test.ts src/components/analytics/destination-loader/destination-loader.test.tsx`; `pnpm test:e2e -- tests/e2e/consent.spec.ts` | yes | green |
| 16-02-02 | 02 | 1 | CONSENT-02 | T-16-03 | Shopify Customer Privacy API is isolated behind the central consent adapter or explicitly documented as not applicable. | unit | `pnpm test:unit -- src/lib/consent/adapter.test.ts` | yes | green |
| 16-03-01 | 03 | 2 | ANALYTICS-01, ANALYTICS-02 | T-16-04 | Required events pass through one typed adapter, respect consent, and use fake/test sinks in CI. | unit + component | `pnpm test:unit -- src/lib/analytics/adapter.test.ts src/components/analytics/destination-loader/destination-loader.test.tsx src/lib/security/headers.test.ts` | yes | green |
| 16-03-02 | 03 | 2 | ANALYTICS-03 | T-16-05 | Destination IDs and owner-gated production checks are documented without exposing secrets or sending CI events. | unit + docs contract | `pnpm test:unit -- src/lib/analytics/adapter.test.ts`; `node scripts/seo/probe-launch-seo.mjs --mode runbook` | yes | green |
| 16-04-01 | 04 | 2 | SEO-01 | T-16-06 | Disabled and enabled indexing states verify robots, sitemap, canonicals, noindex, structured data, and no policy 404s. | unit + contract + live probe | `pnpm test:unit -- src/lib/seo/launch-route-matrix.test.ts`; `node --test scripts/component-contracts/noindex-mode.test.mjs`; `node scripts/seo/probe-launch-seo.mjs --mode runbook`; `node scripts/seo/probe-launch-seo.mjs --mode redirects`; `node scripts/seo/probe-launch-seo.mjs --mode enabled --base-url http://localhost:3000 --product-path /products/organic-coldandflu-tea` | yes | green |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

- [x] `src/lib/legal/policies.test.ts` - covers LEGAL-01 and LEGAL-02 policy registry, footer coverage, and redirect alias expectations.
- [x] `scripts/seo/probe-launch-seo.mjs` - covers SEO-01 robots, sitemap, canonicals, noindex, structured data, policy redirects, and no 404s.
- [x] `src/lib/consent/adapter.test.ts` and `src/components/analytics/destination-loader/destination-loader.test.tsx` - cover CONSENT-01 and CONSENT-02 defaults, preference persistence, category changes, destination consent reactions, and Shopify Customer Privacy API wrapper behavior.
- [x] `src/lib/analytics/adapter.test.ts`, `src/lib/security/headers.test.ts`, and `src/components/analytics/destination-loader/destination-loader.test.tsx` - cover ANALYTICS-01 and ANALYTICS-02 typed event payloads, consent gating, destination routing, CSP host gates, and fake/test sink behavior.
- [x] `tests/e2e/consent.spec.ts` plus direct local browser smoke - covers first-visit banner, accept/reject/manage flows, persistence, and `/pages/cookie-preferences`.

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

- [x] All tasks have automated verification or documented owner-gated manual-only proof.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all previously MISSING references.
- [x] No watch-mode flags.
- [x] Feedback latency < 180s for unit/contract feedback.
- [x] `nyquist_compliant: true` set in frontmatter after Wave 0 is implemented and verified.

**Approval:** automated Nyquist audit complete; owner-gated external proofs remain manual-only.

## Validation Audit 2026-06-23

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |
| Automated requirement rows covered | 6 |
| Manual-only owner-gated rows retained | 4 |

### Audit Evidence

- `pnpm test:unit -- src/lib/legal/policies.test.ts src/lib/consent/adapter.test.ts src/lib/analytics/adapter.test.ts src/lib/seo/launch-route-matrix.test.ts src/lib/security/headers.test.ts src/components/analytics/destination-loader/destination-loader.test.tsx "src/app/(storefront)/cart/_components/checkout-form.test.tsx"` - passed, 7 files / 41 tests.
- `node --test scripts/component-contracts/noindex-mode.test.mjs` - passed, 4 tests.
- `node scripts/seo/probe-launch-seo.mjs --mode runbook` - passed.
- `node scripts/seo/probe-launch-seo.mjs --mode redirects` - passed, 8 policy redirects represented.
- `node scripts/seo/probe-launch-seo.mjs --mode enabled --base-url http://localhost:3000 --product-path /products/organic-coldandflu-tea` - passed against the already-running enabled-indexing dev server, including sitemap paths, policy redirects, canonicals, and Product JSON-LD.
- `pnpm test:e2e -- tests/e2e/consent.spec.ts` - blocked in this audit because Next refused to start a second dev server while PID 28064 was already serving this repo at `http://localhost:3000`; an equivalent direct Playwright browser smoke against that running server passed for first visit, reject, accept, manage preferences, persistence, and `/pages/cookie-preferences`.

### Gap Decision

No new test files were generated during this retroactive validation pass. The planned Wave 0 tests already exist and pass through the focused unit, contract, probe, and browser-smoke evidence above.
