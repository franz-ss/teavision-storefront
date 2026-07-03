# Phase 23: Preview, Revalidation, and No-Regression Release - Research

**Researched:** 2026-07-03
**Status:** Ready for planning

## Research Question

What does Phase 23 need to implement secure Draft Mode preview, signed
homepage cache revalidation, and no-regression release evidence without
weakening the Phase 22 homepage boundary or the v1.5 PageSpeed/SEO baseline?

## Summary

Phase 23 should be a conservative integration phase with three implementation
tracks:

1. Add token-backed homepage draft reads and secure Draft Mode entry/exit
   routes for `/` only.
2. Extend the existing signed Sanity webhook route so `homePage` payloads
   immediately expire the current homepage cache tags while preserving blog
   behavior.
3. Add release evidence that compares current homepage SEO/PageSpeed output
   against the v1.5 baseline and fails rollout if any measured category drops.

Do not adopt Sanity Visual Editing, Presentation Tool, `defineLive`, stega,
Studio preview actions, broad page-builder behavior, or real Shopify checkout
testing in this phase. The official Sanity 2026 Cache Components guidance is
useful for understanding draft/published layering, but its Visual Editing/live
content path is intentionally out of scope for the locked Phase 23 decisions.

## Inputs Read

- `.planning/phases/teavision-23-preview-revalidation-and-no-regression-release/23-CONTEXT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `docs/sanity-homepage-cms-integration-plan.md`
- `docs/launch/homepage-performance-fixes.md`
- `docs/launch/performance-evidence.md`
- `docs/launch/final-production-readiness-report.md`
- `.planning/MILESTONES.md`
- `.planning/RETROSPECTIVE.md`
- `src/app/(storefront)/page.tsx`
- `src/app/(storefront)/page.test.tsx`
- `src/lib/sanity/client.ts`
- `src/lib/sanity/env.ts`
- `src/lib/sanity/home-page.ts`
- `src/lib/sanity/home-page.test.ts`
- `src/lib/sanity/queries/home-page.ts`
- `src/lib/sanity/queries/home-page.test.ts`
- `src/app/api/webhooks/sanity/route.ts`
- `scripts/performance/probe-lighthouse.mjs`
- `scripts/launch/run-final-readiness-audit.mjs`
- `scripts/seo/probe-launch-seo.mjs`
- `scripts/component-contracts/seo-audit-page-html.test.mjs`
- `node_modules/next/dist/docs/01-app/02-guides/draft-mode.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/draft-mode.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/how-revalidation-works.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheTag.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
- Sanity official docs:
  - `https://www.sanity.io/docs/nextjs/cache-components`
  - `https://www.sanity.io/docs/apis-and-sdks/js-client-querying`
  - `https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router`

## Key Findings

### Next.js Draft Mode And Cache Components

- `draftMode()` is async in this installed Next 16.2.9 version and must be
  awaited.
- `draftMode().enable()` and `draftMode().disable()` are only valid in Route
  Handlers or Server Actions, not inside `'use cache'` scopes.
- `draftMode().isEnabled` may be read inside a caching directive scope in the
  local Next docs, and Draft Mode forces cached functions/components to
  re-execute per request without saving draft results into the cache.
- Other request APIs such as `cookies()` and `headers()` are not allowed inside
  `'use cache'` scopes.
- A safe plan can either read `draftMode()` in `page.tsx` and branch to a
  token-backed uncached helper, or pass a serializable draft/published flag into
  a helper. The simpler Phase 23 fit is route-level branching: keep
  `getHomepage()` published-only and cached, add `getHomepageDraft()` as a
  separate preview helper, and choose draft body props only when Draft Mode is
  enabled.

### Sanity Draft Reads

- The current published client in `src/lib/sanity/client.ts` uses
  `perspective: 'published'`, `useCdn: false`, and `stega: false`.
- Sanity's official JS client docs state that `perspective: 'drafts'` returns
  drafts when present and falls back to published content; it requires an API
  token and should not use the CDN.
- Phase 23 should add `getSanityPreviewSecret()` and require
  `SANITY_API_READ_TOKEN` for draft reads. Missing preview token/secret should
  fail loudly through env helpers, not fall back to published content.
- Draft helpers should keep `stega: false`. Sanity's Visual Editing docs use
  stega/Content Source Maps for overlays, but Phase 23 explicitly forbids
  overlays and preview markers.
- Use the same `homePageQuery` and reshape logic for published and draft body
  content where possible. The reshaper already validates required sections,
  links, image dimensions, SEO fields, and canonical `/`.
- Preserve published-safe metadata: `generateMetadata()` should continue using
  `getHomepage()` only, even in Draft Mode.

### Secure Preview Route Shape

- Add `src/app/api/draft/route.ts` with a `GET` handler.
- Validate `secret` against `SANITY_PREVIEW_SECRET`.
- Validate `slug` as exactly `/`. Reject missing, absolute, protocol-relative,
  encoded external, or unsupported slugs before enabling Draft Mode.
- Confirm the `homePage` document exists through the preview-capable read path
  before calling `draftMode().enable()`.
- Redirect only to the validated constant `/`; never redirect to raw
  `searchParams.get('slug')`.
- Add `src/app/api/draft/disable/route.ts` with a `GET` handler that awaits
  `draftMode()`, calls `disable()`, and redirects to `/`.
- Since Phase 23 forbids a preview banner or client exit link, no Link prefetch
  hazard needs to be solved in UI. If a future UI adds a disable link, it must
  use `prefetch={false}`.

### Homepage Webhook Revalidation

- `src/app/api/webhooks/sanity/route.ts` already validates signed payloads with
  `parseBody(request, expectedSecret, true)`, rejects bad signatures, and logs
  metadata-only rejection reasons.
- The route currently always revalidates `blog`, then optionally
  `blog-{blogSlug}` and `article-{blogSlug}-{articleSlug}`.
- Phase 23 should add `_type === 'homePage'` handling that calls
  `revalidateTag('homePage', { expire: 0 })` and
  `revalidateTag('sanity-homepage', { expire: 0 })`.
- Keep `{ expire: 0 }`: the installed Next docs explicitly call this route
  handler/webhook pattern the immediate-expiration option for external systems.
- Do not remove or conditionally skip current blog invalidation unless tests
  prove this is intentionally changed. The locked context says blog behavior
  must be preserved exactly.
- Log only `documentType`, accepted/rejected status, and slug-presence booleans.
  Never log raw body, signature, token, secret, or draft content.

### Release Evidence

- v1.5 score of record for homepage `/`: real owner-run PSI on the public
  preview, 2026-07-01, Performance 95-97, Accessibility 100, Best Practices
  100, Speed Index 1.9s, TBT 30ms, CLS 0, LCP about 3.0s. The previous live
  before-baseline was about Performance 86 with Speed Index 5.1s and TBT 90ms.
- The Phase 23 gate should record the v1.5 baseline, the current public preview
  PSI results, local homepage SEO/HTML checks, a pass/fail decision, and a
  fix-or-rollback rule.
- Local Lighthouse remains diagnostic. The existing
  `scripts/performance/probe-lighthouse.mjs` can target only `/` with
  `--url /`, `--json-summary`, and `--stdout-only` when needed.
- `scripts/seo/probe-launch-seo.mjs` covers route matrix SEO broadly but does
  not currently isolate homepage draft/stega leakage. Add a focused homepage
  published-HTML check or extend existing route tests/contracts to assert:
  one visible H1, canonical/noindex cleanliness, Organization/WebSite JSON-LD,
  and no draft/stega/source-map text in published HTML.
- `scripts/launch/run-final-readiness-audit.mjs` is a full-suite release gate,
  but Phase 23 needs a focused release document too so a PSI drop has an
  explicit rollout-blocking decision rather than getting buried in global
  readiness output.

## Recommended Plan Shape

One phase plan is sufficient, but split it into ordered tasks:

1. Tests and env/client foundations for preview secrets and token-backed draft
   reads.
2. Draft Mode entry/disable route handlers plus route-handler tests.
3. Homepage route branching so Draft Mode uses draft body content while metadata
   and JSON-LD stay published-safe.
4. Signed `homePage` webhook revalidation plus tests preserving blog behavior.
5. Homepage release evidence document and focused SEO/PageSpeed no-regression
   checks.
6. Final regression sweep and docs/state updates.

## Validation Architecture

### Targeted Automated Tests

- `pnpm test:unit -- src/lib/sanity/home-page.test.ts src/lib/sanity/queries/home-page.test.ts`
  - Add draft helper coverage, preview env coverage, and published cache-tag
    isolation checks.
- `pnpm test:unit -- src/app/(storefront)/page.test.tsx`
  - Assert default rendering still uses published `getHomepage()`.
  - Assert Draft Mode rendering uses draft body props while metadata still calls
    published `getHomepage()`.
  - Assert published HTML contains no draft/stega/source-map markers.
- Route-handler integration tests for:
  - `/api/draft` valid secret + `/` slug enables Draft Mode and redirects `/`.
  - invalid secret returns 401.
  - unsafe or unsupported slug returns a clear non-2xx response.
  - missing draft document returns a clear non-2xx response without enabling.
  - `/api/draft/disable` disables and redirects `/`.
  - signed `homePage` webhook revalidates `homePage` and `sanity-homepage`.
  - invalid signature/payload rejection remains non-2xx.
  - existing blog payload behavior still revalidates blog tags.
  - logging payloads are metadata-only.

### Commands For Final Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit -- src/lib/sanity/home-page.test.ts src/lib/sanity/queries/home-page.test.ts src/app/(storefront)/page.test.tsx`
- Route-handler tests added for draft and Sanity webhook boundaries. If placed
  under `src/app/api/**`, add them to `pnpm test:integration` or run them
  explicitly with `pnpm exec vitest run --environment node <files>`.
- `pnpm build`
- `node scripts/seo/probe-launch-seo.mjs --mode enabled --base-url <local-or-preview>`
- `node scripts/seo/probe-launch-seo.mjs --mode disabled --base-url <local-or-preview>`
- `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --url / --json-summary --stdout-only`
- Real public-preview Google PSI for `/`, manually recorded in the Phase 23
  release evidence document before rollout.

## Threat Model

| Threat | Area | Mitigation |
| --- | --- | --- |
| Preview secret brute force or leakage | `/api/draft` | Strong `SANITY_PREVIEW_SECRET`, exact comparison, no secret logging, explicit 401. |
| Open redirect | `/api/draft?slug=` | Allow only exact `/`; redirect to the constant validated slug, not raw input. |
| Draft content leaks to published visitors | Homepage route/data | Keep `getHomepage()` published-only; draft helper requires Draft Mode and token; metadata/JSON-LD use published data only. |
| Draft/stega/source-map text leaks into SEO surfaces | Sanity client/route | Keep `stega: false`; add published HTML leak tests. |
| Cache contamination | Draft helper/cache | Do not tag or cache draft helper under published tags; keep separate from `getHomepage()`. |
| Webhook log disclosure | Sanity webhook | Metadata-only logs; no raw body/signature/secret/draft content. |
| Revalidation regression | Sanity webhook | Preserve blog tag tests and add homePage-specific tag assertions. |
| False launch approval | Release evidence | Record v1.5 baseline and current PSI categories; any category-score drop blocks rollout. |

## Planning Notes

- This is not a UI phase in the sense of adding or changing visual components.
  It changes the body data source under Draft Mode only and explicitly avoids
  preview banners or overlays, so a UI-SPEC is not required for planning.
- No database/schema push is needed.
- No Shopify hosted checkout/payment/order tests are in scope.
- The plan should mention that AGENTS.md requires reading installed Next docs
  before code work; relevant docs have been identified above.

## Research Complete

The phase is ready for a single executable PLAN.md with TDD-heavy route and
helper tests, security-focused preview/webhook tasks, and a release-evidence
task that makes PSI/SEO regression a hard stop.
