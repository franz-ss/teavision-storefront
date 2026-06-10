---
status: diagnosed
trigger: "Phase 11 UAT test 9 — collection page parity audit: hero banner logic regression, product card missing elements (star rating), grid spacing"
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED (all three sub-issues diagnosed via static analysis)
test: n/a — diagnosis complete
expecting: n/a
next_action: return ROOT CAUSE FOUND to orchestrator (goal: find_root_cause_only)

## Symptoms

expected: |
  1. Collections that have a full-art banner (e.g. "Tea Masters Selection" ~1216x530 artwork)
     show that banner at full opacity, with a "Read More About {collection}" disclosure,
     like the original Liquid site. Collections without banner art get the redesigned
     green-band hero.
  2. Product cards match the .pcard design spec, including star ratings (user-named).
  3. Product grid gaps match the design spec.
actual: |
  1. Every collection gets a generic green band with the collection image at 35% opacity;
     banner-art collections additionally have their title hidden (sr-only) via hardcoded
     handle lists, leaving a washed-out, near-empty band.
  2. Product card omits star rating (and several other design-card elements).
  3. Grid uses 22px/18px gaps at all breakpoints.
errors: none (visual/behavioral parity regression)
reproduction: visit /collections/tea-masters-selection-worlds-best-teas (banner case) and any other collection (non-banner case); compare with live site and design/extracted-design.html
started: introduced during Phase 11 collection redesign

## Eliminated

- hypothesis: "The banner field is collection.image (Shopify Collection.image)"
  evidence: |
    Active template is templates/collection.liquid which renders ONLY
    {% section "collection-list" %}. sections/collection-list.liquid:12-28 never renders
    collection.image — it renders {{ collection.description }} in a .rte div. The
    <img src="{{ collection | img_url: '1400x' }}"> usage exists only in INACTIVE section
    variants (sections/collection.liquid:29-31, sections/org-collection-list.liquid:12-14)
    and JSON-LD (snippets/schema-collection.liquid:53). The banner artwork lives INSIDE
    collection.descriptionHtml as an <img> tag.
  timestamp: 2026-06-10

- hypothesis: "StoryDisclosure was dropped from the page"
  evidence: |
    page-content.tsx:167-174 still renders <StoryDisclosure title="Read more about {title}">
    when hasRichDescription — it is passed as Hero's belowHeroImage slot and rendered
    inside the green band (hero.tsx:71), above the title block. Not dropped; repositioned.
  timestamp: 2026-06-10

- hypothesis: "Desktop grid gaps are wrong"
  evidence: |
    Design .coll__grid (extracted-design.html:1177) = repeat(3,1fr); gap: 22px 18px.
    Current gap-y-5.5 gap-x-4.5 = 22px row / 18px column. Desktop matches exactly.
    Only the <=620px mobile tightening (16px 12px, line 1260) is missing.
  timestamp: 2026-06-10

- hypothesis: "Rating data is unavailable for collection products"
  evidence: |
    src/lib/shopify/queries/collection.graphql:98-104 queries
    metafield(namespace: "reviews", key: "rating") and key: "rating_count" on collection
    product nodes. operations/collection.ts:124-142 (reshapeProductSummary) maps them via
    parseProductRating (operations/mappers.ts:36-63) onto CollectionProductSummary.rating /
    .reviewCount. Data is fetched and mapped — the card just never renders it.
  timestamp: 2026-06-10

## Evidence

- timestamp: 2026-06-10
  checked: d:/Work/teavision/teavision-theme/templates/collection.liquid
  found: "Active template renders {% section \"collection-list\" %} only ({% section \"collection\" %} is commented out)"
  implication: sections/collection-list.liquid is the production collection template

- timestamp: 2026-06-10
  checked: d:/Work/teavision/teavision-theme/sections/collection-list.liquid:12-28
  found: |
    ORIGINAL HERO LOGIC:
      {% if collection.image or collection.description.size > 0 %}
        render {{ collection.description }} in <div class="rte"> (full width, full opacity;
        banner <img> is part of the description HTML)
      {% else %}
        render <h2>{{ collection.title }}</h2> (padding-bottom: 70px)
      {% endif %}
  implication: "'has banner' decision in production = collection.descriptionHtml contains an <img>; banner renders as full-opacity content, not background"

- timestamp: 2026-06-10
  checked: d:/Work/teavision/teavision-theme/layout/theme.liquid:270-283 + assets/style.css.liquid:8635 + sections/kk-home-content.liquid
  found: |
    READ-MORE MECHANISM: global jQuery — $('#show-more').click toggles #read-more and
    #show-more; #read-more {display:none;} by default. The "Read More About {collection}"
    anchor (<a id="show-more">) and hidden <div id="read-more"> long-story block are
    EMBEDDED in the collection description HTML by the merchant; theme JS toggles them.
  implication: original disclosure sits in the description flow directly below the banner art

- timestamp: 2026-06-10
  checked: src/app/(storefront)/collections/[handle]/_components/hero.tsx
  found: |
    Single unconditional treatment: Section.Root tone="brand" green band; heroImage rendered
    as absolute-fill background at className="object-cover opacity-35"; breadcrumb + eyebrow
    + h1 + description on top; belowHeroImage (StoryDisclosure) slot rendered INSIDE the
    band above the title (line 71). When showIntro=false, h1 becomes sr-only (line 93).
  implication: banner art is demoted to a washed 35% background; no full-art branch exists

- timestamp: 2026-06-10
  checked: src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts:53-75, 145-166, 566-584
  found: |
    getDescriptionHeroImage() ALREADY extracts the first <img> from descriptionHtml with
    src/alt/size parsing — the banner detection logic exists. getHeroImage() priority:
    description <img> -> HERO_IMAGE_OVERRIDES (2 hardcoded CDN URLs for
    tea-masters-selection-worlds-best-teas and australian-certified-organic-tea) ->
    featuredImage. HIDDEN_HERO_INTRO_HANDLES hides the visible h1/eyebrow/description for
    those same 2 handles; FORCED_RICH_DESCRIPTION_HANDLES forces the disclosure for one.
  implication: |
    the two banner collections were special-cased by hardcoded handle lists instead of a
    general "banner art exists -> banner hero" branch; their pages show an empty-looking
    green band (35% art, no visible title)

- timestamp: 2026-06-10
  checked: design/extracted-design.html:1146-1154 (.coll__hero)
  found: ".coll__hero = green-deep band, .ph background at opacity .35, eyebrow gold, h1 paper — the redesign band IS the intended DEFAULT treatment"
  implication: current Hero is correct for NO-banner collections; only the banner-art branch is missing

- timestamp: 2026-06-10
  checked: design/extracted/product-card-footer.js:4-31 + design/extracted-design.html:1127-1143 (.pcard spec)
  found: |
    DESIGN CARD ELEMENTS: (1) media aspect 1/1.12 radius-lg paper-2 bg, hover scale 1.06
    over .6s; (2) badges top-left 12px (organic pill w/ dot, gold award pill); (3) fav/save
    round button top-right, fades in on hover (.pcard__fav); (4) quick-add overlay bottom
    12px, opacity+translateY(10px) entrance, label "Add 250g · {price}"; (5) body eyebrow
    .pcard__origin = globe icon + "{origin} · {type}" mono 10.5px; (6) .pcard__name serif
    1.2rem; (7) .pcard__row = price bold + mono .unit (per-kg) LEFT, .pcard__grade mono
    green RIGHT. NO star rating in the design card — stars exist only on PDP (.pdp__rating
    :1195-1197).
  implication: see delta table below

- timestamp: 2026-06-10
  checked: src/components/collection/product-card/product-card.tsx vs .pcard spec
  found: |
    DELTA TABLE (design -> implemented):
    - media block / aspect / radius / hover scale: MATCH (scale duration 300ms vs 600ms — minor)
    - badges top-left: MATCH (offset 10px vs 12px — minor)
    - fav/save button: MISSING (likely intentional — no wishlist feature; confirm)
    - quick-add overlay: PRESENT (opacity-only, no translate-y entrance; always visible
      below lg — adaptation; label "Add to cart" vs "Add 250g · $X")
    - origin eyebrow: PARTIAL — renders productType only; no globe icon, no origin segment
    - name: MATCH (font-display 1.2rem leading-1.1)
    - price row: PARTIAL — price only; missing mono unit suffix and right-aligned
      .pcard__grade (mono green)
    - STAR RATING: MISSING — not in design .pcard, but present on the ORIGINAL site card
      (theme snippets/product-loop-list-new.liquid:283-285 renders SPR
      shopify-product-reviews-badge when show_spr; schema setting "Show Product reviews
      stars" default true) and explicitly requested by owner. Data already on
      CollectionProductSummary (rating/reviewCount). Drop-in precedent:
      recommendation-product-card.tsx:79-84 renders <StarRating rating count size="sm">.
      StarRating primitive exists at src/components/ui/star-rating/star-rating.tsx.
  implication: card needs StarRating row; origin/unit/grade/fav are design deltas to triage with owner

- timestamp: 2026-06-10
  checked: design/extracted-design.html:1177,1251-1263 vs product-list.tsx:34 and page-content.tsx:189
  found: |
    GRID: design = 3 cols 22px/18px desktop; 2 cols (same gap) <=980px; 2 cols 16px/12px
    <=620px. Current = grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5.5 (22px)
    gap-x-4.5 (18px) at ALL widths. Desktop gaps MATCH. Mobile (<620px) should tighten to
    gap 16px/12px (gap-y-4 gap-x-3). Column switch 3->2 at 980px vs lg=1024px (acceptable).
    sm:grid-cols-2 is redundant with grid-cols-2. Sidebar layout 252px/gap-40px matches
    (.coll__layout :1156 vs page-content.tsx:189).
  implication: only delta is missing mobile gap tightening

## Resolution

root_cause: |
  SUB-ISSUE 1 (hero): The original theme's active collection template
  (sections/collection-list.liquid via templates/collection.liquid) renders
  collection.description HTML full-width when non-empty — the banner artwork is an <img>
  INSIDE descriptionHtml, shown at 100% opacity, with a merchant-embedded
  <a id="show-more">Read More About {collection}</a> + hidden <div id="read-more"> toggled
  by theme jQuery. Collections without a description get a plain title heading. The
  redesign implemented only the design's default green-band hero (.coll__hero, image at
  35% opacity) for ALL collections and special-cased the two banner collections with
  hardcoded handle lists (HERO_IMAGE_OVERRIDES + HIDDEN_HERO_INTRO_HANDLES) that hide the
  title and demote the banner art to a washed background — no "banner-art hero" branch
  exists even though getDescriptionHeroImage() already detects description-embedded
  banners. StoryDisclosure still renders but inside the green band above the title, not
  below the banner.
  SUB-ISSUE 2 (card): ProductCard omits the star-rating row (rating/reviewCount are
  already queried via reviews.rating / reviews.rating_count metafields and mapped onto
  CollectionProductSummary; the StarRating primitive and a usage precedent in
  recommendation-product-card already exist). Lesser design deltas: origin eyebrow lacks
  globe icon + origin segment, price row lacks mono unit and right-aligned grade, fav
  button absent, quick-add lacks translate-y entrance.
  SUB-ISSUE 3 (grid): Desktop gaps match the design (22px/18px); the design's <=620px
  tightening to 16px/12px is not implemented — current grid uses 22px/18px at all widths.
fix: "" # find_root_cause_only — no fix applied
verification: ""
files_changed: []
