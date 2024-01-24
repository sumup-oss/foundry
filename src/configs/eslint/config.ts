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

import { cwd } from 'process';

import { flow, mergeWith, isArray, isObject, isEmpty, uniq } from 'lodash/fp';

import { Language, Environment, Framework, Plugin } from '../../types/shared';
import * as logger from '../../lib/logger';
import { getOptions } from '../../lib/options';

// NOTE: Using the Linter.Config interface from ESLint causes errors
//       and I couldn't figure out how to fix them. — @connor_baer
type ESLintConfig = unknown;

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

const UNIT_TEST_FILES = [
  '**/*.spec.*',
  '**/jest*',
  '**/setupTests.*',
  '**/test-utils.*',
  '**/*Fixtures.*',
  '**/__fixtures__/**/*',
  '**/__mocks__/**/*',
];

const NODE_FILES = ['api/**/*', 'pages/api/**/*', 'src/pages/api/**/*'];

const sharedRules = {
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
  'import/no-cycle': ['error', { maxDepth: 7 }],
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
};

const sharedOverrides = [
  {
    files: ['**/*.{story,stories}.*'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/no-anonymous-default-export': 'off',
      'no-alert': 'off',
    },
  },
  {
    files: ['**/*spec.*', '**/jest*', '**/setupTests.*', '**/test-utils.*'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
    },
  },
];

const base = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'airbnb-base'],
  plugins: ['prettier'],
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
  rules: sharedRules,
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

function customizeLanguage(language?: Language) {
  const languageMap = {
    [Language.JAVASCRIPT]: {
      overrides: sharedOverrides,
    },
    [Language.TYPESCRIPT]: {
      overrides: [
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
            tsconfigRootDir: cwd(),
            project: ['./tsconfig.json'],
            extraFileExtensions: ['.json'],
            sourceType: 'module',
            ecmaVersion: 6,
            ecmaFeatures: {
              modules: true,
            },
          },
          rules: {
            ...sharedRules,
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
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/unbound-method': 'off',
          },
        },
        ...sharedOverrides,
      ],
    },
  };
  return (config: ESLintConfig): ESLintConfig => {
    if (!language) {
      return config;
    }
    const overrides = languageMap[language];
    return customizeConfig(config, overrides);
  };
}

function customizeEnvironments(environments?: Environment[]) {
  const environmentMap = {
    [Environment.BROWSER]: {
      extends: ['plugin:compat/recommended'],
      env: { browser: true },
      settings: {
        lintAllEsApis: true,
        // This API produces a false positive
        polyfills: ['document.body'],
      },
      overrides: [
        {
          files: [...UNIT_TEST_FILES, ...NODE_FILES],
          rules: {
            'compat/compat': 'off',
          },
        },
      ],
    },
    [Environment.NODE]: {
      extends: ['plugin:node/recommended', 'plugin:security/recommended'],
      env: { node: true },
      rules: {
        // We don't know if the user's source code is using EJS or CJS.
        'node/no-unsupported-features/es-syntax': 'off',
        // This rule breaks when used in combination with TypeScript
        // and is already covered by similar ESLint rules.
        'node/no-missing-import': 'off',
        // This rule is already covered by similar ESLint rules.
        'node/no-extraneous-import': 'off',
        // This rule produces too many false positives.
        'security/detect-object-injection': 'off',
      },
      overrides: [
        {
          files: [
            '**/*.spec.*',
            '**/jest*',
            '**/setupTests.*',
            '**/test-utils.*',
          ],
          rules: {
            'node/no-unpublished-import': 'off',
            'node/no-unpublished-require': 'off',
            'node/no-missing-require': 'off',
            'node/no-extraneous-require': 'off',
          },
        },
      ],
    },
  };
  return (config: ESLintConfig): ESLintConfig => {
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
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      plugins: ['react', 'react-hooks', 'jsx-a11y'],
      rules: {
        // The automatic JSX runtime handles the React import.
        'react/react-in-jsx-scope': 'off',
        'react/display-name': 'off',
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
      settings: { react: { version: 'detect' } },
    },
    [Framework.NEXT_JS]: {
      settings: {
        // This is needed for eslint-plugin-compat: https://www.npmjs.com/package/eslint-plugin-compat#adding-polyfills
        // The list is based on https://github.com/vercel/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js
        polyfills: [
          'Array.prototype.copyWithin',
          'Array.prototype.fill',
          'Array.prototype.find',
          'Array.prototype.findIndex',
          'Array.prototype.flagMap',
          'Array.prototype.flat',
          'Array.from',
          'Array.prototype.includes',
          'Array.of',
          'Function.name',
          'Map',
          'Number.EPSILON',
          'Number.isFinite',
          'Number.isInteger',
          'Number.isNaN',
          'Number.isSafeInteger',
          'Number.MAX_SAFE_INTEGER',
          'Number.MIN_SAFE_INTEGER',
          'Number.parseFloat',
          'Number.parseInt',
          'Object.assign',
          'Object.entries',
          'Object.getOwnPropertyDescriptors',
          'Object.keys',
          'Object.is',
          'Object.values',
          'Reflect',
          'RegExp',
          'Set',
          'Symbol',
          'String.prototype.codePointAt',
          'String.prototype.endsWith',
          'String.prototype.fromCodePoint',
          'String.prototype.includes',
          'String.prototype.padStart',
          'String.prototype.padEnd',
          'String.prototype.raw',
          'String.prototype.repeat',
          'String.prototype.startsWith',
          'String.prototype.trimLeft',
          'String.prototype.trimRight',
          'URL',
          'URLSearchParams',
          'WeakMap',
          'WeakSet',
          'Promise',
          'fetch',
        ],
      },
    },
  };
  return (config: ESLintConfig): ESLintConfig => {
    if (!frameworks || isEmpty(frameworks)) {
      return config;
    }

    if (
      frameworks.includes(Framework.NEXT_JS) &&
      frameworks.includes(Framework.REACT)
    ) {
      logger.warn(
        `The '${Framework.NEXT_JS}' framework includes React-specific rules. Please remove the '${Framework.REACT}' framework to avoid conflicts.`,
      );
      // eslint-disable-next-line no-param-reassign
      frameworks = frameworks.filter(
        (framework) => framework !== Framework.REACT,
      );
    }

    return frameworks.reduce((acc, framework: Framework) => {
      const overrides = frameworkMap[framework];
      return customizeConfig(acc, overrides);
    }, config);
  };
}

function customizePlugin(plugins?: Plugin[]) {
  const pluginMap = {
    [Plugin.NEXT_JS]: {
      extends: ['next'],
    },
    [Plugin.EMOTION]: {
      plugins: ['@emotion'],
      rules: {
        '@emotion/import-from-emotion': 'error',
        '@emotion/jsx-import': 'off',
        '@emotion/no-vanilla': 'error',
        '@emotion/pkg-renaming': 'error',
        '@emotion/styled-import': 'error',
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
      },
    },
    [Plugin.JEST]: {
      overrides: [
        {
          files: UNIT_TEST_FILES,
          extends: ['plugin:jest/recommended'],
          plugins: ['jest'],
          env: { 'jest/globals': true },
        },
      ],
    },
    [Plugin.TESTING_LIBRARY]: {
      overrides: [
        {
          files: UNIT_TEST_FILES,
          extends: ['plugin:testing-library/react'],
          plugins: ['testing-library'],
        },
      ],
    },
    [Plugin.CYPRESS]: {
      overrides: [
        {
          files: ['**/*spec.*', 'e2e/**/*', 'tests/**/*'],
          extends: ['plugin:cypress/recommended'],
          plugins: ['cypress'],
          env: { 'cypress/globals': true },
        },
      ],
    },
    [Plugin.PLAYWRIGHT]: {
      overrides: [
        {
          files: ['**/*spec.*', 'e2e/**/*', 'tests/**/*'],
          extends: ['plugin:playwright/playwright-test'],
        },
      ],
    },
    [Plugin.STORYBOOK]: {
      extends: ['plugin:storybook/recommended'],
    },
  };
  return (config: ESLintConfig): ESLintConfig => {
    if (!plugins || isEmpty(plugins)) {
      return config;
    }

    return plugins.reduce((acc, plugin: Plugin) => {
      const overrides = pluginMap[plugin];
      return customizeConfig(acc, overrides);
    }, config);
  };
}

function addCopyrightNotice(openSource?: boolean) {
  return (config: ESLintConfig): ESLintConfig => {
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

function applyOverrides(overrides: ESLintConfig) {
  return (config: ESLintConfig): ESLintConfig =>
    customizeConfig(config, overrides);
}

export function createConfig(overrides: ESLintConfig = {}): ESLintConfig {
  const options = getOptions();

  return flow(
    customizeLanguage(options.language),
    customizeEnvironments(options.environments),
    customizeFramework(options.frameworks),
    customizePlugin(options.plugins),
    addCopyrightNotice(options.openSource),
    applyOverrides(overrides),
  )(base);
}
