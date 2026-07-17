import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test, vi } from 'vitest'

import { NpdOrderForm } from './npd-order-form'

vi.mock('@/lib/contact/actions', () => ({
  sendNpdOrderAction: vi.fn(),
}))

vi.mock('@/lib/analytics/client', () => ({
  dispatchClientAnalyticsEvent: vi.fn(),
}))

describe('NpdOrderForm', () => {
  test('requires a clearly described dd/mm/yyyy date', () => {
    const html = renderToStaticMarkup(<NpdOrderForm />)

    expect(html).toContain('name="date"')
    expect(html).toContain('type="text"')
    expect(html).toContain('inputMode="numeric"')
    expect(html).toContain('placeholder="dd/mm/yyyy"')
    expect(html).toContain('pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"')
    expect(html).toContain('aria-describedby="npd-date-hint"')
    expect(html).toContain('Use dd/mm/yyyy, for example 01/07/2026.')
  })
})
