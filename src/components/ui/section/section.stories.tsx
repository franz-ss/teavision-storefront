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
      options: ['surface', 'sunken', 'brand', 'inverse', 'transparent'],
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

export const WithEyebrow: Story = {
  render: () => (
    <Section.Root tone="surface" spacing="compact">
      <Section.Container>
        <Section.Intro
          eyebrow="Premium Wholesale"
          title="Section.Intro with Eyebrow"
          copy="The eyebrow appears above the heading using the Eyebrow signature component."
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

export const BaseContainer: Story = {
  render: () => (
    <Section.Root tone="sunken" spacing="compact">
      <Section.Container variant="base">
        <Section.Intro
          align="left"
          title="Section.Container (base)"
          copy="1280px base container for FAQ and editorial content."
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
      <Section.Root spacing="compact" tone="inverse">
        <Section.Container>
          <Section.Intro title="Inverse" />
        </Section.Container>
      </Section.Root>
    </>
  ),
}
