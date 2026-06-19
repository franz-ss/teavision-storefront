import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import { createFakeCustomerAccountApiServer } from '@/tests/mocks/customer-account-api-server'

import {
  getCustomerAccountDashboard,
  getCustomerAccountOrder,
  getCustomerAccountOrders,
} from './operations'
import type { CustomerAccountSession } from './types'

describe('Customer Account read operations', () => {
  let closeServer: (() => Promise<void>) | undefined
  let serverUrl = ''

  beforeAll(async () => {
    const server = await createFakeCustomerAccountApiServer()
    closeServer = server.close
    serverUrl = server.url
  })

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE', 'true')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_URL', serverUrl)
  })

  afterAll(async () => {
    vi.unstubAllEnvs()
    await closeServer?.()
  })

  function makeSession(): CustomerAccountSession {
    return {
      accessToken: 'customer-access-token',
      expiresAt: Date.now() + 60000,
      idToken: 'id-token',
      refreshToken: 'customer-refresh-token',
    }
  }

  test('loads dashboard sections without accepting a customer id', async () => {
    const dashboard = await getCustomerAccountDashboard(makeSession())

    expect(dashboard.profile?.emailAddress).toBe('avery@example.test')
    expect(dashboard.defaultAddress?.countryCodeV2).toBe('AU')
    expect(dashboard.recentOrders[0]?.name).toBe('#TV1001')
    expect(dashboard.sectionErrors).toEqual({})
  })

  test('loads paginated orders and order detail by order id', async () => {
    const orders = await getCustomerAccountOrders(makeSession(), { first: 10 })
    const order = await getCustomerAccountOrder(
      makeSession(),
      'gid://shopify/Order/test-order-1',
    )

    expect(orders.items[0]?.name).toBe('#TV1001')
    expect(orders.pageInfo.hasNextPage).toBe(false)
    expect(order?.lineItems[0]?.title).toBe('Organic Sencha')
  })
})
