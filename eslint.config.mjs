import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends(
    'eslint:recommended',
    'next/core-web-vitals',
    'next',
    'plugin:prettier/recommended' // adds Prettier rules
  ),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // your custom TS/React rules here
    },
  },
  {
    rules: {
      '@next/next/no-img-element': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]
