import type { Metadata } from 'next'
import { Suspense } from 'react'

import { getCartAction } from '@/lib/cart/actions'
import { withNoindexRobots } from '@/lib/seo/noindex'

import { CartView } from './_components/cart-view'

export const metadata: Metadata = withNoindexRobots({
  title: 'Your Cart',
})

async function CartContent() {
  const cart = await getCartAction()

  return <CartView cart={cart} />
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:px-8">
      <h1 className="type-heading-02 mb-6">Your Cart</h1>
      <Suspense
        fallback={
          <div
            className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start"
            role="status"
            aria-live="polite"
          >
            <span className="sr-only">Loading cart</span>
            <div className="space-y-4">
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="border-default bg-surface grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-md border p-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:p-5 xl:grid-cols-[5rem_minmax(0,1fr)_auto_7rem_auto] xl:items-center xl:rounded-none xl:border-0 xl:bg-transparent xl:px-0 xl:py-6"
                >
                  <div className="bg-surface-sunken row-span-3 aspect-square w-20 animate-pulse rounded motion-reduce:animate-none sm:w-24 xl:row-span-1 xl:w-20" />
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="bg-surface-sunken h-5 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-surface-sunken h-4 w-1/2 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-surface-sunken h-5 w-24 animate-pulse rounded motion-reduce:animate-none xl:hidden" />
                  </div>
                  <div className="bg-surface-sunken col-start-2 h-11 w-40 animate-pulse rounded motion-reduce:animate-none xl:col-start-auto" />
                  <div className="bg-surface-sunken hidden h-6 w-24 animate-pulse rounded motion-reduce:animate-none xl:block" />
                  <div className="bg-surface-sunken col-start-2 h-11 w-full animate-pulse rounded motion-reduce:animate-none xl:col-start-auto xl:w-20" />
                </div>
              ))}
            </div>
            <div className="border-default bg-surface rounded-md border p-4 sm:p-6">
              <div className="bg-surface-sunken h-7 w-40 animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-surface-sunken mt-5 h-6 w-full animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-surface-sunken mt-4 h-12 w-full animate-pulse rounded motion-reduce:animate-none" />
            </div>
          </div>
        }
      >
        <CartContent />
      </Suspense>
    </div>
  )
}
