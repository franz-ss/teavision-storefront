---
phase: 18-seo-audit-remediation
plan: 02
subsystem: seo
tags: [nextjs, react, shopify, seo, headings, sanitization]

requires:
  - phase: 18-seo-audit-remediation
    provides: SEO audit URL parity decisions and Phase 18 UI/validation contracts
provides:
  - Visible banner collection H1 rendering
  - Collection story/read-more content below product grid in DOM order
  - Compact Shopify rich-content H1/H2 demotion for collection/PDP surfaces
  - Focused collection and PDP heading hierarchy regression coverage
affects: [collection-pages, product-pages, seo-audit, crawlable-html]

tech-stack:
  added: []
  patterns:
    - Route-local server render tests with renderToStaticMarkup
    - Variant-specific Shopify rich HTML heading demotion

key-files:
  created:
    - src/app/(storefront)/products/[handle]/page.test.tsx
    - src/lib/shopify/html-content.test.ts
  modified:
    - src/app/(storefront)/collections/[handle]/_components/hero.tsx
    - src/app/(storefront)/collections/[handle]/_components/page-content.tsx
    - src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx
    - src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts
    - src/app/(storefront)/products/[handle]/page.tsx
    - src/lib/shopify/html-content.ts

key-decisions:
  - "Collection rich-hero opt-in content remains exclusive; normal collection story disclosures move below the product grid, but strict rich-hero pages do not receive a duplicate disclosure."
  - "Compact Shopify rich content now demotes H1 and H2 to compact H3, while page/article sanitizers keep the existing H1-to-H2 behavior."

patterns-established:
  - "SEO-critical route content is verified through static server-rendered markup assertions."
  - "Imported Shopify rich content is normalized before reaching collection and PDP heading hierarchy."

requirements-completed:
  - SEO-AUDIT-02
  - SEO-AUDIT-03
  - SEO-AUDIT-06

duration: 9 min
completed: 2026-06-25
---

# Phase 18 Plan 02: Collection and Product Heading Hierarchy Summary

**Visible collection H1s, below-grid collection story content, and compact Shopify rich-text heading demotion for collection and PDP SEO surfaces**

## Performance

- **Duration:** 9 min
- **Started:** 2026-06-25T10:55:33Z
- **Completed:** 2026-06-25T11:04:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Banner collection pages now render the collection artwork first, then breadcrumb, visible H1, and brief intro.
- Normal collection read-more/story content now renders after `ProductList`, preserving `id="product-grid"` and pagination anchors.
- Compact Shopify HTML sanitization now demotes imported H1/H2 headings to compact H3s for PDP and collection disclosure content.
- Focused tests cover collection DOM order, banner one-H1 behavior, collection normalizer demotion, compact sanitizer demotion, and PDP one-H1 static rendering.

## Task Commits

Each task was committed atomically:

1. **Task 1: Make banner collection H1 visible and move long story content below the grid** - `72a9bbb9` (fix)
2. **Task 2: Prevent imported rich content from creating H1/H2 conflicts** - `1a3c0dfc` (fix)

**Plan metadata:** committed separately after state/roadmap updates.

## Files Created/Modified

- `src/app/(storefront)/collections/[handle]/_components/hero.tsx` - Removes hidden banner H1 and renders visible title/intro after breadcrumb.
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` - Moves normal `StoryDisclosure` below the product grid and preserves rich-hero exclusivity.
- `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx` - Adds static markup coverage for banner one-H1 behavior and grid-before-story DOM order.
- `src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts` - Adds collection `normalizeHtml()` H1/H2 demotion coverage.
- `src/lib/shopify/html-content.ts` - Adds variant-specific heading transforms so compact sanitizer demotes H1/H2 to H3.
- `src/lib/shopify/html-content.test.ts` - Adds compact sanitizer regression coverage.
- `src/app/(storefront)/products/[handle]/page.tsx` - Exports `ProductContent` for focused server-render tests.
- `src/app/(storefront)/products/[handle]/page.test.tsx` - Adds PDP one-H1 and imported description-heading demotion coverage.

## Decisions Made

- Collection rich-hero opt-in content remains exclusive; normal collection story disclosures move below the product grid, but strict rich-hero pages do not receive a duplicate disclosure.
- Compact Shopify rich content now demotes H1 and H2 to compact H3, while page/article sanitizers keep the existing H1-to-H2 behavior.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Preserved rich-hero exclusivity after moving collection story content**
- **Found during:** Task 1 (Make banner collection H1 visible and move long story content below the grid)
- **Issue:** Moving `StoryDisclosure` out of `Hero` initially caused strict rich-hero collection pages to render a duplicate read-more disclosure below the grid.
- **Fix:** Gated the moved disclosure with `!richHero`, preserving the existing rich-hero path while still moving normal collection story content below `ProductList`.
- **Files modified:** `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`, `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx`
- **Verification:** `pnpm test:unit -- "src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx"`
- **Committed in:** `72a9bbb9`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Preserved existing rich-hero behavior while completing the planned SEO hierarchy change. No scope expansion.

## Issues Encountered

None beyond the auto-fixed rich-hero duplicate disclosure regression documented above.

## Verification

- `pnpm test:unit -- "src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx"` - PASS, 14 tests.
- `pnpm test:unit -- "src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts" "src/lib/shopify/html-content.test.ts" "src/app/(storefront)/products/[handle]/page.test.tsx"` - PASS, 32 tests.
- `pnpm test:unit -- "src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx" "src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts" "src/lib/shopify/html-content.test.ts" "src/app/(storefront)/products/[handle]/page.test.tsx"` - PASS, 46 tests.
- `pnpm lint` - PASS.
- Pre-commit hooks ran on both task commits and passed Tailwind class checks, ESLint, and component contract tests.

## Known Stubs

None. Stub scan found no TODO/FIXME/placeholder/coming-soon text in plan-touched files; test fixture defaults and production type guards did not flow to UI as incomplete implementation.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 18-02 is complete. Plan 18-03 can proceed with metadata, canonical, robots, sitemap, language, domain, and blog indexation remediation using the corrected collection/PDP heading hierarchy as a stable base.

## Self-Check: PASSED

- Summary file exists.
- Created test files exist: `src/app/(storefront)/products/[handle]/page.test.tsx`, `src/lib/shopify/html-content.test.ts`.
- Task commits exist: `72a9bbb9`, `1a3c0dfc`.
- No tracked file deletions were introduced by task commits.

---
*Phase: 18-seo-audit-remediation*
*Completed: 2026-06-25*
