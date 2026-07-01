'use client'

import { useEffect, useState } from 'react'

import { getCartAction } from '@/lib/cart/actions'
import { CART_CHANGED_EVENT } from '@/lib/cart/events'

import { CartBadge } from './badge'

export function CartCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    function refreshCount() {
      getCartAction()
        .then((cart) => {
          if (isMounted) setCount(cart?.totalQuantity ?? 0)
        })
        .catch(() => {
          if (isMounted) setCount(0)
        })
    }

    refreshCount()
    window.addEventListener(CART_CHANGED_EVENT, refreshCount)

    return () => {
      isMounted = false
      window.removeEventListener(CART_CHANGED_EVENT, refreshCount)
    }
  }, [])

  return <CartBadge count={count} />
}
