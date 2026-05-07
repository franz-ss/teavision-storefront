import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Section } from './section'

const meta: Meta<typeof Section.Root> = {
  title: 'UI/Section',
  component: Section.Root,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Section.Root>

export const Default: Story = {
  render: () => (
    <Section.Root tone="sunken">
      <Section.Container>
        <div className="border-default bg-surface rounded border p-6">
          <p className="type-eyebrow text-muted">Section primitive</p>
          <h2 className="type-heading-03 text-strong mt-3">
            Content sits inside the shared container.
          </h2>
          <p className="type-body text-muted mt-3 max-w-2xl">
            Use this primitive for page bands that need the project&rsquo;s
            standard vertical spacing and container width.
          </p>
        </div>
      </Section.Container>
    </Section.Root>
  ),
}

export const Compact: Story = {
  render: () => (
    <Section.Root tone="surface">
      <Section.Container variant="compact">
        <p className="type-eyebrow text-muted">Compact container</p>
        <h2 className="type-heading-03 text-strong mt-3">
          Editorial sections use prose width.
        </h2>
        <p className="type-body text-muted mt-3">
          Use the compact container for blog introductions, newsletter blocks,
          and other reading-focused content.
        </p>
      </Section.Container>
    </Section.Root>
  ),
}

export const Inverse: Story = {
  render: () => (
    <Section.Root tone="inverse">
      <Section.Container variant="compact">
        <p className="type-eyebrow">Tone controls contrast</p>
        <h2 className="type-heading-03 mt-3">
          Dark section text inherits the right foreground.
        </h2>
        <p className="type-body mt-3">
          Use tone variants for background and default text contrast instead of
          pairing custom background and foreground utilities at each call site.
        </p>
      </Section.Container>
    </Section.Root>
  ),
}
