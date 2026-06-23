---
status: complete
date: 2026-06-23
---

# Quick Task 260623-ngx: Smooth the Hover Background Overlay Transition in the Explore Our Product Range Section

## Goal

Make the homepage product range card hover overlay fade smoothly instead of swapping gradient backgrounds abruptly.

## Tasks

1. Add a focused regression test for the shared homepage overlay image card hover scrim.
2. Replace the non-interpolable hover background swap with layered gradient scrims and an opacity transition.
3. Run focused unit verification and lint to cover the UI-only change.

## Acceptance Criteria

- Product range cards no longer use `transition-[background]` for the hover scrim.
- The hover scrim uses `transition-opacity` with `motion-reduce:transition-none`.
- The shared overlay card continues to use semantic Tailwind token classes for the scrim colors.
