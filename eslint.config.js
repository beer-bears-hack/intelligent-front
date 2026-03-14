import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import unicorn from 'eslint-plugin-unicorn'
import importPlugin from 'eslint-plugin-import-x'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'public/mockServiceWorker.js', 'vite.config.ts'] },

  // Base JS
  js.configs.recommended,

  // TypeScript — type-checked
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React
  { settings: { react: { version: '19' } } },
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,

  // Unicorn
  unicorn.configs['flat/recommended'],

  // FSD via compat
  ...compat.config({
    extends: [
      '@feature-sliced/eslint-config/rules/public-api',
      '@feature-sliced/eslint-config/rules/layers-slices',
    ],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  }),

  {
    files: ['src/widgets/layout/**/*.{ts,tsx}'],
    rules: {
      'boundaries/element-types': 'off',
    },
  },

  {
    files: ['src/app/router/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  {
    files: [
      'src/entities/**/*.{ts,tsx}',
      'src/features/**/*.{ts,tsx}',
      'src/widgets/**/*.{ts,tsx}',
      'src/shared/mocks/**/*.{ts,tsx}',
    ],
    rules: {
      'import/no-internal-modules': 'off',
    },
  },

  // Main rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'import-x': importPlugin,
    },
    settings: {
      react: { version: '19' },
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/no-keyword-prefix': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-empty-file': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'arrow-body-style': ['error', 'as-needed'],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: '@app/**', group: 'internal', position: 'before' },
            { pattern: '@pages/**', group: 'internal', position: 'before' },
            { pattern: '@widgets/**', group: 'internal', position: 'before' },
            { pattern: '@features/**', group: 'internal', position: 'before' },
            { pattern: '@entities/**', group: 'internal', position: 'before' },
            { pattern: '@shared/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@entities/*/*/**', '!@entities/*/index'],
              message: 'Import from public API: @entities/entity-name',
            },
            {
              group: ['@features/*/*/**', '!@features/*/index'],
              message: 'Import from public API: @features/feature-name',
            },
            {
              group: ['@widgets/*/*/**', '!@widgets/*/index'],
              message: 'Import from public API: @widgets/widget-name',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
)
