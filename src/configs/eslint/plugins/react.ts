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

export const getPluginConfig: GetPluginConfig = (packageJson) => {
  // `eslint-config-next` already includes `eslint-plugin-react`
  if (hasDependency(packageJson, 'next')) {
    return null;
  }

  if (!hasDependency(packageJson, 'react')) {
    return null;
  }

  return {
    devDependencies: {
      'eslint-plugin-jsx-a11y': '^6.6.0',
      'eslint-plugin-react': '^7.31.0',
      'eslint-plugin-react-hooks': '^4.6.0',
    },
    config: {
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      rules: {
        // The automatic JSX runtime handles the React import.
        'react/react-in-jsx-scope': 'off',
        'react/display-name': 'off',
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
      settings: { react: { version: 'detect' } },
      overrides: [
        {
          files: [
            '**/*spec.*',
            '**/jest*',
            '**/setupTests.*',
            '**/test-utils.*',
          ],
          rules: {
            'react/display-name': 'off',
            'react/prop-types': 'off',
          },
        },
      ],
    },
  };
};
