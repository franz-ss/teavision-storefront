import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { PageContent } from './page-content'

const meta: Meta<typeof PageContent> = {
  title: 'Storefront Pages/Our Story/PageContent',
  component: PageContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof PageContent>

function expectPageContent(canvasElement: HTMLElement) {
  const text = canvasElement.textContent ?? ''
  const requiredCopy = [
    'Our Tea Story',
    'Global Leader',
    'Core Values',
    'Our Team',
    'Corporate Social',
    'Awards & Certifications',
  ]

  for (const copy of requiredCopy) {
    if (!text.includes(copy)) {
      throw new Error(`Expected Our Story copy not found: ${copy}`)
    }
  }

  const teamAnchor = canvasElement.querySelector('a[href="#our-team"]')
  if (!teamAnchor) {
    throw new Error('Expected hero CTA anchor to target #our-team')
  }

  const requiredLinks = [
    { href: '/collections', label: 'Browse Products' },
    {
      href: '/pages/tea-importers-australia',
      label: 'Get Wholesale Pricing',
    },
    { href: 'tel:1300729617', label: '1300 729 617' },
    { href: 'mailto:info@teavision.com.au', label: 'info@teavision.com.au' },
  ]

  for (const requiredLink of requiredLinks) {
    const link = canvasElement.querySelector(`a[href="${requiredLink.href}"]`)

    if (!link?.textContent?.includes(requiredLink.label)) {
      throw new Error(`Expected Our Story link not found: ${requiredLink.href}`)
    }
  }

  const images = canvasElement.querySelectorAll('img')
  if (images.length < 10) {
    throw new Error(
      `Expected Our Story images to render, found ${images.length}`,
    )
  }
}

export const Default: Story = {
  play: ({ canvasElement }) => {
    expectPageContent(canvasElement)
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: ({ canvasElement }) => {
    expectPageContent(canvasElement)

    if (canvasElement.scrollWidth > canvasElement.clientWidth) {
      throw new Error('Our Story content overflows the mobile canvas')
    }
  },
}
