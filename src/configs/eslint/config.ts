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

import path from 'node:path';
import { cwd } from 'node:process';

import { deepmergeCustom } from 'deepmerge-ts';

import { flow, isEmpty, uniq } from '../../lib/helpers.js';
import * as logger from '../../lib/logger.js';
import { getOptions } from '../../lib/options.js';
import {
  Environment,
  Framework,
  Language,
  Plugin,
  type Workspaces,
} from '../../types/shared.js';

import { bestPractices } from './rules/best-practices.js';
import { errors } from './rules/errors.js';
import { es6 } from './rules/es6.js';
import { node } from './rules/node.js';
// import { imports } from './rules/imports.js';
import { strict } from './rules/strict.js';
import { style } from './rules/style.js';
import { typescript } from './rules/typescript.js';
import { variables } from './rules/variables.js';

// NOTE: Using the Linter.Config interface from ESLint causes errors
//       and I couldn't figure out how to fix them. — @connor_baer
type ESLintConfig = unknown;

export const customizeConfig = deepmergeCustom({
  mergeArrays: (values) => {
    const [baseValue, sourceValue] = values;
    return uniq([...baseValue, ...sourceValue]);
  },
  mergeRecords: (values, utils, meta) => {
    const [baseValue, sourceValue] = values;
    if (meta?.key === 'rules') {
      return { ...baseValue, ...sourceValue };
    }
    return utils.actions.defaultMerge;
  },
});

export function getFileGlobsForWorkspaces(
  workspaces: Workspaces,
  fileGlobs: string[],
) {
  if (!workspaces || !Array.isArray(workspaces)) {
    return fileGlobs;
  }
  return fileGlobs.concat(
    workspaces.flatMap((workspace) =>
      fileGlobs.map((fileGlob) => path.join(workspace, fileGlob)),
    ),
  );
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

const INTEGRATION_TEST_FILES = ['e2e/**/*', 'tests/**/*'];

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
  // 'import/prefer-default-export': 'off',
  // 'import/no-cycle': ['error', { maxDepth: 7 }],
  // 'import/order': ['error', { 'newlines-between': 'always' }],
  // 'import/extensions': 'off',
  'no-void': ['error', { allowAsStatement: true }],
};

const sharedOverrides = [
  {
    files: ['**/*.{story,stories}.*'],
    rules: {
      // 'import/no-extraneous-dependencies': 'off',
      // 'import/no-anonymous-default-export': 'off',
      'no-alert': 'off',
    },
  },
  {
    files: ['**/*spec.*', '**/jest*', '**/setupTests.*', '**/test-utils.*'],
    rules: {
      // 'import/no-extraneous-dependencies': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
    },
  },
];

// TODO: Reorganize or give better name
const sumup = {
  root: true,
  // eslint-config-prettier disables ESLint's stylistic rules which are covered by Biome
  extends: ['eslint:recommended', 'prettier'],
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
  // settings: {
  //   'import/resolver': {
  //     node: {
  //       extensions: ['.js', '.jsx', '.ts', '.tsx'],
  //     },
  //   },
  // },
  rules: sharedRules,
  overrides: [
    {
      files: NODE_FILES,
      rules: {
        'no-console': 'off',
      },
    },
  ],
};

const base = flow(
  (config) => customizeConfig(config, bestPractices),
  (config) => customizeConfig(config, errors),
  (config) => customizeConfig(config, node),
  (config) => customizeConfig(config, style),
  (config) => customizeConfig(config, variables),
  (config) => customizeConfig(config, es6),
  // (config) => customizeConfig(config, imports),
  (config) => customizeConfig(config, strict),
  (config) => customizeConfig(config, sumup),
)({
  extends: ['eslint:recommended'],
});

const biomeRules = {
  'constructor-super': 'off',
  curly: 'off',
  'default-case': 'off',
  'default-case-last': 'off',
  'default-param-last': 'off',
  'dot-notation': 'off',
  'eqeqeq': 'off',
  'for-direction': 'off',
  'getter-return': 'off',
  'no-array-constructor': 'off',
  'no-async-promise-executor': 'off',
  'no-case-declarations': 'off',
  'no-class-assign': 'off',
  'no-compare-neg-zero': 'off',
  'no-cond-assign': 'off',
  'no-console': 'off',
  'no-const-assign': 'off',
  'no-constant-condition': 'off',
  'no-constructor-return': 'off',
  'no-control-regex': 'off',
  'no-debugger': 'off',
  'no-dupe-args': 'off',
  'no-dupe-class-members': 'off',
  'no-dupe-else-if': 'off',
  'no-dupe-keys': 'off',
  'no-duplicate-case': 'off',
  'no-else-return': 'off',
  'no-empty': 'off',
  'no-empty-character-class': 'off',
  'no-empty-function': 'off',
  'no-empty-pattern': 'off',
  'no-empty-static-block': 'off',
  'no-eval': 'off',
  'no-ex-assign': 'off',
  'no-extra-boolean-cast': 'off',
  'no-extra-label': 'off',
  'no-fallthrough': 'off',
  'no-func-assign': 'off',
  'no-global-assign': 'off',
  'no-import-assign': 'off',
  'no-inner-declarations': 'off',
  'no-label-var': 'off',
  'no-labels': 'off',
  'no-lone-blocks': 'off',
  'no-lonely-if': 'off',
  'no-loss-of-precision': 'off',
  'no-misleading-character-class': 'off',
  'no-negated-condition': 'off',
  'no-new-native-nonconstructor': 'off',
  'no-new-symbol': 'off',
  'no-new-wrappers': 'off',
  'no-nonoctal-decimal-escape': 'off',
  'no-obj-calls': 'off',
  'no-param-reassign': 'off',
  'no-prototype-builtins': 'off',
  'no-redeclare': 'off',
  'no-regex-spaces': 'off',
  'no-restricted-globals': 'off',
  'no-restricted-imports': 'off',
  'no-self-assign': 'off',
  'no-self-compare': 'off',
  'no-sequences': 'off',
  'no-setter-return': 'off',
  'no-shadow-restricted-names': 'off',
  'no-sparse-array': 'off',
  'no-this-before-super': 'off',
  'no-throw-literal': 'off',
  'no-undef': 'off',
  'no-undef-init': 'off',
  'no-unneeded-ternary': 'off',
  'no-unreachable': 'off',
  'no-unsafe-finally': 'off',
  'no-unsafe-negation': 'off',
  'no-unsafe-optional-chaining': 'off',
  'no-unused-labels': 'off',
  'no-unused-private-class-members': 'off',
  'no-unused-vars': 'off',
  'no-use-before-define': 'off',
  'no-useless-catch': 'off',
  'no-useless-concat': 'off',
  'no-useless-constructor': 'off',
  'no-useless-rename': 'off',
  'no-var': 'off',
  'no-void': 'off',
  'no-with': 'off',
  'one-var': 'off',
  'operator-assignment': 'off',
  'prefer-arrow-callback': 'off',
  'prefer-const': 'off',
  'prefer-exponentiation-operator': 'off',
  'prefer-numeric-literals': 'off',
  'prefer-regex-literals': 'off',
  'prefer-rest-params': 'off',
  'prefer-template': 'off',
  'require-await': 'off',
  'require-yield': 'off',
  'use-isnan': 'off',
  'valid-typeof': 'off',
  'yoda': 'off',
  'jsx-ally/alt-text': 'off',
  'jsx-ally/anchor-has-content': 'off',
  'jsx-ally/anchor-is-valid': 'off',
  'jsx-ally/aria-activedescendant-has-tabindex': 'off',
  'jsx-ally/aria-props': 'off',
  'jsx-ally/aria-proptypes': 'off',
  'jsx-ally/aria-role': 'off',
  'jsx-ally/aria-unsupported-elements': 'off',
  'jsx-ally/autocomplete-valid': 'off',
  'jsx-ally/click-events-have-key-events': 'off',
  'jsx-ally/heading-has-content': 'off',
  'jsx-ally/html-has-lang': 'off',
  'jsx-ally/iframe-has-title': 'off',
  'jsx-ally/img-redundant-alt': 'off',
  'jsx-ally/interactive-support-focus': 'off',
  'jsx-ally/label-has-associated-control': 'off',
  'jsx-ally/lang': 'off',
  'jsx-ally/media-has-caption': 'off',
  'jsx-ally/mouse-events-have-key-events': 'off',
  'jsx-ally/no-access-key': 'off',
  'jsx-ally/no-aria-hidden-on-focusable': 'off',
  'jsx-ally/no-autofocus': 'off',
  'jsx-ally/no-distracting-elements': 'off',
  'jsx-ally/no-interactive-element-to-noninteractive-role': 'off',
  'jsx-ally/no-noninteractive-element-to-interactive-role': 'off',
  'jsx-ally/no-noninteractive-tabindex': 'off',
  'jsx-ally/no-redundant-roles': 'off',
  'jsx-ally/prefer-tag-over-role': 'off',
  'jsx-ally/role-has-required-aria-props': 'off',
  'jsx-ally/scope': 'off',
  'jsx-ally/tabindex-no-positive': 'off',
  'react/button-has-type': 'off',
  'react/jsx-boolean-value': 'off',
  'react/jsx-fragments': 'off',
  'react/jsx-key': 'off',
  'react/jsx-no-comment-textnodes': 'off',
  'react/jsx-no-duplicate-props': 'off',
  'react/jsx-no-target-blank': 'off',
  'react/jsx-no-useless-fragment': 'off',
  'react/no-array-index-key': 'off',
  'react/no-children-prop': 'off',
  'react/no-danger': 'off',
  'react/no-danger-with-children': 'off',
  'react/void-dom-elements-no-children': 'off',
  'react-hooks/exhaustive-deps': 'off',
  'react-hooks/rules-of-hooks': 'off',
  '@typescript-eslint/adjacent-overload-signatures': 'off',
  '@typescript-eslint/array-type': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/consistent-type-exports': 'off',
  '@typescript-eslint/consistent-type-imports': 'off',
  '@typescript-eslint/default-param-last': 'off',
  '@typescript-eslint/dot-notation': 'off',
  '@typescript-eslint/naming-convention': 'off',
  '@typescript-eslint/no-dupe-class-members': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-extra-non-null-assertion': 'off',
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
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-use-before-define': 'off',
  '@typescript-eslint/no-useless-constructor': 'off',
  '@typescript-eslint/no-useless-empty-export': 'off',
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
};

function customizeLinter() {
  return (config: ESLintConfig): ESLintConfig =>
    customizeConfig(config, {
      rules: biomeRules,
    });
}

function customizeLanguage(language: Language) {
  const languageMap = {
    [Language.JAVASCRIPT]: {
      overrides: sharedOverrides,
    },
    [Language.TYPESCRIPT]: {
      overrides: [
        // TODO: Reorganize
        customizeConfig<Record<string, unknown>[]>(typescript, {
          files: ['**/*.{ts,tsx}'],
          extends: [
            'plugin:@typescript-eslint/eslint-recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
          ],
          plugins: ['@typescript-eslint'],
          parser: '@typescript-eslint/parser',
          parserOptions: {
            tsconfigRootDir: cwd(),
            project: ['./tsconfig.json'],
            sourceType: 'module',
            ecmaVersion: 6,
            ecmaFeatures: {
              modules: true,
            },
          },
          rules: {
            ...sharedRules,
            ...biomeRules,
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
        }),
        {
          files: ['**/*.d.ts'],
          rules: {
            'spaced-comment': 'off',
            // 'node/no-extraneous-import': 'off',
            // 'import/no-extraneous-dependencies': [
            //   'error',
            //   { devDependencies: true },
            // ],
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
    return overrides ? customizeConfig(config, overrides) : config;
  };
}

function customizeEnvironments(environments: Environment[]) {
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
      extends: ['plugin:security/recommended-legacy'],
      env: { node: true },
      rules: {
        // We don't know if the user's source code is using EJS or CJS.
        // 'node/no-unsupported-features/es-syntax': 'off',
        // This rule breaks when used in combination with TypeScript
        // and is already covered by similar ESLint rules.
        // 'node/no-missing-import': 'off',
        // This rule is already covered by similar ESLint rules.
        // 'node/no-extraneous-import': 'off',
        // This rule produces too many false positives.
        'security/detect-object-injection': 'off',
      },
      // overrides: [
      //   {
      //     files: [
      //       '**/*.spec.*',
      //       '**/jest*',
      //       '**/setupTests.*',
      //       '**/test-utils.*',
      //     ],
      //     rules: {
      //       'node/no-unpublished-import': 'off',
      //       'node/no-unpublished-require': 'off',
      //       'node/no-missing-require': 'off',
      //       'node/no-extraneous-require': 'off',
      //     },
      //   },
      // ],
    },
  };
  return (config: ESLintConfig): ESLintConfig => {
    if (!environments || isEmpty(environments)) {
      return config;
    }
    return environments.reduce((acc, environment: Environment) => {
      const overrides = environmentMap[environment];
      return overrides ? customizeConfig(acc, overrides) : acc;
    }, config);
  };
}

function customizeFramework(frameworks: Framework[]) {
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
      frameworks = frameworks.filter(
        (framework) => framework !== Framework.REACT,
      );
    }

    return frameworks.reduce((acc, framework: Framework) => {
      const overrides = frameworkMap[framework];
      return overrides ? customizeConfig(acc, overrides) : acc;
    }, config);
  };
}

function customizePlugin(plugins: Plugin[], workspaces: Workspaces) {
  const integrationTestFiles = getFileGlobsForWorkspaces(
    workspaces,
    INTEGRATION_TEST_FILES,
  );

  const pluginMap = {
    [Plugin.NEXT_JS]: {
      extends: ['next'],
    },
    [Plugin.CIRCUIT_UI]: {
      plugins: ['@sumup/circuit-ui'],
      rules: {
        '@sumup/circuit-ui/component-lifecycle-imports': 'error',
        '@sumup/circuit-ui/no-invalid-custom-properties': 'error',
        '@sumup/circuit-ui/no-renamed-props': 'error',
        '@sumup/circuit-ui/no-deprecated-props': 'warn',
        '@sumup/circuit-ui/no-deprecated-components': 'warn',
      },
    },
    [Plugin.CIRCUIT_UI_OSS]: {
      plugins: ['@sumup-oss/circuit-ui'],
      rules: {
        '@sumup-oss/circuit-ui/component-lifecycle-imports': 'error',
        '@sumup-oss/circuit-ui/no-invalid-custom-properties': 'error',
        '@sumup-oss/circuit-ui/no-renamed-props': 'error',
        '@sumup-oss/circuit-ui/no-deprecated-props': 'warn',
        '@sumup-oss/circuit-ui/no-deprecated-components': 'warn',
        '@sumup-oss/circuit-ui/renamed-package-scope': 'error',
      },
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
          files: integrationTestFiles,
          extends: ['plugin:cypress/recommended'],
          plugins: ['cypress'],
          env: { 'cypress/globals': true },
        },
      ],
    },
    [Plugin.PLAYWRIGHT]: {
      overrides: [
        {
          files: integrationTestFiles,
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
      return overrides ? customizeConfig(acc, overrides) : acc;
    }, config);
  };
}

function addCopyrightNotice(openSource: boolean) {
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
    customizeLinter(),
    customizeLanguage(options.language),
    customizeEnvironments(options.environments),
    customizeFramework(options.frameworks),
    customizePlugin(options.plugins, options.workspaces),
    addCopyrightNotice(options.openSource),
    applyOverrides(overrides),
  )(base);
}
