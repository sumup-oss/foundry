/**
 * Copyright 2019, SumUp Ltd.
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

import { mergeWith, isArray, isObject, uniq } from 'lodash/fp';
import readPkgUp from 'read-pkg-up';

import { ESLintConfig } from '../../types/shared';

import { NODE_FILES } from './constants';
import { getPlugins } from './plugins';

export const customizeConfig = mergeWith(customizer);

function isArrayTypeGuard(array: unknown): array is unknown[] {
  return isArray(array);
}

function customizer(
  objValue: unknown,
  srcValue: unknown,
  key: string,
): unknown {
  if (isArrayTypeGuard(objValue) && isArrayTypeGuard(srcValue)) {
    return uniq([...objValue, ...srcValue]);
  }
  if (isObject(objValue) && isObject(srcValue)) {
    return key === 'rules' ? { ...objValue, ...srcValue } : undefined;
  }
  return undefined;
}

const base = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'import'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      modules: true,
      impliedStrict: true,
    },
    allowImportExportEverywhere: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'curly': ['error', 'all'],
    'no-use-before-define': 'off',
    'no-confusing-arrow': 'off',
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern:
          '^(?:import\\s|export\\s|\\s*it(?:\\.(?:skip|only))?\\()',
      },
    ],
    'no-underscore-dangle': 'error',
    'import/prefer-default-export': 'off',
    'import/order': ['error', { 'newlines-between': 'always' }],
    'import/extensions': 'off',
    // The rules below are already covered by prettier.
    'quote-props': 'off',
    'comma-dangle': 'off',
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'operator-linebreak': 'off',
    'indent': 'off',
    'no-void': ['error', { allowAsStatement: true }],
  },
  overrides: [
    {
      files: ['**/*.json'],
      extends: ['plugin:json/recommended'],
      rules: {
        'notice/notice': 'off',
      },
    },
    {
      files: NODE_FILES,
      rules: {
        'no-console': 'off',
      },
    },
  ],
};

export function createConfig(overrides: ESLintConfig = {}): ESLintConfig {
  const pkg = readPkgUp.sync();

  if (!pkg) {
    throw new Error('Unable to find a "package.json" file.');
  }

  const plugins = getPlugins(pkg.packageJson);

  const config = plugins.reduce((acc, plugin) => {
    return customizeConfig(acc, plugin.config);
  }, base);

  return customizeConfig(config, overrides);
}
