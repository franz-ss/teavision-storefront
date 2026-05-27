export function CartBadge({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <span className="type-caption bg-action-primary text-action-primary-text absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1">
      {count}
      <span className="sr-only"> items in cart</span>
    </span>
  )
}
