import { createServer, type Server, type ServerResponse } from 'node:http'

import type { Cart } from '@/lib/shopify/types'
import {
  makeCart,
  makeCartLine,
  makeShopifyCartPayload,
  type ShopifyCartPayload,
} from '@/tests/fixtures/shopify/cart'
import { makeProduct } from '@/tests/fixtures/shopify/product'

type GraphqlRequest = {
  operationName?: string
  query?: string
  variables?: Record<string, unknown>
}

type FakeShopifyServer = {
  buyerIdentity: ShopifyCartPayload['buyerIdentity']
  cart: Cart
  close: () => Promise<void>
  requests: GraphqlRequest[]
  reset: () => void
  url: string
}

type FakeShopifyServerOptions = {
  initialCart?: Cart
  port?: number
}

const fakeVariantQuantityRule = {
  minimum: 5,
  maximum: 20,
  increment: 5,
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
  response.writeHead(status, {
    'Content-Type': 'application/json',
  })
  response.end(JSON.stringify(value))
}

function readRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : {}
}

function readString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function toBuyerIdentityPayload(
  input: Record<string, unknown>,
): ShopifyCartPayload['buyerIdentity'] {
  const customerAccessToken = readString(input.customerAccessToken)

  return {
    countryCode: readString(input.countryCode),
    customer: customerAccessToken
      ? { id: 'gid://shopify/Customer/fake-customer' }
      : null,
    email: readString(input.email),
    phone: readString(input.phone),
  }
}

function shouldFailBuyerIdentityUpdate(
  input: Record<string, unknown>,
): boolean {
  return readString(input.customerAccessToken) === 'force-identity-sync-failure'
}

function setLineTotals(cart: Cart): Cart {
  return {
    ...cart,
    totalQuantity: cart.lines.reduce((total, line) => total + line.quantity, 0),
    cost: {
      subtotalAmount: {
        amount: cart.lines
          .reduce(
            (total, line) =>
              total +
              Number(line.cost.amountPerQuantity.amount) * line.quantity,
            0,
          )
          .toFixed(2),
        currencyCode: 'AUD',
      },
      totalAmount: {
        amount: cart.lines
          .reduce(
            (total, line) =>
              total +
              Number(line.cost.amountPerQuantity.amount) * line.quantity,
            0,
          )
          .toFixed(2),
        currencyCode: 'AUD',
      },
    },
  }
}

function makeRawProduct() {
  const product = makeProduct()
  const variant = product.variants[0]

  if (!variant) {
    throw new Error('Fake product requires at least one variant')
  }

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    tags: product.tags,
    collections: {
      nodes: [{ id: 'gid://shopify/Collection/test-collection' }],
    },
    images: {
      edges: [],
    },
    priceRange: product.priceRange,
    options: product.options,
    ratingMetafield: { value: JSON.stringify({ value: '4.8' }) },
    ratingCountMetafield: { value: '24' },
    bulkPricingTiersMetafield: {
      value: JSON.stringify([
        {
          minimumQuantity: 5,
          price: { amount: '21.00', currencyCode: 'AUD' },
        },
      ]),
    },
    variants: {
      pageInfo: { hasNextPage: false, endCursor: null },
      edges: [
        {
          node: {
            ...variant,
            currentlyNotInStock: false,
            quantityRule: fakeVariantQuantityRule,
            quantityPriceBreaks: {
              nodes: [
                {
                  minimumQuantity: 5,
                  price: { amount: '21.00', currencyCode: 'AUD' },
                },
              ],
            },
          },
        },
      ],
    },
  }
}

function makeCollectionSummary() {
  return {
    id: 'gid://shopify/Collection/all',
    handle: 'all',
    title: 'All products',
    description: 'All test products',
    updatedAt: '2026-06-04T00:00:00Z',
    image: null,
    seo: { title: null, description: null },
  }
}

function makeCollection() {
  return {
    ...makeCollectionSummary(),
    descriptionHtml: '<p>All test products.</p>',
  }
}

function makeCollectionProductNode() {
  const product = makeRawProduct()

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    availableForSale: true,
    productType: 'Tea',
    tags: product.tags,
    featuredImage: null,
    priceRange: product.priceRange,
    variants: {
      edges: product.variants.edges.map((edge) => ({
        node: {
          id: edge.node.id,
          title: edge.node.title,
          availableForSale: edge.node.availableForSale,
          currentlyNotInStock: edge.node.currentlyNotInStock,
          quantityRule: edge.node.quantityRule,
          price: edge.node.price,
          image: null,
        },
      })),
    },
    ratingMetafield: product.ratingMetafield,
    ratingCountMetafield: product.ratingCountMetafield,
  }
}

function makePageSummary() {
  return {
    id: 'gid://shopify/Page/fake-production-e2e-page',
    handle: 'fake-production-e2e-page',
    title: 'Fake production e2e page',
    bodySummary: 'Fake page for production e2e prerendering.',
    updatedAt: '2026-06-04T00:00:00Z',
    seo: { title: null, description: null },
  }
}

function makePage() {
  return {
    ...makePageSummary(),
    body: '<p>Fake page for production e2e prerendering.</p>',
  }
}

export async function createFakeShopifyServer({
  initialCart = makeCart({ lines: [] }),
  port = 0,
}: FakeShopifyServerOptions = {}): Promise<FakeShopifyServer> {
  let cart = setLineTotals(initialCart)
  let buyerIdentity: ShopifyCartPayload['buyerIdentity'] = {
    countryCode: null,
    customer: null,
    email: null,
    phone: null,
  }
  let lineSequence = cart.lines.length + 1
  const requests: GraphqlRequest[] = []

  function cartPayload() {
    return makeShopifyCartPayload(cart, buyerIdentity)
  }

  const server = createServer(async (request, response) => {
    if (request.method === 'GET' && request.url === '/health') {
      writeJson(response, 200, { ok: true })
      return
    }

    if (request.method !== 'POST') {
      writeJson(response, 405, { errors: [{ message: 'Method not allowed' }] })
      return
    }

    const body = await readRequestBody(request)
    const graphqlRequest = JSON.parse(body) as GraphqlRequest
    const operationName = getOperationName(graphqlRequest)
    requests.push({ ...graphqlRequest, operationName })

    if (operationName === 'GetProduct') {
      writeJson(response, 200, { data: { product: makeRawProduct() } })
      return
    }

    if (operationName === 'GetProductVariants') {
      writeJson(response, 200, {
        data: {
          product: {
            variants: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      })
      return
    }

    if (operationName === 'GetProducts') {
      const product = makeRawProduct()
      writeJson(response, 200, {
        data: {
          products: {
            edges: [
              {
                node: {
                  id: product.id,
                  handle: product.handle,
                  title: product.title,
                  updatedAt: '2026-06-04T00:00:00Z',
                  featuredImage: null,
                  priceRange: product.priceRange,
                  ratingMetafield: product.ratingMetafield,
                  ratingCountMetafield: product.ratingCountMetafield,
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      })
      return
    }

    if (operationName === 'GetPage') {
      const handle = readString(graphqlRequest.variables?.handle)
      writeJson(response, 200, {
        data: {
          page: handle === 'fake-production-e2e-page' ? makePage() : null,
        },
      })
      return
    }

    if (operationName === 'GetPages') {
      writeJson(response, 200, {
        data: {
          pages: {
            edges: [{ node: makePageSummary() }],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      })
      return
    }

    if (operationName === 'GetCollection') {
      const handle = readString(graphqlRequest.variables?.handle)
      writeJson(response, 200, {
        data: { collection: handle === 'all' ? makeCollection() : null },
      })
      return
    }

    if (operationName === 'GetCollectionProducts') {
      const handle = readString(graphqlRequest.variables?.handle)
      writeJson(response, 200, {
        data: {
          collection:
            handle === 'all'
              ? {
                  products: {
                    edges: [{ node: makeCollectionProductNode() }],
                    filters: [],
                    pageInfo: { hasNextPage: false, endCursor: null },
                  },
                }
              : null,
        },
      })
      return
    }

    if (operationName === 'GetCollectionCursorIndex') {
      const handle = readString(graphqlRequest.variables?.handle)
      writeJson(response, 200, {
        data: {
          collection:
            handle === 'all'
              ? {
                  products: {
                    edges: [
                      {
                        cursor: 'fake-product-cursor',
                        node: { tags: makeCollectionProductNode().tags },
                      },
                    ],
                    pageInfo: { hasNextPage: false, endCursor: null },
                  },
                }
              : null,
        },
      })
      return
    }

    if (
      operationName === 'GetCollections' ||
      operationName === 'GetCollectionSummaries'
    ) {
      const node =
        operationName === 'GetCollections'
          ? { handle: 'all' }
          : makeCollectionSummary()
      writeJson(response, 200, {
        data: {
          collections: {
            edges: [{ node }],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      })
      return
    }

    if (operationName === 'GetProductRecommendations') {
      writeJson(response, 200, { data: { productRecommendations: [] } })
      return
    }

    if (operationName === 'GetCart') {
      writeJson(response, 200, { data: { cart: cartPayload() } })
      return
    }

    if (operationName === 'CartCreate') {
      const input = readRecord(graphqlRequest.variables?.input)
      const identityInput = readRecord(input.buyerIdentity)
      buyerIdentity = toBuyerIdentityPayload(identityInput)
      cart = setLineTotals(
        makeCart({
          id: 'gid://shopify/Cart/fake-cart',
          checkoutUrl: 'https://checkout.test/cart/fake-cart',
          lines: [],
        }),
      )
      writeJson(response, 200, {
        data: {
          cartCreate: {
            cart: cartPayload(),
            userErrors: [],
          },
        },
      })
      return
    }

    if (operationName === 'CartBuyerIdentityUpdate') {
      const identityInput = readRecord(graphqlRequest.variables?.buyerIdentity)

      if (shouldFailBuyerIdentityUpdate(identityInput)) {
        writeJson(response, 200, {
          data: {
            cartBuyerIdentityUpdate: {
              cart: null,
              userErrors: [
                {
                  field: ['buyerIdentity'],
                  message: 'Unable to confirm customer identity',
                },
              ],
            },
          },
        })
        return
      }

      buyerIdentity = toBuyerIdentityPayload(identityInput)
      writeJson(response, 200, {
        data: {
          cartBuyerIdentityUpdate: {
            cart: cartPayload(),
            userErrors: [],
          },
        },
      })
      return
    }

    if (operationName === 'CartLinesAdd') {
      const lines = Array.isArray(graphqlRequest.variables?.lines)
        ? graphqlRequest.variables.lines
        : []
      const nextLines = lines.map((line) => {
        const lineRecord = line as Record<string, unknown>
        const quantity =
          typeof lineRecord.quantity === 'number' ? lineRecord.quantity : 1
        const merchandiseId =
          typeof lineRecord.merchandiseId === 'string'
            ? lineRecord.merchandiseId
            : 'gid://shopify/ProductVariant/test-variant-1'

        return makeCartLine({
          id: `gid://shopify/CartLine/fake-line-${lineSequence++}`,
          quantity,
          merchandise: {
            ...makeCartLine().merchandise,
            id: merchandiseId,
            quantityRule: fakeVariantQuantityRule,
            product: {
              ...makeCartLine().merchandise.product,
              featuredImage: null,
            },
          },
        })
      })
      cart = setLineTotals({ ...cart, lines: [...cart.lines, ...nextLines] })
      writeJson(response, 200, {
        data: {
          cartLinesAdd: {
            cart: cartPayload(),
            userErrors: [],
          },
        },
      })
      return
    }

    if (operationName === 'CartLinesUpdate') {
      const updates = Array.isArray(graphqlRequest.variables?.lines)
        ? graphqlRequest.variables.lines
        : []
      cart = setLineTotals({
        ...cart,
        lines: cart.lines.map((line) => {
          const update = updates.find(
            (value) =>
              typeof value === 'object' &&
              value !== null &&
              'id' in value &&
              value.id === line.id,
          )

          if (
            typeof update === 'object' &&
            update !== null &&
            'quantity' in update &&
            typeof update.quantity === 'number'
          ) {
            return { ...line, quantity: update.quantity }
          }

          return line
        }),
      })
      writeJson(response, 200, {
        data: {
          cartLinesUpdate: {
            cart: cartPayload(),
            userErrors: [],
          },
        },
      })
      return
    }

    if (operationName === 'CartLinesRemove') {
      const lineIds = Array.isArray(graphqlRequest.variables?.lineIds)
        ? graphqlRequest.variables.lineIds
        : []
      cart = setLineTotals({
        ...cart,
        lines: cart.lines.filter((line) => !lineIds.includes(line.id)),
      })
      writeJson(response, 200, {
        data: {
          cartLinesRemove: {
            cart: cartPayload(),
            userErrors: [],
          },
        },
      })
      return
    }

    writeJson(response, 500, {
      errors: [
        {
          message: `Unhandled fake Shopify operation: ${operationName}`,
        },
      ],
    })
  })

  await new Promise<void>((resolve) => {
    server.listen(port, '127.0.0.1', resolve)
  })

  const address = server.address()
  if (typeof address === 'string' || address === null) {
    throw new Error('Unable to start fake Shopify server')
  }

  return {
    get buyerIdentity() {
      return buyerIdentity
    },
    get cart() {
      return cart
    },
    close: () => closeServer(server),
    get requests() {
      return requests
    },
    reset: () => {
      cart = setLineTotals(initialCart)
      buyerIdentity = {
        countryCode: null,
        customer: null,
        email: null,
        phone: null,
      }
      lineSequence = cart.lines.length + 1
      requests.length = 0
    },
    url: `http://127.0.0.1:${address.port}/graphql`,
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
