import Link from 'next/link'

import { cn } from '@/lib/utils'

import type { FooterLink as FooterLinkData } from '../types'

// Design .ft__links a: natural line-height (~20px rows), font-size 0.95rem
// Removed min-h-11 (44px) which was inflating each row to 2× design height
const FOOTER_LINK_CLASS =
  'inline-flex items-center text-[0.95rem] text-paper/75 underline-offset-2 transition-colors hover:text-paper focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none'

function isInternalHref(href: string) {
  return href === '/' || (href.startsWith('/') && !href.startsWith('//'))
}

export function FooterTextLink({
  href,
  label,
  title,
  className,
}: FooterLinkData & { className?: string }) {
  const classes = cn(FOOTER_LINK_CLASS, className)

  if (!isInternalHref(href)) {
    return (
      <a href={href} title={title} className={classes}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} title={title} className={classes}>
      {label}
    </Link>
  )
}
