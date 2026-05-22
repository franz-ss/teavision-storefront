import { Shield, Trophy, Users, type LucideIcon } from 'lucide-react'

import { Card, Section } from '@/components/ui'

import { CERTIFICATION_TRUST_POINTS } from './certifications-data'

const ICON_MAP: Record<
  (typeof CERTIFICATION_TRUST_POINTS)[number]['icon'],
  LucideIcon
> = {
  shield: Shield,
  trophy: Trophy,
  users: Users,
}

export function TrustPointsSection() {
  return (
    <Section.Root tone="sunken">
      <Section.Container>
        <ul className="grid gap-5 md:grid-cols-3" role="list">
          {CERTIFICATION_TRUST_POINTS.map((point) => {
            const Icon = ICON_MAP[point.icon]

            return (
              <Card
                as="li"
                key={point.title}
                padding="lg"
                radius="md"
                className="h-full text-center"
              >
                <div className="bg-brand text-on-brand mx-auto flex size-16 items-center justify-center rounded-full">
                  <Icon aria-hidden="true" className="size-8" />
                </div>
                <h3 className="type-heading-05 text-strong mt-5">
                  {point.title}
                </h3>
                <p className="type-body-sm text-muted mt-3">
                  {point.description}
                </p>
              </Card>
            )
          })}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
