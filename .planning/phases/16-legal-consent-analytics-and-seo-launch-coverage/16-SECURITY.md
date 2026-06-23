---
phase: 16
slug: legal-consent-analytics-and-seo-launch-coverage
status: verified
threats_open: 0
asvs_level: 1
created: 2026-06-23
---

# Phase 16 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Shopify page content to code-owned policy routes | Legal launch availability must not depend on Shopify page records. | Policy route availability and visitor-facing legal page content |
| Legacy policy URL to canonical headless URL | Redirects consolidate duplicate policy URLs before App Router page resolution. | Public request path and canonical destination |
| Draft legal wording to visitor trust | Pending owner/legal review must be visible so draft routes are not presented as final legal promises. | Draft legal wording and approval state |
| First visitor page load to browser storage | Consent defaults must be denied before optional scripts can load. | Browser storage consent state |
| Consent UI to Shopify Customer Privacy API | Browser-only Shopify APIs may be unavailable or not configured. | Consent category state to Shopify privacy bridge |
| User preference state to analytics destinations | Analytics and marketing categories gate later destination dispatch. | Optional tracking preference state |
| Browser events to analytics destinations | Event payloads leave the application boundary only after consent and env gates pass. | Non-PII storefront event metadata |
| Local/CI tests to production destinations | Tests must use fake sink and never send production analytics events. | Analytics test events |
| Lead Server Actions to analytics event layer | Submitted PII is available server-side and must not be copied into analytics payloads. | Lead success metadata only |
| CSP policy to external script hosts | Host allowlists must not be widened unless destinations are explicitly configured. | Public analytics env configuration |
| DISABLE_INDEXING env to public crawler output | Robots, sitemap, and metadata change launch visibility. | Indexability controls and crawler-facing metadata |
| Legacy URLs to canonical URLs | Redirects and canonicals consolidate duplicate policy content. | Public request path, redirect target, canonical metadata |
| Local launch probes to owner-gated external tools | Search Console cannot be automated without owner access. | Local evidence and owner-provided Search Console proof |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-16-01 | Spoofing / Repudiation | legal policy pages | mitigate | `src/lib/legal/policies.ts` centralizes policy records; policy pages render visible pending-review banners; `docs/launch/legal-approval-matrix.md` records proof and owner/legal state. Verified by `src/lib/legal/policies.test.ts`. | closed |
| T-16-02 | Tampering / SEO integrity | legacy policy redirects | mitigate | `next.config.ts` imports `getPolicyRedirects()` and appends permanent redirects from legacy `/policies/*` and `/7868339/policies/*.html` aliases to canonical `/pages/*` URLs. Redirect expectations are also represented in `src/lib/seo/launch-route-matrix.ts` and `scripts/seo/probe-launch-seo.mjs`. | closed |
| T-16-03 | Information Disclosure / Compliance | policy wording | avoid | Policy pages and `docs/launch/legal-approval-matrix.md` explicitly mark final wording and owner/legal approval as pending; no final approval is claimed. | closed |
| T-16-04 | Information Disclosure | consent defaults | mitigate | `src/lib/consent/adapter.ts` defines `DEFAULT_CONSENT` with analytics and marketing denied; unit and Playwright coverage verify first-visit denied behavior. | closed |
| T-16-05 | Tampering | consent persistence | mitigate | `src/lib/consent/storage.ts` browser-guards localStorage, parses typed consent only, rejects malformed JSON, and normalizes `essential: true`; `src/lib/consent/adapter.test.ts` covers malformed storage and essential lock behavior. | closed |
| T-16-06 | Information Disclosure | Shopify privacy bridge | mitigate | `src/lib/consent/shopify-customer-privacy.ts` is browser-only, maps consent categories to Shopify visitor consent, and returns typed `unavailable` or `failed` states instead of throwing when Shopify APIs are absent. | closed |
| T-16-07 | Information Disclosure | analytics destination loader | mitigate | `src/components/analytics/destination-loader/destination-loader.tsx` returns null for fake/disabled modes and loads GA4/GTM only with analytics consent, Meta/Klaviyo only with marketing consent, and public env IDs. | closed |
| T-16-08 | Tampering | CI analytics data | mitigate | `src/lib/analytics/destinations/fake.ts` provides the local/CI sink; `src/lib/analytics/destinations/index.ts` defaults local and CI to fake destinations; `src/lib/analytics/adapter.test.ts` verifies fake selection and capture behavior. | closed |
| T-16-09 | Information Disclosure | lead event payloads | mitigate | `src/lib/analytics/events.ts` uses a closed event union where `lead_submit` carries only `kind`; contact, newsletter, wholesale, and NPD forms dispatch only `createLeadSubmitEvent(...)` after successful actions. Tests assert forbidden PII keys are absent from events and GA4 payloads. | closed |
| T-16-10 | Elevation of Privilege / Tampering | CSP analytics hosts | mitigate | `src/lib/security/headers.ts` adds GA4/GTM/Meta/Klaviyo/Shopify pixel hosts only when corresponding public env gates are configured; `src/lib/security/headers.test.ts` verifies empty-env and env-enabled cases. | closed |
| T-16-11 | Repudiation / SEO integrity | launch indexing flip | mitigate | `src/lib/seo/launch-route-matrix.ts`, `src/app/sitemap.ts`, `scripts/component-contracts/noindex-mode.test.mjs`, and `scripts/seo/probe-launch-seo.mjs` provide disabled/enabled route, robots, sitemap, canonical, and noindex evidence paths. | closed |
| T-16-12 | Spoofing / SEO integrity | duplicate policy URLs | mitigate | Legal registry redirects, Next permanent redirects, SEO route expectations, policy page canonicals, and `probe-launch-seo.mjs --mode redirects` cover duplicate policy URL consolidation. | closed |
| T-16-13 | Repudiation | Search Console proof | avoid | `docs/launch/analytics-and-indexing-runbook.md` and `docs/launch/seo-route-evidence.md` document Search Console access, sitemap submission, and URL inspection as owner-gated; no submission proof is claimed without owner evidence. | closed |

*Status: open | closed*
*Disposition: mitigate (implementation required) | accept (documented risk) | transfer (third-party) | avoid (scope or claim avoided)*

---

## Summary Threat Flags

No additional threat flags were found in the Phase 16 summary artifacts.

---

## Accepted Risks Log

No accepted risks.

---

## Security Audit 2026-06-23

| Metric | Count |
|--------|-------|
| Threats found | 13 |
| Closed | 13 |
| Open | 0 |

---

## Verification Evidence

| Command | Result |
|---------|--------|
| `pnpm test:unit -- src/lib/legal/policies.test.ts src/lib/consent/adapter.test.ts src/lib/analytics/adapter.test.ts src/lib/security/headers.test.ts src/lib/seo/launch-route-matrix.test.ts src/components/analytics/destination-loader/destination-loader.test.tsx` | Passed: 6 files, 40 tests |
| `node --test scripts/component-contracts/noindex-mode.test.mjs` | Passed: 4 tests |
| `node scripts/seo/probe-launch-seo.mjs --mode runbook` | Passed: required SEO evidence and runbook headings present |
| `node scripts/seo/probe-launch-seo.mjs --mode redirects` | Passed: policy redirect helper used, privacy and terms aliases present, 8 redirects total |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-23 | 13 | 13 | 0 | Codex |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer / avoid)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-23
