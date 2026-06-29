import { expect, test } from '@playwright/test'

import { blockThirdPartyRequests } from '../mocks/third-party-network'

test.beforeEach(async ({ page }) => {
  await blockThirdPartyRequests(page)
})

/**
 * Per-route single-H1 guarantee (SEO-H1-01 / SEO-H1-02).
 *
 * Asserts the invariant that actually matters for search: each SEO-critical
 * route, loaded ON ITS OWN, renders exactly one visible <h1>. That mirrors how
 * Googlebot indexes the site — it fetches and renders each URL in a fresh,
 * stateless session and never performs in-session soft (client-side) navigation,
 * so it only ever sees one page's DOM at a time. Each page.goto below is a full
 * document load, mirroring that per-URL render.
 *
 * We deliberately do NOT assert the raw <h1> count after multi-route SOFT
 * navigation. With Cache Components enabled, React <Activity mode="hidden">
 * keeps up to 3 recently-visited routes mounted (display:none) for instant SPA
 * navigation, so a click-through session legitimately accumulates several hidden
 * <h1>s. That accumulated DOM is invisible to Google and to the accessibility
 * tree, and is not an SEO defect — see docs/launch/seo-audit-pages-2-9-response.md.
 */
const SEO_ROUTES = [
  { path: '/', ready: "Australia's #1 tea company" },
  { path: '/collections/all', ready: undefined },
  { path: '/products/test-standard-tea', ready: 'Test Standard Tea' },
] as const

for (const route of SEO_ROUTES) {
  test(`exactly one visible <h1> on a fresh load of ${route.path}`, async ({
    page,
  }) => {
    await page.goto(route.path)

    // Wait for the route's own content to settle before counting headings.
    await expect(page.locator('h1').first()).toBeVisible()
    if (route.ready) {
      await expect(page.getByText(route.ready).first()).toBeVisible()
    }

    // Standalone load (what Googlebot indexes) must have exactly one <h1>.
    expect(await page.locator('h1').count()).toBe(1)
  })
}
