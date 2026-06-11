# Milestones

## v1.2 SEO-Safe PLP Pagination Parity (Active)

**Phases planned:** 1 phase (13), 1 plan
**Timeline:** 2026-06-12 → active

**Planned:** Restore production-style collection pagination on headless PLPs
using `?page=N` URLs while preserving the live Shopify site's SEO contract for
launch: base collection canonicals, prev/next links where available, existing
robots intent for sort/filter URLs, and no public cursor-navigation URLs.

**Key planned outcomes:**

- Public collection pagination parity with production (`/collections/all?page=2`)
- Launch-safe production canonical behavior instead of a simultaneous SEO strategy change
- Internal page-number-to-cursor resolution over Shopify Storefront GraphQL
- Bounded PLP payloads preserved from Phase 05-03
- Classic accessible pagination UI replacing "Next products"

---

## v1.1 Blog Performance (Shipped: 2026-06-12)

**Phases completed:** 1 phase (12), 4 plans, 13 tasks
**Timeline:** 2026-06-11 → 2026-06-12

**Delivered:** Faster `/blogs/teavision-blogs` loading and image rendering — bounded Sanity
image URLs with LQIP blur placeholders, disciplined hero preloading, and a light
server-paginated default-listing query — while preserving the Phase 11 Tea Journal
design and behavior.

**Key accomplishments:**

- Bounded Sanity image URL builder (width/quality/fit per use case) with LQIP blur placeholders flowing end-to-end from GROQ projections through Hero and ArticleCard (12-01)
- Hero preload discipline: Suspense fallback hero no longer competes for LCP preload; cards never preload (12-01)
- Light server-paginated GROQ query for the unfiltered default listing — omits bodyText, excludes featured posts at the query level, derives tags via a lightweight subquery (12-02)
- Gap-closure hardening: coalesce() null-safety for the featuredPosts exclusion filter, truthy LQIP guard preventing an empty-string blurDataURL crash (12-03)
- Restored Phase 11 behavior in tag/search results (featured articles included) and publish/slug-guarded featuredPosts dereference on the default path (12-04)
- Verified 9/9 automated checks, 4/4 human UAT scenarios, security gate clean (0 open threats), Nyquist-compliant

**Notes at close** (audit status: tech_debt — see `milestones/v1.1-MILESTONE-AUDIT.md`):

- 12-02's CDN-backed Sanity reads were reverted post-phase (commit `ac3c6e7`, broke authenticated reads); orphaned helpers removed at audit (W1 closed)
- Out-of-range `?page` now clamps to the last page on the default path (W3 closed)
- Remaining debt: heavy `getBlog()` still runs for hero/metadata on the default route (W2), light-query results cast as full summaries (W4), no featured backfill when Sanity featuredPosts is unset — accepted in UAT (W5)

---

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
