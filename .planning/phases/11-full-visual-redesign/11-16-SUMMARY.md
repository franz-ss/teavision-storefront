---
phase: 11-full-visual-redesign
plan: 16
subsystem: homepage
tags: [homepage, copy, visual-parity, marquee, stat-band, testimonials, newsletter, faq, resend]
dependency_graph:
  requires: [11-15]
  provides: [homepage-upper-parity, homepage-lower-parity, newsletter-env-observability]
  affects: [homepage, contact-actions]
tech_stack:
  added: []
  patterns: [style={} for dynamic offsets per conventions exception, brand field on Testimonial type]
key_files:
  created: []
  modified:
    - src/app/(storefront)/page.tsx
    - src/components/homepage/hero/hero.tsx
    - src/components/homepage/content.ts
    - src/components/homepage/proof-points/proof-points.tsx
    - src/components/homepage/private-label/private-label.tsx
    - src/components/homepage/product-range/product-range.tsx
    - src/components/homepage/overlay-image-card/overlay-image-card.tsx
    - src/components/homepage/certification-coverage/certification-coverage.tsx
    - src/components/homepage/testimonials/testimonials.tsx
    - src/components/homepage/testimonials/testimonials-slider.tsx
    - src/components/homepage/newsletter/newsletter.tsx
    - src/components/homepage/newsletter/newsletter-form.tsx
    - src/components/homepage/newsletter/newsletter.stories.tsx
    - src/components/homepage/faq/faq.tsx
    - src/lib/contact/actions.ts
    - .env.example
    - .gitignore
    - scripts/component-contracts/button-system.test.mjs
decisions:
  - "Hero secondary CTA changed from brand to inverseSecondary per design ghost-on-dark pattern; contract test updated to match correct state"
  - "Testimonials condensed to design pull-quotes (~25-40 words) with a brand field added to the Testimonial type for display in selector vs attribution"
  - "Newsletter decorative image uses style={{}} for absolute offsets (right:-6%, top:-20%, width:46%, height:140%) per conventions exception for dynamic computed values"
  - "CertificationCoverage switched from full CERTIFICATION_COVERAGE cards to dedicated 6-item string list matching design data-layer.js:140"
metrics:
  duration: "~30 min"
  completed_date: "2026-06-10"
  tasks: 3
  files_changed: 18
---

# Phase 11 Plan 16: Homepage Parity Gap Closure Summary

Homepage UAT gaps 6 and 7 closed with approved verbatim copy, design-faithful layout, and newsletter/contact observability for missing RESEND_API_KEY.

## Tasks Completed

### Task 1: Homepage upper sections — copy, marquee, stat band, range tiles (35def96)

- **hero.tsx**: Replaced hardcoded h1/paragraph/CTA with `HOMEPAGE_HERO.title`/`.copy`/`.cta.children` from content.ts. Secondary CTA changed to `variant="inverseSecondary"` (ghost outline on dark hero per design, was incorrectly `brand`).
- **page.tsx**: Imported and mounted `<CertificationCoverage />` between `<OrganicHerbs />` and `<Testimonials />` — sole fix for the invisible marquee.
- **certification-coverage.tsx**: Replaced 4 full certification card titles with the design's 6 short cert strings (`ACO Certified Organic`, `USDA Organic`, `HACCP Food Safety`, `Golden Leaf Awards`, `Australian Made`, `Freight Insured`). Added `w-max` to the track div so the `-50%` loop is seamless. Fixed `gap-16`, `py-7`, `size-6.5`, `tracking-[0.12em]` per design `.certs` CSS.
- **proof-points.tsx**: Implemented the image branch so the Australian flag SVG renders for `point.image` entries. Increased icons to `size-10` (40px). Changed alignment to left (`flex-col` items, no `items-center`). Padding `px-7.5 py-11` per design. Removed banned `style={{ fontFamily }}` inline style. Added two-column mobile divider pattern. Removed `spacing="compact"` (changed to `spacing="none"` — item padding carries rhythm).
- **content.ts**: Added optional `body` field to `ImageCard` type. Added body descriptions to all three `SERVICE_CARDS`.
- **private-label.tsx**: Updated h2 to "Private Label & Custom Tea Solutions" and paragraph to approved copy. Added `{card.body}` paragraph render. Changed transition to `duration-350` (was 150ms default). Adjusted inner rhythm (`mb-5.5`, `mt-4`, `mt-3`, `mt-5.5`).
- **product-range.tsx**: Updated h2 to "Explore Our Product Range" and paragraph to approved copy. Changed grid gap to `gap-4` (16px, was 18px).
- **overlay-image-card.tsx**: Removed static gold "Shop Now" action label. Rewrote hover CTA to mono 11px uppercase with `translate-y-1.5` reveal + `duration-300`. Updated title to `text-[1.3rem] leading-[1.05]`. Added deepening hover scrim via group-hover background change. Preserved `group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100` contract classes.
- **button-system.test.mjs**: Updated contract to check for `variant="inverse"` + `variant="inverseSecondary"` in hero (was incorrectly checking for `brand` which was the pre-fix state).

### Task 2: Homepage lower sections — testimonials, newsletter visual, FAQ copy (068f13b)

- **content.ts**: Replaced long 100-230 word TESTIMONIALS raw quotes with design pull-quotes (~25-40 words per `data-layer.js:130-136`). Fixed St. Ali data bug: `name: 'Lucy Ward'`, `brand: 'ST. ALi'` (was swapped). Added optional `brand` field to `Testimonial` type. Reordered testimonials to match design order (MOOD, ST. ALi, Remedy, Buy Organics).
- **testimonials.tsx**: Replaced 4rem typographic `&ldquo;` glyph with the design's 50x50 gold-stroke SVG quote icon (`opacity-50 mb-4.5`). Converted centered header to split `range__head` layout (eyebrow+h2 left, muted paragraph max-w-[34ch] right). Set title "Teavision Testimonials" + approved paragraph. Changed tone from `sunken` to `surface`. Attribution now uses em dash: `{name} — {brand}`. Quotes wrapped with curly quote marks `&ldquo;…&rdquo;`.
- **testimonials-slider.tsx**: Added `brand?` to `TestimonialSelector` type. Selector button shows `brand` as primary label (font-bold), person name as secondary. Role column removed from selector (shown in attribution in blockquote).
- **newsletter.tsx**: Added absolutely-positioned decorative botanical image behind the body using `style={{}}` for exact design offsets (`right: -6%`, `top: -20%`, `width: 46%`, `height: 140%`, `opacity: 0.5`). Changed padding to `clamp(40px,6vw,72px)`. Body text changed to `text-paper/85 mt-3.5`.
- **newsletter-form.tsx**: Label/placeholder updated to "Enter your email". Gap changed to `gap-2.5`. Input gains `min-w-55` (220px). Subscribe button gains trailing `ArrowRight` icon.
- **newsletter.stories.tsx**: Updated `getByLabelText('Enter Email')` to `getByLabelText('Enter your email')` in all three play functions.
- **faq.tsx**: Title changed to "Frequently asked questions". Container constrained to `max-w-220` (55rem/880px per design) in both the header block and accordion list wrapper.

### Task 3: Newsletter/contact send — env provisioning doc + server-side warn (0a6ba64)

- **actions.ts**: Added `console.warn` in the `contact` missing-key branch (`submitContactSubmission`) and the `newsletter` missing-key branch (`sendNewsletterSignupAction`), clearly naming RESEND_API_KEY as the missing env var — distinguishes "not configured" from genuine provider failures in server logs.
- **.env.example**: Expanded RESEND_API_KEY comment to document it is required for _both_ newsletter signup and contact form delivery, with link to Resend dashboard.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Hero secondary CTA variant was `brand` (solid green) — contract test was encoding the incorrect state**

- **Found during:** Task 1 - `pnpm test:contracts` failure
- **Issue:** The contract test `button-system.test.mjs:117` asserted `variant="brand"` in hero.tsx. The plan specified switching the secondary CTA to `inverseSecondary` (design ghost on dark). After the fix, the contract checked the pre-fix state.
- **Fix:** Updated contract to check for `variant="inverse"` (primary) and `variant="inverseSecondary"` (secondary) which are the correct post-fix states per the design.
- **Files modified:** `scripts/component-contracts/button-system.test.mjs`
- **Commit:** 35def96

**2. [Rule 1 - Bug] Newsletter stories used old label text `Enter Email` after placeholder rename**

- **Found during:** Task 2 - `pnpm test:stories` failure
- **Issue:** Three newsletter story play functions used `canvas.getByLabelText('Enter Email')` but the label was changed to "Enter your email" per design spec N6.
- **Fix:** Updated all three story references to `getByLabelText('Enter your email')`.
- **Files modified:** `src/components/homepage/newsletter/newsletter.stories.tsx`
- **Commit:** 068f13b

**3. [Rule 2 - Missing] Added .gitignore entry for /test-results**

- **Found during:** Post-task verification
- **Issue:** Playwright/Vitest test runs create a `test-results/` directory not tracked in `.gitignore`, causing it to appear as untracked.
- **Fix:** Added `/test-results` to `.gitignore`.
- **Files modified:** `.gitignore`
- **Commit:** (included in SUMMARY final commit)

### Pre-existing Failures (Out of Scope)

3 story test failures in cart files (`cart-view.stories.tsx`, `cart-line-actions.stories.tsx`) were pre-existing and not caused by this plan's changes. Logged per scope boundary rule:

- `cart-line-actions.stories.tsx > Update Error` — pre-existing
- `cart-line-actions.stories.tsx > Update Pending` — pre-existing
- `cart-view.stories.tsx > Missing Image And Long Title` — pre-existing

## Known Stubs

None — all sections are wired to data sources. The newsletter decorative image uses an existing Shopify CDN asset (`c5a075ef...`) already present in `content.ts`.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes at trust boundaries introduced.

## Self-Check: PASSED

Files exist:
- src/app/(storefront)/page.tsx — FOUND (CertificationCoverage mounted)
- src/components/homepage/certification-coverage/certification-coverage.tsx — FOUND (w-max, 6-item strings)
- src/components/homepage/proof-points/proof-points.tsx — FOUND (image branch, size-10)
- src/lib/contact/actions.ts — FOUND (console.warn in both missing-key branches)

Commits exist:
- 35def96 feat(11-16): homepage upper sections — FOUND
- 068f13b feat(11-16): homepage lower sections — FOUND
- 0a6ba64 feat(11-16): newsletter/contact send — FOUND
