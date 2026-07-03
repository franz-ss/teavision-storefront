---
phase: 23
slug: preview-revalidation-and-no-regression-release
status: owner-gated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-03
last_updated: 2026-07-03
---

# Phase 23 - Validation Strategy

> Per-phase validation contract for secure Draft Mode preview, homepage
> revalidation, and no-regression release evidence.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.8, Node test, Playwright/Lighthouse supporting probes |
| **Config file** | `vitest.config.*`, `package.json`, `playwright.production.config.ts` |
| **Quick run command** | `pnpm test:unit -- src/lib/sanity/home-page.test.ts src/lib/sanity/queries/home-page.test.ts src/app/(storefront)/page.test.tsx` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:integration && pnpm build` |
| **Estimated runtime** | ~90-180 seconds for full suite; local performance probe is slower and evidence-only |

---

## Sampling Rate

- **After every task commit:** Run the task's targeted unit or integration command.
- **After every plan wave:** Run `pnpm lint`, `pnpm typecheck`, and all route/helper tests touched by the wave.
- **Before `$gsd-verify-work`:** Full suite must be green, plus the focused homepage SEO/PageSpeed evidence document must exist.
- **Max feedback latency:** Keep targeted checks under ~60 seconds where possible.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 23-01-01 | 01 | 1 | PREVIEW-01, PREVIEW-02 | T-23-01/T-23-02/T-23-03 | Draft helpers require preview token, use drafts perspective, and never cache under published tags. | unit | `pnpm test:unit -- src/lib/sanity/home-page.test.ts` | exists | passed in task commit `e71e2163`; final focused unit sweep also passed |
| 23-01-02 | 01 | 1 | PREVIEW-01 | T-23-01/T-23-02 | `/api/draft` validates secret, allows only `/`, confirms document existence, enables Draft Mode, and redirects to `/`. | integration | `pnpm exec vitest run --environment node src/app/api/draft/route.test.ts src/app/api/draft/disable/route.test.ts` | exists | passed in task commit `5be79644`; 2026-07-03 validation audit added short-server-secret and metadata-only invalid-secret coverage |
| 23-01-03 | 01 | 1 | PREVIEW-01, PREVIEW-02, QUALITY-02 | T-23-03/T-23-04 | Homepage body can render draft data in Draft Mode while metadata and JSON-LD remain published-safe and stega-free. | unit | `pnpm test:unit -- src/app/(storefront)/page.test.tsx` | exists | passed in task commit `b4ad0e1b`; final focused unit sweep also passed |
| 23-01-04 | 01 | 1 | DATA-03 | T-23-05/T-23-06 | Signed `homePage` webhook payloads expire `homePage` and `sanity-homepage`; invalid payloads/signatures reject; blog tags stay intact. | integration | `pnpm exec vitest run --environment node src/app/api/webhooks/sanity/route.test.ts` | exists | passed in task commit `15035460`; 2026-07-03 validation audit added unsupported signed payload no-op coverage |
| 23-01-05 | 01 | 1 | QUALITY-02, QUALITY-03 | T-23-07 | Release evidence records v1.5 baseline, current PSI/SEO results, pass/fail, and fix-or-rollback rule. | docs/probe | `node -e "require('node:fs').existsSync('docs/launch/phase-23-homepage-release-gate.md') || process.exit(1)"` | exists | passed; manual public-preview PSI and Sanity publish proof still pending |
| 23-01-06 | 01 | 1 | DATA-03, PREVIEW-01, PREVIEW-02, QUALITY-02, QUALITY-03 | all | Final regression sweep proves no local code/test/build regression before manual public-preview PSI sign-off. | regression | focused unit, integration, lint, typecheck, build | N/A | automated checks passed; rollout remains blocked awaiting public-preview evidence |

---

## Wave 0 Requirements

- [x] `src/app/api/draft/route.test.ts` - Draft Mode entry route coverage.
- [x] `src/app/api/draft/disable/route.test.ts` - Draft Mode disable route coverage.
- [x] `src/app/api/webhooks/sanity/route.test.ts` - Sanity webhook homepage and existing blog coverage.
- [x] `src/lib/sanity/home-page.test.ts` - draft helper and cache isolation coverage.
- [x] `src/app/(storefront)/page.test.tsx` - Draft Mode branch and published-safe SEO coverage.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real public-preview PSI category comparison for `/` | QUALITY-02, QUALITY-03 | Google PSI must run against a deployed public preview; local Lighthouse is diagnostic only. | Record current PSI Performance, Accessibility, Best Practices, and SEO categories in the Phase 23 release evidence document. Any category drop from v1.5 blocks rollout. |
| Real Sanity publish smoke test | DATA-03 | Requires configured Sanity webhook target and deployed storefront. | After deployment, publish a harmless homepage copy change and confirm the public preview updates without redeploy; record as deployment checklist proof, not local completion blocker. |

---

## Executed Evidence

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm test:unit -- src/lib/sanity/home-page.test.ts "src/app/(storefront)/page.test.tsx"` | Pass | 69 files / 297 tests. The `test:unit` script fans out broadly because arguments are forwarded after Vitest's own `--`; this still covers the targeted files. |
| `pnpm exec vitest run --environment node src/app/api/draft/route.test.ts src/app/api/webhooks/sanity/route.test.ts` | Pass | 2 files / 18 tests. Validation audit added short preview-secret rejection, invalid preview-secret metadata-only logging, and unsupported signed Sanity payload no-op coverage. |
| `pnpm test:integration` | Pass | 12 files / 62 tests, including draft enable/disable and Sanity webhook route tests. |
| `pnpm lint -- --quiet` | Tooling failure | Tailwind class check passed, but this pnpm invocation forwarded a literal `--` to ESLint, causing ESLint to treat `--quiet` as a file pattern. |
| `pnpm lint --quiet` | Pass | Equivalent quiet lint path for this package script; Tailwind class check passed and ESLint completed. |
| `pnpm exec eslint . --quiet` | Pass | Direct ESLint confirmation after the script-forwarding failure. |
| `pnpm typecheck` | Pass | Initially caught missing draft observability event names and `NextRequest` test typing; fixed in `c0852302`, then passed. |
| `pnpm build` | Pass | Next.js 16.2.9 production build with Cache Components enabled passed. Build emitted two metadata-only `draft_preview_rejected` missing-secret logs during route analysis, with no secret values. |
| `23-REVIEW.md` code review | Pass | No actionable findings. |

---

## Validation Audit 2026-07-03

| Metric | Count |
|--------|-------|
| Gaps found | 2 |
| Resolved | 2 |
| Escalated | 0 |
| Tests added | 3 |

| Gap | Resolution | Verification |
|-----|------------|--------------|
| Preview route short configured secret had implementation coverage but no direct behavioral test. | Added `returns 500 for a too-short configured preview secret` in `src/app/api/draft/route.test.ts`. | `pnpm exec vitest run --environment node src/app/api/draft/route.test.ts src/app/api/webhooks/sanity/route.test.ts` passed. |
| Preview/webhook metadata-only rejection/no-op logging had partial coverage around accepted webhooks only. | Added invalid preview-secret metadata-only logging coverage and unsupported signed Sanity payload no-op coverage. | `pnpm test:integration` passed with 12 files / 62 tests; `pnpm lint --quiet` passed. |

Result: `nyquist_compliant` remains `true`; all discovered validation gaps were filled with automated tests, and owner-gated PSI/Sanity publish checks remain manual-only release gates.

---

## Validation Sign-Off

- [x] All tasks have automated verify or explicit manual-only proof.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing test-file references.
- [x] No watch-mode flags.
- [x] Feedback latency target recorded.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** automated implementation evidence passed; rollout approval is blocked until public-preview PSI category scores and Sanity `homePage` publish smoke-test proof are recorded in `docs/launch/phase-23-homepage-release-gate.md`.
