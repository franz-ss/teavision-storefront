# Phase 13: Production-Parity Collection Pagination - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-12
**Phase:** 13-production-parity-collection-pagination
**Areas discussed:** Cursor resolution strategy, Page size, Pager component reuse, prev/next link mechanism, Cursor index staleness, Category page canonicals, Sort/filter page reset, Pager click scroll behavior

**Session type:** Plan-validation refinement — CONTEXT.md, RESEARCH.md, and 13-01-PLAN.md already existed. The plan was validated against the live production site and the codebase before discussion; findings drove the gray areas below.

**Validation evidence gathered before discussion:**

- Production `/collections/all`: 5 pages, ~48 products/page, ~230 distinct products (under the 250/request Storefront cap).
- Production page 2 pager links to pages 1, 3, 4, 5 (full window with true last page).
- Production out-of-range pages (`?page=9`–`?page=20`) return 200 with empty listings (soft-404 pattern).
- Headless category route emits no canonical at all (latent gap).
- Next 16 Metadata API has no rel=prev/next field (checked `node_modules/next/dist/docs`).
- `SearchPagination` already implements the exact windowed pager needed.

---

## Cursor resolution strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Id-only index query | One cached lightweight request returns all page cursors + true total pages. Full pager with last page. Requires relaxing the letter of Task 2's "250" wording (payload stays tiny — ids only). | ✓ |
| Sequential cursor walk | Keep the plan as written. Deep pages slow on cache miss; pager can never show true last page. | |
| Hybrid | Index for totals, walk for rendering. Complexity disproportionate. | |

**User's choice:** Id-only index query (recommended)

### Follow-up: out-of-range pages

| Option | Description | Selected |
|--------|-------------|----------|
| Redirect to last page | No soft-404, user lands on real products. Diverges from production's 200-empty, but canonical-to-base means zero SEO risk. | ✓ |
| notFound() 404 | Strict semantics, dead end for users with stale links. | |
| 200 empty (production parity) | Exactly production's behavior, but indexable empty listing = soft-404 risk. | |

**User's choice:** Redirect to last page (recommended)

---

## Page size (24 vs 48)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep 24 | Preserves Phase 05-03 bounded payload contract; ~10 pages handled fine by windowed pager. | ✓ |
| Match 48 (production parity) | Same page count/URL→content mapping as production; doubles per-request payload; needs owner sign-off per D-09 wording. | |
| 48 but slim the query | Touches the quick-add contract (D-13); riskier this phase. | |

**User's choice:** Keep 24 (recommended)
**Notes:** Canonicals point at the base URL and paginated pages are not in the sitemap, so per-page content mapping has no SEO weight — purely a UX/perf call.

---

## Pager component reuse

| Option | Description | Selected |
|--------|-------------|----------|
| Extract ui/pagination | New `src/components/ui/pagination/` primitive (currentPage, totalPages, href-builder); SearchPagination becomes a thin wrapper; Storybook story per conventions. | ✓ |
| Route-local duplicate | Keep plan as written; two near-identical pagers to keep in sync. | |
| Generalize SearchPagination in place | A "search" component used by collections violates the folder map. | |

**User's choice:** Extract ui/pagination (recommended)

---

## prev/next link mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Hoisted `<link>` tags | Render in the page Server Component; React 19 hoists to `<head>`. Keeps D-05 and full production parity. | ✓ |
| Drop rel=prev/next | Google ignores these since 2019; would amend D-05. | |

**User's choice:** Hoisted `<link>` tags (recommended)

---

## Cursor index staleness

| Option | Description | Selected |
|--------|-------------|----------|
| Same tags + 'hours' | Identical cache policy to product fetch — both invalidate together, drift bounded to one cache window. | ✓ |
| Shorter life for the index | Independent expiry *increases* drift windows. | |
| Longer life ('days') | Wrong totals live for up to a day after catalog changes. | |

**User's choice:** Same tags + 'hours' (recommended)

### Follow-up: stale-cursor fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Treat as out-of-range | Reuse the redirect-to-last-valid-page path; one code path for both failure modes. | ✓ |
| Render what came back | Empty 200 page = the soft-404 already rejected. | |
| Force-refresh index + retry | `use cache` has no clean per-call bypass in Next 16; disproportionate complexity. | |

**User's choice:** Treat as out-of-range (recommended)

---

## Category page canonicals

| Option | Description | Selected |
|--------|-------------|----------|
| Parent collection | Canonical → `/collections/{handle}` for category pages, paginated or not — exact production parity, conservative launch posture. | ✓ |
| Category base URL | First-class category landing pages; deliberate divergence during migration window. | |
| Keep current behavior | No canonical at all — accidental state, unpredictable self-canonicalization. | |

**User's choice:** Parent collection (recommended)
**Notes:** Validation found the category route currently emits no canonical — a latent gap this decision also fixes.

---

## Sort/filter page reset

| Option | Description | Selected |
|--------|-------------|----------|
| Reset to page 1 | Sort/filter links drop the page param; pager links preserve sort/filters. Standard ecommerce + production behavior. | ✓ |
| Preserve current page | New ordering may not have that many pages; almost always wrong. | |

**User's choice:** Reset to page 1 (recommended)

---

## Pager click scroll behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Scroll to product grid top | Anchor/`scroll={false}`+effect; matches production's jump-to-grid feel. | ✓ |
| Default page-top scroll | Lands on hero each time. | |
| Preserve scroll position | Disorienting. | |

**User's choice:** Scroll to product grid top (recommended)

---

## Claude's Discretion

- Where the cursor-index helper lives (route-local `_lib` vs Shopify operation).
- Exact window/ellipsis shape (SearchPagination logic is the reference implementation).
- `?cursor=` param handling (redirect / noindex / ignored), as long as it is not public navigation.
- Exact scroll-to-grid mechanism (anchor target vs `scroll={false}` + effect).

## Deferred Ideas

- Category-base self-canonicals as first-class indexable landing pages (post-launch SEO).
- Matching production's 48-products-per-page size, if the owner requests it after launch.
- (Removed from deferred list: "full total-page counts if too costly" — resolved by the id-only index query.)
