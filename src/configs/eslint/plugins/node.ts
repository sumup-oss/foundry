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
import { NODE_LIBRARIES, UNIT_TEST_FILES } from '../constants';

export const getPluginConfig: GetPluginConfig = (packageJson) => {
  const isCLI = Boolean(packageJson.bin);
  const hasServerLibraries = NODE_LIBRARIES.some((library) =>
    hasDependency(packageJson, library),
  );

  if (!isCLI && !hasServerLibraries) {
    return null;
  }

  return {
    devDependencies: {
      'eslint-plugin-node': '^11.1.0',
    },
    config: {
      extends: ['plugin:node/recommended'],
      env: { node: true },
      rules: {
        // We don't know if the user's source code is using EJS or CJS.
        'node/no-unsupported-features/es-syntax': 'off',
        // This rule breaks when used in combination with TypeScript
        // and is already covered by similar ESLint rules.
        'node/no-missing-import': 'off',
        // This rule is already covered by similar ESLint rules.
        'node/no-extraneous-import': 'off',
      },
      overrides: [
        {
          files: UNIT_TEST_FILES,
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
};
