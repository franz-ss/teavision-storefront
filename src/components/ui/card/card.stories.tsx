import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Card } from './card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'article', 'aside', 'li', 'a'],
    },
    interactive: { control: 'boolean' },
    overflow: {
      control: 'select',
      options: ['visible', 'hidden'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['md', 'lg'],
    },
    tone: {
      control: 'select',
      options: ['surface', 'sunken'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: (
      <>
        <p className="type-heading-05 text-strong">Card shell</p>
        <p className="type-body-sm text-muted mt-3">
          A flat bordered surface for reusable content panels.
        </p>
      </>
    ),
    padding: 'md',
  },
}

export const Compact: Story = {
  args: {
    children: <p className="type-label text-strong">Compact card</p>,
    padding: 'sm',
    radius: 'md',
  },
}

export const Sunken: Story = {
  args: {
    children: (
      <>
        <p className="type-eyebrow text-accent">Certification</p>
        <p className="type-heading-05 text-strong mt-3">Organic range</p>
      </>
    ),
    padding: 'md',
    radius: 'md',
    tone: 'sunken',
  },
}

export const Media: Story = {
  render: () => (
    <Card overflow="hidden" className="max-w-sm">
      <div className="bg-surface-sunken aspect-4/3" />
      <div className="p-5">
        <p className="type-heading-05 text-strong">Media card</p>
        <p className="type-body-sm text-muted mt-3">
          Media and body layout stay with the consuming component.
        </p>
      </div>
    </Card>
  ),
}

export const InteractiveLink: Story = {
  args: {
    as: 'a',
    children: (
      <>
        <span className="type-eyebrow text-muted">Wholesale</span>
        <span className="type-heading-05 text-strong mt-2 block">
          Custom blending
        </span>
      </>
    ),
    href: '#',
    interactive: true,
    padding: 'md',
  },
}
