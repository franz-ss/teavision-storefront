---
phase: 16-legal-consent-analytics-and-seo-launch-coverage
verified: 2026-06-23T02:26:50Z
status: passed
score: 13/13 must-haves verified
overrides_applied: 0
---

# Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage Verification Report

**Phase Goal:** Close trust, compliance, conversion-measurement, and launch-indexing gaps that block a production-ready ecommerce launch.
**Verified:** 2026-06-23T02:26:50Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

The roadmap success criteria and all plan frontmatter truths were merged and deduplicated into 13 observable must-haves. SUMMARY.md claims were not used as evidence.

### Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | Legal policy and cookie preference pages resolve as code-owned App Router routes without Shopify fallback dependency. | VERIFIED | Canonical registry defines all five `/pages/*` policy hrefs in `src/lib/legal/policies.ts:35-110`; all five page files use registry metadata/canonicals and pending-review content at `src/app/(storefront)/pages/*/page.tsx:9-62`; catch-all reserved handles include the five legal handles in `src/app/(storefront)/pages/[...slug]/page.tsx:20-31`. |
| 2 | Footer legal links and legacy Shopify policy URLs resolve or redirect to canonical headless URLs. | VERIFIED | Footer imports `getFooterLegalLinks()` and requires the five canonical hrefs in `src/components/layout/footer/data.ts:1-40`; `next.config.ts:3-22` appends `getPolicyRedirects()` while preserving the collection-product redirect; redirect evidence lists `/policies/*` and `/7868339/policies/*.html` aliases in `docs/launch/legal-approval-matrix.md:37-44`. |
| 3 | Pending owner/legal review is visible and legal approval is documented without claiming final approval. | VERIFIED | Every policy page renders `Pending owner/legal review`; the matrix marks all policy approval states as `pending` and proof as pending in `docs/launch/legal-approval-matrix.md:7-29`. No final owner/legal approval is certified. |
| 4 | `/pages/cookie-preferences` is stable, linked, and provides post-choice preference controls. | VERIFIED | Cookie Preferences is in registry/footer at `src/lib/legal/policies.ts:98-107` and `src/components/layout/footer/data.ts:21-25`; the route embeds `ConsentPreferences` and support contact fallback in `src/app/(storefront)/pages/cookie-preferences/page.tsx:10-60`. |
| 5 | Consent defaults deny analytics and marketing before non-essential destinations load. | VERIFIED | `DEFAULT_CONSENT` sets `analytics: false` and `marketing: false` in `src/lib/consent/adapter.ts:15-18`; destination loader initializes with default denied state, reads stored consent after mount, and returns `null` when mode is fake/disabled in `src/components/analytics/destination-loader/destination-loader.tsx:180-247`; focused unit tests passed. |
| 6 | First-visit consent banner and preferences UI expose Accept, Reject, Manage, category controls, and persistence. | VERIFIED | Banner labels and save flow are in `src/components/consent/banner/banner.tsx:34-104`; preferences show locked Essential plus Analytics/Marketing controls and `Save consent preferences` in `src/components/consent/preferences/preferences.tsx:15-163`; local E2E file covers first visit, accept, reject, manage, save, and the route in `tests/e2e/consent.spec.ts:33-128`. |
| 7 | Shopify Customer Privacy API is behind a central browser-only boundary and safely handles unavailable API state. | VERIFIED | `applyShopifyCustomerPrivacyConsent()` returns typed `unavailable` results for server/missing Shopify APIs and applies visitor consent only after `loadFeatures` succeeds in `src/lib/consent/shopify-customer-privacy.ts:70-123`; banner and preferences call this boundary after saving consent at `banner.tsx:49` and `preferences.tsx:90`. |
| 8 | Ecommerce and lead analytics use a closed typed event union with no contact PII fields. | VERIFIED | Event union covers `product_view`, `search`, `add_to_cart`, `cart_update`, `checkout_start`, and `lead_submit` with lead kinds `newsletter`, `contact`, `wholesale`, and `npd` in `src/lib/analytics/events.ts:1-113`; adapter tests assert forbidden fields are absent and GA4 mapping omits submitted search terms/contact fields in `src/lib/analytics/adapter.test.ts:23-270`. |
| 9 | Required launch event sites route through one consent-aware client adapter. | VERIFIED | Client dispatcher reads stored consent/default denied state before `dispatchAnalyticsEvent()` in `src/lib/analytics/client.ts:10-26`; product/search/add-to-cart/cart update/remove/checkout/newsletter/contact/wholesale/NPD event calls are present in route and component leaves, e.g. `view-analytics.tsx:20-27`, `search/_components/analytics.tsx:17-21`, `use-add-to-cart.ts:56-66`, `line-actions.tsx:56-72`, `line-remove.tsx:24-42`, `checkout-form.tsx:31-47`, and lead forms at the cited component lines. |
| 10 | Analytics destinations are fake/local by default and real public destinations are env, CSP, and consent gated. | VERIFIED | `createDefaultAnalyticsDestinations()` returns fake in local/CI or explicit fake mode and only returns GA4 when configured in `src/lib/analytics/destinations/index.ts:29-43`; loader gates GA4/GTM by analytics consent and Meta/Klaviyo by marketing consent in `destination-loader.tsx:254-310`; CSP hosts are included only when public env flags/IDs are set in `src/lib/security/headers.ts:54-88`; `.env.example:45-51` documents public analytics variables only. |
| 11 | Analytics runbook includes pre-cutover/post-cutover destination verification and keeps purchase/order tracking owner-gated. | VERIFIED | Runbook lists destination statuses, pre-cutover checks, post-cutover checks, and fake/test sink at `docs/launch/analytics-and-indexing-runbook.md:11-40` and `80-88`; purchase/order analytics remain blocked until owner-approved checkout/order evidence at `docs/launch/analytics-and-indexing-runbook.md:101-115`. |
| 12 | Launch indexing can be flipped safely with robots, sitemap, canonical, noindex, structured-data, and redirect coverage. | VERIFIED | `DISABLE_INDEXING` gate is preserved in `src/lib/seo/noindex.ts:14-25`, `src/app/robots.ts:6-20`, and `src/app/sitemap.ts:36-39`; sitemap static coverage is driven by `getLaunchSeoRouteExpectations()` in `src/app/sitemap.ts:12-33`; route matrix covers legal/static/redirect surfaces in `src/lib/seo/launch-route-matrix.ts:65-166`; probe supports `disabled`, `enabled`, `redirects`, and `runbook` modes in `scripts/seo/probe-launch-seo.mjs:5-566`. |
| 13 | Owner-gated launch evidence is documented and not falsely certified. | VERIFIED | SEO evidence leaves disabled/enabled launch-host proof, product structured-data proof, and Search Console proof as pending/owner-gated in `docs/launch/seo-route-evidence.md:23-70`; runbook states Search Console submission cannot be claimed until owner proof exists at `docs/launch/analytics-and-indexing-runbook.md:117-133`; legal approval remains pending in `docs/launch/legal-approval-matrix.md:13-29`. |

**Score:** 13/13 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `src/lib/legal/policies.ts` | Canonical legal registry | VERIFIED | Exists, substantive, used by footer, redirects, route matrix, sitemap path. |
| `docs/launch/legal-approval-matrix.md` | Legal approval and redirect evidence | VERIFIED | Documents all five URLs, pending approval, proof fields, and redirect aliases. |
| `next.config.ts` | Permanent policy redirects | VERIFIED | Imports `getPolicyRedirects()` and appends permanent redirect entries. |
| `src/lib/consent/adapter.ts` | Consent model and denied defaults | VERIFIED | Defines categories, default denied optional consent, update helpers, and guards essential true. |
| `src/components/consent/banner/banner.tsx` | First-visit consent banner | VERIFIED | Client leaf, mounted in server layout, writes consent and calls Shopify boundary. |
| `src/components/consent/preferences/preferences.tsx` | Reusable preference controls | VERIFIED | Client leaf, locked essential, analytics/marketing controls, storage write. |
| `src/lib/analytics/adapter.ts` | Consent-aware analytics dispatch boundary | VERIFIED | Dispatches only to destinations allowed by consent category. |
| `src/lib/analytics/destinations/fake.ts` | Fake/test sink | VERIFIED | In-memory capture helpers for local/CI tests. |
| `docs/launch/analytics-and-indexing-runbook.md` | Analytics/indexing launch runbook | VERIFIED | Covers destination verification, indexing flip, owner-gated purchase/Search Console items. |
| `src/lib/seo/launch-route-matrix.ts` | Launch route expectations | VERIFIED | Central legal/static/redirect matrix. |
| `scripts/seo/probe-launch-seo.mjs` | Launch SEO probe | VERIFIED | Supports runbook, redirects, disabled, and enabled modes without checkout/Search Console dependencies. |
| `docs/launch/seo-route-evidence.md` | SEO route evidence | VERIFIED | Records pending/pass statuses and owner-gated Search Console proof state. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `src/lib/legal/policies.ts` | `src/components/layout/footer/data.ts` | Canonical footer legal links | WIRED | Footer imports `getFooterLegalLinks()` and throws if a required canonical href is missing. |
| `src/lib/legal/policies.ts` | `next.config.ts` | Redirect alias matrix | WIRED | Next redirects import and spread `getPolicyRedirects()`. |
| `src/app/(storefront)/layout.tsx` | `src/components/consent/banner/banner.tsx` | Client leaf mounted inside server layout | WIRED | Layout imports and renders `ConsentBanner`; layout has no `'use client'`. |
| `src/lib/consent/adapter.ts` | `src/lib/consent/shopify-customer-privacy.ts` | Shopify consent propagation boundary | WIRED | Banner/preferences save `ConsentState` and call `applyShopifyCustomerPrivacyConsent()`. |
| `src/lib/consent/adapter.ts` | `src/lib/analytics/adapter.ts` | `canUseAnalytics` and `canUseMarketing` checks | WIRED | Analytics adapter imports both category guards and checks destinations before dispatch. |
| `src/lib/security/headers.ts` | `src/components/analytics/destination-loader/destination-loader.tsx` | Env-gated host allowlists and loader config | WIRED | Same public env names gate CSP hosts and loader script rendering. |
| `src/lib/legal/policies.ts` | `src/app/sitemap.ts` | Legal page sitemap inclusion | WIRED | Sitemap uses route matrix, which derives legal route expectations from `LEGAL_POLICIES`. |
| `src/lib/seo/launch-route-matrix.ts` | `scripts/seo/probe-launch-seo.mjs` | Route expectation fixtures | WIRED | Probe parses route matrix/legal registry expectations for redirects and live SEO checks. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|---|---|---|---|---|
| Legal pages | `policy.href`, `policy.title`, `policy.status` | `getLegalPolicy()` from `LEGAL_POLICIES` | Yes - static code-owned registry | FLOWING |
| Footer links | `LEGAL_POLICY_LINKS` | `getFooterLegalLinks()` | Yes - derived from registry and required href list | FLOWING |
| Next redirects | `getPolicyRedirects()` | `LEGAL_POLICIES.redirectSources` | Yes - 8 redirect aliases | FLOWING |
| Consent banner/preferences | `ConsentState` | `readStoredConsent()`, `writeStoredConsent()` localStorage key `teavision_consent` | Yes - typed parser/write normalizer | FLOWING |
| Analytics destination loader | `consent` | `DEFAULT_CONSENT`, storage sync, `teavision:consent-changed` event | Yes - default denied, updates after saved consent | FLOWING |
| Analytics event sites | `AnalyticsEvent` | Product/search/cart/lead client leaves and form success handlers | Yes - dispatched through `dispatchClientAnalyticsEvent()` | FLOWING |
| Sitemap | `STATIC_PAGES` | `getLaunchSeoRouteExpectations()` | Yes - legal/static launch matrix plus Shopify/blog dynamic fetches | FLOWING |
| SEO probe | `expectations` | Source-parsed legal registry and route matrix | Yes - checks runbook/redirects locally and live modes when server provided | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|---|---|---|---|
| Plan artifact existence/substance | `gsd-sdk query verify.artifacts` for plans 16-01 through 16-04 | 12/12 artifacts passed | PASS |
| SEO runbook contract | `node scripts/seo/probe-launch-seo.mjs --mode runbook` | Required evidence/runbook headings present | PASS |
| Policy redirect matrix | `node scripts/seo/probe-launch-seo.mjs --mode redirects` | Registry helper used; privacy/terms aliases present; 8 redirects total | PASS |
| Noindex/sitemap contract | `node --test scripts/component-contracts/noindex-mode.test.mjs` | 4 tests passed | PASS |
| Focused Phase 16 unit/component tests | `pnpm test:unit -- src/lib/legal/policies.test.ts src/lib/consent/adapter.test.ts src/lib/analytics/adapter.test.ts src/lib/seo/launch-route-matrix.test.ts src/lib/security/headers.test.ts src/components/analytics/destination-loader/destination-loader.test.tsx "src/app/(storefront)/cart/_components/checkout-form.test.tsx"` | 7 files / 41 tests passed | PASS |
| Schema drift | `gsd-sdk query verify.schema-drift 16` | No drift, blocking false | PASS |
| Codebase drift | `gsd-sdk query verify.codebase-drift` | Warning only for unmapped baseline repo files; no Phase 16 blocker | PASS_WITH_NOTES |

Supplemental orchestrator regression evidence was also reviewed: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` (57 files / 237 tests), `pnpm test:integration` (9 files / 43 tests), and `pnpm test:e2e -- tests/e2e/consent.spec.ts` (5 tests) were reported as passed.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| LEGAL-01 | 16-01, 16-02, 16-04 | Access privacy, terms, shipping, returns/refunds, cookie/privacy preference pages without 404s | SATISFIED | Code-owned routes exist, reserved handles prevent Shopify fallback, legal route matrix includes all five legal URLs. |
| LEGAL-02 | 16-01, 16-04 | Legacy Shopify policy URLs and footer/legal links redirect or resolve correctly | SATISFIED | Footer derives links from registry; Next config uses `getPolicyRedirects()`; probe redirects mode passed. |
| SEO-01 | 16-04 | Flip launch indexing safely with robots, sitemap, canonicals, structured data, and noindex behavior verified | SATISFIED | `DISABLE_INDEXING` controls noindex/robots/sitemap; route matrix and probe cover disabled/enabled modes; owner-gated live proof documented. |
| CONSENT-01 | 16-02, 16-03 | Consent defaults set before analytics or advertising tags load | SATISFIED | Default denied optional consent, loader no-ops in fake/disabled mode, real scripts render only after stored consent grants relevant category. |
| CONSENT-02 | 16-01, 16-02, 16-03 | Shopify Customer Privacy API integration evaluated or wired where applicable | SATISFIED | Browser-only Shopify wrapper returns typed unavailable/failure/applied states and is called from banner/preferences. |
| ANALYTICS-01 | 16-03 | Consent-aware ecommerce events for product view, search, add-to-cart, cart update, checkout start, and checkout/purchase evidence where possible | SATISFIED | All required local event surfaces route through typed client adapter; purchase/order remains owner-gated per runbook. |
| ANALYTICS-02 | 16-03 | GA4, GTM, Meta, Klaviyo, or disabled/fake destinations configured safely with test evidence and no client secrets | SATISFIED | Public env vars only, fake/local default, CSP host tests, consent-gated loader, no secrets committed. |
| ANALYTICS-03 | 16-03, 16-04 | Launch runbook includes analytics destination verification before and after cutover | SATISFIED | Runbook includes analytics and indexing pre/post cutover steps plus evidence log. |

No orphaned Phase 16 requirements were found in `.planning/REQUIREMENTS.md`.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---|---|---|---|
| `src/lib/consent/adapter.test.ts` | 61, 70 | `expect.any(String)` | INFO | Vitest matcher, not a TypeScript `any`. |
| `docs/launch/legal-approval-matrix.md` | 48 | `placeholder copy` | INFO | Intentional owner/legal pending documentation; not user-facing final copy certification. |
| Client leaves under consent/analytics | various | `return null` | INFO | Intentional conditional non-rendering for hidden banner/no real destinations. |
| Existing non-phase page content | various | legacy legal/terms strings | INFO | Pre-existing content outside Phase 16 launch policy route contract; footer canonical link replacement verified separately. |

No blocker anti-patterns were found.

### Human Verification Required

None for the Phase 16 code contract. Owner/legal approval, Search Console access/submission, production GA4/GTM/Meta/Klaviyo/Shopify destination proof, and purchase/order analytics remain explicitly owner-gated and are not certified by this verification.

### Gaps Summary

No blocking gaps found. Phase 16 achieved the legal route/redirect foundation, consent foundation, consent-aware analytics coverage, and SEO launch evidence scaffolding. Owner-gated launch evidence is documented as pending/owner-gated rather than falsely marked complete.

---

_Verified: 2026-06-23T02:26:50Z_
_Verifier: the agent (gsd-verifier)_
