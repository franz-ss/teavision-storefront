import { Rss } from 'lucide-react'

type RssLinkProps = {
  href: string
}

export function RssLink({ href }: RssLinkProps) {
  return (
    <a
      href={href}
      className="type-label text-paper hover:text-paper focus-visible:ring-ring mt-5 inline-flex min-h-11 items-center gap-2 rounded-md px-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Rss className="size-4" aria-hidden="true" />
      RSS
    </a>
  )
}
