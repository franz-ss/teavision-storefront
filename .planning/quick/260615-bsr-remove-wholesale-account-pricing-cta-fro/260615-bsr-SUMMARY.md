---
status: complete
quick_id: 260615-bsr
commit: ec26a86
---

# Quick Task 260615-bsr Summary

## Completed

- Removed the separate Our Story "Wholesale Partnership" card and "Get Wholesale Pricing" CTA.
- Repositioned the section around one centered "Bulk Tea Orders" card that links to `/collections`.
- Reworded the surrounding CTA copy to focus on bulk tea ordering rather than separate wholesale account/pricing language.
- Updated the Our Story Storybook play assertions to reject the removed wholesale CTA copy.

## Verification

- `pnpm test:stories 'src/app/(storefront)/pages/our-story/_components/page-content.stories.tsx'` - 1 file, 2 tests passed.
- `pnpm exec eslint 'src/app/(storefront)/pages/our-story/_components/cta-section.tsx' 'src/app/(storefront)/pages/our-story/_components/page-content.stories.tsx'` - passed.
- `pnpm typecheck` - passed.
- Commit hook during `ec26a86` ran `node scripts/check-tailwind-classes.mjs && eslint .` and `node --test scripts/eslint-rules/*.test.mjs scripts/component-contracts/*.test.mjs`; both passed.
