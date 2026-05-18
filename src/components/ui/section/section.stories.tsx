import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Section } from './section'

const meta: Meta<typeof Section.Root> = {
  title: 'UI/Section',
  component: Section.Root,
  tags: ['autodocs'],
  argTypes: {
    spacing: {
      control: 'select',
      options: ['default', 'compact', 'none'],
    },
    tone: {
      control: 'select',
      options: [
        'surface',
        'sunken',
        'brand',
        'brandStrong',
        'inverse',
        'transparent',
      ],
    },
  },
}
export default meta

type Story = StoryObj<typeof Section.Root>

export const Default: Story = {
  args: {
    spacing: 'default',
    tone: 'sunken',
  },
  render: (args) => (
    <Section.Root {...args}>
      <Section.Container>
        <Section.Intro
          title="Section.Root"
          copy="Applies the semantic section element, tone, and vertical spacing."
        />
      </Section.Container>
    </Section.Root>
  ),
}

export const CompactContainer: Story = {
  render: () => (
    <Section.Root tone="surface">
      <Section.Container variant="compact">
        <Section.Intro
          align="left"
          title="Section.Container"
          copy="Use the compact container when the section should keep to prose width."
        />
      </Section.Container>
    </Section.Root>
  ),
}

export const Intro: Story = {
  render: () => (
    <Section.Root spacing="compact" tone="sunken">
      <Section.Container>
        <Section.Intro
          title="Section.Intro"
          copy="Provides the shared heading and supporting copy treatment."
        />
      </Section.Container>
    </Section.Root>
  ),
}

export const Tones: Story = {
  render: () => (
    <>
      <Section.Root spacing="compact" tone="surface">
        <Section.Container>
          <Section.Intro title="Surface" />
        </Section.Container>
      </Section.Root>
      <Section.Root spacing="compact" tone="sunken">
        <Section.Container>
          <Section.Intro title="Sunken" />
        </Section.Container>
      </Section.Root>
      <Section.Root spacing="compact" tone="brand">
        <Section.Container>
          <Section.Intro title="Brand" />
        </Section.Container>
      </Section.Root>
      <Section.Root spacing="compact" tone="brandStrong">
        <Section.Container>
          <Section.Intro title="Brand Strong" />
        </Section.Container>
      </Section.Root>
      <Section.Root spacing="compact" tone="inverse">
        <Section.Container>
          <Section.Intro title="Inverse" />
        </Section.Container>
      </Section.Root>
    </>
  ),
}
