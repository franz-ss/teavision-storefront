---
phase: 16-legal-consent-analytics-and-seo-launch-coverage
plan: 01
subsystem: legal
tags: [nextjs, app-router, legal, redirects, footer, launch-readiness]

requires:
  - phase: 15-security-dependency-and-runtime-header-hardening
    provides: noindex and security-header baseline for launch-readiness routes
provides:
  - Code-owned canonical legal policy route registry
  - Static launch-review legal and cookie-preference pages
  - Footer legal links and permanent legacy Shopify policy redirects
  - Owner/legal approval evidence matrix
affects: [consent, analytics, seo, sitemap, footer, launch-evidence]

tech-stack:
  added: []
  patterns:
    - Registry-backed policy route, footer, redirect, sitemap, and evidence data
    - Pending owner/legal review banners on draft legal routes

key-files:
  created:
    - src/lib/legal/policies.ts
    - src/lib/legal/policies.test.ts
    - src/app/(storefront)/pages/privacy-policy/page.tsx
    - src/app/(storefront)/pages/shipping-policy/page.tsx
    - src/app/(storefront)/pages/refund-policy/page.tsx
    - src/app/(storefront)/pages/terms-of-service/page.tsx
    - src/app/(storefront)/pages/cookie-preferences/page.tsx
    - docs/launch/legal-approval-matrix.md
  modified:
    - src/app/(storefront)/pages/[...slug]/page.tsx
    - src/components/layout/footer/data.ts
    - next.config.ts

key-decisions:
  - "Policy routes remain code-owned and visibly pending owner/legal review until approval proof is recorded."
  - "Footer legal links are registry-backed while retaining explicit canonical href order for acceptance and drift checks."

patterns-established:
  - "Legal policy registry: one source for canonical hrefs, footer labels, redirects, and future sitemap inclusion."
  - "Launch-review legal pages: static App Router pages with no Shopify content dependency and no final legal promises."

requirements-completed: [LEGAL-01, LEGAL-02, CONSENT-02]

duration: 13 min
completed: 2026-06-22
---

# Phase 16 Plan 01: Legal Policy Route Foundation Summary

**Code-owned legal policy routes with pending-review banners, registry-backed footer links, permanent legacy Shopify redirects, and owner/legal approval evidence.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-06-22T23:39:25Z
- **Completed:** 2026-06-22T23:53:11Z
- **Tasks:** 4
- **Files modified:** 11

## Accomplishments

- Added `LEGAL_POLICIES` as the canonical policy registry for privacy, shipping, refunds, terms, and cookie preferences.
- Created five static App Router policy pages at the required `/pages/*` URLs with visible pending owner/legal review notices.
- Replaced legacy footer legal links with canonical policy links and added permanent redirects from `/policies/*` and legacy Shopify HTML aliases.
- Created `docs/launch/legal-approval-matrix.md` and test coverage that fails if registry policies are missing from the matrix.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add the canonical legal policy registry and route tests** - `c39ddb9` (feat)
2. **Task 2: Implement code-owned legal and cookie-preference route shells** - `7fbf853` (feat)
3. **Task 3: Wire footer links and Next redirects to the policy registry** - `3d3eab3` (feat)
4. **Task 4: Create legal approval matrix and automated route coverage hook** - `47467ad` (docs)

## Files Created/Modified

- `src/lib/legal/policies.ts` - Canonical policy registry, footer link helper, redirect helper, and sitemap policy helper.
- `src/lib/legal/policies.test.ts` - Unit coverage for canonical hrefs, footer labels, redirect uniqueness, handle narrowing, legacy redirects, and approval matrix coverage.
- `src/app/(storefront)/pages/privacy-policy/page.tsx` - Static privacy policy launch-review route.
- `src/app/(storefront)/pages/shipping-policy/page.tsx` - Static shipping policy launch-review route.
- `src/app/(storefront)/pages/refund-policy/page.tsx` - Static refund policy launch-review route.
- `src/app/(storefront)/pages/terms-of-service/page.tsx` - Static terms of service launch-review route.
- `src/app/(storefront)/pages/cookie-preferences/page.tsx` - Stable cookie preferences route shell for Plan 16-02 consent controls.
- `src/app/(storefront)/pages/[...slug]/page.tsx` - Reserved legal handles so Shopify page fallback cannot own canonical policy routes.
- `src/components/layout/footer/data.ts` - Canonical legal footer link set with registry drift check.
- `next.config.ts` - Permanent legacy policy redirects from the registry.
- `docs/launch/legal-approval-matrix.md` - Owner/legal approval and redirect evidence matrix.

## Decisions Made

- Policy wording remains launch-review copy only; final legal promises are not claimed until owner/legal proof is recorded.
- `Section.Root tone="surface"` carries the page background token for policy routes, matching the project lint rule that forbids explicit background classes on `Section.Root`.
- Footer data keeps an explicit required canonical href list while deriving legal labels and href objects from the registry so the file is acceptance-verifiable and drift-checked.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed disallowed explicit Section background classes**
- **Found during:** Task 2 (route shell verification)
- **Issue:** `pnpm lint` rejected `className="bg-paper"` on `Section.Root`; the project requires `tone` for Section backgrounds.
- **Fix:** Removed the explicit `bg-paper` class and relied on `tone="surface"`.
- **Files modified:** `src/app/(storefront)/pages/*/page.tsx`
- **Verification:** `pnpm lint -- "src/app/(storefront)/pages" src/lib/legal` passed.
- **Committed in:** `7fbf853`

**2. [Rule 2 - Missing Critical] Added footer href drift check for acceptance evidence**
- **Found during:** Task 3 acceptance verification
- **Issue:** The footer used registry-derived links, but `src/components/layout/footer/data.ts` did not contain the canonical `/pages/*` hrefs required by the plan's evidence check.
- **Fix:** Added an explicit ordered `FOOTER_LEGAL_HREFS` list and mapped it back to registry-derived links, throwing if the registry drifts.
- **Files modified:** `src/components/layout/footer/data.ts`
- **Verification:** Task 3 acceptance check, `pnpm test:unit -- src/lib/legal/policies.test.ts`, `pnpm typecheck`, and focused lint passed.
- **Committed in:** `3d3eab3`

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical acceptance/evidence guard)
**Impact on plan:** Both fixes tightened compliance with existing project rules and plan acceptance criteria without changing scope.

## Issues Encountered

- Initial Task 2 lint failed on explicit `Section.Root` background classes; fixed by using the approved `tone` prop.
- Initial Task 3 footer evidence check failed because footer hrefs were only present through the registry import; fixed with a registry-backed required href list.

## Known Stubs

The following stubs are intentional and required by the plan because final policy wording and consent controls are owner/legal or future-plan gated:

- `src/app/(storefront)/pages/privacy-policy/page.tsx:56` - Launch-review placeholder privacy wording pending owner/legal approval.
- `src/app/(storefront)/pages/shipping-policy/page.tsx:56` - Launch-review placeholder shipping wording pending owner/legal approval.
- `src/app/(storefront)/pages/refund-policy/page.tsx:56` - Launch-review placeholder refund wording pending owner/legal approval.
- `src/app/(storefront)/pages/terms-of-service/page.tsx:56` - Launch-review placeholder terms wording pending owner/legal approval.
- `src/app/(storefront)/pages/cookie-preferences/page.tsx:57` - Launch-review cookie preference wording pending Plan 16-02 consent controls.
- `docs/launch/legal-approval-matrix.md:48` - Remaining owner-gated copy replacement item tracked as launch evidence.

## Verification

- `pnpm test:unit -- src/lib/legal/policies.test.ts` - passed
- `pnpm lint -- "src/app/(storefront)/pages" src/lib/legal src/components/layout/footer next.config.ts` - passed
- `pnpm typecheck` - passed
- Markdown evidence check for `docs/launch/legal-approval-matrix.md` - passed
- Must-have route/footer/redirect grep checks - passed

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Plan 16-02. The stable `/pages/cookie-preferences` route exists and is linked from the footer, so consent banner and preference controls can wire to it without route churn.

## Self-Check: PASSED

- Confirmed summary, registry, test, route, and approval matrix files exist.
- Confirmed task commits exist: `c39ddb9`, `7fbf853`, `3d3eab3`, `47467ad`.

---
*Phase: 16-legal-consent-analytics-and-seo-launch-coverage*
*Completed: 2026-06-22*
