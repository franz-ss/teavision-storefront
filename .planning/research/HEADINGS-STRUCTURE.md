# Research: Semantic Heading Hierarchy for Product/Collection SEO (Phase 26)

**Researched:** 2026-07-10
**Mode:** Project research (feasibility + exact-edit trace)
**Confidence:** HIGH for the code trace (read directly from source); MEDIUM-HIGH for accessibility guidance (cross-checked two specialist sources); HIGH for general SEO heading consensus (multiple 2026 sources agree).

---

## Heading Hierarchy Best Practice

Practical, non-dogmatic consensus for PDP/PLP pages (confirmed across multiple current SEO sources):

- **Exactly one `<h1>` per page.** On the PDP it's the product title (`products/[handle]/page.tsx:317`); on the PLP it's the collection title, rendered by whichever of `Hero` / `CollectionRichHero` is active (both confirmed as the only `<h1>` sources on the collection route — mutually exclusive via the `richHero ? ... : ...` branch in `page-content.tsx:251-260`).
- **No skipped levels** (H2 → H4 with no H3 in between is the classic mistake). This applies *within a semantic branch* of the DOM, not globally as a strict monotonic counter across the whole page — e.g. it's fine to have several independent H2 sections each starting their own H3 subtree.
- **Multiple H2/H3 elements are normal and expected** — a PDP legitimately has H2s for "Reviews", accordion/spec titles, and any promoted rich-text subheadings; a PLP has H2s for filter groups, story/read-more content, etc. This is not a "multiple H1" problem; only H1 must stay singular.
- Google has explicitly said heading count/hierarchy is not a hard ranking factor, but it remains a best practice for (a) accessibility navigation (screen-reader users jump by heading level), and (b) 2026-era AI/answer-engine extraction, which leans on heading structure as a content-organization signal.
- Collapsed accordion content (native `<details>`) is fully indexed by Google — putting real headings inside a closed disclosure is not an SEO liability.

Confidence: HIGH — consistent across ecomseo.co, Lawrence Hitches, Conductor, and other 2026-dated sources found via search.

---

## Accordion Title as H2 (markup)

**Question: is `<h2>` (or any heading) inside `<summary>` valid and accessible?**

- **HTML validity:** Yes. The WHATWG content model for `<summary>` permits phrasing content optionally intermixed with heading content as the first child — this was formalized in the HTML spec around 2022 specifically so accordion titles could be real headings. It's valid, not a hack.
- **Accessibility reality (verified via scottohara.me and Hassell Inclusion, the two most-cited specialist sources on this exact pattern):**
  - Support is real but was historically inconsistent (`<summary>` maps to an implicit `button`/`summary` role, and button semantics traditionally treat children as presentational). As of current NVDA/VoiceOver/Chromium/Firefox/Safari combinations, a heading nested directly in `<summary>` (no extra `role="button"` override) **is announced with its heading role/level and is discoverable via screen-reader heading navigation** — this is the whole point of the pattern and is the recommended approach specifically because it lets AT users jump to accordion sections by heading level.
  - Caveat from Hassell Inclusion: when a heading is used inside `<summary>`, it should be styled `display: inline` (or effectively block-ified only by a flex/grid container) so the browser's native disclosure marker doesn't visually misalign with it.
  - **This codebase's caveat doesn't apply as-is**: both `<summary>` instances already use `marker:hidden`/`list-none` + `flex` + a custom `ChevronDown` icon instead of the native triangle. A flex item is blockified regardless of its own `display` value, so no native-marker misalignment risk exists here — but the heading must not carry its own vertical margin (Tailwind Preflight already zeroes heading margin, so this is safe by default; don't add `my-*` to the new heading).
  - Do **not** add `aria-expanded` or other ARIA to the heading/summary — native `<details>`/`<summary>` already exposes expanded/collapsed state to AT automatically. Adding manual ARIA on top of the native semantics is redundant and a known way to break it (this is exactly the failure mode Hassell/scottohara warn about: layering ARIA roles onto `<summary>` strips the accessible name/state mapping).

### Recommended markup for the product spec disclosure title

Current (`src/app/(storefront)/products/[handle]/page.tsx:359-370`):
```tsx
<details key={item.title} className="group border-hairline border-t last:border-b" open={index === 0}>
  <summary className="font-display text-ink flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[1.15rem] leading-tight marker:hidden">
    {item.title}
    <ChevronDown aria-hidden="true" className="text-brand size-4 transition-transform group-open:rotate-180" />
  </summary>
  ...
```

Recommended:
```tsx
<details key={item.title} className="group border-hairline border-t last:border-b" open={index === 0}>
  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 marker:hidden">
    <h2 className="font-display text-ink text-[1.15rem] leading-tight">
      {item.title}
    </h2>
    <ChevronDown aria-hidden="true" className="text-brand size-4 shrink-0 transition-transform group-open:rotate-180" />
  </summary>
  ...
```
- Move the *typographic* classes (`font-display text-ink text-[1.15rem] leading-tight`) off `<summary>` and onto the new `<h2>`; keep the *layout* classes (`flex cursor-pointer list-none items-center justify-between gap-5 py-5 marker:hidden`) on `<summary>`.
- Add `shrink-0` to `ChevronDown` so a long title can't compress the icon (minor robustness fix, not required for the SEO ask but cheap to include alongside).
- No `id`/`aria-*` additions needed — native semantics carry the expand/collapse state; the heading adds discoverability on top for free.

**Not in scope but worth a one-line flag for the roadmapper:** `StoryDisclosure`'s own title prop (`Read more about ${collection.title}`, rendered as a plain `<span>` in `src/components/collection/story-disclosure/story-disclosure.tsx:29-31`) has the identical "plain text in summary" shape as the product spec titles, but the milestone context only asked for (a) product spec titles and (b) the *inner* rich-text headings of the story content — it did not ask to change the story-disclosure's own title. Flagging for awareness only; do not change it under this phase unless the roadmapper explicitly pulls it in.

---

## Collection Story Variant Trace + Exact Edit

**Traced end-to-end, not guessed.** There are two distinct, similarly-named "variant" concepts in this codebase and they do **not** correspond 1:1 — this is the trap:

1. `ShopifyHtmlVariant` (private type, `src/lib/shopify/html-content.ts:12`) — `'page' | 'article' | 'compact'`. This governs **sanitization + heading-tag transforms + class maps** and runs once, server-side, *before* any HTML reaches a component.
2. `RichTextVariant` (`src/components/ui/rich-text/rich-text.tsx:14`) — `'page' | 'article' | 'compact' | 'disclosure'`. This governs **only the outer wrapper `<div>`'s Tailwind spacing classes** (`RICH_TEXT_VARIANT_CLASS_NAMES`, rich-text.tsx:21-26) at render time. It has zero effect on the HTML string itself — the HTML is already fully sanitized and heading-transformed by the time `RichText` receives it via `dangerouslySetInnerHTML`.

### Full trace of the collection story path

1. `src/app/(storefront)/collections/[handle]/_components/page-content.tsx:219-221`:
   ```ts
   const richDescriptionHtml = normalizeHtml(collection.descriptionHtml)
   const sanitizedRichDescriptionHtml = sanitizeShopifyCompactHtml(richDescriptionHtml)
   ```
   This calls the exported wrapper `sanitizeShopifyCompactHtml` (`html-content.ts:374-376`), which calls the internal `sanitizeShopifyHtml(html, 'compact')` — the `ShopifyHtmlVariant` here is `'compact'`.

2. The sanitized+transformed HTML is passed straight through as a prop:
   ```tsx
   <StoryDisclosure title={`Read more about ${collection.title}`} html={sanitizedRichDescriptionHtml} />
   ```
   (`page-content.tsx:305-308`)

3. `StoryDisclosure` (`story-disclosure.tsx:38`) does:
   ```tsx
   <RichText html={html} variant="disclosure" />
   ```
   `variant="disclosure"` here is a `RichTextVariant` — it only picks `type-body-sm space-y-4` for the wrapper `<div>` className. It does **not** re-sanitize or re-transform headings. The `html` string arriving here already has its final tag names and classes baked in from step 1.

4. **Confirmed by grep**: `sanitizeShopifyCompactHtml` has exactly two production call sites — `products/[handle]/page.tsx:141` (product description) and `collections/[handle]/_components/page-content.tsx:221` (collection story) — plus one unit test (`html-content.test.ts`). **These two features currently share the identical `'compact'` `ShopifyHtmlVariant`**, including its heading-transform map:
   ```ts
   // html-content.ts:192-199
   const SHOPIFY_HTML_HEADING_TRANSFORMS = {
     article: { h1: 'h2' },
     compact: { h1: 'h3', h2: 'h3' },   // <- shared by product description AND collection story today
     page: { h1: 'h2' },
   }
   ```
   and class map (`html-content.ts:159-178`), where source `h3` → `type-heading-05 text-ink mt-5` and source `h4` → `type-label text-ink mt-5` pass through unmapped (no entry in the heading-transform record for `h3`/`h4`, so `transformWithClass` just re-styles them in place).

**Conclusion: directly editing the `compact` entries would change the product description too.** They must not be touched. The fix requires a *new* `ShopifyHtmlVariant` scoped to the collection story only.

### Exact edit plan (new variant, zero product-description blast radius)

All edits in `src/lib/shopify/html-content.ts` unless noted:

1. **Line 12** — widen the private type:
   ```ts
   type ShopifyHtmlVariant = 'page' | 'article' | 'compact' | 'collectionStory'
   ```

2. **After line 178** (inside `SHOPIFY_HTML_CLASS_NAMES`) — add a `collectionStory` entry. Reuse every non-heading value verbatim from `compact` (blockquote, caption, figcaption, figure, hr, img, li, ol, p, table, td, th, ul), but shift the heading-target classes down one so the *visual* size stays what it was pre-promotion (the ask is a semantic-level change, not a restyle):
   ```ts
   collectionStory: {
     ...compact's non-heading values unchanged...
     h2: 'type-heading-05 text-ink mt-5', // was compact's h3 style — now the promoted-h3 target
     h3: 'type-label text-ink mt-5',       // was compact's h4 style — now the promoted-h4 target
     h4: 'type-label text-ink mt-4',       // fallback for a literal h4 that slips through undetected (rare) — reuse compact's h5 value so it doesn't jump straight to h3's size
     h5: 'type-label text-ink mt-4',
     h6: 'type-label text-ink mt-4',
   },
   ```
   Implementation note: `SHOPIFY_HTML_CLASS_NAMES` is one object literal, so `compact`'s own values can't be referenced from inside the same literal (self-reference during initialization). Either (a) duplicate the ~11 non-heading property values into the new entry (lowest-risk, matches how `page`/`article`/`compact` are already fully duplicated against each other in this file — this file already accepts that duplication pattern), or (b) extract a shared base object above the literal and spread it into all four variants. (a) is the lower-blast-radius choice for this phase; (b) is a nice-to-have refactor, not required to satisfy the ask.

3. **Line 195-199** (`SHOPIFY_HTML_HEADING_TRANSFORMS`) — add:
   ```ts
   collectionStory: { h1: 'h3', h2: 'h3', h3: 'h2', h4: 'h3' },
   ```
   Keep the `h1`/`h2` → `h3` demotion identical to `compact`'s existing policy (defensive parity — if a merchant ever pastes an H1/H2 into the collection description, it doesn't create a second page H1/H2). Add `h3: 'h2'` and `h4: 'h3'` to satisfy the ask exactly as specified.

4. **After line 376** — add a fourth exported wrapper, mirroring the existing three:
   ```ts
   export function sanitizeShopifyCollectionStoryHtml(html: string): SanitizedHtml {
     return sanitizeShopifyHtml(html, 'collectionStory')
   }
   ```

5. **`src/app/(storefront)/collections/[handle]/_components/page-content.tsx`** — swap the import (line 7) and call site (line 220-221) from `sanitizeShopifyCompactHtml` to `sanitizeShopifyCollectionStoryHtml`. This is the only call-site change needed; `StoryDisclosure`/`RichText` need no code change since `variant="disclosure"` already only controls spacing and is orthogonal to this fix.

6. **Test** — extend `src/lib/shopify/html-content.test.ts` with a new `describe('sanitizeShopifyCollectionStoryHtml', ...)` block asserting `h3` → `<h2 class="type-heading-05 text-ink mt-5">` and `h4` → `<h3 class="type-label text-ink mt-5">`, and leave the existing `sanitizeShopifyCompactHtml` test untouched as the regression guard proving the product description path is unaffected.

7. **Storybook fixture drift** — `src/components/collection/story-disclosure/story-disclosure.stories.tsx:7-18` fakes `SanitizedHtml` via an unchecked cast and hardcodes raw `<h3>Buying notes</h3>` with no class attribute at all (it bypasses the real sanitizer entirely). After this change, that fixture will not reflect real production output (which will render as a classed `<h2>`). Recommend updating the story's `storyHtml` to `<h2 class="type-heading-05 text-ink mt-5">Buying notes</h2>` (or route it through the real `sanitizeShopifyCollectionStoryHtml` at story-build time) so Storybook stays an accurate documentation surface.

---

## Shared-Map Blast Radius

| Variant / function | Consumers (verified by grep) | Touched by this change? |
|---|---|---|
| `'page'` / `sanitizeShopifyPageBodyHtml` | Static Shopify page bodies (e.g. `/pages/*`) | No — separate heading map (`{ h1: 'h2' }`), separate class map. Untouched. |
| `'article'` / `sanitizeShopifyArticleHtml` | Blog article + comment content (`blogs/[blog]/[article]/page.tsx`) | No — separate heading map (`{ h1: 'h2' }`), separate class map. Untouched. |
| `'compact'` / `sanitizeShopifyCompactHtml` | Product description (`products/[handle]/page.tsx:141`) **only**, after the collection-story call site is moved off it | Left byte-for-byte unchanged. The existing unit test for it is the regression guard. |
| `'collectionStory'` (new) / `sanitizeShopifyCollectionStoryHtml` (new) | Collection story/read-more (`page-content.tsx`) | New, isolated. |
| `RichTextVariant.disclosure` | `StoryDisclosure` wrapper div spacing only | Unrelated axis — no change needed, but flagged because its name ("disclosure") invites confusion with the `ShopifyHtmlVariant` axis; a less-careful implementer might try to add a `disclosure` entry to `ShopifyHtmlVariant`/`SHOPIFY_HTML_CLASS_NAMES` instead of the correct `collectionStory` entry. Don't conflate the two enums. |

**One genuine (but benign) cross-variant surface:** `SHOPIFY_HTML_ALLOWED_CLASSES` (`html-content.ts:204-216`) flattens `Object.values(SHOPIFY_HTML_CLASS_NAMES)` into one global allow-list, and `buildAllowedClasses()` (line 282-291) applies that same merged list to every tag across every variant — the allow-list is not namespaced per variant. Adding new class strings for `collectionStory` will widen what `sanitize-html` *permits* to pass through on `page`/`article`/`compact` too (in the unlikely event Shopify source HTML manually authored one of those exact class strings), even though those variants' own `transformTags` will never *emit* them. This is a one-directional, low-risk widening, not a rendering change — call it out in the PR description but it does not block the approach. If reusing `compact`'s exact class strings (as recommended above) rather than inventing new ones, this surface doesn't even grow, since those strings are already in the allow-list today.

---

## Pitfalls

1. **Multiple H1s** — not a risk here. Both product and collection routes have exactly one `<h1>` source, confirmed by grep, and neither of the two Phase 26 asks touches an H1.
2. **Skipped heading levels** — check after the fix: PDP will have H1 (title) → H2 (Reviews, and now the 3 spec-disclosure titles) with no H3 under them (spec content is a table/paragraph, not headed) — fine, no skip. Collection page will have H1 (collection title) → H2 (filter panel label, and now the promoted former-H3 story subheadings) → H3 (promoted former-H4) — verify actual Shopify-authored collection body copy doesn't also contain a literal `h5`/`h6` that would now sit two levels below a promoted H3 without an intervening H4 (the `collectionStory` class map above keeps `h4` mapped for defensive coverage even though the transform routes real h4 source to h3 — a literal h4 shouldn't exist post-transform, but any stray h5/h6 in source content passes through untouched and now nests directly under the promoted H2/H3, which is exactly what a legitimately-authored H3→H4→H5 chain looks like post-promotion, so no new skip is introduced as long as the source content's own internal hierarchy was consistent to begin with).
3. **Breaking shared class maps** — the single biggest risk in this task; addressed above by adding a fourth `ShopifyHtmlVariant` rather than editing `compact` in place. Do not take the shortcut of mutating `compact`'s heading map even "just for this ticket" — it is actively shared with the product description today.
4. **Structured-data/heading mismatch** — `productJsonLd` (`products/[handle]/page.tsx:181-203`) and the collection page's `JsonLd` component describe `name`/`description`/offers, not heading structure, so there's no JSON-LD field that encodes "this text is an H2" — no structured-data update is required for either ask. (If a future FAQ-style JSON-LD `Question`/`answer` schema is ever added to these disclosures, that would need its own heading-text ↔ schema-text parity check, but that's out of scope today.)
5. **`<summary>` + heading anti-pattern to avoid**: do not add `role="button"` or other ARIA roles to `<summary>` or the nested heading — both specialist sources agree this is what breaks the heading-role exposure in some AT/browser combinations. Rely on native `<details>`/`<summary>` semantics only.
6. **Storybook drift** (see item 7 above) — the `story-disclosure.stories.tsx` fixture bypasses the real sanitizer, so it silently stops representing production output unless updated alongside the code change.

---

## Files/Lines to Change

| File | Lines | Change |
|---|---|---|
| `src/app/(storefront)/products/[handle]/page.tsx` | 359-370 | Wrap `{item.title}` in `<h2>`; move typographic classes from `<summary>` to the new `<h2>`; add `shrink-0` to `ChevronDown`. |
| `src/lib/shopify/html-content.ts` | 12 | Add `'collectionStory'` to `ShopifyHtmlVariant`. |
| `src/lib/shopify/html-content.ts` | ~178 (after `compact` entry) | Add `collectionStory` entry to `SHOPIFY_HTML_CLASS_NAMES` with shifted heading classes (h2←old-h3-style, h3←old-h4-style). |
| `src/lib/shopify/html-content.ts` | 195-199 | Add `collectionStory: { h1: 'h3', h2: 'h3', h3: 'h2', h4: 'h3' }` to `SHOPIFY_HTML_HEADING_TRANSFORMS`. Do not modify the existing `compact` entry. |
| `src/lib/shopify/html-content.ts` | after 376 | Add `export function sanitizeShopifyCollectionStoryHtml(html: string): SanitizedHtml`. |
| `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` | 7, 220-221 | Swap `sanitizeShopifyCompactHtml` → `sanitizeShopifyCollectionStoryHtml`. |
| `src/lib/shopify/html-content.test.ts` | new block | Add coverage for `sanitizeShopifyCollectionStoryHtml` h3→h2/h4→h3; leave existing `sanitizeShopifyCompactHtml` test untouched as regression guard. |
| `src/components/collection/story-disclosure/story-disclosure.stories.tsx` | 11-18 | Update the hardcoded fixture HTML to match real post-transform output (classed `<h2>` instead of bare `<h3>`), or route it through the real sanitizer. |

**Not touched (explicitly verified out of blast radius):** `sanitizeShopifyPageBodyHtml`/`'page'` variant, `sanitizeShopifyArticleHtml`/`'article'` variant, `RichText`'s `RichTextVariant` type/spacing classes, `StoryDisclosure`'s own title (`<span>`, unchanged), and every existing `compact`-variant consumer other than the collection story call site (i.e., the product description keeps rendering exactly as it does today).

---

## Sources

- [WHATWG HTML — Allow headings in `<summary>` elements for `<details>` (issue #8864)](https://github.com/whatwg/html/issues/8864) — MEDIUM (community/spec discussion, confirms content-model validity and known inconsistency history)
- [scottohara.me — The details and summary elements, again (2022)](https://www.scottohara.me/blog/2022/09/12/details-summary.html) — MEDIUM-HIGH (specialist accessibility source, cross-browser AT testing)
- [Hassell Inclusion — Accessible accordions part 2, using details/summary](https://hassellinclusion.com/blog/accessible-accordions-part-2-using-details-summary/) — MEDIUM-HIGH (specialist accessibility source, includes the `display: inline` caveat)
- [ecomseo.co — Heading Structure for Ecommerce](https://ecomseo.co/academy/heading-structure-for-ecommerce) — MEDIUM (single-source SEO guidance, consistent with general consensus)
- [Lawrence Hitches — Header Tags for SEO: H1-H6 Best Practices in 2026](https://www.lawrencehitches.com/header-tags/) — MEDIUM
- [Conductor — How to Optimize H1–H6 Headings for SEO, AEO, and Visibility](https://www.conductor.com/academy/headings/) — MEDIUM
- Direct source reads (HIGH confidence, primary evidence): `src/lib/shopify/html-content.ts`, `src/lib/shopify/html-content.test.ts`, `src/components/ui/rich-text/rich-text.tsx`, `src/components/collection/story-disclosure/story-disclosure.tsx`, `src/components/collection/story-disclosure/story-disclosure.stories.tsx`, `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`, `src/app/(storefront)/products/[handle]/page.tsx`.
