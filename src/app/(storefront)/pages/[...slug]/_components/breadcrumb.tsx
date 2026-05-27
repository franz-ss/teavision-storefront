import Link from 'next/link'

import { cn } from '@/lib/utils'

const TEXT_LINK_CLASS_NAME =
  'text-link hover:text-link-hover focus-visible:ring-ring rounded underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

export function Breadcrumb({ title }: { title: string }) {
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
