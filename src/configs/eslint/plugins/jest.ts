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

import { GetPluginConfig } from '../../../types/shared';
import { hasDependency } from '../../../lib/package-json';
import { UNIT_TEST_FILES } from '../constants';

export const getPluginConfig: GetPluginConfig = (packageJson) => {
  if (!hasDependency(packageJson, 'jest')) {
    return null;
  }

  return {
    devDependencies: {
      'eslint-plugin-jest': '^27.1.0',
    },
    config: {
      overrides: [
        {
          files: UNIT_TEST_FILES,
          extends: ['plugin:jest/recommended'],
          plugins: ['jest'],
          env: { 'jest/globals': true },
          rules: {
            'jest/unbound-method': 'error',
          },
        },
      ],
    },
  };
};
