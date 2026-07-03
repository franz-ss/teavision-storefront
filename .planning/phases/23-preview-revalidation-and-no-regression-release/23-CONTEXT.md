# Phase 23: Preview, Revalidation, and No-Regression Release - Context

**Gathered:** 2026-07-03T09:15:13.5606826+08:00
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 23 adds secure Draft Mode preview for the Sanity-authored homepage, signed homepage cache revalidation through the existing Sanity webhook, and release evidence that blocks rollout if homepage SEO or PageSpeed regresses from the v1.5 baseline.

This phase covers DATA-03, PREVIEW-01, PREVIEW-02, QUALITY-02, and QUALITY-03. It does not add Sanity Studio preview actions, Presentation Tool / Visual Editing, stega markers, arbitrary section reordering, page-builder behavior, CMS-owned Shopify commerce data, or real Shopify checkout testing.

</domain>

<decisions>
## Implementation Decisions

### Preview Entry And Exit
- **D-01:** Draft Mode entry is a secret URL only, using a route such as `/api/draft?secret=...&slug=/`. Do not add Sanity Studio preview actions or Studio config/CORS work in Phase 23.
- **D-02:** Before enabling Draft Mode, the route must validate the preview secret, allow only the site-relative homepage slug `/`, and confirm the `homePage` document exists through the preview-capable read path.
- **D-03:** Preview exit is a disable route only, using `/api/draft/disable` to call `draftMode().disable()` and redirect to `/`. Do not add an in-page preview banner, client preview UI, or exit affordance in Phase 23.
- **D-04:** Invalid preview attempts fail explicitly. Invalid secret returns 401; unsafe slug, unsupported slug, or missing document returns 400 or another clear non-2xx response. Do not quietly redirect to `/` with preview disabled.

### Draft Data Isolation
- **D-05:** Preview mode renders draft homepage body content only. Homepage metadata, Open Graph data, Organization/WebSite JSON-LD, robots/noindex behavior, sitemap, and other SEO surfaces stay published-safe and `stega: false`.
- **D-06:** Keep `getHomepage()` as the published-only, tagged homepage cache boundary. Add a separate token-backed draft helper for preview reads so draft data is never saved under published homepage cache tags.
- **D-07:** Do not enable Sanity stega/source-map markers in Phase 23, even in preview body rendering. Draft Mode preview is content preview only.
- **D-08:** Missing or invalid draft homepage content fails loudly, matching the Phase 22 fail-loud policy. Do not fall back to published content in preview mode.

### Homepage Webhook Proof
- **D-09:** For signed `homePage` webhook payloads, invalidate the current real homepage tags only: `homePage` and `sanity-homepage`. Do not add legacy planned aliases unless implementation intentionally renames the cache tags.
- **D-10:** Preserve existing blog webhook behavior exactly. Homepage handling must not regress `blog`, `blog-{slug}`, or `article-{blogSlug}-{articleSlug}` invalidation.
- **D-11:** Required completion proof is automated route-handler coverage for the Sanity webhook: valid signed `homePage` payloads, invalid signature/payload rejection, existing blog payload behavior, and logging boundaries. A real Sanity publish smoke test belongs in deployment/release checklist documentation, not as a local completion blocker.
- **D-12:** Webhook logging is metadata-only: document type, accepted/rejected status, and booleans such as slug presence. Never log raw webhook body content, signatures, secrets, tokens, unpublished field values, or draft content.

### No-Regression Release Gate
- **D-13:** Real PageSpeed Insights on a deployed public noindexed preview is the homepage PageSpeed score of record. Local Lighthouse remains supporting diagnostic evidence only.
- **D-14:** Any real PSI category score drop from the v1.5 homepage `/` baseline blocks rollout. This applies to Performance, Accessibility, Best Practices, and SEO.
- **D-15:** Local SEO evidence before release approval must include homepage-specific checks for one visible H1, metadata/canonical/noindex/JSON-LD cleanliness, and absence of draft/stega/source-map text in published HTML, plus the existing launch SEO probes where applicable.
- **D-16:** Phase 23 must produce a focused release gate/evidence document recording the v1.5 baseline, current preview PSI/SEO results, pass/fail decision, and a fix-or-rollback rule if any measured score drops.

### Agent Discretion
None. The user explicitly selected decisions for every discussed area.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope And Prior Decisions
- `.planning/ROADMAP.md` - Phase 23 goal, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` - Active v1.6 requirements DATA-03, PREVIEW-01, PREVIEW-02, QUALITY-02, and QUALITY-03.
- `.planning/PROJECT.md` - Current milestone context, no SEO/PageSpeed regression constraint, v1.5 PSI baseline, and key decisions.
- `.planning/STATE.md` - Current project state and Phase 23 readiness position.
- `.planning/phases/22-storefront-data-and-rendering/22-CONTEXT.md` - Direct dependency: fail-loud homepage rendering, metadata ownership, image/LCP discipline, and deferred preview/revalidation/release gates.
- `.planning/phases/22-storefront-data-and-rendering/22-VERIFICATION.md` - Phase 22 handoff stating that preview, webhook revalidation, release PageSpeed proof, release SEO proof, and rollout/rollback gating remain Phase 23.
- `.planning/phases/22-storefront-data-and-rendering/22-VALIDATION.md` - Phase 22 validation notes and Phase 23 coverage boundary.
- `.planning/phases/22-storefront-data-and-rendering/22-08-SUMMARY.md` - Final Phase 22 release-readiness handoff into Phase 23.
- `.planning/phases/21-sanity-homepage-model-and-seed/21-01-SUMMARY.md` - Sanity `homePage` singleton/schema/seed dependency.

### Sanity Homepage And Research
- `docs/sanity-homepage-cms-integration-plan.md` - Local integration plan sections for Draft Mode, preview secrets, cache revalidation, deployment checklist, and no-regression release proof.
- `.planning/research/SUMMARY.md` - v1.6 research summary recommending secure Draft Mode plus webhook revalidation before Visual Editing/Presentation.
- `.planning/research/FEATURES.md` - Preview/revalidation feature notes and anti-features.
- `.planning/research/PITFALLS.md` - Release-blocking pitfalls: SEO/PageSpeed regression, stega leaks, cache contamination, and page-builder scope creep.
- `../teavision-cms/schemaTypes/documents/home-page.ts` - Sibling Studio `homePage` singleton type and document ownership.
- `../teavision-cms/scripts/seed-home-page/data.ts` - Seeded homepage content shape and document existence reference.

### Storefront Implementation Surfaces
- `src/app/(storefront)/page.tsx` - Homepage route, `generateMetadata()`, published `getHomepage()` use, fixed section order, and JSON-LD output.
- `src/app/(storefront)/page.test.tsx` - Existing route tests for section order, singular H1, metadata/noindex behavior, and no blank streamed shell.
- `src/lib/sanity/client.ts` - Current published-only Sanity client using `useCdn: false`, `perspective: 'published'`, and `stega: false`.
- `src/lib/sanity/env.ts` - Sanity env helpers; Phase 23 likely adds preview-secret handling here or a sibling env module.
- `src/lib/sanity/home-page.ts` - Published homepage fetch/reshape boundary, fail-loud validation, and current cache tags `homePage` and `sanity-homepage`.
- `src/lib/sanity/home-page.test.ts` - Existing homepage validation/cache tests.
- `src/lib/sanity/queries/home-page.ts` - Current homepage GROQ query.
- `src/lib/sanity/queries/home-page.test.ts` - Query field coverage.
- `src/app/api/webhooks/sanity/route.ts` - Existing signed Sanity webhook route and blog/article invalidation behavior.

### Next.js 16 Local Docs
- `node_modules/next/dist/docs/01-app/02-guides/draft-mode.md` - App Router Draft Mode guide for this installed Next.js version.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/draft-mode.md` - `draftMode()` API reference.
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` - Route handler conventions.
- `node_modules/next/dist/docs/01-app/02-guides/how-revalidation-works.md` - Revalidation behavior.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md` - `revalidateTag()` API reference.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheTag.md` - `cacheTag()` API reference.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` - Metadata API reference for preserving published-safe SEO output.

### Release Evidence And Probes
- `docs/launch/homepage-performance-fixes.md` - v1.5 homepage performance fix record.
- `docs/launch/performance-evidence.md` - Current local Lighthouse evidence format and diagnostic behavior.
- `docs/launch/final-production-readiness-report.md` - Existing final readiness report shape and owner-gated proof separation.
- `.planning/MILESTONES.md` - v1.5 PSI baseline and deferred broader PageSpeed scope.
- `.planning/RETROSPECTIVE.md` - Decision that real PSI on a public preview is the score of record while local Lighthouse is diagnostic.
- `scripts/performance/probe-lighthouse.mjs` - Existing local Lighthouse probe and evidence writer.
- `scripts/launch/run-final-readiness-audit.mjs` - Existing final readiness audit matrix and performance acceptance handling.
- `scripts/seo/probe-launch-seo.mjs` - Existing launch SEO probe.
- `scripts/component-contracts/seo-audit-page-html.test.mjs` - Existing crawlable/SEO page HTML contract coverage.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/sanity/home-page.ts` - Published homepage operation already validates render-critical content, reshapes Sanity into app-facing props, and tags `homePage` plus `sanity-homepage`.
- `src/lib/sanity/client.ts` - Published Sanity client should remain `perspective: 'published'` and `stega: false`; draft preview needs a separate helper/client path.
- `src/app/api/webhooks/sanity/route.ts` - Existing signed webhook route already uses `parseBody()` with `SANITY_REVALIDATE_SECRET`, structured metadata logging, and `revalidateTag()`.
- `src/app/(storefront)/page.tsx` - Homepage route already fetches published content for render and metadata, emits code-owned JSON-LD, and preserves fixed section order.
- `scripts/performance/probe-lighthouse.mjs`, `scripts/seo/probe-launch-seo.mjs`, and `scripts/launch/run-final-readiness-audit.mjs` - Existing release evidence machinery to extend or reference for Phase 23.

### Established Patterns
- Server Components fetch through typed helper modules; presentation components receive app-facing props.
- Next.js 16 Cache Components are enabled. Published cache helpers use `'use cache'`, `cacheTag()`, and `cacheLife()`; route handlers use `revalidateTag()` for external invalidation.
- Runtime APIs such as Draft Mode, cookies, or request data must stay outside the published cached helper unless the installed Next docs explicitly support the chosen pattern.
- The project separates automated local evidence from owner/external proof. Real Shopify checkout and other owner-gated flows remain outside automated local tests.
- SEO output must preserve `withNoindexRobots()`, one visible H1 per standalone route, code-owned Organization/WebSite JSON-LD, and published-safe metadata.
- No default exports for components/lib modules, no `any`, no raw class colors, and no broad styling or UI scope in this phase.

### Integration Points
- Add preview routes under `src/app/api/draft/route.ts` and `src/app/api/draft/disable/route.ts` or equivalent App Router route-handler paths.
- Add preview env support for `SANITY_PREVIEW_SECRET`; use `SANITY_API_READ_TOKEN` for draft reads.
- Add a draft-aware Sanity read helper that can confirm `homePage` existence and fetch draft body data without reusing published cache tags.
- Update the homepage route to choose draft body content only when Draft Mode is enabled, while keeping metadata/JSON-LD published-safe.
- Extend `src/app/api/webhooks/sanity/route.ts` for `_type === 'homePage'` to revalidate `homePage` and `sanity-homepage` while preserving blog behavior.
- Add route-handler tests for draft routes and Sanity webhook behavior; add homepage SEO leak checks to existing or new tests.
- Add a focused release gate document under `docs/launch/` or the Phase 23 directory, then reference it from final phase evidence.

</code_context>

<specifics>
## Specific Ideas

- Keep Phase 23 conservative: secret URL preview, no Studio wiring, no visible preview banner, no stega/source-map markers, and no Visual Editing.
- Preview is for editor confidence in draft body content only. Published visitors and crawlers must never receive draft content or preview markers.
- Homepage webhook proof should be automated and local-first; real Sanity publish verification is important for deployment, but not a local completion blocker.
- The release gate should be explicit enough that a lower PSI category score produces a clear fix-or-rollback decision rather than an ambiguous launch conversation.

</specifics>

<deferred>
## Deferred Ideas

- Sanity Studio preview action/link for `/` - future editor-experience phase if the owner wants one-click preview from Studio.
- In-page preview banner/exit UI - future preview UX improvement, not Phase 23.
- Sanity Presentation Tool, Visual Editing, stega markers, source maps, or `defineLive`/live content - defer until secure Draft Mode and no-regression release path are stable.

</deferred>

---

*Phase: 23-Preview, Revalidation, and No-Regression Release*
*Context gathered: 2026-07-03T09:15:13.5606826+08:00*
