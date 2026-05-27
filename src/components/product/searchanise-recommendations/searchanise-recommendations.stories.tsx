import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SearchaniseRecommendations } from './searchanise-recommendations'

const STORY_WIDGET_ID = 'storybook-searchanise-recommendations'
const STORY_TITLE = 'Customers Who Bought This Product Also Bought'

const recommendationProducts = [
  {
    id: '1',
    handle: 'chamomile-organic',
    title: 'Organic Chamomile Premium',
    image:
      'https://www.teavision.com.au/cdn/shop/files/OrganicChamomilePremium_400x.jpg?v=1727323419',
    price: '$14.27',
    status: 'In stock',
    statusClassName: 'snize-in-stock',
  },
  {
    id: '2',
    handle: 'organic-ginger-root',
    title: 'Organic Ginger Root Cut',
    image:
      'https://www.teavision.com.au/cdn/shop/files/OrganicGingerCut_800x.jpg?v=1747196133',
    price: '$9.07',
    status: 'Pre-order',
    statusClassName: 'snize-pre-order',
  },
  {
    id: '3',
    handle: 'red-rose-petals',
    title: 'Premium Rose Petals',
    image:
      'https://www.teavision.com.au/cdn/shop/products/rosepetalsteavision_800x.jpg?v=1616450282',
    price: '$16.17',
    status: 'Out of stock',
    statusClassName: 'snize-out-of-stock',
  },
  {
    id: '4',
    handle: 'organic-lemongrass',
    title: 'Organic Lemongrass',
    image:
      'https://www.teavision.com.au/cdn/shop/files/OrganicLemongrassOLGNG050624_800x.jpg?v=1732666756',
    price: '$7.72',
    status: 'In stock',
    statusClassName: 'snize-in-stock',
  },
]

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return character
    }
  })
}

function getSearchaniseMarkup(): string {
  return `
    <div class="snize-recommendation snize-mobile-design">
      <h3 class="snize-recommendation-title">
        ${STORY_TITLE}
      </h3>
      <div class="snize-recommendation-results">
        <div class="viewport">
          <ul class="overview">
            ${recommendationProducts
              .map(
                (product) => `
                  <li
                    class="snize-product item snize-product-in-stock"
                    data-original-product-id="${escapeHtml(product.id)}"
                  >
                    <a
                      aria-label="View ${escapeHtml(product.title)}"
                      class="snize-view-link"
                      data-no-instant="true"
                      draggable="false"
                      href="/products/${escapeHtml(product.handle)}"
                    ></a>
                    <div class="snize-item clearfix snize-stock-status-showed">
                      <div class="snize-thumbnail-wrapper">
                        <span class="snize-thumbnail">
                          <img
                            class="snize-item-image"
                            src="${escapeHtml(product.image)}"
                            alt="${escapeHtml(product.title)}"
                            loading="lazy"
                            width="400"
                            height="400"
                          />
                        </span>
                      </div>
                      <span class="snize-overhidden">
                        <span class="snize-title">${escapeHtml(
                          product.title,
                        )}</span>
                        <div class="snize-price-list">
                          <span class="snize-price-from-text">From </span>
                          <span class="snize-price money">${escapeHtml(
                            product.price,
                          )}</span>
                        </div>
                        <span class="${escapeHtml(product.statusClassName)}">
                          ${escapeHtml(product.status)}
                        </span>
                      </span>
                    </div>
                  </li>
                `,
              )
              .join('')}
          </ul>
        </div>
      </div>
    </div>
  `
}

function getEmptySearchaniseMarkup(): string {
  return `
    <div class="snize-recommendation snize-mobile-design">
      <h3 class="snize-recommendation-title">
        ${STORY_TITLE}
      </h3>
      <div class="snize-recommendation-results">
        <div class="viewport">
          <ul class="overview"></ul>
        </div>
      </div>
    </div>
  `
}

type SearchaniseFixtureProps = {
  fallbackDelayMs?: number
  result?: 'empty' | 'products'
  withTitle?: boolean
}

function SearchaniseFixture({
  fallbackDelayMs = 5000,
  result = 'products',
  withTitle = false,
}: SearchaniseFixtureProps) {
  useEffect(() => {
    const widget = document.getElementById(STORY_WIDGET_ID)
    if (!widget) return

    const timer = window.setTimeout(() => {
      const markup =
        result === 'products'
          ? getSearchaniseMarkup()
          : getEmptySearchaniseMarkup()

      widget.innerHTML = markup
    }, 0)

    return () => {
      window.clearTimeout(timer)
      widget.innerHTML = ''
    }
  }, [result])

  return (
    <SearchaniseRecommendations
      fallbackDelayMs={fallbackDelayMs}
      headingClassName="mb-6 text-xl font-semibold"
      sectionClassName="border-default border-t pt-10"
      title={withTitle ? STORY_TITLE : undefined}
      titleId={withTitle ? 'storybook-customers-also-bought-title' : undefined}
      widgetId={STORY_WIDGET_ID}
    />
  )
}

const meta: Meta<typeof SearchaniseRecommendations> = {
  title: 'Product/SearchaniseRecommendations',
  component: SearchaniseRecommendations,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof SearchaniseRecommendations>

export const Default: Story = {
  args: {
    fallback: (
      <div className="border-default bg-surface text-default rounded-lg border p-6">
        Native recommendation carousel fallback
      </div>
    ),
    fallbackDelayMs: 0,
    widgetId: '1T8K1Y6Q6G8R3B3',
  },
}

export const NativeCardsFromSearchaniseMarkup: Story = {
  render: () => <SearchaniseFixture withTitle />,
}

export const EmptySearchaniseMarkup: Story = {
  render: () => (
    <SearchaniseFixture fallbackDelayMs={0} result="empty" withTitle />
  ),
}
