import type { Metadata } from 'next'

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
        <div className="max-w-prose">
          <p className="type-body text-gold-deep">Launch-review policy</p>
          <h1 className="type-heading-02 text-ink mt-3">{policy.title}</h1>
          <p className="type-body text-ink-soft mt-5">
            This code-owned route keeps the cookie preferences URL available for
            launch review before the consent controls are wired in the next
            plan.
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
            className="border-hairline bg-card mt-8"
          >
            <h2 className="type-heading-05 text-ink">
              Launch-review wording
            </h2>
            <p className="type-body text-ink-soft mt-4">
              This page is a placeholder for the approved cookie preference
              experience. It establishes the stable URL that will host consent
              category controls for essential, analytics, and marketing cookies.
            </p>
            <p className="type-body text-ink-soft mt-4">
              Until owner/legal approval and consent controls are recorded,
              contact Teavision at info@teavision.com.au for questions about
              cookie preferences or review status.
            </p>
          </Card>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
