---
phase: 13
slug: production-parity-collection-pagination
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-12
---

# Phase 13 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

**Audit mode:** RETROACTIVE-STRIDE — the phase PLAN.md predates formal threat modelling (no `<threat_model>` block), so the register below was constructed from the implementation files by `gsd-security-auditor`, then verified.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Browser → App Router | User-controlled URL path segments (`handle`, `category`) and query params (`page`, `sort`, `filter`) | Untrusted strings |
| App → Shopify Storefront GraphQL | `shopifyFetch()` with query variables derived from request params | Validated/allowlisted query variables |
| Shopify → Rendered HTML | Collection/product fields incl. `descriptionHtml` rendered via `dangerouslySetInnerHTML` and inline JSON-LD | Semi-trusted CMS HTML |
| App → Browser redirect | `redirect()` targets built by `getPaginationHref` from route params | Redirect `Location` paths |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-13-01 | Tampering | `parsePageParam` | mitigate | `Number.isInteger` + `< 1` guard returns 1 for all invalid `?page=` values (`page-helpers.ts`) | closed |
| T-13-02 | Tampering | `parseSelectedFilterParams` | mitigate | JSON parse + `isProductFilterInput` shape assertion; vendor/availability/category filter shapes rejected | closed |
| T-13-03 | Tampering | `sort` param | mitigate | `sortParam in SORT_MAP` allowlist; fallback `'featured'`; only enum-mapped `sortKey` reaches Shopify | closed |
| T-13-04 | Tampering / EoP | `redirect()` via `handle` | accept | `getPath` hard-prefixes `/collections/`; unknown handles hit `notFound()` before any redirect; Next.js `redirect()` rejects cross-origin targets | closed |
| T-13-05 | Tampering / EoP | `redirect()` via `category` in `getPaginationHref` | mitigate | `category` normalized via `decodeURIComponent` + `toCategoryPathSegment` (`[a-z0-9_-]` charset) before path interpolation — matches `getCategoryHref`; defense-in-depth on top of the upstream `findCategoryTagForPath`/`notFound()` guard. Fixed during this audit; unit tests cover traversal/encoded inputs | closed |
| T-13-06 | DoS | `fetchCollectionCursorIndex` chunk loop | accept | Loop bounded by Shopify catalog size; `'use cache'` + `cacheLife('hours')` prevents per-request amplification | closed |
| T-13-07 | Info Disclosure | JSON-LD inline `<script>` | mitigate | `serialize-inline-json.ts` — `JSON.stringify` + `<` → `<` escaping prevents `</script>` breakout | closed |
| T-13-08 | Info Disclosure (XSS) | `richHero.introHtml` | mitigate | `sanitizeInlineHtml` allowlist of `b/em/i/strong` only — no href/src/event attributes | closed |
| T-13-09 | Info Disclosure (XSS) | Collection `descriptionHtml` | mitigate | `sanitizeShopifyCompactHtml` via `sanitize-html` restricted tag/attr/scheme allowlist; `allowProtocolRelative: false` | closed |
| T-13-10 | Spoofing / Cache Poisoning | `'use cache'` keyed on user input | accept | Filter allowlist + enum-mapped sortKey gate every user value before cache keys; `cacheTag` scoped per collection | closed |
| T-13-11 | SSRF | `shopifyFetch` endpoint | transfer | Endpoint built from `SHOPIFY_STORE_DOMAIN` env var only; `getStorefrontEndpoint` rejects non-local test URLs in production | closed |
| T-13-12 | DoS | No rate limit on collection GETs | accept | Cacheable SSR route; rate limiting scoped to form/search surfaces per `docs/conventions.md`; volumetric abuse handled at CDN/edge | closed |
| T-13-13 | Spoofing | `SITE_URL` in prev/next hrefs | mitigate | `optionalUrlOriginEnv` strips path/query via `new URL().origin`; missing `SITE_URL` throws at startup in production | closed |
| T-13-14 | Spoofing | Category route canonical | mitigate | `[category]/page.tsx` canonical always points at parent collection (`getPath(handle)`) per D-27 | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| R-13-01 | T-13-04 | `handle` redirect targets bounded by Next.js route matching, `/collections/` hard prefix, and `notFound()` guard before any redirect | secure-phase audit | 2026-06-12 |
| R-13-02 | T-13-06 | Cursor-index loop bounded by Shopify catalog size; `cacheLife('hours')` prevents per-request amplification | secure-phase audit | 2026-06-12 |
| R-13-03 | T-13-10 | Cache keys only receive allowlisted filters and enum-mapped sort values; tags are collection-scoped | secure-phase audit | 2026-06-12 |
| R-13-04 | T-13-12 | Collection GETs are cacheable SSR; volumetric protection is a deployment-layer (CDN/edge) concern | secure-phase audit | 2026-06-12 |

*Accepted risks do not resurface in future audit runs.*

---

## Audit Notes

**T-13-05 remediation (closed during this run):** `getPaginationHref` interpolated the raw `category` route param into redirect targets ([page-helpers.ts](../../../src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts)). Exploitability was already blocked upstream — `findCategoryTagForPath` requires the decoded, lowercased category to exactly match a known tag segment (`[a-z0-9_-]`), and mismatches hit `notFound()` before any redirect — but redirect-target safety depended on a guard in a different file. Fixed by normalizing `category` through `decodeURIComponent` + `toCategoryPathSegment` inside `getPaginationHref`, matching `getCategoryHref`. Unit tests added for uppercase/encoded variants and traversal payloads (`../%2F..%2Fadmin`).

**Unregistered flags:** SUMMARY.md contains no `## Threat Flags` section (phase predates that convention). No additional attack surface beyond the register was identified.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-12 | 14 | 14 | 0 | gsd-security-auditor (retroactive-STRIDE) + orchestrator fix |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-12
