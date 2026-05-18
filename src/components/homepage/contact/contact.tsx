import { Card, Section } from '@/components/ui'

import { HomepageContactForm } from '../contact-form'

type ContactProps = {
  action: (formData: FormData) => Promise<void>
}

export function Contact({ action }: ContactProps) {
  return (
    <Section.Root id="need-help" tone="sunken">
      <Section.Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="type-eyebrow text-muted">Need help?</p>
          <h2 className="type-heading-02 text-strong mt-3">
            Speak with our Ingredients Experts Today.
          </h2>
        </div>
        <Card padding="lg" radius="md">
          <HomepageContactForm action={action} />
        </Card>
      </Section.Container>
    </Section.Root>
  )
}
