# Phase 19: H1 Correctness Re-Remediation - Research

**Researched:** 2026-06-29
**Source:** Grounded multi-agent codebase investigation (10 parallel agents) over the 2026-06-29 SEO audit re-analysis. Findings below were verified against current `main` (HEAD `40bceea3`) with file:line evidence.

## Question this answers
"What do I need to know to PLAN the two open H1 fixes well, without regressing Phase 18?"

---

## Finding 1 — Item #1 root cause: Cache Components Activity DOM retention

**Confirmed.** Each route's static HTML is correct (exactly one H1): product H1 at `src/app/(storefront)/products/[handle]/page.tsx:317-319`; collection H1 in exactly one of `hero.tsx:65` (banner), `hero.tsx:127` (green-band), or `collection-rich-hero.tsx:22`. Imported Shopify rich-text headings are demoted away from h1 by `sanitizeShopifyCompactHtml` (`src/lib/shopify/html-content.ts:196-198`). The header/mega-nav contains no h1/h2/h3; the search overlay returns null when closed. Two contract tests already prove single-route single-H1 output. **So the multiple/changing H1s are NOT in any route's HTML.**

The contamination is a **runtime cross-route DOM-persistence artifact**:
- `next.config.ts:9` sets `cacheComponents: true`.
- Per Next 16.2.9 docs (`cacheComponents.md`, `preserving-ui-state.md`), Cache Components does NOT unmount the previous route on client navigation — it wraps recently-visited routes in React `<Activity mode="hidden">` (display:none) and keeps them in the DOM.
- `node_modules/next/dist/client/components/bfcache-state-manager.js`: `MAX_BF_CACHE_ENTRIES = process.env.__NEXT_CACHE_COMPONENTS ? 3 : 1` — with Cache Components on, up to **3** prior routes stay mounted (hidden) alongside the visible one, each retaining its full DOM including its `<h1>`.
- DOM-reading SEO tools (Detailed SEO Extension) scan the raw DOM, not the a11y/visibility tree, so on `/products/aussie-chai` they see the visible product H1 PLUS the hidden H1s of recently-visited routes (homepage `hero.tsx:42-44` "Australia's #1 tea company" h1; `product-range.tsx:14` "Explore Our Product Range" h2; other products like "Aniseed Whole"). The retained set depends on the navigation path → the leaked-heading set changes per visit to the same URL.

**Why prior rechecks missed it:** `.planning/forensics/seo-audit-recheck-20260626.md` and `docs/launch/seo-team-recheck-report.md` validated only single-route completed HTML. The defect lives exclusively in the accumulated multi-route browser DOM.

### Remediation options (concrete)
- **(A) Disable `cacheComponents`.** Prior routes unmount on navigation (`MAX_BF_CACHE_ENTRIES` → 1). Only option that *guarantees* one H1 in the live DOM. There is NO public per-route Activity opt-out in 16.2.9 (`preserving-ui-state.md:21`: "Opt-out strategies are being considered"). **Migration cost (measured):** 5 modules use `'use cache'` — `src/lib/blog/operations.ts`, `src/lib/reviews/trustoo.ts`, `src/lib/shopify/operations/collection.ts`, `product.ts`, `storefront-page.ts` — with **41** `cacheLife`/`cacheTag` calls total; `unstable_cache` is not yet used anywhere. Follow `caching-without-cache-components.md` to migrate to `unstable_cache` / route-segment `revalidate`. **Risk:** also disables PPR/static-shell streaming that Phase 18's crawlable-shell work relied on — re-run `scripts/seo/probe-crawlable-html.mjs` and CWV evidence after.
- **(B) Keep Cache Components, force hard navigation** for SEO-critical product/collection links so no Activity DOM accumulates. NOTE: `prefetch={false}` alone does NOT stop Activity retention — soft client navigation still retains the route; a true full-document navigation (plain `<a>` / hard reload) is required. **Risk:** SPA UX degradation; weaker guarantee.
- **(C) Await upstream per-route Activity opt-out.** None today; document risk, do not ship alone.
- **Not viable:** a component-level "demote my H1 when hidden" wrapper — Activity hidden-state is not a public API.

### Reproduction (do first, cheap and conclusive)
On staging or local dev: navigate `Home → /products/aussie-chai → /products/aniseed-whole`, then in DevTools:
```js
document.querySelectorAll('h1').length                                  // > 1
[...document.querySelectorAll('h1')].map(h => h.textContent.trim())     // shows leaked titles
```
Inactive H1s sit inside a `display:none` Activity container. This proves the root cause before any remediation.

---

## Finding 2 — Item #2: non-visible banner-mode collection H1

**Confirmed (and caused by Phase 18's own later commits).** Collection pages pick one of three hero branches in `page-content.tsx:251-260` based on `getDescriptionHeroImage(collection.descriptionHtml)` (`page-helpers.ts:219-242` — banner mode fires when the Shopify description embeds an `<img>`):
1. Rich hero → large visible H1 (`collection-rich-hero.tsx:22`). Good.
2. Green-band (no banner image) → large visible H1 (`hero.tsx:127-134`, `font-display ... clamp(2.4rem,5vw,4rem)`). Good — this is the "Black Teas" page the auditor saw working.
3. **Banner mode** → the only `<h1>` is `hero.tsx:65-70`, rendered `type-mono-meta` (`globals.css:238-245`: 11px, weight 400, uppercase), inline inside the breadcrumb `<nav>` between "/" separators — a tiny gold crumb, not a heading.

There is **no** `sr-only`/`hidden`/`opacity-0`/`h-0`/`visibility:hidden`/`font-size:0` on the collection H1 (grep-verified) — so it is not literal black-hat hidden text, but it is a real "no visually meaningful H1" defect. Commit history that created it: `27b518d4` (compact banner heading → small `<h1>`), `82686a3e` (promoted breadcrumb crumb `<span>` to `<h1>`), `84b1f438` (restyled to `type-mono-meta`). The test `page-content.test.tsx:500-505` currently *asserts* this tiny markup (length-1 `<h1>`, literal `type-mono-meta`, and `not.toContain('type-display')`), so a fix MUST update it.

### Fix shape
1. `hero.tsx` banner branch (~47-72): revert the breadcrumb current-page element to `<span aria-current="page" className="type-mono-meta text-gold-deep m-0 inline">{collectionTitle}</span>`.
2. After the `</nav>`, add a real visible H1, e.g. `<h1 className="font-display text-ink mt-4 text-balance text-[clamp(2rem,4vw,3.1rem)] leading-[1.06]">{collectionTitle}</h1>`. Use `text-ink` (paper background), NOT `text-paper`. Optionally render the brief intro in banner mode too (currently dropped).
3. Update `page-content.test.tsx` (~471-516): keep single-H1 assertion; drop the `type-mono-meta`/`not type-display` H1 assertions; assert breadcrumb is now a `<span>` and the H1 carries a display class.
4. Banner-mode trigger is content-driven (description embeds an `<img>`), so the fix applies uniformly to every such collection — correct scope.

---

## Finding 3 — Phase 18 outcomes to preserve (re-prove, do not regress)

Verified already-correct in current code; the change must not break them:
- One **visible** H1 per route in single-route HTML (product title; collection green-band/rich-hero).
- Crawlable server HTML for collection/product (`scripts/seo/probe-crawlable-html.mjs` asserts content precedes any skeleton marker; commit `308f470e` removed the old skeleton fallback).
- `lang="en-AU"` (`layout.tsx:63`), title `absolute` on home/collection/service (`layout.tsx:42` template kept for products), canonical/sitemap on `www` (`src/lib/seo/site-url.ts` normalizes apex→www), robots disallows `/account*` (`src/app/robots.ts`), tagged-blog noindex (`blogs/[blog]/_lib/metadata.ts`), structured data scoped per template.

If approach (A) is chosen, specifically re-run `probe-crawlable-html.mjs` + CWV evidence (`docs/launch/performance-evidence.md`) because disabling Cache Components changes streaming.

---

## Validation Architecture

The decisive validation for item #1 is an **in-browser, multi-route** assertion — single-route HTML/unit tests structurally cannot reproduce the defect:
- **Regression test (new):** Playwright/e2e (fake-Shopify) — navigate ≥3 SEO-critical routes (`Home → ProductA → ProductB`, plus a collection), assert `await page.locator('h1').count() === 1` (raw DOM) and `await page.locator('h1', { hasText: "Australia's #1 tea company" }).count() === 0`. MUST use raw `locator('h1')`, never `getByRole('heading')` (a11y-filtered → false pass on hidden Activity nodes). MUST fail on the pre-fix build.
- **Item #2 test:** update `page-content.test.tsx` to assert one visible display-class H1 + `<span>` breadcrumb.
- **Non-regression:** re-run `scripts/seo/probe-crawlable-html.mjs(.test.mjs)`, `scripts/seo/probe-launch-seo.mjs`, and the existing product/collection contract tests; (approach A) re-run CWV/performance evidence.

## Open questions for the planner
- Approach (A) vs (B) for item #1 (D-04) — recommend with cost/risk; the final choice is execution-gated on owner/developer sign-off.
- Whether to add the brief intro to banner mode while fixing the H1 (D-06 optional) — design call.
- Test placement: the multi-route H1 regression likely belongs in the e2e/fake-Shopify layer (`pnpm test:e2e`), not unit — confirm harness can do multi-route nav.

---

*Phase: 19-H1 Correctness Re-Remediation*
*Research completed: 2026-06-29*
