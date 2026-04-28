'use server'

import { cookies } from 'next/headers'
import {
  getCart,
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
} from '@/lib/shopify/operations/cart'
import type { Cart } from '@/lib/shopify/types'

const CART_COOKIE = 'teavision_cart'

const STUB_CART: Cart = {
  id: 'stub-cart-1',
  checkoutUrl: '#',
  totalQuantity: 2,
  cost: {
    totalAmount: { amount: '102.00', currencyCode: 'AUD' },
    subtotalAmount: { amount: '102.00', currencyCode: 'AUD' },
  },
  lines: [
    {
      id: 'stub-line-1',
      quantity: 2,
      merchandise: {
        id: 'gid://shopify/ProductVariant/2',
        title: '1kg',
        price: { amount: '42.00', currencyCode: 'AUD' },
        product: {
          handle: 'english-breakfast',
          title: 'English Breakfast 1kg',
          featuredImage: null,
        },
      },
    },
    {
      id: 'stub-line-2',
      quantity: 1,
      merchandise: {
        id: 'gid://shopify/ProductVariant/4',
        title: '250g',
        price: { amount: '18.00', currencyCode: 'AUD' },
        product: {
          handle: 'chamomile',
          title: 'Chamomile 250g',
          featuredImage: null,
        },
      },
    },
  ],
}

async function getOrCreateCart(): Promise<Cart> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value

  if (cartId) {
    const cart = await getCart(cartId)
    if (cart) return cart
    cookieStore.delete(CART_COOKIE)
  }

  const cart = await createCart()
  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
  return cart
}

export async function getCartAction(): Promise<Cart | null> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_CART
  }
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return null
  return getCart(cartId)
}

export async function addToCartAction(
  variantId: string,
  quantity: number,
): Promise<Cart> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_CART
  }
  const cart = await getOrCreateCart()
  return addCartLines(cart.id, [{ merchandiseId: variantId, quantity }])
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<Cart> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_CART
  }
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) throw new Error('No cart found')
  return updateCartLines(cartId, [{ id: lineId, quantity }])
}

export async function removeCartLineAction(lineId: string): Promise<Cart> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_CART
  }
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) throw new Error('No cart found')
  return removeCartLines(cartId, [lineId])
}
