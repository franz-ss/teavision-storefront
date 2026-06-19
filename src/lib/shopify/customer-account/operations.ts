import { customerAccountFetch } from './client'
import type {
  CustomerAccountAddress,
  CustomerAccountConnection,
  CustomerAccountDashboard,
  CustomerAccountOrder,
  CustomerAccountPageInfo,
  CustomerAccountPaginatedResult,
  CustomerAccountProfile,
  CustomerAccountSession,
} from './types'

const CUSTOMER_ACCOUNT_VIEWER_QUERY = /* GraphQL */ `
  query CustomerAccountViewer {
    customer {
      id
      emailAddress
      firstName
      lastName
      phoneNumber
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        provinceCode
        zip
        countryCodeV2
        phone
        formatted
      }
      addresses(first: 20) {
        nodes {
          id
          firstName
          lastName
          address1
          address2
          city
          provinceCode
          zip
          countryCodeV2
          phone
          formatted
        }
      }
      orders(first: 5) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          statusPageUrl
        }
      }
    }
  }
`

const CUSTOMER_ACCOUNT_ORDERS_QUERY = /* GraphQL */ `
  query CustomerAccountOrders(
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    customer {
      orders(first: $first, after: $after, last: $last, before: $before) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          statusPageUrl
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`

const CUSTOMER_ACCOUNT_ORDER_QUERY = /* GraphQL */ `
  query CustomerAccountOrder($orderId: ID!) {
    order(id: $orderId) {
      id
      name
      processedAt
      financialStatus
      fulfillmentStatus
      totalPrice {
        amount
        currencyCode
      }
      lineItems(first: 100) {
        nodes {
          title
          quantity
          unitPrice {
            amount
            currencyCode
          }
          totalPrice {
            amount
            currencyCode
          }
        }
      }
      shippingAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        provinceCode
        zip
        countryCodeV2
        phone
        formatted
      }
      fulfillments {
        trackingCompany
        trackingInfo {
          number
          url
        }
      }
      statusPageUrl
    }
  }
`

type RawConnection<T> = CustomerAccountConnection<T> | T[] | null | undefined

type RawCustomer = Omit<CustomerAccountProfile, 'addresses' | 'orders'> & {
  addresses?: RawConnection<CustomerAccountAddress>
  orders?: RawConnection<CustomerAccountOrder>
}

type ViewerResponse = {
  customer: RawCustomer | null
}

type OrdersResponse = {
  customer: {
    orders: RawConnection<CustomerAccountOrder>
  } | null
}

type OrderResponse = {
  order: RawCustomerAccountOrder | null
}

type RawCustomerAccountOrder = Omit<CustomerAccountOrder, 'lineItems'> & {
  lineItems?: RawConnection<CustomerAccountOrder['lineItems'][number]>
}

function emptyPageInfo(): CustomerAccountPageInfo {
  return {
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
  }
}

function connectionNodes<T>(connection: RawConnection<T>): T[] {
  if (!connection) return []
  if (Array.isArray(connection)) return connection
  if (Array.isArray(connection.nodes)) return connection.nodes
  if (Array.isArray(connection.edges))
    return connection.edges.map((edge) => edge.node)

  return []
}

function connectionPageInfo<T>(
  connection: RawConnection<T>,
): CustomerAccountPageInfo {
  if (Array.isArray(connection)) return emptyPageInfo()

  const pageInfo = connection?.pageInfo

  return {
    endCursor: pageInfo?.endCursor ?? null,
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPreviousPage: pageInfo?.hasPreviousPage ?? false,
    startCursor: pageInfo?.startCursor ?? null,
  }
}

function reshapeCustomer(customer: RawCustomer): CustomerAccountProfile {
  return {
    ...customer,
    addresses: connectionNodes(customer.addresses),
    orders: connectionNodes(customer.orders),
  }
}

function reshapeOrder(order: RawCustomerAccountOrder): CustomerAccountOrder {
  return {
    ...order,
    lineItems: connectionNodes(order.lineItems),
  }
}

export async function getCustomerAccountDashboard(
  session: CustomerAccountSession,
): Promise<CustomerAccountDashboard> {
  const data = await customerAccountFetch<ViewerResponse>({
    query: CUSTOMER_ACCOUNT_VIEWER_QUERY,
    session,
  })

  if (!data.customer) {
    return {
      defaultAddress: null,
      profile: null,
      recentOrders: [],
      sectionErrors: { profile: 'We could not load this account section.' },
    }
  }

  const sectionErrors: CustomerAccountDashboard['sectionErrors'] = {}
  if (!data.customer.addresses) {
    sectionErrors.addresses = 'We could not load saved addresses.'
  }
  if (!data.customer.orders) {
    sectionErrors.orders = 'We could not load recent orders.'
  }

  const profile = reshapeCustomer(data.customer)

  return {
    defaultAddress: profile.defaultAddress,
    profile,
    recentOrders: profile.orders,
    sectionErrors,
  }
}

export async function getCustomerAccountOrders(
  session: CustomerAccountSession,
  variables: {
    after?: string
    before?: string
    first?: number
    last?: number
  },
): Promise<CustomerAccountPaginatedResult<CustomerAccountOrder>> {
  const data = await customerAccountFetch<OrdersResponse, typeof variables>({
    query: CUSTOMER_ACCOUNT_ORDERS_QUERY,
    session,
    variables,
  })
  const orders = data.customer?.orders

  return {
    items: connectionNodes(orders),
    pageInfo: connectionPageInfo(orders),
  }
}

export async function getCustomerAccountOrder(
  session: CustomerAccountSession,
  orderId: string,
): Promise<CustomerAccountOrder | null> {
  const data = await customerAccountFetch<OrderResponse, { orderId: string }>({
    query: CUSTOMER_ACCOUNT_ORDER_QUERY,
    session,
    variables: { orderId },
  })

  return data.order ? reshapeOrder(data.order) : null
}
