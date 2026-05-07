import { Section } from '@/components/ui'

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
        <div className="border-default bg-surface shadow-1 rounded-md border p-5 sm:p-6">
          <HomepageContactForm action={action} />
        </div>
      </Section.Container>
    </Section.Root>
  )
}
