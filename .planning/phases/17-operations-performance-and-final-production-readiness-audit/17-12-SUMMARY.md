---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 12
subsystem: performance
tags: [performance, images, next-image, lighthouse, launch-readiness]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: refreshed no-evidence PERF-01 blocker outcome from 17-11
provides:
  - Precompressed Home hero and fake Shopify product AVIF LCP assets
  - Next 16 preload wiring for Home, PDP, PLP, and collection hero image discovery
  - Static contract guarding launch image byte budgets and invalid Image prop combinations
affects: [performance-evidence, image-lcp, final-readiness, PERF-01]

# Tech tracking
tech-stack:
  added:
    - sharp@0.34.5
  patterns:
    - Use Next 16 Image preload for single launch-critical LCP images instead of deprecated priority
    - Keep fake-provider launch media local and byte-budgeted
    - Guard LCP image regressions with fixed-file component contracts

key-files:
  created:
    - public/images/homepage/homepage-hero-tea-harvest-lcp.avif
    - public/images/homepage/bulk-wholesale-lcp.avif
    - scripts/component-contracts/launch-image-performance.test.mjs
    - .planning/phases/17-operations-performance-and-final-production-readiness-audit/17-12-SUMMARY.md
  modified:
    - package.json
    - pnpm-lock.yaml
    - src/components/homepage/content.ts
    - src/components/homepage/hero/hero.tsx
    - src/components/product/product-gallery/product-gallery.tsx
    - src/components/collection/product-card/product-card.tsx
    - src/app/(storefront)/collections/[handle]/_components/hero.tsx
    - src/app/(storefront)/collections/[handle]/_components/collection-rich-hero.tsx
    - tests/mocks/shopify-graphql-server.ts

key-decisions:
  - "Next 16 `preload` replaced launch-critical `priority`, `loading=\"eager\"`, and `fetchPriority=\"high\"` usage on the touched Image components."
  - "Fake Shopify PDP and PLP performance evidence now uses the local `bulk-wholesale-lcp.avif` asset instead of the heavier JPG."
  - "Image performance guards scan only the fixed launch-critical file list to avoid a noisy whole-repo rule."

patterns-established:
  - "Generated launch LCP images stay in `public/images/homepage/*-lcp.avif` with explicit byte ceilings."
  - "Component contracts should prevent deprecated Next image priority/preload combinations before performance evidence reruns."

requirements-completed: [PERF-01, QA-02]
requirements-addressed: [PERF-01, QA-02]

# Metrics
duration: 24 min
completed: 2026-06-24
---

# Phase 17 Plan 12: Launch Image LCP Remediation Summary

**Precompressed AVIF LCP assets and Next 16 preload wiring for Home, PDP, PLP, and collection hero images.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-06-24T04:18:00Z
- **Completed:** 2026-06-24T04:41:50Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments

- Generated `homepage-hero-tea-harvest-lcp.avif` and `bulk-wholesale-lcp.avif` from existing local source images using `sharp@0.34.5`.
- Updated launch-critical Home, PDP, PLP, and collection hero image discovery to use Next 16 `preload` without deprecated `priority` or conflicting `fetchPriority`.
- Pointed the fake Shopify product image at the local AVIF so performance runs exercise a real product media path without external URLs.
- Added `launch-image-performance.test.mjs` to guard byte budgets, AVIF references, and invalid Next Image prop combinations through `pnpm test:contracts`.

## Task Commits

Each implementation task was committed atomically:

1. **Task 1: Generate precompressed launch-critical LCP image sources** - `f6375706` (`perf(17-12): add launch-critical AVIF LCP assets`)
2. **Task 2: Wire LCP images with Next 16 preload semantics** - `618a9ddc` (`perf(17-12): use Next preload for launch LCP images`)
3. **Task 3: Add a static contract for launch image LCP behavior** - `c54af444` (`test(17-12): guard launch image preload behavior`)

Plan metadata and this summary are captured in the final metadata commit.

## Files Created/Modified

- `public/images/homepage/homepage-hero-tea-harvest-lcp.avif` - Home hero launch LCP source, 24,065 bytes.
- `public/images/homepage/bulk-wholesale-lcp.avif` - Fake Shopify PDP/PLP launch LCP source, 30,235 bytes.
- `package.json` and `pnpm-lock.yaml` - Added deterministic local `sharp@0.34.5` asset generation dependency.
- `src/components/homepage/content.ts` - Points the hero image metadata at the new AVIF source and intrinsic dimensions.
- `src/components/homepage/hero/hero.tsx` - Uses `preload` for the Home hero Image.
- `src/components/product/product-gallery/product-gallery.tsx` - Uses `preload={i === 0}` for the first PDP gallery Image.
- `src/components/collection/product-card/product-card.tsx` - Keeps the local `priority` API but renders it as Next 16 `preload`.
- `src/app/(storefront)/collections/[handle]/_components/hero.tsx` - Removes the invalid eager/fetchPriority/preload combination.
- `src/app/(storefront)/collections/[handle]/_components/collection-rich-hero.tsx` - Replaces deprecated `priority` with `preload`.
- `tests/mocks/shopify-graphql-server.ts` - Uses the new local AVIF fake product image.
- `scripts/component-contracts/launch-image-performance.test.mjs` - Guards AVIF budgets and Image prop combinations.

## Decisions Made

- Used the installed Next 16 docs as the source of truth: `priority` is deprecated and `preload` must not be combined with `loading` or `fetchPriority`.
- Kept the `ProductCard` component's `priority` prop as a local API because upstream listing code already passes that concept; only the rendered Next Image prop changed.
- Kept the Home hero `quality={68}` because the installed Image API still accepts `quality`, and no warning was triggered by lint/typecheck or the contract suite.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. The initial PowerShell acceptance probe had quoting errors, but rerunning the same checks with safer quoting passed without code changes.

## Verification

- `node --test scripts/component-contracts/launch-image-performance.test.mjs` - PASS, 3/3 tests.
- `pnpm test:contracts` - PASS, 46/46 tests.
- `pnpm lint -- src/components/homepage/content.ts src/components/homepage/hero/hero.tsx src/components/product/product-gallery/product-gallery.tsx src/components/collection/product-card/product-card.tsx "src/app/(storefront)/collections/[handle]/_components/hero.tsx" "src/app/(storefront)/collections/[handle]/_components/collection-rich-hero.tsx" tests/mocks/shopify-graphql-server.ts` - PASS.
- `pnpm typecheck` - PASS.
- Asset size assertion - PASS; Home AVIF 24,065 bytes <= 350,000, bulk AVIF 30,235 bytes <= 120,000.

## Auth Gates

None.

## Known Stubs

Fake Shopify remains a deliberate local production-test provider. The new fake product media path is local and does not call real Shopify, checkout, payment, shipping, tax, order, or success-redirect flows.

## Threat Flags

None. Generated assets come from fixed local source files, no external URLs were added, and no customer data, checkout URLs, tokens, or provider payloads are logged.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 17-13 can now address text-LCP render-delay routes. Plan 17-15 still needs to regenerate strict performance evidence and final readiness after 17-12, 17-13, and 17-14 are complete.

## Self-Check: PASSED

- Found summary file: `.planning/phases/17-operations-performance-and-final-production-readiness-audit/17-12-SUMMARY.md`
- Found task commits: `f6375706`, `618a9ddc`, `c54af444`
- Confirmed the two generated AVIF files exist and remain under their byte ceilings.
- Confirmed touched launch Image components use `preload` without deprecated `priority` or conflicting `fetchPriority`.
- Confirmed `pnpm test:contracts`, targeted lint, and `pnpm typecheck` pass.

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-24*
