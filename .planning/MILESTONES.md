# Milestones

## v1.0 Headless Storefront Launch (Shipped: 2026-06-11)

**Phases completed:** 9 phases (1, 2, 4, 5, 6, 8, 10, 11; Phase 9 superseded), 35 plans, 42 tasks
**Timeline:** 2026-04-28 → 2026-06-11 (~6.5 weeks), 476 commits, ~964 files touched (+132k/−15k LOC)

**Delivered:** A production-ready headless Shopify storefront on Next.js 16 — bulk-savings
purchasing, owned Searchanise search, hardened production posture, and a full visual
redesign of every surface on the new warm-paper/green/gold design system.

**Key accomplishments:**

- Bulk savings end-to-end: PDP "Buy in Bulk and Save" tiers (Shopify quantity breaks → metafield → HulkApps fallback), quantity add-to-cart, and Shopify-reported discount allocations in cart (Phase 1)
- Searchanise-ranked catalogue search rendered through owned Next UI with URL-driven filters, sorting, pagination, and legacy route redirects (Phase 2)
- Footer ported 1:1 from the live site, then restyled to the redesign ink treatment (Phases 4, 11)
- Production-readiness remediation: conversion-path correctness, accessibility, JSON-LD safety, rate limiting, PLP performance, sitemap hygiene (Phase 5) plus pre-launch noindex controls (Phase 6)
- Optimized collection quick-add without per-card purchase forms or hydration bloat (Phase 8), later absorbed into the redesigned vertical product card (11-08)
- Revenue-critical cart→checkout handoff covered by unit/integration/fake-Shopify e2e suites (Phase 10)
- Full visual redesign across all 22 plans: new OKLCH token system, Spectral/Hanken Grotesk/Space Mono typography, every storefront surface restyled, old `--tv-*`/steep/stone system deleted — refined through two owner UAT rounds and a preview-first concept workflow for the search overlay and 404 page (Phase 11)
- New owner-authored landing surfaces shipped alongside the redesign: bulk-wholesale-supply, private-label-packing, tea-bag-manufacturer, supply-chain protection band, NPD order form

**Known gaps at close** (audit status: gaps_found — accepted as tech debt, see `milestones/v1.0-MILESTONE-AUDIT.md`):

- CQA-05: collection empty-state "Clear filters" misdirects to /pages/contact (one-prop fix in product-list.tsx)
- CARD-01: Phase 9 wide-image horizontal card superseded by the owner-approved vertical card; Phase 9 closed as superseded
- 11-HUMAN-UAT.md: visual parity sweep + live Resend newsletter test pending
- Tech debt: ProductCard client-component hydration, dead ProductPurchaseForm, sitemap missing new landing pages, cart grand-total client estimate

Known deferred items at close: 15 (see STATE.md Deferred Items)

---
