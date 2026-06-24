---
status: complete
date: 2026-06-23
commit: 93d9c2f
---

# Quick Task 260623-ngx Summary

## Completed

- Added a regression test for `OverlayImageCard` to lock the hover scrim to an opacity fade rather than a background-image swap.
- Reworked the card scrim into a static base gradient plus a stronger hover gradient that fades in with `transition-opacity`.
- Replaced the previous arbitrary `rgba()` gradient classes with existing `ink` token gradient utilities.

## Verification

- `pnpm vitest run src/components/homepage/overlay-image-card/overlay-image-card.test.tsx` failed before the implementation because `transition-opacity` was missing.
- `pnpm vitest run src/components/homepage/overlay-image-card/overlay-image-card.test.tsx` passed after the implementation.
- `pnpm test:unit -- src/components/homepage/overlay-image-card/overlay-image-card.test.tsx` passed.
- `pnpm lint` passed, including the Tailwind class checker.
