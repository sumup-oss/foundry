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
import compat from 'eslint-plugin-compat';
import globals from 'globals';

export const browser = {
  name: 'foundry/browser',
  // TODO:
  // files: [],
  languageOptions: {
    globals: globals.browser,
  },
  settings: {
    lintAllEsApis: true,
    // This API produces a false positive
    polyfills: ['document.body'],
  },
  plugins: { compat },
  rules: {
    'compat/compat': 'error',
  },
} satisfies Linter.Config;
