---
phase: 22-storefront-data-and-rendering
plan: 07
subsystem: homepage-route
tags: [homepage, sanity, metadata, next-cache-components, route-tests]
requires:
  - phase: 22
    plan: 06
    provides: Lower homepage section prop enablement
provides:
  - CMS-backed storefront homepage route rendering through getHomepage()
  - CMS-backed generateMetadata() with canonical, Open Graph image, and noindex processing
  - Code-owned homepage JSON-LD kept outside static homepage fixtures
  - Route tests for section order, one H1, JSON-LD, action handoff, and no static fallback import
affects: [phase-22-route-cutover, homepage-rendering, homepage-metadata]
tech-stack:
  added: []
  patterns:
    - Dynamic homepage data is streamed inside a Suspense boundary under Next.js Cache Components
    - Route tests mock external data/actions while asserting the real route composition contract
key-files:
  modified:
    - src/app/(storefront)/page.tsx
    - src/components/homepage/content.ts
  added:
    - src/app/(storefront)/page.test.tsx
key-decisions:
  - "`/` no longer imports `@/components/homepage/content`; fixtures remain story/test-only data."
  - "`generateMetadata()` reads CMS SEO fields and passes the result through `withNoindexRobots()`."
  - "Organization and WebSite JSON-LD stay code-owned in `src/lib/seo/homepage-json-ld.ts`."
  - "The CMS body renders inside Suspense with `connection()` so missing Sanity content fails at request-time render rather than build prerender."
patterns-established:
  - "Route-level homepage tests should assert section order with component-boundary markers rather than fragile full HTML snapshots."
  - "Next Cache Components dynamic route data belongs behind an explicit Suspense boundary when the route shell can prerender."
requirements-completed: [DATA-01, DATA-02, RENDER-01, RENDER-02, QUALITY-01]
duration: 23 min
completed: 2026-07-02
---

# Phase 22 Plan 07: Homepage Route Cutover Summary

**The storefront `/` route now renders from typed Sanity homepage content, while metadata, JSON-LD, actions, and section order remain controlled by code.**

## Performance

- **Duration:** 23 min
- **Started:** 2026-07-02T09:48:00Z
- **Completed:** 2026-07-02T10:10:35Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added route tests that mock `getHomepage()` and assert the exact 13-section homepage order.
- Replaced static homepage metadata with `generateMetadata()` backed by CMS SEO fields.
- Mapped CMS SEO title, description, canonical path, optional OG image, and noIndex into Next metadata through `withNoindexRobots()`.
- Cut the live homepage render over to `getHomepage()` and removed imports from static homepage fixture content.
- Preserved code-owned `sendNewsletterSignupAction` and `submitContactFormAction` handoff.
- Kept Organization and WebSite JSON-LD code-owned through `src/lib/seo/homepage-json-ld.ts`.
- Left `src/components/homepage/content.ts` as fixture/story/test data only.
- Wrapped the dynamic CMS body in Suspense with `connection()` so the route builds as Partial Prerendered content and resolves Sanity data at request time.

## Task Commits

1. **Task 1-2: Route tests, metadata, and CMS render cutover** - `fa37f7f0`

**Plan metadata:** this docs commit

## Files Modified

- `src/app/(storefront)/page.tsx` - CMS-backed metadata and homepage render with Suspense-wrapped dynamic content.
- `src/app/(storefront)/page.test.tsx` - Route/metadata tests for section order, CMS content, JSON-LD, one H1, actions, and static fallback removal.
- `src/components/homepage/content.ts` - Removed JSON-LD exports so the module remains fixture-only after route cutover.

## Decisions Made

- Used `generateMetadata()` instead of a static metadata export so CMS SEO fields own the homepage title and description.
- Kept canonical and Open Graph URL sourced from the typed homepage SEO shape, with the current singleton default resolving to `/`.
- Exported `HomePageContent` as a named async route content boundary for precise tests, while the default export remains the Next route shell.
- Added `connection()` in both metadata and content paths to prevent missing CMS content from breaking production builds during prerender.

## Deviations from Plan

- `HomePageContent` is an additional named export beyond the plan's initial export list. This mirrors existing route-test patterns and keeps tests focused after the Suspense split.
- The first direct async page implementation had to be split into a default shell plus Suspense content boundary to satisfy Next.js Cache Components build requirements.

## Issues Encountered

- The first red route test failed as intended because the route still used static fixtures, lacked `generateMetadata()`, and did not call `getHomepage()`.
- `pnpm lint` initially caught raw `<section>` elements in route test mocks; mocks now use neutral `div` markers.
- `pnpm build` initially failed when missing Sanity content was read during prerender, then failed again when request-time data was outside Suspense. The final Suspense + `connection()` structure passed build and kept fail-loud request-time behavior.

## Verification

- Initial focused route test - failed as expected before implementation.
- `pnpm test:unit -- "src/app/(storefront)/page.test.tsx" src/lib/sanity/home-page.test.ts src/lib/blog/operations.test.ts` - passed, 69 files / 292 tests.
- `pnpm lint` - passed.
- `pnpm typecheck` - passed.
- `pnpm build` - passed; `/` reported as Partial Prerendered with dynamic streamed content.
- Pre-commit hook on `fa37f7f0` - passed Tailwind, ESLint, and component-contract checks.

## Self-Check: PASSED

- `/` calls `getHomepage()` for route rendering and metadata generation.
- `src/app/(storefront)/page.tsx` no longer imports `@/components/homepage/content`.
- Route tests assert the exact 13-section order, one H1, JSON-LD, CMS content, no static SEO fallback, and noindex handling.
- Newsletter and contact Server Actions remain code-owned.
- Build, lint, typecheck, and focused units pass.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 22-08 can run final route/data guardrails and visual verification over the completed CMS-backed homepage cutover.

---
*Phase: 22-storefront-data-and-rendering*
*Completed: 2026-07-02*
