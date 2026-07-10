# Phase 24: User Setup Required

**Generated:** 2026-07-10
**Phase:** 24-sitemap-url-inventory-unblock
**Status:** Complete

Complete these items only during an approved SEO consultant handoff window. The implementation and automated verification are complete; secret creation and runtime delivery require operator access.

## Environment Variables

| Status | Variable | Source | Add to |
| --- | --- | --- | --- |
| [x] | `SEO_URL_EXPORT_ENABLED` | Set to `true` only for the approved handoff window | Approved runtime environment |
| [x] | `SEO_URL_EXPORT_SECRET` | Generate a rotated random value of at least 32 characters | Approved runtime environment |

Keep `DISABLE_INDEXING=true` on staging. Send the bearer credential separately from the endpoint URL, then disable the export flag and rotate or remove the secret immediately after delivery.

## Verification

During the approved window:

1. Request the export with the bearer credential in the `Authorization` header.
2. Confirm status 200, CSV attachment headers, `X-Robots-Tag: noindex, nofollow`, and `Cache-Control: private, no-store, max-age=0`.
3. Parse the CSV and confirm unique rows, the canonical production origin on every row, required source categories, and plausible live counts.
4. Confirm the staging sitemap remains empty and robots continues omitting its sitemap line while noindex mode is enabled.
5. Disable the export flag, rotate or remove the secret, and delete the local CSV.

## Completed Verification Evidence

Verified on 2026-07-10 in an approved local production-runtime window with `DISABLE_INDEXING=true` enforced for both build and server processes:

- Authorized export returned a 200 CSV attachment with 514 unique rows using only `https://www.teavision.com.au` URLs.
- Aggregate coverage was 15 static, 1 blog, 82 article, 144 collection, 24 page, 5 legal, and 243 product rows.
- Unauthorized access returned 401; disabling the export flag restored concealed 404 behavior with no attachment.
- Export responses retained `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private, no-store, max-age=0`.
- Staging sitemap contained zero URL entries and robots omitted its sitemap line.
- The CSV was parsed in memory only; no CSV or secret was written to disk, and the temporary server was stopped.

Do not place the secret in a query string, commit the secret or CSV, or run checkout/payment/shipping/tax/order flows.

---

**Once all items complete:** Mark status as "Complete" at the top of this file.
