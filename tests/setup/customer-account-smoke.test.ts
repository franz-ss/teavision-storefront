import { afterAll, describe, expect, test } from 'vitest'

import { createFakeCustomerAccountApiServer } from '@/tests/mocks/customer-account-api-server'

describe('Customer Account API test infrastructure smoke test', () => {
  let closeServer: (() => Promise<void>) | undefined

  afterAll(async () => {
    await closeServer?.()
  })

  test('serves discovery, token exchange, and customer viewer GraphQL', async () => {
    const server = await createFakeCustomerAccountApiServer()
    closeServer = server.close

    const openIdResponse = await fetch(
      `${server.url}/.well-known/openid-configuration`,
    )
    await expect(openIdResponse.json()).resolves.toMatchObject({
      authorization_endpoint: `${server.url}/authentication/oauth/authorize`,
      token_endpoint: `${server.url}/authentication/oauth/token`,
    })

    const customerApiResponse = await fetch(
      `${server.url}/.well-known/customer-account-api`,
    )
    await expect(customerApiResponse.json()).resolves.toMatchObject({
      customer_account_api_endpoint: `${server.url}/customer-account/graphql`,
    })

    const tokenResponse = await fetch(
      `${server.url}/authentication/oauth/token`,
      {
        method: 'POST',
        body: new URLSearchParams({
          client_id: 'test-client-id',
          code: 'valid-code',
          code_verifier: 'valid-verifier',
          grant_type: 'authorization_code',
          nonce: 'test-nonce',
          redirect_uri: 'https://example.test/account/callback',
        }),
      },
    )
    await expect(tokenResponse.json()).resolves.toMatchObject({
      access_token: 'customer-access-token-valid-code',
      refresh_token: 'customer-refresh-token-valid-code',
    })

    const viewerResponse = await fetch(
      `${server.url}/customer-account/graphql`,
      {
        method: 'POST',
        headers: { Authorization: 'customer-access-token-valid-code' },
        body: JSON.stringify({
          operationName: 'CustomerAccountViewer',
          query:
            'query CustomerAccountViewer { customer { id emailAddress { emailAddress } } }',
        }),
      },
    )
    const payload = (await viewerResponse.json()) as {
      data: { customer: { emailAddress: { emailAddress: string } } }
    }

    expect(payload.data.customer.emailAddress.emailAddress).toBe(
      'avery@example.test',
    )
  })
})
