# Roadmap: Teavision Headless Storefront

## Milestones

- ✅ **v1.0 Headless Storefront Launch** — Phases 1–11 (shipped 2026-06-11) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.1 Blog Performance** — Phase 12 (shipped 2026-06-12) — see `milestones/v1.1-ROADMAP.md`
- ✅ **v1.2 SEO-Safe PLP Pagination Parity** — Phase 13 (shipped 2026-06-12) — see `milestones/v1.2-ROADMAP.md`
- ✅ **v1.3 Shopify Customer Accounts** — Phase 14 (shipped 2026-06-22) — see `milestones/v1.3-ROADMAP.md`
- ✅ **v1.4 Production Readiness 100/100** — Phases 15–19 (shipped 2026-06-26; H1 re-remediation 2026-06-29) — see `milestones/v1.4-ROADMAP.md`
- ✅ **v1.5 Performance & PageSpeed 100** — Phase 20 (shipped 2026-07-01, lean scope) — see `milestones/v1.5-ROADMAP.md`
- ✅ **v1.6 Sanity CMS Homepage Integration** — Phases 21–23 (shipped 2026-07-06) — see `milestones/v1.6-ROADMAP.md`
- 🔨 **v1.7 SEO / Migration Readiness** — Phases 24–26 (in planning, started 2026-07-10)

## Phases

### 🔨 v1.7 SEO / Migration Readiness (Phases 24–26) — IN PLANNING

Source: external SEO consultant's migration review. All three phases are fixes to existing code; research in `research/SUMMARY.md`.

- [ ] Phase 24: Sitemap & URL-inventory unblock — secret-gated URL export (CSV) so the consultant can build the 301 sheet without exposing staging to indexing (SEO-01, SEO-02)
- [ ] Phase 25: Heading structure fixes — product accordion titles → H2; collection story content H3/H4 → H2/H3 via an isolated `collectionStory` sanitizer variant (SEO-03, SEO-04)
- [ ] Phase 26: Collection & product server-render shell — H1/intro/product grid into the initial server HTML to fix the CSR/thin-HTML crawlability finding (SEO-05, SEO-06)

**Dropped:** `/blog` canonical listing migration — cosmetic, owner declined; `/blogs/teavision-blogs` stays (analysis in `research/URL-MIGRATION.md`).

**Build order:** Phase 24 first (unblocks the consultant). Phases 25 and 26 are independent and can proceed in parallel.

### Phase 24: Sitemap & URL-inventory unblock

**Goal:** Provide the SEO consultant with a complete canonical-host URL inventory without weakening staging noindex protections.

**Requirements:** SEO-01, SEO-02
**Plans:** 0 plans

Plans:

- [ ] TBD (run `/gsd:plan-phase 24` to break down)

**Success Criteria**:

1. A complete CSV inventory covers every canonical storefront route required for the consultant's redirect worksheet.
2. Access requires both the URL-export feature flag and a valid secret.
3. Export responses carry an explicit noindex directive and use the canonical production host.
4. Existing `sitemap.ts` and `robots.ts` noindex behavior remains unchanged and its regression contract continues to pass.

### Phase 25: Heading structure fixes

**Goal:** Correct product and collection content heading levels without weakening native disclosure semantics or changing product-description sanitization.

**Requirements:** SEO-03, SEO-04
**Plans:** 0 plans

Plans:

- [ ] TBD (run `/gsd:plan-phase 25` to break down)

**Success Criteria**:

1. Product disclosure titles render as accessible H2 headings while retaining native `details` and `summary` behavior.
2. Collection story H3/H4 source headings render as H2/H3 through an isolated sanitizer variant.
3. Product-description rendering and the shared `compact` sanitizer contract remain unchanged.

### Phase 26: Collection & product server-render shell

**Goal:** Ensure collection and product primary content is present in the initial server-rendered HTML before client JavaScript runs.

**Requirements:** SEO-05, SEO-06
**Plans:** 0 plans

Plans:

- [ ] TBD (run `/gsd:plan-phase 26` to break down)

**Success Criteria**:

1. Collection initial HTML contains the H1, introductory content, and first product-grid rows.
2. Product initial HTML contains the H1, gallery, description, and specification disclosures.
3. Existing cache, canonical, JSON-LD, LCP, and one-H1 behavior does not regress.

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

<details>
<summary>✅ v1.4 Production Readiness 100/100 (Phases 15–19) — SHIPPED 2026-06-26</summary>

- [x] Phase 15: Security, Dependency, and Runtime Header Hardening (5/5 plans) — completed 2026-06-22
- [x] Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage (4/4 plans) — completed 2026-06-23
- [x] Phase 17: Operations, Performance, and Final Production-Readiness Audit (15/15 plans) — completed 2026-06-26 (PERF-01 accepted non-blocking via dated performance acceptance)
- [x] Phase 18: SEO Audit Remediation (6/6 plans) — completed 2026-06-26
- [x] Phase 19: H1 Correctness Re-Remediation (4/4 plans) — completed 2026-06-29

Full phase details: `milestones/v1.4-ROADMAP.md` · Audit: `milestones/v1.4-MILESTONE-AUDIT.md` (gaps_found — accepted as documentation/verification debt)

</details>

<details>
<summary>✅ v1.5 Performance & PageSpeed 100 (Phase 20, lean scope) — SHIPPED 2026-07-01</summary>

- [x] Phase 20: PageSpeed 100/100 Perfection — lean (1/1 plan) — completed 2026-07-01

Full phase details: `milestones/v1.5-ROADMAP.md` · Audit: `milestones/v1.5-MILESTONE-AUDIT.md` (tech_debt — 10/15 PSI requirements deferred per D-16)

</details>

<details>
<summary>✅ v1.6 Sanity CMS Homepage Integration (Phases 21–23) — SHIPPED 2026-07-06</summary>

- [x] Phase 21: Sanity Homepage Model and Seed (1/1 plans) — completed 2026-07-02
- [x] Phase 22: Storefront Data and Rendering (9/9 plans) — completed 2026-07-03
- [x] Phase 23: Preview, Revalidation, and No-Regression Release (1/1 plans) — completed 2026-07-06

Full phase details: `milestones/v1.6-ROADMAP.md` · Audit: `milestones/v1.6-MILESTONE-AUDIT.md` · Phase artifacts: `milestones/v1.6-phases/`

</details>

## Progress

| Phase                                                             | Milestone | Plans Complete | Status      | Completed  |
| ----------------------------------------------------------------- | --------- | -------------- | ----------- | ---------- |
| 1. Bulk Savings PDP and Cart Parity                               | v1.0      | 1/1            | Complete    | 2026-05-26 |
| 2. Searchanise API Search Results                                 | v1.0      | 1/1            | Complete    | 2026-05-27 |
| 4. Footer 1:1 Parity                                              | v1.0      | 1/1            | Complete    | 2026-05-29 |
| 5. Codebase Review Remediation                                    | v1.0      | 5/5            | Complete    | 2026-06-02 |
| 6. Prevent site indexing                                          | v1.0      | 1/1            | Complete    | 2026-06-03 |
| 8. Optimized Collection Quick Add                                 | v1.0      | 1/1            | Complete    | 2026-06-03 |
| 9. Collection Product Card Improvements                           | v1.0      | —              | Superseded  | 2026-06-11 |
| 10. Cart/Checkout Critical Flow Tests                             | v1.0      | 4/4            | Complete    | —          |
| 11. Full Visual Redesign                                          | v1.0      | 22/22          | Complete    | 2026-06-11 |
| 12. Optimize blog loading                                         | v1.1      | 4/4            | Complete    | 2026-06-12 |
| 13. Production-parity collection pagination                       | v1.2      | 2/2            | Complete    | 2026-06-12 |
| 14. Shopify Customer Accounts                                     | v1.3      | 9/9            | Complete    | 2026-06-22 |
| 15. Security, Dependency, and Runtime Header Hardening            | v1.4      | 5/5            | Complete    | 2026-06-22 |
| 16. Legal, Consent, Analytics, and SEO Launch Coverage            | v1.4      | 4/4            | Complete    | 2026-06-23 |
| 17. Operations, Performance, and Final Production-Readiness Audit | v1.4      | 15/15          | Complete    | 2026-06-26 |
| 18. SEO Audit Remediation                                         | v1.4      | 6/6            | Complete    | 2026-06-26 |
| 19. H1 Correctness Re-Remediation                                 | v1.4      | 4/4            | Complete    | 2026-06-29 |
| 20. PageSpeed 100/100 Perfection (lean)                           | v1.5      | 1/1            | Complete    | 2026-07-01 |
| 21. Sanity Homepage Model and Seed                                | v1.6      | 1/1            | Complete    | 2026-07-02 |
| 22. Storefront Data and Rendering                                 | v1.6      | 9/9            | Complete    | 2026-07-03 |
| 23. Preview, Revalidation, and No-Regression Release              | v1.6      | 1/1            | Complete    | 2026-07-06 |
| 24. Sitemap & URL-inventory unblock                               | v1.7      | 0/—            | Pending     | —          |
| 25. Heading structure fixes                                       | v1.7      | 0/—            | Pending     | —          |
| 26. Collection & product server-render shell                      | v1.7      | 0/—            | Pending     | —          |

## Next

Plan the first v1.7 phase with `/gsd:plan-phase 24` (unblocks the consultant's 301 sheet). Phases 25 and 26 are independent and can be planned in any order.

Carry forward only unrelated external launch proof gates: hosted checkout, payment, shipping, tax, order creation, success redirect, live Customer Account OAuth, protected customer data, authoritative B2B/company-location pricing, Search Console sitemap submission, and Search Console URL inspection.
