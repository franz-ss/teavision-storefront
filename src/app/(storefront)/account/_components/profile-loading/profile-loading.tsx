import { Card } from '@/components/ui'

export function ProfileLoading() {
  return (
    <Card
      padding="lg"
      radius="lg"
      tone="surface"
      className="mx-auto w-full max-w-3xl"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading profile</span>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="bg-paper-2 h-12 w-40 animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 h-4 w-full max-w-lg animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 h-4 w-72 max-w-full animate-pulse rounded motion-reduce:animate-none" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <div className="bg-paper-2 h-3 w-20 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-12 animate-pulse rounded-sm motion-reduce:animate-none" />
          </div>
          <div className="grid gap-2">
            <div className="bg-paper-2 h-3 w-20 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-paper-2 h-12 animate-pulse rounded-sm motion-reduce:animate-none" />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="bg-paper-2 h-3 w-14 animate-pulse rounded motion-reduce:animate-none" />
          <div className="bg-paper-2 h-12 animate-pulse rounded-sm motion-reduce:animate-none" />
          <div className="bg-paper-2 h-4 w-60 max-w-full animate-pulse rounded motion-reduce:animate-none" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <div className="bg-paper-2 h-11 w-full animate-pulse rounded-full motion-reduce:animate-none sm:w-36" />
          <div className="bg-paper-2 h-11 w-full animate-pulse rounded-full motion-reduce:animate-none sm:w-32" />
        </div>
      </div>
    </Card>
  )
}
