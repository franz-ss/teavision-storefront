import { getCustomerAccountConfig } from '@/lib/shopify/customer-account/env'
import { discoverCustomerAccountEndpoints } from '@/lib/shopify/customer-account/discovery'
import {
  clearCustomerAccountCookies,
  getCustomerAccountSession,
} from '@/lib/shopify/customer-account/session'

async function redirectAfterLocalLogout(request: Request): Promise<Response> {
  await clearCustomerAccountCookies()

  return Response.redirect(
    new URL('/account/login?reason=logged-out', request.url),
  )
}

async function logout(request: Request): Promise<Response> {
  const session = await getCustomerAccountSession()
  if (!session) return await redirectAfterLocalLogout(request)

  const endpoints = await discoverCustomerAccountEndpoints()
  const config = getCustomerAccountConfig()
  const logoutUrl = new URL(endpoints.logoutEndpoint)
  logoutUrl.searchParams.set(
    'post_logout_redirect_uri',
    config.logoutRedirectUri,
  )
  logoutUrl.searchParams.set('id_token_hint', session.idToken)
  await clearCustomerAccountCookies()

  return Response.redirect(logoutUrl)
}

export async function GET(request: Request): Promise<Response> {
  return await logout(request)
}

export async function POST(request: Request): Promise<Response> {
  return await logout(request)
}
