---
phase: 11-full-visual-redesign
plan: 17
subsystem: collection-plp,collections-index,search
tags: [gap-closure, uat, hero-banner, product-card, star-rating, collections-index, search-empty-state, contact-domain]
dependency_graph:
  requires: []
  provides: [plp-banner-hero, star-rating-on-cards, collections-full-grid, contact-section-domain, search-empty-state]
  affects: [collections-plp, collections-index, search-results, homepage-contact, contact-domain]
tech_stack:
  added: []
  patterns: [conditional-hero-branch, getDescriptionHeroImage-signal, StarRating-drop-in, contact-domain-move]
key_files:
  created:
    - src/components/contact/contact-section/contact-section.tsx
    - src/components/contact/contact-section/contact-section.stories.tsx
    - src/components/contact/contact-section/index.ts
    - src/components/contact/contact-section-form/contact-section-form.tsx
    - src/components/contact/contact-section-form/contact-section-form.stories.tsx
    - src/components/contact/contact-section-form/index.ts
  modified:
    - src/app/(storefront)/collections/[handle]/_components/hero.tsx
    - src/app/(storefront)/collections/[handle]/_components/page-content.tsx
    - src/app/(storefront)/collections/[handle]/_components/product-list.tsx
    - src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts
    - src/app/(storefront)/collections/[handle]/page.tsx
    - src/components/collection/product-card/product-card.tsx
    - src/components/collection/product-card/product-card.stories.tsx
    - src/app/(storefront)/collections/page.tsx
    - src/app/(storefront)/page.tsx
    - src/components/homepage/contact/contact.tsx
    - src/components/homepage/contact-form/contact-form.tsx
    - src/components/contact/index.ts
    - src/components/search/search-results-view/search-results-view.tsx
decisions:
  - "Banner hero branches on getDescriptionHeroImage() != null — no handle-specific hacks"
  - "ContactSection moved to src/components/contact/; homepage shims re-export to preserve barrel API"
  - "Search empty state short-circuits chrome only when 0 results AND 0 active filters"
  - "Collections index uses full getCollectionSummaries grid sorted by title with All first"
metrics:
  duration: 12m
  completed: 2026-06-10
  tasks: 3
  files: 19
---

# Phase 11 Plan 17: Collection/Search Gap Closure (UAT 9, 10, 11) Summary

Closed UAT tests 9, 10, 11: PLP hero banner logic restored, product-card star rating added, collections index rebuilt as a full grid, contact section moved to the contact domain, and search empty state reduced to hero + No-matches card.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | PLP hero banner logic + star rating + mobile grid | bbf5cee | hero.tsx, page-helpers.ts, product-card.tsx |
| 2 | Collections index full grid + ContactSection domain move | 984bedf | collections/page.tsx, contact-section/, contact-section-form/ |
| 3 | Search empty state simplified | 5464eeb | search-results-view.tsx |

## What Was Built

**Task 1 — PLP hero banner logic, star rating, mobile grid spacing (bbf5cee)**

- `hero.tsx`: Added a `bannerImage` prop. When a banner is detected, renders the art full-opacity above the fold with a visible h1 and `storyDisclosure` below. The default green-band mode is preserved for non-banner collections. Removed `belowHeroImage`/`showIntro` props (replaced by `bannerImage`/`storyDisclosure`).
- `page-helpers.ts`: Exported `getDescriptionHeroImage()`. Simplified `getHeroImage()` to 2 params (no handle). Deleted `HERO_IMAGE_OVERRIDES`, `HIDDEN_HERO_INTRO_HANDLES`, `FORCED_RICH_DESCRIPTION_HANDLES`, `shouldShowCollectionIntroContent()`, `shouldAlwaysShowRichDescription()`.
- `page-content.tsx`: Branches on `bannerImage = getDescriptionHeroImage(collection.descriptionHtml)`. Removed `shouldAlwaysShowRichDescription` / `shouldShowCollectionIntroContent` usage. `storyDisclosure` renders below banner in banner mode, or is omitted in green-band mode (the green band already shows title + description).
- `product-list.tsx`: Mobile gap tightened to `gap-y-4 gap-x-3` with `sm:gap-y-5.5 sm:gap-x-4.5` restoring 22px/18px at 640px+.
- `product-card.tsx`: Added `<StarRating rating count size="sm" className="mt-1" />` between title and price when `product.rating !== undefined`.
- `product-card.stories.tsx`: Added `WithRating` and `NoRating` story cases with play assertions.

**Task 2 — Collections index full grid + ContactSection domain move (984bedf)**

- `collections/page.tsx`: Replaced "8 featured tiles + directory" with a single full card grid from `getCollectionSummaries()` filtered to exclude `frontpage`, sorted alphabetically with `all` first. Directory section, featured/menu helpers, and `SHOPIFY_COLLECTIONS_INDEX_MENU_HANDLE` import removed. JSON-LD ItemList rebuilt from the full grid. `<ContactSection action={submitContactFormAction} />` mounted as the final section.
- `contact/contact-section/`: New component directory containing `ContactSection` (visual/layout identical to the former `Contact` from `homepage/contact/`). Stories retitled `Contact/ContactSection`.
- `contact/contact-section-form/`: New component directory containing `ContactSectionForm` (logic identical to the former `HomepageContactForm` from `homepage/contact-form/`). Stories retitled `Contact/ContactSectionForm`.
- `contact/index.ts`: Exports `ContactSection` and `ContactSectionForm` alongside the existing `ContactForm`.
- `homepage/contact/contact.tsx`: Shim that re-exports `ContactSection as Contact` — homepage barrel unchanged.
- `homepage/contact-form/contact-form.tsx`: Shim that re-exports `ContactSectionForm as HomepageContactForm` — homepage barrel unchanged.
- `homepage/page.tsx`: Updated to import `ContactSection` directly from `@/components/contact/contact-section`.

**Task 3 — Search empty state simplification (5464eeb)**

- `search-results-view.tsx`: Added a short-circuit branch: when `result.products.length === 0` AND `selectedFilterCount === 0`, renders only `SearchHero` + a `SearchAlert` (No-matches card). The full toolbar/filter/sort chrome is suppressed. When filters are active and 0 results are returned, the full layout is preserved so users can see and clear their filters.

## Deviations from Plan

**1. [Rule 2 - Missing functionality] StoryDisclosure not shown in green-band mode**

During implementation of the banner hero branch, the plan's green-band hero previously received `StoryDisclosure` via `belowHeroImage`. After the refactor the new `hero.tsx` only renders `storyDisclosure` in banner mode. For the green-band mode, the collection description is already rendered inline in the hero body as `heroDescription`. For collections with a rich description (longer than plain text), the `storyDisclosure` was previously shown above the title inside the green band — this was the "incorrect" position per the original theme (banner disclosure is below the art).

To keep the green-band hero clean and uncluttered (per the design's `.coll__hero` spec), `storyDisclosure` was not wired back into the green-band hero. The StoryDisclosure is now only shown below the banner art in banner mode, which matches the original theme's inline description rendering.

**Known design delta triage (noted, not fixed — per plan instruction):**
- `pcard__origin`: origin segment (globe icon + origin text) — data not available on CollectionProductSummary
- `pcard__grade`: mono right-aligned grade label — not in CollectionProductSummary
- `pcard__fav`: wishlist save button — no wishlist feature; deferred for owner decision
- Quick-add entrance animation: `translateY(10px)` — current card uses opacity-only; low priority

## Known Stubs

None — all data wired from live sources.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes introduced.

## Self-Check: PASSED

- hero.tsx: FOUND
- contact-section.tsx: FOUND
- contact-section-form.tsx: FOUND
- SUMMARY.md: FOUND
- Commit bbf5cee: FOUND
- Commit 984bedf: FOUND
- Commit 5464eeb: FOUND
