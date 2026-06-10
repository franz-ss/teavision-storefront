---
phase: 11
plan: "02"
subsystem: ui-primitives
tags: [button, eyebrow, section, badge, design-system, tailwind, cva]
dependency_graph:
  requires: ["11-01"]
  provides: ["Eyebrow", "Button-pill", "Section-new-tokens", "Badge-pill"]
  affects:
    - src/components/ui/button/button.tsx
    - src/components/ui/eyebrow/eyebrow.tsx
    - src/components/ui/section/section.tsx
    - src/components/ui/badge/badge.tsx
    - scripts/component-contracts/button-system.test.mjs
tech_stack:
  added: []
  patterns:
    - "cva with new OKLCH token classes (bg-brand, bg-paper-2, bg-brand-deep, bg-ink)"
    - "rounded-full pill shape for buttons and badges"
    - "py-section / px-gutter rhythm tokens"
    - "Eyebrow: type-eyebrow + before:w-5.5 rule line"
key_files:
  created:
    - src/components/ui/eyebrow/eyebrow.tsx
    - src/components/ui/eyebrow/eyebrow.stories.tsx
    - src/components/ui/eyebrow/index.ts
  modified:
    - src/components/ui/button/button.tsx
    - src/components/ui/button/button.stories.tsx
    - scripts/component-contracts/button-system.test.mjs
    - src/components/ui/section/section.tsx
    - src/components/ui/section/section.stories.tsx
    - src/components/ui/badge/badge.tsx
    - src/components/ui/badge/badge.stories.tsx
    - src/components/ui/index.ts
decisions:
  - "brandStrong kept as temporary alias of brand in Section to avoid breaking unmigrated call sites until plan 11-14 migration sweep"
  - "Section.Intro gains optional eyebrow prop (string) rendered via Eyebrow component above the heading"
  - "Badge keeps all existing variant names (outOfStock/sale/new/certification) for backward compat while adding organic/gold/onDark"
  - "Button hover lift (-translate-y-0.5 shadow-2) applied only to filled variants (brand/primary/inverse); motion-reduce guards applied"
  - "Section.Container gains base variant (max-w-base=1280px) for FAQ/editorial in addition to default (max-w-wide=1480px) and compact (max-w-prose)"
metrics:
  duration: "451s (~7.5 min)"
  completed: "2026-06-10"
  tasks_completed: 3
  files_changed: 11
---

# Phase 11 Plan 02: Core Primitive Restyle Summary

Restyles four structural UI primitives using the Phase 11 OKLCH design system tokens: Button gets pill shape and mockup variant mapping, a new Eyebrow signature component is introduced, Section tones/spacing/container are remapped to new tokens, and Badge becomes the mockup `.pill` treatment.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Button pill restyle + lockstep contract test + stories | 94d4bc8 | button.tsx, button-system.test.mjs, button.stories.tsx |
| 2 | Create the Eyebrow signature component | 2a85bfe | eyebrow.tsx, eyebrow.stories.tsx, eyebrow/index.ts, ui/index.ts |
| 3 | Section tone/spacing/container remap + Badge pill | 28e1fd3 | section.tsx, section.stories.tsx, badge.tsx, badge.stories.tsx |

## What Was Built

### Button — pill restyle
- Base: `rounded-full` replaces `rounded-md`; `gap-2.5`, transition expanded to `background-color,color,box-shadow,transform`
- Variants mapped to mockup: `brand`=green, `primary`=ink, `secondary`=hairline ghost, `inverse`=paper, `inverseSecondary`=ghost-on-dark, `ghost`=brand-tint
- Hover lift (`-translate-y-0.5 shadow-2`) on filled variants with `motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-0` guards
- Sizes updated: `sm=px-4.5 text-[0.86rem]`, `md=px-6.5`, `lg/cta=px-8.5`; `min-h-11`/`min-h-12` touch targets preserved (AA contract)
- Contract test updated in lockstep: `rounded-full` assertion, new sm size string, inverse background `var(--color-ink)`

### Eyebrow — new signature component
- Server component (no `use client`) at `src/components/ui/eyebrow/`
- `type-eyebrow inline-flex items-center gap-2.5` base with leading rule `before:h-px before:w-5.5 before:bg-current before:opacity-60`
- cva `tone`: `brand`=`text-brand` (default), `muted`=`text-ink-faint`, `gold`=`text-gold` (dark bands)
- Boolean `rule` prop (default true); when false, `before:*` classes dropped via `cn()`
- 4 stories: Brand, Muted, GoldOnDark (ink bg decorator), NoRule
- Exported from `src/components/ui/eyebrow/index.ts` and `src/components/ui/index.ts`

### Section — new token mapping
- Tones: `surface`=`bg-paper text-ink`, `sunken`=`bg-paper-2 text-ink`, `brand`=`bg-brand-deep text-paper`, `brandStrong`=`bg-brand-deep text-paper` (temp alias), `inverse`=`bg-ink text-paper`
- Spacing: `default`=`py-section` (clamp 4rem→8.125rem), `compact`=`py-8 md:py-12`, `none`=''
- Container: base `mx-auto px-gutter`; `default`=`max-w-wide` (1480px), `compact`=`max-w-prose`, `base`=`max-w-base` (1280px, new)
- Section.Intro: optional `eyebrow` string prop renders Eyebrow above `type-heading-01` title; copy uses `type-lede text-ink-soft`; Eyebrow imported via `../eyebrow` (within-domain relative per conventions)
- Stories: brandStrong story dropped; WithEyebrow + BaseContainer stories added

### Badge — mockup pill
- Base: `inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 type-mono-meta text-ink-soft`
- Legacy variants updated with new tokens: `outOfStock`=danger-tint, `sale`=gold-tint, `new`/`certification`=paper-2
- New variants: `organic` (brand-tint + 6px dot `before:size-1.5 before:rounded-full before:bg-current`), `gold` (gold-tint), `onDark` (paper/15)
- 8 stories covering all 7 variants

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] ESLint import/order error on section.tsx**
- **Found during:** Task 3
- **Issue:** Relative import `../eyebrow` appeared directly after `@/lib/utils` internal alias import without an empty line separator — violating the import/order rule (groups require blank lines)
- **Fix:** Added blank line between `@/lib/utils` group and `../eyebrow` relative group
- **Files modified:** src/components/ui/section/section.tsx
- **Commit:** Fixed inline before Task 3 commit (28e1fd3)

### Minor Criterion Note

The acceptance criterion `grep -c "Eyebrow" src/components/ui/index.ts >= 1` technically returns 0 because the barrel uses `export * from './eyebrow'` (lowercase per convention) rather than an explicit named re-export. The intent is satisfied — the Eyebrow component IS correctly exported from the barrel and accessible via `import { Eyebrow } from '@/components/ui'`. All other barrel entries follow the same lowercase `./domain-name` convention.

## Known Stubs

None — all component variants wire to real design tokens from globals.css.

## Threat Flags

None — pure presentational restyle of internal primitives per threat model.

## Self-Check

Files exist:
- [x] src/components/ui/eyebrow/eyebrow.tsx
- [x] src/components/ui/eyebrow/eyebrow.stories.tsx
- [x] src/components/ui/eyebrow/index.ts
- [x] src/components/ui/button/button.tsx (rounded-full, mockup variants)
- [x] src/components/ui/section/section.tsx (py-section, bg-paper-2)
- [x] src/components/ui/badge/badge.tsx (type-mono-meta, rounded-full)

Commits exist:
- [x] 94d4bc8 — button pill restyle
- [x] 2a85bfe — eyebrow component
- [x] 28e1fd3 — section + badge

Gates:
- [x] pnpm test:contracts: 35/35 pass
- [x] pnpm lint: clean
- [x] pnpm typecheck: clean

## Self-Check: PASSED
