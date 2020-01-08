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

import merge from 'webpack-merge';

import { Target } from '../../types/shared';

export interface EslintOptions {
  target?: Target;
}

export const overwritePresets = merge({
  customizeArray(a: any[], b: any[], key: string) {
    return key === 'extends' ? b : undefined;
  },
  customizeObject(a: object, b: object, key: string) {
    return key === 'rules' ? { ...a, ...b } : undefined;
  }
});

const base = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier', 'jest', 'cypress', 'notice'],
  rules: {
    'no-use-before-define': ['error', { functions: false }],
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true
      }
    ],
    'curly': ['error', 'all'],
    'no-underscore-dangle': [
      'error',
      { allow: ['__DEV__', '__PRODUCTION__', '__TEST__'] }
    ],
    'notice/notice': [
      'error',
      {
        template: `/**
 * Copyright <%= YEAR %>, <%= NAME %>
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

`,
        templateVars: { NAME: 'SumUp Ltd.' },
        varRegexps: { NAME: /SumUp Ltd\./ },
        onNonMatchingHeader: 'report'
      }
    ]
  },
  globals: {
    __DEV__: true,
    __PRODUCTION__: true,
    __TEST__: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      ecmaVersion: 2017,
      impliedStrict: true
    }
  },
  overrides: [
    {
      files: ['**/*spec.js', 'e2e/**/*.js'],
      rules: {
        'max-len': [
          'error',
          {
            code: 80,
            tabWidth: 2,
            ignorePattern: '^\\s*it(?:\\.(?:skip|only))?\\(',
            ignoreComments: true,
            ignoreUrls: true
          }
        ]
      },
      globals: {
        mount: true,
        shallow: true,
        render: true,
        create: true,
        axe: true,
        renderToHtml: true
      },
      env: {
        'jest/globals': true,
        'cypress/globals': true
      }
    },
    {
      files: ['*.config.js', '.*rc.js'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true
          }
        ]
      }
    }
  ]
};

export const browser = base;

// TODO: add node specific config here.
export const node = overwritePresets(base, { env: { node: true } });

export const react = overwritePresets(base, {
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier/react'
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'emotion'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'emotion/jsx-import': 'error',
    'emotion/no-vanilla': 'error',
    'emotion/import-from-emotion': 'error',
    'emotion/styled-import': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true
      }
    ]
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true
  }
});

export const ESLINT_CONFIGS = ['browser', 'node', 'react'];

const TARGETS = {
  [Target.BROWSER]: browser,
  [Target.NODE]: node,
  [Target.REACT]: react
};

export function config(options: EslintOptions = {}, overrides: any = {}) {
  const { target = Target.BROWSER } = options;
  const baseConfig = TARGETS[target];
  return overwritePresets(baseConfig, overrides);
}
