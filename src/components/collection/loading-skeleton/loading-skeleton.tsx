import { Section } from '@/components/ui'
import { cn } from '@/lib/utils'

type LoadingSkeletonProps = {
  className?: string
  productCount?: number
  sidebarRowCount?: number
}

export function LoadingSkeleton({
  className,
  productCount = 6,
  sidebarRowCount = 5,
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading collection</span>
      <Section.Root tone="brand" spacing="none">
        <Section.Container className="grid min-h-90 w-full items-end py-12 md:min-h-107.5 md:py-16">
          <div className="max-w-3xl" aria-hidden="true">
            <div className="bg-paper/20 h-4 w-36 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper/20 mt-5 h-14 w-3/4 animate-pulse rounded motion-reduce:animate-none md:h-18" />
            <div className="mt-5 flex max-w-2xl flex-col gap-3">
              <div className="bg-paper/20 h-4 w-full animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-paper/20 h-4 w-10/12 animate-pulse rounded motion-reduce:animate-none" />
            </div>
          </div>
        </Section.Container>
      </Section.Root>
      <Section.Root tone="transparent" spacing="none" className="pt-8 md:pt-10">
        <Section.Container>
          <div
            className="mb-6 flex flex-wrap items-center justify-between gap-4"
            aria-hidden="true"
          >
            <div className="bg-paper-2 h-10 w-40 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-10 w-48 animate-pulse rounded motion-reduce:animate-none" />
          </div>
          <div className="grid gap-10 lg:grid-cols-[252px_1fr] lg:items-start">
            <div className="hidden flex-col gap-3 lg:flex" aria-hidden="true">
              {Array.from({ length: sidebarRowCount }, (_, index) => (
                <div
                  key={index}
                  className="bg-paper-2 h-9 animate-pulse rounded motion-reduce:animate-none"
                  data-skeleton="sidebar"
                />
              ))}
            </div>
            <ul
              className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4.5 sm:gap-y-5.5 lg:grid-cols-3"
              role="list"
              aria-hidden="true"
            >
              {Array.from({ length: productCount }, (_, index) => (
                <li
                  key={index}
                  className="border-hairline-2"
                  data-skeleton="product"
                >
                  <div className="bg-paper-2 aspect-3/4 animate-pulse rounded-lg motion-reduce:animate-none" />
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="bg-paper-2 h-4 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-paper-2 h-4 w-1/2 animate-pulse rounded motion-reduce:animate-none" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Section.Container>
      </Section.Root>
    </div>
  )
}
