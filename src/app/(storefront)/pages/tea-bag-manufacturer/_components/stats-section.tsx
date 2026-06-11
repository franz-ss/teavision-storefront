import { Globe, Leaf, Package, Trophy } from 'lucide-react'

import { Section } from '@/components/ui'

import { STATS } from '../_lib/data'

const STAT_ICONS = [Package, Trophy, Globe, Leaf] as const

export function StatsSection() {
  return (
    <Section.Root tone="inverse" spacing="compact">
      <Section.Container>
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => {
            const Icon = STAT_ICONS[index] ?? Leaf

            return (
              <div key={stat.label} className="flex items-center gap-4">
                <span className="bg-paper/10 text-gold grid size-14 shrink-0 place-items-center rounded-lg">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <div>
                  <dd className="type-heading-03 text-gold">
                    {stat.highlight}
                  </dd>
                  <dt className="type-mono-meta text-paper/70 mt-1">
                    {stat.label}
                  </dt>
                </div>
              </div>
            )
          })}
        </dl>
      </Section.Container>
    </Section.Root>
  )
}
