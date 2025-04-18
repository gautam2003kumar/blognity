import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      // JS/TS best practices
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      eqeqeq: 'error',

      // React
      'react/jsx-uses-react': 'off', // not needed in React 17+
      'react/react-in-jsx-scope': 'off', // not needed in Next.js

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Prettier formatting handled by plugin
      'prettier/prettier': 'warn',
    },
  },
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
