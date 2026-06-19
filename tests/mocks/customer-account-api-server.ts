import { createServer, type Server, type ServerResponse } from 'node:http'

import {
  makeCustomerAccountAddress,
  makeCustomerAccountProfile,
  makeCustomerAccountUserError,
} from '@/tests/fixtures/shopify/customer-account'
import type {
  CustomerAccountAddress,
  CustomerAccountOrder,
  CustomerAccountProfile,
} from '@/lib/shopify/customer-account/types'

type GraphqlRequest = {
  operationName?: string
  query?: string
  variables?: Record<string, unknown>
}

type FakeTokenRecord = {
  accessToken: string
  idToken: string
  refreshToken: string
}

type FakeCustomerAccountServerOptions = {
  initialProfile?: CustomerAccountProfile
  invalidTokenCode?: string
  omitViewerSections?: Array<'addresses' | 'orders'>
  port?: number
}

type FakeCustomerAccountServer = {
  close: () => Promise<void>
  profile: CustomerAccountProfile
  requests: GraphqlRequest[]
  reset: () => void
  tokens: FakeTokenRecord
  url: string
}

function readRequestBody(request: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk: string) => {
      body += chunk
    })
    request.on('end', () => resolve(body))
    request.on('error', reject)
  })
}

function getOperationName(request: GraphqlRequest): string {
  if (request.operationName) return request.operationName

  const match = request.query?.match(/\b(query|mutation)\s+([A-Za-z0-9_]+)/)
  return match?.[2] ?? 'UnknownOperation'
}

function writeJson(response: ServerResponse, status: number, value: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(value))
}

function writeNoContent(response: ServerResponse) {
  response.writeHead(204)
  response.end()
}

function encodeTokenSegment(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url')
}

function makeIdToken(nonce: string, customerId: string): string {
  return [
    encodeTokenSegment({ alg: 'none', typ: 'JWT' }),
    encodeTokenSegment({
      aud: 'test-client-id',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iss: 'https://customer-account.test',
      nonce,
      sub: customerId,
    }),
    'signature',
  ].join('.')
}

function toAddressConnection(addresses: CustomerAccountAddress[]) {
  return {
    nodes: addresses,
    edges: addresses.map((node) => ({ node })),
    pageInfo: { hasNextPage: false, hasPreviousPage: false },
  }
}

function toOrderConnection(orders: CustomerAccountOrder[]) {
  return {
    nodes: orders,
    edges: orders.map((node) => ({ node })),
    pageInfo: {
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
    },
  }
}

function toCustomerPayload(
  profile: CustomerAccountProfile,
  omitSections: Array<'addresses' | 'orders'>,
) {
  const payload = {
    ...profile,
    addresses: omitSections.includes('addresses')
      ? undefined
      : toAddressConnection(profile.addresses),
    orders: omitSections.includes('orders')
      ? undefined
      : toOrderConnection(profile.orders),
  }

  return payload
}

function findAddress(
  profile: CustomerAccountProfile,
  addressId: string,
): CustomerAccountAddress | null {
  return profile.addresses.find((address) => address.id === addressId) ?? null
}

function findOrder(
  profile: CustomerAccountProfile,
  orderId: string,
): CustomerAccountOrder | null {
  return profile.orders.find((order) => order.id === orderId) ?? null
}

function readString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function readRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : {}
}

export async function createFakeCustomerAccountApiServer({
  initialProfile = makeCustomerAccountProfile(),
  invalidTokenCode = 'invalid-code',
  omitViewerSections = [],
  port = 0,
}: FakeCustomerAccountServerOptions = {}): Promise<FakeCustomerAccountServer> {
  let profile = initialProfile
  const requests: GraphqlRequest[] = []
  let tokens: FakeTokenRecord = {
    accessToken: 'customer-access-token',
    idToken: makeIdToken('test-nonce', profile.id),
    refreshToken: 'customer-refresh-token',
  }

  const server = createServer(async (request, response) => {
    const host = `http://${request.headers.host ?? '127.0.0.1'}`
    const requestUrl = new URL(request.url ?? '/', host)
    const origin = requestUrl.origin

    if (
      request.method === 'GET' &&
      requestUrl.pathname === '/.well-known/openid-configuration'
    ) {
      writeJson(response, 200, {
        authorization_endpoint: `${origin}/authentication/oauth/authorize`,
        end_session_endpoint: `${origin}/authentication/logout`,
        issuer: origin,
        jwks_uri: `${origin}/authentication/jwks`,
        token_endpoint: `${origin}/authentication/oauth/token`,
      })
      return
    }

    if (
      request.method === 'GET' &&
      requestUrl.pathname === '/.well-known/customer-account-api'
    ) {
      writeJson(response, 200, {
        customer_account_api_endpoint: `${origin}/customer-account/graphql`,
      })
      return
    }

    if (
      request.method === 'POST' &&
      requestUrl.pathname === '/authentication/oauth/token'
    ) {
      const form = new URLSearchParams(await readRequestBody(request))
      const code = form.get('code')
      const codeVerifier = form.get('code_verifier')
      const nonce = form.get('nonce') ?? 'test-nonce'

      if (!code || code === invalidTokenCode || !codeVerifier) {
        writeJson(response, 400, {
          error: 'invalid_grant',
          error_description: 'Invalid authorization code or verifier',
        })
        return
      }

      tokens = {
        accessToken: `customer-access-token-${code}`,
        idToken: makeIdToken(nonce, profile.id),
        refreshToken: `customer-refresh-token-${code}`,
      }

      writeJson(response, 200, {
        access_token: tokens.accessToken,
        expires_in: 3600,
        id_token: tokens.idToken,
        refresh_token: tokens.refreshToken,
        token_type: 'Bearer',
      })
      return
    }

    if (
      request.method === 'POST' &&
      requestUrl.pathname === '/authentication/logout'
    ) {
      writeNoContent(response)
      return
    }

    if (
      request.method === 'POST' &&
      requestUrl.pathname === '/customer-account/graphql'
    ) {
      const body = await readRequestBody(request)
      const graphqlRequest = JSON.parse(body) as GraphqlRequest
      const operationName = getOperationName(graphqlRequest)
      requests.push({ ...graphqlRequest, operationName })

      if (operationName === 'CustomerAccountViewer') {
        writeJson(response, 200, {
          data: { customer: toCustomerPayload(profile, omitViewerSections) },
        })
        return
      }

      if (operationName === 'CustomerAccountOrders') {
        writeJson(response, 200, {
          data: { customer: { orders: toOrderConnection(profile.orders) } },
        })
        return
      }

      if (operationName === 'CustomerAccountOrder') {
        const orderId = readString(graphqlRequest.variables?.orderId)
        writeJson(response, 200, {
          data: {
            order: orderId ? findOrder(profile, orderId) : null,
          },
        })
        return
      }

      if (operationName === 'CustomerUpdate') {
        const input = readRecord(graphqlRequest.variables?.input)
        profile = {
          ...profile,
          firstName: readString(input.firstName) ?? profile.firstName,
          lastName: readString(input.lastName) ?? profile.lastName,
          phoneNumber: readString(input.phone) ?? profile.phoneNumber,
        }
        writeJson(response, 200, {
          data: { customerUpdate: { customer: profile, userErrors: [] } },
        })
        return
      }

      if (operationName === 'CustomerAddressCreate') {
        const input = readRecord(graphqlRequest.variables?.address)
        const address = makeCustomerAccountAddress({
          id: `gid://shopify/CustomerAddress/test-address-${profile.addresses.length + 1}`,
          address1: readString(input.address1) ?? 'New address',
        })
        profile = { ...profile, addresses: [...profile.addresses, address] }
        writeJson(response, 200, {
          data: {
            customerAddressCreate: { customerAddress: address, userErrors: [] },
          },
        })
        return
      }

      if (operationName === 'CustomerAddressUpdate') {
        const addressId = readString(graphqlRequest.variables?.addressId)
        const input = readRecord(graphqlRequest.variables?.address)
        const existing = addressId ? findAddress(profile, addressId) : null

        if (!addressId || !existing) {
          writeJson(response, 200, {
            data: {
              customerAddressUpdate: {
                customerAddress: null,
                userErrors: [
                  makeCustomerAccountUserError(
                    ['id'],
                    'Address could not be found',
                  ),
                ],
              },
            },
          })
          return
        }

        const updated = {
          ...existing,
          address1: readString(input.address1) ?? existing.address1,
        }
        profile = {
          ...profile,
          defaultAddress:
            input.defaultAddress === true ? updated : profile.defaultAddress,
          addresses: profile.addresses.map((address) =>
            address.id === addressId ? updated : address,
          ),
        }
        writeJson(response, 200, {
          data: {
            customerAddressUpdate: {
              customerAddress: updated,
              userErrors: [],
            },
          },
        })
        return
      }

      if (operationName === 'CustomerAddressDelete') {
        const addressId = readString(graphqlRequest.variables?.addressId)
        profile = {
          ...profile,
          addresses: profile.addresses.filter(
            (address) => address.id !== addressId,
          ),
        }
        writeJson(response, 200, {
          data: {
            customerAddressDelete: {
              deletedAddressId: addressId,
              userErrors: [],
            },
          },
        })
        return
      }

      writeJson(response, 500, {
        errors: [
          { message: `Unhandled Customer Account operation: ${operationName}` },
        ],
      })
      return
    }

    writeJson(response, 404, { message: 'Not found' })
  })

  await new Promise<void>((resolve) => {
    server.listen(port, '127.0.0.1', resolve)
  })

  const address = server.address()
  if (typeof address === 'string' || address === null) {
    throw new Error('Unable to start fake Customer Account API server')
  }

  return {
    close: () => closeServer(server),
    get profile() {
      return profile
    },
    get requests() {
      return requests
    },
    reset: () => {
      profile = initialProfile
      requests.length = 0
    },
    get tokens() {
      return tokens
    },
    url: `http://127.0.0.1:${address.port}`,
  }
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}
