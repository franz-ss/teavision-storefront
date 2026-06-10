---
status: complete
phase: 11-full-visual-redesign
source: [11-01-SUMMARY.md, 11-02-SUMMARY.md, 11-03-SUMMARY.md, 11-04-SUMMARY.md, 11-05-SUMMARY.md, 11-06-SUMMARY.md, 11-07-SUMMARY.md, 11-08-SUMMARY.md, 11-09-SUMMARY.md, 11-10-SUMMARY.md, 11-11-SUMMARY.md, 11-12-SUMMARY.md, 11-13-SUMMARY.md, 11-14-SUMMARY.md, 11-VERIFICATION.md]
started: 2026-06-10T09:48:20Z
updated: 2026-06-10T11:20:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running dev server. Start fresh with `pnpm dev`. Server boots without errors and the homepage at localhost:3000 loads live Shopify product data (no stub/fallback content, no console errors).
result: pass

### 2. Brand Foundation — Fonts & Palette
expected: Site-wide — headings render in Spectral serif, body in Hanken Grotesk, micro-labels (eyebrows, badges, meta) in Space Mono uppercase. Palette is warm paper/botanical green with gold accents — no cool grays, no leftover old styling. Network tab shows zero requests to fonts.googleapis.com (fonts are self-hosted).
result: pass

### 3. Header Chrome — Bars & Mega Menus
expected: Ink-dark utility bar on top ("EST. MELBOURNE 2014 · ACO + USDA CERTIFIED ORGANIC…" left; "Apply for wholesale" + phone right). Below it a sticky translucent main bar (blurs content scrolling under it) with logo, pill-shaped nav triggers, search icon, cart icon with gold count badge, and green wholesale button. Shop and Services open full-width mega panels under the header with a dimmed page scrim behind; all panel links navigate correctly.
result: issue
reported: "looks broken in mobile view — utility bar items wrap into 3 cramped lines (EST. MELBOURNE 2014 / ACO + USDA CERTIFIED ORGANIC / FREIGHT-INSURED, WORLDWIDE / Apply for wholesale / 1300 729 617 all wrapping) at small viewport widths"
severity: major

### 4. Search Overlay
expected: Clicking the header search icon opens a full-width overlay at the top with a large serif input (auto-focused), a "Popular" label, and suggestion pills. Typing shows Searchanise autocomplete suggestions. Escape closes the overlay. Submitting navigates to /search results.
result: issue
reported: "search text input too big, also focus border not good, i dont like the overall design, maybe we should preview the design first before writing code"
severity: minor

### 5. Mobile Menu
expected: At ~375px width, the burger icon opens a fullscreen paper menu with large serif accordion rows (Shop, Services) that expand to show links, plus "Apply for Wholesale" and phone buttons at the bottom. Menu closes on navigation.
result: issue
reported: "scroll is visible even theres no elements to scroll, also I was confused with the arrow I thought there were some submenus under it but I was a link, also I dont like the horizontal scrolls, the alignment of menu items, also it shouldnt look like a button., also theres no way to exit mobile menu there is no close button, need to click a link to close mobile menu, I dont like the button hover y pos effect"
severity: major

### 6. Homepage — Upper Sections
expected: Full-bleed hero image with dark green gradient scrim, gold eyebrow, large serif headline with an italic accent line, and two CTAs. Then: green stat band (4 stats, gold icons), product range tiles (gold tag, serif title, hover reveals "Shop now"), 3 private-label service cards with numbering, organic herbs split section with checklist, and a certification marquee that scrolls continuously and pauses on hover.
result: issue
reported: "Hero h1 must be the original 'Australia's #1 tea company' + original lede copy; certification marquee not visible; stat band: Australian flag missing, icons too small, overall design did not match the html design at all; button design doesn't match the html design; private-label cards look/animation don't match html design, title should be 'Private Label & Custom Tea Solutions' + supplied paragraph; product range heading should be 'Explore Our Product Range' + supplied paragraph (not 'Wholesale online, direct to business or doorstep.'); redundant gold 'shop now' text; hover 'shop now ->' typography doesn't match design"
severity: major

### 7. Homepage — Lower Sections
expected: Testimonials with gold quote mark and mono attribution; ink motif band with brush-circle and stamp artwork (stamp shows the correct band label, no baked-in "Subscribe Teavision" text); Tea Journal 3-card grid; green newsletter card with pill input (submitting shows confirmation message); contact/help section with working form (validation + success state); FAQ rows that expand/collapse.
result: issue
reported: "testimonials should respect the original copy (title 'Teavision Testimonials' + supplied paragraph); looks broken, long testimonials aren't handled well, gold quote mark doesn't match the design, overall look is bad; green newsletter is awful, didn't follow the design; newsletter subscribe shows 'Unable to send your signup right now. Please try again shortly.'; contact form looks nice except button design (known global issue); FAQ must follow original copy ('Frequently asked questions' + supplied paragraph + original accordion contents)"
severity: major

### 8. Footer
expected: Ink-dark footer with gold mono column headings, brand blurb with quality pills (HACCP, ACO, USDA, Ethically Sourced), link columns (account login link works), stacked pill newsletter input + full-width button (submitting shows feedback), and a bottom row with mono copyright text and bordered payment text chips (VISA, MASTERCARD, etc.).
result: issue
reported: "footer should respect the original texts and links; the styling should follow the design, the spacing is different.. not bad awful but needs to be improved, please follow the design please. (Design source: claude.ai/design p/a0429833-c6d3-4dbf-97b9-ea804429e93f, extracted as design/extracted-design.html)"
severity: minor

### 9. Collection Page (PLP)
expected: Collection page (e.g. /collections/green-tea) shows a deep-green hero with breadcrumb, gold "Wholesale collection" eyebrow, large serif title, and faint background image. Left sidebar: filters with mono headings + a wholesale upsell card; sidebar sticks on scroll. Product grid (2-col mobile, 3-col desktop) uses new vertical cards: serif title, mono type eyebrow, organic/award badge pills, hover quick-add for single-variant products, "View options" link for multi-variant. Sort dropdown and filter chips work.
result: issue
reported: "grid looks good just need to improve spacing; double check the product card design — there are elements missing like the star rating, etc.; the hero needs rework, it did not respect the original logic, where there should be hero image that looks like in screenshot (collection-specific banner like 'Tea Masters Selection' with 'Read More About…' disclosure) and regular hero design"
severity: major

### 10. Collections Index
expected: /collections shows a green header band with eyebrow + serif title, featured collection image tiles with bottom scrim/gold tag/serif name and hover "Shop now", plus a directory list with hairline dividers.
result: issue
reported: "remove the Directory All collections section completely, just need the card grid; first card should be All and link to /collections/all; grid items should match order in production (https://www.teavision.com.au/collections); also the contact section is missing ('Need help? Speak with our Ingredients Experts Today.' form) — reuse the existing reusable contact section component, or create one if none exists"
severity: major

### 11. Search Results Page
expected: /search?q=tea shows eyebrow + serif query heading + mono result count. Facet filter panel, pill sort control, removable active-filter chips, and pill pagination with the active page in solid green. Result cards match the PLP card design. Empty/no-results query shows a leaf icon state.
result: issue
reported: "for empty, just show the hero and No matches card"
severity: minor

### 12. Product Detail Page
expected: PDP shows mono breadcrumb, sticky image gallery with clickable thumbnails, serif product title, rating stars (gold), price, variant tiles (selected = green tint), quantity stepper + add-to-cart (success feedback appears AND header cart badge count increases without reload), assurance row, bulk-savings tier grid, and spec disclosure rows. Recommendation rails at bottom; quick view opens a dialog with working variant selection and add-to-cart.
result: issue
reported: "I think this looks good, just need to double check the spacings and element alignments, check the design (claude.ai/design p/a0429833…)"
severity: minor

### 13. Cart Page
expected: /cart shows line items as hairline-divided rows: 76px rounded thumbnail, serif product name, mono variant meta, pill quantity stepper, line total. Changing quantity updates totals AND the header badge without reload; remove deletes the line. Summary card shows serif subtotal, freight note, and full-width green checkout button. Empty cart shows leaf icon + "Browse teas" button.
result: issue
reported: "container max width mismatch; also for modifying quantity, cant you do optimistic approach so it doesnt load everytime I increase/decrease value; price and qty not aligned with th (table headers) — this was okay before; also make sure the discount slashed prices appear, this already worked on before"
severity: major

### 14. Blog — Tea Journal
expected: Blog listing shows green hero with gold "Tea Journal" eyebrow and serif title, tag filter pills (active = solid green), article cards on a sunken band, and pill pagination. Article page shows mono breadcrumb, large serif title, meta row, styled body (gold left-border italic blockquotes, green links, clean tables), tag pills, and previous/next article navigation.
result: issue
reported: "missing these two sections (newsletter band 'Explore the World of Tea with Monthly Newsletters' with teapot motif, and contact section 'Need help? Speak with our Ingredients Experts Today.') — they exist already, just need to reuse them here; also spacing too big (large empty gaps between sections); make the images loading optimized"
severity: major

### 15. Supporting Pages
expected: /pages/wholesale (brand hero, stats, supply paths, application form that validates and submits), /pages/contact (hero + enquiry form), /pages/our-story, /pages/certifications, /pages/custom-tea-blends, and a generic Shopify page (e.g. /pages/terms-conditions) all render on the new design system — brand hero bands, gold eyebrows, warm card surfaces. No old-styling remnants.
result: issue
reported: "this should be /pages/bulk-wholesale-supply — supplied the full production HTML for the page; strip the styling/classes/scripts, copy the texts and layout, and implement with the design system"
severity: major

### 16. Error Pages
expected: Navigating to a non-existent URL (e.g. /products/does-not-exist or /nope) shows the redesigned 404 — large green serif "404", serif heading, soft copy, and brand/secondary action buttons.
result: issue
reported: "improve this page, be creative but dont overdesign"
severity: minor

### 17. Desktop & Mobile Visual Parity vs Design
expected: Header, footer, homepage, PLP/search, PDP, cart, blog, and supporting pages visually match design/extracted-design.html at representative desktop and ~375px mobile widths. No horizontal overflow on any page at mobile width.
result: issue
reported: "I cant hover to the megamenu, it disappears while cursor is about to enter it, probably because of the gap; now that you have the claude design link, audit these pages, see that they match the design, spawn subagents to verify and keep iterating until it is perfectly matched"
severity: major

### 18. Clean Fake-Shopify E2E Run
expected: pnpm test:e2e passes the cart-to-checkout handoff test using the fake Shopify server only.
result: pass
note: "Run by Claude 2026-06-10 — 1 passed (13.8s); had to stop the local dev server (port 3000) for Playwright's managed server"

### 19. Storybook Warning Review
expected: pnpm test:stories passes (287 tests) and the Next Image LCP/eager-loading warnings it emits are reviewed and deemed acceptable.
result: pass
note: "Run by Claude 2026-06-10 — 82 files / 287 tests passed. LCP warnings are Storybook-context artifacts (isolated viewport makes every image above-fold); the real-site takeaway (priority-load hero/motif images) is folded into the test-14 image-optimization gap"

## Summary

total: 19
passed: 4
issues: 15
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Header utility bar renders cleanly at all viewport widths — single-line ticker on desktop, hidden or gracefully condensed at narrow widths"
  status: failed
  reason: "User reported: looks broken in mobile view — utility bar items wrap into 3 cramped lines at small viewport widths (~640-700px); ticker text, wholesale link, and phone number all wrap and collide"
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Search overlay input is comfortably sized with a clean focus treatment and an overall design the owner approves"
  status: failed
  reason: "User reported: search text input too big, also focus border not good, i dont like the overall design, maybe we should preview the design first before writing code"
  severity: minor
  test: 4
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: "Design-direction issue — fix plan should include a previewable mockup of the search overlay (e.g. /gsd-sketch) for approval before re-implementation"

- truth: "Mobile menu is easy to exit, category navigation is unambiguous, and expanded panels render cleanly without spurious scrollbars"
  status: failed
  reason: "User reported: scroll is visible even theres no elements to scroll; arrow on 'View all X' link looked like a submenu indicator but was a link; dislikes horizontal scrolls; menu item alignment off; category chips shouldn't look like buttons; no close button — only way to exit mobile menu is clicking a link; dislikes button hover translate-y lift effect"
  severity: major
  test: 5
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: "Sub-issues: (1) horizontal scrollbar always visible on mobile shop panel category chips even when content fits; (2) chip row uses horizontal scroll pattern user dislikes; (3) 'View all' arrow affordance ambiguous; (4) menu item alignment inconsistent; (5) chips styled like buttons; (6) missing close (X) button on fullscreen mobile menu; (7) global Button hover -translate-y lift effect disliked"

- truth: "Homepage upper sections match design/extracted-design.html and use the original site copy"
  status: failed
  reason: "User reported: hero h1 wrong (must be 'Australia's #1 tea company' with original lede); certification marquee not visible on the page; stat band missing Australian flag, icons too small, design doesn't match HTML design at all; button design doesn't match HTML design; private-label cards look/animation mismatch with wrong copy; product range section heading/copy wrong; redundant gold 'shop now' text; hover 'Shop now ->' typography mismatch"
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: >
    Required copy fixes —
    Hero h1: "Australia's #1 tea company"; hero p: "Discover a world of tea mastery in every cup. Handpicked from the finest leaves, our loose leaf teas, bulk tea bags, and organic herbs deliver rich flavor and freshness. Trusted by Australia's leading cafes, retailers, and wellness brands."
    Private-label title: "Private Label & Custom Tea Solutions"; p: "We partner with you to develop custom blends, manufacture tea bags, and deliver fully packaged private label tea products."
    Product range title: "Explore Our Product Range" (replaces "Wholesale online, direct to business or doorstep."); p: "We offer Wholesale products online direct to consumers and businesses or you can apply for a bulk wholesale account and receive further discounts on 100kg+ orders."
    Visual fixes — certification marquee missing/not rendering; stat band redesign to match extracted-design.html (Australian flag motif, larger icons); Button styling to match HTML design; private-label card look + hover animation per HTML design; remove redundant gold 'shop now' text on range tiles; fix 'Shop now ->' hover typography.

- truth: "Homepage lower sections (testimonials, newsletter, FAQ) match design/extracted-design.html, use original site copy, and newsletter signup succeeds"
  status: failed
  reason: "User reported: testimonials look broken with long quotes, gold quote mark and overall look don't match the design, copy wrong; green newsletter section didn't follow the design; newsletter subscribe errors with 'Unable to send your signup right now. Please try again shortly.'; FAQ copy must be original"
  severity: major
  test: 7
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: >
    Functional bug — homepage newsletter signup returns the failure state on submit; needs root-cause diagnosis (Server Action / provider config / rate limit).
    Required copy — Testimonials title: "Teavision Testimonials"; p: "We're proud to be the trusted tea supplier for Australia's biggest and most loved brands. Our clients value our ability to source fresh, organic ingredients and provide flexible solutions for bulk tea bags, loose tea in bulk, and custom blends."
    FAQ title: "Frequently asked questions"; p: "You may have questions about sourcing wholesale tea, tea bags, and bulk spices. Below are answers to some of the most common queries from our partners." plus the original accordion contents.
    Visual — long testimonial quotes must be handled gracefully (clamp/scale); quote mark + section layout per extracted-design.html; newsletter band restyled per extracted-design.html. Styling should be copied from the design HTML, not approximated.
    Contact form passes except the global Button design issue (tracked under test 6 gap).

- truth: "Footer uses original site texts and links with styling/spacing matching design/extracted-design.html"
  status: failed
  reason: "User reported: footer should respect the original texts and links; styling should follow the design, spacing is different — not awful but needs improvement"
  severity: minor
  test: 8
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: "Fix = audit footer copy/links against the original site content and re-derive spacing/typography directly from the .ft section of design/extracted-design.html (source: claude.ai/design p/a0429833-c6d3-4dbf-97b9-ea804429e93f)"

- truth: "Collection page hero preserves the original site's collection-banner logic, and product cards match the design with all elements present"
  status: failed
  reason: "User reported: PLP hero did not respect the original logic — collections with a custom banner image (e.g. Tea Masters Selection) should show that banner plus the regular hero design; product card is missing elements vs the design (e.g. star rating); grid spacing needs improvement"
  severity: major
  test: 9
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: >
    Hero rework — original site shows a collection-specific hero banner image (full art banner like 'Tea Masters Selection') with a 'Read More About {collection}' disclosure below it, alongside/instead of the generic green band; new design must preserve that conditional logic (banner when collection has hero image, regular hero design otherwise). Check the Liquid theme at ../teavision-theme for the original logic.
    Product card — compare against the .pcard spec in design/extracted-design.html; star rating missing, audit for other missing elements.
    Grid — tune gap spacing per design.

- truth: "Collections index shows only the card grid (with All first) matching production order, plus the contact section"
  status: failed
  reason: "User reported: remove the Directory/All-collections list section completely; first grid card should be 'All' linking to /collections/all; grid items must match production order and items at https://www.teavision.com.au/collections; contact section ('Need help? Speak with our Ingredients Experts Today.' form) is missing from the page"
  severity: major
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: "Contact section: reuse the existing contact/help section component (homepage has one — src/components/homepage/contact/) if reusable; if it's homepage-bound, extract a reusable contact section component and mount on /collections."

- truth: "Search empty/no-results state shows only the hero and a 'No matches' card"
  status: failed
  reason: "User reported: for empty, just show the hero and No matches card (currently the empty state renders additional chrome — filters/sort/toolbar)"
  severity: minor
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "PDP spacing and element alignment match the PDP section of design/extracted-design.html"
  status: failed
  reason: "User reported: looks good overall, but spacings and element alignments need a double-check against the design (claude.ai/design p/a0429833…)"
  severity: minor
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: "Polish pass — diff PDP spacing/alignment values against the design HTML rather than re-implementing"

- truth: "Cart page aligns columns to headers, shows discount slashed prices, updates quantity optimistically, and uses a consistent container width"
  status: failed
  reason: "User reported: container max-width mismatch on cart page; quantity changes trigger a visible loading cycle each click — wants optimistic updates; price and qty columns not aligned with the table headers (regression — was okay before); discount slashed (compare-at) prices missing (regression — already worked before)"
  severity: major
  test: 13
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: >
    Two regressions from the 11-11 restyle: (1) th/column alignment broke when layout changed from grid to flex rows while headers remained table-style; (2) compare-at slashed prices no longer render (BULK-07 context preserved unit price but slashed display lost).
    Optimistic quantity: use React 19 useOptimistic/useTransition around the existing Server Action so stepper updates instantly without a loading cycle (cookie-backed cart stays the source of truth).
    Container: cart container width differs from adjacent sections (recommendations/footer) — align to the design's container token.

- truth: "Blog listing includes the newsletter band and contact sections (reused components), with tight section spacing and optimized image loading"
  status: failed
  reason: "User reported: two sections missing from blog listing — the newsletter band ('Explore the World of Tea with Monthly Newsletters' with teapot motif/stamp) and the contact section ('Need help? Speak with our Ingredients Experts Today.'); both already exist as components, reuse them. Spacing between sections too big (large empty gaps). Images need optimized loading"
  severity: major
  test: 14
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: >
    Reuse homepage newsletter + contact section components on the blog listing (replacing/augmenting the small 'Tea Journal in your inbox' card per the original page structure).
    Spacing — large vertical gaps visible between article grid, tag-filter band, pagination, and newsletter card; tighten to design rhythm.
    Images — article card images should use next/image lazy loading with proper sizes attributes.

- truth: "/pages/bulk-wholesale-supply exists with the production page's content and layout, implemented on the Phase 11 design system"
  status: failed
  reason: "User reported: the wholesale supporting page should be /pages/bulk-wholesale-supply; supplied full production HTML — strip styling/classes/scripts, copy texts and layout, implement with the design system"
  severity: major
  test: 15
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: "Full stripped content spec (10 sections: account banner, hero split, 2 feature grids, freight media-text, numbered accordion, 5-step process, FAQ, CTA banner, need-help contact) saved at .planning/phases/11-full-visual-redesign/bulk-wholesale-supply-content.md — build from that file using Section/Eyebrow/Button/Accordion primitives"

- truth: "404 page is creative and on-brand without being overdesigned"
  status: failed
  reason: "User reported: improve this page, be creative but dont overdesign"
  severity: minor
  test: 16
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: "Design-direction item — propose a tasteful on-brand 404 (e.g. tea motif/illustration from existing brand assets, helpful links to collections/search) and preview before implementing per the new preview-first workflow"

- truth: "Mega menu stays open while moving the cursor from the trigger into the panel, and all surfaces match design/extracted-design.html per subagent parity audit"
  status: failed
  reason: "User reported: can't hover to the megamenu — it disappears while the cursor is about to enter it, probably because of the gap between the trigger and the fixed panel (top-28.5). Also directed: audit all pages against the Claude design (design/extracted-design.html) with subagents and iterate until perfectly matched"
  severity: major
  test: 17
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
  note: "Hover bug — panels moved to fixed top-28.5 in 11-04, leaving a pointer dead zone between nav trigger and panel; mouseleave closes the panel before the cursor reaches it. Fix via hover-intent bridge (padding/pseudo-element covering the gap) or open-state tolerance. Parity audit — diagnosis phase should spawn per-surface subagents comparing implementation to design/extracted-design.html and feed deltas into fix plans."
