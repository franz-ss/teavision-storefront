import type { Metadata } from 'next'

import { Button } from '@/components/ui'
import { withNoindexRobots } from '@/lib/seo/noindex'

export const metadata: Metadata = withNoindexRobots({
  title: '404 — Page Not Found | Teavision',
  description: "The page you're looking for has moved or never existed.",
  robots: { index: false },
})

export default function NotFound() {
  return (
    <div className="bg-paper flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-hairline bg-card p-10 text-center">
        <p className="font-display text-7xl font-medium text-brand">404</p>
        <h1 className="type-heading-02 mt-4">This page doesn&rsquo;t exist</h1>
        <p className="type-body mt-2 text-ink-soft">
          The page you&rsquo;re looking for has moved or never existed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/" variant="brand">
            Go home
          </Button>
          <Button href="/collections/all" variant="secondary">
            Browse products
          </Button>
        </div>
      </div>
    </div>
  )
}
