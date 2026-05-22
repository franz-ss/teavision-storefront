import { Button, Section } from '@/components/ui'

import { CERTIFICATIONS_CTA } from './certifications-data'

export function CertificationsCtaSection() {
  return (
    <Section.Root tone="brandStrong">
      <Section.Container className="text-center">
        <h2 className="type-heading-02 text-on-brand">
          {CERTIFICATIONS_CTA.title}
        </h2>
        <p className="type-body-lg text-on-brand/80 mx-auto mt-5 max-w-3xl">
          {CERTIFICATIONS_CTA.copy}
        </p>
        <Button
          href={CERTIFICATIONS_CTA.href}
          variant="inverse"
          size="cta"
          className="mt-8"
        >
          {CERTIFICATIONS_CTA.action}
        </Button>
      </Section.Container>
    </Section.Root>
  )
}
