---
phase: 20
slug: pagespeed-100-perfection
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-30
scope: lean (homepage / PSI screenshot fixes only — see D-16)
---

# Phase 20 - Validation Strategy (Lean Scope)

> Per D-16, Phase 20 is narrowed to the four homepage `/` PSI screenshot fixes (`20-01-PLAN.md`). The deferred broad plan's validation map is preserved in `deferred/` (recoverable from commit e0e42881). The score of record remains **real Google PSI on `/`** (owner-run); existing automated guards prevent regressions.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Frameworks** | Real PSI (owner-run, `/`), Node contract tests, Playwright, Node SEO probes |
| **Quick run command** | `node --test scripts/component-contracts/launch-image-performance.test.mjs`; `pnpm typecheck` |
| **Full regression sweep** | `pnpm lint && pnpm typecheck && pnpm build && node --test scripts/component-contracts/*.test.mjs && node scripts/seo/probe-crawlable-html.mjs && pnpm exec playwright test tests/e2e/h1-correctness.spec.ts` |
| **Score-of-record** | Owner re-runs Google PSI on `/` against the public preview; before/after recorded in `docs/launch/homepage-performance-fixes.md` |
| **Estimated runtime** | ~5 min per code task; ~15-20 min for the full sweep + build |

---

## Sampling Rate

- **After every task commit:** Run the task's narrow command (the image contract test, `pnpm typecheck`).
- **After the plan:** Run the full regression sweep; owner re-runs real PSI on `/`.
- **Max feedback latency:** 5 min for code-task gates; ~20 min for the full sweep.
- **Continuity rule:** no implementation task without an automated verify; Task 4 (inlineCss) is a measured decision checkpoint.

---

## Per-Task Verification Map

| Task | Plan | Requirement | Verified Behavior | Test Type | Automated Command | Status |
|------|------|-------------|-------------------|-----------|-------------------|--------|
| 1 — hero `fetchPriority="high"` + contract-test reconcile | 01 | PSI-03 | Hero LCP preload carries fetchpriority=high; deprecated-priority guard intact | node/contract/PSI | `node --test scripts/component-contracts/launch-image-performance.test.mjs` + hero `fetchPriority="high"` grep | pending |
| 2 — AVIF output | 01 | PSI-08 | `images.formats: ['image/avif','image/webp']`; no extra image keys | node/static | grep next.config.ts `image/avif` + contract test | pending |
| 3 — lazy-load client Sentry SDK | 01 | PSI-05, PSI-06 | No top-level static `@sentry/nextjs` import; dynamic import in DSN guard; `onRouterTransitionStart` exported; no `any` | typecheck/static | `pnpm typecheck` + static greps on instrumentation-client.ts | pending |
| 4 — inlineCss decision (measured) | 01 | PSI-07 | inlineCss enabled only if PSI improves w/o TTFB regression; else documented skip | checkpoint:decision | next.config.ts↔doc consistency check (inlineCss state matches recorded decision) | pending |
| 5 — regression sweep + evidence note | 01 | PSI-03,05,06,07,08 | All guards green; before/after `/` PSI recorded | full-sweep/docs | `pnpm lint && pnpm typecheck && pnpm build && node --test scripts/component-contracts/*.test.mjs && node scripts/seo/probe-crawlable-html.mjs && pnpm exec playwright test tests/e2e/h1-correctness.spec.ts` | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

All infrastructure already exists — no new framework or harness is created in this lean scope:

- `node --test scripts/component-contracts/*.test.mjs` (incl. `launch-image-performance.test.mjs`)
- `scripts/seo/probe-crawlable-html.mjs` (Phase 18 crawlable-HTML guard)
- `tests/e2e/h1-correctness.spec.ts` (Phase 19 single-visible-H1 guard)
- `pnpm lint`, `pnpm typecheck`, `pnpm build`

---

## Manual-Only / Owner-Gated Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real PSI before/after on `/` | PSI-03 | PSI runs against the public preview; owner-run | Re-run Google PSI on `/` after Tasks 1-3 (for the inlineCss decision) and after Task 5; record numbers in `docs/launch/homepage-performance-fixes.md`. |
| inlineCss go/no-go | PSI-07 | Requires the post-fix PSI re-measurement + TTFB judgement | Enable only if it improves `/` PSI without a TTFB/repeat-visit regression; otherwise skip and document why. |

---

## Validation Sign-Off

- [x] Every implementation task has an automated verify command; the one checkpoint (inlineCss) is a measured decision.
- [x] No watch-mode flags.
- [x] Regression guards (image contract test, crawlable-HTML, single-H1, build/lint/typecheck) cover the change surface.
- [x] Scope discipline: homepage `/` Performance only; deferred work untouched.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending execution
