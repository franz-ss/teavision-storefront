---
phase: 16-legal-consent-analytics-and-seo-launch-coverage
reviewed: 2026-06-23T02:19:43Z
depth: standard
files_reviewed: 62
files_reviewed_list:
  - .env.example
  - docs/launch/analytics-and-indexing-runbook.md
  - docs/launch/legal-approval-matrix.md
  - docs/launch/seo-route-evidence.md
  - next.config.ts
  - scripts/component-contracts/noindex-mode.test.mjs
  - scripts/component-contracts/security-headers.test.mjs
  - scripts/seo/probe-launch-seo.mjs
  - src/app/(storefront)/cart/_components/checkout-form.test.tsx
  - src/app/(storefront)/cart/_components/checkout-form.tsx
  - src/app/(storefront)/cart/_components/line-actions.tsx
  - src/app/(storefront)/cart/_components/line-remove.tsx
  - src/app/(storefront)/cart/_components/view.tsx
  - src/app/(storefront)/layout.tsx
  - src/app/(storefront)/pages/[...slug]/page.tsx
  - src/app/(storefront)/pages/cookie-preferences/page.tsx
  - src/app/(storefront)/pages/new-product-development-order-form/_components/npd-order-form.tsx
  - src/app/(storefront)/pages/privacy-policy/page.tsx
  - src/app/(storefront)/pages/refund-policy/page.tsx
  - src/app/(storefront)/pages/shipping-policy/page.tsx
  - src/app/(storefront)/pages/terms-of-service/page.tsx
  - src/app/(storefront)/pages/wholesale-account-request/_components/form.tsx
  - src/app/(storefront)/products/[handle]/_components/view-analytics.tsx
  - src/app/(storefront)/products/[handle]/page.tsx
  - src/app/(storefront)/search/_components/analytics.tsx
  - src/app/(storefront)/search/page.tsx
  - src/app/sitemap.ts
  - src/components/analytics/destination-loader/destination-loader.stories.tsx
  - src/components/analytics/destination-loader/destination-loader.test.tsx
  - src/components/analytics/destination-loader/destination-loader.tsx
  - src/components/analytics/destination-loader/index.ts
  - src/components/analytics/index.ts
  - src/components/consent/banner/banner.stories.tsx
  - src/components/consent/banner/banner.tsx
  - src/components/consent/banner/index.ts
  - src/components/consent/index.ts
  - src/components/consent/preferences/index.ts
  - src/components/consent/preferences/preferences.stories.tsx
  - src/components/consent/preferences/preferences.tsx
  - src/components/contact/contact-form/contact-form.tsx
  - src/components/layout/footer/data.ts
  - src/components/layout/footer/newsletter-form/newsletter-form.tsx
  - src/components/product/use-add-to-cart.ts
  - src/lib/analytics/adapter.test.ts
  - src/lib/analytics/adapter.ts
  - src/lib/analytics/client.ts
  - src/lib/analytics/destinations/fake.ts
  - src/lib/analytics/destinations/ga4.ts
  - src/lib/analytics/destinations/index.ts
  - src/lib/analytics/events.ts
  - src/lib/consent/adapter.test.ts
  - src/lib/consent/adapter.ts
  - src/lib/consent/shopify-customer-privacy.ts
  - src/lib/consent/storage.ts
  - src/lib/env/server.ts
  - src/lib/legal/policies.test.ts
  - src/lib/legal/policies.ts
  - src/lib/security/headers.test.ts
  - src/lib/security/headers.ts
  - src/lib/seo/launch-route-matrix.test.ts
  - src/lib/seo/launch-route-matrix.ts
  - tests/e2e/consent.spec.ts
findings:
  critical: 0
  warning: 0
  info: 0
  total: 0
status: clean
---

# Phase 16: Code Review Report

**Reviewed:** 2026-06-23T02:19:43Z
**Depth:** standard
**Files Reviewed:** 62
**Status:** passed/clean

## Summary

Final rerun of the Phase 16 code-review gate after commit `efa201ce4c8e4ddc2d125497d69ac19e9489ed8f`. The two previous final findings are resolved, and no remaining BLOCKER or WARNING findings were found in the reviewed Phase 16 scope.

All reviewed files meet the gate's quality standard. No issues found.

## Previous Findings Verification

- Resolved BLOCKER: initial analytics-only Google consent now emits a default consent script before GA4/GTM can load. `src/components/analytics/destination-loader/destination-loader.tsx:79` defines the default consent payload, including denied ad fields when marketing is false, and `src/components/analytics/destination-loader/destination-loader.tsx:258` renders `teavision-google-consent-init` before the GA4 and GTM scripts at lines 264 and 280. The regression test at `src/components/analytics/destination-loader/destination-loader.test.tsx:45` asserts analytics-only consent denies ad storage/user data/personalization and precedes GA4 config and GTM loading.
- Resolved WARNING: enabled SEO probing no longer excludes the homepage from noindex detection. `scripts/seo/probe-launch-seo.mjs:477` now filters only by `shouldIndexWhenEnabled`, then fails when canonical metadata is wrong or `hasNoindexMeta(text)` is true at lines 482-486. The contract test at `scripts/component-contracts/noindex-mode.test.mjs:75` asserts the old `candidate.path !== '/'` exclusion is absent.

## Verification

- `pnpm test:unit -- src/lib/consent/adapter.test.ts src/components/analytics/destination-loader/destination-loader.test.tsx src/lib/analytics/adapter.test.ts src/lib/seo/launch-route-matrix.test.ts src/lib/legal/policies.test.ts src/lib/security/headers.test.ts "src/app/(storefront)/cart/_components/checkout-form.test.tsx"` - passed, 7 files / 41 tests.
- `node --test scripts/component-contracts/noindex-mode.test.mjs scripts/component-contracts/security-headers.test.mjs` - passed, 5 tests.
- `node scripts/seo/probe-launch-seo.mjs --mode runbook` - passed.
- `node scripts/seo/probe-launch-seo.mjs --mode redirects` - passed.

## Residual Risks

- Live disabled/enabled SEO probes were not run against a local production server or launch host during this review. The runbook and SEO evidence doc still track those as launch-host proof items.
- Product structured-data proof still depends on Shopify credentials and a representative product path, and remains documented as pending/owner-gated evidence.
- Final legal copy approval, Search Console access, sitemap submission, and URL inspection proof remain owner-gated and are not certified by this code review.

---

_Reviewed: 2026-06-23T02:19:43Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
