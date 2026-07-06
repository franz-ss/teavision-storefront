---
phase: 23
phase_name: preview-revalidation-and-no-regression-release
status: passed
verified_at: 2026-07-06T08:16:34+08:00
score: 5/5 release requirements verified
automated_checks:
  passed: 5
  failed: 0
deployed_checks:
  passed: 6
  failed: 0
regressions: []
---

# Phase 23 Verification Report

**Phase Goal:** Add secure Draft Mode preview, homepage cache revalidation, and rollout evidence that blocks any SEO or PageSpeed regression.

## Result

Phase 23 passes local automated verification and the deployed release gate.

On 2026-07-06, Codex tested the deployed production candidate `https://teavision-storefront.vercel.app/`. Draft Mode preview passed after `SANITY_PREVIEW_SECRET` was added locally and in Vercel. Manual signed webhook revalidation passed after `SANITY_REVALIDATE_SECRET` was added. The missing Sanity document webhook was then created, and the real Sanity publish smoke passed end to end: a temporary published `homePage.hero.eyebrow` marker appeared on `/` in about 9.0 seconds and disappeared after restore in about 5.2 seconds, with Sanity delivery logs showing HTTP 200 attempts.

The original owner-supplied PageSpeed report failed because the measured deployment still had `DISABLE_INDEXING` enabled, causing SEO 69, and mobile Performance was 94. Codex set Vercel `DISABLE_INDEXING=false`, redeployed the latest production source, verified crawler-facing HTML was indexable, and triggered a fresh PageSpeed Insights UI report. The fresh score of record passed: mobile 95/100/100/100 and desktop 97/100/100/100.

## Requirement Coverage

| Requirement | Status | Evidence |
| --- | --- | --- |
| DATA-03 | VERIFIED DEPLOYED | Signed `homePage` webhook code and integration tests pass locally. Deployed route env works: unsigned probe returns HTTP 401, and a manually signed `homePage` payload returns HTTP 200 `{\"revalidated\":true}` and refreshes `/`. After creating Sanity webhook `teavision-storefront-homepage-revalidate`, the actual Sanity publish smoke passed: marker `Publish webhook smoke 2026-07-06 07:50 SGT` appeared on `/` in about 9.0 seconds, restored in about 5.2 seconds, and Sanity delivery logs show two HTTP 200 messages. |
| PREVIEW-01 | VERIFIED DEPLOYED | Retry after `SANITY_PREVIEW_SECRET` was added: `/api/draft?secret=<redacted>&slug=/` returned HTTP 302 to `/`, set a Draft Mode cookie, rendered temporary draft marker `Draft smoke 2026-07-06 07:19 SGT`, and `/api/draft/disable` returned HTTP 302 to `/` with the marker hidden afterward. |
| PREVIEW-02 | VERIFIED | Local tests assert published-safe metadata, no draft/stega/source-map leakage, and draft body isolation. Deployed public HTML did not expose the temporary draft marker while a `drafts.homePage` smoke draft existed. |
| QUALITY-02 | VERIFIED DEPLOYED | Fresh indexable PageSpeed Insights report for `/` passed the v1.5 no-regression gate. Mobile report `https://pagespeed.web.dev/analysis/https-teavision-storefront-vercel-app/lp6zrxwt8n?form_factor=mobile` recorded Performance 95, Accessibility 100, Best Practices 100, SEO 100. Desktop view recorded Performance 97, Accessibility 100, Best Practices 100, SEO 100. |
| QUALITY-03 | VERIFIED | The release gate first blocked rollout on measured regression evidence, then allowed rollout only after the failing noindex condition was fixed, production was redeployed, crawler HTML was verified, and fresh PSI evidence passed. |

**Coverage:** 5/5 release requirements verified.

## Automated Verification

| Check | Status | Evidence |
| --- | --- | --- |
| Focused homepage and Sanity unit coverage | PASSED | `pnpm test:unit -- src/lib/sanity/client.test.ts src/lib/sanity/home-page.test.ts "src/app/(storefront)/page.test.tsx"` passed: 70 files / 301 tests. |
| Route-handler integration coverage | PASSED | `pnpm test:integration` passed: 12 files / 62 tests, including draft routes and Sanity webhook route tests. |
| Lint | PASSED | `pnpm lint --quiet` passed, including Tailwind class checks and ESLint. |
| TypeScript | PASSED | `pnpm typecheck` passed. |
| Next production build | PASSED | `pnpm build` passed with Next.js 16.2.9 and Cache Components enabled. Build emitted expected metadata-only `draft_preview_rejected` logs for missing build-time preview secret during route analysis. |

No real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests were run.

## Deployed Verification

| Check | Status | Evidence |
| --- | --- | --- |
| Current production-candidate PSI | PASSED | Report URL: `https://pagespeed.web.dev/analysis/https-teavision-storefront-vercel-app/lp6zrxwt8n?form_factor=mobile`. Run time: 2026-07-06 08:14:44 SGT. Mobile scores: Performance 95, Accessibility 100, Best Practices 100, SEO 100. Desktop scores from the same report id: Performance 97, Accessibility 100, Best Practices 100, SEO 100. |
| Crawler indexability | PASSED | After Vercel `DISABLE_INDEXING=false` and production redeploy `teavision-storefront-1kdusbzxk-franz-2396s-projects.vercel.app`, deployed `/` returned HTTP 200 with no `x-robots-tag`, no robots meta, canonical `https://www.teavision.com.au`, one H1, no smoke markers, and a populated sitemap. |
| Draft preview smoke | PASSED | Temporary draft marker `Draft smoke 2026-07-06 07:19 SGT` was hidden from published HTML, visible with Draft Mode cookies after HTTP 302 enable, and hidden again after HTTP 302 disable. Cleanup removed the smoke draft. |
| Draft leakage guard | PASSED | The deployed public homepage did not contain the temporary draft marker when fetched without Draft Mode cookies. |
| Sanity publish smoke | PASSED | After creating Sanity webhook `teavision-storefront-homepage-revalidate`, temporary marker `Publish webhook smoke 2026-07-06 07:50 SGT` was published to `homePage.hero.eyebrow`; the deployed preview showed it after about 9.0 seconds. Restoring `Australia's tea, herb & spice house` removed the marker after about 5.2 seconds, with no manual cleanup. |
| Manual signed webhook revalidation | PASSED | Temporary marker `Signed webhook smoke 2026-07-06 07:36 SGT` was published to `homePage.hero.eyebrow`; a correctly signed `homePage` webhook POST returned HTTP 200 `{\"revalidated\":true}` and `/` showed the marker after about 6.6 seconds. A signed restore POST returned HTTP 200 and `/` hid the marker after about 5.0 seconds. |
| Release blocking behavior | PASSED | `docs/launch/phase-23-homepage-release-gate.md` records the failed 06:42 report, the fix, and the passing 08:14 report. The gate blocks on regression and passes only after verified remediation. |

## Goal-Backward Verification

| Truth | Status | Evidence |
| --- | --- | --- |
| Draft homepage reads are token-backed and isolated from published cache tags. | VERIFIED LOCALLY | Unit tests cover the draft Sanity client boundary, required token behavior, drafts perspective, disabled CDN, disabled stega, and uncached draft helper behavior. |
| The homepage body can render draft data while published metadata and JSON-LD stay published-owned. | VERIFIED DEPLOYED | Draft Mode retry rendered the temporary draft marker only with Draft Mode cookies, while public HTML stayed on published content. |
| Signed `homePage` webhooks invalidate homepage cache tags without regressing blog revalidation. | VERIFIED DEPLOYED | The deployed route successfully revalidated `/` for a manually signed `homePage` payload, and Sanity's configured `homePage` document webhook refreshed `/` after both the publish marker and restore mutations. |
| Release evidence proves current public-preview SEO/PageSpeed scores are unchanged or improved before rollout. | VERIFIED DEPLOYED | Fresh indexable PageSpeed Insights evidence records mobile 95/100/100/100 and desktop 97/100/100/100, meeting the v1.5 no-regression gate. |
| Rollout is blocked or rolled back if measured SEO/PageSpeed scores regress. | VERIFIED | The gate blocked on the failed 06:42 report and passed only after the root cause was fixed and a fresh report passed. |

## Required Remediation

None remaining for Phase 23. Keep `DISABLE_INDEXING=false` on the measured production candidate while it is expected to be crawlable, and rerun the gate after any later deployment that changes metadata, robots, homepage rendering, or performance-critical assets.

## Gaps Summary

No Phase 23 release blockers remain.

## Verification Metadata

**Verification approach:** Goal-backward verification against Phase 23 roadmap goal, REQUIREMENTS.md, 23-01-SUMMARY.md, deployed preview smoke tests, Sanity Content Lake state checks, crawler-facing HTML probes, and fresh Google PageSpeed Insights UI evidence.
**Must-haves source:** ROADMAP.md success criteria, REQUIREMENTS.md, and `docs/launch/phase-23-homepage-release-gate.md`.
**Verifier:** Codex inline phase verification.

---

_Verified: 2026-07-06T08:16:34+08:00_
