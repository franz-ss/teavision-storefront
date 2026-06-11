import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Section } from '@/components/ui'
import { getCartAction } from '@/lib/cart/actions'
import { withNoindexRobots } from '@/lib/seo/noindex'

import { CartLoadingSkeleton } from './_components/loading-skeleton'
import { CartRecommendations } from './_components/recommendations'
import { CartView } from './_components/view'

export const metadata: Metadata = withNoindexRobots({
  title: 'Your Cart',
})

async function CartContent() {
  const cart = await getCartAction()

  return (
    <>
      <CartView cart={cart} />
      {cart && cart.totalQuantity > 0 ? (
        <CartRecommendations cart={cart} />
      ) : null}
    </>
  )
}

export default function CartPage() {
  return (
    <Section.Root tone="transparent" spacing="compact">
      <Section.Container>
        <h1 className="type-heading-01 font-display mb-6">Your Cart</h1>
        <Suspense fallback={<CartLoadingSkeleton />}>
          <CartContent />
        </Suspense>
      </Section.Container>
    </Section.Root>
  )
}
