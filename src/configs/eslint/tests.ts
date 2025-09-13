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
import globals from 'globals';

import { files } from './files.js';

export const tests = {
  name: 'foundry/tests',
  files: files.tests,
  languageOptions: {
    globals: globals.node,
  },
  rules: {
    'compat/compat': 'off',
    'import-x/no-extraneous-dependencies': 'off',

    // Covered by Biome
    'jest/max-nested-describe': 'off',
    'jest/no-disabled-tests': 'off',
    'jest/no-done-callback': 'off',
    'jest/no-duplicate-hooks': 'off',
    'jest/no-export': 'off',
    'jest/no-focused-tests': 'off',
    'jest/no-standalone-expect': 'off',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/unbound-method': 'off',
  },
} satisfies Linter.Config;
