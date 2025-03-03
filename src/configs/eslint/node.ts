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
import nodePlugin from 'eslint-plugin-n';
import securityPlugin from 'eslint-plugin-security';

import { files } from './files.js';

const nodeRecommended = nodePlugin.configs['flat/recommended'];

export const node = {
  name: 'foundry/node',
  files: [...files.javascript, ...files.typescript],
  languageOptions: nodeRecommended.languageOptions,
  plugins: { n: nodePlugin, security: securityPlugin },
  rules: {
    // allow use of console on the server
    // https://eslint.org/docs/latest/rules/no-console
    'no-console': 'off',

    // require all requires be top-level
    // https://eslint.org/docs/latest/rules/global-require
    'global-require': 'error',

    // disallow use of the Buffer() constructor
    // https://eslint.org/docs/latest/rules/no-buffer-constructor
    'no-buffer-constructor': 'error',

    // disallow use of new operator with the require function
    // https://eslint.org/docs/latest/rules/no-new-require
    'no-new-require': 'error',

    // disallow string concatenation with __dirname and __filename
    // https://eslint.org/docs/latest/rules/no-path-concat
    'no-path-concat': 'error',

    /**
     * Node
     */

    ...nodeRecommended.rules,

    // This rule breaks when used in combination with TypeScript
    // and is already covered by similar ESLint rules.
    'n/no-missing-import': 'off',
    'n/no-missing-require': 'off',

    // This rule is already covered by similar ESLint rules.
    'n/no-extraneous-import': 'off',
    'n/no-extraneous-require': 'off',

    // This rule is already covered by similar ESLint rules.
    'n/no-unpublished-import': 'off',
    'n/no-unpublished-require': 'off',

    /**
     *  Security
     */

    ...securityPlugin.configs.recommended.rules,

    // This rule produces too many false positives.
    'security/detect-object-injection': 'off',
  },
} satisfies Linter.Config;
