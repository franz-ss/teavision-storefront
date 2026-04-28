import type { Preview } from '@storybook/nextjs-vite'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'brand',
      values: [
        { name: 'brand', value: 'var(--color-background)' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
