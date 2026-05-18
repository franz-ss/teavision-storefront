import { Users, Award, Globe, CheckCircle, type LucideIcon } from 'lucide-react'

import { Section } from '@/components/ui'

import { PROOF_POINTS } from '../content'

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Award,
  Globe,
  CheckCircle,
}

export function ProofPoints() {
  return (
    <Section.Root tone="inverse" spacing="compact">
      <Section.Container>
        <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {PROOF_POINTS.map((point) => {
            const IconComponent = ICON_MAP[point.icon]
            return (
              <li key={point.title} className="flex items-center gap-4">
                {IconComponent && (
                  <IconComponent className="text-on-brand size-10 shrink-0" />
                )}
                <div>
                  <p className="type-heading-03 text-on-brand">{point.title}</p>
                  <p className="type-body-sm text-on-brand/55">
                    {point.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
