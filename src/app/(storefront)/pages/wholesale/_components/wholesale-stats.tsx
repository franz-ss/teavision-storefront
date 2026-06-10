import { WHOLESALE_STATS } from '../_lib/wholesale-content'

export function WholesaleStats() {
  return (
    <dl className="border-paper/15 bg-paper/10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border">
      {WHOLESALE_STATS.map(({ stat, label }) => (
        <div key={label} className="bg-paper/10 p-4">
          <dt className="type-mono-meta text-paper/70">{label}</dt>
          <dd className="type-heading-03 text-gold mt-2">{stat}</dd>
        </div>
      ))}
    </dl>
  )
}
