import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Section } from '@/components/ui'
import { getCartAction } from '@/lib/cart/actions'
import { withNoindexRobots } from '@/lib/seo/noindex'

import { CartRecommendations } from './_components/cart-recommendations'
import { CartView } from './_components/cart-view'

export const metadata: Metadata = withNoindexRobots({
  title: 'Your Cart',
})

async function CartContent() {
  const cart = await getCartAction()

  return (
    <>
      <CartView cart={cart} />
      {cart && cart.totalQuantity > 0 ? <CartRecommendations /> : null}
    </>
  )
}

export default function CartPage() {
  return (
    <Section.Root tone="transparent" spacing="compact">
      <Section.Container>
        <h1 className="type-heading-02 mb-6">Your Cart</h1>
        <Suspense
          fallback={
            <div
              className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start xl:gap-10"
              role="status"
              aria-live="polite"
            >
              <span className="sr-only">Loading cart</span>
              <div>
                {/* Desktop header skeleton */}
                <div className="border-default hidden border-b pb-3 xl:grid xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:gap-x-6">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-surface-sunken h-4 w-16 animate-pulse rounded motion-reduce:animate-none"
                    />
                  ))}
                </div>
                {/* Item skeletons */}
                <div className="xl:divide-border space-y-4 xl:space-y-0 xl:divide-y">
                  {Array.from({ length: 2 }, (_, index) => (
                    <div
                      key={index}
                      className="border-default bg-surface grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-md border p-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:p-5 lg:grid-cols-[5rem_minmax(0,1fr)_auto_auto] lg:items-center xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:items-start xl:gap-x-6 xl:rounded-none xl:border-0 xl:bg-transparent xl:px-0 xl:py-6"
                    >
                      <div className="bg-surface-sunken row-span-3 aspect-square w-20 animate-pulse rounded motion-reduce:animate-none sm:w-24 lg:row-span-1 xl:row-span-2 xl:w-24" />
                      <div className="flex min-w-0 flex-col gap-2">
                        <div className="bg-surface-sunken h-5 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
                        <div className="bg-surface-sunken h-4 w-1/2 animate-pulse rounded motion-reduce:animate-none" />
                        <div className="bg-surface-sunken h-5 w-24 animate-pulse rounded motion-reduce:animate-none xl:hidden" />
                      </div>
                      <div className="bg-surface-sunken hidden h-5 w-16 animate-pulse rounded motion-reduce:animate-none xl:block" />
                      <div className="bg-surface-sunken col-start-2 h-11 w-40 animate-pulse rounded motion-reduce:animate-none lg:col-start-3 xl:col-start-4" />
                      <div className="bg-surface-sunken hidden h-5 w-16 animate-pulse rounded motion-reduce:animate-none xl:block" />
                      <div className="bg-surface-sunken col-start-2 h-9 w-20 animate-pulse rounded motion-reduce:animate-none lg:col-start-4 xl:col-start-2" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Sidebar skeleton */}
              <div className="border-default bg-surface rounded-lg border p-4 sm:p-6">
                <div className="bg-surface-sunken h-7 w-40 animate-pulse rounded motion-reduce:animate-none" />
                <div className="bg-surface-sunken mt-5 h-6 w-full animate-pulse rounded motion-reduce:animate-none" />
                <div className="bg-surface-sunken mt-3 h-6 w-full animate-pulse rounded motion-reduce:animate-none" />
                <div className="bg-surface-sunken mt-4 h-12 w-full animate-pulse rounded motion-reduce:animate-none" />
                <div className="bg-surface-sunken mt-3 h-10 w-full animate-pulse rounded motion-reduce:animate-none" />
                {/* Trust signal skeletons */}
                <div className="border-default mt-4 space-y-2.5 border-t pt-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-surface-sunken h-4 w-3/4 animate-pulse rounded motion-reduce:animate-none"
                    />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <CartContent />
        </Suspense>
      </Section.Container>
    </Section.Root>
  )
}
