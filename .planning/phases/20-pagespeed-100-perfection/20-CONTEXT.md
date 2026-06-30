# Phase 20: PageSpeed 100/100 Perfection - Context

**Gathered:** 2026-06-30
**Status:** Ready for planning
**Source:** Owner brief (`/gsd-plan-phase`) + approved recommendation in this session

<domain>
## Phase Boundary

Phase 20 pursues the highest attainable Google PageSpeed Insights / Lighthouse scores for the headless Teavision storefront — targeting a genuine **100 across all four categories (Performance, Accessibility, Best Practices, SEO)** on the representative route set — while honestly documenting where a perfect score is constrained by platform, browser, third-party, or field-data realities and recommending the best-possible alternative there.

This phase owns: a trustworthy **real-PSI measurement baseline** captured against a public preview deployment; **root-cause diagnosis** of the accepted-but-unresolved local-lab LCP gap from Phase 17 PERF-01; systematic **Core Web Vitals remediation** (LCP, INP, CLS); **resource optimization** (JavaScript, CSS, images, fonts); **caching / network / server-response** improvements; a **third-party script loading strategy** (Searchanise, Trustoo, analytics, Shopify); **Accessibility / Best Practices / SEO** category completion to 100; a **prioritized (impact × effort) remediation roadmap**; and a **final evidence pack** that supersedes the PERF-01 non-blocking acceptance with a real result.

This phase does NOT: redesign storefront visuals; change the Shopify-as-authority data model; run real Shopify hosted checkout / payment / shipping / tax / order / success-redirect / live Customer Account OAuth / protected-customer-data / B2B-pricing tests without owner approval; or flip launch indexing. The preview deployment used for PSI must remain non-indexed (noindex) and must not interfere with the live legacy Shopify site at `www.teavision.com.au`.

**Critical prior context — this goal was attempted before.** Phase 17 PERF-01 chased a perfect performance score, exhausted the obvious image/LCP work, and could not move local mobile Lighthouse past repeated FAIL rows. All 7 representative routes report LCP 3,830–4,974 ms in the **local Windows lab** despite FCP ~1,200 ms, Speed Index ~1,200–1,700 ms, TTFB 3–8 ms, CLS mostly 0.000, TBT 45–67 ms, and accessibility 95–97 (see `docs/launch/performance-evidence.md`). The owner accepted those local-lab failures as non-blocking (`docs/launch/performance-acceptance.md`), so the current "100/100" in `docs/launch/final-production-readiness-report.md` is **automated-readiness 100, not a real Performance 100**. The large FCP→text-LCP gap on routes whose LCP is plain text strongly suggests **local-lab measurement noise**, not a production defect. Phase 20 must therefore treat measurement correctness and root-cause as the FIRST deliverable, not jump to another round of image compression.

</domain>

<decisions>
## Implementation Decisions

### Measurement Strategy
- **D-01:** Real Google PageSpeed Insights is the score of record. Stand up a **public, fetchable preview deployment** (Vercel preview or equivalent) that is reachable by Google's servers (no password/Vercel auth wall) but kept **noindex** (`DISABLE_INDEXING` / robots noindex) so it is never indexed and never competes with the live legacy site. Capture real PSI **mobile and desktop** results per representative route as committed evidence. The literal goal ("Google PageSpeed Insights 100/100") cannot be proven on local lab alone.
- **D-02:** The existing local Lighthouse harness (`pnpm test:performance`, `scripts/performance/probe-lighthouse.mjs`) is the fast **inner-loop signal** during development, but it must be **reconciled against real PSI** so its numbers are trustworthy. Where local lab and real PSI diverge materially (as the Phase 17 evidence implies), document the divergence and trust PSI/field data for acceptance.
- **D-03:** **Reproduce and root-cause before remediating.** The first deliverable is a measurement + diagnosis spike: reproduce the LCP gap per route, identify the true LCP element/resource and the genuine bottleneck (lab artifact vs. real defect), and only then commit remediation work. Do not repeat the Phase 17 pattern of remediating against an unverified lab number.

### Score Target & Honesty
- **D-04:** Target a genuine **100 in all four categories** on the representative routes where physically achievable. Where a perfect 100 is NOT realistically achievable (platform, browser, third-party scripts, field-data variance), **explain the limitation and recommend the best-possible alternative** — this honest documentation is an explicit, required deliverable, not a fallback excuse.
- **D-05:** **Defer third-party scripts.** Searchanise, Trustoo, GA/GTM/analytics, and Shopify-injected scripts must be consent-gated, lazy-loaded, deferred, or facade-loaded so they never block the critical rendering path. Separately **measure and document the "production tags live" performance ceiling** — a perfect Performance 100 with all production third-party tags loading is likely unattainable, and that reality must be quantified, not hidden.
- **D-06:** Phase 20 supersedes the PERF-01 non-blocking acceptance. The final evidence must record the **real PSI outcome** (genuine pass, or an honest documented ceiling with the best alternative) and update `docs/launch/performance-acceptance.md` / `docs/launch/final-production-readiness-report.md` accordingly. No fabricated pass.

### Scope, Routes, Architecture
- **D-07:** **Representative routes** are the 7 from the existing harness — `/`, `/products/<handle>`, `/collections/all`, `/cart`, `/search?q=tea`, `/account` (login bridge), `/pages/privacy-policy` — plus the **Tea Journal blog listing** (`/blogs/teavision-blogs`) and a **blog article** route, because those are high-traffic templates. Mobile is the primary target (PSI default); desktop results are also captured. Each route is scored per category.
- **D-08:** **Preserve architecture and conventions.** Storefront routes stay server-first Next.js 16 App Router with React 19; push client behavior to interactive leaves only; Tailwind 4 token classes with `cn()`; the warm/botanical palette with no cool grays; no `any`; no default component exports; no direct generated-type imports. Performance work must not introduce new client wrappers or stub data.
- **D-09:** Any **Cache Components / streaming / Suspense** change made for performance must be re-validated against **Phase 18 crawlable-HTML evidence** and **Phase 19 single-visible-H1 / SEO evidence**. Do not regress SEO or crawlability to win a performance metric. `cacheComponents` stays enabled (owner-directed in Phase 19) unless a diagnosed, owner-approved exception is recorded.

### Resource & Vitals Specifics
- **D-10:** **Images** — preserve the established Next 16 image discipline: rendered `preload` for the LCP image, AVIF/WebP delivery, responsive `sizes`, stable dimensions to avoid CLS, and LQIP blur. The deprecated **`priority`** prop stays banned (Next 16 deprecated it in favour of `preload` — image.md:293). **REFINEMENT (2026-06-30, from real PSI):** the distinct, current **`fetchPriority="high"`** prop IS permitted and is the prescribed fix for the LCP image's request priority — Next's own docs recommend `fetchPriority="high"` for LCP images (image.md:287–289), and real PSI's "LCP request discovery" audit fails specifically because the hero preload lacks `fetchpriority=high`. Do not conflate `fetchPriority` (current, correct) with `priority` (deprecated, banned). Verify and correct rather than assume; eliminate any oversized/oversampled media surfaced by diagnostics.
- **D-15:** **Real PSI baseline is in hand (2026-06-30).** The owner supplied a real Google PSI run for `/` against the public Vercel preview `https://teavision-storefront.vercel.app` (see `20-PSI-EVIDENCE.md`). It confirms the preview is public and PSI-fetchable, and proves the homepage LCP gap is a **genuine, fixable defect** (2,040 ms resource-load-delay = missing `fetchpriority=high` + 540 ms render-blocking CSS + the ~142 KiB always-on Sentry chunk), NOT the simulate-throttle artifact hypothesised by research. The lab-artifact theory may still hold for the unmeasured text-LCP routes (cart/search/privacy). Plans must treat the `/` LCP fix as confirmed work, not exploratory, while Wave 1 still measures the other 8 routes on real PSI.
- **D-11:** **Fonts** — fonts are self-hosted via `next/font` (Phase 11 decision). In this Next fork, font preloads are emitted as **HTTP `Link` headers, not `<head>` tags**, and above-the-fold fonts need `preload: true` or `display: optional` will lock the fallback (see prior fonts finding; recent commit `8412b3ca` preloaded Space Mono for the utility bar). Ensure zero font-driven CLS and no render-blocking font behavior.
- **D-12:** **JS / CSS** — minimize unused/duplicate JavaScript, code-split, defer non-critical scripts, and remove render-blocking resources from the critical path; minimize/inline critical CSS and cut unused CSS. Bundle-analysis evidence should justify each change.
- **D-13:** **Caching / network / server** — verify immutable long-lived cache headers on static/`_next` assets, response compression (brotli/gzip), fast TTFB, and a minimal critical-path request count. Measure these on the preview deployment (closest to production), not just local dev.
- **D-14:** **Accessibility to 100** — close the specific Lighthouse a11y audits failing per route (contrast, accessible names/labels, landmark/heading order, etc.) **without regressing the design system**. The /account route's CLS 0.128 and any a11y gaps are explicitly in scope.

### Claude's Discretion
- Exact plan/wave decomposition, which diagnostics tools to use (Lighthouse CI, bundle analyzer, WebPageTest, PSI API), and the specific code-level remediations are at the planner's/executor's discretion **within the decision boundaries above**. Verify current file paths directly — codebase maps in `.planning/codebase/` predate the redesign and have known drift.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase & Milestone Scope
- `.planning/ROADMAP.md` — Phase 20 goal, requirements (PSI-01..PSI-15), dependencies, success criteria, plans, cross-cutting constraints.
- `.planning/REQUIREMENTS.md` — v1.5 Performance & PageSpeed 100 requirement definitions and traceability.
- `.planning/PROJECT.md` — project context, Shopify authority boundaries, conventions, launch gates.
- `.planning/STATE.md` — current position, accumulated decisions, owner-gated boundaries.

### Existing Performance Evidence & Harness (read before re-measuring)
- `docs/launch/performance-evidence.md` — latest local mobile Lighthouse evidence; 7 FAIL routes with LCP/CLS/TBT/A11y and timing/asset/layout-shift diagnostics.
- `docs/launch/performance-acceptance.md` — dated PERF-01 non-blocking acceptance Phase 20 must supersede.
- `docs/launch/final-production-readiness-report.md` — final readiness report (automated 100/100 only with performance accepted).
- `scripts/performance/probe-lighthouse.mjs` — local Lighthouse/CWV probe, warmup logic, evidence writer.
- `scripts/launch/run-final-readiness-audit.mjs` — final readiness runner and `--performance-acceptance` handling.

### Next.js 16 Docs to Read Before Code Changes
- `node_modules/next/dist/docs/01-app/02-guides/streaming.md` — streaming/Suspense; relevant to render-delay LCP and crawlable HTML.
- `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md` and `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` — Cache Components behavior (must not regress SEO).
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md` — cache/security headers.
- Next `Image`, `next/font`, and `Script` API docs under `node_modules/next/dist/docs/` — image/font/third-party-script primitives (read current versions; this fork differs from training data).

### App / Config Surfaces (verify current paths)
- `next.config.ts` — image config, headers, redirects, experimental flags (`cacheComponents`).
- `src/app/layout.tsx` — root document, `next/font` setup, `<html lang>`, global head behavior.
- `src/app/(storefront)/page.tsx` and `src/components/homepage/` — homepage hero (current LCP element) and section composition.
- `src/app/(storefront)/products/[handle]/page.tsx` — PDP gallery (LCP image), Suspense fallbacks, JSON-LD.
- `src/app/(storefront)/collections/[handle]/` — collection hero/grid (LCP image), product cards.
- `src/components/ui/product-card/` (or current location) — first-visible-card preload API.
- `src/app/(storefront)/cart/`, `src/app/(storefront)/search/`, account routes, `src/app/(storefront)/pages/` — text-LCP / render-delay / CLS routes.
- Third-party loaders: Searchanise client, Trustoo reviews adapter (`src/lib/reviews/trustoo.ts`), analytics adapter (`src/lib/analytics/`), consent leaves (Phase 16), and any `next/script` usages.
- `src/app/robots.ts`, `src/lib/seo/` — must not regress (keep preview noindex; do not break Phase 18/19 SEO).

</canonical_refs>

<specifics>
## Specific Ideas

- The single strongest hypothesis to test first: the local-lab text-LCP of ~3.9s is a **measurement artifact** (Windows + 4× CPU throttle + simulated slow 4G + cold `_next/image` transforms), and real PSI / field LCP is already much closer to "good." If confirmed, "achieve 100" becomes largely a measurement-correctness + targeted-polish task rather than a deep rebuild — but it must be proven on real PSI, not asserted.
- The `/account` route uniquely shows CLS 0.128 (the only non-zero CLS) and is observed at `/account/login?returnTo=%2Faccount` (the login bridge) — that bridge is the concrete CLS target.
- Routes whose LCP is plain text (cart, search, privacy) have no LCP image to optimize; their lab "fix" is render-delay/measurement, not media.
- A perfect Lighthouse **Performance 100** is unusually hard for an image-rich ecommerce storefront once third-party tags load; **Accessibility (95→100), Best Practices, and SEO 100** are realistic given Phases 16/18/19. Set expectations accordingly and prioritize by impact × effort.
- Desktop PSI scores are typically much higher than mobile; capturing both clarifies which gaps are mobile-throttling-specific.

</specifics>

<deferred>
## Deferred Ideas

- DNS cutover, production-host aliasing, Search Console submission/URL inspection, and real field CrUX accumulation remain **owner/operator-gated** and post-launch; Phase 20 may seed field measurement via the preview but cannot complete CrUX collection pre-launch.
- Real Shopify hosted checkout/payment/order performance is out of scope (owner-gated; Shopify-hosted, not our render path).

</deferred>

---

*Phase: 20-pagespeed-100-perfection*
*Context gathered: 2026-06-30 via owner brief + approved recommendation*
