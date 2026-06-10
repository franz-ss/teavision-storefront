---
status: diagnosed
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
  root_cause: "Utility bar becomes visible at sm (640px) but its content needs ~1024px to fit on one line (ticker ~619px + right cluster ~307px + gutters); no whitespace-nowrap/overflow guard and no responsive trimming, so spans wrap inside the fixed h-9.5 (38px) bar and collide. The design mockup is desktop-only and never specified a tablet state."
  artifacts:
    - path: "src/components/layout/header/header.tsx"
      issue: "utility bar visible from 640px with content needing ~1024px; fixed h-9.5 with no nowrap/overflow guard (lines 31-58)"
  missing:
    - "Either show the bar only from lg (1024px) where it fits — most design-faithful — or add a responsive trim ladder (hide FREIGHT-INSURED below lg, hide ACO+USDA / phone below md) plus whitespace-nowrap + overflow-hidden as a hard guard"
  debug_session: ".planning/debug/utility-bar-mobile-wrap.md"

- truth: "Search overlay input is comfortably sized with a clean focus treatment and an overall design the owner approves"
  status: failed
  reason: "User reported: search text input too big, also focus border not good, i dont like the overall design, maybe we should preview the design first before writing code"
  severity: minor
  test: 4
  root_cause: "Design-direction rejection, not a code defect: the overlay's clamp(1.4rem,3vw,2.2rem) serif input reads as oversized, and the border-b-2 border-ink focus rule was an invention — the search overlay has no counterpart in design/extracted-design.html, so it was designed ad hoc without owner preview."
  artifacts:
    - path: "src/components/layout/header/search-overlay.tsx"
      issue: "overall overlay design rejected by owner (input size, focus treatment, layout)"
    - path: "src/components/layout/header/search-form.tsx"
      issue: "inputClassName carries the oversized serif/borderless treatment"
  missing:
    - "Produce 1-2 previewable mockups of a calmer search overlay (smaller input, soft focus ring consistent with .field treatment) and get owner approval BEFORE re-implementing (preview-first workflow)"
  debug_session: ""
  note: "Design-direction issue — fix plan should include a previewable mockup of the search overlay (e.g. /gsd-sketch) for approval before re-implementation"

- truth: "Mobile menu is easy to exit, category navigation is unambiguous, and expanded panels render cleanly without spurious scrollbars"
  status: failed
  reason: "User reported: scroll is visible even theres no elements to scroll; arrow on 'View all X' link looked like a submenu indicator but was a link; dislikes horizontal scrolls; menu item alignment off; category chips shouldn't look like buttons; no close button — only way to exit mobile menu is clicking a link; dislikes button hover translate-y lift effect"
  severity: major
  test: 5
  root_cause: "(1) Close button: burger DOES toggle to an X but the fullscreen overlay (fixed inset-0 z-55) paints over it — the menu is nested inside the sticky z-60 header's stacking context where the main-bar div has z-auto. (2) Scrollbar: mobile-shop-panel uses overflow-x-auto + min-w-max with zero scrollbar styling — native Windows scrollbar always shows. (3) Chips are ToggleButton menuRow variant (bordered/filled = button-like by construction). (4) ChevronRight is overloaded: used both as drill-in indicator and on the 'View all' link. (5) Four different left text-edges (px-0/px-2.5/px-3/px-3.5); design used negative-margin compensation. (6) Hover lift is hard-coded in button.tsx cva lines 21/23/27 — contract test does NOT assert it (only UI-SPEC docs do)."
  artifacts:
    - path: "src/components/layout/header/header.tsx"
      issue: "menu nested in z-60 sticky header; main bar z-auto under the z-55 overlay"
    - path: "src/components/layout/header/mobile-mega-nav.tsx"
      issue: "fixed inset-0 z-55 covers header; no in-menu close button; ChevronRight overload"
    - path: "src/components/layout/header/mobile-shop-panel.tsx"
      issue: "overflow-x-auto + min-w-max chip row; mixed px alignment; ChevronRight on View-all"
    - path: "src/components/ui/toggle-button/toggle-button.tsx"
      issue: "menuRow variant is button-like"
    - path: "src/components/ui/button/button.tsx"
      issue: "hover:-translate-y-0.5 hover:shadow-2 on brand/primary/inverse (lines 21/23/27)"
  missing:
    - "Offset overlay below header (top-19) or raise main-bar z-index so the X stays visible; or add explicit close button in menu"
    - "Let chips wrap (flex-wrap, drop min-w-max) at mobile"
    - "Restyle category selector toward text-tab treatment (no border/fill)"
    - "Replace View-all ChevronRight with underlined text link or ArrowRight"
    - "Normalize left text-edges via negative-margin compensation per design"
    - "Remove hover lift from button.tsx; update 11-UI-SPEC.md line 183 in lockstep (no contract test change needed)"
  debug_session: ".planning/debug/mobile-menu-ux.md"
  note: "Sub-issues: (1) horizontal scrollbar always visible on mobile shop panel category chips even when content fits; (2) chip row uses horizontal scroll pattern user dislikes; (3) 'View all' arrow affordance ambiguous; (4) menu item alignment inconsistent; (5) chips styled like buttons; (6) missing close (X) button on fullscreen mobile menu; (7) global Button hover -translate-y lift effect disliked"

- truth: "Homepage upper sections match design/extracted-design.html and use the original site copy"
  status: failed
  reason: "User reported: hero h1 wrong (must be 'Australia's #1 tea company' with original lede); certification marquee not visible on the page; stat band missing Australian flag, icons too small, design doesn't match HTML design at all; button design doesn't match HTML design; private-label cards look/animation mismatch with wrong copy; product range section heading/copy wrong; redundant gold 'shop now' text; hover 'Shop now ->' typography mismatch"
  severity: major
  test: 6
  root_cause: "(1) Hero copy is hardcoded in hero.tsx while the correct approved copy already sits unused in content.ts:104-106. (2) Marquee invisible because CertificationCoverage is never mounted on the homepage (page.tsx neither imports nor renders it); its track also lacks w-max so the -50% loop wouldn't be seamless. (3) ProofPoints never implemented the image branch — the Australian flag asset exists (/images/australian-flag.svg) and is defined in content but the component only renders point.icon; icons 24px vs design 40px; centered vs design left-aligned 44px/30px with dividers. (4) Buttons approximated: ~9-11px too short, 150ms transitions vs design 250-350ms cubic-bezier, neutral shadows vs green-tinted, bg-ink/90 lightening hover vs darken-to-#000, no svg arrow. (5) Private-label cards missing body copy + 350ms hover; section copy wrong. (6) Range tiles: static gold 'Shop Now' misuses the design's category-tag slot; hover CTA serif vs design mono 11px uppercase + translateY reveal."
  artifacts:
    - path: "src/app/(storefront)/page.tsx"
      issue: "CertificationCoverage not mounted (belongs between OrganicHerbs and Testimonials)"
    - path: "src/components/homepage/hero/hero.tsx"
      issue: "hardcoded h1/copy; should consume HOMEPAGE_HERO.title/.copy"
    - path: "src/components/homepage/proof-points/proof-points.tsx"
      issue: "image branch unimplemented (flag dropped); icon size/alignment/padding mismatch"
    - path: "src/components/ui/button/button.tsx"
      issue: "height/transition/shadow/hover deltas vs design .btn"
    - path: "src/components/homepage/private-label/private-label.tsx"
      issue: "missing card body copy, hover duration, wrong section copy"
    - path: "src/components/homepage/product-range/product-range.tsx"
      issue: "wrong section heading/copy"
    - path: "src/components/homepage/overlay-image-card/overlay-image-card.tsx"
      issue: "redundant static gold 'Shop Now'; hover CTA typography mismatch"
    - path: "src/components/homepage/certification-coverage/certification-coverage.tsx"
      issue: "track lacks w-max; item type/gap deltas"
    - path: "src/components/homepage/content.ts"
      issue: "needs approved private-label/product-range copy; hero copy already correct here"
  missing:
    - "Mount CertificationCoverage on homepage + add w-max to marquee track"
    - "Wire approved copy: hero (from content.ts), 'Private Label & Custom Tea Solutions' + paragraph, 'Explore Our Product Range' + paragraph"
    - "Implement ProofPoints image branch (flag), 40px gold icons, left-aligned 44px/30px layout with dividers"
    - "Transcribe design .btn metrics (padding, 250ms cubic-bezier, tinted shadow, darken hover, arrow affordance)"
    - "Range tiles: remove static gold action, mono uppercase hover CTA with translateY reveal"
  debug_session: ".planning/debug/homepage-upper-parity.md"
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
  root_cause: "(1) NEWSLETTER FAILURE: RESEND_API_KEY is missing from .env.local — sendNewsletterSignupAction (src/lib/contact/actions.ts:310-313) gates on getResendApiKey() and returns the exact UAT error string when absent; deterministic failure before any network call. Footer newsletter, contact, and custom-blend forms share the same gate and fail identically. Environment issue, not a code regression. (2) TESTIMONIALS: design uses condensed 25-40-word editorial pull-quotes (design data layer ships them) while content.ts feeds full 100-230-word raw testimonials into the large serif scale — wall of text; quote mark is a 4rem text glyph vs the design's 50x50 gold stroke SVG at opacity .5; header centered with wrong copy vs design's split range__head; St. Ali entry has name/role swapped. (3) NEWSLETTER VISUAL: design's .news card has an absolutely-positioned decorative image (right:-6%, top:-20%, w:46%, h:140%, opacity:.5) — omitted entirely, leaving a flat green box; padding undersized; no arrow on button. (4) FAQ: title is 'Frequently asked.' vs required 'Frequently asked questions'; container 1280px vs design 880px; accordion Q/As already match the original theme verbatim."
  artifacts:
    - path: ".env.local"
      issue: "missing RESEND_API_KEY (newsletter/contact sends fail deterministically)"
    - path: "src/lib/contact/actions.ts"
      issue: "missing-key branch indistinguishable from provider failure (lines 310-313) — add a server-side warn"
    - path: "src/components/homepage/content.ts"
      issue: "full-length testimonial quotes (need condensed pull-quotes, verbatim in audit); St. Ali name/role swapped"
    - path: "src/components/homepage/testimonials/testimonials.tsx"
      issue: "text glyph quote mark vs SVG icon; centered header vs split layout; wrong copy; tone"
    - path: "src/components/homepage/newsletter/newsletter.tsx"
      issue: "missing decorative background image layer; padding clamp wrong"
    - path: "src/components/homepage/newsletter/newsletter-form.tsx"
      issue: "placeholder, gap, missing arrow icon on Subscribe"
    - path: "src/components/homepage/faq/faq.tsx"
      issue: "title 'Frequently asked.' wrong; container 1280px vs 880px"
  missing:
    - "RESEND_API_KEY provisioned in .env.local by owner 2026-06-10 (verified non-empty) — remaining code task: add console.warn in missing-key branch; re-verify signup succeeds during fix execution"
    - "Swap in condensed pull-quotes + SVG quote icon + split header with 'Teavision Testimonials' copy"
    - "Add newsletter decorative image layer with design's exact offsets/opacity; padding clamp(40px,6vw,72px); arrow on button"
    - "FAQ title fix + 880px container"
  debug_session: ".planning/debug/newsletter-signup-failure.md, .planning/debug/homepage-lower-parity.md"
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
  root_cause: "Spacing: footer uses global py-section (clamp 64-130px) vs design's footer-local clamp(50-90px); FooterTextLink forces min-h-11 (44px) rows + gap-3 vs design's ~20px rows with 11px gaps (~2x column height); no 2-col tablet grid step (design drops to 2 cols at <=980px). Content: Quality column and newsletter blurb use mockup-invented copy instead of the original site strings; copyright row embellished and fully linkified; the original ~98-link Popular Searches SEO block (footer.liquid:76-188) was replaced by a bare /search link. Grid template, heading typography, link inventories, and payment methods all verified matching."
  artifacts:
    - path: "src/components/layout/footer/view/view.tsx"
      issue: "py-section too tall; no md 2-col step; copyright embellished/linkified"
    - path: "src/components/layout/footer/link/link-item.tsx"
      issue: "min-h-11 + text-[0.95rem] inflate rows ~2x vs design"
    - path: "src/components/layout/footer/quality-column/quality-column.tsx"
      issue: "mockup copy instead of original HACCP text; pills are mockup-invented (owner decision)"
    - path: "src/components/layout/footer/newsletter-column/newsletter-column.tsx"
      issue: "mockup blurb; contact links oversized vs design mono 12px"
    - path: "src/components/layout/footer/payment-mark/payment-mark.tsx"
      issue: "tracking/gap/color nits"
    - path: "src/components/layout/footer/data.ts"
      issue: "Popular Searches link inventory missing (source: teavision-theme/sections/footer.liquid:76-188)"
  missing:
    - "Footer-local padding clamp(50px,7vw,90px); compact link rows; tablet 2-col step"
    - "Restore original copy: HACCP quality text, newsletter blurb 'Sign up for exclusive offers, market trends and new product alerts.', plain copyright"
    - "Reinstate Popular Searches collapsible link block from the original theme"
  debug_session: ".planning/debug/footer-parity.md"
  note: "Fix = audit footer copy/links against the original site content and re-derive spacing/typography directly from the .ft section of design/extracted-design.html (source: claude.ai/design p/a0429833-c6d3-4dbf-97b9-ea804429e93f)"

- truth: "Collection page hero preserves the original site's collection-banner logic, and product cards match the design with all elements present"
  status: failed
  reason: "User reported: PLP hero did not respect the original logic — collections with a custom banner image (e.g. Tea Masters Selection) should show that banner plus the regular hero design; product card is missing elements vs the design (e.g. star rating); grid spacing needs improvement"
  severity: major
  test: 9
  root_cause: "(1) HERO: original theme renders collection.description HTML full-width — the banner artwork is an <img> INSIDE descriptionHtml shown at 100% opacity, with a merchant-embedded 'Read More About {collection}' toggle. The redesign applies the green 35%-opacity band to ALL collections and special-cases two banner collections via hardcoded HERO_IMAGE_OVERRIDES/HIDDEN_HERO_INTRO_HANDLES that demote the banner to a washed background and hide the title. getDescriptionHeroImage() already detects embedded banners — the signal exists but isn't branched on. StoryDisclosure still renders but inside the green band instead of below the banner. (2) CARD: rating data already flows end-to-end (collection.graphql metafields -> CollectionProductSummary.rating/reviewCount) and StarRating exists with a drop-in precedent in recommendation-product-card — just never wired into ProductCard. (3) GRID: desktop gaps already match the design exactly; only the <=620px tightening to 16px/12px is unimplemented."
  artifacts:
    - path: "src/app/(storefront)/collections/[handle]/_components/hero.tsx"
      issue: "no banner-art branch; renders all collections as 35% background band"
    - path: "src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts"
      issue: "hardcoded HERO_IMAGE_OVERRIDES/HIDDEN_HERO_INTRO_HANDLES instead of general banner-mode signal (lines 53-75)"
    - path: "src/app/(storefront)/collections/[handle]/_components/page-content.tsx"
      issue: "StoryDisclosure placed inside green band, not below banner"
    - path: "src/components/collection/product-card/product-card.tsx"
      issue: "StarRating not rendered despite available rating/reviewCount data"
    - path: "src/app/(storefront)/collections/[handle]/_components/product-list.tsx"
      issue: "missing mobile gap tightening (gap 16px/12px <=620px)"
  missing:
    - "Branch hero on getDescriptionHeroImage() !== null: banner collections get full-opacity art banner + visible title + read-more disclosure below; others keep the green band; delete hardcoded handle hacks"
    - "Render <StarRating rating count size=sm> between title and price when rating defined"
    - "Mobile grid gap tightening; triage remaining .pcard deltas (origin segment, unit, grade, fav) with owner"
  debug_session: ".planning/debug/plp-parity.md"
  note: >
    Hero rework — original site shows a collection-specific hero banner image (full art banner like 'Tea Masters Selection') with a 'Read More About {collection}' disclosure below it, alongside/instead of the generic green band; new design must preserve that conditional logic (banner when collection has hero image, regular hero design otherwise). Check the Liquid theme at ../teavision-theme for the original logic.
    Product card — compare against the .pcard spec in design/extracted-design.html; star rating missing, audit for other missing elements.
    Grid — tune gap spacing per design.

- truth: "Collections index shows only the card grid (with All first) matching production order, plus the contact section"
  status: failed
  reason: "User reported: remove the Directory/All-collections list section completely; first grid card should be 'All' linking to /collections/all; grid items must match production order and items at https://www.teavision.com.au/collections; contact section ('Need help? Speak with our Ingredients Experts Today.' form) is missing from the page"
  severity: major
  test: 10
  root_cause: "collections/page.tsx implements '8 featured menu tiles + text directory' instead of production's single full card grid + contact section. The grid is sourced from the nav menu capped at 8, and isPublicCollection() explicitly excludes the 'all' handle. Production renders ~119 published collections in alphabetical title order with 'All' first — exactly what the existing getCollectionSummaries() + sortByTitle reproduce (no hardcoded list needed; exclude only 'frontpage'). /collections/all resolves already (real 'all' collection exists; [handle] route handles it). The contact section exists as homepage-domain Contact (reusable; only prop is action) but per conventions should move to src/components/contact/."
  artifacts:
    - path: "src/app/(storefront)/collections/page.tsx"
      issue: "directory section (lines 262-300) to remove; menu-driven 8-card grid; 'all' excluded; no contact section; JSON-LD tied to old list"
    - path: "src/components/homepage/contact/"
      issue: "reusable contact section lives in homepage domain; move to src/components/contact/ with its form leaf"
  missing:
    - "Single grid from getCollectionSummaries() filtered on 'frontpage' only, sorted by title ('All' lands first, links to /collections/all); delete featured/menu helpers; rebuild JSON-LD"
    - "Move Contact + HomepageContactForm to src/components/contact/, update barrels/stories/homepage import; mount <Contact action={submitContactFormAction}> as final section"
  debug_session: ".planning/debug/collections-index.md"
  note: "Contact section: reuse the existing contact/help section component (homepage has one — src/components/homepage/contact/) if reusable; if it's homepage-bound, extract a reusable contact section component and mount on /collections."

- truth: "Search empty/no-results state shows only the hero and a 'No matches' card"
  status: failed
  reason: "User reported: for empty, just show the hero and No matches card (currently the empty state renders additional chrome — filters/sort/toolbar)"
  severity: minor
  test: 11
  root_cause: "Structural simplification request: the search empty/no-results state currently renders the full results chrome (toolbar/filters/sort) around the empty-state card; owner wants hero + 'No matches' card only."
  artifacts:
    - path: "src/components/search/search-results-view/search-results-view.tsx"
      issue: "renders filter/sort/toolbar chrome even when results are empty"
    - path: "src/components/search/search-results-view/product-results.tsx"
      issue: "empty-state card rendered inside the full layout"
  missing:
    - "When result count is 0 (and no active filters context requires otherwise), render only SearchHero + the No-matches card"
  debug_session: ""

- truth: "PDP spacing and element alignment match the PDP section of design/extracted-design.html"
  status: failed
  reason: "User reported: looks good overall, but spacings and element alignments need a double-check against the design (claude.ai/design p/a0429833…)"
  severity: minor
  test: 12
  root_cause: "17 spacing/alignment deltas, none structural. Dominant pattern: info column and ProductForm use uniform gap-6 (24px) where the design specifies varied rhythm (14px title block, 16px rating->tags, 22px price, 26px options/tiers, 18px buy->assurance). Also: buy-row stepper is a rounded-full pill vs design's 4px-radius rectangle; post-grid sections mt-12 (48px) vs design clamp(50px,7vw,90px); grid missing 8px top pad; bulk-savings heading gap 16px vs 12px; eleven further 2px-class deltas. Tokens/grid/sticky offset verified matching (16 properties)."
  artifacts:
    - path: "src/app/(storefront)/products/[handle]/page.tsx"
      issue: "uniform gap-6 info column; mt-12 post-grid sections; missing pt-2 on grid"
    - path: "src/components/product/product-form/product-form.tsx"
      issue: "buy->assurance gap 24px vs 18px"
    - path: "src/components/ui/quantity-stepper/quantity-stepper.tsx"
      issue: "PDP buy row needs rectangle (rounded-sm) variant per design"
    - path: "src/components/product/bulk-savings/bulk-savings.tsx"
      issue: "heading->grid gap 16px vs 12px"
  missing:
    - "Fix the four medium deltas (info-column rhythm, stepper shape, post-grid spacing, grid top pad); sweep 2px-class deltas for pixel parity"
  debug_session: ".planning/debug/pdp-spacing.md"
  note: "Polish pass — diff PDP spacing/alignment values against the design HTML rather than re-implementing"

- truth: "Cart page aligns columns to headers, shows discount slashed prices, updates quantity optimistically, and uses a consistent container width"
  status: failed
  reason: "User reported: container max-width mismatch on cart page; quantity changes trigger a visible loading cycle each click — wants optimistic updates; price and qty columns not aligned with the table headers (regression — was okay before); discount slashed (compare-at) prices missing (regression — already worked before)"
  severity: major
  test: 13
  root_cause: "(1) ALIGNMENT: commit c4888d1 (11-11) replaced each line's grid (xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] — matching the header) with drawer-style flex rows but left the 5-column table header untouched; header and rows no longer share a layout system. (2) SLASHED PRICES: data still flows (compareAtAmountPerQuantity queried/mapped/passed) but is perceptually invisible — 4d9d062 restyled compare-at to font-mono text-[10px] text-ink-faint and c4888d1 demoted unit price to faint mono meta and deleted per-discount savings lines. (3) LOADING CYCLE: cart-line-actions uses useActionState only (no useOptimistic/useTransition); every click runs the Shopify mutation + revalidatePath('/cart'), disabling buttons and re-suspending the page-level Suspense skeleton. (4) WIDTH: cart/page.tsx is the only route using Section.Container variant='base' (1280px) vs max-w-wide (1480px) everywhere else."
  artifacts:
    - path: "src/app/(storefront)/cart/_components/cart-view.tsx"
      issue: "orphaned 5-col grid header (line 331) over flex rows; prices demoted to faint mono"
    - path: "src/components/ui/price/price.tsx"
      issue: "compare-at restyled to 10px font-mono text-ink-faint — invisible at cart density"
    - path: "src/app/(storefront)/cart/_components/cart-line-actions.tsx"
      issue: "no optimistic layer; isPending disables stepper"
    - path: "src/app/(storefront)/cart/page.tsx"
      issue: "sole variant='base' usage; Suspense skeleton re-suspends on revalidation"
  missing:
    - "Unify header + rows on one layout system (restore shared grid template or redesign header to match flex rows)"
    - "Re-emphasize compare-at price at cart sizes; consider restoring per-discount savings lines"
    - "useOptimistic + useTransition around quantity so stepper updates instantly; avoid re-triggering page Suspense"
    - "Align cart container to the default wide variant"
  debug_session: ".planning/debug/cart-regressions.md"
  note: >
    Two regressions from the 11-11 restyle: (1) th/column alignment broke when layout changed from grid to flex rows while headers remained table-style; (2) compare-at slashed prices no longer render (BULK-07 context preserved unit price but slashed display lost).
    Optimistic quantity: use React 19 useOptimistic/useTransition around the existing Server Action so stepper updates instantly without a loading cycle (cookie-backed cart stays the source of truth).
    Container: cart container width differs from adjacent sections (recommendations/footer) — align to the design's container token.

- truth: "Blog listing includes the newsletter band and contact sections (reused components), with tight section spacing and optimized image loading"
  status: failed
  reason: "User reported: two sections missing from blog listing — the newsletter band ('Explore the World of Tea with Monthly Newsletters' with teapot motif/stamp) and the contact section ('Need help? Speak with our Ingredients Experts Today.'); both already exist as components, reuse them. Spacing between sections too big (large empty gaps). Images need optimized loading"
  severity: major
  test: 14
  root_cause: "(1) SECTIONS: composition gap — listing ends with the small NewsletterSignup card; the production-matching pieces exist but fragmented: SupplyChain holds the BrushCircle+Stamp inverse-band layout (wrong illo/copy), BrushCircle already has an unused teapot variant, HomepageNewsletter holds the copy+form, Contact is directly reusable. No single component implements 'newsletter band with teapot + stamp' — must be composed; conventions decision needed on promoting motif components out of homepage/ (certifications page already imports cross-route). (2) SPACING: three stacked Section.Root tone='sunken' bands (FeaturedArticles, ArticleResults, newsletter wrapper) each apply py-section top AND bottom -> up to ~260px of empty same-background space; homepage already solves this with pt-0 on follow-on bands. (3) IMAGES: no defect — ArticleCard and blog Hero use next/image correctly (lazy, sizes, preload on LCP)."
  artifacts:
    - path: "src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx"
      issue: "missing newsletter ink band + Contact at page end; small NewsletterSignup card instead"
    - path: "src/components/homepage/supply-chain/supply-chain.tsx"
      issue: "template for the band layout (not directly reusable — copy/CTA differ)"
    - path: "src/components/homepage/brush-circle/brush-circle.tsx"
      issue: "teapot variant exists, unused; candidate for promotion out of homepage/"
    - path: "src/components/blog/featured-articles/featured-articles.tsx"
      issue: "doubled py-section against following band"
    - path: "src/components/blog/article-results/article-results.tsx"
      issue: "doubled py-section against preceding/following bands"
  missing:
    - "Compose blog newsletter ink band (Section.Root inverse + BrushCircle teapot + Stamp Business/Teavision + newsletter form) and mount with Contact at the end of the listing"
    - "Collapse meeting edges of consecutive same-tone bands (pt-0 pattern)"
    - "Decide component domain: promote BrushCircle/Stamp/Contact to shared domain or extend cross-route import precedent"
  debug_session: ".planning/debug/blog-sections.md"
  note: >
    Reuse homepage newsletter + contact section components on the blog listing (replacing/augmenting the small 'Tea Journal in your inbox' card per the original page structure).
    Spacing — large vertical gaps visible between article grid, tag-filter band, pagination, and newsletter card; tighten to design rhythm.
    Images — article card images should use next/image lazy loading with proper sizes attributes.

- truth: "/pages/bulk-wholesale-supply exists with the production page's content and layout, implemented on the Phase 11 design system"
  status: failed
  reason: "User reported: the wholesale supporting page should be /pages/bulk-wholesale-supply; supplied full production HTML — strip styling/classes/scripts, copy texts and layout, implement with the design system"
  severity: major
  test: 15
  root_cause: "Page never built: /pages/bulk-wholesale-supply has no route in src/app/(storefront)/pages/ — it falls through to the generic [...slug] Shopify-page renderer which cannot reproduce the 10-section composition. Not a regression; out of original Phase 11 scope, added by owner during UAT with full production content supplied."
  artifacts:
    - path: "src/app/(storefront)/pages/bulk-wholesale-supply/"
      issue: "route does not exist — new page.tsx + _components/ needed"
    - path: ".planning/phases/11-full-visual-redesign/bulk-wholesale-supply-content.md"
      issue: "authoritative content spec (10 sections, exact copy, links, media) — build from this"
  missing:
    - "Build the route with Section/Eyebrow/Button/Accordion primitives per the content spec; reuse Contact section; metadata + JSON-LD per sibling supporting pages"
  debug_session: ""
  note: "Full stripped content spec (10 sections: account banner, hero split, 2 feature grids, freight media-text, numbered accordion, 5-step process, FAQ, CTA banner, need-help contact) saved at .planning/phases/11-full-visual-redesign/bulk-wholesale-supply-content.md — build from that file using Section/Eyebrow/Button/Accordion primitives"

- truth: "404 page is creative and on-brand without being overdesigned"
  status: failed
  reason: "User reported: improve this page, be creative but dont overdesign"
  severity: minor
  test: 16
  root_cause: "Design-direction request, not a defect: current not-found.tsx is a functional but plain centered 404 (green serif numeral + heading + two buttons); owner wants a more creative on-brand treatment without overdesign."
  artifacts:
    - path: "src/app/not-found.tsx"
      issue: "plain 404 layout; candidate for brand-motif treatment (BrushCircle/Stamp assets available)"
  missing:
    - "Propose 1-2 tasteful 404 concepts (e.g. tea motif illustration, helpful links to collections/search) and preview for owner approval before implementing"
  debug_session: ""
  note: "Design-direction item — propose a tasteful on-brand 404 (e.g. tea motif/illustration from existing brand assets, helpful links to collections/search) and preview before implementing per the new preview-first workflow"

- truth: "Mega menu stays open while moving the cursor from the trigger into the panel, and all surfaces match design/extracted-design.html per subagent parity audit"
  status: failed
  reason: "User reported: can't hover to the megamenu — it disappears while the cursor is about to enter it, probably because of the gap between the trigger and the fixed panel (top-28.5). Also directed: audit all pages against the Claude design (design/extracted-design.html) with subagents and iterate until perfectly matched"
  severity: major
  test: 17
  root_cause: "~16px hover dead zone + zero-grace close: the nav <li> hover area is only 44px tall (min-h-11 trigger centered in the 76px main bar, bottom edge ~y=98px) while panels sit at fixed top-28.5 (y=114px). Crossing y=98 fires the li's onMouseLeave -> setOpenMenu(null) synchronously; the panel wrapper's rescue onMouseEnter can never fire because the panel is hidden (and the wrapper has zero in-flow size) before the cursor arrives. 11-04 removed position:relative from the li (panel was previously a descendant, so mouseleave never fired) without adding a compensating mechanism. Scroll-state and sub-sm theories eliminated — header wraps both bars in one sticky."
  artifacts:
    - path: "src/components/layout/header/mega-nav.tsx"
      issue: "immediate setOpenMenu(null) on li onMouseLeave (lines 44, 69); unreachable panel keep-open handler (104-107)"
    - path: "src/components/layout/header/mega-nav-styles.ts"
      issue: "44px-tall hover area ends 16px above the panel"
    - path: "src/components/layout/header/shop-mega-panel.tsx"
      issue: "fixed top-28.5 places panel below hover reach (same in services-mega-panel.tsx)"
  missing:
    - "Add ~150-300ms close grace timeout shared by triggers and panel wrapper, and/or make the hover surface contiguous (li h-full/self-stretch, or invisible bridge covering the 16px gap)"
    - "Per-surface design-parity audits completed by diagnosis agents — deltas feed the other gaps' fix plans"
  debug_session: ".planning/debug/megamenu-hover-gap.md"
  note: "Hover bug — panels moved to fixed top-28.5 in 11-04, leaving a pointer dead zone between nav trigger and panel; mouseleave closes the panel before the cursor reaches it. Fix via hover-intent bridge (padding/pseudo-element covering the gap) or open-state tolerance. Parity audit — diagnosis phase should spawn per-surface subagents comparing implementation to design/extracted-design.html and feed deltas into fix plans."
