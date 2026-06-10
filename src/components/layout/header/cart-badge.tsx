export function CartBadge({ count }: { count: number }) {
  if (count === 0) return null

  const itemLabel = count === 1 ? 'item' : 'items'

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className="bg-gold text-ink absolute top-1 right-1 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 font-mono text-[10px] font-bold"
    >
      {count}
      <span className="sr-only"> {itemLabel} in cart</span>
    </span>
  )
}
