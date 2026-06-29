import { expect, test } from '@playwright/test'

import { blockThirdPartyRequests } from '../mocks/third-party-network'

test.beforeEach(async ({ page }) => {
  await blockThirdPartyRequests(page)
})

/**
 * Multi-route accumulated-DOM H1 regression test (SEO-H1-01).
 *
 * WHY raw locator('h1'), NOT getByRole('heading'):
 *   React <Activity mode="hidden"> keeps previously-visited routes mounted in the
 *   live DOM (display:none). The a11y tree excludes hidden-Activity nodes, so
 *   getByRole('heading', { level: 1 }) falsely passes — it only sees the visible
 *   route's H1 and misses the retained homepage H1. Raw locator('h1') queries the
 *   real DOM and catches the leak. This test MUST use locator('h1') exclusively.
 *
 * Navigation chain (three SEO-critical routes; last two hops are in-page clicks):
 *   1. page.goto('/') — hard load of the homepage (its H1 is the leak target).
 *   2. Click href="/collections" (hero CTA) — soft (client-side) navigation.
 *   3. Click href="/collections/all" (the "All products" collection card) — soft.
 *   4. Click the product card on /collections/all — soft nav to /products/test-standard-tea.
 *
 * Expected pre-fix behaviour (why this test must FAIL on the current build):
 *   With cacheComponents: true, MAX_BF_CACHE_ENTRIES = 3, so the homepage and
 *   /collections routes stay mounted in hidden <Activity> alongside the visible
 *   product route. The homepage H1 "Australia's #1 tea company" remains in the
 *   DOM. locator('h1').count() returns >= 2. Both assertions below will fail.
 */
test('only one raw <h1> remains in the accumulated DOM after soft-navigating Home → /collections → /collections/all → /products/test-standard-tea', async ({
  page,
}) => {
  // ── Step 1: Hard-load the homepage ──────────────────────────────────────────
  await page.goto('/')

  // ── Step 2: Soft-navigate to /collections via the hero CTA ──────────────────
  // Click the "Explore Our Teas" hero CTA (href="/collections"). Using a real
  // in-page link click so Next.js performs a client-side (soft) navigation,
  // keeping the homepage mounted in hidden <Activity>.
  await page.click('a[href="/collections"]')
  await page.waitForURL('**/collections')

  // ── Step 3: Soft-navigate to /collections/all via the "All products" card ───
  // The /collections index renders a grid of collection cards; the fake-Shopify
  // harness returns one collection (handle: 'all', title: 'All products').
  // Clicking that card soft-navigates to /collections/all.
  await page.click('a[href="/collections/all"]')
  await page.waitForURL('**/collections/all')

  // ── Step 4: Soft-navigate to /products/test-standard-tea via product card ───
  // The ProductCard in src/components/collection/product-card/product-card.tsx
  // renders a next/link to /products/${product.handle}. The fake-Shopify server
  // returns a single product (handle: test-standard-tea) for every GetProduct
  // and GetCollectionProducts call.
  await page.click('a[href="/products/test-standard-tea"]')
  await page.waitForURL('**/products/test-standard-tea')

  // Wait for the product page h1 to confirm the soft-nav has settled and the
  // server-rendered content is in the DOM. Using locator('h1') rather than
  // getByText so this wait is consistent with the assertions below — it
  // verifies the h1 is present before we count it. With cacheComponents: false,
  // there is no Activity-cached static shell, so the h1 arrives with the
  // server-streamed RSC payload; toBeVisible() blocks until it appears.
  await expect(page.locator('h1')).toBeVisible()

  // ── Load-bearing assertions on the RAW DOM ──────────────────────────────────
  // MUST use locator('h1'). Do NOT use getByRole('heading') — see file header.

  // Assertion 1: the homepage H1 must NOT be retained in the accumulated DOM.
  // Pre-fix: this FAILS because the hidden <Activity> for the homepage still
  // contains <h1>Australia's #1 tea company</h1>.
  expect(
    await page.locator('h1', { hasText: "Australia's #1 tea company" }).count(),
  ).toBe(0)

  // Assertion 2: exactly one <h1> in the entire live DOM (the product page H1).
  // Pre-fix: this FAILS because count() >= 2 (product H1 + retained homepage H1).
  expect(await page.locator('h1').count()).toBe(1)
})
