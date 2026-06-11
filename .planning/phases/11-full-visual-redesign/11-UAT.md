---
status: testing
phase: 11-full-visual-redesign
source:
  [
    11-01-SUMMARY.md,
    11-02-SUMMARY.md,
    11-03-SUMMARY.md,
    11-04-SUMMARY.md,
    11-05-SUMMARY.md,
    11-06-SUMMARY.md,
    11-07-SUMMARY.md,
    11-08-SUMMARY.md,
    11-09-SUMMARY.md,
    11-10-SUMMARY.md,
    11-11-SUMMARY.md,
    11-12-SUMMARY.md,
    11-13-SUMMARY.md,
    11-14-SUMMARY.md,
    11-15-SUMMARY.md,
    11-16-SUMMARY.md,
    11-17-SUMMARY.md,
    11-18-SUMMARY.md,
    11-19-SUMMARY.md,
    11-20-SUMMARY.md,
    11-21-SUMMARY.md,
    11-22-SUMMARY.md,
    11-VERIFICATION.md,
  ]
started: 2026-06-11T07:31:59+08:00
updated: 2026-06-11T08:31:23+08:00
---

## Current Test

number: 6
name: Collection Pages and Product Cards
expected: |
  Collection pages preserve the original banner logic for collections with embedded banner art, show the regular green hero where appropriate, place read-more disclosure correctly, and render product grids with improved spacing. Product cards include rating stars when available, badges, title, price, unit/variant metadata, and quick-add/view-options behavior without missing design elements.
awaiting: user response

## Tests

### 1. Brand Foundation and Primitives

expected: The storefront uses the new warm botanical design system everywhere: Spectral display headings, Hanken Grotesk body text, Space Mono micro-labels, warm paper/card surfaces, botanical greens, and gold accents. Buttons are pill-shaped with no hover lift, fields use the new warm focus treatment, badges/eyebrows/sections match the redesign, and no old steep/stone/cool-gray styling is visible.
result: pass

### 2. Header, Mega Menus, Search Overlay, and Mobile Menu

expected: Desktop header shows the lg-only ink utility bar, sticky translucent main bar, logo, pill nav triggers, search icon, cart count, and wholesale CTA. Shop and Services mega menus stay open while moving the cursor into the panel. Search opens a calmer overlay with a body-scale input and clean focus state. At mobile width, the menu has a visible close button, no horizontal scrollbar, clear category affordances, and no confusing button-like category chips.
result: issue
reported: "magamenu backdrop should blur, also mobile menu has scrollbar that scrolls the entire page where it should only scroll the menu when necessary"
severity: major

### 3. Footer and Error Pages

expected: Footer uses the ink-dark redesign with original copy/links, quality pills, newsletter field, visible payment chips, and popular-searches SEO links hidden from visual layout. The 404 page is creative and on-brand without feeling overdesigned, with helpful actions and no old styling remnants.
result: issue
reported: "when show popular searches clicked footer should expand and it should show something like the screenshot, check the sibling teavision-theme how it is handled, the items list and its order should be maintained"
severity: major

### 4. Homepage Upper Sections

expected: Homepage hero uses the approved "Australia's #1 tea company" copy and original lede, full-bleed image/scrim, gold eyebrow, and matching CTA design. Stat band includes the Australian flag treatment and larger gold icons. Product range, private-label cards, organic herbs split, and certification marquee match the extracted design, with the marquee visible and animated.
result: pass

### 5. Homepage Lower Sections

expected: Testimonials use the approved "Teavision Testimonials" copy, handle long quotes cleanly, and match the gold quote/design treatment. Newsletter and contact sections match the design and show proper validation/success/error states. FAQ uses original copy and accordion contents, with spacing and button styling aligned to the redesign.
result: pass

### 6. Collection Pages and Product Cards

expected: Collection pages preserve the original banner logic for collections with embedded banner art, show the regular green hero where appropriate, place read-more disclosure correctly, and render product grids with improved spacing. Product cards include rating stars when available, badges, title, price, unit/variant metadata, and quick-add/view-options behavior without missing design elements.
result: [pending]

### 7. Collections Index

expected: The collections index shows a card grid only, with "All" first linking to /collections/all, production-matching collection order, no Directory/All collections list section, and the reusable "Need help? Speak with our Ingredients Experts Today." contact section at the bottom.
result: [pending]

### 8. Search Results

expected: Search results reuse PLP styling for hero, facets, sort, chips, cards, and pagination. Empty/no-results queries show only the hero and a "No matches" card, without extra filter/sort/toolbar chrome.
result: [pending]

### 9. Product Detail Page

expected: PDP layout, gallery, title/rating/price rhythm, variant tiles, buy row, assurance row, bulk-savings tiers, accordions, and recommendation rails align with the extracted design spacing and element treatment while preserving variant selection, quantity validation, add-to-cart success feedback, and recommendation quick view behavior.
result: [pending]

### 10. Cart Page

expected: Cart uses the redesign width/container, aligned header and row columns, visible compare-at/slashed prices and discount savings, optimistic quantity updates without a full visible loading cycle per click, correct totals, remove behavior, checkout handoff button, and a polished empty-cart state.
result: [pending]

### 11. Blog and Tea Journal

expected: Blog listing and article pages use the redesigned hero, tag pills, article cards, rich text styles, pagination, tighter section spacing, optimized images, the newsletter band "Explore the World of Tea with Monthly Newsletters" with teapot motif, and the reusable contact section.
result: [pending]

### 12. Supporting Pages and Bulk Wholesale Supply

expected: Supporting pages use the redesign system with no old remnants. /pages/bulk-wholesale-supply exists as a bespoke page using the supplied production copy/layout stripped into design-system components, including all intended sections, forms, accordions, CTAs, and the reusable contact section.
result: [pending]

### 13. Desktop and Mobile Visual Parity

expected: Header, footer, homepage, PLP/search, PDP, cart, blog, supporting pages, /pages/bulk-wholesale-supply, and 404 visually match design/extracted-design.html at representative desktop and about 375px mobile widths. No horizontal overflow appears on mobile.
result: [pending]

### 14. Newsletter Signup End-to-End

expected: With RESEND_API_KEY configured, submitting newsletter forms from the homepage band, blog band, and footer delivers the signup and shows the success state. With the key absent, the server logs a console.warn naming RESEND_API_KEY instead of failing silently.
result: [pending]

## Summary

total: 14
passed: 3
issues: 2
pending: 9
skipped: 0
blocked: 0

## Gaps

- truth: "Desktop mega menu backdrop blurs the page behind it, and mobile menu scrolling is contained inside the menu overlay instead of scrolling the entire page"
  status: failed
  reason: "User reported: magamenu backdrop should blur, also mobile menu has scrollbar that scrolls the entire page where it should only scroll the menu when necessary"
  severity: major
  test: 2
  artifacts: []
  missing: []

- truth: "Footer Popular Searches expands from the bottom trigger into a visible dark multi-column link block matching the sibling Shopify theme order, and the trigger label changes to Hide Popular Searches"
  status: failed
  reason: "User reported: when show popular searches clicked footer should expand and it should show something like the screenshot, check the sibling teavision-theme how it is handled, the items list and its order should be maintained"
  severity: major
  test: 3
  artifacts: []
  missing: []
