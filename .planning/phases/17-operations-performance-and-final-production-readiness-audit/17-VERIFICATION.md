---
phase: 17-operations-performance-and-final-production-readiness-audit
verified: 2026-06-23T23:54:27Z
status: gaps_found
score: "8/9 must-haves verified"
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: "8/9 phase truths verified; performance remains launch-blocking"
  gaps_closed: []
  gaps_remaining:
    - "PERF-01 strict performance blocker"
  regressions: []
gaps:
  - truth: "PERF-01: Home and PDP Lighthouse/Core Web Vitals evidence no longer shows launch-blocking LCP regressions, or a dated owner/staging/field acceptance marks local lab failures non-blocking"
    status: failed
    reason: "Strict local performance evidence still records seven FAIL rows, final readiness is 94/100 and Not launch-ready, and no dated acceptance artifact exists."
    artifacts:
      - path: "docs/launch/performance-evidence.md"
        issue: "Launch-blocking yes; seven representative routes fail strict local Lighthouse thresholds, including Home LCP 6631ms and PDP LCP 5070ms."
      - path: "docs/launch/final-production-readiness-report.md"
        issue: "Automated score is 94/100; performance is FAIL with exit code 1; launch decision is Not launch-ready."
      - path: "docs/launch/performance-acceptance.md"
        issue: "File is absent, consistent with the user choosing to continue without acceptance evidence."
    missing:
      - "Either remediate strict/staging/field performance so Home and PDP no longer show launch-blocking LCP regressions, or record a valid dated owner/staging/field Core Web Vitals acceptance artifact."
      - "Regenerate performance evidence, final readiness report, and this verification after remediation or acceptance."
---

# Phase 17: Operations, Performance, and Final Production-Readiness Audit Verification Report

**Phase Goal:** Prove the storefront is operationally ready to launch with monitoring, performance, e2e, owner-gated Shopify test evidence, and a repeatable final 100/100 readiness audit.
**Verified:** 2026-06-23T23:54:27Z
**Status:** gaps_found
**Re-verification:** Yes - previous verification existed and its remaining gap was rechecked against current code and evidence.

## Goal Achievement

Phase 17 is still not achieved. The evidence proves most operational readiness machinery is present and honest, but it also proves the storefront is not launch-ready: the final report is `94/100`, says `Not launch-ready`, and records `performance` as the only failed automated check.

The SEO enabled gap is closed. `docs/launch/seo-route-evidence.md` records enabled indexing as Pass under `DISABLE_INDEXING=false`, and the final readiness report records `seo enabled` as `PASS`.

The remaining blocker is PERF-01. `docs/launch/performance-evidence.md` records seven strict local Lighthouse `FAIL` rows and `Launch-blocking: yes`. `docs/launch/performance-acceptance.md` does not exist because the user chose to continue without acceptance evidence. Under the verification policy, Phase 17 must remain `gaps_found`.

## Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | OPS-01: production exposes a safe health/readiness endpoint with no secrets or PII | VERIFIED | `src/app/api/health/route.ts` returns `makePublicHealthPayload()` only; `src/lib/readiness/status.ts` limits public keys to `status`, `service`, `release`, and `timestamp`; health tests assert no forbidden public substrings. |
| 2 | OPS-02: errors, checkout failures, provider failures, and route/action failures are observable in the chosen monitoring stack | VERIFIED | `src/instrumentation.ts` wires Sentry-style `onRequestError`; `logEvent()` call sites cover checkout handoff, cart buyer identity, Shopify, Customer Account, Searchanise, Trustoo/HulkApps, contact providers, and webhooks; runbook maps these to Sentry/Vercel signals. External dashboard setup still needs human launch verification. |
| 3 | OPS-03: logs are structured and redact tokens, customer PII, message bodies, and provider payloads | VERIFIED | `src/lib/observability/redact.ts` redacts token/email/phone/cookie/checkout URL/sensitive key data; `src/lib/observability/logger.test.ts` covers redacted context for sensitive fields and provider/webhook events. |
| 4 | OPS-04: launch runbook covers alerts, rollback, backups/platform recovery, owner approvals, and post-launch monitoring | VERIFIED | `docs/launch/operations-runbook.md` contains Launch Watch, Alerts And Escalation, Rollback, Platform Recovery, Reversible Env Gates, Owner Approval Gates, Week-One Monitoring Checklist, and Evidence Log sections. |
| 5 | PERF-01: Home and PDP Lighthouse/Core Web Vitals evidence no longer shows launch-blocking LCP regressions, or valid dated acceptance marks local lab failures non-blocking | FAILED | `docs/launch/performance-evidence.md` has seven strict route `FAIL` rows: Home LCP 6631ms, PDP LCP 5070ms, and `Launch-blocking: yes`. No `docs/launch/performance-acceptance.md` exists. |
| 6 | UX-01: audit UX/accessibility polish items are resolved or documented non-blocking | VERIFIED | `tests/e2e/production-smoke.spec.ts` asserts one skip link, `main#main-content`, 375px mobile no-horizontal-overflow on cart/search, and `/api/health`; `docs/launch/performance-evidence.md` records no remaining UX/accessibility launch blockers. |
| 7 | QA-01: local production e2e is unblocked and passes without relying on an already-running dev server | VERIFIED | `playwright.production.config.ts` uses `reuseExistingServer: false` for fake Shopify, fake Customer Account, and `run-next-production-server`; final report records `production e2e` PASS with 19 tests and `browser smoke` PASS with 10 tests. |
| 8 | QA-02: final readiness audit proves required automated checks honestly | VERIFIED | `docs/launch/final-production-readiness-report.md` lists 17 automated checks, says no automated checks were explicitly skipped, records 16/17 pass, and keeps performance as `FAIL` instead of producing a hollow `100/100`. |
| 9 | QA-03: owner-gated Shopify/admin/Search Console proof is approved, pending, or owner-blocked without fabrication | VERIFIED | Final report contains all 11 owner-gated rows as `pending`; docs continue to prohibit real hosted checkout/payment/shipping/tax/order/success redirect/OAuth/protected-data/B2B/Search Console testing without owner evidence. |

**Score:** 8/9 primary Phase 17 requirement truths verified.

## Roadmap Success Criteria

| # | Criterion | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Safe health/readiness endpoint reports deploy readiness without exposing secrets, tokens, PII, or raw payloads | VERIFIED | Public route and payload helper restrict output to safe fields; tests cover shape and forbidden substrings. |
| 2 | Monitoring/logging captures app, checkout, provider, route/action failures, release context, and alerts/escalation paths | VERIFIED | Sentry-style instrumentation, redacted logging call sites, and runbook signal routing exist. Provider dashboard configuration remains human launch verification. |
| 3 | Home/PDP performance evidence no longer shows launch-blocking LCP regressions, and UX/accessibility polish is resolved/non-blocking | FAILED | UX side is covered, but Home/PDP LCP evidence still fails and no acceptance artifact exists. |
| 4 | Local production e2e runs from controlled server lifecycle and passes without a pre-existing dev server | VERIFIED | Playwright production config owns fake providers and the Next production server; final report records passing production e2e and browser smoke. |
| 5 | Final report proves automated checks and records owner-approved or owner-blocked Shopify/admin evidence honestly | PARTIAL | Report is honest and owner-gated evidence is separated, but it is `94/100` and `Not launch-ready` because performance fails. |

## Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `src/app/api/health/route.ts` | Public shallow health response | VERIFIED | Exists, substantive, imports `makePublicHealthPayload()`, and returns only safe public status. |
| `scripts/launch/probe-readiness.mjs` | Private deep readiness probe | VERIFIED | Exists, substantive, validates runbook headings and owner gates; tests pass. |
| `docs/launch/operations-runbook.md` | Launch monitoring, rollback, recovery, owner-gate runbook | VERIFIED | Required launch-watch and recovery sections are present. |
| `src/instrumentation.ts` | Next server request error capture | VERIFIED | Registers Sentry configs and captures request errors when DSN is configured. |
| `src/lib/observability/logger.ts` | Typed structured logging boundary | VERIFIED | Exports typed event names and emits redacted structured log payloads. |
| `src/lib/observability/redact.ts` | PII/token/provider-payload redaction | VERIFIED | Covers sensitive keys, tokens, emails, phone-like values, cookies, checkout URLs, and identifier hashing. |
| `playwright.production.config.ts` | Production-like Playwright lifecycle | VERIFIED | Starts fake Shopify, fake Customer Account, and owned Next production server with `reuseExistingServer: false`. |
| `tests/mocks/run-next-production-server.mjs` | Build/start helper owned by Playwright | VERIFIED WITH WARNING | Builds and starts Next, but code review warning WR-02 remains: shutdown can leave the child server orphaned on some platforms. |
| `docs/launch/production-e2e-evidence.md` | Local production e2e evidence | VERIFIED | Exists and final report records production e2e PASS. |
| `scripts/performance/probe-lighthouse.mjs` | Strict mobile Lighthouse diagnostics | VERIFIED WITH WARNING | Exists, tests pass, emits LCP diagnostics and nonzero strict failures. Code review warning WR-01 remains for non-Windows lifecycle shutdown. |
| `docs/launch/performance-evidence.md` | Strict local performance evidence | FAILED FOR PERF-01 | Exists and is substantive, but records seven launch-blocking FAIL rows. |
| `docs/launch/performance-acceptance.md` | Optional dated acceptance if strict lab failures are non-blocking | MISSING FOR PERF-01 | File is absent while strict performance is still red, so there is no valid acceptance path. |
| `scripts/launch/run-final-readiness-audit.mjs` | Final automated readiness audit runner | VERIFIED | Matrix includes required checks; strict performance uses `pnpm test:performance -- --start-server --json-summary`; tests pass. |
| `docs/launch/final-production-readiness-report.md` | Source of truth for readiness score and launch decision | FAILED LAUNCH DECISION | Exists and is honest, but reports `94/100`, performance `FAIL`, and `Not launch-ready`. |
| `docs/launch/seo-route-evidence.md` | SEO launch-indexing evidence | VERIFIED | Disabled, enabled, redirects, and runbook evidence are Pass; Search Console stays owner-gated. |

## Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `src/app/api/health/route.ts` | `src/lib/readiness/status.ts` | public payload helper | VERIFIED | Direct import and GET response use `makePublicHealthPayload()`. |
| `src/lib/observability/logger.ts` | checkout/provider/contact/webhook call sites | redacted event logging | VERIFIED | `rg "logEvent\\(" src` shows call sites across cart checkout, cart actions, Shopify, Customer Account, Searchanise, reviews, contact, and webhooks. |
| `scripts/launch/run-final-readiness-audit.mjs` | `scripts/launch/probe-readiness.mjs` | readiness evidence | VERIFIED | Audit matrix includes `node scripts/launch/probe-readiness.mjs --json`; final report records readiness PASS. |
| `scripts/launch/run-final-readiness-audit.mjs` | `scripts/performance/probe-lighthouse.mjs` | performance metric blocker status | VERIFIED | Manual check: audit imports `startProductionLifecycle` from `../performance/probe-lighthouse.mjs` and matrix command runs `pnpm test:performance -- --start-server --base-url ... --json-summary`. The SDK key-link helper misses this because the command is package-script mediated. |
| `scripts/launch/run-final-readiness-audit.mjs` | `scripts/security/probe-production-security.mjs` | owned local live-header probe | VERIFIED | Audit matrix includes security headers live probe and final report records PASS. |
| `scripts/launch/run-final-readiness-audit.mjs` | `scripts/seo/probe-launch-seo.mjs` | disabled/enabled SEO probes | VERIFIED | Required live probes use distinct lifecycle profiles; tests assert `seo enabled` uses `indexable`. Final report records SEO disabled/enabled/redirects/runbook PASS. |
| `scripts/performance/probe-lighthouse.mjs` | `docs/launch/performance-evidence.md` | strict route metrics and LCP diagnostics | VERIFIED | Script renders the evidence document and current doc includes route metrics plus LCP element/resource/observed URL diagnostics. |
| `docs/launch/performance-acceptance.md` | `scripts/launch/run-final-readiness-audit.mjs` | validated exception only when lab evidence remains non-green | FAILED | Source file is absent; without it, the final audit correctly keeps performance FAIL rows blocking. |
| `docs/launch/final-production-readiness-report.md` | this verification | post-gap verification status | VERIFIED | This verification was regenerated from the current final report and preserves `gaps_found`; the evidence artifact itself intentionally remains a source document, not a verifier consumer. |

## Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| --- | --- | --- | --- | --- |
| `src/app/api/health/route.ts` | `PublicHealthPayload` | `makePublicHealthPayload()` reads release env and current timestamp | Yes, safe runtime payload | VERIFIED |
| `scripts/launch/probe-readiness.mjs` | readiness checks / owner gates | Env docs, runbook headings, owner gate configuration | Yes, probe returns JSON/markdown from actual files/config | VERIFIED |
| `scripts/performance/probe-lighthouse.mjs` | route metric rows | Lighthouse LHR audits from representative local production routes | Yes, current doc records measured route metrics and diagnostics | VERIFIED, DATA SHOWS FAIL |
| `scripts/launch/run-final-readiness-audit.mjs` | automated check matrix | Executes configured commands and renders their exit codes/evidence | Yes, current final report records 17 command rows | VERIFIED, DATA SHOWS NOT READY |
| `docs/launch/seo-route-evidence.md` | SEO mode evidence | Final audit runs disabled and enabled SEO probes under distinct lifecycles | Yes, current report and doc agree on PASS rows | VERIFIED |

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| Performance probe strict semantics are tested | `node --test scripts/performance/probe-lighthouse.test.mjs` | 17 passed | PASS |
| Final audit scoring and no-hollow-pass semantics are tested | `node --test scripts/launch/run-final-readiness-audit.test.mjs` | 17 passed | PASS |
| Readiness probe owner-gate and docs semantics are tested | `node --test scripts/launch/probe-readiness.test.mjs` | 5 passed | PASS |
| Schema drift check | `gsd-sdk query verify.schema-drift "17"` | `drift_detected: false`, `blocking: false` | PASS |
| Codebase drift check | `gsd-sdk query verify.codebase-drift` | Advisory mapping warning only, `directive: warn` | WARNING |
| Current evidence consistency | PowerShell assertion over final report/performance evidence/acceptance path | `OK`: `94/100`, `Not launch-ready`, `performance FAIL`, `Launch-blocking: yes`, no acceptance file | PASS |

I did not rerun `pnpm audit:readiness` or Lighthouse because Step 7b forbids starting services during spot-checks and the existing dated report already captures the current strict failure. The user also supplied orchestrator post-merge pass facts for `pnpm build`, `pnpm lint`, `pnpm test:unit`, and `pnpm test:integration`; the final report independently records those rows as PASS.

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| OPS-01 | 17-01, 17-05, 17-09 | Safe health/readiness endpoint with no secrets or PII | SATISFIED | Health route and readiness payload tests verify public shape and forbidden substrings. |
| OPS-02 | 17-02, 17-05, 17-09 | Errors, checkout failures, provider failures, and route/action failures observable | SATISFIED | Sentry-style instrumentation plus redacted `logEvent()` call sites and runbook signal matrix. External dashboard verification remains a launch human check. |
| OPS-03 | 17-02, 17-05, 17-09 | Structured logs redact tokens, PII, message bodies, and provider payloads | SATISFIED | Redaction helpers and tests cover sensitive text, keys, checkout URLs, provider payloads, and event logs. |
| OPS-04 | 17-01, 17-02, 17-05, 17-09 | Runbook covers alerts, rollback, recovery, approvals, monitoring | SATISFIED | Operations runbook headings and content verified; readiness probe checks required headings. |
| PERF-01 | 17-04, 17-05, 17-06, 17-08, 17-09 | Home/PDP Lighthouse/Core Web Vitals evidence no longer shows launch-blocking LCP regressions | BLOCKED | Seven strict route FAIL rows; Home/PDP LCP fail; no acceptance artifact; final report Not launch-ready. |
| UX-01 | 17-04, 17-05, 17-08, 17-09 | UX/accessibility polish resolved or documented non-blocking | SATISFIED | Production smoke tests skip link and mobile overflow; performance evidence says no UX/accessibility launch blockers remain. |
| QA-01 | 17-03, 17-05, 17-09 | Local production e2e passes from controlled lifecycle | SATISFIED | Playwright production config owns fake providers/server; final report records e2e PASS. |
| QA-02 | 17-01, 17-03, 17-04, 17-05, 17-06, 17-07, 17-08, 17-09 | Final audit proves required automated checks honestly | SATISFIED FOR AUDIT HONESTY | Final report includes all required automated checks, no default skips, and keeps performance FAIL visible. It does not prove launch readiness. |
| QA-03 | 17-03, 17-05, 17-09 | Owner-gated Shopify/admin checks have approved evidence or explicit blocked status | SATISFIED FOR PHASE BOUNDARY | Final report lists all 11 owner-gated rows as pending and does not fabricate hosted checkout/OAuth/protected-data/B2B/Search Console proof. |
| SEO-01 | 17-07, 17-09 | Plan-declared SEO launch-indexing evidence | SATISFIED | Although not one of the Phase 17 roadmap requirement IDs, it appears in plan frontmatter. `seo enabled` is PASS in final report and `docs/launch/seo-route-evidence.md` records enabled indexing as Pass. |

No Phase 17 requirement ID from `.planning/REQUIREMENTS.md` is orphaned. `PERF-01` is explicitly traced and remains Blocked.

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | ---: | --- | --- | --- |
| `docs/launch/performance-evidence.md` | 27-33 | Seven strict `FAIL` rows | BLOCKER | Directly blocks PERF-01 and final launch readiness. |
| `docs/launch/final-production-readiness-report.md` | 9, 34, 84 | `94/100`, performance `FAIL`, `Not launch-ready` | BLOCKER | Confirms final 100/100 readiness goal is not achieved. |
| `scripts/performance/probe-lighthouse.mjs` | 277 | Non-Windows lifecycle sends `SIGTERM` and returns | WARNING | Matches 17-REVIEW WR-01; can make sequential lifecycle restarts flaky on non-Windows. Not the current PERF-01 blocker. |
| `tests/mocks/run-next-production-server.mjs` | 61 | `activeChild.kill()` only | WARNING | Matches 17-REVIEW WR-02; can orphan `next start` on some platforms. Not the current PERF-01 blocker. |
| `next.config.ts` | 8 | Hardcoded public ngrok `allowedDevOrigins` | WARNING | Matches 17-REVIEW WR-03; stale mutable local trust boundary. Not the current PERF-01 blocker. |

General stub-pattern scans found many expected placeholders from unrelated legal placeholder pages, Storybook `autodocs`, generated Shopify type comments, UI input placeholder attributes, and normal parser `return null` branches. I did not classify those as Phase 17 stubs. The only launch-blocking anti-pattern is the performance evidence failure.

## Human Verification Required

These do not change the current `gaps_found` status because PERF-01 already blocks the phase.

1. Monitoring dashboards and alert routing
   - Test: Confirm Sentry/Vercel or the chosen provider receives release-scoped app, route/action, checkout, account/OAuth, and provider failure events.
   - Expected: Events are visible, redacted, and routed according to `docs/launch/operations-runbook.md`.
   - Why human: Requires external provider access and production/staging configuration.

2. Owner-gated Shopify/admin/Search Console launch proof
   - Test: With explicit owner approval, verify hosted checkout/payment/shipping/tax/order/success redirect, live Customer Account OAuth, protected customer data, B2B/customer pricing, sitemap submission, and URL inspection.
   - Expected: Each row becomes `approved` with dated proof or remains `pending`/`owner-blocked`.
   - Why human: Project rules prohibit automated real hosted checkout/admin/Search Console tests without owner approval.

3. Performance acceptance, if remediation is not chosen
   - Test: Owner/staging/field Core Web Vitals evidence explicitly accepts current local lab failures as non-blocking.
   - Expected: A dated acceptance artifact exists and the final audit names it.
   - Why human: No valid acceptance file exists now, and this decision requires owner/staging/field evidence.

## Deferred Items

No deferred items. `gsd-sdk query roadmap.analyze --raw` shows Phase 17 is the final active phase in the v1.4 milestone, and no later phase explicitly covers the PERF-01 blocker.

## Gaps Summary

The root cause is singular: strict performance remains red without a valid acceptance artifact. That one blocker prevents both PERF-01 and the final 100/100 launch-readiness goal.

Code review is also not clean: `17-REVIEW.md` has `status: issues_found` with 0 critical and 3 warnings, and spot checks confirm those warnings are still observable in the code. They are advisory warnings, not the launch-blocking PERF-01 gap.

To close Phase 17, either fix the strict performance evidence so Home/PDP and representative routes no longer show launch-blocking LCP/CLS regressions, or add a valid dated owner/staging/field performance acceptance artifact and regenerate the final readiness report. Until then, Phase 17 remains verification-pending.

---

_Verified: 2026-06-23T23:54:27Z_
_Verifier: the agent (gsd-verifier)_
