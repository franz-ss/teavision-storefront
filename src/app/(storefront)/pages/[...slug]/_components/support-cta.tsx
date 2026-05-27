import { Button, Section } from '@/components/ui'

export function SupportCta() {
  return (
    <Section.Root tone="surface" className="border-default border-t">
      <Section.Container className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-prose">
          <p className="type-eyebrow text-accent">Wholesale support</p>
          <h2 className="type-heading-03 text-strong mt-3">
            Bring Teavision into the brief
          </h2>
          <p className="type-body-sm text-muted mt-3">
            Share the product type, expected volume, certification needs, and
            timing so the team can point you to the right range.
          </p>
        </div>
        <Button href="/pages/contact" className="w-full sm:w-auto">
          Contact Teavision
        </Button>
      </Section.Container>
    </Section.Root>
  )
}
