import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import {
  PRIVATE_LABEL_CARDS_FIXTURE,
  PRIVATE_LABEL_INTRO_FIXTURE,
} from '../content'
import { PrivateLabel } from './private-label'

const meta: Meta<typeof PrivateLabel> = {
  title: 'Homepage/PrivateLabel',
  component: PrivateLabel,
  tags: ['autodocs'],
  args: {
    cards: PRIVATE_LABEL_CARDS_FIXTURE,
    intro: PRIVATE_LABEL_INTRO_FIXTURE,
  },
}
export default meta

type Story = StoryObj<typeof PrivateLabel>

export const Default: Story = {
  args: {},
}
