import { getCartAction } from '@/lib/cart/actions'

import { CartBadge } from './cart-badge'

export async function CartCount() {
  const cart = await getCartAction()
  const count = cart?.totalQuantity ?? 0

  return <CartBadge count={count} />
}
