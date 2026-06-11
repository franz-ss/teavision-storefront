export function CartLoadingSkeleton() {
  return (
    <div
      className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start xl:gap-10"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading cart</span>

      <div className="min-w-0">
        {/* Desktop table header skeleton */}
        <div
          className="border-hairline hidden border-b pb-3 xl:grid xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:items-center xl:gap-x-6"
          aria-label="Loading cart items"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="bg-paper-2 h-4 w-16 animate-pulse rounded motion-reduce:animate-none"
            />
          ))}
        </div>

        {/* Line item skeletons */}
        <ul className="divide-hairline space-y-0 divide-y" aria-hidden="true">
          {Array.from({ length: 2 }, (_, index) => (
            <li key={index} className="flex gap-3.5 py-5">
              {/* Thumb */}
              <div className="bg-paper-2 size-19 shrink-0 animate-pulse rounded-lg motion-reduce:animate-none" />

              {/* Line info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="bg-paper-2 h-5 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-paper-2 mt-1.5 h-3.5 w-1/2 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-paper-2 mt-1.5 h-3.5 w-1/3 animate-pulse rounded motion-reduce:animate-none" />
                  </div>
                  <div className="shrink-0">
                    <div className="bg-paper-2 h-5 w-16 animate-pulse rounded motion-reduce:animate-none" />
                  </div>
                </div>

                {/* Stepper + remove */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="border-hairline bg-paper-2 inline-flex h-11 w-28 animate-pulse rounded-full border motion-reduce:animate-none" />
                  <div className="bg-paper-2 h-4 w-14 animate-pulse rounded motion-reduce:animate-none" />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Packaging note skeleton */}
        <div className="bg-paper-2 mt-6 h-11 animate-pulse rounded-md motion-reduce:animate-none" />

        {/* Checkout form skeleton */}
        <div className="mt-8 space-y-4" aria-label="Loading checkout form">
          <div className="bg-paper-2 border-hairline h-28 animate-pulse rounded-sm border motion-reduce:animate-none" />
          <div className="flex items-start gap-2.5">
            <div className="bg-paper-2 mt-0.5 size-5 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-5 w-72 max-w-full animate-pulse rounded motion-reduce:animate-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-paper-2 h-12 animate-pulse rounded-full motion-reduce:animate-none" />
            <div className="bg-paper-2 h-12 animate-pulse rounded-full motion-reduce:animate-none" />
          </div>
        </div>
      </div>

      {/* Order summary sidebar skeleton */}
      <aside
        aria-label="Loading order summary"
        className="bg-card border-hairline rounded-lg border-t p-6 xl:sticky xl:top-24"
      >
        <div className="bg-paper-2 h-8 w-40 animate-pulse rounded motion-reduce:animate-none" />
        <div className="border-hairline mt-5 space-y-3 border-t pt-5">
          <div className="flex justify-between gap-4">
            <div className="bg-paper-2 h-5 w-12 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-5 w-14 animate-pulse rounded motion-reduce:animate-none" />
          </div>
          <div className="flex justify-between gap-4">
            <div className="bg-paper-2 h-7 w-28 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-7 w-20 animate-pulse rounded motion-reduce:animate-none" />
          </div>
        </div>
        <div className="bg-paper-2 mt-3 h-4 w-full animate-pulse rounded motion-reduce:animate-none" />
        <div className="bg-paper-2 mt-5 h-12 w-full animate-pulse rounded-full motion-reduce:animate-none" />
        <div className="border-hairline mt-4 space-y-2.5 border-t pt-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="bg-paper-2 mt-0.5 size-4 shrink-0 animate-pulse rounded-full motion-reduce:animate-none" />
              <div className="bg-paper-2 h-4 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </aside>

    </div>
  )
}
