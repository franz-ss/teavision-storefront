import { WHOLESALE_STATS } from '../_lib/wholesale-content'

export function WholesaleStats() {
  return (
    <dl className="border-default bg-surface grid grid-cols-2 gap-px overflow-hidden rounded-lg border">
      {WHOLESALE_STATS.map(({ stat, label }) => (
        <div key={label} className="bg-surface p-4">
          <dt className="type-caption text-muted">{label}</dt>
          <dd className="type-heading-03 text-brand mt-2">{stat}</dd>
        </div>
      ))}
    </dl>
  )
}
