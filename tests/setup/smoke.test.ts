import { afterAll, describe, expect, test } from 'vitest'

import { createFakeShopifyServer } from '@/tests/mocks/shopify-graphql-server'

describe('test infrastructure smoke test', () => {
  let closeServer: (() => Promise<void>) | undefined

  afterAll(async () => {
    await closeServer?.()
  })

  test('creates and reads a fake Shopify cart', async () => {
    const server = await createFakeShopifyServer()
    closeServer = server.close

    const createResponse = await fetch(server.url, {
      method: 'POST',
      body: JSON.stringify({
        query: 'mutation CartCreate { cartCreate(input: {}) { cart { id } } }',
      }),
    })
    expect(createResponse.ok).toBe(true)

    const readResponse = await fetch(server.url, {
      method: 'POST',
      body: JSON.stringify({
        query:
          'query GetCart { cart(id: "gid://shopify/Cart/fake-cart") { id } }',
      }),
    })
    const payload = (await readResponse.json()) as {
      data: { cart: { id: string } }
    }

    expect(payload.data.cart.id).toBe('gid://shopify/Cart/fake-cart')
  })
})
