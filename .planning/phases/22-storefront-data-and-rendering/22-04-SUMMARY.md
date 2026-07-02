---
phase: 22-storefront-data-and-rendering
plan: 04
subsystem: homepage-components
tags: [homepage, components, sanity, certification, storybook]
requires:
  - phase: 22
    plan: 03
    provides: Middle-section prop enablement pattern
provides:
  - CMS-driven supply-chain intro and CTA with code-owned motif assets
  - CMS-driven certification coverage labels with code-owned icon mapping
  - CMS-driven supply-chain protection intro and certification mark image grid
  - Fixture-only supply-chain and certification content for stories and temporary route wiring
affects: [phase-22-route-cutover, phase-22-homepage-components, certifications-page]
tech-stack:
  added: []
  patterns:
    - Components accept props derived from HomepageContent while preserving code-owned motifs and icon maps
    - Shared trust-strip components retain defaults for non-homepage reuse
key-files:
  modified:
    - src/app/(storefront)/page.tsx
    - src/components/homepage/content.ts
    - src/components/homepage/supply-chain/supply-chain.tsx
    - src/components/homepage/supply-chain/supply-chain.stories.tsx
    - src/components/homepage/certification-coverage/certification-coverage.tsx
    - src/components/homepage/certification-coverage/certification-coverage.stories.tsx
    - src/components/homepage/supply-chain-protection/supply-chain-protection.tsx
    - src/components/homepage/supply-chain-protection/supply-chain-protection.stories.tsx
key-decisions:
  - "SupplyChain receives CMS intro/CTA props but keeps the handshake and stamp motifs code-owned."
  - "CertificationCoverage receives CMS labels/icon keys and resolves icons through a code-owned allowlist with Shield as the safe fallback."
  - "SupplyChainProtection receives CMS intro and authored mark images while preserving the fixed grid and image sizing."
  - "SupplyChain and CertificationCoverage keep optional defaults because the certifications page reuses them outside the homepage CMS boundary."
patterns-established:
  - "Homepage route passes explicit CMS-shaped props even when shared components retain defaults for other pages."
  - "Certification mark fixtures mirror the existing visible /images/certifications/* grid rather than older unused supply-chain image constants."
requirements-completed: [DATA-02, RENDER-01, RENDER-02]
duration: 13 min
completed: 2026-07-02
---

# Phase 22 Plan 04: Supply-Chain And Certification Prop Enablement Summary

**Supply-chain, certification coverage, and certification mark sections now render typed Sanity content while preserving code-owned motifs, icons, and grid behavior.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-07-02T09:08:42Z
- **Completed:** 2026-07-02T09:21:19Z
- **Tasks:** 1
- **Files modified:** 8

## Accomplishments

- Updated `SupplyChain` to render CMS-shaped intro and CTA props while keeping decorative handshake/stamp images code-owned.
- Updated `CertificationCoverage` to render CMS labels/icon keys through a code-owned Lucide icon map.
- Updated `SupplyChainProtection` to render CMS-shaped intro and certification mark images while preserving the existing grid, dimensions, `sizes`, and object-contain behavior.
- Added typed fixture exports for supply-chain, certification coverage, and supply-chain protection.
- Updated co-located Storybook stories and temporary root route wiring with explicit args/props.

## Task Commits

1. **Task 1: Prop-enable supply-chain and certification sections** - `a1e3b156`

**Plan metadata:** this docs commit

## Files Modified

- `src/components/homepage/supply-chain/supply-chain.tsx` - CMS intro/CTA prop support with code-owned motifs preserved.
- `src/components/homepage/certification-coverage/certification-coverage.tsx` - CMS label/icon-key support with code-owned icon allowlist.
- `src/components/homepage/supply-chain-protection/supply-chain-protection.tsx` - CMS intro/mark prop support with stable mark grid rendering.
- `src/components/homepage/content.ts` - Fixture-only supply-chain and certification data exports typed against `HomepageContent`.
- `src/app/(storefront)/page.tsx` - Transitional fixture prop pass-through until the Sanity route cutover plan.
- Co-located stories - Explicit args for the updated prop APIs.

## Decisions Made

- Kept motif assets and icon maps in code per D-10 and D-18.
- Kept `SupplyChain` and `CertificationCoverage` props optional with internal defaults because `src/app/(storefront)/pages/certifications/_components/page-content.tsx` reuses those trust strips outside the homepage route.
- Kept `SupplyChainProtection` required because no non-homepage call site omits its props.

## Deviations from Plan

- `src/app/(storefront)/page.tsx` was touched to keep required homepage props type-safe before the later live data cutover.
- `SupplyChain` and `CertificationCoverage` use optional props for shared certifications-page compatibility; the homepage route still passes explicit CMS-shaped props.
- The configured Storybook project is named `storybook`, not `chromium`; verification used `--project storybook`.
- The combined Storybook regex was split into separate `SupplyChain` and `Certification` runs to avoid Windows command parsing issues.

## Issues Encountered

- Initial typecheck surfaced existing certifications-page call sites for `SupplyChain` and `CertificationCoverage`; internal defaults were added only for those shared trust-strip components.
- Storybook emitted pre-existing Next image warnings about eager/LCP images and fake image quality metadata. They did not fail the focused story runs and were not introduced by this wave.

## Verification

- `pnpm typecheck` - passed.
- `pnpm lint --quiet` - passed.
- `pnpm test:stories -- --project storybook --testNamePattern SupplyChain` - passed, 106 files / 363 tests.
- `pnpm test:stories -- --project storybook --testNamePattern Certification` - passed, 106 files / 363 tests.
- Pre-commit hook on `a1e3b156` - passed Tailwind, ESLint, and component-contract checks.

## Self-Check: PASSED

- Supply-chain and certification sections accept explicit CMS-shaped props from the homepage route and stories.
- Code-owned motif images and certification icon map remain local to components.
- Certification mark grid keeps stable dimensions and responsive `sizes`.
- Shared certifications-page trust-strip usage still typechecks without adding homepage data fetching there.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 22-05 can prop-enable testimonials and Tea Journal configuration while keeping the testimonial slider client leaf and live blog article fetch boundary intact.

---
*Phase: 22-storefront-data-and-rendering*
*Completed: 2026-07-02*
