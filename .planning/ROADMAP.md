# Roadmap: Teavision Headless Storefront

## Milestones

- ✅ **v1.0 Headless Storefront Launch** — Phases 1–11 (shipped 2026-06-11) — see `milestones/v1.0-ROADMAP.md`
- ✅ **v1.1 Blog Performance** — Phase 12 (shipped 2026-06-12) — see `milestones/v1.1-ROADMAP.md`
- 🚧 **v1.2 SEO-Safe PLP Pagination Parity** — Phase 13 (planned 2026-06-12)

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

### 🚧 v1.2 SEO-Safe PLP Pagination Parity

- [ ] **Phase 13: Production-parity collection pagination** — Restore classic `?page=N` PLP pagination while preserving production SEO canonicals, robots behavior, and bounded Shopify Storefront GraphQL payloads. (1/1 plans ready)

## Progress

| Phase                                    | Milestone | Plans Complete | Status     | Completed  |
| ---------------------------------------- | --------- | -------------- | ---------- | ---------- |
| 1. Bulk Savings PDP and Cart Parity      | v1.0      | 1/1            | Complete   | 2026-05-26 |
| 2. Searchanise API Search Results        | v1.0      | 1/1            | Complete   | 2026-05-27 |
| 4. Footer 1:1 Parity                     | v1.0      | 1/1            | Complete   | 2026-05-29 |
| 5. Codebase Review Remediation           | v1.0      | 5/5            | Complete   | 2026-06-02 |
| 6. Prevent site indexing                 | v1.0      | 1/1            | Complete   | 2026-06-03 |
| 8. Optimized Collection Quick Add        | v1.0      | 1/1            | Complete   | 2026-06-03 |
| 9. Collection Product Card Improvements  | v1.0      | —              | Superseded | 2026-06-11 |
| 10. Cart/Checkout Critical Flow Tests    | v1.0      | 4/4            | Complete   | —          |
| 11. Full Visual Redesign                 | v1.0      | 22/22          | Complete   | 2026-06-11 |
| 12. Optimize blog loading                | v1.1      | 4/4            | Complete   | 2026-06-12 |
| 13. Production-parity collection pagination | v1.2   | 1/1            | Ready      | —          |

## Phase Details

### Phase 13: Production-parity collection pagination

**Goal:** Restore production-style `?page=N` collection pagination in the headless PLP while preserving production canonical/crawler behavior and the Phase 05-03 bounded payload contract.
**Requirements**: PLP-PAGE-01, PLP-PAGE-02, PLP-PAGE-03, PLP-PAGE-04, PLP-PAGE-05, PLP-PAGE-06
**Depends on:** Phase 12
**Plans:** 1/1 plans ready

Plans:
- [ ] 13-01: Production-Parity PLP Numbered Pagination (Wave 1)
