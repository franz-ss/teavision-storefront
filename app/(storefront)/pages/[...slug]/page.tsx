import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Section } from '@/components/ui'
import {
  getPage,
  getPageHandleFromSlug,
  getPagePath,
  getPages,
  type ShopifyPage,
} from '@/lib/shopify/operations/page'
import { cn } from '@/lib/utils'

type Props = {
  params: Promise<{ slug: string[] }>
}

type PageLink = {
  href: string
  label: string
  description: string
}

type ProofPoint = {
  term: string
  detail: string
}

type PageProfile = {
  kicker: string
  supportTitle: string
  supportCopy: string
  primaryAction: PageLink
  secondaryAction: PageLink
  proofPoints: ProofPoint[]
  relatedLinks: PageLink[]
}

const PAGE_BODY_CLASS_NAME = cn(
  'type-body space-y-6 break-words text-default',
  '[&>*:first-child]:mt-0 [&_*]:!text-inherit [&_a]:!text-link [&_a]:underline [&_a]:underline-offset-4',
  '[&_blockquote]:type-body-lg [&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:border-default [&_blockquote]:bg-surface [&_blockquote]:p-5 [&_blockquote]:italic',
  '[&_h2]:type-heading-02 [&_h2]:mt-10 [&_h2]:!text-strong [&_h3]:type-heading-03 [&_h3]:mt-8 [&_h3]:!text-strong',
  '[&_h4]:type-heading-04 [&_h4]:mt-8 [&_h4]:!text-strong [&_hr]:border-default',
  '[&_img]:my-8 [&_img]:h-auto [&_img]:rounded-lg [&_img]:border [&_img]:border-default',
  '[&_li]:pl-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:text-default [&_strong]:type-label',
  '[&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-default [&_td]:p-3',
  '[&_th]:type-label [&_th]:border [&_th]:border-default [&_th]:bg-surface-sunken [&_th]:p-3 [&_ul]:list-disc [&_ul]:pl-6',
)

const PRIMARY_LINK_CLASS_NAME =
  'type-label bg-action-primary text-action-primary-text hover:bg-action-primary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const SECONDARY_LINK_CLASS_NAME =
  'type-label border-action-secondary-border text-action-secondary-text hover:bg-action-secondary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md border px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const TEXT_LINK_CLASS_NAME =
  'text-link hover:text-link-hover focus-visible:ring-ring rounded underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const POLICY_HANDLES = new Set([
  'terms-conditions',
  'terms-of-service',
  'refund-policy',
  'terms-conditions-1',
  'appi-compliance',
  'pipeda-compliance',
  'gdpr-compliance',
  'us-laws-compliance',
])

const SERVICE_HANDLES = new Set([
  'services',
  'custom-tea-blends',
  'private-label-packing',
  'bulk-wholesale-supply',
  'tea-bag-manufacturer',
  'pyramid-tea-bag-supplier',
  'tea-importers-australia',
  'tea-brokers',
  'global-tea-supplier',
  'tea-supplier-nz',
  'import-tea-herbs-australia',
])

const GUIDE_HANDLES = new Set([
  'faq',
  'wholesale-tea-supplier-faq',
  'how-to-store-bulk-tea',
  'how-long-does-bulk-tea-last',
  'australian-herbs-and-teas',
  'natural-sweeteners-australia',
])

const COMPANY_HANDLES = new Set([
  'our-story',
  'certifications',
  'reviews',
  'evolution',
])

const STATIC_PAGE_HANDLES = new Set(['contact', 'wholesale'])

const DEFAULT_PROFILE: PageProfile = {
  kicker: 'Teavision pages',
  supportTitle: 'Talk to a real team',
  supportCopy:
    'Use this page as a starting point, then bring the Teavision team into the supply conversation when you need detail.',
  primaryAction: {
    href: '/pages/wholesale-account-request',
    label: 'Request wholesale access',
    description: 'Open an account for bulk ingredients, samples, and support.',
  },
  secondaryAction: {
    href: '/pages/contact',
    label: 'Speak with our team',
    description: 'Ask a sourcing, product, or order question.',
  },
  proofPoints: [
    {
      term: 'Wholesale focus',
      detail: 'Built for cafes, retailers, manufacturers, and wellness brands.',
    },
    {
      term: 'Broad range',
      detail:
        'Tea, herbs, spices, powders, extracts, and tea bags in one place.',
    },
    {
      term: 'Practical support',
      detail: 'Samples, catalogue guidance, and sourcing advice before scale.',
    },
  ],
  relatedLinks: [
    {
      href: '/pages/services',
      label: 'Services',
      description: 'See the main wholesale supply capabilities.',
    },
    {
      href: '/pages/custom-tea-blends',
      label: 'Custom tea blends',
      description: 'Plan blends, flavour direction, and commercial supply.',
    },
    {
      href: '/pages/download-catalogues',
      label: 'Download catalogues',
      description: 'Browse the range before making a shortlist.',
    },
  ],
}

const SERVICE_PROFILE: PageProfile = {
  ...DEFAULT_PROFILE,
  kicker: 'Wholesale services',
  supportTitle: 'Build the brief before the quote',
  supportCopy:
    'Commercial supply works best when product type, pack size, certification, and launch timing are clear.',
  primaryAction: {
    href: '/pages/contact',
    label: 'Discuss this service',
    description: 'Share the scope, timing, and product requirements.',
  },
  secondaryAction: {
    href: '/pages/wholesale-account-request',
    label: 'Apply for wholesale',
    description: 'Set up access for trade pricing and account support.',
  },
  proofPoints: [
    {
      term: 'Commercial scale',
      detail: 'Bulk supply, blends, tea bags, and packing for repeat ordering.',
    },
    {
      term: 'Range depth',
      detail:
        'Ingredient options across organic, functional, native, and cafe use.',
    },
    {
      term: 'Buyer-ready details',
      detail: 'Help with samples, certifications, pack sizes, and lead times.',
    },
  ],
  relatedLinks: [
    {
      href: '/pages/custom-tea-blends',
      label: 'Custom tea blends',
      description: 'Create a blend for retail, cafe, or wellness channels.',
    },
    {
      href: '/pages/private-label-packing',
      label: 'Private label packing',
      description: 'Prepare packed product for your own brand.',
    },
    {
      href: '/pages/tea-bag-manufacturer',
      label: 'Tea bag manufacture',
      description: 'Explore pyramid and commercial tea bag options.',
    },
  ],
}

const POLICY_PROFILE: PageProfile = {
  ...DEFAULT_PROFILE,
  kicker: 'Policy',
  supportTitle: 'Clear terms for commercial buying',
  supportCopy:
    'Policies are here to remove ambiguity before orders, account setup, or compliance review.',
  primaryAction: {
    href: '/pages/contact',
    label: 'Ask about this policy',
    description: 'Get clarification from the Teavision team.',
  },
  secondaryAction: {
    href: '/pages/terms-conditions',
    label: 'View terms',
    description: 'Read the primary commercial terms and conditions.',
  },
  proofPoints: [
    {
      term: 'Current reference',
      detail: 'Use the modified date to confirm the page version in review.',
    },
    {
      term: 'Commercial clarity',
      detail:
        'Policies support ordering, returns, privacy, and compliance checks.',
    },
    {
      term: 'Human follow-up',
      detail: 'The team can clarify how a policy applies to your order.',
    },
  ],
  relatedLinks: [
    {
      href: '/pages/terms-conditions',
      label: 'Terms and conditions',
      description: 'Commercial account and order terms.',
    },
    {
      href: '/pages/refund-policy',
      label: 'Refund policy',
      description: 'Review returns and refund expectations.',
    },
    {
      href: '/pages/contact',
      label: 'Contact',
      description: 'Ask for clarification before ordering.',
    },
  ],
}

const GUIDE_PROFILE: PageProfile = {
  ...DEFAULT_PROFILE,
  kicker: 'Buyer guide',
  supportTitle: 'Use the guide to narrow the brief',
  supportCopy:
    'These pages help buyers make practical choices about storage, shelf life, ingredients, and wholesale supply.',
  primaryAction: {
    href: '/pages/download-catalogues',
    label: 'Download catalogues',
    description: 'Move from reading to shortlisting products.',
  },
  secondaryAction: {
    href: '/pages/contact',
    label: 'Ask an expert',
    description: 'Check details before you order or sample.',
  },
  proofPoints: [
    {
      term: 'Operational detail',
      detail: 'Focused on buying, storing, handling, and scaling ingredients.',
    },
    {
      term: 'Wholesale context',
      detail: 'Written for repeated commercial use rather than one-off retail.',
    },
    {
      term: 'Next step ready',
      detail: 'Pair the guidance with samples, catalogues, and team advice.',
    },
  ],
  relatedLinks: [
    {
      href: '/pages/wholesale-tea-supplier-faq',
      label: 'Wholesale supplier FAQ',
      description: 'Common wholesale ordering and supply questions.',
    },
    {
      href: '/pages/how-to-store-bulk-tea',
      label: 'How to store bulk tea',
      description: 'Protect freshness in commercial storage.',
    },
    {
      href: '/pages/how-long-does-bulk-tea-last',
      label: 'Bulk tea shelf life',
      description: 'Plan stock rotation and freshness expectations.',
    },
  ],
}

const COMPANY_PROFILE: PageProfile = {
  ...DEFAULT_PROFILE,
  kicker: 'Company',
  supportTitle: 'Credibility buyers can pass on',
  supportCopy:
    'These pages help procurement teams understand the business behind the catalogue.',
  primaryAction: {
    href: '/pages/wholesale-account-request',
    label: 'Request wholesale access',
    description: 'Move from supplier review to account setup.',
  },
  secondaryAction: {
    href: '/pages/contact',
    label: 'Talk to Teavision',
    description: 'Ask for certification, sourcing, or capability detail.',
  },
  proofPoints: [
    {
      term: 'Established supplier',
      detail: 'Founded in 2014 and built around commercial tea supply.',
    },
    {
      term: 'Certification signal',
      detail: 'Compliance and certification details support buyer confidence.',
    },
    {
      term: 'Buyer evidence',
      detail: 'Reviews, story, and service pages help validate fit.',
    },
  ],
  relatedLinks: [
    {
      href: '/pages/our-story',
      label: 'Our story',
      description: 'Understand the business behind the range.',
    },
    {
      href: '/pages/certifications',
      label: 'Certifications',
      description: 'Review trust and compliance signals.',
    },
    {
      href: '/pages/reviews',
      label: 'Reviews',
      description: 'See buyer feedback and reputation signals.',
    },
  ],
}

const PAGE_PROFILE_OVERRIDES: Record<string, Partial<PageProfile>> = {
  'download-catalogues': {
    kicker: 'Catalogues',
    supportTitle: 'Turn the range into a shortlist',
    primaryAction: {
      href: '/pages/contact',
      label: 'Request catalogue help',
      description: 'Ask the team which catalogue fits your buying brief.',
    },
  },
  'wholesale-account-request': {
    kicker: 'Wholesale access',
    supportTitle: 'Start the trade relationship',
    primaryAction: {
      href: '/pages/wholesale',
      label: 'Open wholesale page',
      description: 'Use the dedicated wholesale enquiry path.',
    },
    secondaryAction: {
      href: '/pages/contact',
      label: 'Ask before applying',
      description: 'Check account, MOQ, or product fit first.',
    },
  },
  'new-product-development-order-form': {
    kicker: 'Product development',
    supportTitle: 'Make the product brief concrete',
    primaryAction: {
      href: '/pages/contact',
      label: 'Discuss product development',
      description: 'Share launch goals, ingredients, and packing needs.',
    },
  },
  'search-results': {
    kicker: 'Search utility',
    supportTitle: 'Find the right product path',
    primaryAction: {
      href: '/search',
      label: 'Open site search',
      description: 'Search the current product catalogue.',
    },
  },
  'search-results-page': {
    kicker: 'Search utility',
    supportTitle: 'Find the right product path',
    primaryAction: {
      href: '/search',
      label: 'Open site search',
      description: 'Search the current product catalogue.',
    },
  },
}

function getBaseProfile(handle: string): PageProfile {
  if (POLICY_HANDLES.has(handle)) return POLICY_PROFILE
  if (SERVICE_HANDLES.has(handle)) return SERVICE_PROFILE
  if (GUIDE_HANDLES.has(handle)) return GUIDE_PROFILE
  if (COMPANY_HANDLES.has(handle)) return COMPANY_PROFILE

  return DEFAULT_PROFILE
}

function mergePageProfile(handle: string): PageProfile {
  const baseProfile = getBaseProfile(handle)
  const override = PAGE_PROFILE_OVERRIDES[handle]

  if (!override) return baseProfile

  return {
    ...baseProfile,
    ...override,
    primaryAction: override.primaryAction ?? baseProfile.primaryAction,
    secondaryAction: override.secondaryAction ?? baseProfile.secondaryAction,
    proofPoints: override.proofPoints ?? baseProfile.proofPoints,
    relatedLinks: override.relatedLinks ?? baseProfile.relatedLinks,
  }
}

function plainTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizePageBodyHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s(?:style|class|id|data-[^=]+)="[^"]*"/gi, '')
    .replace(/\s(?:style|class|id|data-[^=]+)='[^']*'/gi, '')
    .replace(/<h1(\s[^>]*)?>/gi, '<h2>')
    .replace(/<\/h1>/gi, '</h2>')
}

function pageDescription(bodySummary: string, body: string): string {
  return bodySummary || plainTextFromHtml(body).slice(0, 180)
}

function truncateMetaDescription(value: string): string {
  return value.length > 160 ? `${value.slice(0, 157).trimEnd()}...` : value
}

function formatUpdatedDate(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return 'Recently updated'
  }

  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateStaticParams() {
  const pages = await getPages()

  return pages
    .filter((page) => !STATIC_PAGE_HANDLES.has(page.handle))
    .map((page) => ({
      slug: [page.handle],
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  if (slug.length !== 1) {
    return { title: 'Page Not Found' }
  }

  const handle = getPageHandleFromSlug(slug)
  const page = handle ? await getPage(handle) : null

  if (!page) {
    return { title: 'Page Not Found' }
  }

  const description = truncateMetaDescription(
    (page.seo.description ?? pageDescription(page.bodySummary, page.body)) ||
      `${page.title} from Teavision, Australia's wholesale tea, herb, and spice supplier.`,
  )
  const title = page.seo.title ?? page.title
  const canonical = getPagePath(page.handle)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    alternates: { canonical },
  }
}

function PageContent({ page }: { page: ShopifyPage }) {
  const profile = mergePageProfile(page.handle)
  const description =
    page.seo.description ?? pageDescription(page.bodySummary, page.body)
  const canonical = getPagePath(page.handle)
  const bodyHtml = normalizePageBodyHtml(page.body)
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.teavision.com.au'
  const pageUrl = `${baseUrl}${canonical}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        name: page.title,
        description,
        url: pageUrl,
        dateModified: page.updatedAt,
        publisher: {
          '@type': 'Organization',
          name: 'Teavision',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <Section.Root tone="sunken" className="border-default border-b">
          <Section.Container>
            <nav
              className="type-body-sm text-muted mb-8 flex flex-wrap items-center gap-2"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className={cn(
                  TEXT_LINK_CLASS_NAME,
                  'inline-flex min-h-10 items-center',
                )}
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-default" aria-current="page">
                {page.title}
              </span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-3 lg:items-end">
              <div className="min-w-0 lg:col-span-2">
                <p className="type-eyebrow text-accent">{profile.kicker}</p>
                <h1 className="type-display-01 text-strong mt-5 max-w-4xl text-balance">
                  {page.title}
                </h1>
                {description && (
                  <p className="type-body-lg text-muted mt-6 max-w-prose break-words">
                    {description}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={profile.primaryAction.href}
                    className={cn(PRIMARY_LINK_CLASS_NAME, 'w-full sm:w-auto')}
                  >
                    {profile.primaryAction.label}
                  </Link>
                  <Link
                    href={profile.secondaryAction.href}
                    className={cn(
                      SECONDARY_LINK_CLASS_NAME,
                      'w-full sm:w-auto',
                    )}
                  >
                    {profile.secondaryAction.label}
                  </Link>
                </div>
              </div>

              <aside className="border-default bg-surface rounded-lg border p-5">
                <p className="type-heading-05 text-strong">
                  {profile.supportTitle}
                </p>
                <p className="type-body-sm text-muted mt-3">
                  {profile.supportCopy}
                </p>
                <dl className="mt-6 grid gap-5">
                  <div>
                    <dt className="type-eyebrow text-accent">Updated</dt>
                    <dd className="type-label text-default mt-1">
                      {formatUpdatedDate(page.updatedAt)}
                    </dd>
                  </div>
                  {profile.proofPoints.map((point) => (
                    <div
                      key={point.term}
                      className="border-default border-t pt-5"
                    >
                      <dt className="type-label text-strong">{point.term}</dt>
                      <dd className="type-body-sm text-muted mt-2">
                        {point.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </Section.Container>
        </Section.Root>

        <main className="bg-canvas">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-3 lg:py-16">
            <div
              className={cn(PAGE_BODY_CLASS_NAME, 'max-w-prose lg:col-span-2')}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            <aside className="lg:pl-8">
              <div className="border-default border-t pt-6">
                <p className="type-eyebrow text-accent">Useful next paths</p>
                <ul className="mt-5 grid gap-5" role="list">
                  {profile.relatedLinks.map((link) => (
                    <li
                      key={link.href}
                      className="border-default border-t pt-5"
                    >
                      <Link
                        href={link.href}
                        className={cn(TEXT_LINK_CLASS_NAME, 'type-label')}
                      >
                        {link.label}
                      </Link>
                      <p className="type-body-sm text-muted mt-2">
                        {link.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <Section.Root tone="surface" className="border-default border-t">
            <Section.Container className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-prose">
                <p className="type-eyebrow text-accent">Wholesale support</p>
                <h2 className="type-heading-03 text-strong mt-3">
                  Bring Teavision into the brief
                </h2>
                <p className="type-body-sm text-muted mt-3">
                  Share the product type, expected volume, certification needs,
                  and timing so the team can point you to the right range.
                </p>
              </div>
              <Link
                href="/pages/contact"
                className={cn(PRIMARY_LINK_CLASS_NAME, 'w-full sm:w-auto')}
              >
                Contact Teavision
              </Link>
            </Section.Container>
          </Section.Root>
        </main>
      </article>
    </>
  )
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params

  if (slug.length !== 1) {
    notFound()
  }

  const handle = getPageHandleFromSlug(slug)
  const page = handle ? await getPage(handle) : null

  if (!page) {
    notFound()
  }

  return <PageContent page={page} />
}
