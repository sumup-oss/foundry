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

import { flow, mergeWith, isArray, isObject, isEmpty, uniq } from 'lodash/fp';

import { Options, Environment, Framework } from '../../types/shared';

type EslintOptions = Pick<
  Options,
  'language' | 'environments' | 'frameworks' | 'openSource'
>;
// NOTE: Using the Linter.Config interface from Eslint causes errors
//       and I couldn't figure out how to fix them. — Connor
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
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
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

function customizeEnv(environments?: Environment[]): EslintConfig {
  return (config: EslintConfig) => {
    if (!environments || isEmpty(environments)) {
      return config;
    }
    return environments.reduce((acc, environment: Environment) => {
      const overrides = { env: { [environment]: true } };
      return customizeConfig(acc, overrides);
    }, config);
  };
}

function customizeFramework(frameworks?: Framework[]): EslintConfig {
  const frameworkMap = {
    [Framework.REACT]: {
      extends: [
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'prettier/react'
      ],
      plugins: ['react', 'react-hooks', 'jsx-a11y'],
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    [Framework.EMOTION]: {
      plugins: ['emotion'],
      rules: {
        'emotion/jsx-import': 'error',
        'emotion/no-vanilla': 'error',
        'emotion/import-from-emotion': 'error',
        'emotion/styled-import': 'error'
      }
    },
    [Framework.JEST]: {
      extends: ['plugin:jest/recommended'],
      plugins: ['jest'],
      overrides: [
        {
          files: ['**/*spec.js'],
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
            render: true,
            create: true,
            renderToHtml: true,
            axe: true
          },
          env: {
            jest: true
          }
        }
      ]
    }
  };
  return (config: EslintConfig) => {
    if (!frameworks || isEmpty(frameworks)) {
      return config;
    }
    return frameworks.reduce((acc, framework: Framework) => {
      const overrides = frameworkMap[framework];
      return customizeConfig(acc, overrides);
    }, config);
  };
}

function addCopyrightNotice(openSource?: boolean): EslintConfig {
  return (config: EslintConfig) => {
    const copyrightNotice = {
      plugins: ['notice'],
      rules: {
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
      }
    };
    if (!openSource) {
      return config;
    }
    return customizeConfig(config, copyrightNotice);
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
    customizeEnv(options.environments),
    customizeFramework(options.frameworks),
    addCopyrightNotice(options.openSource),
    applyOverrides(overrides)
  )(base);
}
