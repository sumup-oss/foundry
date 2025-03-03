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

import type { ESLint, Linter } from 'eslint';
import { fixupPluginRules } from '@eslint/compat';

import { files } from './files.js';

/**
 * @deprecated Emotion.js should be replaced in favor of CSS Modules.
 */
export function emotion({ plugins }: { plugins: { emotion: ESLint.Plugin } }) {
  return {
    name: 'foundry/emotion',
    files: [...files.javascript, ...files.typescript],
    plugins: { '@emotion': fixupPluginRules(plugins.emotion) },
    rules: {
      '@emotion/import-from-emotion': 'error',
      '@emotion/jsx-import': 'off',
      '@emotion/no-vanilla': 'error',
      '@emotion/pkg-renaming': 'error',
      '@emotion/styled-import': 'error',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
    },
  } satisfies Linter.Config;
}
