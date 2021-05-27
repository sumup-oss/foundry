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

import process from 'process';

import { flow, mergeWith, isArray, isObject, isEmpty, uniq } from 'lodash/fp';

import { Options, Environment, Framework } from '../../types/shared';

type EslintOptions = Pick<
  Options,
  'language' | 'environments' | 'frameworks' | 'openSource'
>;
// NOTE: Using the Linter.Config interface from Eslint causes errors
//       and I couldn't figure out how to fix them. — @connor_baer
type EslintConfig = unknown;

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

const baseRules = {
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
      ignorePattern: '^(?:import\\s|export\\s|\\s*it(?:\\.(?:skip|only))?\\()',
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
};

const base = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'airbnb-base'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
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
  rules: baseRules,
  overrides: [
    {
      files: ['**/*.json'],
      extends: ['plugin:json/recommended'],
      rules: {
        'notice/notice': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        'airbnb-typescript/base',
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
        ...baseRules,
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/indent': 'off',
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
      files: ['**/*.{story,stories}.*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/*.{story,stories}.{ts,tsx}'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['**/*spec.*', '**/setupTests.*', '**/test-utils.*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'react/display-name': 'off',
        'react/prop-types': 'off',
      },
    },
    {
      files: ['**/*spec.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
      },
    },
  ],
};

function customizeEnv(environments?: Environment[]) {
  const environmentMap = {
    [Environment.BROWSER]: {
      env: { browser: true },
    },
    [Environment.NODE]: {
      extends: ['plugin:node/recommended'],
      env: { node: true },
      rules: {
        // We don't know if the user's source code is using EJS or CJS.
        'node/no-unsupported-features/es-syntax': 'off',
        // This rule breaks when used in combination with TypeScript
        // and is already covered by similar Eslint rules.
        'node/no-missing-import': 'off',
        // This rule is already covered by similar Eslint rules.
        'node/no-extraneous-import': 'off',
      },
      overrides: [
        {
          files: ['**/*.spec.*', '**/setupTests.*', '**/test-utils.*'],
          rules: {
            'node/no-unpublished-import': 'off',
          },
        },
      ],
    },
  };
  return (config: EslintConfig): EslintConfig => {
    if (!environments || isEmpty(environments)) {
      return config;
    }
    return environments.reduce((acc, environment: Environment) => {
      const overrides = environmentMap[environment];
      return customizeConfig(acc, overrides);
    }, config);
  };
}

function customizeFramework(frameworks?: Framework[]) {
  const frameworkMap = {
    [Framework.REACT]: {
      extends: ['plugin:react/recommended', 'plugin:jsx-a11y/recommended'],
      plugins: ['react', 'react-hooks', 'jsx-a11y'],
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
      settings: { react: { version: 'detect' } },
    },
    [Framework.EMOTION]: {
      plugins: ['emotion'],
      rules: {
        'emotion/jsx-import': 'off',
        'emotion/no-vanilla': 'error',
        'emotion/import-from-emotion': 'error',
        'emotion/styled-import': 'error',
      },
    },
    [Framework.JEST]: {
      overrides: [
        {
          files: ['**/*spec.*'],
          extends: ['plugin:jest/recommended'],
          plugins: ['jest'],
          globals: {
            render: true,
            create: true,
            renderToHtml: true,
            fireEvent: true,
            userEvent: true,
            wait: true,
            act: true,
            actHook: true,
            renderHook: true,
            axe: true,
          },
          env: { 'jest/globals': true },
        },
      ],
    },
    [Framework.CYPRESS]: {
      overrides: [
        {
          files: ['**/*spec.*', 'e2e/**/*'],
          extends: ['plugin:cypress/recommended'],
          plugins: ['cypress'],
          env: { 'cypress/globals': true },
        },
      ],
    },
    [Framework.TESTING_LIBRARY]: {
      overrides: [
        {
          files: ['**/*spec.*'],
          extends: ['plugin:testing-library/react'],
          plugins: ['testing-library'],
        },
      ],
    },
  };
  return (config: EslintConfig): EslintConfig => {
    if (!frameworks || isEmpty(frameworks)) {
      return config;
    }
    return frameworks.reduce((acc, framework: Framework) => {
      const overrides = frameworkMap[framework];
      return customizeConfig(acc, overrides);
    }, config);
  };
}

function addCopyrightNotice(openSource?: boolean) {
  return (config: EslintConfig): EslintConfig => {
    if (!openSource) {
      return config;
    }
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
            onNonMatchingHeader: 'prepend',
          },
        ],
      },
    };
    return customizeConfig(config, copyrightNotice);
  };
}

function applyOverrides(overrides: EslintConfig) {
  return (config: EslintConfig): EslintConfig =>
    customizeConfig(config, overrides);
}

export function createConfig(
  options: EslintOptions = {},
  overrides: EslintConfig = {},
): EslintConfig {
  return flow(
    customizeEnv(options.environments),
    customizeFramework(options.frameworks),
    addCopyrightNotice(options.openSource),
    applyOverrides(overrides),
  )(base);
}
