# Legal Approval Matrix

## Scope

This matrix tracks launch coverage for code-owned Teavision legal policy routes. It records route implementation status, owner/legal approval state, last review date, and proof status without treating draft wording as final legal advice.

Final policy wording remains owner/legal gated. The storefront routes are live so launch reviewers can verify URLs, redirects, footer links, canonical metadata, and visible pending-review status before final approval is recorded.

## Policy Route Matrix

| URL | Status | Owner/legal approval | Last reviewed | Proof |
| --- | --- | --- | --- | --- |
| `/pages/privacy-policy` | implemented - pending final copy | pending | 2026-06-22 | Code-owned route and visible pending-review banner added in Plan 16-01; owner/legal proof pending. |
| `/pages/shipping-policy` | implemented - pending final copy | pending | 2026-06-22 | Code-owned route and visible pending-review banner added in Plan 16-01; owner/legal proof pending. |
| `/pages/refund-policy` | implemented - pending final copy | pending | 2026-06-22 | Code-owned route and visible pending-review banner added in Plan 16-01; owner/legal proof pending. |
| `/pages/terms-of-service` | implemented - pending final copy | pending | 2026-06-22 | Code-owned route and visible pending-review banner added in Plan 16-01; owner/legal proof pending. |
| `/pages/cookie-preferences` | implemented - consent controls live | pending | 2026-06-23 | Stable preference URL added in Plan 16-01; consent UI, banner link, and preference controls implemented in Plan 16-02; owner/legal wording proof pending. |

## Owner/Legal Approval Evidence

No final owner/legal approval has been claimed in this implementation.

| URL | Approval state | Evidence owner | Proof location |
| --- | --- | --- | --- |
| `/pages/privacy-policy` | pending | Owner/legal reviewer | Pending owner/legal review. |
| `/pages/shipping-policy` | pending | Owner/legal reviewer | Pending owner/legal review. |
| `/pages/refund-policy` | pending | Owner/legal reviewer | Pending owner/legal review. |
| `/pages/terms-of-service` | pending | Owner/legal reviewer | Pending owner/legal review. |
| `/pages/cookie-preferences` | pending | Owner/legal reviewer | Pending owner/legal wording review; consent preference controls are implemented. |

## Redirect Evidence

The following legacy Shopify policy URLs are represented in the code-owned redirect registry and should return permanent Next.js redirects to canonical `/pages/*` policy routes:

| Source | Destination | Expected behavior |
| --- | --- | --- |
| `/policies/privacy-policy` | `/pages/privacy-policy` | Permanent 308 redirect |
| `/policies/shipping-policy` | `/pages/shipping-policy` | Permanent 308 redirect |
| `/policies/refund-policy` | `/pages/refund-policy` | Permanent 308 redirect |
| `/policies/terms-of-service` | `/pages/terms-of-service` | Permanent 308 redirect |
| `/7868339/policies/privacy-policy.html` | `/pages/privacy-policy` | Permanent 308 redirect |
| `/7868339/policies/shipping-policy.html` | `/pages/shipping-policy` | Permanent 308 redirect |
| `/7868339/policies/refund-policy.html` | `/pages/refund-policy` | Permanent 308 redirect |
| `/7868339/policies/terms-of-service.html` | `/pages/terms-of-service` | Permanent 308 redirect |

## Remaining Owner-Gated Items

- Replace launch-review placeholder copy with owner/legal-approved policy wording.
- Record approver, approval date, and proof location for each policy route.
- Re-check implemented consent preference controls on `/pages/cookie-preferences` during owner/legal wording review.
- Re-run the launch route matrix after owner/legal approval and before indexability is flipped.
