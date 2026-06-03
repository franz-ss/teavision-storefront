import Link from 'next/link'

import { Card, Section } from '@/components/ui'

import { WHOLESALE_PATHS } from '../_lib/wholesale-content'

export function SupplyPaths() {
  return (
    <Section.Root tone="transparent" spacing="none">
      <p className="type-eyebrow text-muted">Supply pathways</p>
      <h2 className="type-heading-02 text-strong mt-3">
        Start with the right commercial route.
      </h2>
      <ul
        className="mt-8 grid gap-4 md:grid-cols-3"
        role="list"
        aria-label="Wholesale service pathways"
      >
        {WHOLESALE_PATHS.map((path) => (
          <Card as="li" key={path.title} interactive className="h-full">
            <Link
              href={path.href}
              className="focus-visible:ring-ring block h-full p-5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <h3 className="type-heading-04 text-strong">{path.title}</h3>
              <p className="type-body-sm text-muted mt-3">{path.body}</p>
            </Link>
          </Card>
        ))}
      </ul>
    </Section.Root>
  )
}
