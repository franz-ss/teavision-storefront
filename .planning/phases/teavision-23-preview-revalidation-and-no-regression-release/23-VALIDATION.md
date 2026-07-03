---
phase: 23
slug: preview-revalidation-and-no-regression-release
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-03
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
| 23-01-01 | 01 | 1 | PREVIEW-01, PREVIEW-02 | T-23-01/T-23-02/T-23-03 | Draft helpers require preview token, use drafts perspective, and never cache under published tags. | unit | `pnpm test:unit -- src/lib/sanity/home-page.test.ts` | pending | pending |
| 23-01-02 | 01 | 1 | PREVIEW-01 | T-23-01/T-23-02 | `/api/draft` validates secret, allows only `/`, confirms document existence, enables Draft Mode, and redirects to `/`. | integration | `pnpm exec vitest run --environment node src/app/api/draft/route.test.ts src/app/api/draft/disable/route.test.ts` | pending | pending |
| 23-01-03 | 01 | 1 | PREVIEW-01, PREVIEW-02, QUALITY-02 | T-23-03/T-23-04 | Homepage body can render draft data in Draft Mode while metadata and JSON-LD remain published-safe and stega-free. | unit | `pnpm test:unit -- src/app/(storefront)/page.test.tsx` | exists | pending |
| 23-01-04 | 01 | 1 | DATA-03 | T-23-05/T-23-06 | Signed `homePage` webhook payloads expire `homePage` and `sanity-homepage`; invalid payloads/signatures reject; blog tags stay intact. | integration | `pnpm exec vitest run --environment node src/app/api/webhooks/sanity/route.test.ts` | pending | pending |
| 23-01-05 | 01 | 1 | QUALITY-02, QUALITY-03 | T-23-07 | Release evidence records v1.5 baseline, current PSI/SEO results, pass/fail, and fix-or-rollback rule. | docs/probe | `node scripts/seo/probe-launch-seo.mjs --mode enabled --base-url <base-url>` | pending | pending |
| 23-01-06 | 01 | 1 | DATA-03, PREVIEW-01, PREVIEW-02, QUALITY-02, QUALITY-03 | all | Final regression sweep proves no local code/test/build regression before manual public-preview PSI sign-off. | regression | `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:integration && pnpm build` | N/A | pending |

---

## Wave 0 Requirements

- [ ] `src/app/api/draft/route.test.ts` - Draft Mode entry route coverage.
- [ ] `src/app/api/draft/disable/route.test.ts` - Draft Mode disable route coverage.
- [ ] `src/app/api/webhooks/sanity/route.test.ts` - Sanity webhook homepage and existing blog coverage.
- [ ] `src/lib/sanity/home-page.test.ts` - draft helper and cache isolation coverage.
- [ ] `src/app/(storefront)/page.test.tsx` - Draft Mode branch and published-safe SEO coverage.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real public-preview PSI category comparison for `/` | QUALITY-02, QUALITY-03 | Google PSI must run against a deployed public preview; local Lighthouse is diagnostic only. | Record current PSI Performance, Accessibility, Best Practices, and SEO categories in the Phase 23 release evidence document. Any category drop from v1.5 blocks rollout. |
| Real Sanity publish smoke test | DATA-03 | Requires configured Sanity webhook target and deployed storefront. | After deployment, publish a harmless homepage copy change and confirm the public preview updates without redeploy; record as deployment checklist proof, not local completion blocker. |

---

## Validation Sign-Off

- [x] All tasks have automated verify or explicit manual-only proof.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing test-file references.
- [x] No watch-mode flags.
- [x] Feedback latency target recorded.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending
