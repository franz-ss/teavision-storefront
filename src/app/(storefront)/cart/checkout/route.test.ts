import type { Mock } from 'vitest'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { prepareCheckoutHandoff } from '@/lib/cart/actions'

import { POST } from './route'

vi.mock('@/lib/cart/actions', () => ({
  prepareCheckoutHandoff: vi.fn(),
}))

const prepareCheckoutHandoffMock = prepareCheckoutHandoff as unknown as Mock<
  typeof prepareCheckoutHandoff
>

function makeCheckoutRequest(terms = 'accepted'): Request {
  const formData = new FormData()
  if (terms) formData.set('terms', terms)

  return new Request('https://teavision.test/cart/checkout', {
    body: formData,
    method: 'POST',
  })
}

describe('cart checkout route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('redirects missing carts back to cart recovery', async () => {
    prepareCheckoutHandoffMock.mockResolvedValue({ status: 'missing-cart' })

    const response = await POST(makeCheckoutRequest())

    expect(response.headers.get('location')).toBe(
      'https://teavision.test/cart?checkout=missing-cart',
    )
  })

  test('requires submitted checkout terms', async () => {
    prepareCheckoutHandoffMock.mockResolvedValue({ status: 'terms-required' })

    const response = await POST(makeCheckoutRequest(''))

    expect(prepareCheckoutHandoffMock).toHaveBeenCalledWith(false)
    expect(response.headers.get('location')).toBe(
      'https://teavision.test/cart?checkout=terms-required',
    )
  })

  test('redirects to blocked cart state when identity sync fails', async () => {
    prepareCheckoutHandoffMock.mockResolvedValue({
      message:
        'We could not confirm your account for checkout. Retry checkout or sign in again before continuing.',
      status: 'identity-sync-failed',
    })

    const response = await POST(makeCheckoutRequest())

    expect(response.headers.get('location')).toBe(
      'https://teavision.test/cart?checkout=identity-sync-failed',
    )
  })

  test('redirects to fake checkout only after handoff is ready', async () => {
    prepareCheckoutHandoffMock.mockResolvedValue({
      checkoutUrl: 'https://checkout.test/cart/fake-cart',
      status: 'ready',
    })

    const response = await POST(makeCheckoutRequest())

    expect(response.headers.get('location')).toBe(
      'https://checkout.test/cart/fake-cart',
    )
  })
})
