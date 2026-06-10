---
phase: 11-full-visual-redesign
plan: '03'
subsystem: ui-primitives
tags:
  [design-system, token-migration, ui-primitives, forms, controls, containers]
dependency_graph:
  requires: [11-01, 11-02]
  provides: [form-field-treatment, control-primitives, container-primitives]
  affects: [waves-3-5-surfaces]
tech_stack:
  added: []
  patterns:
    - .field treatment (bg-card/border-hairline/rounded-sm/focus:shadow-focus)
    - pill quantity stepper (rounded-full/border-hairline)
    - filter chip toggle (bg-card/border-hairline base, brand-tint selected)
    - .card-surface (bg-card/border-hairline-2/rounded-lg)
    - .jcard article card with motion-reduce trio preserved
    - type-mono-meta form labels
key_files:
  created: []
  modified:
    - src/components/ui/text-input/text-input.tsx
    - src/components/ui/textarea/textarea.tsx
    - src/components/ui/select/select.tsx
    - src/components/ui/checkbox/checkbox.tsx
    - src/components/ui/checkbox/checkbox.stories.tsx
    - src/components/ui/form-label/form-label.tsx
    - src/components/ui/quantity-stepper/quantity-stepper.tsx
    - src/components/ui/icon-button/icon-button.tsx
    - src/components/ui/toggle-button/toggle-button.tsx
    - src/components/ui/toggle-button/toggle-button.stories.tsx
    - src/components/ui/disclosure-button/disclosure-button.tsx
    - src/components/ui/star-rating/star-rating.tsx
    - src/components/ui/price/price.tsx
    - src/components/ui/card/card.tsx
    - src/components/ui/card/card.stories.tsx
    - src/components/ui/accordion/accordion.tsx
    - src/components/ui/accordion/accordion.stories.tsx
    - src/components/ui/dialog/dialog.tsx
    - src/components/ui/dialog/dialog.stories.tsx
    - src/components/ui/article-card/article-card.tsx
    - src/components/ui/rich-text/rich-text.tsx
    - src/components/ui/rich-text/rich-text.stories.tsx
    - src/components/ui/newsletter-signup/newsletter-signup.tsx
decisions:
  - 'quantity-stepper uses inline-flex with rounded-full border wrapper; IconButton size-11 children use rounded-none with rounded-l/r-full to avoid double corner radius'
  - 'accordion chevron uses border-r/border-b rotate-45 pattern instead of Chevron icon to avoid extra icon import'
  - 'rich-text.stories.tsx: type-display replaces both type-display-01 and type-display-02 per UI-SPEC rename table'
  - 'newsletter-signup: success/error state border tokens updated to new system while keeping role=status/role=alert and honeypot field'
metrics:
  duration: '~8 minutes'
  completed: '2026-06-10'
  tasks: 3
  files: 23
---

# Phase 11 Plan 03: Form-field, Controls, and Container Primitive Restyle Summary

**One-liner:** All remaining `src/components/ui/*` primitives (form fields, controls, containers) migrated from old `--tv-*`-backed token classes to the new OKLCH design system with `.field`, `.qty`, `.card-surface`, and `.jcard` mockup treatments applied.

---

## Tasks Completed

| Task | Name                                                                             | Commit  | Files                                                                                                                                   |
| ---- | -------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Form-field family (.field treatment)                                             | ce4c4a1 | text-input, textarea, select, checkbox, checkbox.stories, form-label                                                                    |
| 2    | Controls — stepper, icon/toggle/disclosure, stars, price                         | 4d9d062 | quantity-stepper, icon-button, toggle-button, toggle-button.stories, disclosure-button, star-rating, price                              |
| 3    | Containers — card, accordion, dialog, article-card, rich-text, newsletter-signup | c5e47c0 | card, card.stories, accordion, accordion.stories, dialog, dialog.stories, article-card, rich-text, rich-text.stories, newsletter-signup |

---

## What Was Built

### Task 1 — Form-field family

- **text-input / textarea / select**: `bg-card border-hairline rounded-sm px-4 py-3.5 text-ink placeholder:text-ink-faint`; focus replaced `focus-visible:ring-2` with `focus:border-brand focus:shadow-focus focus:ring-0` (green-tint glow as the single focus signal).
- **checkbox**: `.fbox` mockup — `size-4.5 rounded-[5px] border-[1.5px] border-hairline`; checked state `accent-brand checked:bg-brand checked:border-brand checked:text-paper`.
- **form-label**: `type-mono-meta text-ink-faint` (mono 11px uppercase, replaces `type-label text-strong`).
- **checkbox.stories**: added `Checked` and `Disabled` story states.

### Task 2 — Controls

- **quantity-stepper**: `inline-flex items-center rounded-full border border-hairline` pill wrapper; `size-11` touch-target buttons (left `rounded-l-full`, right `rounded-r-full`); count `min-w-7 font-mono text-[13px]`.
- **icon-button**: `rounded-full hover:bg-brand-tint hover:text-brand`; 44px touch targets (`h-11 w-11`) preserved for contract tests.
- **toggle-button**: chip filter treatment — `border-hairline bg-card text-ink-soft rounded-full` base; selected `border-brand/30 bg-brand-tint text-brand`; stories add `ChipSelected` state and refresh with new tokens.
- **disclosure-button**: `text-default` → `text-ink`, hover/expanded `text-brand` (aria attributes unchanged).
- **star-rating**: filled `text-gold`, empty `text-ink-faint/40`; count `text-ink-soft`.
- **price**: `font-display` amount, `font-mono text-[11px] text-ink-faint` compare-at; sale tone `text-brand`.

### Task 3 — Containers

- **card**: `bg-card border-hairline-2 rounded-lg` (`.card-surface`); `text-default` → `text-ink`; stories refreshed.
- **accordion**: `divide-y divide-hairline`; `font-display text-[1.15rem]` headers; brand chevron on open state; `text-ink-soft` body.
- **dialog**: `bg-paper rounded-lg shadow-4` panel; `bg-ink/35 backdrop-blur-[2px]` scrim; `border-hairline` header divider; focus-trap and close behavior untouched.
- **article-card**: `.jcard` — `rounded-lg` media with `hover:scale-105`; motion-reduce trio (`motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100`) preserved on zoom line; `type-mono-meta text-brand` category tags; `font-display text-[1.25rem]` title.
- **rich-text**: `text-default` → `text-ink`; stories: `type-display-01/02` → `type-display`, `text-default` → `text-ink`, `text-muted` → `text-ink-soft`, `border-default` → `border-hairline`, `bg-surface-sunken` → `bg-paper-2`, link classes → `text-brand hover:text-brand-deep`.
- **newsletter-signup**: pill input (`rounded-full border-hairline bg-card px-4.5 py-3.5`); dark-tone variant `bg-paper/5 border-paper/20 focus:border-gold`; honeypot field, action prop, `role=alert`, `role=status`, and `aria-describedby` wiring untouched.

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Verification

All checks passed:

- `pnpm lint:tailwind` (via `pnpm lint`) — exit 0
- `pnpm lint` — exit 0
- `pnpm typecheck` — exit 0
- `pnpm test:contracts` — 35/35 tests pass (motion-reduce trio, touch targets, DisclosureButton state props, Button variants all green)
- `pnpm test:unit` — 38/38 tests pass

---

## Known Stubs

None. All components render real token-driven styles with no hardcoded placeholder values.

---

## Threat Flags

No new network endpoints, auth paths, file access patterns, or schema changes introduced. This plan is a class-string-only migration.

---

## Self-Check: PASSED

- `src/components/ui/text-input/text-input.tsx` — FOUND (contains `bg-card`)
- `src/components/ui/quantity-stepper/quantity-stepper.tsx` — FOUND (contains `rounded-full`, `size-11`)
- `src/components/ui/article-card/article-card.tsx` — FOUND (contains `motion-reduce:group-hover:scale-100`)
- `src/components/ui/card/card.tsx` — FOUND (contains `border-hairline-2`)
- `src/components/ui/form-label/form-label.tsx` — FOUND (contains `type-mono-meta`)
- Commits ce4c4a1, 4d9d062, c5e47c0 — all present in git log
