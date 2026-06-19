import { prepareCheckoutHandoff } from '@/lib/cart/actions'

function redirectToCart(request: Request, checkout: string): Response {
  const url = new URL('/cart', request.url)
  url.searchParams.set('checkout', checkout)

  return Response.redirect(url)
}

export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData()
  const agreedToTerms = formData.get('terms') === 'accepted'
  const result = await prepareCheckoutHandoff(agreedToTerms)

  if (result.status === 'ready') {
    return Response.redirect(result.checkoutUrl)
  }

  if (result.status === 'identity-sync-failed') {
    return redirectToCart(request, 'identity-sync-failed')
  }

  if (result.status === 'terms-required') {
    return redirectToCart(request, 'terms-required')
  }

  return redirectToCart(request, 'missing-cart')
}
