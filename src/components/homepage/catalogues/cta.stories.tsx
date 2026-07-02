import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CATALOGUE_CTA_FIXTURE } from '../content'
import { Cta } from './cta'

const meta: Meta<typeof Cta> = {
  title: 'Homepage/Catalogues',
  component: Cta,
  tags: ['autodocs'],
  args: CATALOGUE_CTA_FIXTURE,
}
export default meta

type Story = StoryObj<typeof Cta>

export const Default: Story = {
  args: {},
}
