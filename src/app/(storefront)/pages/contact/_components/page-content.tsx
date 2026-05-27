import { ContactForm } from '@/components/contact'
import { Card } from '@/components/ui'
import { sendContactAction } from '@/lib/contact/actions'

import { Breadcrumb } from './breadcrumb'
import { Hero } from './hero'
import { Sidebar } from './sidebar'

export function PageContent() {
  return (
    <>
      <Hero />

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
        <Breadcrumb />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-start">
          <Card className="p-5 sm:p-8" radius="md">
            <ContactForm action={sendContactAction} />
          </Card>

          <Sidebar />
        </div>
      </div>
    </>
  )
}
