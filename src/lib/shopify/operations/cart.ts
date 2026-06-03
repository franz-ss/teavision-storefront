import { shopifyFetch } from '@/lib/shopify/client'
import {
  CartCreateDocument,
  CartLinesAddDocument,
  CartLinesRemoveDocument,
  CartLinesUpdateDocument,
  GetCartDocument,
  type Cart,
  type GetCartQuery,
} from '@/lib/shopify/types'

import { reshapeImage, reshapeMoney } from './mappers'

type ShopifyCart = NonNullable<GetCartQuery['cart']>

type ShopifyCartLineNode = ShopifyCart['lines']['edges'][number]['node']

type ShopifyProductVariant = ShopifyCartLineNode['merchandise']

type ShopifyProduct = ShopifyProductVariant['product']

type ShopifyCartLine = Cart['lines'][number]

type ShopifyCartLineDiscountAllocation =
  ShopifyCartLineNode['discountAllocations'][number]

type ShopifyUserError = {
  field?: string[] | null
  message: string
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

function getDiscountAllocationTitle(
  discountAllocation: ShopifyCartLineDiscountAllocation,
): string | null {
  if (discountAllocation.__typename === 'CartCodeDiscountAllocation') {
    return discountAllocation.code
  }

  if (
    discountAllocation.__typename === 'CartAutomaticDiscountAllocation' ||
    discountAllocation.__typename === 'CartCustomDiscountAllocation'
  ) {
    return discountAllocation.title
  }

  return null
}

function reshapeDiscountAllocation(
  discountAllocation: ShopifyCartLineDiscountAllocation,
): ShopifyCartLine['discountAllocations'][number] {
  return {
    title: getDiscountAllocationTitle(discountAllocation),
    discountedAmount: reshapeMoney(discountAllocation.discountedAmount),
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
      cost: {
        amountPerQuantity: reshapeMoney(e.node.cost.amountPerQuantity),
        subtotalAmount: reshapeMoney(e.node.cost.subtotalAmount),
        totalAmount: reshapeMoney(e.node.cost.totalAmount),
      },
      discountAllocations: e.node.discountAllocations.map(
        reshapeDiscountAllocation,
      ),
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
