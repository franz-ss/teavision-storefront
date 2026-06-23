import type { Metadata } from 'next'

import { ConsentPreferences } from '@/components/consent'
import { Card, Section } from '@/components/ui'
import { getLegalPolicy } from '@/lib/legal/policies'
import { withNoindexRobots } from '@/lib/seo/noindex'

const policy = getLegalPolicy('cookie-preferences')

export const metadata: Metadata = withNoindexRobots({
  title: policy.title,
  description: policy.description,
  alternates: { canonical: policy.href },
  openGraph: {
    title: policy.title,
    description: policy.description,
    url: policy.href,
    type: 'website',
  },
})

export default function CookiePreferencesPage() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="max-w-3xl">
          <p className="type-body text-gold-deep">Launch-review policy</p>
          <h1 className="type-heading-02 text-ink mt-3">{policy.title}</h1>
          <p className="type-body text-ink-soft mt-5">
            Choose whether Teavision can use optional analytics and marketing
            cookies. Essential cookies stay on for cart, checkout handoff,
            security, and saving these preferences.
          </p>

          <Card
            as="aside"
            padding="lg"
            radius="md"
            className="border-hairline bg-gold-tint text-gold-deep mt-8"
          >
            <h2 className="type-heading-05">Pending owner/legal review</h2>
            <p className="type-body mt-3">
              This policy route is live for launch review, but final wording
              still needs owner/legal approval before it is treated as final.
            </p>
          </Card>

          <Card
            as="article"
            padding="lg"
            radius="md"
            className="mt-8"
          >
            <h2 className="type-heading-05 text-ink">Your cookie choices</h2>
            <div className="mt-5">
              <ConsentPreferences />
            </div>
            <p className="type-body text-ink-soft mt-4">
              If these preferences cannot be saved, email
              info@teavision.com.au and Teavision will help record your cookie
              choice.
            </p>
          </Card>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
