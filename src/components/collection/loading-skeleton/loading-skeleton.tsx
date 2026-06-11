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
      <Section.Root tone="transparent" spacing="none">
        <Section.Container className="pt-6">
          <div className="overflow-hidden" aria-hidden="true">
            <div
              className="bg-paper-2 aspect-16/7 w-full animate-pulse motion-reduce:animate-none"
              data-skeleton="hero"
            />
          </div>
        </Section.Container>
      </Section.Root>
      <Section.Root tone="transparent" spacing="none">
        <Section.Container>
          <div
            className="flex flex-wrap items-center gap-2 pt-5.5"
            aria-hidden="true"
          >
            <div className="bg-paper-2 h-3 w-10 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-3 w-1.5 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-3 w-20 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-3 w-1.5 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-3 w-72 max-w-full animate-pulse rounded motion-reduce:animate-none" />
          </div>
        </Section.Container>
      </Section.Root>
      <Section.Root tone="transparent" spacing="compact">
        <Section.Container>
          <div
            className="bg-paper border-hairline h-14 animate-pulse rounded-lg border motion-reduce:animate-none"
            aria-hidden="true"
            data-skeleton="story-disclosure"
          />
        </Section.Container>
      </Section.Root>
      <Section.Root tone="transparent" className="pt-8 md:pt-10">
        <Section.Container>
          <div className="mb-6" aria-hidden="true">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="bg-paper-2 h-3 w-24 animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-paper-2 h-10 w-42 animate-pulse rounded motion-reduce:animate-none" />
            </div>

            <div className="bg-paper border-hairline mt-2 h-12 animate-pulse rounded-lg border motion-reduce:animate-none lg:hidden" />
          </div>
          <div className="grid gap-10 lg:grid-cols-[252px_1fr] lg:items-start">
            <div className="hidden gap-5 lg:grid" aria-hidden="true">
              <div className="bg-brand-tint border-brand/20 rounded-lg border p-5.5">
                <div className="bg-paper/70 h-6 w-36 animate-pulse rounded motion-reduce:animate-none" />
                <div className="mt-3 grid gap-2">
                  <div className="bg-paper/70 h-3 w-full animate-pulse rounded motion-reduce:animate-none" />
                  <div className="bg-paper/70 h-3 w-11/12 animate-pulse rounded motion-reduce:animate-none" />
                  <div className="bg-paper/70 h-3 w-4/5 animate-pulse rounded motion-reduce:animate-none" />
                </div>
                <div className="bg-brand/20 mt-4 h-10 w-full animate-pulse rounded-full motion-reduce:animate-none" />
              </div>
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
                  <div className="bg-paper-2 aspect-25/28 animate-pulse rounded-lg motion-reduce:animate-none" />
                  <div className="pt-4">
                    <div className="bg-paper-2 mb-1 h-3 w-18 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-paper-2 my-1.5 h-6 w-4/5 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-paper-2 mt-1.5 h-4 w-20 animate-pulse rounded motion-reduce:animate-none" />
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
