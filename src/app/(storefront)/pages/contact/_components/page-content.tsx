import { ContactForm } from '@/components/contact'
import { Card, Section } from '@/components/ui'
import { sendContactAction } from '@/lib/contact/actions'

import { Hero } from './hero'
import { Sidebar } from './sidebar'

export function PageContent() {
  return (
    <>
      <Hero />

      <Section.Root tone="inverse">
        <Section.Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.42fr)_minmax(0,0.58fr)] lg:items-start">
            <Sidebar />
            <Card className="p-5 sm:p-8" radius="lg">
              <ContactForm action={sendContactAction} />
            </Card>
          </div>
        </Section.Container>
      </Section.Root>
    </>
  )
}
