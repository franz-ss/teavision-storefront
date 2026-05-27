import { Button, Card, Section } from '@/components/ui'

import { PROCESS_STEPS } from '../_lib/data'

export function ProcessSection() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="type-eyebrow text-muted">Process</p>
            <h2 className="type-heading-02 text-strong mt-3">
              From idea to shelf in six practical steps.
            </h2>
          </div>
          <Button href="#blend-brief" variant="secondary">
            Start a brief
          </Button>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          {PROCESS_STEPS.map((step, index) => (
            <Card as="li" key={step.title} padding="md">
              <span className="bg-brand-subtle text-brand type-label flex size-9 items-center justify-center rounded-full">
                {index + 1}
              </span>
              <h3 className="type-heading-05 text-strong mt-5">{step.title}</h3>
              <p className="type-body-sm text-muted mt-3">{step.description}</p>
            </Card>
          ))}
        </ol>
      </Section.Container>
    </Section.Root>
  )
}
