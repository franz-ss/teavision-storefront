import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import { CATALOGUES } from '../_lib/data'
import { PageContent } from './page-content'

const meta: Meta<typeof PageContent> = {
  title: 'Storefront Pages/Download Catalogues/PageContent',
  component: PageContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof PageContent>

function expectDownloadCataloguesPage(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)

  expect(canvas.getByRole('heading', { name: HERO_TITLE })).toBeVisible()
  expect(
    canvas.getByRole('heading', { name: 'Download catalogues' }),
  ).toBeVisible()

  const list = canvas.getByRole('list', {
    name: 'Catalogue downloads',
  })
  expect(within(list).getAllByRole('listitem')).toHaveLength(CATALOGUES.length)

  for (const catalogue of CATALOGUES) {
    expect(
      canvas.getByRole('link', {
        name: `Download ${catalogue.title}`,
      }),
    ).toHaveAttribute('href', catalogue.href)
  }

  expect(
    canvas.queryByRole('link', { name: 'Download Catalogue' }),
  ).not.toBeInTheDocument()
}

const HERO_TITLE = 'Explore & Download Our Catalogues'

export const Default: Story = {
  play: ({ canvasElement }) => {
    expectDownloadCataloguesPage(canvasElement)
  },
}

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  play: ({ canvasElement }) => {
    expectDownloadCataloguesPage(canvasElement)

    const catalogueSection = canvasElement.querySelector(
      '[data-catalogues-section]',
    )
    if (!catalogueSection?.className.includes('max-w-wide')) {
      throw new Error(
        'Catalogue section should align to the wide page max width',
      )
    }
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: ({ canvasElement }) => {
    expectDownloadCataloguesPage(canvasElement)

    if (canvasElement.scrollWidth > canvasElement.clientWidth) {
      throw new Error('Download catalogues page overflows the mobile canvas')
    }
  },
}
