import Link from 'next/link'

import { cn } from '@/lib/utils'

import type { FooterLink as FooterLinkData } from '../types'

const FOOTER_LINK_CLASS =
  'inline-flex min-h-11 items-center underline-offset-2 transition-colors hover:underline focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

export const MENU_LINK_CLASS =
  'text-on-brand focus-visible:ring-offset-footer text-base leading-[1.4]'

export const BOTTOM_LINK_CLASS =
  'text-footer-bottom focus-visible:ring-offset-footer-bottom'

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
