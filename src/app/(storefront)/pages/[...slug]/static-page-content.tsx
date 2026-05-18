import Link from 'next/link'

import { Button, Card, Section } from '@/components/ui'
import { RichText } from '@/components/ui/rich-text'
import { sanitizeShopifyPageBodyHtml } from '@/lib/shopify/html-content'
import {
  getPagePath,
  type ShopifyPage,
} from '@/lib/shopify/operations/storefront-page'
import { getSiteUrl } from '@/lib/seo/site-url'
import { cn } from '@/lib/utils'

import {
  formatUpdatedDate,
  getStaticPageLeadDescription,
} from './page-formatting'
import {
  resolvePageProfile,
  type PageLink,
  type PageProfile,
} from './page-profile'

type StaticPageContentProps = {
  page: ShopifyPage
}

const TEXT_LINK_CLASS_NAME =
  'text-link hover:text-link-hover focus-visible:ring-ring rounded underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? '').replace(/</g, '\\u003c')
}

function StaticPageJsonLd({
  description,
  page,
}: {
  description: string
  page: ShopifyPage
}) {
  const canonical = getPagePath(page.handle)
  const pageUrl = getSiteUrl(canonical)
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
            item: getSiteUrl('/'),
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav className="type-body-sm text-muted mb-8" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2" role="list">
        <li>
          <Link
            href="/"
            className={cn(
              TEXT_LINK_CLASS_NAME,
              'inline-flex min-h-10 items-center',
            )}
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-default" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  )
}

function ActionLinks({ profile }: { profile: PageProfile }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button href={profile.primaryAction.href} className="w-full sm:w-auto">
        {profile.primaryAction.label}
      </Button>
      <Button
        href={profile.secondaryAction.href}
        variant="secondary"
        className="w-full sm:w-auto"
      >
        {profile.secondaryAction.label}
      </Button>
    </div>
  )
}

function PageHero({
  description,
  page,
  profile,
}: {
  description: string
  page: ShopifyPage
  profile: PageProfile
}) {
  return (
    <Section.Root tone="sunken" className="border-default border-b">
      <Section.Container>
        <Breadcrumb title={page.title} />

        <div className="grid gap-8 lg:grid-cols-3 lg:items-end">
          <div className="min-w-0 lg:col-span-2">
            <p className="type-eyebrow text-accent">{profile.kicker}</p>
            <h1 className="type-display-01 text-strong mt-5 max-w-4xl text-balance">
              {page.title}
            </h1>
            {description && (
              <p className="type-body-lg text-muted mt-6 max-w-prose wrap-break-word">
                {description}
              </p>
            )}
            <ActionLinks profile={profile} />
          </div>

          <SupportPanel page={page} profile={profile} />
        </div>
      </Section.Container>
    </Section.Root>
  )
}

function SupportPanel({
  page,
  profile,
}: {
  page: ShopifyPage
  profile: PageProfile
}) {
  return (
    <Card as="aside" padding="md">
      <p className="type-heading-05 text-strong">{profile.supportTitle}</p>
      <p className="type-body-sm text-muted mt-3">{profile.supportCopy}</p>
      <dl className="mt-6 grid gap-5">
        <div>
          <dt className="type-eyebrow text-accent">Updated</dt>
          <dd className="type-label text-default mt-1">
            {formatUpdatedDate(page.updatedAt)}
          </dd>
        </div>
        {profile.proofPoints.map((point) => (
          <div key={point.term} className="border-default border-t pt-5">
            <dt className="type-label text-strong">{point.term}</dt>
            <dd className="type-body-sm text-muted mt-2">{point.detail}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

function RelatedLinks({ links }: { links: PageLink[] }) {
  return (
    <aside className="lg:pl-8">
      <div className="border-default border-t pt-6">
        <p className="type-eyebrow text-accent">Useful next paths</p>
        <ul className="mt-5 grid gap-5" role="list">
          {links.map((link) => (
            <li key={link.href} className="border-default border-t pt-5">
              <Link
                href={link.href}
                className={cn(TEXT_LINK_CLASS_NAME, 'type-label')}
              >
                {link.label}
              </Link>
              <p className="type-body-sm text-muted mt-2">{link.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

function PageBody({
  page,
  profile,
}: {
  page: ShopifyPage
  profile: PageProfile
}) {
  const bodyHtml = sanitizeShopifyPageBodyHtml(page.body)

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-3 lg:py-16">
      <RichText html={bodyHtml} className="max-w-prose lg:col-span-2" />
      <RelatedLinks links={profile.relatedLinks} />
    </div>
  )
}

function WholesaleSupportCta() {
  return (
    <Section.Root tone="surface" className="border-default border-t">
      <Section.Container className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-prose">
          <p className="type-eyebrow text-accent">Wholesale support</p>
          <h2 className="type-heading-03 text-strong mt-3">
            Bring Teavision into the brief
          </h2>
          <p className="type-body-sm text-muted mt-3">
            Share the product type, expected volume, certification needs, and
            timing so the team can point you to the right range.
          </p>
        </div>
        <Button href="/pages/contact" className="w-full sm:w-auto">
          Contact Teavision
        </Button>
      </Section.Container>
    </Section.Root>
  )
}

export function StaticPageContent({ page }: StaticPageContentProps) {
  const profile = resolvePageProfile(page.handle)
  const description = getStaticPageLeadDescription(page)

  return (
    <>
      <StaticPageJsonLd description={description} page={page} />

      <article>
        <PageHero description={description} page={page} profile={profile} />

        <div className="bg-canvas">
          <PageBody page={page} profile={profile} />
          <WholesaleSupportCta />
        </div>
      </article>
    </>
  )
}
