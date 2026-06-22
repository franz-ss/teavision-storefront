import { discoverCustomerAccountEndpoints } from '@/lib/shopify/customer-account/discovery'
import { getCustomerAccountRedirectOrigin } from '@/lib/shopify/customer-account/env'
import {
  buildAuthorizationUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
  normalizeReturnTo,
} from '@/lib/shopify/customer-account/oauth'
import { setPendingCustomerAuth } from '@/lib/shopify/customer-account/session'

const CANONICAL_ORIGIN_PARAM = '_accountOrigin'

function getForwardedOrigin(request: Request): string | null {
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()

  if (!host || !proto) return null

  return `${proto}://${host}`
}

function getCanonicalStartRedirect(
  request: Request,
  requestUrl: URL,
  returnTo: string,
): URL | null {
  if (requestUrl.searchParams.get(CANONICAL_ORIGIN_PARAM) === '1') return null

  const configuredOrigin = getCustomerAccountRedirectOrigin()
  const requestOrigin = getForwardedOrigin(request) ?? requestUrl.origin
  if (requestOrigin === configuredOrigin) return null

  const canonicalUrl = new URL('/account/login/start', configuredOrigin)
  canonicalUrl.searchParams.set('returnTo', returnTo)
  canonicalUrl.searchParams.set(CANONICAL_ORIGIN_PARAM, '1')

  return canonicalUrl
}

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url)
  const returnTo = normalizeReturnTo(requestUrl.searchParams.get('returnTo'))
  const canonicalRedirect = getCanonicalStartRedirect(
    request,
    requestUrl,
    returnTo,
  )

  if (canonicalRedirect) return Response.redirect(canonicalRedirect)

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
