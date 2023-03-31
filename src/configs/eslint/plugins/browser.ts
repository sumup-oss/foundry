/**
 * Copyright 2023, SumUp Ltd.
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

import type { GetPluginConfig } from '../../../types/shared';
import { hasDependency } from '../../../lib/package-json';
import { BROWSER_LIBRARIES, NODE_FILES, UNIT_TEST_FILES } from '../constants';

export const getPluginConfig: GetPluginConfig = (packageJson) => {
  const isBrowser = Boolean(packageJson.browser);
  const hasClientLibraries = BROWSER_LIBRARIES.some((library) =>
    hasDependency(packageJson, library),
  );

  if (!isBrowser && !hasClientLibraries) {
    return null;
  }

  return {
    devDependencies: {
      'eslint-plugin-compat': '^4.0.0',
    },
    config: {
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
  };
};
