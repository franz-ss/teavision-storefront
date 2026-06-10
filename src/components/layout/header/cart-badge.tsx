export function CartBadge({ count }: { count: number }) {
  if (count === 0) return null

  const itemLabel = count === 1 ? 'item' : 'items'

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className="absolute top-1 right-1 inline-flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-gold text-ink font-mono text-[10px] font-bold px-1"
    >
      {count}
      <span className="sr-only"> {itemLabel} in cart</span>
    </span>
  )
}
