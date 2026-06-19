import { syncCartBuyerIdentityForCurrentSession } from '@/lib/cart/actions'
import { discoverCustomerAccountEndpoints } from '@/lib/shopify/customer-account/discovery'
import {
  decodeIdTokenClaims,
  exchangeCustomerAccountCode,
} from '@/lib/shopify/customer-account/oauth'
import {
  clearPendingCustomerAuth,
  getPendingCustomerAuth,
  setCustomerAccountSession,
  setCustomerFlash,
} from '@/lib/shopify/customer-account/session'

function redirectToLoginFailure(request: Request): Response {
  return Response.redirect(
    new URL('/account/login?reason=verification-failed', request.url),
  )
}

async function failCallback(request: Request): Promise<Response> {
  await clearPendingCustomerAuth()
  await setCustomerFlash(
    'We could not verify that sign-in. Start sign-in again.',
  )

  return redirectToLoginFailure(request)
}

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const state = requestUrl.searchParams.get('state')
  const pendingAuth = await getPendingCustomerAuth()

  if (!code || !state || !pendingAuth || pendingAuth.state !== state) {
    return await failCallback(request)
  }

  try {
    const endpoints = await discoverCustomerAccountEndpoints()
    const tokenExchange = await exchangeCustomerAccountCode({
      code,
      codeVerifier: pendingAuth.codeVerifier,
      nonce: pendingAuth.nonce,
      tokenEndpoint: endpoints.tokenEndpoint,
    })
    const claims = decodeIdTokenClaims(tokenExchange.idToken)

    if (!claims || claims.nonce !== pendingAuth.nonce) {
      return await failCallback(request)
    }

    await setCustomerAccountSession({
      accessToken: tokenExchange.accessToken,
      customerId: claims.sub,
      expiresAt: Date.now() + tokenExchange.expiresIn * 1000,
      idToken: tokenExchange.idToken,
      refreshToken: tokenExchange.refreshToken,
    })
    await syncCartBuyerIdentityForCurrentSession()
    await clearPendingCustomerAuth()

    return Response.redirect(new URL(pendingAuth.returnTo, request.url))
  } catch {
    return await failCallback(request)
  }
}
