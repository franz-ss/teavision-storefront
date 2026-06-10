import { Eyebrow, Section } from '@/components/ui'
import { BrushCircle } from '@/components/homepage/brush-circle'
import { HomepageNewsletterForm } from '@/components/homepage/newsletter/newsletter-form'
import { Stamp } from '@/components/homepage/stamp'
import { submitNewsletterSignupFormAction } from '@/lib/contact/actions'

export function BlogNewsletterBand() {
  return (
    <Section.Root tone="inverse" className="overflow-hidden">
      <Section.Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,260px)_1fr_minmax(0,210px)]">
          <div className="flex justify-center">
            <BrushCircle illo="teapot" />
          </div>

          <div className="mx-auto max-w-[52ch] text-center">
            <Eyebrow tone="gold" className="mb-4 justify-center">
              Monthly newsletter
            </Eyebrow>
            <h2 className="type-heading-01 text-paper">
              Explore the World of Tea with{' '}
              <em className="text-gold italic">Monthly Newsletters</em>
            </h2>
            <p className="type-lede text-paper/75 mt-4">
              Market insights, brewing tips and the latest from trusted
              suppliers in Australia and beyond.
            </p>
            <div className="mt-7">
              <HomepageNewsletterForm
                action={submitNewsletterSignupFormAction}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Stamp top="Business" bottom="Teavision" />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
