import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wholesale Accounts | Teavision',
  description:
    'Apply for a Teavision wholesale account. Bulk tea, herbs and spices for cafes, restaurants, and retailers across Australia.',
  openGraph: {
    title: 'Wholesale Accounts | Teavision',
    description:
      'Apply for a Teavision wholesale account. Bulk tea, herbs and spices for cafes, restaurants, and retailers.',
    url: '/pages/wholesale',
  },
  alternates: { canonical: '/pages/wholesale' },
}

export default function WholesalePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Header */}
      <h1 className="text-4xl font-semibold tracking-tight">
        Wholesale Accounts
      </h1>
      <p className="text-text-muted mt-4 text-lg">
        Australia&rsquo;s leading supplier of bulk tea, herbs, and spices.
        Serving cafes, restaurants, retailers, and wellness brands since 2014.
      </p>

      {/* Trust signals */}
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4" role="list">
        {[
          { stat: '1,000+', label: 'Ingredients' },
          { stat: '500+', label: 'Certified Organic' },
          { stat: '15+', label: 'Countries Sourced' },
          { stat: '15+', label: 'Industry Awards' },
        ].map(({ stat, label }) => (
          <li key={label} className="bg-surface rounded p-4 text-center">
            <p className="text-primary text-2xl font-semibold">{stat}</p>
            <p className="text-text-muted mt-1 text-sm">{label}</p>
          </li>
        ))}
      </ul>

      {/* What's included */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">What&rsquo;s included</h2>
        <ul className="mt-4 space-y-2 text-base" role="list">
          {[
            'Trade pricing on orders from 1kg',
            'Custom blending and private label',
            'HACCP and ACO certified supply chain',
            'Dedicated account manager',
            'Catalogue and sample packs available',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-primary mt-0.5 text-sm font-semibold">
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact CTA */}
      <section className="bg-surface mt-12 rounded p-8">
        <h2 className="text-xl font-semibold">Get in touch</h2>
        <p className="text-text-muted mt-2">
          To apply for a wholesale account or request a quote, contact us
          directly:
        </p>
        <dl className="mt-6 space-y-3">
          <div>
            <dt className="text-text-muted text-[0.65rem] font-medium tracking-wide uppercase">
              Phone
            </dt>
            <dd className="mt-1 text-base font-medium">
              <a
                href="tel:1300729617"
                className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                1300 729 617
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-[0.65rem] font-medium tracking-wide uppercase">
              Email
            </dt>
            <dd className="mt-1 text-base font-medium">
              <a
                href="mailto:wholesale@teavision.com.au"
                className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                wholesale@teavision.com.au
              </a>
            </dd>
          </div>
        </dl>
        <p className="text-text-muted mt-6 text-sm">
          Minimum order quantities start from 100kg for new wholesale accounts.
          <Link
            href="/collections/all"
            className="text-primary ml-1 hover:underline"
          >
            Browse our full range
          </Link>{' '}
          to build your order.
        </p>
      </section>
    </div>
  )
}
