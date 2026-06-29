# Phase 19: H1 Correctness Re-Remediation - Context

**Gathered:** 2026-06-29
**Status:** Ready for planning
**Source:** 2026-06-29 SEO audit re-analysis (`docs/launch/seo-audit-staging-analysis.md`) + grounded codebase investigation. Phase 18 closed/verified; this is a follow-up phase per the closed-phase rule.

<domain>
## Phase Boundary

Phase 19 fixes the two genuinely-open H1-correctness defects that the 2026-06-29 re-analysis of the staging SEO audit surfaced and that Phase 18 did not actually resolve. It owns: (1) eliminating multiple / per-visit-changing H1s in the **accumulated live browser DOM** on collection and product pages, and (2) restoring a single **visible** page-level H1 on banner-image collection pages. It also owns correcting the two prior closeout docs that wrongly marked the H1 issue resolved, and re-proving Phase 18's outcomes after the change.

Scope boundary: Phase 19 addresses ONLY the H1-correctness items (audit re-analysis items #1 and #2). All other audit items were verified already-fixed in current code (lang, title suffix, canonical/sitemap host, robots, blog-tag noindex, structured data, read-more placement, crawlable HTML) and are out of scope except where a regression must be re-proven. Performance/LCP (audit item — partially open) and the production apex→www redirect (infra) are tracked separately and are NOT in this phase.

This phase does not run real Shopify hosted checkout, payment, shipping, tax, order, success-redirect, live Customer Account OAuth, protected customer data, B2B pricing, Search Console, DNS cutover, or production host redirect tests without explicit owner/operator approval.

</domain>

<decisions>
## Implementation Decisions

### Item #1 — Multiple / per-visit-changing H1s (accumulated DOM)
- **D-01 (outcome, locked):** The success condition is exactly **one** `<h1>` in the **accumulated live browser DOM** after multi-route client-side navigation (e.g. `Home → /products/aussie-chai → /products/aniseed-whole`), not merely one H1 in each route's single-route HTML. Phase 18's single-route guarantee stays intact and is necessary but not sufficient.
- **D-02 (root cause, locked):** The defect is a runtime cross-route DOM-persistence artifact of `cacheComponents: true` (`next.config.ts:9`). Next.js 16 keeps up to 3 previously-visited routes mounted in hidden React `<Activity mode="hidden">` (display:none) boundaries (`MAX_BF_CACHE_ENTRIES = __NEXT_CACHE_COMPONENTS ? 3 : 1`); their `<h1>`s remain in the live document and DOM-reading SEO tools observe them. It is NOT a per-component bug — every route's own HTML is already correct.
- **D-03 (reproduce-first, locked):** The first deliverable is a **failing** in-browser regression test that reproduces the accumulated-DOM defect, plus a DevTools confirmation. The test MUST query the raw DOM (`page.locator('h1').count()`), NOT `getByRole('heading')` — the latter is a11y-tree-filtered and falsely passes on hidden `<Activity>` nodes. Single-route HTML probes (the Phase 18 method) cannot reproduce this and must not be relied on.
- **D-04 (remediation choice, execution-gated decision):** Choose ONE approach with explicit cost/risk rationale, recorded for owner/developer sign-off before execution because it touches core caching architecture:
  - **(A) Disable Cache Components** (`cacheComponents` off) so prior routes unmount on navigation (`MAX_BF_CACHE_ENTRIES` → 1). This is the only option that *guarantees* one H1 in the live DOM. Cost: migrate the **5** `'use cache'` modules (`src/lib/blog/operations.ts`, `src/lib/reviews/trustoo.ts`, `src/lib/shopify/operations/collection.ts`, `product.ts`, `storefront-page.ts`; **41** `cacheLife`/`cacheTag` calls) to `unstable_cache` / route-segment `revalidate`, and re-prove Phase 18 crawlable-shell + PPR streaming evidence still holds.
  - **(B) Keep Cache Components, force hard navigation** for SEO-critical product/collection links so no Activity DOM accumulates (plain `<a>` / full-document nav — note `prefetch={false}` alone does NOT prevent Activity retention). Cost: SPA UX degradation on those links; weaker guarantee than (A).
  - **(C) Await an upstream per-route Activity opt-out** (none exists in Next 16.2.9; `preserving-ui-state.md` says "opt-out strategies are being considered"). Interim: document the risk; do not ship as the sole fix.
  - **Recommendation to evaluate:** prefer (A) if the 5-module migration re-proves cleanly; fall back to (B) if (A) risks Phase 18 streaming evidence within this phase's budget. A component-level "demote my hidden H1" wrapper is NOT viable (Activity hidden-state is not a public API).
- **D-05 (regression guard, locked):** Ship a committed in-browser regression test (Playwright or equivalent) that navigates ≥3 SEO-critical routes and asserts exactly one raw `<h1>` and absence of known leaked headings (e.g. homepage "Australia's #1 tea company"). It must fail pre-fix and pass post-fix.

### Item #2 — Non-visible banner-mode collection H1
- **D-06 (locked):** On banner-image collection pages, the single `<h1>` currently renders as an 11px mono-uppercase breadcrumb crumb (`type-mono-meta`, `hero.tsx:65-70`). Replace it with one **visible** page-level H1 below the banner (heading prominence consistent with the green-band `hero.tsx:127-134` and rich-hero `collection-rich-hero.tsx:22` variants), and revert the breadcrumb current-page element to a non-H1 (`<span aria-current="page">`). Keep exactly one H1 on the page. Use `text-ink` (paper background), not `text-paper`.
- **D-07 (locked):** Update the locking test `collections/[handle]/_components/page-content.test.tsx` (~471–516) in the same change: keep the single-H1 assertion, drop the assertions that require the H1 to be `type-mono-meta` / forbid `type-display`, assert the breadcrumb crumb is now a `<span>`, and assert the visible H1 carries a display/heading class.
- **D-08 (design gate, locked):** Because this reverses the shipped "compact banner heading" decision (commit `27b518d4`), capture a design preview/sign-off of the banner-mode H1 treatment before implementing, per the project preview-designs-first rule.

### Preserve Phase 18 + documentation
- **D-09 (locked):** Re-prove Phase 18 outcomes after the change: one-visible-H1 single-route guarantees, crawlable server-rendered HTML (`scripts/seo/probe-crawlable-html.mjs`), metadata/canonical/robots/sitemap, and structured data. Do not regress them. If approach (A) is chosen, re-run the crawlable-HTML and CWV evidence specifically.
- **D-10 (locked):** Correct the two stale closeout docs (`.planning/forensics/seo-audit-recheck-20260626.md`, `docs/launch/seo-team-recheck-report.md`) to record that single-route HTML was clean but the multi-route accumulated DOM was the real H1 defect, and to reflect the Phase 19 remediation.

### Agent's Discretion
The planner has discretion on plan/wave decomposition and test mechanics within the boundaries above. The remediation-approach choice (D-04) is delegated to the planner to recommend, but is execution-gated on owner/developer sign-off before code lands.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase and Audit Scope
- `.planning/ROADMAP.md` — Phase 19 goal, requirements, success criteria, dependencies, suggested plans.
- `docs/launch/seo-audit-staging-analysis.md` — 2026-06-29 re-analysis: full page-by-page findings, the two open H1 defects, and grounded fixes. Binding scope source for Phase 19.
- `.planning/phases/18-seo-audit-remediation/18-CONTEXT.md` — Phase 18 decisions; note D-09 required a visible banner H1 that was not actually delivered.
- `.planning/phases/18-seo-audit-remediation/18-VERIFICATION.md` — Phase 18 closeout (passed) that missed the accumulated-DOM defect.
- `.planning/forensics/seo-audit-recheck-20260626.md` — prior recheck validating only single-route HTML (to be corrected, D-10).
- `docs/launch/seo-team-recheck-report.md` — prior reply claiming H1 conflicts resolved (to be corrected, D-10).

### Next.js 16 Docs to Read Before Code Changes
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` — Cache Components navigation/Activity behavior.
- `node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md` — hidden `<Activity>` DOM stays in the document and is found by DOM queries; opt-out status.
- `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md` — supported model if Cache Components is disabled (approach A).
- `node_modules/next/dist/docs/01-app/02-guides/streaming.md` — streaming/Suspense guidance to re-validate after any change.

### H1 / Heading Source Surfaces
- `next.config.ts` — `cacheComponents: true` (line 9): the root-cause toggle for item #1.
- `src/app/(storefront)/products/[handle]/page.tsx` — product H1 (product title) ~line 317-319; one correct H1 per route.
- `src/app/(storefront)/collections/[handle]/_components/hero.tsx` — banner-mode H1 (the 11px crumb, lines 65-70) and green-band-mode H1 (lines 127-134, the good reference).
- `src/app/(storefront)/collections/[handle]/_components/collection-rich-hero.tsx` — rich-hero H1 (line 22, good reference styling).
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` — hero-branch selection (~lines 206-260) via `bannerImage`/`richHero`.
- `src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx` — the test (~471-516) that locks the tiny-H1 markup; update per D-07.
- `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts` — `getDescriptionHeroImage` (~219-242) decides banner mode.
- `src/app/globals.css` — `type-mono-meta` (~238-245) and `type-display` (~139-145) tokens.
- `src/components/homepage/hero/hero.tsx` (~42-44) and `src/components/homepage/product-range/product-range.tsx` (~14) — sources of the leaked homepage headings observed on other routes.

### Caching Surfaces (approach A cost)
- `src/lib/shopify/operations/collection.ts`, `product.ts`, `storefront-page.ts`, `src/lib/blog/operations.ts`, `src/lib/reviews/trustoo.ts` — the 5 `'use cache'` modules (41 `cacheLife`/`cacheTag` calls total) to migrate if Cache Components is disabled.

### Evidence / Probes to Re-Run
- `scripts/seo/probe-crawlable-html.mjs` (+ `.test.mjs`) — asserts crawl-critical HTML precedes any skeleton marker; re-run after change.
- `scripts/seo/probe-launch-seo.mjs` — htmlLang/robots/sitemap/canonical/structured-data probe.
- `docs/launch/performance-evidence.md` — CWV/LCP evidence to reconcile if approach A is chosen.
- Existing prefetch precedent: `src/app/(storefront)/account/_components/legacy-bridge/legacy-bridge.tsx:41`, `login-panel/login-panel.tsx:43` (`prefetch={false}`).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Green-band collection H1 (`hero.tsx:127-134`) and rich-hero H1 (`collection-rich-hero.tsx:22`) are correct, visible references for the banner-mode fix (D-06).
- `scripts/seo/probe-crawlable-html.mjs` already reads response HTML chunk-by-chunk and asserts single-H1 / content-before-skeleton — extend its mental model into an in-browser multi-route test for item #1 (the script itself is single-route; the new test must be a real browser session).
- `prefetch={false}` is already used on account links — a precedent for approach (B), though note it does not by itself stop Activity retention.

### Established Patterns
- Storefront routes are server-first Next.js 16 App Router; `params: Promise<{...}>` awaited before destructuring.
- The 5 data-fetch modules use `'use cache'` + `cacheLife`/`cacheTag`; missing Shopify credentials fail fast (no stub data).
- Styling is Tailwind 4 token utilities with `cn()`; warm/botanical palette, no cool grays, no hidden text.
- Tests: unit/contract via the project test scripts; e2e via fake-Shopify (`pnpm test:e2e`) — the multi-route H1 regression belongs in the browser/e2e layer, not single-route HTML assertions.

### Integration Points
- Item #1 connects to `next.config.ts`, the 5 `'use cache'` modules, route-level Suspense/streaming, Link navigation, and a new in-browser regression test.
- Item #2 connects to `hero.tsx`, `page-content.tsx`, `globals.css` tokens, and `page-content.test.tsx`.
- Re-validation connects to `scripts/seo/probe-crawlable-html.mjs`, `probe-launch-seo.mjs`, and (approach A only) `docs/launch/performance-evidence.md`.

</code_context>

<specifics>
## Specific Ideas

- The smoking-gun evidence (audit PDF page 7): the SAME url `/products/aussie-chai` showed H1 "Aussie Chai" then "Aniseed Whole" across two loads — the per-visit variance is history-dependent because the retained-Activity set depends on the navigation path.
- Leaked headings observed include homepage "Australia's #1 tea company" (h1) and "Explore Our Product Range" (h2), plus other products' titles — all from hidden retained routes, not the visible route.
- Item #2 is the unfinished half of Phase 18 D-09 ("visible collection H1 below the banner"): the later commits `27b518d4`/`82686a3e`/`84b1f438` collapsed it into an 11px breadcrumb crumb instead of a visible heading.
- `getByRole('heading')` / `getByRole('heading', { level: 1 })` will FALSELY pass on the leaked hidden H1s because `<Activity hidden>` removes nodes from the a11y tree but not the DOM — the regression test must use raw `locator('h1')`.

</specifics>

<deferred>
## Deferred Ideas

- LCP / Core Web Vitals optimization (render-blocking CSS, ~88KiB unused JS from the client Header, browserslist) — audit item, partially open, tracked separately; NOT in Phase 19.
- Production apex→www host redirect + production `SITE_URL` (infra/Vercel), account/login per-page noindex hardening, schema enrichment, `/blog/` slug at migration — all out of scope for Phase 19 (covered/tracked elsewhere).

</deferred>

---

*Phase: 19-H1 Correctness Re-Remediation*
*Context gathered: 2026-06-29 from audit re-analysis + grounded investigation*
