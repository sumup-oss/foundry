/**
 * Copyright 2025, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Linter } from 'eslint';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export const react = {
  name: 'foundry/react',
  // TODO:
  // files: [],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      jsxPragma: null,
    },
    globals: globals.browser,
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: { react: reactPlugin },
  rules: {
    /**
     * React
     */
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs['jsx-runtime'].rules,

    // while display names are useful in component stack traces,
    // they increase the bundle size and can hinder tree-shaking
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
    'react/display-name': 'off',

    // prop types are deprecated in React 19+ and should be replaced by TypeScript types
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    'react/prop-types': 'off',

    // Covered by Biome
    'react/button-has-type': 'off',
    'react/forbid-elements': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-child-element-spacing': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-equals-spacing': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-fragments': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-key': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-newline': 'off',
    'react/jsx-no-comment-textnodes': 'off',
    'react/jsx-no-duplicate-props': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-multi-spaces': 'off',
    'react/jsx-space-before-closing': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/no-array-index-key': 'off',
    'react/no-children-prop': 'off',
    'react/no-danger-with-children': 'off',
    'react/no-danger': 'off',
    'react/void-dom-elements-no-children': 'off',
  },
} satisfies Linter.Config;
