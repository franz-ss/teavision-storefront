---
phase: 20
slug: pagespeed-100-perfection
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-30
---

# Phase 20 - Validation Strategy

> Per-phase validation contract for PageSpeed 100/100 remediation feedback sampling during execution. Derived from the `## Validation Architecture` section of `20-RESEARCH.md`. The **score of record is real Google PSI** against the public noindexed preview; the local Lighthouse harness is the reconciled inner loop.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Frameworks** | Real PSI (REST API), Lighthouse 13.4.0 (local harness), Vitest + React Testing Library, axe-via-Lighthouse, Playwright, Node probe scripts |
| **Config / entry points** | `vitest.config.mts`, `playwright.config.ts`, `scripts/performance/probe-psi.mjs` (new, 20-01), `scripts/performance/probe-lighthouse.mjs` (extended, 20-01), `scripts/performance/check-contrast.mjs` (new, 20-04) |
| **Quick run command** | `pnpm test:unit` with task-owned file filters; `node scripts/performance/check-contrast.mjs` |
| **Score-of-record command** | `pnpm test:psi` (`node scripts/performance/probe-psi.mjs`) against `GSD_PREVIEW_URL` |
| **Inner-loop command** | `pnpm test:performance` (local Lighthouse, reconciled to PSI — absolute LCP is a tripwire only) |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm build && pnpm test:unit && pnpm test:contracts` plus the SEO/crawlable-HTML/H1 regression guards and a warm PSI run |
| **Estimated runtime** | ~5-15 min for code/contrast/harness tasks; ~20-60 min for build + warm PSI + final evidence |

---

## Sampling Rate

- **After every task commit:** Run the task's narrow command (unit/contract test, `check-contrast.mjs`, the relevant probe), then a **warm** PSI re-run for any task that changes a render/image/JS/CSS/caching path.
- **After every plan wave:** Run `pnpm lint`, `pnpm typecheck`, the wave-owned probes, AND the D-09 regression guards (`scripts/seo/probe-launch-seo.mjs`, `scripts/seo/probe-crawlable-html.mjs`, `pnpm exec playwright test tests/e2e/h1-correctness.spec.ts`).
- **Before `$gsd-verify-work`:** Run the full suite plus a consolidated warm PSI run (mobile + desktop) for all 9 routes and the indexable-build SEO score.
- **Max feedback latency:** 10 minutes for code/contrast/harness tasks; 60 minutes for build + warm PSI + final evidence.
- **Continuity rule:** no 3 consecutive task groups without an automated verify command or an explicit manual owner gate.

---

## Per-Task Verification Map

| Task | Plan | Wave | Requirement | Verified Behavior | Test Type | Automated Command | Status |
|------|------|------|-------------|-------------------|-----------|-------------------|--------|
| Confirm preview host / PSI reachability | 01 | 1 | PSI-01 | Public noindexed preview reachable by PSI (or documented fallback) recorded | checkpoint:decision | MANUAL (recorded in psi-evidence.md preamble) | pending |
| probe-psi.mjs + test:psi | 01 | 1 | PSI-01 | Scripted real PSI (mobile+desktop, 4 categories) for all 9 routes | node/network | `node scripts/performance/probe-psi.mjs --help` + `test:psi` key check | pending |
| Extend summarizeLhr + root-cause docs | 01 | 1 | PSI-02 | Harness records Perf/BP/SEO scores + failing-a11y ids; LCP + /account CLS root-caused | node/lighthouse | `pnpm test:performance` + grep for `best-practices`/`seo`/`performance`/`failingA11yAudits` | pending |
| AVIF formats + minimumCacheTTL + resource hints | 02 | 2 | PSI-08, PSI-10 | AVIF output on; cdn.shopify.com preconnected; consent hosts dns-prefetch only | node/static | grep next.config.ts `image/avif`+`minimumCacheTTL`; grep layout `preconnect`+`cdn.shopify.com` | pending |
| Hero fetchPriority=high + dims/LQIP + collection preload 1 + PDP cap | 02 | 2 | PSI-03, PSI-08 | Hero LCP preload carries fetchpriority=high; collection preloads 1 card; PDP serves 2x DPR | unit/static/PSI | `vitest run product-card.test.tsx` + grep hero `fetchPriority` + `FIRST_VISIBLE_PRODUCT_ROW_COUNT = 1`; PSI "LCP request discovery" passes | pending |
| Remove Caveat font + warm PSI re-baseline | 02 | 2 | PSI-09 | Dead font removed; 3 fonts; Space Mono preload kept; warm PSI appended | node/contract | `node --test scripts/component-contracts/performance-fonts.test.mjs` | pending |
| DSN-gate client Sentry SDK | 03 | 3 | PSI-06, PSI-07 | ~142KB Sentry chunk no longer ships when DSN unset; onRouterTransitionStart preserved | build/bundle | `next experimental-analyze` before/after + per-route JS-byte budget assertion | pending |
| JS-byte budget + font Link-header warmup | 03 | 3 | PSI-05, PSI-06 | Per-route JS budget enforced; font Link header warmed/asserted | node/probe | readiness probe JS-budget assertion; harness font-warmup assertion | pending |
| Tags-live ceiling + consent-gate PDP inline + inlineCss A/B | 03 | 3 | PSI-10, PSI-11 | Tags-live PSI measured; inert PDP inline scripts consent-gated; inlineCss A/B recorded | node/PSI/docs | tags-live harness run -> `docs/launch/third-party-ceiling.md` exists | pending |
| OKLCH ink-faint/gold-deep nudges + restrict text-gold | 04 | 4 | PSI-12 | ink-faint/gold-deep clear 4.5:1 at 11px; zero scored color-contrast failures | node/axe | `node scripts/performance/check-contrast.mjs` + ink-faint lightness <=52% assertion | pending |
| Hero scrim / denser trust band (owner approval) | 04 | 4 | PSI-12 | Over-image text clears AA via denser scrim; LCP/fetchPriority posture intact | checkpoint:human-verify | denser-band grep (no `bg-ink/40`) + axe over-image node cleared | pending |
| Heading-order h3->h2 + sr-only h2 + /account CLS | 04 | 4 | PSI-04, PSI-12 | Zero heading-order failures; no 2nd visible h1; /account CLS <= 0.1 | playwright/axe/PSI | `playwright test tests/e2e/h1-correctness.spec.ts` + footer no-`<h3` grep | pending |
| SEO 100 on indexable build + BP tags-off 100 + ceilings | 04 | 4 | PSI-13, PSI-14 | SEO 100 on throwaway indexable build (~69 preview documented); BP 100 tags-off + ceiling | PSI/docs | existence + content checks on seo-100-evidence.md / best-practices-ceiling.md | pending |
| Consolidated evidence pack + impact x effort roadmap | 05 | 5 | PSI-15 | Per-route/category/device scores + honest waivers in one pack | docs/PSI | consolidated psi-evidence.md content check | pending |
| Supersede PERF-01 acceptance + readiness report | 05 | 5 | PSI-15 | performance-acceptance.md + final readiness updated with the real result, no fabricated pass | docs | grep updated acceptance/readiness for the real PSI outcome | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

Existing infrastructure that the phase builds on (no new framework needed):

- `pnpm test:unit`, `pnpm test:contracts`
- `scripts/performance/probe-lighthouse.mjs` (extended in 20-01), `scripts/launch/run-final-readiness-audit.mjs`
- `scripts/seo/probe-launch-seo.mjs`, `scripts/seo/probe-crawlable-html.mjs` (Phase 18 regression guards)
- `tests/e2e/h1-correctness.spec.ts` (Phase 19 single-visible-H1 guard)
- `src/components/collection/product-card/product-card.test.tsx`, `scripts/component-contracts/performance-fonts.test.mjs`
- The fake-provider production lifecycle used by the launch/performance probes

New infrastructure created within the phase (Wave 1): `scripts/performance/probe-psi.mjs`, the extended `summarizeLhr`, and (Wave 4) `scripts/performance/check-contrast.mjs`. Wave 0 is otherwise complete.

---

## Manual-Only / Owner-Gated Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Public noindexed preview reachable by PSI (auth/Deployment-Protection OFF) | PSI-01 | Requires hosting-dashboard access | Confirm the preview URL is publicly fetchable yet `DISABLE_INDEXING=true`; record in psi-evidence.md preamble. |
| Hero scrim density visual sign-off | PSI-12 | Project rule: preview UI before implementing | Owner reviews the before/after hero; approve density or request adjustment. |
| Real CrUX field data | PSI-03, PSI-05 | Field data accrues only post-launch | A fresh preview has no CrUX; INP and field LCP are confirmed post-launch, not pre-launch. |
| Real Shopify hosted checkout / payment / OAuth / B2B pricing | Safety boundary | Owner-gated by project rules | Do not run without explicit owner approval; out of Phase 20 scope. |
| Search Console submission of the indexable build | PSI-14 | Launch-safety boundary | The throwaway indexable build is scored once and NEVER linked or submitted; the public preview stays noindexed. |

---

## Validation Sign-Off

- [x] Every task group has an automated verify command or an explicit manual owner gate.
- [x] Sampling continuity: no 3 consecutive task groups without automated verify.
- [x] Wave 0 covers existing test/probe infrastructure; new probes created in Wave 1/4.
- [x] No watch-mode flags.
- [x] Feedback latency targets defined (real PSI = score of record; local harness = reconciled inner loop).
- [x] D-09 regression guards (crawlable-HTML, single-H1, cacheComponents-enabled) sampled every remediation wave.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending execution
