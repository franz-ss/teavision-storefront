import type { Cart } from '@/lib/shopify/types'

export type CartLineFormState = {
  cartChanged?: boolean
  message: string | null
}

export type CheckoutHandoffResult =
  | { status: 'ready'; checkoutUrl: string; cartIdHash: string }
  | { status: 'identity-sync-failed'; message: string; cartIdHash: string }
  | { status: 'missing-cart'; cartIdHash?: string }
  | { status: 'terms-required' }

export type CartIdentitySyncResult = {
  cart: Cart | null
  message: string | null
  synced: boolean
}

export async function getCartIdFromCookie(): Promise<string | null> {
  return null
}

export async function getCartAction(): Promise<Cart | null> {
  return null
}

export async function addToCartAction(): Promise<Cart> {
  throw new Error('Storybook cart action mock was called without an override.')
}

export async function updateCartLineAction(): Promise<void> {}

export async function removeCartLineAction(): Promise<void> {}

export async function cartLineFormAction(): Promise<CartLineFormState> {
  return { cartChanged: true, message: null }
}

export async function syncCartBuyerIdentityForCurrentSession(): Promise<CartIdentitySyncResult> {
  return { cart: null, message: null, synced: false }
}

export async function prepareCheckoutHandoff(): Promise<CheckoutHandoffResult> {
  return { status: 'missing-cart' }
}
