# Phase 18: SEO Audit Remediation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-25
**Phase:** 18-SEO Audit Remediation
**Areas discussed:** URL parity and redirect ownership, Visible H1 and collection content placement, Metadata, canonical host, robots, and blog indexation, Structured data and crawl/performance evidence, LocalBusiness schema boundary, Redirect inventory closure

---

## URL Parity and Redirect Ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Full launch inventory | Compare live/current vs headless products, collections, pages, blogs, known legacy nested product URLs, policy/search aliases, and available SEO/operator slug exports; mark Search Console and production host redirects as owner-gated where not locally provable. | ✓ |
| Audit-focused inventory | Cover only the PDF's named concerns and currently known app routes. | |
| Migration handoff register | Code handles only deterministic redirects already known in the repo; broader slug drift is documented for SEO/operator migration stage. | |

**User's choice:** Full launch inventory
**Notes:** Phase 18 should not restrict URL parity work to the audit examples.

| Option | Description | Selected |
|--------|-------------|----------|
| Deterministic + confirmed redirects | Implement redirects when the source/destination is known, stable, and locally testable; document Search Console/DNS/Vercel/Shopify-domain redirects as handoff items. | ✓ |
| Aggressive app-owned redirects | Add every plausible legacy variant found during inventory, even if some came from crawl/export inference. | |
| Minimal app-owned redirects | Only implement redirects already represented in code or required by the audit; everything else becomes a migration register. | |

**User's choice:** Deterministic and confirmed redirects
**Notes:** Inferred or operator-owned redirects should be documented, not blindly implemented.

| Option | Description | Selected |
|--------|-------------|----------|
| Assume `https://www.teavision.com.au` for launch evidence | Update code/tests/docs toward the audit's strongest URL, but keep local/staging proof clearly separate from DNS/Vercel cutover proof. | ✓ |
| Keep host fully env-driven | Do not lock the `www` host in Phase 18 context; require `SITE_URL`/`NEXT_PUBLIC_SITE_URL` to carry the final decision later. | |
| Wait for owner confirmation | Document the host choice as blocked until the owner explicitly confirms `www` vs apex. | |

**User's choice:** Assume `https://www.teavision.com.au` for launch evidence
**Notes:** Evidence should separate code behavior from DNS/Vercel/cutover proof.

| Option | Description | Selected |
|--------|-------------|----------|
| Defer canonical blog URL change | Keep `/blogs/teavision-blogs` as canonical for Phase 18, only fix tag indexation/sitemap behavior now; note `/blog/` as a migration/SEO-operator decision because changing it creates redirect and internal-link churn. | ✓ |
| Add `/blog/` as canonical now | Make `/blog/` the preferred listing URL and redirect `/blogs/teavision-blogs` to it. | |
| Support both, canonical old | Add `/blog/` as a convenience alias, but keep `/blogs/teavision-blogs` canonical. | |

**User's choice:** Defer canonical blog URL change
**Notes:** Blog URL simplification is deferred as a migration/SEO-operator decision.

---

## Visible H1 and Collection Content Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Visible H1 below banner | Keep banner art first, then show breadcrumb, visible collection H1, and brief intro before the product grid. | ✓ |
| Overlay H1 on banner | Place the H1 visually over the banner art. | |
| Keep sr-only H1 | Preserve current design and only ensure one H1 in HTML. | |

**User's choice:** Visible H1 below banner
**Notes:** This directly addresses the audit concern about hidden/non-visible collection H1 text.

| Option | Description | Selected |
|--------|-------------|----------|
| Below the product grid | Keep only breadcrumb, optional banner/hero image, visible H1, and brief intro above the grid; move long/read-more content beneath products. | ✓ |
| Collapsible above grid | Keep the current read-more disclosure before products, but make heading levels safe and compact. | |
| Remove long content from collection render | Strip it from the page entirely and rely on metadata/internal links. | |

**User's choice:** Below the product grid
**Notes:** Above-grid collection content should stay lean.

| Option | Description | Selected |
|--------|-------------|----------|
| Demote nested content headings | Preserve one page H1 only; sanitize/demote imported H1/H2 from Shopify rich content to lower levels, generally H3+ inside read-more/description blocks. | ✓ |
| Strip all imported headings | Convert imported rich-content headings to paragraphs/lists to avoid hierarchy mistakes. | |
| Preserve imported headings | Keep Shopify-authored heading tags as-is unless they duplicate the exact page title. | |

**User's choice:** Demote nested content headings
**Notes:** Existing collection helpers already do some demotion; Phase 18 should make the behavior comprehensive.

| Option | Description | Selected |
|--------|-------------|----------|
| Strict one visible PDP H1 | Product title is the only visible H1; product descriptions, recommendations, related products, reviews, and imported snippets must not emit H1. Add evidence/tests on representative PDP HTML. | ✓ |
| Strict only in product description | Sanitize PDP description HTML, but leave recommendation/review section headings to their components. | |
| Audit only obvious duplicate H1s | Fix duplicate H1s if found, without adding broader route-level assertions. | |

**User's choice:** Strict one visible PDP H1
**Notes:** Representative PDP HTML evidence/tests are expected.

---

## Metadata, Canonical Host, Robots, and Blog Indexation

| Option | Description | Selected |
|--------|-------------|----------|
| SEO-target pages only | Remove/override the suffix for homepage, collection pages, and service/landing pages targeted for SEO; allow product pages to keep the brand suffix where length is usually acceptable. | ✓ |
| All storefront pages | Remove the suffix globally so every route owns its exact title. | |
| Only pages over pixel/length threshold | Keep global behavior but override titles when evidence shows overflow. | |

**User's choice:** SEO-target pages only
**Notes:** Product pages may keep the brand suffix unless evidence shows a problem.

| Option | Description | Selected |
|--------|-------------|----------|
| Make audit fixes explicit and tested | Set root `lang="en-AU"`, disallow account/login surfaces in `robots.txt`, keep `/search` noindexed, remove blog tag pages from sitemap, and make blog tagged pages noindex/follow or noindex per evidence. | ✓ |
| Only change lang and blog tags | Leave account/login robots unchanged because protected/account routes already are not sitemap targets. | |
| Minimal metadata-only fix | Update lang and title behavior, but defer robots/sitemap changes to final SEO operator review. | |

**User's choice:** Make audit fixes explicit and tested
**Notes:** `/search` remains intentionally non-indexable from prior Phase 16 decisions.

| Option | Description | Selected |
|--------|-------------|----------|
| Code uses env, evidence assumes final `www` host | Keep `SITE_URL`/`NEXT_PUBLIC_SITE_URL` as the code path, but Phase 18 evidence/docs should validate with `https://www.teavision.com.au` as the launch target and mark DNS/Vercel redirect proof as operator-gated. | ✓ |
| Hard-code final host defaults | Change default/local fallback behavior to `https://www.teavision.com.au`. | |
| Do not assume host in evidence | Only document that the host remains pending until deployment config is finalized. | |

**User's choice:** Code uses env, evidence assumes final `www` host
**Notes:** Implementation remains configurable; evidence assumes the final host.

| Option | Description | Selected |
|--------|-------------|----------|
| Canonicalize to parent collection | Keep the existing pattern: category/filter pages may render for UX but canonical/sitemap point to the parent collection unless later SEO evidence proves a filtered URL is intentionally ranking. | ✓ |
| Make category URLs independently indexable | Allow selected category URLs to have their own canonicals and sitemap entries. | |
| Redirect category URLs to parent collection | Remove category URLs from public crawlable behavior. | |

**User's choice:** Canonicalize to parent collection
**Notes:** This preserves current UX while avoiding unnecessary indexed filtered URLs.

---

## Structured Data and Crawl/Performance Evidence

| Option | Description | Selected |
|--------|-------------|----------|
| Evidence-backed only | Add Service/LocalBusiness/FAQ/Review markup only where visible page content and trustworthy data already support it; otherwise document the gap instead of inventing schema. | ✓ |
| Audit checklist coverage | Add every schema type the audit lists across representative pages, using business defaults where needed. | |
| Minimal additions | Preserve existing Product/Organization/FAQ markup and only add validation/evidence, not new schema. | |

**User's choice:** Evidence-backed only
**Notes:** Structured data must be truthful to visible content and reliable data.

| Option | Description | Selected |
|--------|-------------|----------|
| Product aggregate ratings only when data exists | Use Trustoo/Shopify-derived rating and review count on PDP Product schema when available and visible; do not add sitewide Review schema or testimonials-as-reviews unless the visible content and source data are reliable. | ✓ |
| Add review schema to testimonials too | Mark homepage/service testimonials as Review schema where they appear. | |
| Do not add review schema | Keep reviews visual only until a post-launch review data contract is confirmed. | |

**User's choice:** Product aggregate ratings only when data exists
**Notes:** Review schema is limited to reliable PDP aggregate rating data.

| Option | Description | Selected |
|--------|-------------|----------|
| Crawlable HTML before hydration | Built production/fake-provider evidence must show representative collection and product responses include meaningful title, intro/description, product/card or buy-section content, metadata, canonical, and JSON-LD in HTML before browser hydration; broad skeletons must not mask crawl-critical content. | ✓ |
| SSR architecture proof only | Document that the routes are Server Components and Cache Components, with code references, without adding HTML-response evidence. | |
| Browser-rendered proof only | Use Playwright screenshots/DOM after hydration as sufficient crawl proof. | |

**User's choice:** Crawlable HTML before hydration
**Notes:** The audit's CSR concern should be treated as a crawlable first-response HTML/static-shell issue unless evidence proves true client-only rendering.

| Option | Description | Selected |
|--------|-------------|----------|
| Strict reconciliation with Phase 17 rules | Rerun CWV/Lighthouse after SEO fixes; performance is pass only if strict route metrics pass or a valid dated owner/staging/field acceptance artifact is supplied. Otherwise keep performance blocking and record mitigations. | ✓ |
| SEO audit threshold only | Accept improvement if audit examples improve, even if Phase 17 strict metrics still fail. | |
| Evidence-only performance | Rerun and document metrics, but do not let performance affect Phase 18 completion. | |

**User's choice:** Strict reconciliation with Phase 17 rules
**Notes:** Phase 18 must not weaken Phase 17 PERF-01 acceptance behavior.

| Option | Description | Selected |
|--------|-------------|----------|
| Audit-to-evidence matrix | A single doc mapping each PDF finding to remediation, code/tests/scripts, local proof, owner/operator handoff items, and residual risks; include URL inventory/redirect register, H1 checks, metadata/robots/sitemap checks, structured-data validation, crawlable-HTML proof, and performance evidence. | ✓ |
| Separate docs per plan | Each plan writes its own evidence doc; no consolidated final matrix. | |
| Automated output only | Rely on scripts/tests and generated reports, with minimal human-readable summary. | |

**User's choice:** Audit-to-evidence matrix
**Notes:** Final SEO evidence should be consolidated and human-readable.

---

## LocalBusiness Schema Boundary

### Required Evidence

| Option | Description | Selected |
|--------|-------------|----------|
| Visible approved details only | Add it only when approved business name/address/contact/service-area details are already visible on the page or in approved code-owned content; otherwise document the gap. | ✓ |
| Known business facts are enough | Add schema from stable business details even if some details are not visibly shown on the same page. | |
| Handoff only | Do not add LocalBusiness schema in code during Phase 18; record it for owner/SEO-operator approval after launch-domain details are confirmed. | |
| You decide | Planner chooses within the existing no-invented-schema boundary. | |

**User's choice:** Visible approved details only.
**Notes:** Phase 18 should not invent LocalBusiness schema fields for audit checklist coverage.

### First Candidate Page

| Option | Description | Selected |
|--------|-------------|----------|
| Contact page first | Use `/pages/contact` as the primary candidate because it naturally carries business identity/contact details. | ✓ |
| Homepage first | Add it beside existing Organization/WebSite schema if the homepage has enough visible approved business details. | |
| Service pages only | Add LocalBusiness only where service content already supports it, not globally. | |
| You decide | Planner chooses the page with the strongest visible evidence. | |

**User's choice:** Contact page first.
**Notes:** The contact page should be evaluated before broader sitewide placement.

### Visibility Rule

| Option | Description | Selected |
|--------|-------------|----------|
| Strict same page | Every LocalBusiness field emitted in JSON-LD must be visibly present on that page, except universal URL/logo/name basics already present in site chrome. | ✓ |
| Nearby approved site content | Fields may come from other approved site pages if they are stable and canonical. | |
| Evidence document allowed | Fields can come from an evidence matrix even if not visible on-page yet. | |
| You decide | Planner applies the safest evidence-backed interpretation. | |

**User's choice:** Strict same page.
**Notes:** Same-page visibility is the default rule for LocalBusiness fields.

### Missing Visible Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Document, don't add | Do not add that field to schema; record the missing visible evidence in the audit matrix. | ✓ |
| Add modest visible copy | Add small, factual contact/business details to the page if already approved elsewhere. | |
| Partial schema is fine | Emit only the visible fields and skip unsupported properties. | |
| You decide | Planner picks the least risky option. | |

**User's choice:** Document, don't add.
**Notes:** Unsupported fields should become evidence gaps, not invisible schema.

---

## Redirect Inventory Closure

### Local Inventory Sufficiency

| Option | Description | Selected |
|--------|-------------|----------|
| Local sources plus handoff register | Use live/headless crawls, Shopify/Sanity route helpers, current `next.config.ts`, sitemap, known legacy nested product URLs, and repo docs; owner/SEO exports become handoff items if unavailable. | ✓ |
| Require owner/SEO exports first | Do not close URL parity until Shopify export, Search Console indexed URLs, or SEO-operator slug list is supplied. | |
| Audit URLs only | Fix only URLs explicitly mentioned in the SEO audit PDF. | |
| You decide | Planner chooses based on what evidence exists during implementation. | |

**User's choice:** Local sources plus handoff register.
**Notes:** Local planning should not block on unavailable exports, but missing exports must stay visible.

### Uncertain Redirect Mappings

| Option | Description | Selected |
|--------|-------------|----------|
| Handoff register only | Only deterministic, confirmed, stable redirects enter app code; uncertain/inferred/host-level redirects stay in the migration handoff register. | ✓ |
| Temporary app redirects | Add likely mappings in app code with notes so they can be corrected later. | |
| Owner approval required | Do not implement any new redirects until the owner/SEO operator approves every mapping. | |
| You decide | Planner applies the lowest-risk redirect policy. | |

**User's choice:** Handoff register only.
**Notes:** App redirects should stay deterministic and locally testable.

### Conflict Authority

| Option | Description | Selected |
|--------|-------------|----------|
| Owner/SEO export wins | Preserve local evidence, but owner/SEO migration exports override inferred local mapping when explicit. | ✓ |
| Current live site wins | Mirror whatever `www.teavision.com.au` currently resolves to during the audit window. | |
| Headless routes win | Prefer the new app's canonical route shape unless the old URL is proven indexed. | |
| Pause and ask | Treat conflicts as blockers requiring user review before planning continues. | |

**User's choice:** Owner/SEO export wins.
**Notes:** Explicit migration/export evidence overrides inferred local mapping.

### Missing Owner/SEO Exports

| Option | Description | Selected |
|--------|-------------|----------|
| Closed locally, gated externally | Mark local deterministic redirect coverage complete, and list missing Search Console/export/DNS/host proof as owner/operator-gated residuals. | ✓ |
| Not closed | Keep URL parity incomplete until owner/SEO exports are supplied. | |
| Best-effort closed | Mark the area complete without residual risk if local crawl and sitemap checks pass. | |
| You decide | Planner chooses final evidence language based on implementation findings. | |

**User's choice:** Closed locally, gated externally.
**Notes:** Local deterministic coverage can complete while external evidence remains explicitly gated.

---

## the agent's Discretion

No selected area was delegated to the agent.

## Deferred Ideas

- `/blog/` canonical simplification and redirect can be revisited as a migration/SEO-operator decision after Phase 18.
