import {
  PortableText as ReactPortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type PortableTextContentProps = {
  value: PortableTextBlock[] | null
  className?: string
}

type PortableTextImageValue = {
  alt?: string | null
  caption?: string | null
  attribution?: string | null
  asset?: {
    url?: string | null
    metadata?: {
      dimensions?: {
        width?: number | null
        height?: number | null
      } | null
    } | null
  } | null
  image?: {
    asset?: {
      url?: string | null
      metadata?: {
        dimensions?: {
          width?: number | null
          height?: number | null
        } | null
      } | null
    } | null
  } | null
}

type PortableTextCalloutValue = {
  title?: string | null
  body?: string | null
}

type SafeLink = {
  href: string
  isExternal: boolean
  useNextLink: boolean
}

function getLinkRel(
  isExternal: boolean,
  openInNewTab?: boolean,
): string | undefined {
  if (!isExternal && !openInNewTab) return undefined

  return 'noreferrer noopener'
}

function getSafeLink(rawHref: unknown): SafeLink | null {
  if (typeof rawHref !== 'string') return null

  const href = rawHref.trim()
  if (!href || href.startsWith('//')) return null

  if (href.startsWith('/') || href.startsWith('#')) {
    return { href, isExternal: false, useNextLink: href.startsWith('/') }
  }

  try {
    const url = new URL(href)
    const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
    const isContact = url.protocol === 'mailto:' || url.protocol === 'tel:'

    if (!isHttp && !isContact) return null

    return { href, isExternal: isHttp, useNextLink: false }
  } catch {
    return null
  }
}

function getPortableTextImage(value: PortableTextImageValue) {
  const asset = value.image?.asset ?? value.asset
  const dimensions = asset?.metadata?.dimensions

  if (!asset?.url || !dimensions?.width || !dimensions.height) return null

  return {
    alt: value.alt ?? '',
    attribution: value.attribution,
    caption: value.caption,
    height: dimensions.height,
    url: asset.url,
    width: dimensions.width,
  }
}

function PortableTextImageBlock({ value }: { value: unknown }) {
  const image = value as PortableTextImageValue
  const resolvedImage = getPortableTextImage(image)

  if (!resolvedImage) return null

  return (
    <figure className="my-8">
      <Image
        src={resolvedImage.url}
        alt={resolvedImage.alt}
        width={resolvedImage.width}
        height={resolvedImage.height}
        sizes="(min-width: 1024px) 896px, 100vw"
        className="border-default h-auto w-full rounded-md border object-cover"
      />
      {(resolvedImage.caption || resolvedImage.attribution) && (
        <figcaption className="type-body-sm text-muted mt-3">
          {[resolvedImage.caption, resolvedImage.attribution]
            .filter(Boolean)
            .join(' - ')}
        </figcaption>
      )}
    </figure>
  )
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="type-heading-02 text-strong mt-10 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="type-heading-03 text-strong mt-8 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="type-heading-04 text-strong mt-7 first:mt-0">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="type-body-lg border-default bg-surface text-default my-8 rounded-md border p-5 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="type-body text-default mt-5 first:mt-0">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="type-body text-default mt-5 list-disc space-y-2 pl-6 first:mt-0">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="type-body text-default mt-5 list-decimal space-y-2 pl-6 first:mt-0">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    code: ({ children }) => (
      <code className="bg-surface-sunken text-default rounded px-1 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const link = getSafeLink(value?.href)
      if (!link) return <>{children}</>

      const openInNewTab = Boolean(value?.openInNewTab || link.isExternal)
      const target = openInNewTab ? '_blank' : undefined
      const rel = getLinkRel(link.isExternal, openInNewTab)
      const className =
        'text-link hover:text-link-hover focus-visible:ring-ring rounded underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

      if (!link.useNextLink) {
        return (
          <a href={link.href} target={target} rel={rel} className={className}>
            {children}
          </a>
        )
      }

      return (
        <Link href={link.href} target={target} rel={rel} className={className}>
          {children}
        </Link>
      )
    },
    underline: ({ children }) => (
      <span className="underline underline-offset-4">{children}</span>
    ),
  },
  types: {
    image: PortableTextImageBlock,
    imageWithAlt: PortableTextImageBlock,
    callout: ({ value }) => {
      const callout = value as PortableTextCalloutValue

      return (
        <aside className="border-default bg-surface my-8 rounded-md border p-5">
          {callout.title && (
            <p className="type-label text-strong">{callout.title}</p>
          )}
          {callout.body && (
            <p className="type-body text-default mt-3">{callout.body}</p>
          )}
        </aside>
      )
    },
  },
  unknownType: () => null,
}

export function PortableTextContent({
  value,
  className,
}: PortableTextContentProps) {
  if (!value || value.length === 0) return null

  return (
    <div className={cn('wrap-break-word', className)}>
      <ReactPortableText value={value} components={components} />
    </div>
  )
}
