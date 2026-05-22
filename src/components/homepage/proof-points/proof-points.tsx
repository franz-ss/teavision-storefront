import Image from 'next/image'
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
    <Section.Root tone="inverse" spacing="compact">
      <Section.Container>
        <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {points.map((point) => {
            const IconComponent = point.icon ? ICON_MAP[point.icon] : undefined
            return (
              <li key={point.title} className="flex items-center gap-4">
                <div className="bg-on-brand/10 flex items-center justify-center rounded-sm p-4">
                  {point.image ? (
                    <Image
                      src={point.image.src}
                      alt={point.image.alt}
                      width={point.image.width}
                      height={point.image.height}
                      className="h-6 w-12 shrink-0 object-cover"
                    />
                  ) : null}
                  {!point.image && IconComponent ? (
                    <IconComponent className="text-on-brand size-10 shrink-0" />
                  ) : null}
                </div>
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
