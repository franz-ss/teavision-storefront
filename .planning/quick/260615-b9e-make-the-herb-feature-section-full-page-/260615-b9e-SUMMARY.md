---
status: complete
completed: 2026-06-15
commit: 0854415
---

# Quick Task 260615-b9e Summary

Implemented the organic herbs homepage section as a full-bleed image band instead of a rounded card inside the page container. The band now uses `Section.Root` with `spacing="none"`, a viewport-wide `next/image` fill, tighter vertical spacing, and canonical Tailwind min-height tokens that keep the section around half a desktop viewport while preserving readable copy.

Also set the Storybook story to `layout: 'fullscreen'` so component review reflects the real full-width layout.

## Verification

- `pnpm lint` passed.
- Commit hook passed `scripts/check-tailwind-classes.mjs`, `eslint .`, and `node --test scripts/eslint-rules/*.test.mjs scripts/component-contracts/*.test.mjs`.
- Storybook started on `http://127.0.0.1:6006`; the isolated story measured about 557px tall in a 1280x720 viewport before the browser policy blocked the refreshed screenshot pass.
