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

test('home loads with Teavision navigation', async ({ page }) => {
  const assertNoLiveFlow = observeForbiddenLiveFlowUrls(page)

  await gotoWithoutServerError(page, '/')

  await expect(
    page.getByRole('link', { name: /Teavision/i }).first(),
  ).toBeVisible()
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
