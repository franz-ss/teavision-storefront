import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Accordion, type AccordionItem } from './accordion'

const items = [
  {
    id: 'sourcing',
    title: 'Can Teavision source custom tea ingredients?',
    content: (
      <p>
        Yes. The team can source tea, herbs, botanicals, flavours, and packaging
        formats for wholesale and private-label ranges.
      </p>
    ),
  },
  {
    id: 'samples',
    title: 'How long do custom samples usually take?',
    content: (
      <p>
        Most R&amp;D samples are prepared in one to three weeks once the brief,
        flavour direction, and format are clear.
      </p>
    ),
    defaultOpen: true,
  },
  {
    id: 'formats',
    title: 'Which formats are supported?',
    content: (
      <p>
        Loose leaf, pyramid tea bags, retail cartons, foodservice packs, and
        instant powders can all be discussed.
      </p>
    ),
  },
] satisfies AccordionItem[]

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  args: {
    items,
    className: 'max-w-prose',
  },
}
