import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { QuantityStepper } from './quantity-stepper'

describe('QuantityStepper', () => {
  it('hides the native browser number spinner controls', () => {
    const html = renderToStaticMarkup(
      <QuantityStepper value={1} onChange={() => undefined} />,
    )

    expect(html).toContain('[appearance:textfield]')
    expect(html).toContain('[&amp;::-webkit-inner-spin-button]:appearance-none')
    expect(html).toContain('[&amp;::-webkit-outer-spin-button]:appearance-none')
  })
})
