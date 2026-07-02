# Roadmap: Teavision Headless Storefront

## Milestones

- ✅ **v1.0 Headless Storefront Launch** — Phases 1–11 (shipped 2026-06-11) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.1 Blog Performance** — Phase 12 (shipped 2026-06-12) — see `milestones/v1.1-ROADMAP.md`
- ✅ **v1.2 SEO-Safe PLP Pagination Parity** — Phase 13 (shipped 2026-06-12) — see `milestones/v1.2-ROADMAP.md`
- ✅ **v1.3 Shopify Customer Accounts** — Phase 14 (shipped 2026-06-22) — see `milestones/v1.3-ROADMAP.md`
- ✅ **v1.4 Production Readiness 100/100** — Phases 15–19 (shipped 2026-06-26; H1 re-remediation 2026-06-29) — see `milestones/v1.4-ROADMAP.md`
- ✅ **v1.5 Performance & PageSpeed 100** — Phase 20 (shipped 2026-07-01, lean scope) — see `milestones/v1.5-ROADMAP.md`
- 🚧 **v1.6 Sanity CMS Homepage Integration** — Phases 21–23 (active)

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

<details open>
<summary>🚧 v1.6 Sanity CMS Homepage Integration (Phases 21–23) — ACTIVE</summary>

### Phase 21: Sanity Homepage Model and Seed

**Goal:** Add the minimal homepage singleton in the sibling `teavision-cms` Studio and seed it from the current code-owned homepage.

**Requirements:** CMS-01, CMS-02, CMS-03
**Plans:** 1

Plans:

- [x] 21-01 — Homepage singleton schema and seed script

Success criteria:

- `../teavision-cms` exposes one homepage singleton with fields for the current homepage sections in their current order.
- Section enable/disable fields are added only where the current scope needs them.
- A seed path creates or updates the homepage singleton from the current homepage content.
- The touched CMS schema and seed path pass the sibling project's relevant checks.

### Phase 22: Storefront Data and Rendering

**Goal:** Fetch typed Sanity homepage content and render it through the existing storefront homepage with visual, SEO, and commerce parity.

**Requirements:** DATA-01, DATA-02, RENDER-01, RENDER-02, QUALITY-01
**Plans:** 8 plans

Plans:

**Wave 1**
- [x] 22-01-PLAN.md — Typed Sanity homepage data boundary and fail-loud validation

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 22-02-PLAN.md — Hero, proof points, and product range CMS prop rendering

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 22-03-PLAN.md — Newsletter, private-label, and organic-herbs CMS prop rendering

**Wave 4** *(blocked on Wave 3 completion)*
- [x] 22-04-PLAN.md — Supply-chain and certification CMS prop rendering

**Wave 5** *(blocked on Wave 4 completion)*
- [ ] 22-05-PLAN.md — Testimonials and Tea Journal CMS configuration rendering

**Wave 6** *(blocked on Wave 5 completion)*
- [ ] 22-06-PLAN.md — Contact, catalogue CTA, and FAQ CMS prop rendering

**Wave 7** *(blocked on Wave 6 completion)*
- [ ] 22-07-PLAN.md — Homepage route, metadata, JSON-LD, and section-order cutover

**Wave 8** *(blocked on Wave 7 completion)*
- [ ] 22-08-PLAN.md — Final automated guards and manual `/` visual parity checkpoint

Cross-cutting constraints:
- Missing or invalid Sanity `homePage` content fails loudly; no runtime static fallback.
- Existing homepage section order, form actions, decorative motifs, Shopify commerce authority, and one-H1 behavior are preserved.
- Sanity-authored images keep stable dimensions, alt text, crop/hotspot support, and hero LCP discipline.

Success criteria:

- `/` renders seeded Sanity content through a typed server-side storefront data boundary.
- Existing homepage section order, design, forms, links, and Shopify commerce authority are preserved.
- Sanity images render with stable dimensions, alt text, crop/hotspot support, and existing hero LCP discipline.
- Homepage metadata, canonical/indexation behavior, JSON-LD, and one-H1 behavior match the v1.5 baseline.

### Phase 23: Preview, Revalidation, and No-Regression Release

**Goal:** Add secure Draft Mode preview, homepage cache revalidation, and rollout evidence that blocks any SEO or PageSpeed regression.

**Requirements:** DATA-03, PREVIEW-01, PREVIEW-02, QUALITY-02, QUALITY-03
**Plans:** 1

Success criteria:

- The signed Sanity webhook invalidates homepage cache tags without regressing existing blog revalidation.
- Editors can preview draft homepage content at `/` through secure Next Draft Mode.
- Published visitors never receive draft content, preview overlays, or stega/source-map text.
- Release evidence proves homepage SEO and PageSpeed scores are unchanged or improved; any measured drop blocks rollout or triggers rollback.

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
| 22. Storefront Data and Rendering                                 | v1.6      | 4/8            | In Progress | —          |
| 23. Preview, Revalidation, and No-Regression Release              | v1.6      | 0/1            | Not Started | —          |

## Next

Plan Phase 22. The next implementation slice should fetch typed Sanity homepage content and render it through the existing storefront while preserving SEO, PageSpeed, forms, Shopify commerce authority, and homepage visual parity.
