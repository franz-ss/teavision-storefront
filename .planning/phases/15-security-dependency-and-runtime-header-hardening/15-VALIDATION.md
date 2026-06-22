---
phase: 15
slug: security-dependency-and-runtime-header-hardening
status: ready
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-22
---

# Phase 15 - Validation Strategy

> Per-phase validation contract for dependency/security hardening execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest, Node test runner, Playwright fake-Shopify e2e |
| **Config file** | `vitest.config.mts`, `playwright.config.ts`, `package.json` scripts |
| **Quick run command** | `pnpm test:contracts && pnpm test:integration` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm build && pnpm test:unit && pnpm test:integration && pnpm test:e2e && pnpm audit --audit-level moderate` |
| **Estimated runtime** | 8-20 minutes depending on build/e2e |

## Sampling Rate

- **After every task commit:** Run the task-specific command in the PLAN.md task.
- **After every plan wave:** Run `pnpm lint && pnpm typecheck && pnpm test:contracts`.
- **Before `$gsd-verify-work`:** Full suite plus dependency audit and production header probe must be green or documented with exact owner-gated blockers.
- **Max feedback latency:** No more than one plan wave without an automated check.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 1 | SEC-01 | T-15-01 | Critical/high advisories removed or documented as non-runtime only after attempted remediation | audit | `pnpm audit --audit-level moderate --json` | yes | pending |
| 15-01-02 | 01 | 1 | SEC-01 | T-15-02 | Dependency evidence records before/after counts and residual moderate rationale | docs | `Test-Path .planning/phases/15-security-dependency-and-runtime-header-hardening/15-DEPENDENCY-AUDIT.md` | missing | pending |
| 15-02-01 | 02 | 2 | SEC-02, SEC-03 | T-15-03 | Required headers and report-only CSP produced by tested helper | unit | `pnpm test:unit -- src/lib/security/headers.test.ts` | missing | pending |
| 15-02-02 | 02 | 2 | SEC-02, SEC-03 | T-15-04 | Next production config disables `x-powered-by` and applies headers globally | contract | `pnpm test:contracts` | yes | pending |
| 15-03-01 | 03 | 2 | SEC-04 | T-15-05 | Direct OAuth-start links opt out of Next prefetch | integration | `pnpm test:integration -- "src/app/(storefront)/account/**/*.test.tsx" "src/app/(storefront)/account/login/start/route.test.ts"` | yes | pending |
| 15-03-02 | 03 | 2 | SEC-04 | T-15-06 | Callback/logout origins are documented and tested without live Shopify OAuth | integration/docs | `pnpm test:integration -- "src/app/(storefront)/account/callback/route.test.ts" "src/app/(storefront)/account/logout/route.test.ts"` | yes | pending |
| 15-04-01 | 04 | 2 | SEC-05 | T-15-07 | Production rate-limit posture fails closed unless protection or explicit fallback is configured | unit/contract | `pnpm test:unit -- src/lib/rate-limit/index.test.ts && pnpm test:contracts` | missing | pending |
| 15-04-02 | 04 | 2 | SEC-05 | T-15-08 | Public form/search logs are structured and redacted on provider failures | unit | `pnpm test:unit -- src/lib/contact/actions.test.ts "src/app/api/search/suggestions/route.test.ts"` | partial | pending |
| 15-05-01 | 05 | 3 | SEC-01..SEC-05 | T-15-09 | Production-like responses include headers, report-only CSP, and no `x-powered-by` | probe | `node scripts/security/probe-production-security.mjs http://127.0.0.1:3000` | missing | pending |
| 15-05-02 | 05 | 3 | SEC-01..SEC-05 | T-15-10 | Final evidence separates automated proof from owner-gated live Shopify proof | docs | `Test-Path .planning/phases/15-security-dependency-and-runtime-header-hardening/15-RUNTIME-SECURITY-EVIDENCE.md` | missing | pending |

## Wave 0 Requirements

- Existing infrastructure covers most phase requirements.
- Add `src/lib/security/headers.test.ts` in Plan 02.
- Add `src/lib/rate-limit/index.test.ts` if missing in Plan 04.
- Add `src/app/api/search/suggestions/route.test.ts` if missing in Plan 04.
- Add `scripts/security/probe-production-security.mjs` in Plan 05.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Live Shopify Customer Account OAuth | SEC-04 | Requires Shopify admin callback/logout configuration and owner approval | Record owner approval, configured callback URL, configured logout URL, tester, date, and result in Phase 15 evidence. Do not run without approval. |
| Hosted Shopify checkout/payment/tax/shipping/order | Out of Phase 15 scope | Explicitly blocked by project rules until owner approval | Leave owner-gated for Phase 17 final readiness evidence. |
| CSP enforcement | SEC-03 | Phase 15 selected report-only rollout first | Record report-only evidence and a follow-up condition for enforcement after smoke evidence. |

## Validation Sign-Off

- [x] All planned tasks have automated verify commands or documented manual-only gates.
- [x] Sampling continuity: no plan wave lacks automated verification.
- [x] No watch-mode flags in planned commands.
- [x] Full suite includes dependency audit, response headers, account OAuth, and abuse-control checks.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending execution

