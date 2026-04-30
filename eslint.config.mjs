// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'
import importPlugin from 'eslint-plugin-import'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Git worktrees
    '.worktrees/**',
  ]),
  ...storybook.configs['flat/recommended'],

  // Import ordering — all files
  {
    plugins: { import: importPlugin },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
        },
      ],
    },
  },

  // No default exports — components and lib files only
  {
    files: ['components/**/*.tsx', 'lib/**/*.ts'],
    rules: {
      'import/no-default-export': 'error',
    },
  },

  // Allow default exports where Next.js or Storybook requires them
  {
    files: [
      'app/**/page.tsx',
      'app/**/layout.tsx',
      'app/**/error.tsx',
      'app/**/not-found.tsx',
      'app/**/loading.tsx',
      'app/**/route.ts',
      'app/**/robots.ts',
      'app/**/sitemap.ts',
      '**/*.stories.tsx',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Explicit react-hooks exhaustive-deps (already set by eslint-config-next but made explicit)
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])

export default eslintConfig
