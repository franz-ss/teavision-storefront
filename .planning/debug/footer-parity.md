---
status: diagnosed
trigger: "Phase 11 UAT test 8: footer styling/spacing differs from design; texts/links must match original site"
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: Footer implementation diverges from design mockup spacing tokens and substitutes mockup-invented copy for original-site copy
test: Static diff of design/extracted-design.html (.ft CSS + design/extracted/product-card-footer.js markup) vs src/components/layout/footer/*, and data.ts vs production footer (fetched) + teavision-theme footer.liquid / settings_data.json
expecting: n/a — audit complete
next_action: Hand delta list to planner (goal: find_root_cause_only, no fixes applied)

## Symptoms

expected: Footer copies mockup styling exactly AND uses original site texts/links
actual: Spacing inflated vs mockup (section padding, 44px-tall links, contact-link sizing); several texts are mockup-invented or hybridized; Popular Searches link list missing
errors: none (visual/content parity issue)
reproduction: Compare rendered footer to design/extracted-design.html .ft section and to https://www.teavision.com.au footer
started: Phase 11 footer build

## Evidence

- timestamp: 2026-06-10
  checked: design/extracted-design.html lines 1086-1099, 1108, 1114 (.ft CSS); design/extracted/product-card-footer.js (Footer markup)
  found: Authoritative design values extracted (see delta table)
  implication: Baseline for styling diff

- timestamp: 2026-06-10
  checked: Production https://www.teavision.com.au footer (live runs footer-redesign.liquid, ftrR- classes) + teavision-theme/config/settings_data.json footer blocks + sections/footer.liquid
  found: Original columns = Main Menu, Footer, Quality (HACCP text + 3.png image), Keep in Touch ("Sign up for exclusive offers, market trends and new product alerts." + form + tel/email). Bottom row = "© 2026 [Teavision](/)" + "Popular Searches" (#popular-searches toggle revealing ~98 SEO links in 4 ULs, hardcoded in footer.liquid lines 76-188). Payments = AmEx, Apple Pay, Google Pay, Mastercard, PayPal, Shop Pay, Union Pay, Visa.
  implication: Baseline for text/link inventory

- timestamp: 2026-06-10
  checked: src/app/globals.css tokens
  found: --spacing-section = clamp(4rem,9vw,8.125rem) = clamp(64px,9vw,130px); design .ft__top padding-block = clamp(50px,7vw,90px). max-w-wide (1480px) and px-gutter (clamp(20px,5vw,72px)) match design wrap-wide exactly.
  implication: py-section over-pads footer by 14-40px top and bottom

---

# Footer Parity Audit — Delta List

## A. Styling deltas (design .ft → current implementation)

| # | Property | Design value | Current value | File | Severity |
|---|----------|-------------|---------------|------|----------|
| 1 | Top section padding-block | `clamp(50px, 7vw, 90px)` | `py-section` = `clamp(64px, 9vw, 130px)` | view/view.tsx:17 | HIGH — up to +40px each side; main spacing complaint |
| 2 | Link row height | natural line-height (~20px rows) | `min-h-11` (44px) on every FooterTextLink | link/link-item.tsx:8 | HIGH — more than doubles link-column height; dominant cause of "spacing feels off". (Note: 44px is a tap-target a11y choice — if kept, design parity requires negative-margin/visual compaction or smaller gap) |
| 3 | Link list gap | `11px` | `gap-3` (12px) — compounds with min-h-11 | link-list/link-list.tsx:10 | LOW alone, HIGH combined with #2 |
| 4 | Tablet grid | 2 columns at ≤980px (`1fr 1fr`), 1 col at ≤620px | `grid-cols-1` until `lg:` (1024px) then 4 col — no 2-col tablet step | view/view.tsx:17 | MED — footer is a single tall stack on tablets |
| 5 | Quality pills row | `margin-top: 22px; gap: 10px` | `mt-4` (16px), `gap-2` (8px) | quality-column/quality-column.tsx:22 | LOW |
| 6 | Pill letter-spacing | `.1em` (design `.pill`) | `type-mono-meta` = `.08em` | quality-column/quality-column.tsx:26 | LOW |
| 7 | Newsletter input top margin | `margin-top: 12px` (input, directly after blurb) | form `mt-5` (20px) | newsletter-form/newsletter-form.tsx:31 | LOW |
| 8 | Newsletter input bg/border | `rgba(255,255,255,.06)` / `.18` | `bg-paper/5` / `border-paper/20` | newsletter-form/newsletter-form.tsx:48 | NEGLIGIBLE |
| 9 | Contact links (tel/email) | mono `12px`, compact rows, gap 8px | wrapped in FooterTextLink → forces `text-[0.95rem]` (~15.2px) + `min-h-11` (44px rows) overriding the column's `font-mono text-[12px]` | newsletter-column/newsletter-column.tsx:26-38 + link/link-item.tsx:8 | MED |
| 10 | Payment chip gap | `7px` | `gap-1` (4px) | view/view.tsx:48 | LOW |
| 11 | Payment chip padding | `5px 9px` | `px-2 py-1` (8px/4px) | payment-mark/payment-mark.tsx:5 | NEGLIGIBLE |
| 12 | Payment chip letter-spacing | `.08em` | `tracking-[0.04em]` | payment-mark/payment-mark.tsx:5 | LOW |
| 13 | Payment chip text color | inherits `.ft` color (paper @ ~0.78) | `text-paper/60` (dimmer) | payment-mark/payment-mark.tsx:5 | LOW |
| 14 | Bottom border | `rgba(255,255,255,.12)` | `border-paper/10` | view/view.tsx:28 | NEGLIGIBLE |
| 15 | Bottom row copyright | plain `<span>` (not a link) | entire line is an interactive FooterTextLink (`min-h-11`, hover underline-offset) → taller bottom bar | view/view.tsx:34-39 | MED |
| 16 | Mobile bottom-row order | copyright first, payments after (DOM order, flex-wrap) | payments `order-1` above copyright on mobile | view/view.tsx:31,48 | LOW (intentional? differs from design) |

Matches confirmed (no action): grid template `1.6fr 1fr 1fr 1.4fr`, grid gap 40px (`gap-10`), container 1480px + gutter, column heading typography (mono 10.5px / .16em / uppercase / gold / 18px mb), link font-size 0.95rem + hover→paper, bottom row mono 11px / .06em / 22px padding-block, pill padding 6px 12px, chip radius 5px / 9.5px font, input rounded-full + 14px/18px padding.

## B. Text/link inventory deltas (original site → current data/components)

| # | Item | Original (production / theme) | Current | Severity |
|---|------|------------------------------|---------|----------|
| B1 | Quality column text | "Teavision runs a HACCP Certified food & safety program to provide consistent quality throughout its products." (settings_data.json footer text block) | "Australia's leading wholesale tea, herb & spice house. Certified organic, award-winning, ethically sourced." (truncated mockup brand copy, hardcoded in quality-column.tsx:18-21) | HIGH — owner asked for original texts |
| B2 | Quality pills | none on original site (mockup-invented `TV.certs`: pills belong to mockup brand column) | 4 hardcoded pills: HACCP Certified, ACO Organic, USDA Organic, Ethically Sourced (quality-column.tsx:5-10) | MED — extra content not in original; styling element from mockup. Decision needed: keep as mockup-styling or drop for original fidelity |
| B3 | Newsletter blurb | "Sign up for exclusive offers, market trends and new product alerts." | "Market trends, new lines and exclusive wholesale offers — monthly." (mockup copy, newsletter-column.tsx:22-24) | HIGH |
| B4 | Copyright line | `© {current year} ` + only "Teavision" linked to `/` | "© 2026 Teavision · 100% Australian owned & operated" — whole line one link to `/`; "100% Australian owned & operated" is mockup-invented, not on original site; year hardcoded | MED |
| B5 | Popular Searches | Link toggles in-footer `#popular-searches` block with ~98 hardcoded SEO links in 4 columns (footer.liquid:76-188) | Plain link to `/search`; SEO link list entirely missing | HIGH — "respect the original texts and links"; this is an SEO-relevant link inventory |
| B6 | Column order | Main Menu, Footer, Quality, Keep in Touch | Quality, Main Menu, Footer, Keep in Touch (Quality mapped to mockup's wide 1.6fr brand slot) | LOW — defensible mapping to mockup grid; flag for owner decision |
| B7 | Main Menu links | Tea, Tea Bags, Herbs & Spices, Services, Tea Journal, Our Story (hrefs verified) | identical in data.ts MAIN_MENU_LINKS | MATCH |
| B8 | Footer links | Search, Login (mrtea.com.au), T's & C's, Contact us, Refund Policy, Terms of Service | identical in data.ts FOOTER_LINKS | MATCH |
| B9 | Contact links | tel 1300 729 617, mailto info@teavision.com.au | identical | MATCH |
| B10 | Payment methods | AmEx, Apple Pay, Google Pay, Mastercard, PayPal, Shop Pay, Union Pay, Visa (live enabled types) | identical 8 in data.ts | MATCH (design mockup only showed 7 text chips; live inventory correctly wins) |
| B11 | Quality image | 3.png (600×232) shown in Quality column | present (quality-column.tsx:32-39, with added `opacity-80` not in original) | MATCH (minor: opacity) |
| B12 | Newsletter heading | "Keep in Touch" | "Keep in Touch" (mockup said "Keep in touch"; original casing kept) | MATCH |

## Resolution

root_cause: Two compounding divergences — (1) spacing: footer uses the global `py-section` token (clamp 64-130px) instead of the design's clamp(50-90px), and every footer link carries `min-h-11` (44px) + `gap-3`, inflating link columns to ~2x the design height; contact links inherit the same oversized link class; tablet 2-col grid step is missing. (2) content: Quality and newsletter copy are mockup-invented (or truncated-mockup) strings instead of the original site's texts, the copyright line adds mockup-invented text and is fully linkified, and the original Popular Searches SEO link block (~98 links) is reduced to a bare `/search` link.
fix: (not applied — diagnose-only)
verification: (n/a)
files_changed: []
