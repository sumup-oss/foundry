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
import globals from 'globals';

import { files } from './files.js';

// Adapted from https://github.com/jest-community/eslint-plugin-jest/blob/main/index.d.ts
export type JestPlugin = {
  environments: {
    globals: {
      globals: {
        [key: string]: boolean;
      };
    };
  };
  configs: {
    'flat/all': Linter.Config;
    'flat/recommended': Linter.Config;
    'flat/style': Linter.Config;
  };
};

export type VitestPlugin = {
  configs: {
    'recommended': Linter.Config;
  };
};
export type TestingLibraryPlugin = {
  configs: {
    'flat/dom': Linter.Config;
    'flat/react': Linter.Config;
  };
};

export function tests({
  plugins,
}: {
  plugins?: {
    'jest'?: JestPlugin;
    'vitest'?: VitestPlugin;
    'testing-library'?: TestingLibraryPlugin;
  };
}) {
  return {
    name: 'foundry/tests',
    files: files.tests,
    languageOptions: {
      globals: {
        ...globals.node,
        ...plugins?.jest?.environments?.globals?.globals,
      },
    },
    plugins,
    rules: {
      ...plugins?.jest?.configs?.['flat/recommended']?.rules,
      ...plugins?.vitest?.configs?.recommended?.rules,
      ...plugins?.['testing-library']?.configs?.['flat/dom']?.rules,
      ...plugins?.['testing-library']?.configs?.['flat/react']?.rules,

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  } satisfies Linter.Config;
}
