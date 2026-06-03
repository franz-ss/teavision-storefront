import { Section } from '@/components/ui'
import type { NewsletterSignupActionResult } from '@/lib/contact/types'

import { HomepageNewsletterForm } from './newsletter-form'

type HomepageNewsletterProps = {
  action: (formData: FormData) => Promise<NewsletterSignupActionResult>
}

export function HomepageNewsletter({ action }: HomepageNewsletterProps) {
  return (
    <Section.Root tone="brand">
      <Section.Container>
        <Section.Intro
          title="Explore the World of Tea with Monthly Newsletters"
          copy="Stay informed with monthly updates on loose leaf tea, bulk tea bags,
          herbs, and spices. From market insights to brewing tips, we share the
          latest news and trends from trusted tea suppliers in Australia and
          beyond."
        />

        <HomepageNewsletterForm action={action} />
      </Section.Container>
    </Section.Root>
  )
}
