import { Button, Section } from '@/components/ui'

import { CTA } from '../_lib/data'

export function CtaSection() {
  return (
    <Section.Root tone="brandStrong">
      <Section.Container className="text-center">
        <h2 className="type-heading-02 text-on-brand">{CTA.title}</h2>
        <p className="type-body-lg text-on-brand/80 mx-auto mt-5 max-w-3xl">
          {CTA.copy}
        </p>
        <Button href={CTA.href} variant="inverse" size="cta" className="mt-8">
          {CTA.action}
        </Button>
      </Section.Container>
    </Section.Root>
  )
}
