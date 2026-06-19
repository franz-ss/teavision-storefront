import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { sealCustomerSession } from '../../src/lib/shopify/customer-account/session'
import { blockThirdPartyRequests } from '../mocks/third-party-network'

const customerSessionSecret = 'test-session-secret-with-at-least-32-characters'
const localBaseUrl = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? '4173'}`

test.beforeEach(async ({ page }) => {
  await blockThirdPartyRequests(page)
})

async function setCustomerSession(page: Page, accessToken: string) {
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET = customerSessionSecret
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE = 'true'
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID = 'test-client-id'
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI = `${localBaseUrl}/account/login`
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI = `${localBaseUrl}/account/callback`
  process.env.SHOPIFY_STORE_DOMAIN = 'fake-shopify.test'

  await page.context().addCookies([
    {
      httpOnly: true,
      name: 'teavision_customer_session',
      sameSite: 'Lax',
      url: localBaseUrl,
      value: sealCustomerSession({
        accessToken,
        expiresAt: Date.now() + 60 * 60 * 1000,
        idToken: 'id-token',
        refreshToken: 'refresh-token',
      }),
    },
  ])
}

test('adds a product to cart, updates the cart, removes it, and exposes only fake checkout handoff', async ({
  page,
}) => {
  await page.goto('/products/test-standard-tea')

  await page.getByRole('button', { name: 'Add to Cart' }).click()
  await expect(page.getByText('5 added to cart')).toBeVisible()
  await expect(page.getByText('5 items in cart')).toBeAttached()

  await page.goto('/cart')
  await expect(page.getByRole('list', { name: 'Cart items' })).toContainText(
    'Test Standard Tea',
  )
  await expect(page.locator('form#cart-checkout-form')).toHaveAttribute(
    'action',
    /\/cart\/checkout$/,
  )
  await page
    .getByLabel('I have read and agree to the Terms and Conditions')
    .click()
  await expect(
    page.getByRole('button', { name: 'Proceed to checkout' }),
  ).toBeEnabled()

  await page
    .getByRole('button', { name: 'Increase quantity of Test Standard Tea' })
    .click()
  await expect(page.getByText('10 items', { exact: true }).last()).toBeVisible()

  await page
    .getByRole('button', { name: 'Remove Test Standard Tea from cart' })
    .click()
  await expect(page.getByText('Your cart is empty')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Proceed to checkout' }),
  ).toHaveCount(0)
})

test('signed-in customer reaches only the fake checkout handoff', async ({
  page,
}) => {
  await setCustomerSession(page, 'customer-access-token')
  await page.goto('/products/test-standard-tea')

  await page.getByRole('button', { name: 'Add to Cart' }).click()
  await expect(page.getByText('5 added to cart')).toBeVisible()

  await page.goto('/cart')
  await expect(
    page.getByText('Checking out with your Teavision account'),
  ).toBeVisible()
  await page
    .getByLabel('I have read and agree to the Terms and Conditions')
    .click()

  const checkoutResponse = page.waitForResponse((response) =>
    response.url().endsWith('/cart/checkout'),
  )
  await page.getByRole('button', { name: 'Proceed to checkout' }).click()
  const response = await checkoutResponse

  expect(response.headers().location).toBe(
    'https://checkout.test/cart/fake-cart',
  )
})

test('buyer identity sync failure blocks checkout with recovery actions', async ({
  page,
}) => {
  await setCustomerSession(page, 'force-identity-sync-failure')
  await page.goto('/products/test-standard-tea')

  await page.getByRole('button', { name: 'Add to Cart' }).click()
  await expect(page.getByText('5 added to cart')).toBeVisible()

  await page.goto('/cart')
  await page
    .getByLabel('I have read and agree to the Terms and Conditions')
    .click()
  await page.getByRole('button', { name: 'Proceed to checkout' }).click()
  await page.waitForURL('**/cart?checkout=identity-sync-failed')

  await expect(
    page.getByText(
      'We could not confirm your account for checkout. Retry checkout or sign in again before continuing.',
    ),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Retry checkout' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sign in again' })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Contact support' }),
  ).toBeVisible()

  const blockedHostedCheckoutPatterns = [
    /myshopify\.com\/checkouts/,
    /checkout\.shopify\.com/,
  ]
  expect(
    blockedHostedCheckoutPatterns.some((pattern) => pattern.test(page.url())),
  ).toBe(false)
})
