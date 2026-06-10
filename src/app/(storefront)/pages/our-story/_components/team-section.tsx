import { Card, Section } from '@/components/ui'

import { TEAM_IMAGE, TEAM_POINTS } from '../_lib/data'
import { SectionHeading } from './section-heading'
import { StoryImage } from './story-image'

export function TeamSection() {
  return (
    <Section.Root id="our-team" tone="surface" className="scroll-mt-24">
      <Section.Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="People behind the blend"
          title="Our"
          highlight="Team"
          copy="At the heart of Teavision is a diverse, multi-cultural team united by a passion for natural ingredients and wellness."
        />

        <Card overflow="hidden" radius="lg" className="aspect-16/7">
          <StoryImage
            image={TEAM_IMAGE}
            sizes="(min-width: 1024px) 90rem, 100vw"
          />
        </Card>

        <ul className="grid gap-4 md:grid-cols-3" role="list">
          {TEAM_POINTS.map((point) => (
            <Card
              as="li"
              key={point.title}
              padding="lg"
              radius="lg"
              tone="sunken"
            >
              <h3 className="type-heading-05 text-ink">{point.title}</h3>
              <p className="type-body-sm text-ink-soft mt-3">
                {point.description}
              </p>
            </Card>
          ))}
        </ul>

        <p className="type-body-lg border-hairline text-ink-soft mx-auto max-w-4xl border-y py-6 text-center">
          We pride ourselves on building strong relationships with partners,
          ensuring that every stakeholder, from farmers to retailers, is part of
          our growing Teavision family.
        </p>
      </Section.Container>
    </Section.Root>
  )
}
