---
status: diagnosed
trigger: "Phase 11 UAT test 10 — /collections index page does not match owner expectations (production parity)"
created: 2026-06-10T00:00:00+10:00
updated: 2026-06-10T00:00:00+10:00
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED — structural deltas identified between src/app/(storefront)/collections/page.tsx and production https://www.teavision.com.au/collections
test: static analysis + production HTML fetch complete
expecting: n/a
next_action: hand off to planner/executor for fix

## Symptoms

expected: |
  1. No "Directory / All collections" list section — card grid only.
  2. First card is "All" linking to /collections/all.
  3. Card grid matches production item set and order (alphabetical by title, "All" first, ~119 cards).
  4. Contact section ("Need help? Speak with our Ingredients Experts Today." + form) at bottom of page.
actual: |
  1. Page renders a "Directory / All collections" text-list section (lines 262-300 of page.tsx).
  2. Card grid ("Popular paths") shows only 8 collections sourced from the Shopify nav menu
     (SHOPIFY_COLLECTIONS_INDEX_MENU_HANDLE = 'main-menu') with fallback heuristics; explicitly
     EXCLUDES handle 'all' via isPublicCollection().
  3. No contact section at the bottom.
errors: none (structural/UX delta, not a runtime error)
reproduction: visit /collections locally; compare with https://www.teavision.com.au/collections
started: page was built this way (Phase 11 redesign)

## Eliminated

- hypothesis: "/collections/all might 404 (no synthetic all-collection handling)"
  evidence: |
    [handle]/page.tsx routes any handle through getCollection(handle) with no special-casing.
    The store HAS a real 'all' collection: (a) production grid renders an "All" card at
    /collections/all; (b) page.tsx itself filters `handle !== 'all'` out of
    getCollectionSummaries() results, i.e. 'all' is present in the Storefront API data;
    (c) [handle]/_lib/page-helpers.ts getSidebarCollections() sorts 'all' first, and the
    header CTA "Browse all products" already links to /collections/all.
    Therefore /collections/all resolves through the existing dynamic route. No synthetic
    collection needed.
  timestamp: 2026-06-10

## Evidence

- timestamp: 2026-06-10
  checked: src/app/(storefront)/collections/page.tsx
  found: |
    - Card grid = "featuredCollections" capped at FEATURED_COLLECTION_LIMIT=8, sourced from
      getCollectionMenuSummaries('main-menu') merged with heuristic fallback
      (getFeatured/getFallbackFeatured/mergeFeaturedCollections, lines 31-118).
    - isPublicCollection() (line 48) removes 'all' and 'frontpage' from the grid.
    - Directory list section (lines 262-300) renders ALL collections (minus 'all') as a
      sunken-tone text list — the section the owner wants removed.
    - JSON-LD ItemList (lines 130-147) is built from directoryCollections.
    - No contact section anywhere on the page.
  implication: grid must become the full alphabetical set with 'All' first; directory section, menu
    sourcing, and the 8-card cap all go away.

- timestamp: 2026-06-10
  checked: src/lib/shopify/operations/collection.ts
  found: getCollectionSummaries() already paginates the full collection list (250/page) with
    title/description/featuredImage — sufficient to drive the full card grid. No new operation
    needed. getCollectionMenuSummaries + SHOPIFY_COLLECTIONS_INDEX_MENU_HANDLE become unused by
    this page after the change.
  implication: data layer needs no changes.

- timestamp: 2026-06-10
  checked: production https://www.teavision.com.au/collections (fetched HTML, main card grid block)
  found: 119 cards, alphabetical by display title, "All" first. Full list in section below.
    Production page ALSO ends with the "Need help? / Speak with our Ingredients Experts Today."
    contact section — so item 4 is production parity too.
  implication: sorting collections (including 'all') by title with localeCompare reproduces the
    production order; no hardcoded order list required. Only 'frontpage' is absent from production
    (keep filtering it).

- timestamp: 2026-06-10
  checked: src/components/homepage/contact/contact.tsx + src/components/homepage/contact-form/contact-form.tsx
  found: |
    - Contact ({ action }) is presentation-only: Section.Root tone="inverse", eyebrow, heading
      "Speak with our ingredients experts.", phone/email methods, card wrapping
      HomepageContactForm. No homepage-specific data fetching; only dependency is the
      `action: (formData) => Promise<ContactActionResult>` prop.
    - Homepage wires it as <Contact action={submitContactFormAction} /> in
      src/app/(storefront)/page.tsx (action from '@/lib/contact/actions').
    - HomepageContactForm is a 'use client' leaf (name/phone/email/message + honeypot) — distinct
      from the EXISTING src/components/contact/contact-form (ContactForm), which is a
      self-headed "Start an enquiry" form used by /pages/contact and /pages/wholesale.
    - Contact section has hardcoded id="need-help" and homepage-flavoured eyebrow copy; ids
      `contact-name` etc. in HomepageContactForm are fine as long as the section appears once
      per page.
  implication: component is reusable as-is, but lives in the homepage domain. Per
    docs/conventions.md, cross-domain reusable contact UI belongs in src/components/contact/.
    Reusing it on /collections requires either (a) moving Contact + HomepageContactForm into
    src/components/contact/ (rename, update barrels/stories/imports), or (b) importing from
    '@/components/homepage' on a collections route — a conventions violation.

- timestamp: 2026-06-10
  checked: src/app/(storefront)/collections/_components/collection-card-image.tsx
  found: renders a bg-paper-2 placeholder block when featuredImage (or width/height) is missing.
  implication: the "All" collection card (and any image-less collections, now that the
    images-required heuristic is gone) degrades gracefully — no new image handling needed,
    though a nicer "All" tile treatment is a design option.

## Production card grid order (119 cards, in document order)

| # | Title | Handle |
|---|-------|--------|
| 1 | All | all |
| 2 | Aniseed Tea | aniseed-tea |
| 3 | Australian Certified Organic Tea | australian-certified-organic-tea |
| 4 | Australian Native Ingredients | australian-native-ingredients |
| 5 | Australian Teas | australian-tea |
| 6 | Black Peppercorn | black-peppercorn |
| 7 | Black Teas | black-tea |
| 8 | Blooming Tea | blooming-tea |
| 9 | Bulk Tea Bags | bulk-tea-bags |
| 10 | Burdock Root | burdock-root |
| 11 | Calendula Tea, Petal & Flowers | calendula-flowers-petals-tea |
| 12 | Cardamom Pods | cardamom-pods |
| 13 | Cardamom Powder | cardamom-powder |
| 14 | Ceylon Tea | ceylon-tea |
| 15 | Chai 7 Spice | chai-7-spice |
| 16 | Chai Tea, Loose leaf & Instant | chai |
| 17 | Chamomile | chamomile |
| 18 | Chinese Tea | chinese-tea |
| 19 | Cinnamon Cassia | cinnamon-cassia |
| 20 | Cinnamon chips | cinnamon-chips |
| 21 | Cinnamon Powders | wholesale-cinnamon |
| 22 | Cloves | cloves |
| 23 | Cocktail & Iced Tea Blends | dessert-cocktail-inspired-blends |
| 24 | Cocoa Shells Tea | cocoa-tea-shells |
| 25 | Complexion Tea | complexion-tea |
| 26 | CTC Black Tea | ctc-black-tea |
| 27 | Damiana Tea | damiana-tea |
| 28 | Dandelion root roasted | dandelion-root |
| 29 | Dandelion Tea | dandelion-leaf-tea |
| 30 | Darjeeling Tea | darjeeling-tea |
| 31 | Detox Tea | wholesale-detox-tea |
| 32 | Dried Herbs | dried-herbs |
| 33 | Echinacea | echinacea |
| 34 | Elderberries | elderberries |
| 35 | English Breakfast Tea | english-breakfast-tea |
| 36 | Genmaicha Tea | genmaicha-tea |
| 37 | Ginger | ginger |
| 38 | Ginger Tea Bags | ginger-tea-bags |
| 39 | Ginkgo Biloba Tea | ginkgo-biloba-tea |
| 40 | Ginseng | ginseng-tea |
| 41 | Green Tea | green-tea |
| 42 | Herbal Tea | herbal-tea |
| 43 | Hibiscus Flowers | organic-hibiscus |
| 44 | Hibiscus Tea | hibiscus-tea |
| 45 | Iced Tea Blends | wholesale-bulk-ice-tea-blends |
| 46 | Japanese Matcha Tea | japanese-matcha |
| 47 | Japanese Sencha Tea | japanese-sencha-tea |
| 48 | Japanese Tea | japanese-green-tea |
| 49 | Jasmine Tea | jasmine-tea |
| 50 | Keemun Tea | keemun-tea |
| 51 | Lapsang Souchong | lapsang-souchong |
| 52 | Lavender | lavender |
| 53 | Lemon Myrtle Tea | lemon-myrtle-tea |
| 54 | Lemon Verbena Tea | lemon-verbena-tea |
| 55 | Lemongrass & Ginger Tea | lemongrass-ginger-tea |
| 56 | Licorice & Mint | licorice-mint |
| 57 | Licorice Root Teas | licorice-root-tea |
| 58 | Longjing Tea | longjing-tea |
| 59 | Loose Leaf Tea | loose-leaf-tea |
| 60 | Marshmallow root | marshmallow-root |
| 61 | Matcha Tea | matcha-tea |
| 62 | Moringa Leaves & Teas | moringa-leaves |
| 63 | Most Popular Tea Blends | clearance-discounted-products |
| 64 | Mushroom Powder Australia | mushroom-powder-australia |
| 65 | Nettle Leaf | nettle-leaf-tea |
| 66 | Olive Leaf Wholesale | olive-leaf |
| 67 | Oolong Tea | oolong-tea-wholesale |
| 68 | Organic Black Assam Tea | organic-black-assam-tea |
| 69 | Organic Body & Colon Cleanse | organic-body-colon-cleanse |
| 70 | Organic Cold & Flu | organic-cold-flu |
| 71 | Organic Digestive Tea | digestive-tea |
| 72 | Organic Earl Grey | organic-earl-grey |
| 73 | Organic Honeybush | organic-honeybush |
| 74 | Organic Lemon Balm | organic-lemon-balm |
| 75 | Organic Lemongrass | organic-lemongrass |
| 76 | Organic Probiotic Tea | organic-probiotic-tea |
| 77 | Organic Relax & Rejuvenate Tea | organic-relax-rejuvenate-tea |
| 78 | Organic Rooibos | organic-rooibos-tea |
| 79 | Organic Tea | organic-tea |
| 80 | Organic Turmeric Powder | organic-turmeric-powder |
| 81 | Passionflower | passionflower |
| 82 | Pekoe Tea | pekoe-tea |
| 83 | Peppermint Tea | peppermint-tea |
| 84 | Premium Tea Australia | premium-tea-australia |
| 85 | Products On Sale - Up to 70% Off | sale |
| 86 | Pu-erh tea | pu-erh-tea |
| 87 | Raspberry Leaf | raspberry-leaf |
| 88 | Relaxing Tea Australia | relaxing-tea-australia |
| 89 | Rose Buds | rose-buds |
| 90 | Rose Tea | rose-bud-tea |
| 91 | Siberian Ginseng | siberian-ginseng |
| 92 | Silver Needle | silver-needle |
| 93 | Skullcap | skullcap |
| 94 | Sleep Teas | organic-sleepy-tea |
| 95 | Spearmint | spearmint-tea |
| 96 | Speciality Tea | speciality-tea |
| 97 | Star Anise | star-anise |
| 98 | Sticky Chai | sticky-chai |
| 99 | Superfood Extract Powders, Proteins, Supplements | superfood-extract-powders-proteins-supplements |
| 100 | Tea Blends | custom-tea-blend |
| 101 | Tea Masters Selection - (World's Best Teas) | tea-masters-selection-worlds-best-teas |
| 102 | Tea Samples | tea-samples |
| 103 | Tea Wholesale Adelaide | tea-wholesale-adelaide |
| 104 | Tea Wholesale Melbourne | tea-wholesale-melbourne |
| 105 | Tea Wholesale Perth | tea-wholesale-perth |
| 106 | Tea Wholesale Sydney | tea-wholesale-sydney |
| 107 | The Best Australian Herbal Store | australian-herbal-store |
| 108 | Thyme | thyme |
| 109 | Tulsi Tea | tulsi-tea |
| 110 | Turmeric Chai | turmeric-chai |
| 111 | Turmeric Tea | turmeric-tea |
| 112 | Vervain | vervain |
| 113 | Wellness & Functional Tea | wellness-functional-tea |
| 114 | White Peony Tea | white-peony |
| 115 | White Tea | white-tea |
| 116 | Wholesale Cafe Range | cafe-range |
| 117 | Wholesale Herbs & Spices | herbs-and-spices |
| 118 | Wholesale Tea | wholesale-bulk-tea |
| 119 | Yerba Mate | yerba-mate-tea |

Order = alphabetical by display title (locale, case-insensitive), with "All" first because "All"
sorts before "Aniseed". The existing `sortByTitle` (localeCompare) reproduces this exactly — the
implementation does NOT need a hardcoded list; sort `getCollectionSummaries()` minus 'frontpage'
by title and the order matches (spot-checked: "Chai 7 Spice" < "Chai Tea…", "Cinnamon Cassia" <
"Cinnamon chips" < "Cinnamon Powders"). Note: the live Shopify catalog is the source of truth;
the item SET will track whatever collections are published, which is the desired behavior.

## Resolution

root_cause: |
  src/app/(storefront)/collections/page.tsx was built as "8 featured menu tiles + full text
  directory" instead of production's single full card grid. Specifically:
  (1) directory list section exists (lines 262-300) — owner wants it gone;
  (2) card grid is menu-driven and capped at 8, and isPublicCollection() excludes the 'all'
      handle — production shows ALL published collections alphabetically with "All" first;
  (3) no contact section at page bottom — production /collections ends with the
      "Need help? Speak with our Ingredients Experts Today." section, which exists in the
      codebase only as the homepage-domain Contact component.
fix: not applied (goal: find_root_cause_only). Direction:
  - page.tsx: drop directory section; render one grid from
    getCollectionSummaries().filter(handle !== 'frontpage').sort(sortByTitle) — 'all' included,
    sorting naturally first; delete getFeatured/getFallbackFeatured/mergeFeaturedCollections/
    isPublicCollection/FEATURED_COLLECTION_LIMIT and the getCollectionMenuSummaries +
    SHOPIFY_COLLECTIONS_INDEX_MENU_HANDLE imports; rebuild JSON-LD ItemList from the grid list.
  - Move Contact + HomepageContactForm from src/components/homepage/ to src/components/contact/
    (e.g. contact-section/ + rename HomepageContactForm), update barrels, stories, and the
    homepage import; then render <Contact action={submitContactFormAction} /> at the bottom of
    the collections page.
verification: ""
files_changed: []
