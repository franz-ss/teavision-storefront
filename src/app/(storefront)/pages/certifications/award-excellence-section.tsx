import { Star } from 'lucide-react'

import { Card, Section } from '@/components/ui'

import { AWARD_EXCELLENCE } from './certifications-data'

export function AwardExcellenceSection() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <Section.Intro
          title={AWARD_EXCELLENCE.title}
          copy={AWARD_EXCELLENCE.copy}
        />

        <Card
          padding="lg"
          radius="md"
          className="mx-auto mt-10 max-w-3xl text-center"
        >
          <Star aria-hidden="true" className="text-accent mx-auto size-16" />
          <p className="type-display-01 text-brand mt-6">
            {AWARD_EXCELLENCE.stat}
          </p>
          <h3 className="type-heading-03 text-strong mt-4">
            {AWARD_EXCELLENCE.label}
          </h3>
          <p className="type-body text-muted mt-4">
            {AWARD_EXCELLENCE.detailPrefix}{' '}
            <strong className="text-strong font-semibold">
              {AWARD_EXCELLENCE.detailHighlight}
            </strong>{' '}
            {AWARD_EXCELLENCE.detailSuffix}
          </p>
        </Card>
      </Section.Container>
    </Section.Root>
  )
}
