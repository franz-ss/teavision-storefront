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
const MAXIMUM_QUANTITY_ERROR = 'Maximum quantity available reached.'
const MAXIMUM_QUANTITY_ERROR_PATTERNS = [
  'maximum quantity',
  'quantity available',
  'not enough merchandise',
]

function normalizeCartQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    throw new Error('Quantity must be a whole number.')
  }

  const normalizedQuantity = Math.trunc(quantity)
  if (normalizedQuantity < 1) {
    throw new Error('Quantity must be at least 1.')
  }

  return normalizedQuantity
}

function isMaximumQuantityError(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const message = error.message.toLowerCase()

  return MAXIMUM_QUANTITY_ERROR_PATTERNS.some((pattern) =>
    message.includes(pattern),
  )
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
    secure: process.env.NODE_ENV === 'production',
  })
  return cart
}

export async function getCartAction(): Promise<Cart | null> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return null
  return getCart(cartId)
}

export async function addToCartAction(
  variantId: string,
  quantity: number,
): Promise<Cart> {
  const normalizedQuantity = normalizeCartQuantity(quantity)
  const cart = await getOrCreateCart()

  try {
    return await addCartLines(cart.id, [
      { merchandiseId: variantId, quantity: normalizedQuantity },
    ])
  } catch (error) {
    if (isMaximumQuantityError(error)) {
      throw new Error(MAXIMUM_QUANTITY_ERROR)
    }

    throw error
  }
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<void> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) throw new Error('No cart found')
  await updateCartLines(cartId, [{ id: lineId, quantity }])
}

export async function removeCartLineAction(lineId: string): Promise<void> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) throw new Error('No cart found')
  await removeCartLines(cartId, [lineId])
}
