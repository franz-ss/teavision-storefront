---
phase: 11-full-visual-redesign
plan: 22
subsystem: ui
tags: [nextjs, tailwind, storybook, react, design-system]

# Dependency graph
requires:
  - phase: 11-full-visual-redesign
    provides: Field focus ring tokens (shadow-focus, border-brand), Section.Root primitive, BrushCircle illustration component, Eyebrow primitive, design token system

provides:
  - Calmer search overlay with type-body scale input and shared .field focus ring
  - On-brand illustrated 404 page with BrushCircle teapot, tea-brand copy, and collection pill links
  - Storybook mockup stories for both surfaces (Concept A + B documented for reference)

affects: [header, search, 404, not-found]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Preview-first design workflow — Storybook concept stories created and owner-approved before production implementation
    - .field focus ring treatment applied to search input (hairline border at rest, brand border + shadow-focus glow on focus)
    - BrushCircle illustration used on error/empty-state pages for on-brand treatment

key-files:
  created:
    - src/components/layout/header/search-overlay-concept.stories.tsx
    - src/app/not-found.concept.stories.tsx
  modified:
    - src/components/layout/header/search-overlay.tsx
    - src/components/layout/header/search-form.tsx
    - src/app/not-found.tsx

key-decisions:
  - 'Concept A (calm base-scale) approved for search overlay — type-body (Hanken Grotesk) input replaces clamp(1.4rem,3vw,2.2rem) serif; border-b-2 border-ink removed in favour of shared .field focus ring'
  - 'Concept A (illustrated) approved for 404 — BrushCircle teapot on sunken section, tea-brand copy, three action buttons, collection pill links'
  - "Concept story files retained as documentation of the approved design direction; tagged 'mockup' to distinguish from production stories"

patterns-established:
  - 'Pattern 1: Preview-first story workflow — create Storybook concepts first, get explicit owner approval, then implement in production'
  - 'Pattern 2: Search overlay uses shared .field focus treatment from TextInput, not custom border inventions'
  - 'Pattern 3: Error/empty-state pages use BrushCircle illustration + Section.Root tone=sunken for on-brand treatment'

requirements-completed: [RD-04]

# Metrics
duration: ~15min
completed: 2026-06-11
---

# Phase 11 Plan 22: Search Overlay + 404 Redesign Summary

**Owner-approved calm search overlay (type-body input with .field focus ring) and illustrated 404 page (BrushCircle teapot + tea-brand copy + collection links) implemented via preview-first Storybook concept workflow**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-06-11T02:00:00Z
- **Completed:** 2026-06-11T02:20:00Z
- **Tasks:** 2 (Task 1 from prior agent, Task 2 from this agent)
- **Files modified:** 5

## Accomplishments

- Task 1 (prior agent): Produced two previewable Storybook concept stories each for the search overlay and 404 page; production behavior left intact pending owner approval
- Task 2 (this agent): Applied owner-approved Concept A to both production surfaces with all behaviors preserved
- Search overlay: single input, single close button (exactly one of each), comfortable body scale, shared `.field` focus ring matching TextInput/Textarea; Escape/auto-focus/Searchanise autocomplete/submit-to-/search all intact
- 404 page: BrushCircle teapot illustration on warm sunken background, "Nothing to steep here" / "This page has gone cold" tea-brand copy, three action buttons (home, browse, search), five collection pill links

## Task Commits

1. **Task 1: Produce previewable mockups (search overlay + 404)** - `3bcb1e5` (feat)
2. **Task 2: Implement approved Concept A for search overlay + 404** - `cc40cff` (feat)

**Plan metadata:** `(see below — committed after SUMMARY)`

## Files Created/Modified

- `src/components/layout/header/search-overlay-concept.stories.tsx` - Mockup stories (Concept A: calm base-scale, Concept B: constrained serif) for owner preview
- `src/app/not-found.concept.stories.tsx` - Mockup stories (Concept A: illustrated BrushCircle, Concept B: typographic Stamp) for owner preview
- `src/components/layout/header/search-overlay.tsx` - Removed `border-b-2 border-ink` wrapper div; input now sits in clean `.field` treatment
- `src/components/layout/header/search-form.tsx` - Replaced `clamp(1.4rem,3vw,2.2rem)` serif input with `type-body` scale + shared `.field` focus ring classes
- `src/app/not-found.tsx` - Replaced plain card with illustrated Concept A layout using Section.Root, BrushCircle, Eyebrow, three Buttons, and collection pill links

## Decisions Made

- Concept A (calm base-scale) selected for search overlay — body scale input (type-body/Hanken Grotesk), no oversized serif, no invented border hack; matches the shared `.field` focus treatment already used by TextInput and Textarea across the site
- Concept A (illustrated) selected for 404 — BrushCircle teapot on sunken section; tea-brand copy "Nothing to steep here" / "This page has gone cold"; three action buttons; quick collection pill links below a hairline divider
- Concept story files retained (not deleted) since they document the owner-approved design direction and are useful Storybook reference; tagged `mockup` to distinguish from production stories

## Deviations from Plan

None — plan executed exactly as written. No temporary preview routes were created (Storybook stories were used as specified). Concept story files were kept per the plan's guidance ("keep Storybook stories if they are useful documentation").

## Issues Encountered

`pnpm test:stories` produced 4 pre-existing failures in unrelated stories (`cart-view > Missing Image And Long Title`, `cart-line-actions > Update Error`, `cart-line-actions > Update Pending`, `footer/view > Default`). These failures exist before and after my changes — confirmed by the stories and files involved bearing no relation to any file I modified. These are out of scope per the deviation scope-boundary rule and have been noted in `deferred-items.md` tracking.

All other checks pass: `pnpm lint` (Tailwind class check + ESLint), `pnpm typecheck` (tsc --noEmit), `pnpm test:contracts` (35/35 pass), `pnpm build` (58/58 pages generated cleanly).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- UAT tests 4 (search overlay) and 16 (404 page) are now closed via the preview-first workflow
- Search overlay renders exactly one input and one close button in production (addresses the owner's "2 inputs and close buttons" Docs-tab observation)
- Ready for final UAT re-test of these two surfaces

---

_Phase: 11-full-visual-redesign_
_Completed: 2026-06-11_
