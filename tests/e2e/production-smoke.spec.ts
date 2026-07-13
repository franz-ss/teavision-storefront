import { expect, test, type Page, type Response } from '@playwright/test'

import { blockThirdPartyRequests } from '../mocks/third-party-network'

const forbiddenLiveFlowPattern =
  /myshopify\.com\/checkouts|checkout\.shopify\.com|customer-account\.shopify\.com|shopify\.com\/.*oauth/i

test.beforeEach(async ({ page }) => {
  await blockThirdPartyRequests(page)
})

function observeForbiddenLiveFlowUrls(page: Page) {
  const observedUrls: string[] = []

  page.on('response', (response) => {
    observedUrls.push(response.url())
  })
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      observedUrls.push(frame.url())
    }
  })

  return () => {
    expect(
      observedUrls.filter((url) => forbiddenLiveFlowPattern.test(url)),
    ).toEqual([])
    expect(forbiddenLiveFlowPattern.test(page.url())).toBe(false)
  }
}

async function gotoWithoutServerError(
  page: Page,
  path: string,
): Promise<Response> {
  const response = await page.goto(path)

  expect(response, `Expected a navigation response for ${path}`).not.toBeNull()
  expect(
    response?.status(),
    `${path} returned ${response?.status() ?? 'no'} status`,
  ).toBeLessThan(500)

  return response as Response
}

async function expectNoHorizontalOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))

  expect(
    widths.scrollWidth,
    `Expected page width ${widths.scrollWidth}px to fit viewport ${widths.clientWidth}px`,
  ).toBeLessThanOrEqual(widths.clientWidth)
}

test('home loads with Teavision navigation', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  await gotoWithoutServerError(page, '/')

  await expect(
    page.getByRole('link', { name: /Teavision/i }).first(),
  ).toBeVisible()
  assertNoLiveFlow()
})

test('home exposes a single keyboard-accessible skip link target', async ({
  page,
}) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  await gotoWithoutServerError(page, '/')

  const skipLink = page.getByRole('link', { name: 'Skip to main content' })

  await expect(skipLink).toHaveCount(1)
  await expect(page.locator('main#main-content')).toHaveCount(1)

  await page.keyboard.press('Tab')
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeVisible()
  assertNoLiveFlow()
})

test('/collections/all loads without a 500 response', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  await gotoWithoutServerError(page, '/collections/all')

  await expect(
    page.getByRole('heading', { name: /All products/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Test Standard Tea/i }).first(),
  ).toBeVisible()
  assertNoLiveFlow()
})

test('/products/test-standard-tea loads with Add to Cart', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  await gotoWithoutServerError(page, '/products/test-standard-tea')

  await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible()
  assertNoLiveFlow()
})

test('/cart loads the cart shell or empty-cart state', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  await gotoWithoutServerError(page, '/cart')

  await expect(
    page.getByRole('heading', { name: 'Your Cart', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Your cart is empty')).toBeVisible()
  assertNoLiveFlow()
})

test('/search?q=tea loads search UI state', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  await gotoWithoutServerError(page, '/search?q=tea')

  await expect(
    page.getByRole('heading', { name: 'Results for "tea"' }),
  ).toBeVisible()
  await expect(page.getByText(/Search unavailable|No matches/)).toBeVisible()
  assertNoLiveFlow()
})

test('/account loads the local login bridge without live OAuth', async ({
  page,
}) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  await gotoWithoutServerError(page, '/account')

  await expect(
    page.getByRole('link', { name: 'Sign in with Shopify' }),
  ).toHaveAttribute('href', '/account/login/start?returnTo=%2Faccount')
  assertNoLiveFlow()
})

test('/pages/privacy-policy loads without 404', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  const response = await gotoWithoutServerError(page, '/pages/privacy-policy')

  expect(response.status()).not.toBe(404)
  await expect(
    page.getByRole('heading', { name: /Privacy Policy/i }),
  ).toBeVisible()
  assertNoLiveFlow()
})

test('/blog is the canonical Tea Journal listing', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  const response = await gotoWithoutServerError(page, '/blog')

  expect(response.status()).toBe(200)
  await expect(
    page.getByRole('heading', {
      name: 'Discover the Finest Teas for Your Business',
    }),
  ).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.teavision.com.au/blog',
  )
  assertNoLiveFlow()
})

test('legacy Tea Journal listings permanently redirect to /blog', async ({
  request,
}) => {
  for (const path of [
    '/blogs/teavision-blogs?source=legacy',
    '/blogs/journal?source=legacy',
  ]) {
    const response = await request.get(path, { maxRedirects: 0 })

    expect(response.status()).toBe(308)
    expect(response.headers().location).toBe('/blog?source=legacy')
  }
})

test('mobile launch routes do not create horizontal overflow', async ({
  page,
}) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)
  const longSearchQuery =
    'Organic ceremonial-grade green tea with a very long wholesale product title'

  await page.setViewportSize({ width: 375, height: 812 })

  await gotoWithoutServerError(page, '/cart')
  await expectNoHorizontalOverflow(page)

  await gotoWithoutServerError(
    page,
    `/search?q=${encodeURIComponent(longSearchQuery)}`,
  )
  await expectNoHorizontalOverflow(page)
  assertNoLiveFlow()
})

test('/api/health returns public service status', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  const response = await gotoWithoutServerError(page, '/api/health')
  const payload: unknown = await response.json()

  expect(response.status()).toBe(200)
  expect(payload).toMatchObject({
    service: 'teavision-storefront',
    status: 'ok',
  })
  assertNoLiveFlow()
})
