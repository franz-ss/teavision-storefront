# Phase 23 Homepage Release Gate

## Decision

Status: Blocked - awaiting public-preview PSI
Date opened: 2026-07-03
Scope: homepage `/` Draft Mode preview, Sanity `homePage` revalidation, and no-regression launch proof.

This document is the release gate for shipping Phase 23 to a deployed preview or production rollout. Local tests can prove implementation safety, but they do not approve launch by themselves. Real public-preview PageSpeed Insights evidence is required before rollout approval.

## Baseline Of Record

Source: v1.5 owner-run Google PageSpeed Insights on `/`, dated 2026-07-01. Supporting records live in `.planning/MILESTONES.md`, `.planning/RETROSPECTIVE.md`, and `docs/launch/homepage-performance-fixes.md`.

| Metric | v1.5 baseline | Gate |
| --- | ---: | --- |
| Performance | 95-97 | Current score must be at least 95 |
| Accessibility | 100 | Current score must be 100 |
| Best Practices | 100 | Current score must be 100 |
| SEO | 100 | Current score must be 100 |
| Speed Index | 1.9 s | Record for trend review |
| Total Blocking Time | 30 ms | Record for trend review |
| Cumulative Layout Shift | 0 | Record for trend review |
| Largest Contentful Paint | about 3.0 s | Record for trend review |

Real PSI on a public preview is the score of record. Local Lighthouse and local Vitest coverage are diagnostic or regression evidence only.

## Current Public-Preview PSI

Fill these rows before rollout approval.

| Field | Evidence |
| --- | --- |
| Public preview URL | Pending |
| PSI report URL | Pending |
| Run date | Pending |
| Runner | Pending |
| Strategy | Google PageSpeed Insights mobile run against the deployed public preview for `/`; preview may remain noindexed, but it must be publicly reachable by PSI. |
| Launch decision | Blocked - awaiting public-preview PSI |
| Fix-or-rollback note | Required if any PSI category score is lower than the v1.5 baseline. |

| Category | Baseline | Current | Result |
| --- | ---: | ---: | --- |
| Performance | 95 minimum | Pending | Blocked |
| Accessibility | 100 | Pending | Blocked |
| Best Practices | 100 | Pending | Blocked |
| SEO | 100 | Pending | Blocked |

Any category-score drop blocks rollout. If a deployed change has already rolled out and a category drops below baseline, leave the decision blocked and add a dated fix-or-rollback note before proceeding.

## Local Automated Evidence

These checks prove the code path is safe enough to deploy for owner/public-preview verification.

| Behavior | Proof |
| --- | --- |
| Draft reads stay isolated from published cache tags | `pnpm test:unit -- src/lib/sanity/home-page.test.ts` |
| Draft Mode entry and disable routes are secret-validated and homepage-only | `pnpm exec vitest run --environment node src/app/api/draft/route.test.ts src/app/api/draft/disable/route.test.ts` |
| Homepage Draft Mode changes body data only | `pnpm test:unit -- "src/app/(storefront)/page.test.tsx"` |
| Published SEO remains clean | Task 3 homepage tests cover one visible H1, metadata/canonical/noindex behavior, Organization/WebSite JSON-LD, and absence of draft, stega, or source-map marker text in published HTML. |
| Signed Sanity webhook revalidates homepage tags | `pnpm exec vitest run --environment node src/app/api/webhooks/sanity/route.test.ts` |
| Final local regression sweep | `pnpm lint -- --quiet`, `pnpm typecheck`, targeted unit tests, `pnpm test:integration`, and `pnpm build` |

## Owner And Deployment Evidence

These items require a deployed preview and configured Sanity/webhook environment. Do not mark them complete from local evidence.

| Item | Owner/deployment proof | Status |
| --- | --- | --- |
| `SANITY_PREVIEW_SECRET` configured | Dated environment confirmation for preview deployment; do not paste secret value. | Pending |
| `SANITY_API_READ_TOKEN` configured | Dated environment confirmation for preview deployment; do not paste token value. | Pending |
| Draft preview opens `/` only | Visit `/api/draft?secret=<redacted>&slug=/` on preview, confirm redirect to `/` and draft body content only. | Pending |
| Draft disable exits preview | Visit `/api/draft/disable` on preview, confirm redirect to `/` and published body content. | Pending |
| Sanity webhook configured | Dated Sanity webhook target confirmation with signed requests enabled; do not paste secret value. | Pending |
| Sanity publish smoke test | Publish a harmless homepage copy change, confirm preview updates without redeploy, then revert or publish the intended final copy. | Pending |
| Current public-preview PSI | Add the PSI report URL and scores above. | Pending |

## Sanity Publish Smoke Test

Use a harmless copy edit on the `homePage` singleton after deployment.

1. Confirm the preview deployment has `SANITY_REVALIDATE_SECRET` configured.
2. In Sanity, publish a small homepage copy change that is safe to reverse.
3. Confirm the Sanity webhook returns a success response for `_type: homePage`.
4. Refresh `/` on the deployed preview and confirm the copy updates without a redeploy.
5. Revert the copy change or publish the intended final copy.
6. Record the date, preview URL, webhook result, and verifier in this document.

Smoke-test result: Pending

## Rollback Rule

Rollout remains blocked until both are true:

- Current public-preview PSI category scores are recorded and none are below the v1.5 baseline.
- The Sanity publish smoke test proves homepage changes revalidate without redeploy.

If either condition fails after deployment, stop rollout. Fix forward only when the failing PSI category or publish path is understood and verified; otherwise roll back the deployed change and keep this document blocked with a dated note.
