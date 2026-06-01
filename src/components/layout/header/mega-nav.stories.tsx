import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { MegaNav, MobileMegaNav } from './mega-nav'
import { SHOP_SECTIONS, type ShopKey } from './mega-nav-data'
import { MobileServicesPanel } from './mobile-services-panel'
import { MobileShopPanel } from './mobile-shop-panel'
import { ServicesMegaPanel } from './services-mega-panel'
import { ShopMegaPanel } from './shop-mega-panel'

const activeShop = SHOP_SECTIONS[2] ?? SHOP_SECTIONS[0]!

function ignoreShopKey(key: ShopKey) {
  void key
}

function noop() {}

function StoryPanelFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-136">
      <div className="relative h-0">{children}</div>
    </div>
  )
}

const meta: Meta<typeof MegaNav> = {
  title: 'Layout/Header/Mega Nav',
  component: MegaNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-surface p-8">
        <div className="mx-auto max-w-7xl">
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof MegaNav>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const shopButton = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-controls="shop-mega"]',
    )
    if (!shopButton) throw new Error('Shop disclosure button not found')

    shopButton.click()
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    const shopPanel = canvasElement.querySelector<HTMLElement>('#shop-mega')
    if (!shopPanel || shopPanel.hidden) {
      throw new Error('Shop mega panel did not open')
    }

    shopButton.click()
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    if (
      !shopPanel.hidden ||
      shopButton.getAttribute('aria-expanded') !== 'false'
    ) {
      throw new Error('Shop mega panel did not close on second click')
    }

    shopButton.click()
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    const servicesButton = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-controls="services-menu"]',
    )
    if (!servicesButton) throw new Error('Services disclosure button not found')

    servicesButton.click()
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    const servicesPanel =
      canvasElement.querySelector<HTMLElement>('#services-menu')
    if (!servicesPanel || servicesPanel.hidden) {
      throw new Error('Services mega panel did not open')
    }

    if (!shopPanel.hidden) {
      throw new Error('Opening services did not close the shop mega panel')
    }

    document.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
    )
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    if (!servicesPanel.hidden) {
      throw new Error('Services mega panel did not close on Escape')
    }
  },
}

export const Mobile: StoryObj<typeof MobileMegaNav> = {
  render: () => <MobileMegaNav />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const shopButton = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-shop-mega"]',
    )
    if (!shopButton) throw new Error('Mobile shop disclosure button not found')

    shopButton.click()
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    const shopPanel =
      canvasElement.querySelector<HTMLElement>('#mobile-shop-mega')
    if (!shopPanel || shopPanel.hidden) {
      throw new Error('Mobile shop panel did not open')
    }

    const shopCategoryButtons = shopPanel.querySelectorAll('button')
    shopCategoryButtons[2]?.click()
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    const herbsPanel = canvasElement.querySelector<HTMLElement>(
      '#mobile-shop-panel-herbs-spices',
    )
    if (!herbsPanel) {
      throw new Error('Mobile shop category change did not update the panel')
    }

    const servicesButton = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-services-mega"]',
    )
    if (!servicesButton) {
      throw new Error('Mobile services disclosure button not found')
    }

    servicesButton.click()
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    const servicesPanel = canvasElement.querySelector<HTMLElement>(
      '#mobile-services-mega',
    )
    if (!servicesPanel || servicesPanel.hidden) {
      throw new Error('Mobile services panel did not open')
    }

    if (!shopPanel.hidden) {
      throw new Error('Opening mobile services did not close shop panel')
    }
  },
}

export const DesktopShopOpen: Story = {
  render: () => (
    <StoryPanelFrame>
      <ShopMegaPanel
        activeShop={activeShop}
        onActiveShopChange={ignoreShopKey}
        onClose={noop}
        open
      />
    </StoryPanelFrame>
  ),
}

export const DesktopServicesOpen: Story = {
  render: () => (
    <StoryPanelFrame>
      <ServicesMegaPanel onClose={noop} open />
    </StoryPanelFrame>
  ),
}

export const MobileShopOpen: Story = {
  render: () => (
    <MobileShopPanel
      activeShop={activeShop}
      onActiveShopChange={ignoreShopKey}
      onClose={noop}
      open
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const MobileServicesOpen: Story = {
  render: () => <MobileServicesPanel onClose={noop} open />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
