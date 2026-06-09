import { Card } from '@/components/ui'

export function CartLoadingSkeleton() {
  return (
    <div
      className="grid gap-8 pb-24 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start xl:gap-10 xl:pb-0"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading cart</span>

      <div className="min-w-0">
        <Card padding="md" aria-label="Loading cart items">
          <div className="border-default hidden border-b pb-3 xl:grid xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:items-center xl:gap-x-6">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="bg-surface-sunken h-4 w-16 animate-pulse rounded motion-reduce:animate-none"
              />
            ))}
          </div>

          <ul
            className="xl:divide-border space-y-4 xl:space-y-0 xl:divide-y"
            aria-hidden="true"
          >
            {Array.from({ length: 2 }, (_, index) => (
              <li
                key={index}
                className="border-default bg-surface grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-md border p-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:p-5 lg:grid-cols-[5rem_minmax(0,1fr)_auto_auto] lg:items-center xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:items-start xl:gap-x-6 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:py-5"
              >
                <div className="bg-surface-sunken row-span-3 aspect-square w-20 animate-pulse rounded motion-reduce:animate-none sm:w-24 lg:row-span-1 xl:row-span-2 xl:w-24" />

                <div className="min-w-0 flex-1">
                  <div className="bg-surface-sunken h-5 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
                  <div className="bg-surface-sunken mt-2 h-4 w-1/2 animate-pulse rounded motion-reduce:animate-none" />
                  <div className="mt-2 xl:hidden">
                    <div className="bg-surface-sunken h-5 w-24 animate-pulse rounded motion-reduce:animate-none" />
                  </div>
                  <div className="mt-2 hidden flex-col gap-1 xl:flex">
                    <div className="bg-surface-sunken h-4 w-28 animate-pulse rounded motion-reduce:animate-none" />
                  </div>
                </div>

                <div className="hidden xl:col-start-3 xl:row-start-1 xl:block">
                  <div className="bg-surface-sunken h-5 w-16 animate-pulse rounded motion-reduce:animate-none" />
                  <div className="bg-surface-sunken mt-1 h-4 w-12 animate-pulse rounded motion-reduce:animate-none" />
                </div>

                <div className="col-start-2 flex items-center gap-2 lg:col-start-3 xl:col-start-4 xl:row-start-1 xl:justify-center">
                  <div className="bg-surface-sunken mr-auto h-4 w-16 animate-pulse rounded motion-reduce:animate-none lg:hidden" />
                  <div className="border-default inline-grid grid-cols-[2.25rem_2.25rem_2.25rem] overflow-hidden rounded-full border">
                    {Array.from({ length: 3 }, (_, segmentIndex) => (
                      <div
                        key={segmentIndex}
                        className="bg-surface-sunken h-9 w-9 animate-pulse motion-reduce:animate-none"
                      />
                    ))}
                  </div>
                </div>

                <div className="hidden text-right xl:col-start-5 xl:row-start-1 xl:block">
                  <div className="bg-surface-sunken ml-auto h-5 w-16 animate-pulse rounded motion-reduce:animate-none" />
                  <div className="bg-surface-sunken mt-1 ml-auto h-4 w-12 animate-pulse rounded motion-reduce:animate-none" />
                </div>

                <div className="col-start-2 lg:col-start-4 xl:col-start-2">
                  <div className="bg-surface-sunken h-9 w-full animate-pulse rounded motion-reduce:animate-none lg:w-20" />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="border-default bg-brand-subtle mt-6 h-11 animate-pulse rounded-md border motion-reduce:animate-none" />
        <div
          className="mt-8 space-y-4"
          aria-label="Loading checkout form"
        >
          <div className="bg-surface h-28 animate-pulse rounded-md border border-default motion-reduce:animate-none" />
          <div className="flex items-start gap-2.5">
            <div className="bg-surface-sunken mt-0.5 h-5 w-5 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-surface-sunken h-5 w-72 max-w-full animate-pulse rounded motion-reduce:animate-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-sunken h-12 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-surface-sunken h-12 animate-pulse rounded motion-reduce:animate-none" />
          </div>
        </div>
      </div>

      <aside
        aria-label="Loading order summary"
        className="border-default bg-surface rounded-lg border p-4 sm:p-6 xl:sticky xl:top-24"
      >
        <div className="bg-surface-sunken h-7 w-40 animate-pulse rounded motion-reduce:animate-none" />
        <div className="border-default mt-5 space-y-3 border-t pt-5">
          <div className="flex justify-between gap-4">
            <div className="bg-surface-sunken h-5 w-12 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-surface-sunken h-5 w-14 animate-pulse rounded motion-reduce:animate-none" />
          </div>
          <div className="flex justify-between gap-4">
            <div className="bg-surface-sunken h-6 w-24 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-surface-sunken h-6 w-20 animate-pulse rounded motion-reduce:animate-none" />
          </div>
        </div>
        <div className="border-default mt-4 space-y-2.5 border-t pt-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="bg-surface-sunken mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded-full motion-reduce:animate-none" />
              <div className="bg-surface-sunken h-4 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </aside>

      <div
        className="border-default bg-surface shadow-3 fixed inset-x-0 bottom-0 z-40 border-t xl:hidden"
        aria-label="Loading mobile checkout"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <div className="bg-surface-sunken h-4 w-20 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-surface-sunken mt-1 h-6 w-24 animate-pulse rounded motion-reduce:animate-none" />
          </div>
          <div className="bg-surface-sunken h-12 w-32 shrink-0 animate-pulse rounded motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  )
}
