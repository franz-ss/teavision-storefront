# Phase 19 Plan 01: Remediation Recommendation

**Status:** Awaiting owner/developer sign-off (decision checkpoint)
**Prepared:** 2026-06-29
**Requirement:** SEO-H1-01 — multiple / per-visit-changing H1s in the accumulated browser DOM

---

## Root Cause Confirmation

### Test evidence

The regression test `tests/e2e/h1-correctness.spec.ts` was committed and run against the current
pre-fix build (HEAD `51d5f925`). The Playwright process exited non-zero, confirming the defect is
reproducible. The test performs the soft-nav chain:

```
page.goto('/') → click /collections → click /collections/all → click /products/test-standard-tea
```

After landing on the product page it asserts via raw `locator('h1')`:
1. `locator('h1', { hasText: "Australia's #1 tea company" }).count() === 0` — FAILS pre-fix
2. `locator('h1').count() === 1` — FAILS pre-fix (count >= 2)

These failures prove the homepage H1 "Australia's #1 tea company" is present in the live DOM
while the product page is visible.

### Mechanism (D-02, locked)

`next.config.ts:9` sets `cacheComponents: true`. This activates Next.js 16's Cache Components
feature, which keeps previously-visited routes mounted in the live document inside hidden
React `<Activity mode="hidden">` (display:none) boundaries instead of unmounting them.

The controlling constant in the runtime is:

```js
// node_modules/next/dist/client/components/bfcache-state-manager.js
MAX_BF_CACHE_ENTRIES = process.env.__NEXT_CACHE_COMPONENTS ? 3 : 1
```

With `cacheComponents: true`, up to **3** prior routes stay mounted alongside the visible one.
Their full DOM — including their `<h1>` elements — remains in the live document. DOM-reading SEO
tools (e.g. Detailed SEO Extension) scan the raw DOM, not the a11y/visibility tree, so they
observe the retained H1s from previously-visited routes.

The `preserving-ui-state.md` doc (Next 16.2.9) confirms:
> "Activity keeps the DOM in the document (hidden with `display: none`), so both React state and
> DOM state are preserved."
> "Opt-out strategies are being considered for gradual migration."

There is NO per-route Activity opt-out in Next.js 16.2.9. A component-level "demote my H1 when
hidden" workaround is not viable — Activity hidden-state is not a public API.

### Why the prior rechecks missed it

The Phase 18 validation and the June 2026 recheck both validated single-route server-rendered HTML.
The defect exists only in the accumulated multi-route live browser DOM — it is structurally
invisible to any single-route probe, whether that probe runs via `curl`, `fetch`, or a single
`page.goto()` without subsequent in-page navigation.

---

## Approach Evaluation

### Approach A — Disable `cacheComponents`, migrate 5 modules to `unstable_cache`

**Mechanism:** Set `cacheComponents: false` (or remove the flag) in `next.config.ts`. The runtime
constant `MAX_BF_CACHE_ENTRIES` drops from 3 to 1, meaning prior routes are unmounted on
navigation. No hidden Activity DOM accumulates. Exactly one `<h1>` exists in the live document at
all times.

**Migration cost (measured):**

Five modules currently use `'use cache'` with `cacheLife`/`cacheTag` call sites:

| File | `'use cache'` functions | `cacheLife`/`cacheTag` calls |
|------|------------------------|------------------------------|
| `src/lib/shopify/operations/collection.ts` | 6 | 12 |
| `src/lib/shopify/operations/product.ts` | 4 | 11 |
| `src/lib/shopify/operations/storefront-page.ts` | 2 | 4 |
| `src/lib/blog/operations.ts` | 4 | 8 |
| `src/lib/reviews/trustoo.ts` | 1 | 6 |
| **Total** | **17** | **41** |

Each function needs to be rewritten from the `'use cache'` + `cacheLife`/`cacheTag` pattern to
`unstable_cache` wrapping with `{ tags: [...], revalidate: N }` options per
`caching-without-cache-components.md`. `unstable_cache` is not currently used anywhere in the
codebase — this would be a first introduction of the pattern.

Cache-tag revalidation via Shopify webhooks (`src/app/api/shopify/revalidate/route.ts`) uses
`revalidateTag()` which is compatible with both `'use cache'` tags and `unstable_cache` tags.

**Risk:**

- `'use cache'` + Cache Components also enables PPR (Partial Pre-Rendering) and streaming. The
  Phase 18 crawlable-shell work (`scripts/seo/probe-crawlable-html.mjs`) proved that server-
  rendered HTML precedes any skeleton marker. Disabling `cacheComponents` changes the streaming
  model. The probe must be re-run after the change to confirm crawlable-HTML guarantees hold.
- CWV/LCP evidence (`docs/launch/performance-evidence.md`) may need to be re-collected if
  streaming behaviour changes meaningfully.
- 17 function rewrites across 5 files is a moderate but bounded scope — all changes are in lib/
  data-fetch modules, not in UI components. No route files or component markup changes.

**Guarantee level:** ABSOLUTE. Only approach that structurally eliminates the accumulated-DOM
H1 problem. No future navigation pattern can cause H1 leakage if prior routes unmount.

**Estimated effort:** ~4–6 hours of careful migration + re-proving crawlable-HTML + updating
CWV evidence if streaming behaviour changes.

---

### Approach B — Keep `cacheComponents`, force hard (full-document) navigation on SEO-critical links

**Mechanism:** Replace `next/link` with plain `<a>` tags (or equivalent full-document navigation)
on SEO-critical product/collection links — specifically the product card links in
`src/components/collection/product-card/product-card.tsx` and collection-to-product navigation
paths. Full-document navigation prevents the `<Activity>` retention for the departing route.

**Important caveat:** `prefetch={false}` on `<Link>` does NOT stop Activity retention. Only a
true full-document navigation (hard reload, plain `<a href>`, form action, or
`window.location.assign()`) prevents the route being added to the Activity cache.

**Risk:**

- SPA UX degradation: full-page reloads on product/collection links cause visible flash,
  layout shift, and loss of client state (scroll position, cart badge animation). This is
  the primary user-facing cost.
- Weaker correctness guarantee: H1 leakage can still occur on any remaining soft-nav path
  not covered by the hard-nav change (e.g. navigation menu → product, homepage hero CTA →
  collection → product). Requires auditing every navigation path to SEO-critical pages,
  which grows as the site adds content.
- Does not fix the underlying mechanism — any future developer adding a `<Link>` to a
  product page re-introduces the defect.
- The regression test (`h1-correctness.spec.ts`) would only pass if all navigation paths to
  the product page in the test are converted to hard nav. The test would need to be updated
  to use hard navigation to match the new behaviour.

**Guarantee level:** PARTIAL. Effective only if every soft-nav path to SEO-critical pages is
covered. Difficult to maintain over time.

**Estimated effort:** ~2–3 hours for initial implementation + ongoing audit burden.

---

### Approach C — Await upstream per-route Activity opt-out (document only)

**Mechanism:** Document the defect and its root cause. Do not ship a code change until the
Next.js team provides a supported per-route or per-element Activity opt-out API.

**Current status:** The Next 16.2.9 `preserving-ui-state.md` doc states:
> "Opt-out strategies are being considered for gradual migration."

No opt-out API exists today. There is no public timeline for when one will land.

**Risk:**

- The H1 defect remains live and observable by DOM-reading SEO crawlers for an indefinite period.
- Does not satisfy the SEO-H1-01 requirement for this phase.
- Not viable as a standalone fix — cannot be shipped alone as the resolution.

**Guarantee level:** NONE (no code change shipped).

**Estimated effort:** 0 hours of implementation, indefinite wait.

---

## Recommendation

**Recommended approach: A — Disable `cacheComponents` and migrate the 5 modules to `unstable_cache`.**

Rationale:

1. **Only approach that guarantees exactly one `<h1>` in the live DOM.** Approach B provides a
   partial guarantee that erodes as the codebase evolves. Approach C ships nothing.

2. **Bounded, auditable cost.** 17 functions across 5 lib/data-fetch files. No UI component or
   route markup changes. The migration pattern (`unstable_cache` + `{ tags, revalidate }`) is
   well-documented in `caching-without-cache-components.md` and is the official supported path.
   Cache-tag revalidation via `revalidateTag()` continues to work unchanged.

3. **Re-proving crawlable-HTML is feasible.** `scripts/seo/probe-crawlable-html.mjs` provides an
   automated check that can be run immediately after the change. The Phase 18 streaming guarantee
   was about server-rendered content preceding skeleton markers — a property of Suspense boundaries
   and initial server HTML, not specifically of Cache Components streaming. This can be re-verified
   within the phase budget.

4. **The regression test passes cleanly post-fix.** The committed `h1-correctness.spec.ts` test
   uses the same soft-nav chain that currently fails — after approach A, prior routes unmount and
   the test passes without any test-file modification.

**Fallback:** If approach A reveals that disabling `cacheComponents` breaks crawlable-HTML or CWV
guarantees that cannot be restored within Phase 19's budget, fall back to approach B
(hard navigation on product card links + updated regression test) and track the upstream opt-out
(approach C) as a future improvement.

---

## Resume Signal

Reply with one of:
- `approved: A` — implement approach A (disable cacheComponents, migrate 5 modules to unstable_cache)
- `approved: B` — implement approach B (keep cacheComponents, force hard navigation on SEO-critical links)
- `approved: C` — document only, await upstream opt-out (not recommended)

Plan 19-02 will implement the approved approach.

---

## Decision: Approved — Approach A

**Date:** 2026-06-29
**Decision:** The owner/developer signed off on **Approach A**.

Plan 19-02 will:
1. Disable `cacheComponents` in `next.config.ts`.
2. Migrate the 5 `'use cache'` modules — `src/lib/blog/operations.ts`,
   `src/lib/reviews/trustoo.ts`, `src/lib/shopify/operations/collection.ts`,
   `src/lib/shopify/operations/product.ts`, `src/lib/shopify/operations/storefront-page.ts`
   (17 cached functions, 41 `cacheLife`/`cacheTag` call sites) — to `unstable_cache` +
   route-segment `revalidate` per `caching-without-cache-components.md`.
3. Re-prove crawlable-HTML (`scripts/seo/probe-crawlable-html.mjs`) and CWV evidence
   (`docs/launch/performance-evidence.md`) after the change.
4. Confirm `tests/e2e/h1-correctness.spec.ts` passes post-fix (one raw `<h1>`,
   no retained homepage H1).

---

## Decision Superseded — Approach A Rescinded (2026-06-29)

**Status:** FINAL. Supersedes the "Approved — Approach A" record above.

After Approach A was implemented in a prior session (commit `9267da5f`: disable
`cacheComponents` + migrate the 5 modules), the owner reconsidered and directed
that **`cacheComponents` must stay enabled**. Approach A was reverted (commit
`efed85b3`) — `cacheComponents: true` and all 5 `'use cache'` modules restored.

**Final resolution (see `docs/launch/seo-audit-pages-2-9-response.md`):**

- **SEO-H1-02** (banner/main-category collections show no displayed H1) — FIXED
  in code: banner collections now render a visible page-level `<h1>` + intro,
  with the breadcrumb crumb demoted to `<span aria-current="page">` (commit
  `e1c4204c`). This is the audit's actual priority (pages 2–5).
- **SEO-H1-01** (multiple H1s in the accumulated soft-nav DOM) — RESOLVED via the
  **accept + document** route (neither A, B, nor C). Verified research (Google's
  own docs) confirms Googlebot renders each URL statelessly and never assembles
  the accumulated multi-route DOM, and that multiple H1s are not a ranking/
  indexing issue regardless. The invariant that matters for search — exactly one
  visible `<h1>` per standalone route load — is enforced by the retargeted
  `tests/e2e/h1-correctness.spec.ts` and the collection SSR test.
- `cacheComponents` remains enabled; no caching architecture change shipped.

**Why A/B were not pursued:** A removes the streaming/SPA feature to fix a
condition Google never sees; B (hard navigation) is a partial, regression-prone
fix with real SPA/UX cost. Both are disproportionate to a soft-nav DOM artifact
invisible to crawlers. See the response doc for the cited evidence.
