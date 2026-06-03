import type { Metadata } from 'next'

import { Button, Card } from '@/components/ui'
import { withNoindexRobots } from '@/lib/seo/noindex'

export const metadata: Metadata = withNoindexRobots({
  title: '404 — Page Not Found | Teavision',
  description: "The page you're looking for has moved or never existed.",
  robots: { index: false },
})

export default function NotFound() {
  return (
    <div className="bg-canvas flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-10 text-center" radius="md">
        <p className="text-brand text-7xl font-semibold">404</p>
        <h1 className="text-default mt-4 text-2xl font-semibold">
          This page doesn&rsquo;t exist
        </h1>
        <p className="text-muted mt-2 text-base">
          The page you&rsquo;re looking for has moved or never existed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/">
            Go home
          </Button>
          <Button href="/collections/all" variant="secondary">
            Browse products
          </Button>
        </div>
      </Card>
    </div>
  )
}
