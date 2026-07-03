---
phase: 23
slug: preview-revalidation-and-no-regression-release
status: verified
threats_open: 0
asvs_level: 1
register_authored_at_plan_time: true
created: 2026-07-03
---

# Phase 23 - Security

Per-phase security contract for the homepage Draft Mode preview, Sanity homepage revalidation, and no-regression release gate.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Preview URL -> Draft Mode cookie | A URL containing a shared secret can enable a browser cookie that changes homepage rendering. | Preview secret, slug, Draft Mode cookie state |
| Draft Sanity API -> storefront render | Unpublished CMS content crosses from Sanity into a server-rendered preview response. | Draft homepage content and server-side read token |
| Published cache -> draft render | Published cached data and draft data coexist in the same route and must not contaminate each other. | Published cache tags, draft body data |
| Sanity webhook -> Next revalidation | External POST payloads can expire cache tags after signature verification. | Signed webhook payload metadata |
| Release evidence -> rollout decision | Human-supplied PSI and smoke-test proof controls whether the release proceeds. | PSI scores, smoke-test evidence, launch decision |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-23-01 | Spoofing | `src/app/api/draft/route.ts` | mitigate | `SANITY_PREVIEW_SECRET` is required and must be at least 32 chars; missing or short server config returns 500. Caller secrets use `Buffer` length guard plus `timingSafeEqual`; only slug `/` is allowed; draft existence is checked before `draftMode().enable()`. Production platform protection or rate limiting for failed `/api/draft` attempts is documented as an operational control below. Evidence: `src/app/api/draft/route.ts:10`, `src/app/api/draft/route.ts:22`, `src/app/api/draft/route.ts:26`, `src/app/api/draft/route.ts:37`, `src/app/api/draft/route.ts:48`, `src/app/api/draft/route.ts:58`, `src/app/api/draft/route.ts:67`, `src/app/api/draft/route.ts:77`, `src/app/api/draft/route.ts:86`; `src/app/api/draft/route.test.ts:47`, `src/app/api/draft/route.test.ts:61`, `src/app/api/draft/route.test.ts:79`, `src/app/api/draft/route.test.ts:146`. | closed |
| T-23-02 | Tampering | Preview slug redirect | mitigate | The route accepts only exact slug `/` and rejects missing, non-homepage, absolute, protocol-relative, and encoded-host slugs before redirecting or enabling Draft Mode. Evidence: `src/app/api/draft/route.ts:30`, `src/app/api/draft/route.ts:67`, `src/app/api/draft/route.ts:94`; `src/app/api/draft/route.test.ts:108`, `src/app/api/draft/route.test.ts:112`, `src/app/api/draft/route.test.ts:116`, `src/app/api/draft/route.test.ts:120`, `src/app/api/draft/route.test.ts:122`. | closed |
| T-23-03 | Information Disclosure | Homepage metadata, JSON-LD, robots, sitemap | mitigate | `generateMetadata()` remains on published `getHomepage()`, JSON-LD is code-owned, and tests prove Draft Mode changes body content without changing published metadata or SEO leak checks. Evidence: `src/app/(storefront)/page.tsx:28`, `src/app/(storefront)/page.tsx:57`, `src/app/(storefront)/page.tsx:65`, `src/app/(storefront)/page.tsx:70`; `src/app/(storefront)/page.test.tsx:344`, `src/app/(storefront)/page.test.tsx:384`, `src/app/(storefront)/page.test.tsx:408`, `src/app/(storefront)/page.test.tsx:428`; `docs/launch/phase-23-homepage-release-gate.md:60`. | closed |
| T-23-04 | Information Disclosure | Sanity draft content | mitigate | Draft reads use required `SANITY_API_READ_TOKEN`, a separate `perspective: 'drafts'` client with `useCdn: false` and `stega: false`, no cache tags, fail-loud validation, and no fallback to published content. Evidence: `src/lib/sanity/env.ts:26`, `src/lib/sanity/client.ts:33`, `src/lib/sanity/client.ts:35`, `src/lib/sanity/client.ts:36`, `src/lib/sanity/home-page.ts:575`, `src/lib/sanity/home-page.ts:578`; `src/lib/sanity/home-page.test.ts:324`, `src/lib/sanity/home-page.test.ts:342`, `src/lib/sanity/home-page.test.ts:355`. | closed |
| T-23-05 | Tampering | Published homepage cache | mitigate | `getHomepage()` remains the only cached/tagged published helper, while `getDraftHomepage()` calls `sanityDraftFetch()` without `cacheTag()` or `cacheLife()`; tests assert both boundaries. Evidence: `src/lib/sanity/home-page.ts:564`, `src/lib/sanity/home-page.ts:566`, `src/lib/sanity/home-page.ts:567`, `src/lib/sanity/home-page.ts:575`; `src/lib/sanity/home-page.test.ts:283`, `src/lib/sanity/home-page.test.ts:342`, `src/lib/sanity/home-page.test.ts:348`, `src/lib/sanity/home-page.test.ts:349`. | closed |
| T-23-06 | Spoofing/Tampering | `src/app/api/webhooks/sanity/route.ts` | mitigate | The Sanity webhook still requires `SANITY_REVALIDATE_SECRET`, parses via `parseBody()`, rejects invalid signatures and invalid payloads, and does not revalidate on rejection. Evidence: `src/lib/sanity/env.ts:30`, `src/app/api/webhooks/sanity/route.ts:37`, `src/app/api/webhooks/sanity/route.ts:52`, `src/app/api/webhooks/sanity/route.ts:65`, `src/app/api/webhooks/sanity/route.ts:76`; `src/app/api/webhooks/sanity/route.test.ts:153`, `src/app/api/webhooks/sanity/route.test.ts:168`, `src/app/api/webhooks/sanity/route.test.ts:180`. | closed |
| T-23-07 | Information Disclosure | Webhook and preview logs | mitigate | Preview and webhook logging uses structured event names and metadata-only context; tests assert secrets, raw-body secrets, and tokens are absent from log calls. Evidence: `src/app/api/draft/route.ts:39`, `src/app/api/draft/route.ts:59`, `src/app/api/draft/route.ts:68`, `src/app/api/draft/route.ts:79`, `src/app/api/webhooks/sanity/route.ts:113`; `src/app/api/draft/route.test.ts:89`, `src/app/api/draft/route.test.ts:99`, `src/app/api/webhooks/sanity/route.test.ts:123`, `src/app/api/webhooks/sanity/route.test.ts:148`; `src/lib/observability/logger.ts:27`, `src/lib/observability/logger.test.ts:118`. | closed |
| T-23-08 | Denial of Service | Homepage revalidation | mitigate | Signed `homePage` payloads revalidate only `homePage` and `sanity-homepage`, while existing blog and article tag behavior is preserved. Evidence: `src/app/api/webhooks/sanity/route.ts:96`, `src/app/api/webhooks/sanity/route.ts:97`, `src/app/api/webhooks/sanity/route.ts:98`, `src/app/api/webhooks/sanity/route.ts:99`, `src/app/api/webhooks/sanity/route.ts:102`, `src/app/api/webhooks/sanity/route.ts:106`; `src/app/api/webhooks/sanity/route.test.ts:54`, `src/app/api/webhooks/sanity/route.test.ts:81`, `src/app/api/webhooks/sanity/route.test.ts:100`, `src/app/api/webhooks/sanity/route.test.ts:123`. | closed |
| T-23-09 | Repudiation | Release approval | mitigate | The release gate records v1.5 PSI baselines, requires current public-preview PSI URL/date/scores and Sanity publish smoke evidence, and keeps launch blocked until dated evidence exists with no category regression. Evidence: `docs/launch/phase-23-homepage-release-gate.md:5`, `docs/launch/phase-23-homepage-release-gate.md:13`, `docs/launch/phase-23-homepage-release-gate.md:28`, `docs/launch/phase-23-homepage-release-gate.md:35`, `docs/launch/phase-23-homepage-release-gate.md:39`, `docs/launch/phase-23-homepage-release-gate.md:49`, `docs/launch/phase-23-homepage-release-gate.md:75`, `docs/launch/phase-23-homepage-release-gate.md:93`; `.planning/phases/23-preview-revalidation-and-no-regression-release/23-01-SUMMARY.md:118`. | closed |
| T-23-10 | Elevation of Privilege | Preview scope creep | mitigate | Scope stays homepage-only and server-routed: no Studio preview action, Visual Editing, Presentation Tool, stega/source-map markers, in-page preview controls, or preview banner were added. Evidence: `src/app/api/draft/route.ts:67`, `src/app/api/draft/disable/route.ts:1`, `src/app/(storefront)/page.test.tsx:428`, `src/app/(storefront)/page.test.tsx:433`, `src/app/(storefront)/page.test.tsx:434`; `.planning/phases/23-preview-revalidation-and-no-regression-release/23-01-SUMMARY.md:48`, `.planning/phases/23-preview-revalidation-and-no-regression-release/23-01-SUMMARY.md:125`. | closed |
| T-23-SC | Tampering | npm/pip/cargo installs | accept | No dependency installs were planned or executed in this phase; package changes are limited to scripts/test coverage. Evidence: `.planning/phases/23-preview-revalidation-and-no-regression-release/23-01-SUMMARY.md:17`, `.planning/phases/23-preview-revalidation-and-no-regression-release/23-01-SUMMARY.md:99`; `package.json:14`, `package.json:15`. | closed |

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-23-01 | T-23-SC | Phase 23 required no npm, pip, cargo, or equivalent package installs. The accepted disposition covers the absence of new supply-chain exposure during this phase. | Phase 23 plan-time threat model | 2026-07-03 |

---

## Operational Security Notes

- `/api/draft` has strong secret validation and metadata-only rejection logging, but no app-local durable rate limiter was added. Before exposing preview broadly, configure deployment platform protection or rate limiting for failed `/api/draft` attempts. This satisfies the plan requirement to document production protection for failed preview attempts and keeps the control tied to T-23-01.
- Rollout remains blocked by design until public-preview PSI and signed Sanity `homePage` publish smoke evidence are recorded in `docs/launch/phase-23-homepage-release-gate.md`.

---

## Unregistered Flags

No `## Threat Flags` section was present in `23-01-SUMMARY.md`. Summary release caveats map to T-23-09 and are covered by the blocked release gate.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-03 | 11 | 11 | 0 | Codex gsd-secure-phase |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-03
