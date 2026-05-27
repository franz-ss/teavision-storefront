import { Card } from '@/components/ui'

export function EmptyState() {
  return (
    <Card className="px-6 py-12 text-center">
      <h2 className="type-heading-03 text-strong">No articles found</h2>
      <p className="type-body-sm text-muted mx-auto mt-3 max-w-lg">
        Try a different search term or browse all Tea Journal articles.
      </p>
    </Card>
  )
}
