---
phase: 16-legal-consent-analytics-and-seo-launch-coverage
plan: 03
subsystem: analytics
tags: [nextjs, react, consent, analytics, ga4, csp, launch-runbook, vitest]

requires:
  - phase: 16-legal-consent-analytics-and-seo-launch-coverage
    provides: Consent foundation, default-denied categories, preference storage, and Shopify Customer Privacy bridge from Plan 16-02
provides:
  - Consent-aware typed analytics adapter with fake/test sink and GA4 mapper
  - Env-gated analytics destination loader mounted as a client leaf
  - CSP analytics host gates tied to public destination env vars
  - Ecommerce and lead event instrumentation through one client analytics boundary
  - Analytics destination verification runbook with owner-gated purchase/order and Search Console steps
affects: [analytics, consent, csp, cart, checkout-handoff, lead-forms, search, product-pages, launch-readiness]

tech-stack:
  added: []
  patterns:
    - Typed `AnalyticsEvent` union with event factories in `src/lib/analytics/events.ts`
    - Client analytics dispatch helper reads stored consent and default destinations before dispatch
    - Route-owned client leaves emit server-derived product/search analytics without converting pages to Client Components
    - Analytics CSP hosts are added only when public destination env gates are configured

key-files:
  created:
    - src/lib/analytics/adapter.ts
    - src/lib/analytics/client.ts
    - src/lib/analytics/events.ts
    - src/lib/analytics/destinations/fake.ts
    - src/lib/analytics/destinations/ga4.ts
    - src/lib/analytics/destinations/index.ts
    - src/lib/analytics/adapter.test.ts
    - src/components/analytics/destination-loader/destination-loader.tsx
    - src/components/analytics/destination-loader/destination-loader.stories.tsx
    - src/components/analytics/destination-loader/index.ts
    - src/components/analytics/index.ts
    - src/app/(storefront)/products/[handle]/_components/view-analytics.tsx
    - src/app/(storefront)/search/_components/analytics.tsx
    - docs/launch/analytics-and-indexing-runbook.md
  modified:
    - src/app/(storefront)/layout.tsx
    - src/app/(storefront)/products/[handle]/page.tsx
    - src/app/(storefront)/search/page.tsx
    - src/components/product/use-add-to-cart.ts
    - src/app/(storefront)/cart/_components/line-actions.tsx
    - src/app/(storefront)/cart/_components/line-remove.tsx
    - src/app/(storefront)/cart/_components/checkout-form.tsx
    - src/app/(storefront)/cart/_components/view.tsx
    - src/components/layout/footer/newsletter-form/newsletter-form.tsx
    - src/components/contact/contact-form/contact-form.tsx
    - src/app/(storefront)/pages/wholesale-account-request/_components/form.tsx
    - src/app/(storefront)/pages/new-product-development-order-form/_components/npd-order-form.tsx
    - src/lib/consent/storage.ts
    - src/lib/env/server.ts
    - src/lib/security/headers.ts
    - src/lib/security/headers.test.ts
    - scripts/component-contracts/security-headers.test.mjs
    - .env.example

key-decisions:
  - "Analytics event names are centralized behind `src/lib/analytics/events.ts` factories so event sites do not hand-roll payload discriminants."
  - "Real analytics destinations require both visitor consent and public env gates; local and CI default to the fake/test sink."
  - "Product view and search analytics use route-owned client leaves so App Router pages remain Server Components."
  - "Purchase/order analytics remain owner-gated and documented, not enabled by default."

patterns-established:
  - "Client event sites call `dispatchClientAnalyticsEvent(create...Event(...))` only after successful local actions."
  - "CSP host expansion is data-driven by public analytics env vars and covered by empty-env plus GA4/GTM enabled tests."
  - "Consent storage emits a browser-only consent-change event so destination loading reacts after same-tab preference saves."

requirements-completed: [ANALYTICS-01, ANALYTICS-02, ANALYTICS-03, CONSENT-01, CONSENT-02]

duration: 24 min
completed: 2026-06-23
---

# Phase 16 Plan 03: Analytics Launch Coverage Summary

**Consent-aware storefront analytics with typed ecommerce/lead events, fake local sink, GA4-first env gates, CSP host controls, and launch verification runbook.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-06-23T00:30:37Z
- **Completed:** 2026-06-23T00:54:29Z
- **Tasks:** 4
- **Files modified:** 32

## Accomplishments

- Added a closed typed `AnalyticsEvent` union covering product view, search, add-to-cart, cart update, checkout start, and all four lead surfaces.
- Added consent-aware dispatch, a fake/test sink, default destination selection, and a GA4 mapper that excludes lead contact fields.
- Mounted a small analytics destination loader as a client leaf while keeping the storefront layout server-rendered.
- Added public analytics env documentation and CSP host gates for GA4, GTM, Meta, Klaviyo, and Shopify pixels.
- Wired product, search, cart, checkout-start, newsletter, contact, wholesale, and NPD success paths through one analytics boundary without dispatching from Server Actions.
- Created the analytics and indexing launch runbook with pre-cutover, post-cutover, owner-gated purchase/order, Search Console, and evidence-log sections.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create typed analytics events, adapter, and fake sink** - `093f49d` (feat)
2. **Task 2: Add destination loader, env flags, and CSP host gates** - `26de78a` (feat)
3. **Task 3: Wire required ecommerce and lead event sites through the adapter** - `82f83b2` (feat)
4. **Task 4: Document destination verification and owner-gated purchase/Search Console steps** - `f2cad1e` (docs)

## Files Created/Modified

- `src/lib/analytics/events.ts` - Closed analytics event union plus payload factory helpers for all launch surfaces.
- `src/lib/analytics/adapter.ts` - Consent-aware destination dispatch and adapter factory.
- `src/lib/analytics/client.ts` - Browser-safe dispatch helper that reads stored consent and uses default destinations.
- `src/lib/analytics/destinations/fake.ts` - In-memory fake/test sink for local and CI verification.
- `src/lib/analytics/destinations/ga4.ts` - GA4 event mapper and public measurement ID gated destination.
- `src/components/analytics/destination-loader/destination-loader.tsx` - Client destination loader for consent/env-approved public scripts.
- `src/lib/security/headers.ts` and `src/lib/security/headers.test.ts` - Env-gated analytics host allowlists with empty and enabled tests.
- `src/app/(storefront)/products/[handle]/_components/view-analytics.tsx` and `src/app/(storefront)/search/_components/analytics.tsx` - Route-owned client leaves for server-derived view/search events.
- `src/components/product/use-add-to-cart.ts`, cart components, and lead forms - Client success-path instrumentation through the analytics adapter.
- `docs/launch/analytics-and-indexing-runbook.md` - Destination verification, owner-gated purchase/order tracking, Search Console handoff, and evidence log.
- `.env.example` - Public analytics env placeholders with fake mode as the local/CI default.

## Decisions Made

- Analytics payload construction lives in `events.ts` factories; event sites import the factories rather than duplicating event-name strings.
- The destination loader does not load real GA4/GTM/Meta/Klaviyo scripts while analytics mode is `fake` or `disabled`, and still requires stored visitor consent before script rendering.
- Search analytics emits after successful server search result rendering because the result count is not available in the submit form.
- Cart remove instrumentation was added alongside quantity updates so `cart_update` covers both update actions.
- Purchase/order analytics are documented as blocked until owner-approved Shopify hosted checkout/order evidence exists.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added same-tab consent change notifications**
- **Found during:** Task 2 (destination loader)
- **Issue:** A loader that only reads localStorage on mount would not react immediately when the visitor saves preferences in the same tab.
- **Fix:** Added `CONSENT_CHANGED_EVENT` emission in `src/lib/consent/storage.ts` and had the loader subscribe to it.
- **Files modified:** `src/lib/consent/storage.ts`, `src/components/analytics/destination-loader/destination-loader.tsx`
- **Verification:** `pnpm test:unit -- src/lib/security/headers.test.ts src/lib/analytics/adapter.test.ts src/lib/consent/adapter.test.ts`, focused lint, and Storybook analytics story test passed.
- **Committed in:** `26de78a`

**2. [Rule 3 - Blocking] Updated security header contract for env-gated analytics hosts**
- **Found during:** Task 2 (pre-commit hook review)
- **Issue:** The component-contract hook still asserted analytics host strings must never appear in `headers.ts`, which blocked the planned env-gated host implementation.
- **Fix:** Updated `scripts/component-contracts/security-headers.test.mjs` to assert public env gates and analytics host support are present.
- **Files modified:** `scripts/component-contracts/security-headers.test.mjs`
- **Verification:** `node --test scripts/component-contracts/security-headers.test.mjs` and commit hooks passed.
- **Committed in:** `26de78a`

**3. [Rule 2 - Missing Critical] Added complete event coverage for search result counts and cart removals**
- **Found during:** Task 3 (event-site wiring)
- **Issue:** The plan-named search form did not have access to result count, and cart removals lived in a separate component from quantity updates.
- **Fix:** Added route-owned search analytics after successful server results render and instrumented `CartLineRemove` for `cart_update` remove events.
- **Files modified:** `src/app/(storefront)/search/_components/analytics.tsx`, `src/app/(storefront)/search/page.tsx`, `src/app/(storefront)/cart/_components/line-remove.tsx`
- **Verification:** Task 3 unit, integration, lint, typecheck, and acceptance greps passed.
- **Committed in:** `82f83b2`

**4. [Rule 1 - Bug] Fixed typecheck errors exposed by plan verification**
- **Found during:** Task 3 (`pnpm typecheck`)
- **Issue:** The forbidden-key test used a narrow `Set<ForbiddenAnalyticsField>` for recursive string keys, and CSP env typing did not accept `process.env`.
- **Fix:** Widened the test set to `Set<string>` and changed the CSP env contract to a string-indexed env record with a narrow key union.
- **Files modified:** `src/lib/analytics/adapter.test.ts`, `src/lib/security/headers.ts`
- **Verification:** `pnpm typecheck`, focused unit tests, integration, and lint passed.
- **Committed in:** `82f83b2`

---

**Total deviations:** 4 auto-fixed (2 missing critical, 1 blocking, 1 bug)
**Impact on plan:** All deviations were required for correct consent behavior, complete event coverage, or verification safety. No unrelated scope was added.

## Issues Encountered

- `pnpm create:lib -- analytics/events` and `pnpm create:component -- analytics/destination-loader` could not scaffold new `analytics` domains because the helper only supports existing domain folders. Files were created manually using the approved `src/lib` and component-folder conventions.

## Known Stubs

None. Stub scan found only legitimate form placeholders, empty default form values, empty test arrays, and intentional `null` branches that pre-existed or do not flow as unfinished UI/data stubs.

## Verification

- `pnpm test:unit -- src/lib/analytics/adapter.test.ts` - passed
- `pnpm test:unit -- src/lib/security/headers.test.ts src/lib/analytics/adapter.test.ts src/lib/consent/adapter.test.ts` - passed
- `pnpm test:stories -- src/components/analytics` - passed
- `node --test scripts/component-contracts/security-headers.test.mjs` - passed
- `node -e "const fs=require('fs');const s=fs.readFileSync('docs/launch/analytics-and-indexing-runbook.md','utf8');for(const n of ['Pre-Cutover Analytics Verification','Post-Cutover Analytics Verification','Owner-Gated Purchase And Order Tracking','NEXT_PUBLIC_GA4_MEASUREMENT_ID','fake/test sink']){if(!s.includes(n)){throw new Error('missing '+n)}}console.log('OK')"` - passed
- `pnpm test:unit -- src/lib/analytics/adapter.test.ts src/lib/security/headers.test.ts` - passed
- `pnpm test:integration` - passed
- `pnpm lint -- src/lib/analytics src/components/analytics src/lib/security src/components/product 'src/app/(storefront)/cart' src/components/search src/components/contact src/components/layout/footer` - passed
- `pnpm typecheck` - passed
- Commit hooks ran full project lint and component-contract tests for each task commit.

## Authentication Gates

None.

## User Setup Required

None for local/CI completion. Production analytics remains owner-gated through public env variables and external destination access documented in `docs/launch/analytics-and-indexing-runbook.md`.

## Next Phase Readiness

Ready for Plan 16-04. Analytics is consent-aware, fakeable in local/CI, and documented for owner-approved destination verification. Plan 16-04 can extend the same runbook with detailed indexing flip, sitemap, Search Console, and SEO evidence without needing to redesign the analytics boundary.

## Self-Check: PASSED

- Confirmed key created files exist, including `src/lib/analytics/adapter.ts`, `src/lib/analytics/client.ts`, `src/components/analytics/destination-loader/destination-loader.tsx`, route-owned analytics leaves, and `docs/launch/analytics-and-indexing-runbook.md`.
- Confirmed task commits exist: `093f49d`, `26de78a`, `82f83b2`, and `f2cad1e`.
- Confirmed plan-level verification commands passed after all task commits.

---
*Phase: 16-legal-consent-analytics-and-seo-launch-coverage*
*Completed: 2026-06-23*
