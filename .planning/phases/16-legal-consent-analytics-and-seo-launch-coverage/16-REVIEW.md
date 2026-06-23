---
phase: 16-legal-consent-analytics-and-seo-launch-coverage
reviewed: 2026-06-23T01:35:50Z
depth: standard
files_reviewed: 60
files_reviewed_list:
  - .env.example
  - docs/launch/analytics-and-indexing-runbook.md
  - docs/launch/legal-approval-matrix.md
  - docs/launch/seo-route-evidence.md
  - next.config.ts
  - scripts/component-contracts/noindex-mode.test.mjs
  - scripts/component-contracts/security-headers.test.mjs
  - scripts/seo/probe-launch-seo.mjs
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
  critical: 4
  warning: 3
  info: 0
  total: 7
status: issues_found
---

# Phase 16: Code Review Report

**Reviewed:** 2026-06-23T01:35:50Z
**Depth:** standard
**Files Reviewed:** 60
**Status:** issues_found

## Summary

Reviewed the Phase 16 legal, consent, analytics, security-header, sitemap, and launch evidence files at standard depth. The main launch risk is privacy/consent correctness: raw visitor-entered values and cart identifiers can reach GA4, consent revocation does not clean up already loaded destinations, and checkout still points users at the legacy terms route instead of the Phase 16 canonical legal route.

## Critical Issues

### CR-01: [BLOCKER] Raw Search Queries Are Sent To GA4

**File:** `src/lib/analytics/destinations/ga4.ts:63`

**Issue:** `SearchAnalytics` passes the visitor-entered query into `createSearchEvent` (`src/app/(storefront)/search/_components/analytics.tsx:18-20`), the event schema stores it as `query` (`src/lib/analytics/events.ts:17-20`), and GA4 maps it directly to `search_term`. Search boxes commonly receive emails, phone numbers, order IDs, and names by mistake. Analytics consent does not make it safe to disclose arbitrary visitor-entered PII to a third-party analytics destination.

**Fix:**

Remove the raw query from browser analytics. Track only non-identifying search metadata, or redact before dispatch with tests that cover email, phone, and order-like inputs.

```ts
export function createSearchEvent({
  resultCount,
}: {
  resultCount: number
}): AnalyticsEvent {
  return {
    name: 'search',
    resultCount,
  }
}

// GA4 payload
payload: {
  results_count: event.resultCount,
}
```

### CR-02: [BLOCKER] Cart Line IDs Leak Per-Cart Identifiers To Analytics

**File:** `src/lib/analytics/destinations/ga4.ts:79`

**Issue:** Cart quantity changes and removals pass `line.id` into analytics (`src/app/(storefront)/cart/_components/line-actions.tsx:65-70`, `src/app/(storefront)/cart/_components/line-remove.tsx:35-39`), the event schema requires `lineId` (`src/lib/analytics/events.ts:28-31`), and GA4 receives it as `line_id`. A Shopify cart line ID is a per-cart identifier, not a generic product identifier. This undermines the code's own minimization pattern in `checkout_start`, which only sends `cartIdPresent` instead of the cart ID.

**Fix:**

Keep line IDs only in the server-action form payload. Remove them from the analytics schema and destination mapping; use action and quantity only, or a non-cart-scoped product/variant identifier if the business needs item-level aggregation.

```ts
export function createCartUpdateEvent({
  action,
  quantity,
}: {
  action: Extract<AnalyticsEvent, { name: 'cart_update' }>['action']
  quantity?: number
}): AnalyticsEvent {
  return {
    name: 'cart_update',
    action,
    quantity,
  }
}
```

### CR-03: [BLOCKER] Revoking Consent Does Not Disable Already Loaded Destinations

**File:** `src/components/analytics/destination-loader/destination-loader.tsx:103`

**Issue:** The loader conditionally renders GA4, GTM, Meta, and Klaviyo scripts while consent is allowed (`src/components/analytics/destination-loader/destination-loader.tsx:114-164`). When a visitor later saves denied consent, storage dispatches `CONSENT_CHANGED_EVENT` and the component state updates, but there is no cleanup path: already executed third-party scripts, globals, listeners, and cookies are not disabled or cleared. Returning `null` after revocation is not enough for consent withdrawal in the current browsing session.

**Fix:**

Add explicit revocation handling for every destination that can be loaded, and cover it in e2e tests. At minimum, update vendor consent APIs, clear known cookies, and force a clean reload when optional consent changes from allowed to denied.

```ts
useEffect(() => {
  if (analyticsAllowed || marketingAllowed) return

  globalThis.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })

  globalThis.fbq?.('consent', 'revoke')
  clearAnalyticsCookies()
}, [analyticsAllowed, marketingAllowed])
```

### CR-04: [BLOCKER] Checkout Terms Acceptance Points At The Legacy Terms Route

**File:** `src/app/(storefront)/cart/_components/checkout-form.tsx:76`

**Issue:** The checkout terms checkbox links to `/pages/terms-conditions`, while Phase 16 defines `/pages/terms-of-service` as the canonical legal route (`src/lib/legal/policies.ts:81-94`) and records that route in the launch approval matrix. Checkout users can accept terms through the legacy page instead of the new reviewed legal route, so the launch legal coverage and the checkout acceptance surface disagree.

**Fix:**

Point checkout to the canonical policy route and either redirect or canonicalize the legacy terms URL.

```tsx
<Link
  id="terms-link"
  href="/pages/terms-of-service"
  className="text-brand hover:text-brand-deep underline"
>
  Terms of Service
</Link>
```

## Warnings

### WR-01: [WARNING] Non-GA4 Destination Gates Are Documented But Not Fully Wired

**File:** `src/components/analytics/destination-loader/destination-loader.tsx:25`

**Issue:** The runbook and config expose GTM, Meta, Klaviyo, and Shopify pixel gates, and the loader reads `shopifyPixelEnabled`, but that flag is never used. Separately, `createDefaultAnalyticsDestinations` only creates a GA4 dispatcher (`src/lib/analytics/destinations/index.ts:26-43`), so owner-approved GTM without GA4 receives no launch events, and Meta/Klaviyo receive only whatever their boot scripts do by default. The documented destination matrix overstates what the implementation can verify.

**Fix:** Either implement explicit destinations for each approved target, including a Shopify pixel path guarded by Shopify Customer Privacy consent, or remove/defer those env gates from the launch contract until they are actually supported.

### WR-02: [WARNING] Example Environment Defaults To Indexing Enabled

**File:** `.env.example:24`

**Issue:** The example sets `DISABLE_INDEXING=false`, while the launch runbook says pre-cutover environments should confirm `DISABLE_INDEXING=true` (`docs/launch/analytics-and-indexing-runbook.md:43`). Copying the example into a staging or review environment can accidentally expose pending legal placeholder pages and launch review routes to indexing before owner/legal approval.

**Fix:** Make the safe default noindex and document the explicit cutover override.

```dotenv
# Keep review and staging environments out of search indexes.
# Set false only for the owner-approved launch deployment.
DISABLE_INDEXING=true
```

### WR-03: [WARNING] Legal Approval Matrix Is Stale For Cookie Preferences

**File:** `docs/launch/legal-approval-matrix.md:17`

**Issue:** The matrix still says `/pages/cookie-preferences` has "consent controls pending Plan 16-02" and repeats that pending item at lines 29 and 50, but this phase now includes the live `ConsentPreferences` route. Launch reviewers relying on this matrix get incorrect implementation state for a privacy-critical page.

**Fix:** Update the matrix to say the consent controls are implemented and keep only the owner/legal wording approval as pending.

---

_Reviewed: 2026-06-23T01:35:50Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
