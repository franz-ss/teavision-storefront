---
status: complete
date: 2026-06-23
commit: afa98ce
---

# Quick Task 260623-fmq Summary

## Completed

- Removed the wholesale upsell card from the collection sidebar.
- Removed the now-unused shared `Button` import from the sidebar component.
- Left the filter panel and related collection navigation unchanged.

## Verification

- `rg -n "Need help choosing\?|Wholesale access|wholesale-account-request" -- "src/app/(storefront)/collections/[handle]/_components/sidebar.tsx"` found no matches.
- `pnpm lint` passed.
- Commit hook passed `pnpm lint` and `pnpm test:contracts` with 40/40 tests passing.
