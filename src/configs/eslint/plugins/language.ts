/**
 * Copyright 2023, SumUp Ltd.
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

import process from 'process';

import type { Dependencies, GetPluginConfig } from '../../../types/shared';
import { hasDependency } from '../../../lib/package-json';

const sharedOverrides = [
  {
    files: ['**/*.{story,stories}.*'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'no-alert': 'off',
    },
  },
  {
    files: ['**/*spec.*', '**/jest*', '**/setupTests.*', '**/test-utils.*'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
];

export const getPluginConfig: GetPluginConfig = (packageJson) => {
  if (hasDependency(packageJson, 'typescript')) {
    return {
      devDependencies: {
        '@typescript-eslint/eslint-plugin': '^5.49.0',
        '@typescript-eslint/parser': '^5.49.0',
      },
      config: {
        overrides: [
          {
            files: ['**/*.{ts,tsx}'],
            extends: [
              'plugin:@typescript-eslint/eslint-recommended',
              'plugin:@typescript-eslint/recommended',
              'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
            plugins: ['@typescript-eslint'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
              tsconfigRootDir: process.cwd(),
              project: ['./tsconfig.json'],
              extraFileExtensions: ['.json'],
              sourceType: 'module',
              ecmaVersion: 6,
              ecmaFeatures: {
                modules: true,
              },
            },
            rules: {
              '@typescript-eslint/explicit-function-return-type': 'off',
              '@typescript-eslint/indent': 'off',
              '@typescript-eslint/no-unused-vars': 'error',
              '@typescript-eslint/no-misused-promises': [
                'error',
                { checksVoidReturn: false },
              ],
              '@typescript-eslint/no-use-before-define': [
                'error',
                { functions: false },
              ],
              'react/prop-types': 'off',
            },
          },
          {
            files: ['**/*.d.ts'],
            rules: {
              'spaced-comment': 'off',
              'node/no-extraneous-import': 'off',
              'import/no-extraneous-dependencies': [
                'error',
                { devDependencies: true },
              ],
            },
          },
          {
            files: ['**/*.{story,stories}.{ts,tsx}'],
            rules: {
              '@typescript-eslint/explicit-module-boundary-types': 'off',
            },
          },
          {
            files: [
              '**/*spec.{ts,tsx}',
              '**/setupTests.{ts,tsx}',
              '**/test-utils.{ts,tsx}',
            ],
            rules: {
              '@typescript-eslint/no-explicit-any': 'off',
              '@typescript-eslint/no-var-requires': 'off',
              '@typescript-eslint/no-unsafe-assignment': 'off',
              '@typescript-eslint/unbound-method': 'off',
            },
          },
          ...sharedOverrides,
        ],
      },
    };
  }

  return {
    devDependencies: {} as Dependencies,
    config: {
      overrides: sharedOverrides,
    },
  };
};
