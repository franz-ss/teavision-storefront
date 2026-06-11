---
phase: 11-full-visual-redesign
verified: 2026-06-11T03:30:00Z
status: human_needed
score: 8/8 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 7/8
  gaps_closed:
    - 'Storybook stories remain passing under the new design system (RD-08) — all 4 failing stories repaired in commit d50fd7a'
  gaps_remaining: []
  regressions: []
human_verification:
  - test: 'Desktop and mobile visual parity pass'
    expected: 'Header, footer, homepage, PLP/search, PDP, cart, blog, and supporting pages visually match design/extracted-design.html at representative desktop and mobile widths.'
    why_human: 'No visual regression tooling or screenshot baseline is configured; code inspection can verify classes and composition but not final rendered pixel parity.'
  - test: 'Newsletter signup succeeds end-to-end'
    expected: 'With RESEND_API_KEY set in .env.local, submitting the homepage newsletter form returns a success confirmation (no error state).'
    why_human: 'Requires a live network call to Resend and a verified API key value — cannot be confirmed by grep or static analysis.'
---

# Phase 11: Full Visual Redesign — Re-Verification Report (Round 3)

**Phase Goal:** Every storefront surface expresses the new design system from `design/teavision-redesign.html` — warm-paper surfaces, green-undertone ink, brand-green and gold accents, Spectral/Hanken Grotesk/Space Mono typography — with the old `--tv-*`/steep/stone design system removed completely and all existing behavior (cart, search, bulk savings, quick-add, accessibility) preserved.
**Verified:** 2026-06-11T03:30:00Z
**Status:** human_needed
**Re-verification:** Yes — after commit d50fd7a closes the 2 story-test regression gaps from previous round

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                  | Status                            | Evidence                                                                                                                                                                                                                                                                             |
| --- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `globals.css` exposes only the new system tokens; new fonts load via `next/font`.                                      | VERIFIED                          | Paper/ink/brand/gold OKLCH tokens confirmed in `src/app/globals.css`. `src/app/layout.tsx` imports Spectral, Hanken_Grotesk, Space_Mono, Caveat with CSS variables.                                                                                                                  |
| 2   | Old `--tv-*`/steep/stone system is removed from runtime source.                                                        | VERIFIED                          | `rg "tv-\|steep-\|stone-" src .storybook` returns 0 matches. No old token names found.                                                                                                                                                                                               |
| 3   | Header, footer, homepage, PLP/search, PDP, cart, blog, and supporting pages are restyled with the new system.          | VERIFIED (human visual follow-up) | All routes verified in code: components restyled with new tokens; gap-closure plans 11-15..11-22 addressed all 15 UAT issues; final visual pixel parity requires human review.                                                                                                       |
| 4   | No raw hex/oklch/rgb values appear in component classNames.                                                            | VERIFIED with WARNING             | `rg "\-\[(#\|rgb\|oklch\|hsl)" src .storybook` returns matches only for `overlay-image-card.tsx` gradient scrim — a static linear-gradient using ink OKLCH-derived rgba values. Convention warning only; Tailwind class check passes; gradient is not extractable to a static token. |
| 5   | Existing behavioral contracts still pass: quick-add, bulk savings, cart actions, search facets, accessibility/noindex. | VERIFIED                          | `pnpm test:contracts` 35/35, `pnpm test:unit` 40/40, `pnpm test:integration` 10/10. E2E fake-Shopify pass confirmed in UAT-18.                                                                                                                                                       |
| 6   | Build passes: `pnpm lint`, `pnpm typecheck`, `pnpm build` with no errors.                                              | VERIFIED                          | `pnpm lint` exited 0 (Tailwind class check passed). `pnpm typecheck` exited 0. `pnpm build` prerendered 58/58 routes including `/pages/bulk-wholesale-supply`.                                                                                                                       |
| 7   | `RESEND_API_KEY` is provisioned and newsletter signup is wired with a server-side missing-key warn.                    | VERIFIED (env human)              | `.env.local` contains `RESEND_API_KEY=<value>` (commit `81ce17f` documents owner setup). `console.warn` added to both missing-key branches in `src/lib/contact/actions.ts`. Functional end-to-end test requires human with live key.                                                 |
| 8   | Storybook stories remain passing under the new design system.                                                          | VERIFIED                          | commit d50fd7a repairs all 4 previously-failing stories. See gap-closure evidence below.                                                                                                                                                                                             |

**Score:** 8/8 truths verified

### Gap-Closure Evidence (commit d50fd7a)

**Gap 1 — CartLineActions UpdateError/UpdatePending (closed)**

Root cause: `handleStepperClick` called `action()` without capturing the result, so stepper errors never reached the `role="alert"` and `isUpdatePending` did not set `aria-busy` on buttons.

Fix applied in `src/app/(storefront)/cart/_components/cart-line-actions.tsx`:

- Added `useState<CartLineFormState>` for `stepperState`
- `handleStepperClick` now captures `const result = await action(...)` and calls `setStepperState(result)`
- Alert renders `stepperState.message ?? state.message` — stepper errors surface immediately
- Stepper buttons carry `aria-busy={isUpdatePending || undefined}` while the transition is pending

Fix applied in `src/app/(storefront)/cart/_components/cart-line-actions.stories.tsx`:

- `UpdateError`: unchanged assertion — `findByRole('alert')` now resolves because stepper errors flow through `stepperState`
- `UpdatePending`: assertion updated from "button is disabled" to "optimistic quantity = 3, button enabled with `aria-busy=true`" — correctly reflects the useOptimistic/useTransition contract

**Gap 2 — Footer Default story link-count mismatch (closed)**

Root cause: 98 sr-only anchor elements inside `#popular-searches` inflated `querySelectorAll('a')` count from 16 to 112.

Fix applied in `src/components/layout/footer/view/view.stories.tsx`:

- Link query now filters: `.filter((link) => !link.closest('#popular-searches'))` — excludes the SEO block from parity counting
- Expected links updated: copyright is plain text (not a link) per redesign; `{ href: '#popular-searches', label: 'Popular Searches' }` retained as the visible anchor to the block

**Related fix — CartView MissingImageAndLongTitle mobile overflow (closed)**

Fix applied in `src/app/(storefront)/cart/_components/cart-view.tsx`:

- `flex-wrap` added to mobile stepper/total row — compare-at price (added in 11-18) no longer overflows 320px
- `max-w-full` added to the title `<Link>` — unbroken long words now wrap within the column

### Required Artifacts

| Artifact                                                             | Expected                                                          | Status   | Details                                                                                                                                       |
| -------------------------------------------------------------------- | ----------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/globals.css`                                                | New Tailwind 4 theme only                                         | VERIFIED | Paper/ink/brand/gold OKLCH tokens, font tokens, reduced-motion block, no legacy tokens.                                                       |
| `src/app/layout.tsx`                                                 | New Google fonts via `next/font`                                  | VERIFIED | Spectral/Hanken Grotesk/Space Mono/Caveat variables consumed by theme tokens.                                                                 |
| `src/components/layout/header/header.tsx`                            | Utility bar lg+-only, nowrap guard                                | VERIFIED | `hidden lg:block` on utility bar; `whitespace-nowrap overflow-hidden` guard in inner flex container.                                          |
| `src/components/layout/header/mega-nav.tsx`                          | Hover-intent close grace timeout                                  | VERIFIED | `CLOSE_GRACE_MS = 200`, `scheduleClose`/`cancelClose`/`openMenuNow` pattern; `h-full self-stretch` on trigger li.                             |
| `src/components/layout/header/mobile-mega-nav.tsx`                   | Close button + non-overlapping overlay                            | VERIFIED | Overlay at `top-19`; explicit `IconButton` close row; chip wrap via `flex-wrap`.                                                              |
| `src/components/ui/button/button.tsx`                                | No hover lift on brand/primary/inverse                            | VERIFIED | `hover:-translate-y-0.5 hover:shadow-2` removed from all three variants.                                                                      |
| `src/app/(storefront)/page.tsx`                                      | CertificationCoverage mounted                                     | VERIFIED | `<CertificationCoverage />` rendered between `<OrganicHerbs />` and `<Testimonials />`.                                                       |
| `src/components/homepage/hero/hero.tsx`                              | Consumes HOMEPAGE_HERO.title/.copy                                | VERIFIED | Hero renders `HOMEPAGE_HERO.title` ("Australia's #1 tea company") and `HOMEPAGE_HERO.copy`.                                                   |
| `src/components/collection/product-card/product-card.tsx`            | StarRating between title and price                                | VERIFIED | `<StarRating rating count size="sm" className="mt-1" />` rendered when `product.rating !== undefined`.                                        |
| `src/app/(storefront)/collections/[handle]/_components/hero.tsx`     | Banner-art branch on `getDescriptionHeroImage()`                  | VERIFIED | Branches on `bannerImage` prop: banner mode renders art full-opacity + storyDisclosure; default keeps green band.                             |
| `src/app/(storefront)/collections/page.tsx`                          | Full grid from getCollectionSummaries, All first, contact section | VERIFIED | Grid from `getCollectionSummaries()` filtered on `frontpage`, sorted with `all` first; `<ContactSection>` as final section.                   |
| `src/components/search/search-results-view/search-results-view.tsx`  | Empty state renders hero + No-matches only                        | VERIFIED | Short-circuits to `SearchAlert` only when `result.products.length === 0 && selectedFilterCount === 0`.                                        |
| `src/app/(storefront)/cart/_components/cart-view.tsx`                | 5-col grid header aligned to rows; mobile wrap                    | VERIFIED | `xl:grid xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem]` on header + rows; `flex-wrap` on mobile stepper row; `max-w-full` on title link.  |
| `src/app/(storefront)/cart/_components/cart-line-actions.tsx`        | Optimistic qty + stepper error surfacing                          | VERIFIED | `useOptimistic`+`useTransition` for stepper with local `stepperState` capturing action result; `aria-busy` on stepper buttons during pending. |
| `src/components/ui/price/price.tsx`                                  | compare-at legible at cart density                                | VERIFIED | `comparePriceTextVariants` sm/md raised to `text-sm text-ink-soft`.                                                                           |
| `src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx`  | Newsletter ink band + contact section                             | VERIFIED | `<BlogNewsletterBand />` and `<ContactSection>` mounted at listing end.                                                                       |
| `src/components/layout/footer/popular-searches/popular-searches.tsx` | 98 SEO links sr-only in footer                                    | VERIFIED | Component exists with 4-column 98-link inventory. Mounted `sr-only` in `view.tsx`. Story scopes parity to visible links only.                 |
| `src/app/(storefront)/pages/bulk-wholesale-supply/page.tsx`          | 10-section page with full production content                      | VERIFIED | Route exists with all 10 sections. Build confirms `○ /pages/bulk-wholesale-supply`.                                                           |
| `src/app/not-found.tsx`                                              | On-brand illustrated 404                                          | VERIFIED | BrushCircle teapot, "Nothing to steep here" / "This page has gone cold" copy, 3 action buttons, 5 collection pill links.                      |
| `src/components/layout/header/search-overlay.tsx`                    | Calmer body-scale input, .field focus ring                        | VERIFIED | `border-b-2 border-ink` removed; input uses `type-body` scale; shared `.field` focus ring.                                                    |
| `src/components/contact/contact-section/contact-section.tsx`         | Reusable ContactSection in contact domain                         | VERIFIED | Component exists at `src/components/contact/contact-section/`; used on collections, blog, bulk-wholesale-supply.                              |

### Key Link Verification

| From                             | To                                                | Via                                                                                                                | Status | Details                                                                                                                |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| `layout.tsx`                     | `globals.css`                                     | Font CSS vars to `@theme` font tokens                                                                              | WIRED  | Font variables set on `<body>`, referenced by theme tokens.                                                            |
| `header.tsx`                     | MegaNav, MobileMegaNav, CartCount, SearchOverlay  | Direct imports + renders                                                                                           | WIRED  | All four rendered; MegaNav uses grace-timeout hover intent.                                                            |
| `mega-nav.tsx`                   | `shop-mega-panel.tsx` / `services-mega-panel.tsx` | `cancelClose`/`scheduleClose` via shared timer ref                                                                 | WIRED  | Panel wrapper div has `onMouseEnter={cancelClose}` cancelling the 200ms grace timer.                                   |
| `page.tsx` (homepage)            | CertificationCoverage                             | Direct import + render                                                                                             | WIRED  | `<CertificationCoverage />` between OrganicHerbs and Testimonials.                                                     |
| `hero.tsx` (homepage)            | `content.ts HOMEPAGE_HERO`                        | `HOMEPAGE_HERO.title/.copy`                                                                                        | WIRED  | Hero renders from content constants.                                                                                   |
| `cart-line-actions.tsx`          | `cartLineFormAction`                              | `useOptimistic`+`useTransition` for stepper; local `stepperState` for error surfacing; `useActionState` for remove | WIRED  | Stepper updates optimistically; errors flow through `stepperState.message`; remove uses isPending from useActionState. |
| `listing-content.tsx` (blog)     | `BlogNewsletterBand`, `ContactSection`            | Direct imports + renders                                                                                           | WIRED  | Both mounted at end of listing.                                                                                        |
| `collections/page.tsx`           | `getCollectionSummaries`, `ContactSection`        | Data fetch + section render                                                                                        | WIRED  | Full grid from Shopify; ContactSection with `submitContactFormAction`.                                                 |
| `bulk-wholesale-supply/page.tsx` | `ContactSection`                                  | `submitContactFormAction`                                                                                          | WIRED  | ContactSection reused as section 10.                                                                                   |

### Data-Flow Trace (Level 4)

| Artifact                                                    | Data Variable                                        | Source                                                | Produces Real Data | Status  |
| ----------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------- | ------------------ | ------- |
| `src/components/collection/product-card/product-card.tsx`   | `product.variants`, `product.tags`, `product.rating` | Collection Shopify GraphQL mappers                    | Yes                | FLOWING |
| `src/app/(storefront)/search/page.tsx`                      | `result`, `state`                                    | `getSearchaniseSearchResults(parseSearchParams(...))` | Yes                | FLOWING |
| `src/app/(storefront)/cart/_components/cart-view.tsx`       | `cart.lines`, `discountAllocations`, `checkoutUrl`   | `getCartAction()` -> Shopify cart operation           | Yes                | FLOWING |
| `src/app/(storefront)/collections/page.tsx`                 | `gridCollections`                                    | `getCollectionSummaries()` filtered + sorted          | Yes                | FLOWING |
| `src/app/(storefront)/pages/bulk-wholesale-supply/page.tsx` | All copy constants                                   | `_lib/data.ts` static + Shopify CDN image URLs        | Static/CDN         | FLOWING |
| `src/components/homepage/content.ts`                        | `HOMEPAGE_HERO`, `TESTIMONIALS`, `FAQ_ITEMS`         | Approved verbatim copy constants                      | Static             | FLOWING |

### Behavioral Spot-Checks

| Behavior                       | Command                                             | Result                                          | Status               |
| ------------------------------ | --------------------------------------------------- | ----------------------------------------------- | -------------------- |
| New Tailwind tokens compile    | `pnpm lint` (includes `check-tailwind-classes.mjs`) | Tailwind class check passed                     | PASS                 |
| Contract tests                 | `pnpm test:contracts`                               | 35/35 passed                                    | PASS                 |
| Unit behavior coverage         | `pnpm test:unit`                                    | 10 files, 40 tests passed                       | PASS                 |
| Server Action/route boundaries | `pnpm test:integration`                             | 2 files, 10 tests passed                        | PASS                 |
| TypeScript                     | `pnpm typecheck`                                    | exited 0                                        | PASS                 |
| Next production build          | `pnpm build`                                        | 58/58 pages prerendered                         | PASS                 |
| Storybook interaction tests    | `pnpm test:stories`                                 | 85 files / 297 tests, all pass (commit d50fd7a) | PASS                 |
| Fake-Shopify cart e2e          | UAT-18 (owner-run)                                  | 1 passed (13.8s)                                | PASS (UAT confirmed) |

### Requirements Coverage

| Requirement | Source Plan                                                   | Description                                                        | Status                  | Evidence                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RD-01       | 11-01, 11-02, 11-03                                           | New tokens, fonts, primitives in globals.css and layout.tsx        | VERIFIED                | OKLCH tokens confirmed; Spectral/Hanken/SpaceMono/Caveat loaded via next/font.                                                                                                                       |
| RD-02       | 11-14                                                         | Old `--tv-*`/steep/stone system removed from all source            | VERIFIED                | `rg "tv-\|steep-\|stone-" src .storybook` — 0 matches.                                                                                                                                               |
| RD-03       | 11-04, 11-05, 11-15, 11-22                                    | Layout chrome (header, nav, search, footer) restyled               | VERIFIED (human visual) | Header utility bar/mega-nav/mobile-nav/search-overlay/404 all fixed; footer parity story passes after d50fd7a.                                                                                       |
| RD-04       | 11-06, 11-07, 11-16, 11-22                                    | Homepage section composition and styling                           | VERIFIED (human visual) | Approved copy, CertificationCoverage mounted, stat band, testimonials, newsletter, FAQ all addressed.                                                                                                |
| RD-05       | 11-08, 11-09, 11-17                                           | PLP/product cards preserve Phase 8/9 behavior contracts            | VERIFIED                | StarRating added to ProductCard; banner hero branch restored; quick-add and badge contracts pass.                                                                                                    |
| RD-06       | 11-10, 11-19                                                  | PDP presentation with bulk/variant/cart behavior preserved         | VERIFIED                | PDP spacing parity sweep applied; ProductForm/BulkSavings tests and data flow pass.                                                                                                                  |
| RD-07       | 11-05, 11-09, 11-11, 11-12, 11-13, 11-17, 11-18, 11-20, 11-21 | Cart/search/blog/static/error surfaces restyled                    | VERIFIED                | All surfaces restyled and data-wired. Cart-view mobile overflow fixed in d50fd7a.                                                                                                                    |
| RD-08       | 11-14, 11-15..11-22                                           | Storybook renders correctly; lint/typecheck/build pass; no raw hex | VERIFIED                | `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass. `pnpm test:stories` 297/297 pass after d50fd7a. Raw gradient rgba in overlay-image-card.tsx is a WARNING (convention deviation, non-blocking). |

### Anti-Patterns Found

| File                                                                | Line | Pattern                                                      | Severity | Impact                                                                                                                                                                 |
| ------------------------------------------------------------------- | ---- | ------------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/homepage/overlay-image-card/overlay-image-card.tsx` | 33   | Raw `rgba()` values in Tailwind arbitrary gradient className | WARNING  | Violates `no raw hex/rgb values in className` convention. Tailwind class check passes. Gradient uses ink color values not extractable to a static token. Non-blocking. |

No BLOCKERs remain. All previously-identified BLOCKER anti-patterns are resolved in commit d50fd7a.

### Human Verification Required

### 1. Desktop and Mobile Visual Parity

**Test:** Run the app and compare header, footer, homepage, collection/search, PDP, cart, blog, wholesale/contact/static/error states against `design/extracted-design.html` at desktop and ~375px mobile widths.
**Expected:** Surfaces match the redesign intent: warm paper, green-undertone ink, brand/gold accents, typography, section composition, and responsive layout. No horizontal overflow at mobile.
**Why human:** No screenshot baseline or visual regression tooling configured.

### 2. Newsletter Signup End-to-End

**Test:** With `RESEND_API_KEY` set in `.env.local`, submit the homepage newsletter form with a real email address.
**Expected:** Form shows a success/confirmation state; no error message.
**Why human:** Requires a live network call to Resend's API — cannot be confirmed by static analysis or grep.

### Gaps Summary

No code-level gaps remain. All 8 must-haves are verified. The two previous BLOCKER story-test regressions are confirmed closed by commit d50fd7a:

- CartLineActions UpdateError/UpdatePending: local `stepperState` now captures action results; `aria-busy` attribute on stepper buttons during pending transitions
- Footer Default: parity helper scoped to visible links; expected links updated to match redesign bottom bar
- CartView MissingImageAndLongTitle (bundled fix): `flex-wrap` on mobile stepper row and `max-w-full` on title link resolve mobile overflow

The two remaining human_verification items (visual parity, newsletter e2e) were present in the previous verification and remain unchanged — they require owner testing with a running instance.

---

_Verified: 2026-06-11T03:30:00Z_
_Verifier: Claude (gsd-verifier) — re-verification after commit d50fd7a (story-test regression fixes)_
