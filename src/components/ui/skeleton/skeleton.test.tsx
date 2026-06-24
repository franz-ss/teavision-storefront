import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders the shared pulse placeholder with caller geometry', () => {
    const html = renderToStaticMarkup(
      <Skeleton className="h-8 w-40" data-testid="summary-title" />,
    )

    expect(html).toContain('bg-paper-2')
    expect(html).toContain('animate-pulse')
    expect(html).toContain('motion-reduce:animate-none')
    expect(html).toContain('rounded')
    expect(html).toContain('h-8')
    expect(html).toContain('w-40')
    expect(html).toContain('data-testid="summary-title"')
  })
})
