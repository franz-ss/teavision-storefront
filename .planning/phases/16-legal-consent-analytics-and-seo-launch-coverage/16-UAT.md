---
status: complete
phase: 16-legal-consent-analytics-and-seo-launch-coverage
source: [16-01-SUMMARY.md, 16-02-SUMMARY.md, 16-03-SUMMARY.md, 16-04-SUMMARY.md]
started: 2026-06-23T02:40:19Z
updated: 2026-06-23T03:36:56Z
---

## Current Test
[testing complete]

## Tests

### 1. Legal Policy Pages
expected: Visit /pages/privacy-policy, /pages/shipping-policy, /pages/refund-policy, /pages/terms-of-service, and /pages/cookie-preferences. Each route loads as a storefront page with the matching policy or preferences content, legal policy pages show pending owner/legal review wording, and none of the routes fall through to Shopify fallback content or a 404.
result: pass

### 2. Footer Legal Links and Legacy Redirects
expected: The storefront footer shows the canonical legal links for Privacy Policy, Shipping Policy, Refund Policy, Terms of Service, and Cookie Preferences using /pages/* URLs. Visiting legacy /policies/* and legacy .html policy aliases redirects to the canonical /pages/* routes without showing a 404.
result: pass

### 3. First-Visit Consent Banner
expected: In a fresh browser state with no teavision_consent localStorage entry, a storefront page shows the compact consent banner with Accept, Reject, and Manage actions. Essential consent stays required, and analytics/marketing are not enabled until the visitor chooses them.
result: pass

### 4. Consent Choice Persistence
expected: Choosing Accept or Reject stores a versioned teavision_consent value, dismisses the banner, and keeps the banner dismissed after reload with the selected choice preserved. The Shopify Customer Privacy bridge is attempted only in the browser and does not break the page if Shopify privacy globals are absent.
result: pass

### 5. Granular Consent Preferences
expected: The banner Manage flow and /pages/cookie-preferences route both show reusable preference controls. Essential is visible but locked on, analytics and marketing can be toggled independently, saving updates storage, and the updated choice is reflected after reload.
result: pass

### 6. Analytics Destination Guarding
expected: With local fake/disabled analytics configuration or missing public destination env vars, real analytics scripts and third-party tracking requests do not load before consent. After analytics consent is allowed, destination loading remains governed by the configured public env mode and does not produce browser console or runtime errors.
result: pass

### 7. Analytics-Instrumented Storefront Workflows
expected: Product view, search results, add-to-cart, cart quantity changes, cart removal, local checkout-start handoff, newsletter signup, contact form, wholesale request, and NPD form success paths still complete normally through the UI. In fake/local mode, analytics dispatches are captured by the fake/test path rather than sending real tracking or running real hosted checkout.
result: pass

### 8. Analytics and Indexing Runbook
expected: docs/launch/analytics-and-indexing-runbook.md documents pre-cutover analytics verification, post-cutover analytics verification, owner-gated purchase/order tracking, indexing cutover, Search Console handoff, and an evidence log without requiring owner-gated external proof for local completion.
result: pass

### 9. Sitemap and Indexing Mode Behavior
expected: With DISABLE_INDEXING enabled, sitemap and robots behavior remain closed for launch safety. In enabled local production mode, sitemap coverage includes launch static and legal routes from the route matrix, while /search remains excluded from sitemap/indexing as documented.
result: pass

### 10. SEO Evidence Probe
expected: The launch SEO evidence flow covers runbook proof, policy redirects, disabled indexing mode, and enabled local-production indexing checks. The offline runbook and redirects probe modes pass without Search Console access, real commerce flows, or external owner-gated services.
result: pass

## Summary

total: 10
passed: 10
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none yet]
