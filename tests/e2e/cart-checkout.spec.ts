import { expect, test } from '@playwright/test'

import { blockThirdPartyRequests } from '../mocks/third-party-network'

test.beforeEach(async ({ page }) => {
  await blockThirdPartyRequests(page)
})

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
  await expect(
    page.getByRole('link', { name: 'Proceed to checkout' }),
  ).toHaveAttribute('href', 'https://checkout.test/cart/fake-cart')

  await page
    .getByRole('button', { name: 'Increase quantity of Test Standard Tea' })
    .click()
  await expect(page.getByText('10 items', { exact: true }).last()).toBeVisible()

  await page
    .getByRole('button', { name: 'Remove Test Standard Tea from cart' })
    .click()
  await expect(page.getByText('Your cart is empty.')).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Proceed to checkout' }),
  ).toHaveCount(0)
})
