---
quick_id: 260622-h9f
status: complete
date: 2026-06-22
code_commit: 4237cce
---

# Quick Summary: Harden Shopify cart checkout identity sync and retained-cart behavior

## Outcome

Implemented the recommended short-term cart hardening without introducing account-cart merge semantics or a Teavision-side cart store.

## Changes

- `syncCartBuyerIdentityForCurrentSession()` now returns the refreshed Shopify cart when buyer identity sync succeeds.
- Checkout handoff now uses the post-sync Shopify `checkoutUrl` when available, falling back to the pre-sync cart URL only when no sync happened.
- Account OAuth callback now preserves a visible sync failure signal and returns shoppers who came from `/cart` to `/cart?checkout=identity-sync-failed`.
- Local/no-session logout fallback now redirects with `reason=logged-out-cart-retained` when the browser cart is preserved.
- Account login copy now explains that the shopper is signed out while the browser cart remains available.

## Verification

- RED: `pnpm vitest run 'src/lib/cart/actions.test.ts' 'src/app/(storefront)/account/callback/route.test.ts' 'src/app/(storefront)/account/logout/route.test.ts'` failed on the new expected behaviors before implementation.
- GREEN: same focused command passed with 22 tests.
- `pnpm test:integration` passed with 8 test files and 39 tests.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- Commit hook for `4237cce` also passed lint and `test:contracts`.

## Notes

- Shopify remains the only cart item source of truth; the app still stores only the Shopify cart ID in `teavision_cart`.
- This deliberately does not add guest/authenticated cart merging. Existing guest cart continuity is preserved through Shopify cart buyer identity sync.
- Hosted Shopify logout keeps using the configured `post_logout_redirect_uri`; the retained-cart login reason is limited to the local/no-session fallback to avoid assuming query-string changes are registered with Shopify.
