export function CartLoadingSkeleton() {
  return (
    <div
      className="min-h-72 py-16 text-center sm:py-24"
      role="status"
      aria-live="polite"
    >
      <div
        className="bg-paper-2 mx-auto mb-8 size-20 animate-pulse rounded-2xl motion-reduce:animate-none"
        aria-hidden="true"
      />
      <h2 className="type-heading-02 text-ink">Checking your cart</h2>
      <p className="type-body text-ink-soft mx-auto mt-3 max-w-lg">
        Preparing your cart details.
      </p>
      <div className="mt-8 flex justify-center" aria-hidden="true">
        <div className="bg-paper-2 h-12 w-34 animate-pulse rounded-full motion-reduce:animate-none" />
      </div>
    </div>
  )
}
