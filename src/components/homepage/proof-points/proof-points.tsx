import {
  Award,
  CheckCircle,
  FlaskConical,
  Globe,
  Medal,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { Section } from '@/components/ui'

import { PROOF_POINTS, type ProofPoint } from '../content'

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  CheckCircle,
  FlaskConical,
  Globe,
  Medal,
  Truck,
  Users,
}

export type ProofPointsProps = {
  points?: ProofPoint[]
}

export function ProofPoints({ points = PROOF_POINTS }: ProofPointsProps) {
  return (
    <Section.Root tone="brand" spacing="compact">
      <Section.Container>
        <ul className="grid grid-cols-2 gap-0 lg:grid-cols-4">
          {points.map((point) => {
            const IconComponent = point.icon ? ICON_MAP[point.icon] : undefined
            return (
              <li
                key={point.title}
                className="flex flex-col items-center gap-3 px-6 py-4 text-center first:border-l-0 lg:border-l lg:border-paper/12"
              >
                {IconComponent ? (
                  <IconComponent
                    className="text-gold size-6 shrink-0"
                    aria-hidden="true"
                  />
                ) : null}
                <p
                  className="font-display text-[2.4rem] leading-none text-paper"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {point.title}
                </p>
                <p className="type-body-sm text-paper/78">{point.description}</p>
              </li>
            )
          })}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
