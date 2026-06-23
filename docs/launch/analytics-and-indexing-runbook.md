# Analytics And Indexing Launch Runbook

This runbook records the safe launch process for consent-aware analytics
destinations and owner-gated indexing checks. Production destination IDs,
checkout evidence, and Search Console access remain owner-controlled.

## Analytics Destinations

| Destination | Launch status | Env gate | Consent category | Notes |
| --- | --- | --- | --- | --- |
| GA4 | Launch priority | `NEXT_PUBLIC_GA4_MEASUREMENT_ID` plus non-fake `NEXT_PUBLIC_ANALYTICS_MODE` | Analytics | Use only the public measurement ID. Verify with consent granted before cutover and in Realtime/DebugView after cutover. |
| GTM | Env-gated until owner approval | `NEXT_PUBLIC_GTM_CONTAINER_ID` plus non-fake `NEXT_PUBLIC_ANALYTICS_MODE` | Analytics | Do not add tags in GTM that bypass storefront consent categories. |
| Meta Pixel | Disabled until owner approval | `NEXT_PUBLIC_META_PIXEL_ID` plus non-fake `NEXT_PUBLIC_ANALYTICS_MODE` | Marketing | Enable only after marketing consent copy and destination access are approved. |
| Klaviyo | Disabled until owner approval | `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY` plus non-fake `NEXT_PUBLIC_ANALYTICS_MODE` | Marketing | Public key only; no private API keys in client code. |
| Shopify pixels | Disabled until owner approval | `NEXT_PUBLIC_SHOPIFY_PIXEL_ENABLED=true` plus non-fake `NEXT_PUBLIC_ANALYTICS_MODE` | Marketing | Requires Shopify Customer Privacy API and owner-approved Shopify pixel configuration evidence. |
| fake/test sink | Local and CI default | `NEXT_PUBLIC_ANALYTICS_MODE=fake` | Analytics | Local and CI verification must use the fake/test sink and must not send production analytics. |

Launch event coverage is limited to `product_view`, `search`,
`add_to_cart`, `cart_update`, `checkout_start`, and `lead_submit` with lead
kinds for newsletter, contact, wholesale, and NPD. Submitted names, email
addresses, phone numbers, companies, product lists, notes, and message bodies
must never be copied into analytics payloads.

## Pre-Cutover Analytics Verification

1. Keep local and CI configuration on `NEXT_PUBLIC_ANALYTICS_MODE=fake`.
2. Confirm `.env.example` documents public destination variables only:
   `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_CONTAINER_ID`,
   `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY`, and
   `NEXT_PUBLIC_SHOPIFY_PIXEL_ENABLED`.
3. Run the unit checks for consent-gated dispatch and CSP host gating.
4. In a local browser, reject optional cookies and confirm no GA4, GTM, Meta,
   Klaviyo, or Shopify pixel scripts load.
5. Grant analytics consent with a test public GA4 ID in a non-production
   environment and confirm only GA4/GTM analytics hosts are allowed by CSP when
   configured.
6. Grant marketing consent only when testing owner-approved marketing
   destinations, then confirm Meta, Klaviyo, or Shopify pixel hosts remain
   absent unless their env gates are explicitly configured.

## Post-Cutover Analytics Verification

1. Confirm production was built with the owner-approved public destination IDs.
2. Confirm denied optional consent blocks destination loading on the live site.
3. Grant analytics consent and verify GA4 receives product view, search,
   add-to-cart, cart update, checkout start, and lead-submit test events.
4. Verify GTM only if the owner approved `NEXT_PUBLIC_GTM_CONTAINER_ID`.
5. Verify Meta, Klaviyo, and Shopify pixels only if the owner approved the
   matching marketing destination and consent copy.
6. Record destination, URL, consent state, event name, timestamp, verifier, and
   evidence link in the Evidence Log.

## Owner-Gated Purchase And Order Tracking

Purchase and order analytics are not enabled by default. Do not add purchase,
order-created, payment, shipping-rate, tax, success-redirect, or hosted
checkout analytics until the store owner approves real Shopify hosted checkout
testing and provides order evidence.

Before enabling purchase/order tracking, collect:

- Owner approval for hosted checkout/payment/order testing.
- Shopify dev store or production-safe order test plan.
- Destination-specific purchase event mapping.
- Proof that no submitted customer PII or order note text is sent to browser
  analytics destinations.
- Rollback instructions for disabling the destination env gate.

## Search Console And Sitemap Submission

Search Console access and sitemap submission are owner-gated. Plan 16-04 owns
the detailed indexing flip and sitemap verification. For this plan, keep the
handoff checklist narrow:

1. Confirm the owner has access to the canonical production property.
2. Confirm launch indexing is intentionally enabled before submission.
3. Submit the production sitemap URL after cutover.
4. Inspect representative product, collection, legal, and landing URLs.
5. Record proof or mark access as pending in the Evidence Log.

## Evidence Log

| Date | Environment | Destination or tool | Consent state | Check | Evidence | Owner/Verifier |
| --- | --- | --- | --- | --- | --- | --- |
| Pending | Local/CI | fake/test sink | Analytics denied/granted | Unit tests prove fake sink and consent gates | `pnpm test:unit -- src/lib/analytics/adapter.test.ts` | Engineering |
| Pending | Production | GA4 | Analytics granted | Realtime/DebugView launch event verification | Pending owner public ID | Owner/Engineering |
| Pending | Production | Search Console | Not applicable | Sitemap submission and URL inspection | Pending owner access | Owner |
