# Phase 24: User Setup Required

**Generated:** 2026-07-10
**Phase:** 24-sitemap-url-inventory-unblock
**Status:** Incomplete

Complete these items only during an approved SEO consultant handoff window. The implementation and automated verification are complete; secret creation and runtime delivery require operator access.

## Environment Variables

| Status | Variable | Source | Add to |
| --- | --- | --- | --- |
| [ ] | `SEO_URL_EXPORT_ENABLED` | Set to `true` only for the approved handoff window | Approved runtime environment |
| [ ] | `SEO_URL_EXPORT_SECRET` | Generate a rotated random value of at least 32 characters | Approved runtime environment |

Keep `DISABLE_INDEXING=true` on staging. Send the bearer credential separately from the endpoint URL, then disable the export flag and rotate or remove the secret immediately after delivery.

## Verification

During the approved window:

1. Request the export with the bearer credential in the `Authorization` header.
2. Confirm status 200, CSV attachment headers, `X-Robots-Tag: noindex, nofollow`, and `Cache-Control: private, no-store, max-age=0`.
3. Parse the CSV and confirm unique rows, the canonical production origin on every row, required source categories, and plausible live counts.
4. Confirm the staging sitemap remains empty and robots continues omitting its sitemap line while noindex mode is enabled.
5. Disable the export flag, rotate or remove the secret, and delete the local CSV.

Do not place the secret in a query string, commit the secret or CSV, or run checkout/payment/shipping/tax/order flows.

---

**Once all items complete:** Mark status as "Complete" at the top of this file.
