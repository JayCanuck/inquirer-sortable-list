import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { config, configs } from 'typescript-eslint';

export default config(
  { ignores: ['dist/**/*'] },
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  // JavaScript files: Apply import and Prettier recommended rules
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 'latest'
      }
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        },
        node: true
      }
    },
    rules: {
      'import/no-unresolved': ['error', { caseSensitive: true }],
      'import/named': 'error',
      'import/first': 'warn',
      'import/no-duplicates': 'error',
      'import/extensions': ['warn', 'always', { js: 'never', ts: 'never', json: 'always' }],
      'import/newline-after-import': 'warn',
      'import/order': [
        'warn',
        {
          'newlines-between': 'never',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          named: true,
          alphabetize: {
            order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
            caseInsensitive: true /* ignore case. Options: [true, false] */
          }
        }
      ]
    }
  },
  // TypeScript files: Extend JavaScript rules with TypeScript-specific rules
  {
    extends: [...configs.recommended, importPlugin.flatConfigs.typescript],
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts']
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        },
        node: true
      }
    }
  }
);
