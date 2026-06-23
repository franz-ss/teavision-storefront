---
status: complete
date: 2026-06-23
---

# Quick Task 260623-fmq: Remove the Wholesale Upsell Card from the Collection Sidebar

## Goal

Remove the wholesale access upsell card from collection sidebars while leaving filters and related collection navigation intact.

## Tasks

1. Remove the wholesale upsell markup from the collection sidebar component.
2. Remove any imports that are only used by that upsell card.
3. Run focused verification for the changed component and record the outcome.

## Acceptance Criteria

- Collection sidebars no longer render the "Need help choosing?" wholesale upsell card.
- Collection sidebars no longer render the "Wholesale access" CTA from that card.
- Existing filter panel and related collection sidebar behavior remains unchanged.
