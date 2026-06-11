---
status: diagnosed
trigger: "Phase 11 UAT test 12 — PDP 'looks good, just double check the spacings and element alignments against the design'"
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: PDP implementation deviates from design mockup in vertical rhythm and a few element-level spacings
test: static comparison of design/extracted/design-system.css + product-page.js vs current PDP source
expecting: small polish-level deltas only
next_action: none — audit complete, deltas listed below

## Symptoms

expected: PDP spacing/alignment matches design/extracted-design.html (.pdp\* classes in design/extracted/design-system.css, markup in design/extracted/product-page.js)
actual: mostly faithful; uniform 24px flex rhythm replaces the design's varied 14–32px margins, plus a handful of element-level deltas
errors: n/a (visual parity audit)
reproduction: compare /products/[handle] against design mockup PDP section
started: Phase 11 redesign implementation

## Evidence

- checked: design-system.css lines 628–755 (.crumb, .pdp\*, .sizes/.size, .pdp**buy, .pdp**assure, .tiers/.tier, .specs/.spec-acc, .spectable, .related), 90–151 (.eyebrow, h1 base, .wrap-wide, .btn/.btn-lg), 383–386 (.qty), tokens lines 40–42
  found: authoritative design values extracted (see tables below)
  implication: design uses explicit per-element margins, not uniform gaps
- checked: src/app/(storefront)/products/[handle]/page.tsx, product-gallery.tsx, product-form.tsx, bulk-savings.tsx, quantity-stepper.tsx, button.tsx (size lg), eyebrow.tsx, globals.css tokens
  found: current values (see tables below); tokens confirm rounded-sm=4px, rounded-lg=10px, max-w-wide=1480px, px-gutter=clamp(20px,5vw,72px) — all matching design tokens
  implication: token layer is aligned; deltas are per-element class choices

## Verified matches (no action)

| Property           | Design                                                                      | Current                                                              |
| ------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Container          | 1480px / gutter clamp(20px,5vw,72px)                                        | max-w-wide (1480px) / px-gutter — match                              |
| Breadcrumb         | mono 11px upper, gap 8px, padding-block 22px                                | type-mono-meta, gap-2, py-5.5 (22px) — match                         |
| Two-col grid       | 1.05fr 1fr, gap clamp(28px,4vw,64px), align start                           | identical — match                                                    |
| Gallery sticky     | top 120px                                                                   | lg:top-30 (120px) — match                                            |
| Main image         | aspect 1/1.05, radius 10px                                                  | aspect-[1/1.05], rounded-lg (10px) — match                           |
| Thumb grid         | 4 cols, gap 12px, mt 12px                                                   | grid-cols-4 gap-3 mt-3 — match                                       |
| H1                 | clamp(2rem,3.4vw,2.9rem), lh 1.04, weight 500                               | identical (font-medium) — match                                      |
| Price row          | now 2.2rem serif, baseline, gap 12px                                        | text-[2.2rem], gap-3, items-baseline — match                         |
| Variant tile       | min-w 92px, px 18px, border 1.5px, radius 4px, tile gap 10px, label mb 12px | min-w-23, px-4.5, border-[1.5px], rounded-sm, gap-2.5, mb-3 — match  |
| Buy row gap        | 12px                                                                        | gap-3 — match                                                        |
| Assurance row      | py 20px border-y, item gap 9px, 0.86rem                                     | py-5 border-y, gap-2.25, text-[0.86rem] — match                      |
| Tier grid          | 3 cols, gap 10px, tile p 14px radius 4px, price 1.3rem mt 4px               | sm:grid-cols-3 gap-2.5, p-3.5 rounded-sm, text-[1.3rem] mt-1 — match |
| Disclosure header  | py 20px, serif 1.15rem                                                      | py-5, font-display text-[1.15rem] — match                            |
| Spec table rows    | py 12px, label col 40% mono                                                 | py-3, w-2/5 type-mono-meta — match                                   |
| Disclosures offset | .specs mt 32px                                                              | page gap-6 (24px) + mt-2 (8px) = 32px — match                        |
| Eyebrow            | rule 22px + gap 10px                                                        | before:w-5.5 + gap-2.5 — match                                       |

## Delta table (actual mismatches only)

| #   | Property                          | Design value                                                                                                         | Current value                                         | Severity   |
| --- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------- |
| 1   | Grid top offset (crumb → grid)    | `.pdp { padding-top: 8px }` (22px crumb + 8px = 30px)                                                                | none (22px only)                                      | Low        |
| 2   | Eyebrow → H1 gap                  | 14px (`.pdp__info .eyebrow` mb)                                                                                      | 12px (`gap-3`)                                        | Low        |
| 3   | H1 → rating gap                   | 14px (`.pdp__rating` mt)                                                                                             | 12px (`gap-3`)                                        | Low        |
| 4   | Rating → badge pills gap          | 16px (inline `marginTop:16`)                                                                                         | 24px (outer `gap-6`)                                  | **Medium** |
| 5   | Price block vertical margins      | 22px above/below (`.pdp__price` margin 22px 0)                                                                       | 24px (`gap-6`)                                        | Low        |
| 6   | Description → variant selector    | 26px (`.pdp__opts` mt)                                                                                               | 24px (`gap-6`)                                        | Low        |
| 7   | Buy row → assurance row           | 18px (`.pdp__buy` mb 18px)                                                                                           | 24px (form `gap-6`)                                   | **Medium** |
| 8   | Assurance → bulk tiers            | 26px (`.tiers` mt)                                                                                                   | 24px (form `gap-6`)                                   | Low        |
| 9   | Bulk heading → tier grid          | 12px (`.tiers h5` mb)                                                                                                | 16px (`gap-4`)                                        | Low–Med    |
| 10  | Quantity stepper shape in buy row | rectangle, `border-radius: 4px` (`.pdp__buy .qty { border-radius: var(--radius) }`), buttons 46px wide × full height | pill (`rounded-full`), buttons fixed `size-11` (44px) | **Medium** |
| 11  | Add-to-cart button height         | btn-lg padding-block 18px (~52px tall)                                                                               | `min-h-12` (48px)                                     | Low        |
| 12  | Price unit label "/ base unit"    | mono 13px, no uppercase/tracking (`.pdp__price .unit`)                                                               | mono 11px uppercase tracking-[0.06em]                 | Low        |
| 13  | Thumbnail radius                  | 8px (`.pdp__thumb`)                                                                                                  | `rounded-lg` (10px)                                   | Low        |
| 14  | Variant tile vertical padding     | 13px (`padding: 13px 18px`)                                                                                          | 12px (`py-3`)                                         | Negligible |
| 15  | Assurance row gaps                | 14px row / 26px column (`gap: 14px 26px`)                                                                            | 12px / 24px (`gap-y-3 gap-x-6`)                       | Low        |
| 16  | Disclosure content bottom space   | 22px (`.spectable` mb, `.spec-acc__c p` pb)                                                                          | 20px (`mb-5` / `pb-5`)                                | Low        |
| 17  | Post-grid section rhythm          | `.related { margin-top: clamp(50px,7vw,90px) }` (~90px desktop)                                                      | `mt-12` (48px) on Reviews and Recommendations blocks  | **Medium** |

Informational (structural, not spacing — flag for owner only): ProductForm inserts a "selected pack" price row between variant tiles and buy row that has no design counterpart; design instead live-updates the main `.pdp__price`. The extra row adds two 24px gaps of vertical height to the info column.

## Eliminated

- hypothesis: token-level drift (radius/gutter/container) causes the differences
  evidence: globals.css @theme matches design tokens exactly (radius-sm 4px, radius-lg 10px, container-wide 92.5rem=1480px, gutter clamp)
  timestamp: 2026-06-10

## Resolution

root_cause: 17 spacing/alignment deltas, dominated by one cause — the info column uses uniform `gap-6` (24px) flex rhythm (page.tsx + product-form.tsx) where the design specifies varied 14/16/18/22/26px margins; plus four element-level deltas (buy-row stepper pill vs 4px rectangle, missing 8px grid top pad, 48px vs ~90px section rhythm below the grid, 16px vs 12px bulk heading gap)
fix: not applied (audit-only mode)
verification: n/a
files_changed: []
