---
status: diagnosed
trigger: 'Phase 11 UAT test 6 — homepage upper sections design parity vs design/extracted-design.html'
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — divergences are (a) hardcoded copy in components that ignores content.ts, (b) CertificationCoverage never mounted on the homepage, (c) ProofPoints never renders the `image` field, (d) Button/card metrics approximated instead of copied from the design CSS
test: static comparison of design/extracted-design.html (+ design/extracted/\*.js source) against src implementation
expecting: n/a — diagnosis complete
next_action: hand off to fix phase (goal: find_root_cause_only)

## Symptoms

expected: Homepage upper sections match design/extracted-design.html exactly, plus owner-directed copy overrides
actual: 6 reported mismatches — hero copy, invisible cert marquee, statband flag/icons/layout, button styles, private-label cards, product-range heading/tiles
errors: none (visual/structural parity defects)
reproduction: load homepage, compare against design/extracted-design.html
started: introduced during Phase 11 redesign implementation

## Evidence

- checked: src/app/(storefront)/page.tsx
  found: `CertificationCoverage` is NOT imported and NOT rendered anywhere in the homepage JSX (lines 3–16 imports, 57–70 body). It is only used on /pages/certifications (src/app/(storefront)/pages/certifications/\_components/page-content.tsx:17).
  implication: marquee is invisible because the component is never mounted on the homepage — not a CSS/keyframe bug.
- checked: src/app/globals.css:242-253
  found: `@keyframes marquee` (translateX 0 → -50%) and `@utility animate-marquee` exist and are valid.
  implication: animation tokens are fine; invisibility is purely the missing mount. Secondary defect: track div lacks `w-max`.
- checked: src/components/homepage/hero/hero.tsx:32-41
  found: h1 + paragraph + CTA label are hardcoded ("A world of tea mastery, by the kilogram." etc.). `HOMEPAGE_HERO.title` ("Australia's #1 tea company") and `HOMEPAGE_HERO.copy` already exist in content.ts:104-106 but are unused — only `.image.src` and `.cta.href` are read.
  implication: copy fix is a 1-line swap to consume existing content fields.
- checked: src/components/homepage/proof-points/proof-points.tsx:36-47
  found: component renders only `point.icon` via ICON_MAP; `point.image` is never referenced. HOMEPAGE_PROOF_POINTS[0] (content.ts:126-135) defines `image: /images/australian-flag.svg` with no `icon`. File exists at public/images/australian-flag.svg.
  implication: Australian flag missing because the image branch was never implemented.
- checked: design .statband CSS (extracted-design.html:985-992) vs proof-points.tsx
  found: design = 40px gold icon, left-aligned, item padding 44px 30px, dividers at all breakpoints; impl = 24px icon (size-6), centered text, px-6 py-4, lg-only dividers.
  implication: statband "doesn't match at all" — layout model differs, not just sizes.
- checked: design .btn CSS (extracted-design.html:631-654) vs src/components/ui/button/button.tsx
  found: heights/shadows/transition/hover-darkening/icon affordance all diverge (detail in delta table).
- checked: design .svc CSS (extracted-design.html:997-1005) + homepage.js ServicesSection vs private-label.tsx
  found: card body paragraph absent (no `body` field in SERVICE_CARDS), transition 150ms vs 350ms, rhythm flattened to gap-4.
- checked: design .rtile CSS (extracted-design.html:970-983) + homepage.js RangeSection vs product-range.tsx / overlay-image-card.tsx
  found: static gold "Shop Now" misuses design's `.rtile__tag` slot (a category tag pinned at tile top); hover "Shop now →" uses serif `font-display text-sm` instead of design mono 11px uppercase with translateY reveal; heading copy diverges from owner instruction.

## Eliminated

- hypothesis: marquee invisible due to broken `animate-marquee` keyframe
  evidence: keyframes + utility present and syntactically valid in globals.css:242-253
  timestamp: 2026-06-10
- hypothesis: marquee invisible due to positioning/overflow hiding
  evidence: component markup is a plain bordered block; it simply is not in the homepage tree
  timestamp: 2026-06-10
- hypothesis: Australian flag missing because asset is absent
  evidence: public/images/australian-flag.svg exists; content.ts references it; component never renders `point.image`
  timestamp: 2026-06-10

---

# Per-section delta tables

Design sources: `design/extracted-design.html` (CSS) and `design/extracted/homepage.js`, `design/extracted/data-layer.js`, `design/extracted/ui-primitives.js` (markup/content). Owner copy overrides from UAT take precedence over design-file copy.

## 1. Hero — src/components/homepage/hero/hero.tsx

| Aspect            | Design / required                                                                                                                                                                                                                                                                            | Current                                                                 | Delta                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| h1 copy           | **"Australia's #1 tea company"** (owner override; already in `HOMEPAGE_HERO.title`, content.ts:105)                                                                                                                                                                                          | Hardcoded "A world of tea mastery, _by the kilogram._" (hero.tsx:32-35) | Render `{HOMEPAGE_HERO.title}`               |
| Paragraph         | **"Discover a world of tea mastery in every cup. Handpicked from the finest leaves, our loose leaf teas, bulk tea bags, and organic herbs deliver rich flavor and freshness. Trusted by Australia's leading cafes, retailers, and wellness brands."** (`HOMEPAGE_HERO.copy`, content.ts:106) | Hardcoded different copy (hero.tsx:36-41)                               | Render `{HOMEPAGE_HERO.copy}`                |
| Primary CTA label | `HOMEPAGE_HERO.cta.children` = "Explore Our Teas"                                                                                                                                                                                                                                            | Hardcoded "Explore our teas"                                            | Use content field                            |
| Primary CTA icon  | `.btn` includes 17px arrow svg; hover `translateX(4px)` (design :640,643)                                                                                                                                                                                                                    | No icon                                                                 | Add arrow + hover slide (see Button section) |
| Secondary CTA     | `.btn-ghost` on dark: transparent bg, paper text, `border: 1.5px rgba(255,255,255,.35)` (homepage.js:27)                                                                                                                                                                                     | `variant="brand"` — solid green (hero.tsx:46-50)                        | Switch to `inverseSecondary`                 |
| Scrim             | `linear-gradient(105deg, rgba(18,28,20,.82) 0%, rgba(18,28,20,.5) 42%, rgba(18,28,20,.15) 100%)` (design :919-920)                                                                                                                                                                           | `hero-scrim` 2-stop .82 → .15, no 42% mid-stop (globals.css:234-240)    | Add middle stop                              |
| Trust marks       | `HOMEPAGE_HERO.trustMarks` image defined (content.ts:117-122)                                                                                                                                                                                                                                | Never rendered                                                          | Decide: render or delete field               |

## 2. Certification marquee — src/components/homepage/certification-coverage/certification-coverage.tsx

**Why invisible: not rendered.** `page.tsx` never imports `CertificationCoverage`; design home order is … OrganicSplit → **CertsMarquee** → Testimonials (homepage.js:388-390). Insert `<CertificationCoverage />` between `<OrganicHerbs />` and `<Testimonials />` (page.tsx:62-63).

Secondary deltas (visible once mounted), design `.certs` (:1017-1023):

| Aspect             | Design                                                                                                                                                        | Current                                          | Delta                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Track width        | `.certs__track { width: max-content }` — required for seamless `translateX(-50%)` loop                                                                        | `flex animate-marquee` without `w-max`           | Add `w-max`; without it the -50% translate is relative to container width, loop breaks |
| Items              | 6 short strings: "ACO Certified Organic", "USDA Organic", "HACCP Food Safety", "Golden Leaf Awards", "Australian Made", "Freight Insured" (data-layer.js:140) | 4 long card titles from `CERTIFICATION_COVERAGE` | Use a dedicated 6-item cert-strings list                                               |
| Item gap / padding | `gap: 64px; padding: 28px 0`                                                                                                                                  | `px-8 py-5` (32px sides / 20px)                  | gap-16 between items, py-7                                                             |
| Icon               | 26px, `--green`                                                                                                                                               | `size-4` (16px) text-brand                       | size to 26px (`size-6.5`)                                                              |
| Item type          | mono 12px, ls .12em, uppercase, `--ink-soft`                                                                                                                  | `type-mono-meta` = 11px, ls .08em                | 12px / tracking-[0.12em]                                                               |

## 3. Stat band — src/components/homepage/proof-points/proof-points.tsx

Design `.statband` (:985-992), markup homepage.js StatBand (:154-168):

| Aspect          | Design                                                                                                                         | Current                                                                                     | Delta                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Australian flag | First stat shows flag visual (impl content uses `/images/australian-flag.svg`, content.ts:127-132; asset exists)               | `point.image` never rendered — component only handles `point.icon` (proof-points.tsx:36-47) | Add image branch rendering `point.image`            |
| Icon size       | `.statband__ic` 40×40px, gold, `margin-bottom: 16px`                                                                           | `size-6` (24px), gap-3 (12px)                                                               | size-10, mb-4                                       |
| Item padding    | `44px 30px`                                                                                                                    | `px-6 py-4`                                                                                 | px-7.5 py-11                                        |
| Alignment       | Left-aligned (icon stacked above stat, no centering)                                                                           | `items-center … text-center`                                                                | Left-align                                          |
| Stat value      | serif 2.4rem, line-height 1                                                                                                    | matches — but uses banned `style={{fontFamily}}` (proof-points.tsx:50)                      | Drop inline style; `font-display` class suffices    |
| Description     | 0.9rem, opacity .78, `max-width: 22ch`, mt 8px                                                                                 | `type-body-sm` (0.875rem) text-paper/78, no max-width                                       | 0.9rem, max-w-[22ch], mt-2                          |
| Dividers        | `border-right: 1px rgba(255,255,255,.12)` between items at ALL breakpoints (2-col mobile keeps mid divider; 2nd item drops it) | `lg:border-l lg:border-paper/12` only (no mobile dividers)                                  | Replicate design divider pattern incl. 2-col        |
| Section padding | None beyond item padding (statband has no `.section-pad`)                                                                      | `spacing="compact"` adds py-8 md:py-12 on top                                               | Use `spacing="none"`, let item padding carry rhythm |
| Background      | `--green-deep`                                                                                                                 | `tone="brand"` → `bg-brand-deep` ✓                                                          | none                                                |

## 4. Button — src/components/ui/button/button.tsx

Design `.btn` family (:631-654):

| Aspect                     | Design                                                                        | Current                                                      | Delta                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| md metrics                 | `padding: 15px 26px` (≈53px tall)                                             | `min-h-11` (44px) `px-6.5`                                   | Taller: py ≈ 15px → min-h ≈ 13 (52px)                                                              |
| lg metrics                 | `.btn-lg` `18px 34px`, font 1rem (≈59px tall)                                 | `min-h-12` (48px) `px-8.5`, font 0.94rem                     | min-h ≈ 14-15, text-base                                                                           |
| sm metrics                 | `.btn-sm` `11px 18px`, 0.86rem                                                | `min-h-11 px-4.5 text-[0.86rem]`                             | min-h-10, px ✓                                                                                     |
| Transition                 | `.25s cubic-bezier(.2,.8,.2,1)` (transform/bg/color/shadow)                   | Tailwind default 150ms ease                                  | duration-250 + custom ease                                                                         |
| brand hover shadow         | `0 12px 28px -12px var(--accent-deep)` — green-tinted                         | `hover:shadow-2` = neutral `0 14px 30px -14px rgb(0 0 0/.4)` | Add brand-tinted shadow token                                                                      |
| primary (ink) hover        | `.btn-gold:hover { background: #000 }` — darker                               | `hover:bg-ink/90` — lighter/translucent (wrong direction)    | Darken toward black                                                                                |
| inverse hover              | `.btn-light:hover` keeps paper bg; lifts + `0 14px 30px -14px rgba(0,0,0,.5)` | `hover:bg-card` changes bg; shadow-2 (.4)                    | Keep bg-paper; shadow alpha .5                                                                     |
| svg affordance             | `.btn svg { 17px; transition }` + hover `translateX(4px)`                     | None — no child-svg styling, buttons used without arrows     | Add `[&_svg]` sizing + group hover translate; add arrow icons where design shows them (hero, CTAs) |
| Hover lift                 | `translateY(-2px)`                                                            | `-translate-y-0.5` (2px) ✓                                   | none                                                                                               |
| Radius / weight / tracking | 100px pill / 600 / .01em                                                      | rounded-full / type-label ✓                                  | none                                                                                               |

## 5. Private-label service cards — src/components/homepage/private-label/private-label.tsx + content.ts

Design `.svc` (:997-1005), ServicesSection (homepage.js:170-195):

| Aspect                       | Design / required                                                                                                                                 | Current                                                                                                                     | Delta                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Section h2                   | **"Private Label & Custom Tea Solutions"** (owner override)                                                                                       | "We make the tea. / You build the brand." (private-label.tsx:17-21)                                                         | Replace copy                                             |
| Section paragraph            | **"We partner with you to develop custom blends, manufacture tea bags, and deliver fully packaged private label tea products."** (owner override) | "Develop custom blends, manufacture tea bags and ship fully-packaged private-label product — all under one certified roof." | Replace copy                                             |
| Card body                    | `.svc__card p` ink-soft 0.96rem — every design card has a description (data-layer.js:31-41)                                                       | No paragraph; `SERVICE_CARDS` has no `body` field (content.ts:306-340)                                                      | Add `body` to ImageCard data + render `<p>`              |
| Hover animation              | `transition: transform .35s, box-shadow .35s`; lift -4px; shadow `0 24px 50px -28px rgba(0,0,0,.35)`                                              | `transition-[transform,box-shadow]` default **150ms**; -translate-y-1 (4px ✓); shadow-3 (✓ same value)                      | Add `duration-[350ms]` — speed is the perceived mismatch |
| Number line                  | `01 · From 20kg` (number + tag), mono 12px ls .14em gold-deep                                                                                     | Number only, classes match                                                                                                  | Add tag text after number                                |
| Inner rhythm                 | media mb 22px; number→h3 16px; h3→p 12px; p→link 22px                                                                                             | Uniform `gap-4` (16px)                                                                                                      | Use design margins (mb-5.5 / mt-4 / mt-3 / mt-5.5)       |
| Grid gap                     | 18px                                                                                                                                              | `gap-6` (24px)                                                                                                              | gap-4.5                                                  |
| link-arrow hover             | svg `translateX(4px)`; pb 3px; font 0.92rem                                                                                                       | No svg hover translate; pb-1 (4px); type-label 0.94rem                                                                      | Add icon slide on hover                                  |
| Card padding / radius / lift | 30px / 10px / -4px                                                                                                                                | p-7.5 / rounded-lg / -translate-y-1 ✓                                                                                       | none                                                     |

## 6. Product range — src/components/homepage/product-range/product-range.tsx + overlay-image-card.tsx

Design `.range` + `.rtile` (:970-983), RangeSection (homepage.js:108-133):

| Aspect                    | Design / required                                                                                                                                                                                                       | Current                                                                                                                                              | Delta                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Section h2                | **"Explore Our Product Range"** (owner override)                                                                                                                                                                        | "Wholesale online, direct / to business or doorstep." (product-range.tsx:14-18)                                                                      | Replace copy                                                                                    |
| Section paragraph         | **"We offer Wholesale products online direct to consumers and businesses or you can apply for a bulk wholesale account and receive further discounts on 100kg+ orders."** (owner override)                              | "Buy any line online at wholesale prices — or apply for a bulk account and unlock further discounts on 100kg+ orders."                               | Replace copy                                                                                    |
| Static gold "Shop Now"    | Design's gold mono slot is `.rtile__tag` — a category tag ("1,000+ lines", "Award-winning"…) pinned at the TOP of the tile via `margin-bottom: auto` (:978; data-layer.js:12-19). "Shop now" is never shown statically. | `card.action` ("Shop Now") rendered as static gold label directly above the title (overlay-image-card.tsx:46-50) → duplicates the hover "Shop now →" | Remove the static action label (redundant); optionally add a top-pinned `tag` field per design  |
| Hover "Shop now →"        | `.rtile__go`: **mono 11px, ls .08em, uppercase**, gap 7px, paper; reveal = opacity 0 + `translateY(6px)` → none, transition .3s (:981-982)                                                                              | `font-display text-sm` (serif ~14px, no uppercase/tracking), gap-1.5, opacity-only transition, no translateY (overlay-image-card.tsx:54-59)          | Switch to font-mono text-[11px] tracking-[0.08em] uppercase + translate-y reveal + duration-300 |
| Tile title                | 1.3rem, lh 1.05                                                                                                                                                                                                         | `text-[1.15rem] leading-[1.15]`                                                                                                                      | 1.3rem / 1.05                                                                                   |
| Scrim                     | `to top, rgba(16,24,18,.85) → rgba(16,24,18,.15) 65%`; hover deepens to `.92 / .35 70%`                                                                                                                                 | `from-ink/70 via-ink/20 to-transparent`, static (no hover change)                                                                                    | Strengthen base stops; add group-hover deepening                                                |
| Grid gap                  | 16px                                                                                                                                                                                                                    | `gap-4.5` (18px)                                                                                                                                     | gap-4                                                                                           |
| Sub line                  | `.sub` 0.84rem opacity .8 below title (data: "Loose leaf, by the kilo" …)                                                                                                                                               | absent                                                                                                                                               | Optional: add `sub` field                                                                       |
| Aspect / padding / radius | 1/1.08 · 20px · 10px                                                                                                                                                                                                    | aspect-[1/1.08] · p-4 sm:p-5 · rounded-lg ✓                                                                                                          | none                                                                                            |

## Page-level note

Design home order: Range → StatBand → BestSellers → Services → OrganicSplit → **CertsMarquee** → Testimonials. Implementation: Hero → ProofPoints(statband) → ProductRange → PrivateLabel → OrganicHerbs → Testimonials — marquee absent. Minimum fix in scope: mount `CertificationCoverage` between `OrganicHerbs` and `Testimonials`.

## Resolution

root_cause: Homepage upper sections diverge because (1) hero/product-range/private-label copy was hardcoded in components instead of consuming content.ts (which already holds the correct hero copy), (2) CertificationCoverage was never mounted in page.tsx (sole cause of invisible marquee; keyframe is fine but track also lacks w-max for a seamless loop), (3) ProofPoints never implemented the `image` rendering branch so the Australian flag asset is silently dropped, and icon/padding/alignment values were approximated, (4) Button and card metrics (heights, shadows, 150ms default transitions, missing svg hover affordances, serif hover label on range tiles) were approximated rather than copied from the design CSS.
fix: (deferred — diagnose-only mode)
verification: (deferred)
files_changed: []
