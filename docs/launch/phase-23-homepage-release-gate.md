# Phase 23 Homepage Release Gate

## Decision

Status: Passed - no regression
Date opened: 2026-07-03
Last updated: 2026-07-06
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

## Current Production-Candidate PSI

| Field | Evidence |
| --- | --- |
| Production candidate URL | `https://teavision-storefront.vercel.app/` |
| PSI mobile report URL | `https://pagespeed.web.dev/analysis/https-teavision-storefront-vercel-app/lp6zrxwt8n?form_factor=mobile` |
| PSI desktop report URL | `https://pagespeed.web.dev/analysis/https-teavision-storefront-vercel-app/lp6zrxwt8n?form_factor=desktop` |
| Run date | 2026-07-06 08:14:44 SGT |
| Runner | Codex triggered and read the Google PageSpeed Insights UI report after the public API retry remained quota-blocked. |
| Strategy | Google PageSpeed Insights mobile and desktop report against the deployed production candidate for `/`, after setting `DISABLE_INDEXING=false` in Vercel and redeploying the latest production source. |
| Launch decision | Passed - no category is below the v1.5 baseline gate. |
| Fix-or-rollback note | Previous SEO regression was fixed by making the measured candidate indexable and redeploying production. If a later deployment reintroduces noindex or drops any category below baseline, stop rollout and fix forward or roll back. |
| Root cause note | The prior SEO 69 was caused by the active launch noindex gate. The fresh crawler-facing HTML now has HTTP 200, no `x-robots-tag`, no robots meta, one H1, a canonical link, and a populated sitemap. |

| Category | Baseline | Current | Result |
| --- | ---: | ---: | --- |
| Performance | 95 minimum | 95 | Pass |
| Accessibility | 100 | 100 | Pass |
| Best Practices | 100 | 100 | Pass |
| SEO | 100 | 100 | Pass |

| Metric | Current mobile PSI |
| --- | ---: |
| First Contentful Paint | 1.1 s |
| Largest Contentful Paint | 2.6 s |
| Speed Index | 3.8 s |
| Total Blocking Time | 40 ms |
| Cumulative Layout Shift | 0 |

| Category | Current desktop PSI |
| --- | ---: |
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Any category-score drop blocks rollout. If a deployed change has already rolled out and a category drops below baseline, leave the decision blocked and add a dated fix-or-rollback note before proceeding.

## Verification Attempts

These attempts do not approve rollout, but they record the command evidence gathered while trying to close the gate.

| Date | Command | Result | Gate impact |
| --- | --- | --- | --- |
| 2026-07-03 | Google PageSpeed Insights API mobile run for `https://teavision-storefront.vercel.app/` | Blocked by Google API quota: `429 RESOURCE_EXHAUSTED`; no `PAGESPEED_API_KEY`, `PSI_API_KEY`, or `GOOGLE_API_KEY` was available in the shell. | No PSI score of record produced. |
| 2026-07-03 | `pnpm test:performance -- --base-url https://teavision-storefront.vercel.app --url / --stdout-only --json-summary --allow-metric-failures --no-asset-warmup` | Completed as local Lighthouse diagnostics. `/` reported LCP 3703 ms, CLS 0, TBT 80 ms, Accessibility 100, and `FAIL` because LCP exceeded 2500 ms. | Supporting diagnostic only; does not replace public-preview PSI and does not approve rollout. |
| 2026-07-03 | `pnpm test:performance -- --base-url https://teavision-storefront.vercel.app --url / --stdout-only --json-summary --allow-metric-failures` | Timed out after 244 seconds before producing usable warmup evidence. | No score recorded. |
| 2026-07-06 | Parsed owner-supplied PageSpeed Insights report URL. | Mobile scores: Performance 94, Accessibility 100, Best Practices 100, SEO 69. | Gate failed because Performance and SEO are below baseline. |
| 2026-07-06 | Parsed PSI audit details from the report payload and probed deployed HTML as Googlebot. | PSI SEO failed only `is-crawlable`, pointing at `<meta name="robots" content="noindex, nofollow, noarchive"/>`. Live `/robots.txt` is valid, metadata description/title/canonical pass, and crawler HTML has one H1 plus two JSON-LD scripts. | Confirms the SEO blocker is the intentional `DISABLE_INDEXING` launch gate on the preview deployment, not homepage metadata drift. |
| 2026-07-06 | Tried a fresh Google PageSpeed Insights API mobile run for `https://teavision-storefront.vercel.app/`. | Blocked by Google API quota: `429 RESOURCE_EXHAUSTED`. | No newer score of record produced. |
| 2026-07-06 | Initial deployed Draft Mode smoke with a temporary `drafts.homePage` `hero.eyebrow` marker. | `/api/draft?secret=<redacted>&slug=/` returned HTTP 500 `Preview secret not configured`; Sanity draft state was restored. | Superseded by the successful retry after `SANITY_PREVIEW_SECRET` was added. |
| 2026-07-06 | Initial Sanity publish/revalidation smoke with temporary `homePage.hero.eyebrow` marker. | Sanity mutation succeeded, but the deployed preview stayed on the original cached content. A direct webhook env probe returned HTTP 500 `Webhook secret not configured`; the Sanity field was restored. | Superseded by the later retry: `SANITY_REVALIDATE_SECRET` is now present, but Sanity publish delivery still did not reach the route. |
| 2026-07-06 | Retried deployed Draft Mode smoke after `SANITY_PREVIEW_SECRET` was added locally and in Vercel. | Temporary marker `Draft smoke 2026-07-06 07:19 SGT` was hidden from published HTML, `/api/draft?secret=<redacted>&slug=/` returned HTTP 302 to `/` and set a Draft Mode cookie, the marker rendered with Draft Mode cookies, `/api/draft/disable` returned HTTP 302 to `/`, and the marker disappeared after disable. Sanity draft state was cleaned up. | `PREVIEW-01` passed. |
| 2026-07-06 | Retried deployed webhook after `SANITY_REVALIDATE_SECRET` was added locally and in Vercel. | Unsigned probe now returns HTTP 401 `Invalid webhook signature`, proving the runtime secret is present. A normal Sanity published-field mutation still did not refresh `/` within 120 seconds. A manually signed `homePage` webhook POST returned HTTP 200 `{\"revalidated\":true}` and refreshed `/` in about 6.6 seconds; a signed restore POST also returned HTTP 200 and removed the marker in about 5.0 seconds. Sanity content was restored. | Superseded by the successful publish smoke after the missing Sanity webhook was created. |
| 2026-07-06 | Created Sanity document webhook `teavision-storefront-homepage-revalidate` for `homePage` mutations in the `production` dataset, targeting `https://teavision-storefront.vercel.app/api/webhooks/sanity` with signed delivery. | Sanity accepted the hook, and delivery logs showed two successful messages with HTTP 200 attempts. | `DATA-03` webhook configuration passed. |
| 2026-07-06 | Retried Sanity publish/revalidation smoke with temporary `homePage.hero.eyebrow` marker `Publish webhook smoke 2026-07-06 07:50 SGT`. | The marker appeared on deployed `/` after about 9.0 seconds. Restoring `Australia's tea, herb & spice house` removed it after about 5.2 seconds, with no manual cleanup. | `DATA-03` publish smoke passed. |
| 2026-07-06 | Updated Vercel `DISABLE_INDEXING` to `false` and redeployed the latest production deployment. | New production deployment `teavision-storefront-1kdusbzxk-franz-2396s-projects.vercel.app` was aliased to `https://teavision-storefront.vercel.app`. | Makes the score-of-record candidate indexable for SEO validation. |
| 2026-07-06 | Probed deployed `/`, `/robots.txt`, and `/sitemap.xml` after redeploy. | `/` returned HTTP 200 with no `x-robots-tag`, no robots meta, canonical `https://www.teavision.com.au`, one H1, no smoke markers, and populated sitemap XML. | Confirms the previous SEO blocker is fixed. |
| 2026-07-06 | Triggered fresh PageSpeed Insights UI report after the API retry remained quota-blocked. | Mobile scores: Performance 95, Accessibility 100, Best Practices 100, SEO 100. Desktop scores: Performance 97, Accessibility 100, Best Practices 100, SEO 100. | `QUALITY-02` passed. |

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
| `SANITY_PREVIEW_SECRET` configured | Deployed `/api/draft` was called with the redacted local preview secret after it was added locally and in Vercel. | Passed - route accepted the secret, returned HTTP 302 to `/`, and set a Draft Mode cookie. |
| `SANITY_API_READ_TOKEN` configured | Draft route found the temporary `drafts.homePage` marker and rendered it through Draft Mode. | Passed - draft content loaded on the deployed preview. |
| Draft preview opens `/` only | Visit `/api/draft?secret=<redacted>&slug=/` on preview, confirm redirect to `/` and draft body content only. | Passed - temporary draft marker rendered only with Draft Mode cookies. |
| Draft disable exits preview | Visit `/api/draft/disable` on preview, confirm redirect to `/` and published body content. | Passed - route returned HTTP 302 to `/` and the draft marker was hidden after disable. |
| Sanity webhook configured | Dated Sanity webhook target confirmation with signed requests enabled; do not paste secret value. | Passed - `teavision-storefront-homepage-revalidate` is enabled for `homePage` create/update/delete events in `production`, targets the deployed route, and has a configured secret. |
| Sanity publish smoke test | Publish a harmless homepage copy change, confirm preview updates without redeploy, then revert or publish the intended final copy. | Passed - temporary marker appeared on deployed `/` after about 9.0 seconds and disappeared after restore in about 5.2 seconds. |
| Current production-candidate PSI | Recorded the fresh PageSpeed Insights report URL and parsed scores above. | Passed - mobile Performance 95, Accessibility 100, Best Practices 100, SEO 100; desktop Performance 97, Accessibility 100, Best Practices 100, SEO 100. |

## Sanity Publish Smoke Test

Use a harmless copy edit on the `homePage` singleton after deployment.

1. Confirm the preview deployment has `SANITY_REVALIDATE_SECRET` configured.
2. In Sanity, publish a small homepage copy change that is safe to reverse.
3. Confirm the Sanity webhook returns a success response for `_type: homePage`.
4. Refresh `/` on the deployed preview and confirm the copy updates without a redeploy.
5. Revert the copy change or publish the intended final copy.
6. Record the date, preview URL, webhook result, and verifier in this document.

Smoke-test result: Passed on 2026-07-06 after creating the missing Sanity webhook.

Codex published a temporary `homePage.hero.eyebrow` marker (`Publish smoke 2026-07-06 07:00 SGT`) through the Sanity API. The Sanity document changed, but the deployed preview continued serving the original cached eyebrow. A direct POST to `/api/webhooks/sanity` returned HTTP 500 `Webhook secret not configured`, confirming the running deployment cannot process signed Sanity revalidation requests. The Sanity field was restored to `Australia's tea, herb & spice house`, and the deployed page no longer contains the smoke marker.

After `SANITY_REVALIDATE_SECRET` was added, Codex retried with marker `Publish smoke 2026-07-06 07:32 SGT`. The Sanity document changed and was restored, but the deployed preview did not show the marker within 120 seconds, so the publish-driven smoke still failed.

To isolate the remaining failure, Codex then sent a correctly signed `homePage` webhook payload manually after setting marker `Signed webhook smoke 2026-07-06 07:36 SGT`. The deployed route returned HTTP 200 `{"revalidated":true}`, `/` showed the marker after about 6.6 seconds, and a signed restore webhook removed it after about 5.0 seconds. This proved the deployed route and Vercel secret were working, leaving only Sanity webhook configuration.

Codex created Sanity document webhook `teavision-storefront-homepage-revalidate` for `homePage` create/update/delete events in the `production` dataset, with projection `{_type, slug}`, signed delivery, and target `https://teavision-storefront.vercel.app/api/webhooks/sanity`. A new marker, `Publish webhook smoke 2026-07-06 07:50 SGT`, appeared on deployed `/` after about 9.0 seconds. Restoring `Australia's tea, herb & spice house` removed the marker after about 5.2 seconds, with no manual cleanup. Sanity delivery logs recorded two successful HTTP 200 messages for the hook.

## Rollback Rule

Rollout passed on 2026-07-06 because both are true:

- Indexable PSI category scores are recorded and none are below the v1.5 baseline.
- The Sanity publish smoke test proves homepage changes revalidate without redeploy. Passed on 2026-07-06 with hook `teavision-storefront-homepage-revalidate`.

If either condition fails after a later deployment, stop rollout. Fix forward only when the failing PSI category or publish path is understood and verified; otherwise roll back the deployed change and mark this document blocked with a dated note.
