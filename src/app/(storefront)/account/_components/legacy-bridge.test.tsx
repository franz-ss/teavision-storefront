/**
 * @vitest-environment jsdom
 */
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'

import { LegacyBridge } from './legacy-bridge'

;(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('LegacyBridge', () => {
  it('renders the hosted sign-in explanation without classic password inputs', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)

    try {
      await act(async () => {
        root.render(
          <LegacyBridge
            body="This classic account link is no longer used by the headless storefront."
            heading="Account access has moved"
            primaryHref="/account/login/start?returnTo=%2Faccount"
          />,
        )
      })

      expect(host.textContent).toContain(
        'Shopify-hosted Customer Account sign-in',
      )
      expect(host.querySelector('input[type="password"]')).toBeNull()
      expect(
        host.querySelector(
          'a[href="/account/login/start?returnTo=%2Faccount"]',
        ),
      ).not.toBeNull()
    } finally {
      await act(async () => {
        root.unmount()
      })
      host.remove()
    }
  })
})
