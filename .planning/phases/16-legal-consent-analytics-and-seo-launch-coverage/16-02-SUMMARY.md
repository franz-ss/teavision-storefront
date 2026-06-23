---
phase: 16-legal-consent-analytics-and-seo-launch-coverage
plan: 02
subsystem: consent
tags: [nextjs, react, consent, privacy, localstorage, shopify-customer-privacy, playwright, storybook]

requires:
  - phase: 16-legal-consent-analytics-and-seo-launch-coverage
    provides: Legal policy route registry and cookie-preferences route shell from Plan 16-01
provides:
  - Default-denied consent state model for essential, analytics, and marketing categories
  - Guarded browser consent storage and Shopify Customer Privacy API bridge
  - First-visit consent banner and reusable preferences controls
  - Stable `/pages/cookie-preferences` preference management route
  - Local Playwright smoke coverage for consent persistence and page controls
affects: [analytics, marketing-tags, shopify-privacy, cookie-preferences, launch-readiness]

tech-stack:
  added: []
  patterns:
    - Browser-only consent persistence with typed parsing and denied defaults
    - Storefront Server Component layout mounting a small client consent leaf
    - Local-only Playwright consent smoke tests that block third-party requests

key-files:
  created:
    - src/lib/consent/adapter.ts
    - src/lib/consent/storage.ts
    - src/lib/consent/shopify-customer-privacy.ts
    - src/lib/consent/adapter.test.ts
    - src/components/consent/banner/banner.tsx
    - src/components/consent/banner/banner.stories.tsx
    - src/components/consent/banner/index.ts
    - src/components/consent/preferences/preferences.tsx
    - src/components/consent/preferences/preferences.stories.tsx
    - src/components/consent/preferences/index.ts
    - src/components/consent/index.ts
    - tests/e2e/consent.spec.ts
  modified:
    - src/app/(storefront)/layout.tsx
    - src/app/(storefront)/pages/cookie-preferences/page.tsx

key-decisions:
  - "Consent persists as a minimal versioned localStorage object under `teavision_consent`; missing or malformed storage means no prior choice and optional categories remain denied."
  - "Shopify Customer Privacy API propagation is isolated behind a browser-only adapter that returns typed unavailable or failed states instead of throwing when Shopify globals are absent."
  - "The storefront layout stays server-rendered; only the banner and preferences leaves are client components."

patterns-established:
  - "Consent adapter: `DEFAULT_CONSENT` denies analytics/marketing and keeps `essential: true` through every update."
  - "Consent UI: `ConsentBanner` owns first-visit Accept/Reject/Manage flow and `ConsentPreferences` owns reusable category controls for modal and route usage."
  - "Consent e2e: Playwright reads `teavision_consent` from localStorage and blocks third-party requests instead of asserting against external destinations."

requirements-completed: [CONSENT-01, CONSENT-02, LEGAL-01]

duration: 22 min
completed: 2026-06-23
---

# Phase 16 Plan 02: Consent Foundation and Preferences Summary

**Default-denied cookie consent foundation with first-visit banner, reusable preference controls, Shopify privacy bridge, and local browser smoke evidence.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-06-23T00:01:14Z
- **Completed:** 2026-06-23T00:22:18Z
- **Tasks:** 4
- **Files modified:** 14

## Accomplishments

- Added a central consent state model where analytics and marketing are denied by default and `essential` cannot be toggled off.
- Added guarded localStorage parsing/writing and a typed browser-only Shopify Customer Privacy API boundary.
- Added a compact first-visit banner with Accept, Reject, and Manage actions plus reusable preference controls with Storybook coverage.
- Mounted the banner in the storefront layout without converting the layout to a Client Component.
- Completed `/pages/cookie-preferences` with the reusable controls, canonical metadata, denied-option empty state, and support email copy.
- Added local Playwright consent smoke tests that prove first-visit behavior and persisted preference changes without contacting real analytics or checkout destinations.

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement consent state, storage, and Shopify privacy boundary** - `a36a974` (feat)
2. **Task 2: Add consent banner and preference controls as client leaves** - `2d2e7eb` (feat)
3. **Task 3: Mount consent UI and complete cookie preferences route** - `1bb7a86` (feat)
4. **Task 4: Add local consent smoke coverage without real destinations** - `52b2a52` (test)

## Files Created/Modified

- `src/lib/consent/adapter.ts` - Consent categories, default denied state, update helpers, and consent gate helpers.
- `src/lib/consent/storage.ts` - Browser-guarded localStorage read/write/clear helpers and typed JSON parser.
- `src/lib/consent/shopify-customer-privacy.ts` - Browser-only Shopify Customer Privacy API bridge with typed unavailable/failed/applied results.
- `src/lib/consent/adapter.test.ts` - Unit coverage for denied defaults, accept/reject, essential lock, malformed storage, and unavailable Shopify API state.
- `src/components/consent/banner/banner.tsx` - First-visit client banner with Accept, Reject, and Manage controls.
- `src/components/consent/banner/banner.stories.tsx` - Storybook coverage for the first-visit banner.
- `src/components/consent/preferences/preferences.tsx` - Reusable client preference controls for essential, analytics, and marketing categories.
- `src/components/consent/preferences/preferences.stories.tsx` - Storybook coverage for denied and mixed optional states.
- `src/components/consent/**/index.ts` - Consent component barrels for local imports.
- `src/app/(storefront)/layout.tsx` - Server layout now mounts the consent banner leaf.
- `src/app/(storefront)/pages/cookie-preferences/page.tsx` - Stable preferences route with canonical metadata and embedded controls.
- `tests/e2e/consent.spec.ts` - Local-only Playwright consent smoke coverage.

## Decisions Made

- Stored consent remains a minimal category object with `version: 1`, no PII, and no destination-specific IDs.
- Missing or malformed storage is treated as no prior visitor choice; optional categories remain denied until explicit action.
- Shopify privacy propagation does not assume the Shopify browser API is present. It attempts `loadFeatures` only in the browser and reports typed unavailable/failed states for later analytics and launch evidence.
- The global storefront shell remains a Server Component; browser storage, dialog state, and Shopify privacy calls live only in client leaves.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed synchronous effect state updates caught by React lint**
- **Found during:** Task 2 (focused lint)
- **Issue:** The first banner/preferences implementation called `setState` synchronously inside effects while reading browser storage.
- **Fix:** Scheduled browser-storage synchronization through `window.setTimeout` callbacks and cleaned up timers.
- **Files modified:** `src/components/consent/banner/banner.tsx`, `src/components/consent/preferences/preferences.tsx`
- **Verification:** `pnpm test:stories -- src/components/consent` and `pnpm lint -- src/components/consent` passed.
- **Committed in:** `2d2e7eb`

**2. [Rule 1 - Bug] Fixed Shopify privacy bridge optional-method narrowing**
- **Found during:** Task 3 (`pnpm typecheck`)
- **Issue:** TypeScript still considered `setTrackingConsent` possibly undefined after the availability guard.
- **Fix:** Captured `setTrackingConsent` in a local constant after the guard before invoking it.
- **Files modified:** `src/lib/consent/shopify-customer-privacy.ts`
- **Verification:** `pnpm typecheck`, `pnpm test:unit -- src/lib/consent/adapter.test.ts`, and focused lint passed.
- **Committed in:** `1bb7a86`

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes were required for project lint/type safety. No scope expansion.

## Issues Encountered

- `pnpm create:lib -- consent/adapter` and `pnpm create:component -- consent/banner` could not scaffold a new `consent` domain because the helper only supports existing domain folders. The folders were created manually using the approved `docs/conventions.md` component anatomy.

## Known Stubs

None. Stub scan found no TODO/FIXME/placeholder copy. `updatedAt: null` remains intentional in the typed default consent state and does not flow as a UI placeholder.

## Verification

- `pnpm test:unit -- src/lib/consent/adapter.test.ts` - passed (1 file, 8 tests)
- `pnpm test:stories -- src/components/consent` - passed (2 story files, 3 tests)
- `pnpm lint -- src/lib/consent src/components/consent "src/app/(storefront)/layout.tsx" "src/app/(storefront)/pages/cookie-preferences/page.tsx"` - passed
- `pnpm typecheck` - passed
- `pnpm test:e2e -- tests/e2e/consent.spec.ts` - passed (5 tests)
- Commit hooks also ran full project lint and component contract tests for each task commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Plan 16-03. Analytics destinations can now consult `DEFAULT_CONSENT`, `readStoredConsent()`, `canUseAnalytics()`, and `canUseMarketing()` before loading or dispatching any optional analytics or marketing event.

## Self-Check: PASSED

- Confirmed summary, consent lib, component, route, and e2e files exist.
- Confirmed task commits exist: `a36a974`, `2d2e7eb`, `1bb7a86`, `52b2a52`.
- Confirmed final verification commands passed after all task commits.

---
*Phase: 16-legal-consent-analytics-and-seo-launch-coverage*
*Completed: 2026-06-23*
