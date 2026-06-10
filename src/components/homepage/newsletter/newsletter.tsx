import { Eyebrow, Section } from '@/components/ui'
import type { NewsletterSignupActionResult } from '@/lib/contact/types'

import { HomepageNewsletterForm } from './newsletter-form'

type HomepageNewsletterProps = {
  action: (formData: FormData) => Promise<NewsletterSignupActionResult>
}

export function HomepageNewsletter({ action }: HomepageNewsletterProps) {
  return (
    <Section.Root tone="sunken" className="pt-0">
      <Section.Container>
        <div className="overflow-hidden rounded-lg bg-brand-deep p-[clamp(28px,5vw,64px)] text-paper">
          <div className="relative z-1 max-w-120">
            <Eyebrow tone="gold">Monthly newsletter</Eyebrow>
            <h2 className="type-heading-02 mt-4 text-paper">
              Explore the world of tea, monthly.
            </h2>
            <p className="type-lede mt-4 text-paper/75">
              Market insights, brewing tips and the latest from trusted
              suppliers in Australia and beyond.
            </p>

            <HomepageNewsletterForm action={action} />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
