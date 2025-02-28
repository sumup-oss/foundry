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
import tseslint from 'typescript-eslint';

import { javascript } from './javascript.js';
import { toGlobPattern, TYPESCRIPT_EXTENSIONS } from './shared.js';

// TODO: Assert array length
const [base, eslintRecommended, typeChecked] =
  tseslint.configs.recommendedTypeChecked;

export const typescript = {
  ...base,
  name: 'foundry/typescript',
  files: toGlobPattern(TYPESCRIPT_EXTENSIONS),
  settings: {
    'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import-x/parsers': {
      '@typescript-eslint/parser': TYPESCRIPT_EXTENSIONS,
    },
  },
  rules: {
    ...eslintRecommended.rules,
    ...typeChecked.rules,

    //  Covered by Biome
    '@typescript-eslint/adjacent-overload-signatures': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/block-spacing': 'off',
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/comma-spacing': 'off',
    '@typescript-eslint/consistent-type-exports': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/default-param-last': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/func-call-spacing': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/key-spacing': 'off',
    '@typescript-eslint/keyword-spacing': 'off',
    '@typescript-eslint/lines-around-comment': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-array-constructor': 'off',
    '@typescript-eslint/no-dupe-class-members': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-non-null-assertion': 'off',
    '@typescript-eslint/no-extra-parens': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-loss-of-precision': 'off',
    '@typescript-eslint/no-misused-new': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-restricted-imports': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-empty-export': 'off',
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/only-throw-error': 'off',
    '@typescript-eslint/parameter-properties': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    '@typescript-eslint/prefer-enum-initializers': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/prefer-function-type': 'off',
    '@typescript-eslint/prefer-literal-enum-member': 'off',
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/space-before-blocks': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/space-infix-ops': 'off',
    '@typescript-eslint/type-annotation-spacing': 'off',

    /**
     * Custom
     */

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],

    // Replace ESLint 'no-implied-eval' and 'no-new-func' rules with '@typescript-eslint' version
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
    'no-implied-eval': 'off',
    'no-new-func': 'off',
    '@typescript-eslint/no-implied-eval': javascript.rules['no-implied-eval'],

    // Replace ESLint 'no-loop-func' rule with '@typescript-eslint' version
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
    'no-loop-func': 'off',
    '@typescript-eslint/no-loop-func': javascript.rules['no-loop-func'],

    // Replace ESLint 'no-shadow' rule with '@typescript-eslint' version
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': javascript.rules['no-shadow'],

    // Replace ESLint 'no-unused-expressions' rule with '@typescript-eslint' version
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
    //   'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions':
      javascript.rules['no-unused-expressions'],

    /**
     * Imports
     */

    // These rules are recommended to be disabled within TypeScript projects as TypeScript provides the same checks as part of standard type checking.
    // See https://github.com/typescript-eslint/typescript-eslint/blob/13583e65f5973da2a7ae8384493c5e00014db51b/docs/linting/TROUBLESHOOTING.md#eslint-plugin-import
    'import-x/named': 'off',
    'import-x/no-named-as-default-member': 'off',
    'import-x/no-unresolved': 'off',
  },
} as Linter.Config;
