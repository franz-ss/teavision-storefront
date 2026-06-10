---
phase: 11-full-visual-redesign
plan: 13
subsystem: ui
tags: [nextjs, react, tailwind, storefront, redesign, forms]

requires:
  - phase: 11-full-visual-redesign
    provides: 'Section, Button, Breadcrumbs, Eyebrow, RichText, HTML content, and supporting-page visual direction from earlier Phase 11 plans'
provides:
  - 'Restyled wholesale, contact, our-story, certifications, custom-tea-blends, and generic Shopify page surfaces'
  - 'Shared contact form updated to match the redesigned supporting page system while preserving Server Action protections'
  - 'Generic Shopify page route restyled without changing metadata, cache, noindex, or sanitized rich text plumbing'
affects:
  [phase-11-final-visual-redesign, RD-07, supporting-pages, contact-forms]

tech-stack:
  added: []
  patterns:
    - 'Supporting page heroes use Section.Root tone="brand" with gold Eyebrow treatment and warm botanical content surfaces'
    - 'Wholesale and contact forms share the protected ContactForm component with configurable copy and action paths'
    - 'Generic Shopify page bodies use compact Section.Container layout around the existing RichText sanitizer pipeline'

key-files:
  created:
    - '.planning/phases/11-full-visual-redesign/11-13-SUMMARY.md'
  modified:
    - 'src/app/(storefront)/pages/wholesale/page.tsx'
    - 'src/app/(storefront)/pages/wholesale/_components/*'
    - 'src/app/(storefront)/pages/contact/_components/*'
    - 'src/app/(storefront)/pages/our-story/_components/*'
    - 'src/app/(storefront)/pages/certifications/_components/*'
    - 'src/app/(storefront)/pages/custom-tea-blends/_components/*'
    - 'src/app/(storefront)/pages/[...slug]/_components/*'
    - 'src/components/contact/contact-form/contact-form.tsx'
    - 'src/components/contact/contact-form/contact-form.stories.tsx'

key-decisions:
  - 'Wholesale now renders the shared protected ContactForm so wholesale and contact enquiries stay on the same Server Action, honeypot, and rate-limit boundary.'
  - 'The generic Shopify page route keeps page.tsx metadata, noindex, cache, and sanitized rich text plumbing untouched; only hero, breadcrumb, body, and support presentation changed.'
  - 'Supporting page heroes standardize on brand Section surfaces with gold eyebrows, warm card surfaces, and compact prose for static informational content.'

patterns-established:
  - 'Static support pages compose Section.Root, Section.Container, Eyebrow, Button, and Breadcrumbs directly instead of introducing page-specific layout primitives.'
  - 'Form restyles preserve existing action state, hidden website honeypot fields, validation messages, and Storybook coverage.'

requirements-completed: [RD-07]

duration: 21 min
completed: 2026-06-10
---

# Phase 11 Plan 13: Supporting Pages Redesign Summary

**Warm botanical redesign for all supporting and static storefront pages, with protected contact workflows preserved.**

## Performance

- **Duration:** 21 min
- **Started:** 2026-06-10T04:42:29Z
- **Completed:** 2026-06-10T05:03:40Z
- **Tasks:** 3
- **Files modified:** 39

## Accomplishments

- Restyled wholesale and contact surfaces, including brand hero bands, warmer sidebar/card treatments, and a shared protected enquiry form.
- Restyled our-story and certifications surfaces with Phase 11 hero, award, mission, trust, responsibility, team, and CTA treatments.
- Restyled custom-tea-blends and generic Shopify page components while preserving Server Actions, sanitized Shopify HTML rendering, and route-level metadata behavior.
- Verified desktop and mobile smoke coverage for wholesale, contact, our-story, and a generic Shopify page route in the browser.

## Task Commits

Each task was committed atomically:

1. **Task 1: Restyle wholesale, contact, and shared contact form** - `ca5f4e8` (feat)
2. **Task 2: Restyle our-story and certifications pages** - `1cd2471` (feat)
3. **Task 3: Restyle custom blends and generic Shopify pages** - `7dc302b` (feat)

**Plan metadata:** pending final docs commit.

## Files Created/Modified

- `src/app/(storefront)/pages/wholesale/page.tsx` - Hosts the wholesale hero, stats, supply paths, inclusions, and shared application form in the redesigned layout.
- `src/app/(storefront)/pages/wholesale/_components/*` - Restyled wholesale hero, stats, supply path, and inclusions surfaces.
- `src/app/(storefront)/pages/contact/_components/*` - Restyled contact hero, breadcrumb, sidebar, and page content layout.
- `src/components/contact/contact-form/contact-form.tsx` - Updated shared form presentation and added copy props without changing action-state or honeypot behavior.
- `src/components/contact/contact-form/contact-form.stories.tsx` - Updated Storybook coverage for the redesigned contact form copy.
- `src/app/(storefront)/pages/our-story/_components/*` - Restyled story hero, mission, growth, responsibility, team, values, awards, heading, and CTA components.
- `src/app/(storefront)/pages/certifications/_components/*` - Restyled certifications hero, trust points, awards, and CTA components.
- `src/app/(storefront)/pages/custom-tea-blends/_components/*` - Restyled custom blend hero, process, flavour picker, form fields, quality, detail card, imagery, breadcrumb, and CTA components.
- `src/app/(storefront)/pages/[...slug]/_components/*` - Restyled generic Shopify page hero, breadcrumb, body, and support CTA while preserving rich text rendering.

## Decisions Made

- Reused `ContactForm` for wholesale applications instead of creating a second form path, keeping spam protection and rate-limit behavior consistent.
- Left generic Shopify route logic in `page.tsx` untouched because this plan only owned presentation components; metadata, noindex, cache tags, and HTML sanitization already belonged to the route/data layer.
- Used existing Phase 11 primitives and Tailwind token classes throughout; no new styling system, raw color classes, or CSS modules were introduced.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Mounted the protected wholesale application form**

- **Found during:** Task 1 (Restyle wholesale, contact, and shared contact form)
- **Issue:** The plan required a redesigned wholesale application card/form, but the existing wholesale page only rendered the earlier page sections and did not mount the shared form in the redesigned page container.
- **Fix:** Updated `src/app/(storefront)/pages/wholesale/page.tsx` and `src/app/(storefront)/pages/wholesale/_components/wholesale-inclusions.tsx` so the page renders the redesigned application card using `ContactForm` with `sendContactAction`.
- **Files modified:** `src/app/(storefront)/pages/wholesale/page.tsx`, `src/app/(storefront)/pages/wholesale/_components/wholesale-inclusions.tsx`, `src/components/contact/contact-form/contact-form.tsx`
- **Verification:** `pnpm test:integration`, `pnpm lint`, `pnpm typecheck`, `pnpm lint:tailwind`, and browser smoke checks for `/pages/wholesale`.
- **Committed in:** `ca5f4e8`

---

**Total deviations:** 1 auto-fixed (Rule 2)
**Impact on plan:** Required to satisfy the plan objective. No new network endpoint, auth boundary, or storage behavior was introduced.

## Issues Encountered

- Windows did not provide `grep`; equivalent acceptance scans were run with `rg`.
- A new dev server on port 3001 could not start because an existing Next dev server was already running for this repo on `http://localhost:3000`; browser verification used that existing server.
- Browser tooling reported external Statsig/Cloudflare telemetry failures unrelated to the local app. Local page assertions and overflow checks still passed.

## User Setup Required

None - no external service configuration required.

## Verification

- `pnpm test:integration` - passed, 2 files and 10 tests.
- `pnpm lint` - passed, including Tailwind class checks and ESLint.
- `pnpm typecheck` - passed.
- `pnpm lint:tailwind` - passed.
- `pnpm build` - passed with Next.js 16.2.4 and Cache Components enabled.
- Browser smoke checks passed at desktop and mobile widths for:
  - `/pages/wholesale` - hero, application form, hidden honeypot, and horizontal overflow.
  - `/pages/contact` - hero, enquiry form, hidden honeypot, and horizontal overflow.
  - `/pages/our-story` - hero/content presence and horizontal overflow.
  - `/pages/terms-conditions` - generic Shopify page hero/prose and horizontal overflow.

## Known Stubs

None. The stub scan found only decorative empty alt text, normal form placeholder copy, and an empty Storybook story export; none are stubbed data sources or incomplete UI paths.

## Threat Flags

None. No new endpoints, auth paths, Shopify operations, schema changes, or file-access boundaries were introduced.

## Auth Gates

None.

## Next Phase Readiness

RD-07 supporting/static page coverage is ready for final Phase 11 verification. The remaining untracked `test-results/` directory was pre-existing execution noise and was intentionally left untouched.

## Self-Check: PASSED

- Summary file exists: `.planning/phases/11-full-visual-redesign/11-13-SUMMARY.md`
- Task commits found: `ca5f4e8`, `1cd2471`, `7dc302b`
- Generated runtime logs from this execution were removed; unrelated `test-results/` remains untouched.

---

_Phase: 11-full-visual-redesign_
_Completed: 2026-06-10_
