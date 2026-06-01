'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

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
const CART_SESSION_EXPIRED_ERROR =
  'Your cart session has expired. Refresh the page and try again.'
const CART_REQUEST_ERROR = 'We could not update your cart. Please try again.'
const INVALID_CART_REQUEST_ERROR =
  'We could not read that cart request. Refresh the page and try again.'
const MAXIMUM_QUANTITY_ERROR_PATTERNS = [
  'maximum quantity',
  'quantity available',
  'not enough merchandise',
]

export type CartLineFormState = {
  message: string | null
}

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

function getRequiredFormString(formData: FormData, key: string): string {
  const value = formData.get(key)
  if (typeof value !== 'string') {
    throw new Error(INVALID_CART_REQUEST_ERROR)
  }

  const trimmedValue = value.trim()
  if (!trimmedValue) {
    throw new Error(INVALID_CART_REQUEST_ERROR)
  }

  return trimmedValue
}

function getCartLineFormErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return CART_REQUEST_ERROR

  if (
    error.message === MAXIMUM_QUANTITY_ERROR ||
    error.message === CART_SESSION_EXPIRED_ERROR ||
    error.message === INVALID_CART_REQUEST_ERROR ||
    error.message === 'Quantity must be a whole number.' ||
    error.message === 'Quantity must be at least 1.'
  ) {
    return error.message
  }

  return CART_REQUEST_ERROR
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

  const cart = await getCart(cartId)
  return cart
}

export async function addToCartAction(
  variantId: string,
  quantity: number,
): Promise<Cart> {
  const normalizedQuantity = normalizeCartQuantity(quantity)
  const cart = await getOrCreateCart()

  try {
    const nextCart = await addCartLines(cart.id, [
      { merchandiseId: variantId, quantity: normalizedQuantity },
    ])
    revalidatePath('/cart')
    return nextCart
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
  const normalizedQuantity = normalizeCartQuantity(quantity)
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) throw new Error(CART_SESSION_EXPIRED_ERROR)

  try {
    await updateCartLines(cartId, [{ id: lineId, quantity: normalizedQuantity }])
    revalidatePath('/cart')
  } catch (error) {
    if (isMaximumQuantityError(error)) {
      throw new Error(MAXIMUM_QUANTITY_ERROR)
    }

    throw error
  }
}

export async function removeCartLineAction(lineId: string): Promise<void> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) throw new Error(CART_SESSION_EXPIRED_ERROR)
  await removeCartLines(cartId, [lineId])
  revalidatePath('/cart')
}

export async function cartLineFormAction(
  _previousState: CartLineFormState,
  formData: FormData,
): Promise<CartLineFormState> {
  try {
    const intent = getRequiredFormString(formData, 'intent')
    const lineId = getRequiredFormString(formData, 'lineId')

    if (intent === 'remove') {
      await removeCartLineAction(lineId)
      return { message: null }
    }

    if (intent === 'update') {
      const quantity = Number(getRequiredFormString(formData, 'quantity'))
      await updateCartLineAction(lineId, quantity)
      return { message: null }
    }

    throw new Error(INVALID_CART_REQUEST_ERROR)
  } catch (error) {
    return { message: getCartLineFormErrorMessage(error) }
  }
}
