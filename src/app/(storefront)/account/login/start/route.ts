import { discoverCustomerAccountEndpoints } from '@/lib/shopify/customer-account/discovery'
import {
  buildAuthorizationUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
  normalizeReturnTo,
} from '@/lib/shopify/customer-account/oauth'
import { setPendingCustomerAuth } from '@/lib/shopify/customer-account/session'

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url)
  const returnTo = normalizeReturnTo(requestUrl.searchParams.get('returnTo'))
  const endpoints = await discoverCustomerAccountEndpoints()
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)
  const state = generateState()
  const nonce = generateNonce()

  await setPendingCustomerAuth({
    codeVerifier,
    createdAt: Date.now(),
    nonce,
    returnTo,
    state,
  })

  return Response.redirect(
    buildAuthorizationUrl({
      authorizationEndpoint: endpoints.authorizationEndpoint,
      codeChallenge,
      nonce,
      returnTo,
      state,
    }),
  )
}
