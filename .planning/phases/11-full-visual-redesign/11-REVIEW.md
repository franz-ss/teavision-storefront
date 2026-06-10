---
phase: 11-full-visual-redesign
reviewed: 2026-06-11T00:00:00Z
depth: standard
files_reviewed: 82
files_reviewed_list:
  - .env.example
  - scripts/component-contracts/button-system.test.mjs
  - src/app/(storefront)/blogs/[blog]/_components/blog-newsletter-band.tsx
  - src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx
  - src/app/(storefront)/cart/_components/cart-line-actions.tsx
  - src/app/(storefront)/cart/_components/cart-view.test.tsx
  - src/app/(storefront)/cart/_components/cart-view.tsx
  - src/app/(storefront)/cart/page.tsx
  - src/app/(storefront)/collections/[handle]/_components/hero.tsx
  - src/app/(storefront)/collections/[handle]/_components/page-content.tsx
  - src/app/(storefront)/collections/[handle]/_components/product-list.tsx
  - src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts
  - src/app/(storefront)/collections/[handle]/page.tsx
  - src/app/(storefront)/collections/page.tsx
  - src/app/(storefront)/page.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/banner-section.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/cta-section.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/faq-section.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/features-grid-3.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/hero-section.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/import-features-section.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/json-ld.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/logistics-section.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/process-section.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_components/why-choose-section.tsx
  - src/app/(storefront)/pages/bulk-wholesale-supply/_lib/data.ts
  - src/app/(storefront)/pages/bulk-wholesale-supply/page.tsx
  - src/app/(storefront)/products/[handle]/page.tsx
  - src/app/not-found.concept.stories.tsx
  - src/app/not-found.tsx
  - src/components/blog/article-results/article-results.tsx
  - src/components/blog/featured-articles/featured-articles.tsx
  - src/components/collection/product-card/product-card.stories.tsx
  - src/components/collection/product-card/product-card.tsx
  - src/components/contact/contact-section-form/contact-section-form.stories.tsx
  - src/components/contact/contact-section-form/contact-section-form.tsx
  - src/components/contact/contact-section-form/index.ts
  - src/components/contact/contact-section/contact-section.stories.tsx
  - src/components/contact/contact-section/contact-section.tsx
  - src/components/contact/contact-section/index.ts
  - src/components/contact/index.ts
  - src/components/homepage/certification-coverage/certification-coverage.tsx
  - src/components/homepage/contact-form/contact-form.tsx
  - src/components/homepage/contact/contact.tsx
  - src/components/homepage/content.ts
  - src/components/homepage/faq/faq.tsx
  - src/components/homepage/hero/hero.tsx
  - src/components/homepage/newsletter/newsletter-form.tsx
  - src/components/homepage/newsletter/newsletter.stories.tsx
  - src/components/homepage/newsletter/newsletter.tsx
  - src/components/homepage/overlay-image-card/overlay-image-card.tsx
  - src/components/homepage/private-label/private-label.tsx
  - src/components/homepage/product-range/product-range.tsx
  - src/components/homepage/proof-points/proof-points.tsx
  - src/components/homepage/testimonials/testimonials-slider.tsx
  - src/components/homepage/testimonials/testimonials.tsx
  - src/components/layout/footer/link-list/link-list.tsx
  - src/components/layout/footer/link/link-item.tsx
  - src/components/layout/footer/newsletter-column/newsletter-column.tsx
  - src/components/layout/footer/newsletter-form/newsletter-form.tsx
  - src/components/layout/footer/payment-mark/payment-mark.tsx
  - src/components/layout/footer/popular-searches/index.ts
  - src/components/layout/footer/popular-searches/popular-searches.tsx
  - src/components/layout/footer/quality-column/quality-column.tsx
  - src/components/layout/footer/view/view.tsx
  - src/components/layout/header/header.tsx
  - src/components/layout/header/mega-nav-styles.ts
  - src/components/layout/header/mega-nav.tsx
  - src/components/layout/header/mobile-mega-nav.tsx
  - src/components/layout/header/mobile-shop-panel.tsx
  - src/components/layout/header/search-form.tsx
  - src/components/layout/header/search-overlay-concept.stories.tsx
  - src/components/layout/header/search-overlay.tsx
  - src/components/product/bulk-savings/bulk-savings.tsx
  - src/components/product/product-form/product-form.tsx
  - src/components/product/product-gallery/product-gallery.tsx
  - src/components/search/search-results-view/search-results-view.tsx
  - src/components/ui/button/button.tsx
  - src/components/ui/price/price.tsx
  - src/components/ui/quantity-stepper/quantity-stepper.tsx
  - src/components/ui/toggle-button/toggle-button.tsx
  - src/lib/contact/actions.ts
findings:
  critical: 0
  warning: 10
  info: 12
  total: 22
status: issues_found
---

# Phase 11: Code Review Report

**Reviewed:** 2026-06-11
**Depth:** standard
**Files Reviewed:** 82
**Status:** issues_found

## Summary

Reviewed all 82 files changed by the Phase 11 gap-closure plans (11-15..11-22): cart redesign and bulk-pricing display, collection/product page redesign, bulk-wholesale-supply landing page, homepage sections, header/footer rework, contact/newsletter forms, and shared UI primitives. Cross-referenced called helpers (`@/lib/cart/actions`, `@/lib/shopify/quantity-rules`, `cart-count.tsx`, `use-outside-close.ts`, `section.tsx`, `image-url.ts`, `next.config.ts`, Next 16 image docs) to verify behavior beyond the diff.

No security vulnerabilities, data-loss risks, or crash paths were found — no hardcoded secrets, no unsanitized HTML injection (all `dangerouslySetInnerHTML` payloads go through `serializeInlineJson` or `sanitizeShopifyCompactHtml`), honeypot + rate limiting on all public forms. However, there are 10 warnings: several functional bugs in revenue-relevant flows (cart quantity feedback, mobile-nav wholesale CTA, collection empty-state link, cart total estimation) and recurring violations of the project's explicit conventions (banned static `style={{}}`, deprecated Next 16 `priority` prop, multiple components per file).

No structural-findings block was provided, so this report contains narrative findings only.

## Narrative Findings (AI reviewer)

### Warnings

#### WR-01: Cart quantity stepper discards the action result — errors are swallowed and the header cart badge goes stale

**File:** `src/app/(storefront)/cart/_components/cart-line-actions.tsx:73-82`
**Issue:** `handleStepperClick` calls `await action(INITIAL_CART_LINE_FORM_STATE, data)` directly and throws the returned `CartLineFormState` away. Two consequences:

1. Update failures (e.g., "Maximum quantity available reached.", "cart session expired" from `cartLineFormAction`) are never shown — the optimistic quantity silently reverts with zero feedback. The `state.message` rendering at line 135 only ever reflects the _remove_ form.
2. `state.cartChanged` never becomes true for quantity updates, so `CART_CHANGED_EVENT` is never dispatched (line 67-71). `CartCount` (`src/components/layout/header/cart-count.tsx`) only refetches on that event, so the header badge shows the old quantity after any +/- click.
   **Fix:** Capture the result and feed it into local state:

```tsx
function handleStepperClick(newQuantity: number) {
  startUpdateTransition(async () => {
    setOptimisticQuantity(newQuantity)
    const data = new FormData()
    data.append('intent', 'update')
    data.append('lineId', lineId)
    data.append('quantity', String(newQuantity))
    const result = await action(INITIAL_CART_LINE_FORM_STATE, data)
    setUpdateMessage(result.message)
    if (result.cartChanged) window.dispatchEvent(new Event(CART_CHANGED_EVENT))
  })
}
```

and render `updateMessage` alongside `state.message`.

#### WR-02: Mobile menu stays open over the destination page after tapping the wholesale/phone CTAs

**File:** `src/components/layout/header/mobile-mega-nav.tsx:131-138`
**Issue:** The "Apply for Wholesale" Button (`href="/pages/wholesale"`) and phone Button in the footer CTA row do not call `closeAll`. `DIRECT_LINKS` rows and panel links pass `onClick={closeAll}` (lines 117, mobile-shop-panel.tsx:60, 72), but these two were missed. Because navigation is client-side and the `mobileOpen` state lives in `Header`, the full-screen overlay remains open on top of `/pages/wholesale` after tapping the primary mobile conversion CTA.
**Fix:**

```tsx
<Button href="/pages/wholesale" variant="brand" size="lg" onClick={closeAll}>
  Apply for Wholesale
</Button>
<Button href="tel:1300729617" variant="secondary" size="lg" onClick={closeAll}>
```

#### WR-03: Collection empty state's "Clear filters" button navigates to the contact page

**File:** `src/app/(storefront)/collections/[handle]/_components/product-list.tsx:24-26`
**Issue:** The button labeled "Clear filters" links to `/pages/contact`. A user trying to remove filters is sent to a contact form instead. `PageContent` already computes `clearFiltersHref` (page-content.tsx:97) but does not pass it to `ProductList`.
**Fix:** Pass `clearFiltersHref` into `ProductList` and use it as the button href; keep a separate "Contact us" link if the "we source to order" path should remain:

```tsx
<Button href={clearFiltersHref} variant="ghost" size="sm" className="mt-5">
  Clear filters
</Button>
```

#### WR-04: Cart "Grand total" and savings banner are client-side estimates that can diverge from the Shopify checkout amount

**File:** `src/app/(storefront)/cart/_components/cart-view.tsx:115-151, 215-242, 524-537`
**Issue:** When Shopify's own `line.cost.totalAmount` shows no discount, `getLineDisplayPricing` re-derives a discounted total from `quantityPriceBreaks` (`getBulkTierTotalPrice`) and `getCartDisplayPricing` sums these derived line totals into the displayed "Grand total" (used in the sidebar at line 562 and the sticky mobile bar at line 600). The test fixture (cart-view.test.tsx:73-128) confirms the intent: Shopify reports `624.92 / 624.92` yet the UI displays "Now $549.93" and "Congratulations! You saved $74.99". If the quantity-break discount is not guaranteed to apply at Shopify checkout (e.g., tiers stored as metafields rather than catalog price breaks), the customer is promised a lower total and savings the checkout will not honor. Per-line `.toFixed(2)` summing can also drift by cents from Shopify's totals, and lines with a mismatched currency are silently dropped from the subtotal (line 217-223).
**Fix:** Confirm with the store that quantity price breaks are catalog-level (Shopify applies them in checkout). If they are, prefer Shopify's `cart.cost.totalAmount` when it already reflects the discount and only fall back to estimation with an explicit "estimated at checkout" label. If they are not, remove the derived totals and savings banner — never display a binding-looking total lower than what checkout will charge.

#### WR-05: QuantityStepper clamps on every keystroke, making direct entry impossible when min/step > 1

**File:** `src/components/ui/quantity-stepper/quantity-stepper.tsx:107-109`
**Issue:** `onChange` runs `clampQuantity` on each keystroke. With `min={10}` (wholesale variants do carry `quantityRule.minimum > 1` via `getVariantMinimumQuantity`), typing "2" of "25" immediately becomes "10", and the subsequent "5" produces "105". Clearing the field (`valueAsNumber` = NaN) snaps to `min` instantly. Users cannot type quantities for any variant whose minimum or increment exceeds 1.
**Fix:** Keep a local string state while focused and clamp on blur/Enter instead of on every change:

```tsx
onChange={(e) => setDraft(e.currentTarget.value)}
onBlur={() => updateQuantity(Number.parseInt(draft, 10))}
```

#### WR-06: Deprecated `priority` prop used on `next/image` (Next 16)

**File:** `src/app/(storefront)/collections/[handle]/_components/hero.tsx:78`; `src/app/(storefront)/pages/bulk-wholesale-supply/_components/banner-section.tsx:19`
**Issue:** Next 16 deprecated `priority` in favor of `preload` (`node_modules/next/dist/docs/.../image.md`: "Starting with Next.js 16, the `priority` property has been deprecated"). AGENTS.md explicitly instructs to heed deprecation notices, and other Phase 11 files already migrated (`product-gallery.tsx` uses `preload`; `product-card.tsx` uses `loading`/`fetchPriority`). These two files reintroduce the deprecated API.
**Fix:** Replace `priority` with `preload` (or `loading="eager"` + `fetchPriority="high"`) in both files.

#### WR-07: Banned static `style={{}}` attributes across footer, hero, and newsletter components

**File:** `src/components/homepage/hero/hero.tsx:13`; `src/components/homepage/newsletter/newsletter.tsx:28, 34-40`; `src/components/layout/footer/link-list/link-list.tsx:11`; `src/components/layout/footer/payment-mark/payment-mark.tsx:9`; `src/components/layout/footer/quality-column/quality-column.tsx:25`; `src/components/layout/footer/view/view.tsx:20, 59`
**Issue:** docs/conventions.md bans `style={{}}` except for values "Tailwind cannot statically extract." Every one of these is a static literal Tailwind's JIT extracts fine: `minHeight: 'min(92vh, 860px)'` → `min-h-[min(92vh,860px)]`, `padding: 'clamp(40px,6vw,72px)'` → `p-[clamp(40px,6vw,72px)]`, `gap: '11px'` → `gap-[11px]`, `padding: '5px 9px'` → `px-[9px] py-[5px]`, `marginTop: '22px'` → `mt-[22px]`, `paddingBlock: 'clamp(50px,7vw,90px)'` → `py-[clamp(50px,7vw,90px)]`, `gap: '7px'` → `gap-[7px]`, and the newsletter decor offsets (`right-[-6%] top-[-20%] w-[46%] h-[140%] opacity-50`). The comment in newsletter.tsx:13-14 mis-cites the convention exception — nothing here is dynamic.
**Fix:** Convert each to the equivalent Tailwind arbitrary-value class and delete the `style` attributes.

#### WR-08: Bulk-wholesale CTAs point at legacy/unverified Shopify routes, including a Liquid-only `?view=` parameter

**File:** `src/app/(storefront)/pages/bulk-wholesale-supply/_components/banner-section.tsx:30`; `_components/hero-section.tsx:29`; `_components/cta-section.tsx:19`
**Issue:** Three CTAs link to `/pages/appi-compliance?view=bulk-wholesale-supply` and `/pages/wholesale-account-request`. Neither route exists locally; they would only resolve via the `[...slug]` catch-all if matching Shopify page handles exist. The `?view=` query parameter is a Shopify Liquid theme concept (alternate template) that is meaningless in this headless app — the catch-all ignores it. Meanwhile the rest of the site (homepage hero, header, mobile nav, BulkSavings) uses the dedicated `/pages/wholesale` route for the same "apply for wholesale" action. If the Shopify handles do not exist, these primary CTAs 404.
**Fix:** Verify both handles exist in Shopify; drop the `?view=` parameter; strongly consider pointing all three CTAs at the canonical `/pages/wholesale` route for consistency.

#### WR-09: Modal/disclosure accessibility gaps in header overlays

**File:** `src/components/layout/header/search-overlay.tsx:66-72`; `src/components/layout/header/header.tsx:120-132`; `src/components/layout/header/mobile-mega-nav.tsx:41`
**Issue:**

1. `SearchOverlay` declares `role="dialog" aria-modal="true"` but implements no focus trap and no body scroll lock — Tab moves focus into the obscured page behind the scrim, contradicting `aria-modal`.
2. The burger `IconButton` toggling `MobileMegaNav` has no `aria-expanded`/`aria-controls`, unlike every other disclosure in this codebase (`DisclosureButton` contract enforced by button-system.test.mjs).
3. `MobileMegaNav` has no Escape-key handling and no scroll lock; the page behind the full-screen overlay still scrolls.
   **Fix:** Add a focus trap + `overflow-hidden` on `body` while either overlay is open; give the burger `aria-expanded={mobileOpen}` and `aria-controls` referencing the nav container (add an `id` to it); add an Escape handler to `MobileMegaNav` mirroring `SearchOverlay`'s.

#### WR-10: Multiple React component declarations per file and `'use client'` above the interactive leaf

**File:** `src/components/collection/product-card/product-card.tsx:1, 30-74`; `src/app/(storefront)/cart/_components/cart-view.tsx:258-291`
**Issue:** AGENTS.md bans multiple component declarations per file. `product-card.tsx` declares `QuickAddButton` (stateful, hooks) alongside `ProductCard`; `cart-view.tsx` declares `TrustSignalList` alongside `CartView`. Additionally, `'use client'` sits on the whole `ProductCard` even though the only interactive part is `QuickAddButton` — AGENTS.md requires pushing `'use client'` to the interactive leaf so the card shell (image, links, badges, price) stays server-rendered in collection grids.
**Fix:** Extract `QuickAddButton` to its own file with `'use client'`, remove the directive from `product-card.tsx`; extract `TrustSignalList` to `cart/_components/trust-signal-list.tsx` (it has two call sites and is a real reuse boundary).

### Info

#### IN-01: Dead export `LOGISTICS_CHECK_ITEMS` duplicated by a local constant

**File:** `src/app/(storefront)/pages/bulk-wholesale-supply/_lib/data.ts:35-40`; `_components/logistics-section.tsx:8-25`
**Issue:** `LOGISTICS_CHECK_ITEMS` is exported but never imported anywhere; `logistics-section.tsx` re-declares the same four items as a local `CHECK_ITEMS` with a bold/rest split. Two sources of truth for one list.
**Fix:** Delete `LOGISTICS_CHECK_ITEMS` or move the bold/rest-shaped data into `_lib/data.ts` and import it.

#### IN-02: Page title/description constants duplicated between `page.tsx` and `json-ld.tsx`

**File:** `src/app/(storefront)/pages/bulk-wholesale-supply/page.tsx:18-21`; `_components/json-ld.tsx:6-9`
**Issue:** `PAGE_PATH`, `PAGE_TITLE`, `PAGE_DESCRIPTION` are declared twice with identical values; metadata and JSON-LD will drift if one copy is edited.
**Fix:** Move the constants to `_lib/data.ts` and import from both files.

#### IN-03: Content typos in marketing copy

**File:** `src/app/(storefront)/pages/bulk-wholesale-supply/_lib/data.ts:51`; `src/components/homepage/content.ts:465`
**Issue:** "black, green, white, oolong, match & specialty teas" — "match" should be "matcha". "a huge range of tradition and premium teas" — should be "traditional".
**Fix:** Correct both strings.

#### IN-04: Footer "Popular Searches" link targets an invisible (`sr-only`) block; ~100 hidden SEO links

**File:** `src/components/layout/footer/view/view.tsx:48-54, 74-78`
**Issue:** The visible "Popular Searches" anchor links to `#popular-searches`, whose target is wrapped in `sr-only` — sighted users who click it see nothing happen. The block also ships ~97 links visible only to crawlers/screen readers, a pattern search engines treat as hidden link stuffing.
**Fix:** Either render the block visibly (e.g., a collapsed `<details>` that the anchor opens) or remove the visible anchor and accept the block as screen-reader-only navigation.

#### IN-05: Hardcoded copyright year `© 2026`

**File:** `src/components/layout/footer/view/view.tsx:42`
**Issue:** The year is hardcoded (with a comment explaining `new Date()` breaks Next 16 prerendering). It will silently go stale in January 2027.
**Fix:** Compute the year at build time (e.g., a generated constant or `process.env.BUILD_YEAR` injected in next.config) rather than per-request.

#### IN-06: Duplicate alias exports in contact actions; subject line built from raw user input

**File:** `src/lib/contact/actions.ts:243-249, 286-290, 345-356, 226`
**Issue:** `submitContactFormAction` is an identical re-wrap of `sendContactAction`, and `submitNewsletterSignupFormAction` / `sendNewsletterSignupFormAction` both wrap `sendNewsletterSignupAction` — three near-duplicate exported entry points per flow. Additionally `subject: \`New enquiry from ${submission.name}\``interpolates the raw name; Resend's JSON API mitigates header injection, but control characters should still be stripped defensively.
**Fix:** Consolidate to one exported action per flow (plus the`useActionState`-shaped variant where needed); add `submission.name.replace(/[\r\n]+/g, ' ')` before interpolating into the subject.

#### IN-07: Shared contact/newsletter forms hardcode `homepage-*` element ids

**File:** `src/components/contact/contact-section-form/contact-section-form.tsx:46-47, 59-110`; `src/components/homepage/newsletter/newsletter-form.tsx:49-66`
**Issue:** `ContactSectionForm` is now rendered on the homepage, collections index, blog listings, and bulk-wholesale page, but its message ids are still `homepage-contact-*` and its inputs use fixed ids (`contact-name`, `homepage-newsletter-email`). Any future page rendering two instances produces duplicate DOM ids; the `homepage-` prefix is also stale naming for a shared component.
**Fix:** Generate ids with `useId()` and drop the `homepage-` prefixes.

#### IN-08: Conditional className composed with nested ternaries instead of `cn()`

**File:** `src/components/homepage/proof-points/proof-points.tsx:46-53`
**Issue:** The divider-pattern classes are selected via nested ternaries returning whole string literals. The convention requires `cn()` for conditional composition; the shared `flex flex-col px-7.5 py-11` frame is also triplicated.
**Fix:**

```tsx
className={cn(
  'flex flex-col px-7.5 py-11',
  !isLastOverall && !isLastInRow2 && 'border-r border-paper/12',
  !isLastOverall && isLastInRow2 && 'border-r-0 lg:border-r lg:border-paper/12',
)}
```

#### IN-09: Testimonials slider ships invisible, purposeless progress dots

**File:** `src/components/homepage/testimonials/testimonials-slider.tsx:124-137`
**Issue:** The dot indicator strip is wrapped in `sr-only` _and_ marked `aria-hidden="true"` — invisible to sighted users and hidden from assistive tech. It serves no one; only the adjacent `aria-live` paragraph is functional.
**Fix:** Delete the dot markup, or remove `sr-only` if the dots were meant to be visible.

#### IN-10: `aria-label` on plain `<span>` elements is unreliably exposed

**File:** `src/components/ui/price/price.tsx:98, 110`
**Issue:** `aria-label="Was $X"` / `aria-label="Now $Y"` on generic `<span>`s is ignored by most screen reader/browser pairings (generic roles do not support naming from author). The visible text is announced instead, so "was/now" context is lost. Several cart tests assert on these attributes, so they are load-bearing for tests but not for users.
**Fix:** Use visually-hidden text instead: `<span className="sr-only">Was </span>{formattedCompare}` (and update tests accordingly).

#### IN-11: Convention drift — non-barrel contact imports, missing `import type`, `<a>` instead of `<Link>` for internal links

**File:** `src/app/(storefront)/collections/page.tsx:5`; `src/app/(storefront)/page.tsx:17`; `src/components/homepage/content.ts:3`; `src/app/not-found.tsx:59`; `src/components/layout/footer/popular-searches/popular-searches.tsx:120`
**Issue:** (a) `collections/page.tsx` and the homepage import `@/components/contact/contact-section` directly while other callers use the `@/components/contact` barrel — conventions call for barrel imports across domains. (b) `content.ts` imports `CtaProps` as a value import; it is type-only. (c) `not-found.tsx` collection pills and all popular-search entries use raw `<a>` for internal `/collections/...` routes, losing prefetch/client navigation; `not-found.tsx` also passes a redundant `robots: { index: false }` into `withNoindexRobots`, which may override the helper's fuller robots object.
**Fix:** Switch to barrel imports; `import type { CtaProps }`; use `<Link>` for internal hrefs; drop the redundant `robots` override.

#### IN-12: BulkSavings labels the _selected_ tier "Best value"; mockup concept stories retained after implementation

**File:** `src/components/product/bulk-savings/bulk-savings.tsx:142-146`; `src/app/not-found.concept.stories.tsx`; `src/components/layout/header/search-overlay-concept.stories.tsx`
**Issue:** (a) The "Best value" badge renders on whichever tier is active/selected, so selecting the smallest tier brands it "Best value" — misleading copy; the badge should mark the highest-discount tier. (b) Both `*.concept.stories.tsx` mockup files remain in the tree after their concepts were implemented (`not-found.tsx`, `search-overlay.tsx`); they duplicate production markup that will silently drift, and each declares multiple components per file.
**Fix:** Pin the badge to the deepest tier (`visibleTiers.at(-1)`); delete the two concept story files now that the owner-approved direction has shipped.

---

_Reviewed: 2026-06-11_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
