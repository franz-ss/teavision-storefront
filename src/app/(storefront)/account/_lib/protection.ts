import { requireCustomerAccountSession } from '@/lib/shopify/customer-account'

export async function requireAccountSessionForPath(returnTo: string) {
  return await requireCustomerAccountSession(returnTo)
}
