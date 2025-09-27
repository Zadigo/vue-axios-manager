// import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
// import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig(
  [
    tseslint.configs.recommended,
    // eslintPluginVue.configs.recommended,
    globalIgnores(
      [
        '**/.vitepress/*',
        '.rollup.cache/*',
        'dist',
        'node_modules',
        'coverage'
      ]
    ),
    {
      extends: [
        stylistic.configs.recommended
      ],
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.browser,
          ...globals.es2021
        }
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'error',

        '@stylistic/no-trailing-spaces': ['warn'],
        '@stylistic/comma-dangle': ['warn', 'never'],
        '@stylistic/brace-style': ['error', '1tbs'],
        '@stylistic/no-confusing-arrow': ['warn'],
        '@stylistic/switch-colon-spacing': [
          'error', { after: true, before: false }
        ]
      }
    }
  ]
)
