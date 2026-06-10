'use client'

import { useEffect, useState } from 'react'

import { getCartAction } from '@/lib/cart/actions'

import { CartBadge } from './cart-badge'

export function CartCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    getCartAction()
      .then((cart) => {
        if (isMounted) setCount(cart?.totalQuantity ?? 0)
      })
      .catch(() => {
        if (isMounted) setCount(0)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return <CartBadge count={count} />
}
