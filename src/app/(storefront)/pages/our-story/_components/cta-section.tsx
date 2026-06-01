import { ArrowRight, Mail, Phone } from 'lucide-react'

import { Button, Card, Section } from '@/components/ui'

export function CtaSection() {
  return (
    <Section.Root tone="brandStrong">
      <Section.Container className="flex flex-col gap-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="type-heading-02 text-on-brand">
            Ready to Partner with Australia&apos;s{' '}
            <span className="text-accent-subtle">Premier Tea Suppliers?</span>
          </h2>
          <p className="type-body text-on-brand/80 mx-auto mt-5 max-w-3xl">
            Join hundreds of satisfied customers who trust us for premium bulk
            tea, tea bags, and wholesale tea supply. Experience the Teavision
            difference today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card padding="lg" radius="md" className="border-on-brand/20">
            <h3 className="type-heading-04 text-strong">Bulk Tea Orders</h3>
            <p className="type-body-sm text-muted mt-3">
              Explore our extensive range of bulk tea online and loose tea bulk
              options. Perfect for cafés, restaurants, and retailers.
            </p>
            <Button href="/collections" className="mt-6" size="lg">
              Browse Products
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Card>

          <Card padding="lg" radius="md" className="border-on-brand/20">
            <h3 className="type-heading-04 text-strong">
              Wholesale Partnership
            </h3>
            <p className="type-body-sm text-muted mt-3">
              Become a wholesale partner and access our full range as tea
              manufacturers and wholesale bulk spices suppliers.
            </p>
            <Button
              href="/pages/tea-importers-australia"
              className="mt-6"
              size="lg"
            >
              Get Wholesale Pricing
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Card>
        </div>

        <div className="text-on-brand flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <a
            href="tel:1300729617"
            className="type-label hover:text-accent-subtle focus-visible:ring-ring inline-flex min-h-11 items-center gap-2 rounded-md px-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Phone className="size-4" aria-hidden="true" />
            1300 729 617
          </a>
          <a
            href="mailto:info@teavision.com.au"
            className="type-label hover:text-accent-subtle focus-visible:ring-ring inline-flex min-h-11 items-center gap-2 rounded-md px-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Mail className="size-4" aria-hidden="true" />
            info@teavision.com.au
          </a>
        </div>

        <p className="type-body text-on-brand/75 text-center">
          Contact our team today to discuss your bulk tea and wholesale tea
          supply requirements.
        </p>
      </Section.Container>
    </Section.Root>
  )
}
