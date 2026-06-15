import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import { CTA, FACTORS, HERO } from '../_lib/data'
import { PageContent } from './page-content'

const meta: Meta<typeof PageContent> = {
  title: 'Storefront Pages/How Long Does Bulk Tea Last/PageContent',
  component: PageContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof PageContent>

function expectShelfLifePage(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)

  expect(canvas.getByRole('heading', { level: 1, name: HERO.title })).toBeVisible()
  expect(
    canvas.getByRole('heading', {
      name: 'Why Our Bulk Tea Order Lasts for Long Time',
    }),
  ).toBeVisible()
  expect(
    canvas.getByRole('heading', {
      name: 'Factors That Must Be Taken into Consideration',
    }),
  ).toBeVisible()
  expect(
    canvas.getByRole('heading', {
      name: 'How to Prepare for Your Bulk Tea Order',
    }),
  ).toBeVisible()

  for (const factor of FACTORS.items) {
    expect(canvas.getByText(factor.label)).toBeVisible()
    expect(canvas.getByText(factor.body)).toBeVisible()
  }

  expect(
    canvas.getByRole('link', { name: CTA.primary.label }),
  ).toHaveAttribute('href', CTA.primary.href)
  expect(
    canvas.getByRole('link', { name: CTA.secondary.label }),
  ).toHaveAttribute('href', CTA.secondary.href)
}

export const Default: Story = {
  play: ({ canvasElement }) => {
    expectShelfLifePage(canvasElement)
  },
}

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  play: ({ canvasElement }) => {
    expectShelfLifePage(canvasElement)
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: ({ canvasElement }) => {
    expectShelfLifePage(canvasElement)

    if (canvasElement.scrollWidth > canvasElement.clientWidth) {
      throw new Error('Shelf life page overflows the mobile canvas')
    }
  },
}
