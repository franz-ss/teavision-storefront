import { shopifyFetch } from '@/lib/shopify/client'
import {
  CartCreateDocument,
  CartLinesAddDocument,
  CartLinesRemoveDocument,
  CartLinesUpdateDocument,
  GetCartDocument,
  type Cart,
  type GetCartQuery,
  type Money,
  type ShopifyImage,
} from '@/lib/shopify/types'

type MoneyLike = {
  amount: unknown
  currencyCode: string
}

type ShopifyImageLike = {
  url: unknown
  altText?: string | null
  width?: number | null
  height?: number | null
}

type ShopifyCart = NonNullable<GetCartQuery['cart']>

type ShopifyCartLineNode = ShopifyCart['lines']['edges'][number]['node']

type ShopifyProductVariant = ShopifyCartLineNode['merchandise']

type ShopifyProduct = ShopifyProductVariant['product']

type ShopifyCartLine = Cart['lines'][number]

type ShopifyUserError = {
  field?: string[] | null
  message: string
}

function reshapeMoney(money: MoneyLike): Money {
  return {
    amount: String(money.amount),
    currencyCode: String(money.currencyCode),
  }
}

function reshapeImage(image: ShopifyImageLike): ShopifyImage {
  return {
    url: String(image.url),
    altText: image.altText ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
  }
}

function reshapeProduct(
  product: ShopifyProduct,
): ShopifyCartLine['merchandise']['product'] {
  return {
    handle: product.handle,
    title: product.title,
    featuredImage: product.featuredImage
      ? reshapeImage(product.featuredImage)
      : null,
  }
}

function reshapeMerchandise(
  merchandise: ShopifyProductVariant,
): ShopifyCartLine['merchandise'] {
  return {
    id: merchandise.id,
    title: merchandise.title,
    price: reshapeMoney(merchandise.price),
    product: reshapeProduct(merchandise.product),
  }
}

function reshapeCart(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: String(cart.checkoutUrl),
    totalQuantity: cart.totalQuantity,
    cost: {
      totalAmount: reshapeMoney(cart.cost.totalAmount),
      subtotalAmount: reshapeMoney(cart.cost.subtotalAmount),
    },
    lines: cart.lines.edges.map((e) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      merchandise: reshapeMerchandise(e.node.merchandise),
    })),
  }
}

function handleUserErrors(errors: ShopifyUserError[]): void {
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join('\n'))
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch({
    query: GetCartDocument,
    variables: { cartId },
    cache: 'no-store',
  })
  return data.cart ? reshapeCart(data.cart) : null
}

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch({
    query: CartCreateDocument,
    variables: { input: {} },
    cache: 'no-store',
  })
  handleUserErrors(data.cartCreate?.userErrors ?? [])
  if (!data.cartCreate?.cart) throw new Error('Unable to create cart')
  return reshapeCart(data.cartCreate.cart)
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch({
    query: CartLinesAddDocument,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  handleUserErrors(data.cartLinesAdd?.userErrors ?? [])
  if (!data.cartLinesAdd?.cart) throw new Error('Unable to add cart lines')
  return reshapeCart(data.cartLinesAdd.cart)
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch({
    query: CartLinesUpdateDocument,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  handleUserErrors(data.cartLinesUpdate?.userErrors ?? [])
  if (!data.cartLinesUpdate?.cart)
    throw new Error('Unable to update cart lines')
  return reshapeCart(data.cartLinesUpdate.cart)
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await shopifyFetch({
    query: CartLinesRemoveDocument,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })
  handleUserErrors(data.cartLinesRemove?.userErrors ?? [])
  if (!data.cartLinesRemove?.cart)
    throw new Error('Unable to remove cart lines')
  return reshapeCart(data.cartLinesRemove.cart)
}
