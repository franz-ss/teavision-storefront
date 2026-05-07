import Image from 'next/image'

import { Section } from '@/components/ui'

import { PROOF_POINTS } from '../content'

export function ProofPoints() {
  return (
    <Section.Root tone="inverse">
      <Section.Container>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF_POINTS.map((point) => (
            <li key={point.title} className="flex items-center gap-5">
              <Image
                src={point.icon.src}
                alt={point.icon.alt}
                width={point.icon.width}
                height={point.icon.height}
                className="h-16 w-16 shrink-0"
              />
              <div>
                <p className="type-heading-03 text-on-brand">{point.title}</p>
                <p className="type-body-sm text-on-brand/55 mt-2">
                  {point.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
