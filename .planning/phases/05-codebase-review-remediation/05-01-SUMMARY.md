# Plan 05-01 Summary: Launch Blockers And Core Accessibility

## Status

Complete.

## What Changed

- Added `src/lib/seo/serialize-inline-json.ts` and moved storefront JSON-LD scripts to the shared `<`-escaping serializer.
- Fixed the homepage contact CTA to `/pages/contact`.
- Converted homepage newsletter and contact forms to client-side interactive leaves with pending, success, and error feedback while keeping server actions server-only.
- Updated contact and newsletter server action wrappers to return typed action results instead of silently completing.
- Added PDP add-to-cart success feedback and `router.refresh()` so the header cart badge updates after a successful add.
- Added polite/atomic announcement attributes to the header cart badge.
- Added a storefront skip link and `#main-content` target.
- Replaced the nested `/collections` `<main>` with a non-landmark wrapper.
- Updated root error recovery to the Next 16 `unstable_retry` prop and added `src/app/global-error.tsx`.
- Removed timed autoplay from the related products carousel.

## Verification

- `pnpm lint` passed.
- `pnpm build` passed.
- Browser check `/`:
  - One `main` landmark with id `main-content`.
  - Skip link exists before the header and points to `#main-content`.
  - Homepage contact CTA resolves to `/pages/contact`.
  - Two homepage JSON-LD scripts parse without raw `<`.
  - Newsletter valid-looking submission, with no local `RESEND_API_KEY`, rendered `role="alert"`: `Unable to send your signup right now. Please try again shortly.`
  - Contact valid-looking submission, with no local `RESEND_API_KEY`, rendered `role="alert"`: `Unable to send your message right now. Please try again shortly.`
  - Honeypot fields remained present.
- Browser check `/collections`:
  - One `main` landmark.
  - No nested `main`.
  - One JSON-LD script with no raw `<`.
- Browser check `/products/aniseed-whole`:
  - Add to cart rendered `1 added to cart`.
  - Header cart text refreshed to `Cart1 item in cart`.
  - Cart badge exposes `aria-live="polite"` and `aria-atomic="true"`.
- Browser check Storybook `product-relatedproductscarousel--default`:
  - Carousel stayed on `Related products item 1 of 6` after 4.5 seconds.
  - Explicit next-button click moved it to `Related products item 2 of 6`.
- Browser check article page `/blogs/teavision-blogs/how-cafes-and-restaurants-can-create-signature-blends-using-bulk-spices`:
  - One `main` landmark.
  - JSON-LD parsed as `BlogPosting` with no raw `<`.

## Notes And Caveats

- The in-app browser runtime did not advance focus with automated Tab keypresses, so the skip-link keyboard behavior was verified structurally rather than by a successful automated focus transition.
- No real contact/newsletter emails were sent because `RESEND_API_KEY` is absent locally; this verified the intended user-safe error path.

## Requirements Covered

- AUDIT-01
- Launch-critical pieces of AUDIT-02
- JSON-LD pieces of AUDIT-03
- AUDIT-10
