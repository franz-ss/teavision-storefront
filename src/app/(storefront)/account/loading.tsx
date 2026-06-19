export default function AccountLoading() {
  return (
    <div
      className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start xl:gap-10"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading account</span>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <div className="bg-paper-2 h-4 w-40 animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 h-12 w-72 max-w-full animate-pulse rounded motion-reduce:animate-none" />
        </div>
        <div className="bg-card border-hairline rounded-lg border p-6">
          <div className="bg-paper-2 h-7 w-40 animate-pulse rounded motion-reduce:animate-none" />
          <div className="mt-5 grid gap-4">
            <div className="bg-paper-2 h-20 animate-pulse rounded-lg motion-reduce:animate-none" />
            <div className="bg-paper-2 h-20 animate-pulse rounded-lg motion-reduce:animate-none" />
            <div className="bg-paper-2 h-20 animate-pulse rounded-lg motion-reduce:animate-none" />
          </div>
        </div>
      </div>
      <aside className="grid gap-5">
        <div className="bg-card border-hairline h-44 rounded-lg border p-6">
          <div className="bg-paper-2 h-6 w-28 animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 mt-5 h-4 w-full animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 mt-3 h-4 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
        </div>
        <div className="bg-card border-hairline h-52 rounded-lg border p-6">
          <div className="bg-paper-2 h-6 w-36 animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 mt-5 h-4 w-full animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 mt-3 h-4 w-5/6 animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 mt-3 h-4 w-2/3 animate-pulse rounded motion-reduce:animate-none" />
        </div>
      </aside>
    </div>
  )
}
