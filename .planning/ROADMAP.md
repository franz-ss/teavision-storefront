# Roadmap: Teavision Headless Storefront

## Milestones

- ✅ **v1.0 Headless Storefront Launch** — Phases 1–11 (shipped 2026-06-11) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.1 Blog Performance** — Phase 12 (shipped 2026-06-12) — see `milestones/v1.1-ROADMAP.md`
- ✅ **v1.2 SEO-Safe PLP Pagination Parity** — Phase 13 (shipped 2026-06-12) — see `milestones/v1.2-ROADMAP.md`
- ✅ **v1.3 Shopify Customer Accounts** — Phase 14 (shipped 2026-06-22) — see `milestones/v1.3-ROADMAP.md`
- ✅ **v1.4 Production Readiness 100/100** — Phases 15–19 (automated code readiness complete 2026-06-26; owner-gated launch proof pending)
- 🔵 **v1.5 Performance & PageSpeed 100** — Phase 20 (planned 2026-06-30; lean scope — 1 plan; ready to execute) — replanned per owner directive to resolve exactly the homepage `/` PSI screenshot findings (hero fetchPriority, AVIF, lazy Sentry, measured inlineCss); the broad 100/100-across-4-categories plan is deferred

## Phases

<details>
<summary>✅ v1.0 Headless Storefront Launch (Phases 1–11) — SHIPPED 2026-06-11</summary>

- [x] Phase 1: Bulk Savings PDP and Cart Parity (1/1 plans) — completed 2026-05-26
- [x] Phase 2: Searchanise API Search Results (1/1 plans) — completed 2026-05-27
- [x] Phase 4: Footer 1:1 Parity (1/1 plans) — completed 2026-05-29
- [x] Phase 5: Codebase Review Remediation (5/5 plans) — completed 2026-06-02
- [x] Phase 6: Prevent the site from being indexed (1/1 plans) — completed 2026-06-03
- [x] Phase 8: Optimized Collection Quick Add (1/1 plans) — completed 2026-06-03
- [x] Phase 9: Collection Product Card Improvements — closed superseded: CARD-02..06 delivered via 11-08; CARD-01 replaced by the owner-approved vertical card
- [x] Phase 10: Cart/Checkout Critical Flow Tests (4/4 plans) — completed (verified; executed alongside the roadmap phases)
- [x] Phase 11: Full Visual Redesign (22/22 plans) — completed 2026-06-11

Full phase details: `milestones/v1.0-ROADMAP.md` · Audit: `milestones/v1.0-MILESTONE-AUDIT.md`

</details>

<details>
<summary>✅ v1.1 Blog Performance (Phase 12) — SHIPPED 2026-06-12</summary>

- [x] Phase 12: Optimize /blogs/teavision-blogs loading and image rendering (4/4 plans) — completed 2026-06-12

Full phase details: `milestones/v1.1-ROADMAP.md` · Audit: `milestones/v1.1-MILESTONE-AUDIT.md`

</details>

<details>
<summary>✅ v1.2 SEO-Safe PLP Pagination Parity (Phase 13) — SHIPPED 2026-06-12</summary>

- [x] Phase 13: Production-parity collection pagination (2/2 plans) — completed 2026-06-12

Full phase details: `milestones/v1.2-ROADMAP.md` · Audit: `milestones/v1.2-MILESTONE-AUDIT.md`

</details>

<details>
<summary>✅ v1.3 Shopify Customer Accounts (Phase 14) — SHIPPED 2026-06-22</summary>

- [x] Phase 14: Shopify Customer Accounts (9/9 plans) — completed 2026-06-22

Full phase details: `milestones/v1.3-ROADMAP.md` · Audit: `milestones/v1.3-MILESTONE-AUDIT.md`

</details>

### ✅ v1.4 Production Readiness 100/100

- [x] **Phase 15: Security, Dependency, and Runtime Header Hardening** — remove known security launch blockers, add tested production headers/CSP, fix account OAuth-start behavior, and make abuse controls explicit. (5/5 plans complete) (completed 2026-06-22)
- [x] **Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage** — close legal/policy route gaps, consent-aware analytics instrumentation, and launch indexing/SEO verification. (4/4 plans complete) (completed 2026-06-23)
- [x] **Phase 17: Operations, Performance, and Final Production-Readiness Audit** — add health/observability/runbook coverage, remediate performance/UX/e2e gaps, and produce the final 100/100 audit evidence. (15/15 plans complete) (completed 2026-06-26; PERF-01 accepted non-blocking via dated performance acceptance)
- [x] **Phase 18: SEO Audit Remediation** — resolve the staging-site SEO audit findings across URL parity, headings/content structure, metadata, robots/sitemap/indexation, schema, crawlable HTML, and Core Web Vitals evidence. (6/6 plans complete) (completed 2026-06-26)
- [x] **Phase 19: H1 Correctness Re-Remediation** — resolved 2026-06-29 via an owner-directed path change: SEO-H1-02 addressed (banner-collection H1 kept compact — the breadcrumb crumb — per D-08; a visible-heading trial was reverted) and SEO-H1-01 resolved via accept+document (cacheComponents kept enabled; the soft-nav accumulation is invisible to Google). Full audit pages 2-9 compliance shipped. See the Phase 19 detail § Resolution.

### 🔵 v1.5 Performance & PageSpeed 100

- [x] **Phase 20: PageSpeed 100/100 Perfection** — establish a trustworthy real-PSI measurement baseline on a public preview deployment, root-cause the accepted-but-unresolved LCP gap, then systematically remediate Core Web Vitals, JS/CSS/image/font/caching/network/third-party bottlenecks, and complete Accessibility/Best-Practices/SEO to 100 — targeting a genuine Google PageSpeed Insights 100/100 across all four categories where physically achievable, with honest documentation and best-alternative recommendations where it is not. _(replanned 2026-06-30 to lean scope — 1 plan resolving the homepage `/` PSI screenshot findings; broad plan deferred per D-16)_ (completed 2026-07-01)

## Progress

| Phase                                                             | Milestone | Plans Complete | Status     | Completed  |
| ----------------------------------------------------------------- | --------- | -------------- | ---------- | ---------- |
| 1. Bulk Savings PDP and Cart Parity                               | v1.0      | 1/1            | Complete   | 2026-05-26 |
| 2. Searchanise API Search Results                                 | v1.0      | 1/1            | Complete   | 2026-05-27 |
| 4. Footer 1:1 Parity                                              | v1.0      | 1/1            | Complete   | 2026-05-29 |
| 5. Codebase Review Remediation                                    | v1.0      | 5/5            | Complete   | 2026-06-02 |
| 6. Prevent site indexing                                          | v1.0      | 1/1            | Complete   | 2026-06-03 |
| 8. Optimized Collection Quick Add                                 | v1.0      | 1/1            | Complete   | 2026-06-03 |
| 9. Collection Product Card Improvements                           | v1.0      | —              | Superseded | 2026-06-11 |
| 10. Cart/Checkout Critical Flow Tests                             | v1.0      | 4/4            | Complete   | —          |
| 11. Full Visual Redesign                                          | v1.0      | 22/22          | Complete   | 2026-06-11 |
| 12. Optimize blog loading                                         | v1.1      | 4/4            | Complete   | 2026-06-12 |
| 13. Production-parity collection pagination                       | v1.2      | 2/2            | Complete   | 2026-06-12 |
| 14. Shopify Customer Accounts                                     | v1.3      | 9/9            | Complete   | 2026-06-22 |
| 15. Security, Dependency, and Runtime Header Hardening            | v1.4      | 5/5            | Complete   | 2026-06-22 |
| 16. Legal, Consent, Analytics, and SEO Launch Coverage            | v1.4      | 4/4            | Complete   | 2026-06-23 |
| 17. Operations, Performance, and Final Production-Readiness Audit | v1.4      | 15/15          | Complete   | 2026-06-26 |
| 18. SEO Audit Remediation                                         | v1.4      | 6/6            | Complete   | 2026-06-26 |
| 19. H1 Correctness Re-Remediation                                | v1.4      | 3/4            | Complete   | 2026-06-29 |
| 20. PageSpeed 100/100 Perfection (lean)                          | v1.5      | 1/1 | Complete   | 2026-07-01 |

## Phase Details

### Phase 15: Security, Dependency, and Runtime Header Hardening

**Goal:** Remove known security launch blockers and establish tested runtime protections before adding or verifying additional third-party integrations.

**Requirements:** SEC-01, SEC-02, SEC-03, SEC-04, SEC-05

**Depends on:** v1.3 Customer Account implementation; local Next.js 16 docs for headers/CSP; current dependency audit output; production-readiness audit evidence from 2026-06-22.

**Success Criteria:**

1. `pnpm audit --audit-level moderate` has no critical/high findings and no launch-relevant moderate findings, or any residual dev-only moderate finding is explicitly justified with no runtime exposure.
2. Representative production responses include the approved security headers and no `x-powered-by` leakage.
3. CSP is either enforced or staged report-only with explicit source allowlists for required Next, Shopify, Sanity, Searchanise, Trustoo, analytics, image, and font assets.
4. Customer account login-start links no longer prefetch into cross-origin OAuth redirects, and production callback/logout origins match Shopify settings.
5. Form/search abuse protection is production-explicit through provider-level protection, durable limiting, or fail-closed configuration documentation.

**Notes for planning:**

- Read `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md` and `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` before code changes.
- Avoid nonce CSP unless the plan explicitly accepts the dynamic-rendering/PPR trade-offs.
- Keep rate-limit improvements aligned with existing `src/lib/rate-limit/` boundaries and `.env.example`.

**Plans:**

**Wave 1**

- [ ] `15-01` — Dependency Audit Remediation and Evidence

**Wave 2** _(blocked on Wave 1 completion)_

- [ ] `15-02` — Security Headers and Report-Only CSP Baseline
- [ ] `15-03` — Customer Account OAuth-Start Prefetch and Origin Hardening
- [ ] `15-04` — Public Form and Search Abuse-Control Posture

**Wave 3** _(blocked on Wave 2 completion)_

- [ ] `15-05` — Final Runtime Security Probe and Phase Evidence

**Cross-cutting constraints:**

- Live Shopify Customer Account OAuth, hosted checkout, payment, shipping, tax, order, and success-redirect testing remain owner-gated unless approval is recorded.
- Phase 15 evidence must separate automated local/fake proof from owner/admin-gated live proof.
- Dependency remediation must avoid `pnpm codegen` and generated Shopify type churn unless an upgrade genuinely requires it.

### Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage

**Goal:** Close trust, compliance, conversion-measurement, and launch-indexing gaps that block a production-ready ecommerce launch.

**Requirements:** LEGAL-01, LEGAL-02, SEO-01, CONSENT-01, CONSENT-02, ANALYTICS-01, ANALYTICS-02, ANALYTICS-03

**Depends on:** Phase 15 CSP/security policy; owner-approved legal/policy content or placeholders; confirmed analytics destinations; Shopify Customer Privacy API decision.

**Success Criteria:**

1. Privacy, terms, shipping, returns/refunds, cookie/privacy preferences, footer legal links, `/policies/*`, and legacy Shopify policy URLs resolve or redirect without 404s.
2. Launch indexing can be flipped safely with verified robots, sitemap, canonical, noindex, and structured-data behavior.
3. Consent defaults are initialized before analytics or advertising tags can load, and Shopify Customer Privacy API usage is wired or explicitly ruled out.
4. Ecommerce analytics events are emitted through a typed consent-aware adapter and verified against fake or approved destinations.
5. The launch runbook includes pre-cutover and post-cutover analytics destination verification steps.

**Notes for planning:**

- Do not invent legal promises; route/content scaffolding can land before owner/legal copy approval only if the limitation is documented.
- Confirm whether GA4, GTM, Meta, Klaviyo, Shopify pixels, and Search Console are available before implementation.
- Analytics tests must not send real production events from CI.

**Plans:**

**Wave 1**

- [x] `16-01` — Legal Policy Route Foundation
- [x] `16-02` — Consent Foundation and Preferences

**Wave 2** _(blocked on Wave 1 completion)_

- [x] `16-03` — Consent-Aware Analytics Instrumentation
- [x] `16-04` — Launch SEO Route Matrix and Evidence

### Phase 17: Operations, Performance, and Final Production-Readiness Audit

**Goal:** Prove the storefront is operationally ready to launch with monitoring, performance, e2e, owner-gated Shopify test evidence, and a repeatable final 100/100 readiness audit.

**Requirements:** OPS-01, OPS-02, OPS-03, OPS-04, PERF-01, UX-01, QA-01, QA-02, QA-03

**Depends on:** Phases 15 and 16; chosen production hosting/monitoring stack; store-owner approval for hosted checkout/payment/order testing; Shopify admin test configuration.

**Success Criteria:**

1. A safe health/readiness endpoint reports deploy readiness without exposing secrets, tokens, customer PII, or raw provider payloads.
2. The chosen monitoring/logging stack captures app errors, checkout failures, provider failures, route/action failures, release context, and alerts or escalation paths.
3. Home and PDP performance evidence no longer shows launch-blocking LCP regressions, or dated acceptance marks local lab failures non-blocking; audit UX/accessibility polish items are resolved or explicitly non-blocking.
4. Local production e2e runs from a controlled server lifecycle and passes without depending on a pre-existing dev server.
5. A final production-readiness report proves all automated checks and records owner-approved Shopify hosted checkout, payment, shipping, tax, order, success redirect, Customer Account OAuth, protected customer data, and B2B pricing evidence or explicit owner-blocked status.

**Notes for planning:**

- Do not run real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests without store-owner approval.
- If production hosting is not Vercel, map observability requirements to the actual provider rather than assuming Vercel-specific APIs.
- The final report is the source of truth for the requested production-readiness score.

**Plans:**

**Wave 1**

- `17-01` - Safe health/readiness endpoint, private deep readiness probe, and operations runbook.
- `17-02` - Sentry-style observability, typed redacted logging, and launch watch routing.

**Wave 2** _(blocked on Wave 1 completion)_

- `17-03` - Production-like fake-provider e2e lifecycle and evidence.
- `17-04` - Performance, Core Web Vitals, duplicate skip-link, and UX/accessibility evidence.

**Wave 3** _(blocked on Waves 1-2 completion)_

- `17-05` - Final production-readiness audit runner and separated automated/owner-gated report.

**Wave 4** _(blocked on Wave 3 completion; closes verification gaps)_

- `17-06` - Strict performance readiness semantics, owned live-server final audit probes, and regenerated honest launch evidence.

**Wave 5** _(blocked on Wave 4 completion; closes remaining verification gaps)_

- `17-07` - Launch-indexing lifecycle and enabled SEO evidence remediation.
- `17-08` - Performance diagnostics, route LCP/CLS remediation, and validated performance acceptance path.

**Wave 6** _(blocked on Wave 5 completion; final post-gap evidence)_

- `17-09` - Final post-gap readiness evidence reconciliation and Phase 17 verification update.

**Wave 7** _(blocked on Wave 6 completion; closes remaining PERF-01 blocker)_

- `17-10` - Performance lab root-cause diagnostics, shared shell remediation, and final PERF-01 closure evidence.

**Wave 8** _(blocked on Wave 7 completion; final manual PERF-01 acceptance/evidence gate)_

- `17-11` - Dated performance acceptance, refreshed final readiness, and Phase 17 verification closure.

**Wave 9** _(blocked on Wave 8 completion; closes remaining PERF-01 implementation blockers)_

- `17-12` - Image-resource LCP remediation for Home/PDP/PLP routes.
- `17-13` - Font, cart, search, and privacy text-LCP shell remediation.

**Wave 10** _(blocked on Wave 9 completion; closes account CLS and render-shell regression coverage)_

- `17-14` - Account CLS stabilization and render-shell contract remediation.

**Wave 12** _(blocked on Wave 11 completion; revised PERF-01 remediation and final evidence gate)_

- `17-15` - Account/image contract drift remediation, rejected direct local AVIF evidence, dated performance acceptance, readiness, and Phase 17 verification gate.

**Cross-cutting constraints:**

- Owner-gated Shopify hosted checkout, payment, shipping, tax, order creation, success redirect, live Customer Account OAuth, protected customer data, B2B/customer pricing, and Search Console proof must remain `approved`, `pending`, or `owner-blocked`; automated code readiness must not fabricate those approvals.
- Public health/readiness and observability outputs must never expose secrets, tokens, customer PII, raw provider payloads, cart IDs, order IDs, checkout URLs, or submitted message bodies.

### Phase 18: SEO Audit Remediation

**Goal:** Resolve the 2026-06-25 staging-site SEO audit findings while preserving the headless Shopify architecture, Next.js 16 Cache Components patterns, and existing owner-gated launch boundaries.

**Requirements:** SEO-AUDIT-01 URL parity and redirect coverage; SEO-AUDIT-02 visible, singular page H1 structure; SEO-AUDIT-03 collection read-more content placement; SEO-AUDIT-04 title, meta, canonical, language, robots, sitemap, and blog indexation correctness; SEO-AUDIT-05 structured-data coverage; SEO-AUDIT-06 crawlable server-rendered HTML for collection/product pages; SEO-AUDIT-07 Core Web Vitals/LCP evidence reconciliation.

**Depends on:** Phase 17 performance/readiness evidence; final production domain decision (`https://www.teavision.com.au`); SEO audit PDF at `D:\Downloads\SEO Audit - Teavision Staging Site.pdf`; Shopify migration slug inventory and redirect ownership decisions.

**Success Criteria:**

1. Live/current-site and headless route inventories confirm which product, collection, page, and blog slugs are unchanged and which require permanent redirects.
2. Collection and product pages render exactly one visible H1 in the crawlable HTML, and migrated rich content cannot introduce extra H1/H2 headings above the intended hierarchy.
3. Collection pages keep only breadcrumb, optional banner image, visible H1, and brief intro before the product grid; long/read-more content is moved below the grid.
4. SEO-targeted page titles no longer inherit an unwanted global brand suffix, `lang` is `en-AU`, canonical/sitemap URLs use the final strongest URL, robots disallow account/login surfaces, and blog tagged pages are noindexed and omitted from the sitemap.
5. Structured data is present and validated for the appropriate page types: existing Product/Organization markup is preserved, service/local business/FAQ/review markup is added only where supported by visible content and reliable data.
6. Built production/fake-provider evidence shows collection and product pages expose meaningful HTML before hydration; broad loading skeletons no longer mask crawl-critical title, intro, product, or metadata content.
7. Core Web Vitals evidence is rerun after remediation, with LCP/render-blocking/unused-JS findings either passing or reconciled against Phase 17 PERF-01 acceptance rules.

**Notes for planning:**

- Read the local Next.js 16 docs for metadata, streaming, and Cache Components before changing Suspense or route-level rendering behavior.
- Treat the audit's "CSR issue" as a crawlable-HTML/static-shell problem unless new evidence proves truly client-only rendering.
- Do not run real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, or success-redirect tests as part of this SEO phase without explicit owner approval.
- Coordinate final host redirects, Search Console, and migration-stage 301s as owner/SEO-operator handoff items when they cannot be proven locally.

**Plans:**

**Wave 1**

- [x] `18-01` - SEO audit inventory, URL parity map, and redirect decision register.
- [x] `18-02` - Collection and product heading/content hierarchy remediation.

**Wave 2** _(blocked on Wave 1 findings)_

- [x] `18-03` - Metadata, canonical, robots, sitemap, language, domain, and blog indexation remediation.
- [x] `18-04` - Structured-data audit, fill, and validation.

**Wave 3** _(blocked on Waves 1-2 completion)_

- [x] `18-05` - Crawlable HTML, Core Web Vitals, and final SEO evidence pack.

**Wave 4** _(UAT gap closure)_

- [x] `18-06` - Product JSON-LD probe path semantics for fake-provider and real-Shopify data sources.

**Cross-cutting constraints:**

- Keep storefront data flowing through Shopify/Sanity operation helpers; do not add stub SEO data when credentials or content are missing.
- Keep route components server-first and push client code to interactive leaves only.
- Redirect and final-domain evidence must distinguish local code behavior from production DNS/Vercel/Shopify/Search Console configuration.

### Phase 19: H1 Correctness Re-Remediation

**Goal:** Eliminate the two genuinely-open H1-correctness defects surfaced by the 2026-06-29 re-analysis of the staging SEO audit while preserving Phase 18 outcomes: (1) multiple / per-visit-changing H1s in the accumulated live browser DOM on collection and product pages, caused by Next.js 16 Cache Components keeping previously-visited routes mounted in hidden `<Activity>` boundaries; and (2) the non-visible 11px breadcrumb-styled collection H1 in banner mode. Restore a single, visible, deterministic H1 per page in the real browser DOM without regressing Phase 18's crawlable-HTML, metadata, indexation, or streaming evidence.

**Requirements:** SEO-H1-01 exactly one H1 in the accumulated live DOM after multi-route client navigation (proven by a raw-DOM regression test, not single-route HTML only); SEO-H1-02 every collection page — including banner-image/main-category collections — renders a single visible page-level H1 (not an 11px breadcrumb crumb), at heading prominence consistent with the green-band and rich-hero variants; SEO-H1-03 the remediation re-proves Phase 18 outcomes (crawlable server HTML, one-visible-H1 single-route guarantees, metadata/canonical/robots/sitemap, structured data) via existing probes/tests.

**Depends on:** Phase 18 SEO Audit Remediation (closed); 2026-06-29 audit re-analysis `docs/launch/seo-audit-staging-analysis.md`; Next.js 16.2.9 Cache Components / Activity (preserving UI state) and streaming docs under `node_modules/next/dist/docs/`; final production host decision `https://www.teavision.com.au`.

**Success Criteria:**

1. The Activity-DOM root cause is reproduced with a concrete probe (DevTools and/or Playwright) showing >1 `<h1>` in the accumulated DOM after `Home → ProductA → ProductB` client navigation, and the chosen remediation reduces it to exactly one visible H1.
2. A committed in-browser (Playwright or equivalent) regression test navigates multiple SEO-critical routes and asserts raw `locator('h1').count() === 1` (NOT a11y-filtered `getByRole('heading')`, which falsely passes on hidden `<Activity>` nodes), and demonstrably fails on the pre-fix build.
3. Banner-image collection pages render one visible page-level H1 below the banner; the breadcrumb current-page element is reverted to a non-H1 element; the existing collection page-content test is updated to assert the visible H1 and the single-H1 invariant.
4. The item #1 remediation approach is explicitly chosen with cost/risk rationale among: (A) disable `cacheComponents` and migrate the 5 `'use cache'` modules (41 `cacheLife`/`cacheTag` calls) to `unstable_cache` / route `revalidate`; (B) force hard navigation for SEO-critical product/collection links, keeping Cache Components; (C) document an upstream-opt-out wait with interim risk. Any caching/streaming change is re-validated against Phase 18 crawlable-HTML and CWV evidence.
5. The two stale closeout docs (`.planning/forensics/seo-audit-recheck-20260626.md`, `docs/launch/seo-team-recheck-report.md`) are corrected to state that single-route HTML was clean but the multi-route accumulated DOM was the actual H1 defect.
6. Design sign-off is captured for the banner-mode visible-H1 treatment before implementation (honoring the project preview-designs-first rule), since it reverses the deliberate Phase 18 "compact banner heading" decision.

**Notes for planning:**

- Read the local Next.js 16 docs for Cache Components, Activity / preserving UI state, and streaming before changing route retention or Suspense behavior.
- Reproduce before remediating: the defect only appears in the accumulated multi-route DOM, never in single-route HTML — the Phase 18 single-route probe method cannot reproduce it. Treat reproduction + a failing regression test as the first deliverable.
- Item #2 is a small single-component visual change but reverses a shipped design decision; gate it behind a design preview and update the locking test in the same change.
- Do not regress Phase 18's one-visible-H1 single-route guarantees, metadata, canonical, robots, sitemap, or structured-data evidence.

**Plans:** 4 plans in 3 waves _(planner finalized; resolved 2026-06-29 via owner-directed path change — see Resolution)_

**Wave 1**

- [x] `19-01-PLAN.md` - Reproduced the defect (failing multi-route raw-DOM test) + confirmed Activity-DOM root cause + A/B/C evaluation (decision checkpoint). _The "Approach A" decision was later superseded — see Resolution._

**Wave 2** _(blocked on 19-01 decision)_

- [x] ~~`19-02-PLAN.md`~~ - **ABANDONED.** Approach A (disable cacheComponents) was implemented in a prior session (`9267da5f`) then **reverted** (`efed85b3`) at owner direction; SEO-H1-01 resolved via accept+document instead.
- [x] ~~`19-03-PLAN.md`~~ - Banner-mode visible H1 (item #2) was implemented (`e1c4204c`) then **reverted** (`48193d0d`): owner upheld D-08, so the banner H1 stays compact (the breadcrumb crumb). The page-content test re-locks the crumb-as-H1.

**Wave 3** _(blocked on Wave 2)_

- [x] `19-04-PLAN.md` - Stale closeout docs reconciled and an authoritative, cited audit response written: `docs/launch/seo-audit-pages-2-9-response.md` (`92bf4187`).

**Resolution (2026-06-29):** Mid-execution the owner directed that `cacheComponents` stay enabled, so the planned Approach A (19-02) was reverted. SEO-H1-01 was re-scoped from "exactly one H1 in the accumulated soft-nav DOM" to the search-relevant invariant — exactly one visible H1 per **standalone** route load (what Googlebot actually indexes) — and the soft-nav accumulation was documented (with cited Google docs) as a condition Google never assembles. SEO-H1-02 was addressed by keeping the banner H1 compact (the breadcrumb crumb, D-08): a visible-heading trial (`e1c4204c`) was reverted (`48193d0d`). The broader audit pages 2-9 were also brought into compliance: brand-suffix removal on indexed service pages (`363f7256`); read-more-below-grid and `lang=en-AU` were already in place; the blog `/blog/` slug is deferred to migration (per the auditor). cacheComponents remains enabled.

**Cross-cutting constraints:**

- Keep storefront routes server-first; push client behavior to interactive leaves only.
- Preserve the warm/botanical design system; make H1s visible without introducing cool grays or hidden text.
- Evidence must distinguish local code behavior from production DNS/Vercel/host configuration.

### Phase 20: PageSpeed 100/100 Perfection

**Goal:** Achieve the highest attainable Google PageSpeed Insights / Lighthouse scores — targeting a genuine **100 across Performance, Accessibility, Best Practices, and SEO** on the representative routes — by first establishing a trustworthy **real-PSI measurement baseline** on a public preview deployment, **root-causing** the accepted-but-unresolved Phase 17 LCP gap, then systematically remediating Core Web Vitals (LCP, INP, CLS) and JS/CSS/image/font/caching/network/third-party bottlenecks, while honestly documenting and recommending the best alternative wherever a perfect score is constrained by platform, browser, third-party, or field-data realities.

**Requirements:** PSI-01, PSI-02, PSI-03, PSI-04, PSI-05, PSI-06, PSI-07, PSI-08, PSI-09, PSI-10, PSI-11, PSI-12, PSI-13, PSI-14, PSI-15

**Depends on:** Phase 17 performance evidence/harness (`scripts/performance/probe-lighthouse.mjs`, `docs/launch/performance-evidence.md`, `docs/launch/performance-acceptance.md`); Phase 18 crawlable-HTML and Phase 19 single-H1/SEO evidence (must not regress); a public, fetchable, noindexed preview deployment (Vercel preview or equivalent) reachable by Google PSI; local Next.js 16 docs for image/font/script/streaming/Cache Components; owner-gated launch boundaries (no real Shopify checkout/OAuth tests; preview stays noindex).

**Success Criteria:**

1. A public, fetchable, **noindexed** preview deployment exists and **real Google PageSpeed Insights** (mobile + desktop) results are captured as committed evidence for every representative route, alongside the existing local Lighthouse harness, with the local harness reconciled against real PSI.
2. The Phase 17 local-lab LCP/FCP discrepancy is **reproduced and root-caused per route** (true LCP element/resource and the genuine bottleneck — lab artifact vs. real defect — identified) before remediation begins.
3. **Core Web Vitals** are "good" on real PSI/reconciled lab across the representative routes: LCP ≤ 2.5 s, CLS ≤ 0.1 (including `/account`, currently 0.128), and INP ≤ 200 ms / minimal TBT.
4. **Resource bottlenecks** are remediated and evidenced: unused/duplicate/render-blocking JavaScript reduced; render-blocking/unused CSS reduced; images use correct format/sizes/dimensions/preload with no oversized media; fonts are non-render-blocking with zero font-driven CLS; static assets carry long-lived cache headers with compression and fast TTFB.
5. **Third-party scripts** (Searchanise, Trustoo, analytics, Shopify) are consent-gated/lazy/deferred/facade-loaded off the critical path, AND the "production tags live" performance ceiling is **measured and documented** as an explicit limitation with the best-achievable alternative.
6. **Accessibility, Best Practices, and SEO** each score **100** on the representative routes (closing the current 95–97 accessibility gap) without regressing the warm/botanical design system or Phase 18/19 SEO/crawlability evidence.
7. A **prioritized (impact × effort) remediation roadmap** and a **final evidence pack** document the achieved scores per route/category/device, explicitly state where a perfect 100 is and is not realistically achievable and the best alternative, and **supersede or update** the PERF-01 non-blocking acceptance with the real result (genuine pass or honest documented ceiling — no fabricated pass).

**Notes for planning:**

- **Reproduce and measure before remediating.** Phase 17 exhausted the obvious image/LCP work and still failed local lab; the FCP (~1.2 s) → text-LCP (~3.9 s) gap on text-LCP routes is the fingerprint of local-lab measurement noise. Treat a real-PSI baseline + root cause as the first deliverable; do not start another image-compression round against an unverified number.
- The preview deployment must be **publicly fetchable by Google** (no Vercel/password auth wall) yet **noindex** so it never gets indexed or competes with the live legacy site.
- Read the local Next.js 16 docs for `Image`, `next/font`, `Script`, streaming, and Cache Components before changing render/streaming behavior — this fork differs from training data. Font preloads in this fork emit as HTTP `Link` headers, not `<head>` tags.
- Any Cache Components/streaming change must be re-validated against Phase 18 crawlable-HTML and Phase 19 single-visible-H1 evidence. `cacheComponents` stays enabled (Phase 19 owner decision) unless a diagnosed, owner-approved exception is recorded.
- A perfect Performance 100 with production third-party tags live is likely unattainable; quantify and document that ceiling rather than hiding it. Accessibility/Best-Practices/SEO 100 are realistic.
- Do not run real Shopify hosted checkout, payment, shipping, tax, order, success-redirect, or live Customer Account OAuth tests as part of this phase without explicit owner approval.

**Plans:** 1/1 plans complete

- [ ] `20-01` — **Lean homepage `/` Performance fixes** (resolves exactly the PSI screenshot findings, `20-PSI-EVIDENCE.md`): (1) hero `fetchPriority="high"` (kills the 2,040 ms resource-load-delay), (2) AVIF output (`images.formats`), (3) lazy-load the ~142 KiB client Sentry SDK (clears unused + legacy JS), (4) `experimental.inlineCss` only if measured-beneficial (the 540 ms render-blocking CSS), plus a regression sweep + before/after evidence note. _(checkpoint: the inlineCss go/no-go is gated on a real-PSI re-measure)_

**Deferred (post-lean, not deleted — `deferred/`):** full PSI harness, `/account` CLS, Accessibility/Best-Practices/SEO→100, font cleanup, collection-preload/PDP/caching tuning, tags-live third-party ceiling, supersede PERF-01. The "100/100 across all four categories" ambition is paused in favour of the targeted homepage Performance fixes.

**Cross-cutting constraints:**

- Keep storefront routes server-first; push client behavior to interactive leaves only; no `any`, no default component exports, Tailwind token classes with `cn()`, warm/botanical palette (no cool grays).
- Do not regress Phase 18 crawlable-HTML, Phase 19 single-visible-H1, or metadata/canonical/robots/sitemap/structured-data evidence to win a performance metric.
- Evidence must distinguish real PSI / preview-deployment behavior from local-lab numbers and from owner-gated production DNS/host/Search Console configuration.
- The preview deployment stays noindexed; owner-gated Shopify/admin/Search Console proof remains pending and is never fabricated.

## Next

**v1.5 Performance & PageSpeed 100 — Phase 20 is PLANNED (lean scope) and ready to execute (2026-06-30).** Per owner directive, Phase 20 was replanned down to **1 lean plan** (`20-01`) that resolves exactly the four homepage `/` PSI screenshot findings — hero `fetchPriority="high"`, AVIF output, lazy-loaded client Sentry SDK, and a measured `experimental.inlineCss` decision — minimal, architecture-preserving, no regressions. The broad 5-wave "100/100 across four categories" plan is deferred (`deferred/`). Execute with `/gsd-execute-phase 20`; the only checkpoint is the inlineCss go/no-go, gated on a real-PSI re-measure of `/`.

Phase 19 (H1 Correctness Re-Remediation) is **complete (2026-06-29)**. The two open H1 defects from the 2026-06-29 audit re-analysis (`docs/launch/seo-audit-staging-analysis.md`) are resolved: SEO-H1-02 via a compact banner-collection H1 (the breadcrumb crumb; a larger heading was trialled and reverted per D-08), and SEO-H1-01 via accept+document (cacheComponents kept enabled; the soft-nav accumulation is invisible to Google — see `docs/launch/seo-audit-pages-2-9-response.md`). Full audit pages 2-9 compliance shipped. v1.4 automated code readiness remains complete (Phase 17 15/15, PERF-01 accepted non-blocking, Phase 18 SEO audit remediation complete); owner-gated Shopify/admin/Search Console proof and the blog `/blog/` migration redirect remain pending outside the automated score.
