# Requirements: Teavision Headless Storefront — v1.7 SEO / Migration Readiness

**Defined:** 2026-07-10
**Core Value:** Customers can confidently choose the right bulk product, quantity, and price path before checkout.

## v1.7 Requirements

Requirements for this milestone. Each maps to exactly one roadmap phase. All four items are fixes to existing code identified in the external SEO consultant's migration review.

### Sitemap & URL Inventory

- [x] **SEO-01**: The SEO consultant can retrieve a complete, canonical-host URL inventory (CSV) of all routes, without exposing staging to indexing.
- [x] **SEO-02**: The URL export is secret-gated + flag-controlled (`SEO_URL_EXPORT_SECRET` / `SEO_URL_EXPORT_ENABLED`) and returns `X-Robots-Tag: noindex`; `sitemap.ts`/`robots.ts` noindex behavior is left unchanged (the test-locked noindex-mode contract is preserved).

### Heading Structure

- [ ] **SEO-03**: Product-description accordion titles render as `<h2>` (accessible; native `<details>`/`<summary>` semantics preserved, no `role="button"`/`aria-expanded` overrides).
- [ ] **SEO-04**: Collection story/read-more content headings render one level higher (source H3→H2, H4→H3) via a new isolated `collectionStory` sanitizer variant, with zero change to product-description rendering (shared `compact` variant untouched).

### Crawlable Server HTML

- [ ] **SEO-05**: Collection pages render H1 + intro + first product-grid rows in the initial server-rendered HTML (present before client JavaScript runs).
- [ ] **SEO-06**: Product pages render H1 + gallery + description + spec disclosures in the initial server-rendered HTML (present before client JavaScript runs).

## Out of Scope

Explicitly excluded for this milestone.

| Feature | Reason |
|---------|--------|
| `/blog` canonical listing migration (replace `/blogs/teavision-blogs`) | Cosmetic; no ranking benefit. Only justification was folding it into the migration 301 sheet — owner declined. `/blogs/teavision-blogs` stays. Analysis kept in `research/URL-MIGRATION.md`. |
| Decoupling `sitemap.ts` from `DISABLE_INDEXING` | Blocked by a committed regression test that locks the noindex-mode contract; the gated export route (SEO-01) is the safe alternative. |
| Slug-level 301 redirect mappings | Owned by the consultant's redirect sheet (external deliverable), applied at cutover — not app work for this milestone. SEO-01 unblocks producing that sheet. |
| Structured data (LocalBusiness / Service / FAQPage / aggregate reviews) | Deferred to the migration phase per the consultant; requires their schema templates and staging access. |
| Post-live validation (Search Console submit/inspect, production canonical validation, field CWV/LCP) | Owner/consultant-owned, performed after go-live. |
| Moving collection pagination/sort/filter off `?searchParams` to dedicated routes | Larger URL/UX refactor; not required to fix crawlability (SEO-05 uses the in-place "push dynamic access down" pattern). Possible future follow-up. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEO-01 | Phase 24 | Complete |
| SEO-02 | Phase 24 | Complete |
| SEO-03 | Phase 25 | Pending |
| SEO-04 | Phase 25 | Pending |
| SEO-05 | Phase 26 | Pending |
| SEO-06 | Phase 26 | Pending |

**Coverage:**
- v1.7 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-10*
*Last updated: 2026-07-10 after initial definition*
