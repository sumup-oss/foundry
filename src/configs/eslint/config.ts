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

import { flow, mergeWith, isArray, isObject, uniq } from 'lodash/fp';

import { Target, Options } from '../../types/shared';

type EslintOptions = Pick<Options, 'target'>;
type EslintConfig = any;

function customizer(objValue: any, srcValue: any, key: string) {
  if (isArray(objValue)) {
    return uniq([...objValue, ...srcValue]);
  }
  if (isObject(objValue)) {
    return key === 'rules' ? { ...objValue, ...srcValue } : undefined;
  }
  return undefined;
}

export const customizeConfig = mergeWith(customizer);

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

function customizeTarget(target: Target = Target.BROWSER): EslintConfig {
  const overrideMap = {
    [Target.BROWSER]: {
      env: {
        browser: true
      }
    },
    [Target.NODE]: {
      env: {
        node: true
      }
    },
    [Target.REACT]: {
      extends: [
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
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
    }
  };
  return (config: EslintConfig) => {
    const overrides = overrideMap[target];
    return customizeConfig(config, overrides);
  };
}

function applyOverrides(overrides: EslintConfig): EslintConfig {
  return (config: EslintConfig) => customizeConfig(config, overrides);
}

export function config(
  options: EslintOptions = {},
  overrides: EslintConfig = {}
) {
  return flow(
    customizeTarget(options.target),
    applyOverrides(overrides)
  )(base);
}
