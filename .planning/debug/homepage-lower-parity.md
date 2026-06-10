---
status: diagnosed
trigger: "Phase 11 UAT test 7 — homepage lower sections: testimonials broken, newsletter awful, FAQ copy wrong"
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — three sections diverge from design/extracted-design.html + design/extracted/homepage.js and from owner-required copy
test: static comparison of implementation vs design CSS/JSX and original Liquid theme settings
expecting: n/a (diagnosis complete)
next_action: hand off delta list to fixer (do NOT fix here)

## Symptoms

expected: Homepage lower sections (testimonials, newsletter, FAQ) match design mockup structure/styling exactly, with owner-required copy
actual: Testimonials render 100–230-word raw quotes as a wall of serif text with a typographic quote glyph; newsletter is a flat green box with no decorative imagery; FAQ title is "Frequently asked." instead of "Frequently asked questions"
errors: none (visual/copy parity, not runtime)
reproduction: render homepage lower sections, compare to design/extracted-design.html sections .tst / .news / .faq
started: Phase 11 redesign implementation

## Evidence

- checked: design/extracted/homepage.js lines 232–263 (Testimonials), 265–285 (Newsletter), 351–371 (FAQSection)
  found: authoritative JSX structure for all three sections
  implication: implementation can be diffed 1:1 against design markup

- checked: design/extracted/data-layer.js lines 128–137
  found: design testimonial quotes are EDITORIALLY CONDENSED to ~25–40 words each (e.g. MOOD: "Teavision has been an exceptional partner from day one — responsive, proactive and genuinely invested in our success. Their reliable supply lets us channel more into our social mission.")
  implication: the design has NO CSS clamp/scale for long quotes (`.tst__quote` has no max-height/line-clamp). Long-quote handling is editorial: short pull-quotes at large serif scale. Implementation feeds full raw testimonials (content.ts TESTIMONIALS — MOOD ~130 words, Remedy ~200 words) into a style sized for short pull-quotes → wall of text.

- checked: design/extracted-design.html line 1035 + ui-primitives.js lines 34–43
  found: design quote mark is a 50x50 stroke SVG icon (`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7H5a2 2 0 00-2 2v3a2 2 0 002 2h2v3H4m15-10h-4a2 2 0 00-2 2v3a2 2 0 002 2h2v3h-3"/></svg>`), color gold at opacity .5, margin-bottom 18px
  implication: implementation's typographic `&ldquo;` at font-size 4rem (testimonials.tsx:33-37) does not match — this is the "gold quote mark doesn't match" delta

- checked: d:/Work/teavision/teavision-theme/config/settings_data.json lines 1569–1576
  found: original testimonials copy: title "Teavision Testimonials", description "We're proud to be the trusted tea supplier for Australia's biggest and most loved brands. Our clients value our ability to source fresh, organic ingredients and provide flexible solutions for bulk tea bags, loose tea in bulk, and custom blends."
  implication: matches owner-required copy exactly; implementation header copy ("Trusted by leading Australian brands" + different paragraph) must be replaced

- checked: d:/Work/teavision/teavision-theme/config/settings_data.json lines 1679–1726
  found: original FAQ: title "Frequently asked questions", description "You may have questions about sourcing wholesale tea, tea bags, and bulk spices. Below are answers to some of the most common queries from our partners." + 4 accordion items
  implication: the 4 Q/As in src/components/homepage/content.ts FAQS match the original theme VERBATIM (verified word-for-word) — accordion content is already correct. Only the TITLE diverges ("Frequently asked." vs "Frequently asked questions"). Paragraph already correct.

- checked: design/extracted-design.html lines 1040–1048 (.news) vs newsletter.tsx
  found: design newsletter card has an absolutely-positioned decorative image (`.news .ph { position:absolute; right:-6%; top:-20%; width:46%; height:140%; z-index:0; opacity:.5 }`) behind `.news__body`; implementation has NO imagery at all
  implication: the missing background visual is the primary reason the green band reads as "awful / flat"

- checked: globals.css tokens vs design CSS
  found: type-heading-01 = h-xl clamp(2rem,4vw,3.4rem) ✓; type-heading-02 = h-lg clamp(1.7rem,3vw,2.6rem) ✓; paper-2 = bg-paper2 ✓; max-w-base = 80rem (1280px) but design FAQ wrap is maxWidth 880px (55rem) ✗

## Eliminated

- hypothesis: design clamps/truncates long quotes via CSS
  evidence: .tst__quote (extracted-design.html:1036) has only font-family/size/line-height; no max-height, line-clamp, or overflow rules. Design solves length editorially with condensed quotes.
  timestamp: 2026-06-10

- hypothesis: FAQ accordion contents diverge from original theme
  evidence: all 4 question/answer pairs in content.ts FAQS are verbatim identical to faq_section_LLUjiY blocks in teavision-theme/config/settings_data.json
  timestamp: 2026-06-10

---

# Per-section delta tables

## 1. Testimonials — `src/components/homepage/testimonials/`

Design refs: extracted-design.html:1025–1037 (.tst*), extracted/homepage.js:232–263, extracted/data-layer.js:128–137. Owner copy ref: teavision-theme settings_data.json:1571–1572.

| # | Aspect | Design / Required | Implementation | Delta |
|---|--------|-------------------|----------------|-------|
| T1 | Quote length handling | Condensed pull-quotes ~25–40 words (editorial, no CSS clamp). `.tst__quote` clamp(1.4rem,2.4vw,2.1rem)/1.32 serif is sized for SHORT quotes | Full raw testimonials (100–230 words) at same large serif scale | ROOT CAUSE of "wall of text". Condense each TESTIMONIALS quote in content.ts to a 25–40-word pull-quote (design data-layer.js:130–136 provides condensed versions for all 4 brands — copy them) |
| T2 | Quote mark | 50x50 stroke SVG quote icon, `color: var(--gold)`, `opacity: .5`, `margin-bottom: 18px`, strokeWidth 1.6 (path in Evidence above) | Typographic `&ldquo;` at `font-display text-[4rem] leading-none text-gold/50`, mb-4 | Replace glyph with the design's SVG icon: `h-12.5 w-12.5 text-gold opacity-50 mb-[18px]` (50px), stroke-based, fill none |
| T3 | Quote text wrapping | Quote rendered wrapped in literal quotes: `"{quote}"` (homepage.js:256) | No surrounding quote characters | Add opening/closing curly quotes around quote text |
| T4 | Section header copy | Owner-required: title "Teavision Testimonials", paragraph "We're proud to be the trusted tea supplier for Australia's biggest and most loved brands. Our clients value our ability to source fresh, organic ingredients and provide flexible solutions for bulk tea bags, loose tea in bulk, and custom blends." | "Trusted by leading Australian brands" + paraphrased copy | Replace heading + paragraph with required copy verbatim. Eyebrow "Testimonials" may stay (design uses an eyebrow: "Trusted partners") |
| T5 | Header layout | `range__head`: flex, align-items flex-end, justify-between, h2 max-width 16ch left-aligned, side paragraph `max-width: 34ch` color ink-soft, margin-bottom 50px (homepage.js:238–243, extracted-design.html:971–972) | Centered `max-w-prose text-center` block | Convert to design's split header (left: eyebrow + h2; right: muted paragraph max-w-[34ch]); mb 50px (slider currently mt-12=48px) |
| T6 | Section background | `section-pad` with DEFAULT paper background (no bg-paper2) — homepage.js:236 | `Section.Root tone="sunken"` (bg-paper-2) | Change to `tone="surface"` |
| T7 | Attribution line | `.tst__who`: `{who} — {brand}` (person em-dash brand), mono 12px, letter-spacing .1em, uppercase, ink-faint, margin-top 26px | `{name} - {role}` with hyphen, `type-mono-meta mt-6` | Use em dash and person—brand order; mt 26px (mt-6=24px, use mt-6.5) |
| T8 | Data bug | Other entries: name=person, role=title | St. Ali entry: `name: 'St. Ali', role: 'Lucy Ward'` (swapped vs siblings) | Normalize: person name "Lucy Ward", brand "ST. ALi" (and add brand field if needed for T7 format) |
| T9 | Brand selector buttons | `.tst__brand`: gap 14px, padding 16px 18px, logo 54x40 radius 6px, brand font-weight 700, role 0.8rem ink-faint | ToggleButton: gap-3 (12px), p-4 (16px), logo rounded-sm (4px), font-semibold (600), text-sm (14px) | Minor: gap-3.5, px-4.5 py-4, rounded-md logo, font-bold, role text-[0.8rem] |
| T10 | Grid | `.tst`: 0.9fr 1.6fr, gap clamp(30px,5vw,70px), items center; collapses to 1fr at mobile | matches (lg:grid-cols-[0.9fr_1.6fr], same gap clamp) | none ✓ |

## 2. Newsletter — `src/components/homepage/newsletter/`

Design refs: extracted-design.html:1039–1048 (.news*), extracted/homepage.js:265–285.

| # | Aspect | Design | Implementation | Delta |
|---|--------|--------|----------------|-------|
| N1 | Decorative imagery | Absolutely-positioned image behind body: `position:absolute; right:-6%; top:-20%; width:46%; height:140%; z-index:0; opacity:.5` (on-dark photo/texture) | NONE — flat `bg-brand-deep` box | ROOT CAUSE of "awful". Add absolutely-positioned botanical/tea photo (e.g. existing Shopify CDN asset) with exactly those offsets and opacity-50, behind the z-1 body |
| N2 | Card padding | `clamp(40px,6vw,72px)` | `clamp(28px,5vw,64px)` | Use design clamp values |
| N3 | Body copy opacity/spacing | `p { opacity: .85; margin-top: 14px }` | `text-paper/75 mt-4` (75%, 16px) | text-paper/85, mt-3.5 |
| N4 | Form spacing | gap 10px, margin-top 28px | gap-2 (8px), mt-7 (28px ✓) | gap-2.5 |
| N5 | Input | padding 15px 22px, min-width 220px, bg white/10, border white/25, radius 100px, focus border gold | min-h-12 px-5.5, no min-width, same bg/border/radius/focus | Add min-w-55 (220px); padding effectively matches |
| N6 | Placeholder text | "Enter your email" | "Enter Email" | Use design text "Enter your email" (also fix sr-only label) |
| N7 | Submit button | `btn btn-light btn-lg`: bg paper / ink text, padding 18px 34px, font 1rem, trailing arrow icon, hover lift+shadow | `Button variant="inverse" size="cta"` (min-h-12 px-8.5) — no arrow | variant inverse matches btn-light styling/hover; add trailing arrow icon; size close enough (cta) |
| N8 | Body max-width | `.news__body` max-width 30rem, z-index 1 | `max-w-120` (30rem), `z-1` ✓ | none ✓ |
| N9 | Section wrapper | `section-pad bg-paper2` with paddingTop 0 | `tone="sunken"` + `pt-0` ✓ | none ✓ |
| N10 | Heading | h-lg (= type-heading-02), mt 16px, paper ✓; eyebrow gold ✓ | matches | none ✓ |

## 3. FAQ — `src/components/homepage/faq/faq.tsx`

Design refs: extracted-design.html:1076–1083 (.faq*), extracted/homepage.js:351–371. Owner copy ref: teavision-theme settings_data.json:1719–1720 + faq_section_LLUjiY blocks.

| # | Aspect | Design / Required | Implementation | Delta |
|---|--------|-------------------|----------------|-------|
| F1 | Title | Owner-required: "Frequently asked questions" (original theme settings_data.json:1719) | "Frequently asked." | Replace title text verbatim |
| F2 | Paragraph | "You may have questions about sourcing wholesale tea, tea bags, and bulk spices. Below are answers to some of the most common queries from our partners." | identical | none ✓ (already correct) |
| F3 | Accordion contents | Original theme 4 Q/As (faq_item_Ek4GQM/GM6rpP/LWPXLk/J6dfat) | content.ts FAQS — verbatim identical, same order | none ✓ (already correct) |
| F4 | Container width | design `wrap` overridden to `maxWidth: 880` (55rem) — homepage.js:355 | `Section.Container variant="base"` = max-w-base = 80rem (1280px), plus redundant inner `max-w-base` wrapper | Constrain section content to 880px (e.g. `max-w-[55rem]` wrapper or container override); remove redundant inner max-w-base |
| F5 | Header spacing | marginBottom 44px, centered, eyebrow "Questions" no-rule | mt-11 (44px) on list, Eyebrow rule={false} ✓ | none ✓ |
| F6 | Row styling | border-top hairline per item + border-bottom on last; q: serif clamp(1.1rem,1.8vw,1.4rem), padding-block 26px, gap 20px; icon 30px circle, rotate 45 + green fill when open; answer ink-soft, pb 26px, max-w 60ch | matches (py-6.5=26px, h-7.5 w-7.5=30px, gap-5=20px, same clamp, group-open states) | none ✓ |
| F7 | Open/close animation | max-height transition .4s cubic-bezier(.2,.8,.2,1) | native `<details>` (instant snap) | Minor: acceptable; optional `transition` via CSS `interpolate-size`/grid-rows if parity demanded |

# Required copy (verbatim)

**Testimonials:**
- Title: `Teavision Testimonials`
- Paragraph: `We're proud to be the trusted tea supplier for Australia's biggest and most loved brands. Our clients value our ability to source fresh, organic ingredients and provide flexible solutions for bulk tea bags, loose tea in bulk, and custom blends.`

**FAQ:**
- Title: `Frequently asked questions`
- Paragraph: `You may have questions about sourcing wholesale tea, tea bags, and bulk spices. Below are answers to some of the most common queries from our partners.`
- Accordion: keep existing FAQS in content.ts (verified identical to original theme).

**Condensed testimonial pull-quotes (from design data-layer.js:128–137 — use these to replace the long quotes in content.ts):**
- MOOD Tea / Ashley McGrath (GM, Social Enterprise): "Teavision has been an exceptional partner from day one — responsive, proactive and genuinely invested in our success. Their reliable supply lets us channel more into our social mission."
- ST. ALi / Lucy Ward: "An outstanding supplier and trusted partner in bringing our products to life. Professional, detail-oriented and seamless across multiple product lines."
- Remedy Drinks / Julia Blair (Global Head of Manufacturing): "Their efficient sourcing and deep understanding of our supply chain delivered real cost savings without compromising quality. On-time, in-full, every time."
- Buy Organics Online / Lucas (Owner): "Invaluable in navigating the complexities of sourcing quality products. Having them close by reduces risk and opens their whole network to us."

## Resolution

root_cause: See per-section tables — T1/T2/T4/T5/T6 (testimonials), N1/N2/N6/N7 (newsletter), F1/F4 (FAQ)
fix: (not applied — audit only)
verification: (n/a)
files_changed: []
