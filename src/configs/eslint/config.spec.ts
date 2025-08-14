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

import { describe, expect, it, type Mock, vi } from 'vitest';

import { getAllChoiceCombinations } from '../../lib/choices.js';
import { getOptions as getOptionsMock } from '../../lib/options.js';
import {
  Environment,
  Framework,
  Language,
  Plugin,
} from '../../types/shared.js';

import {
  createConfig,
  customizeConfig,
  getFileGlobsForWorkspaces,
} from './config.js';

vi.mock('process', () => ({
  cwd: (): string => '/project/dir',
}));

vi.mock('../../lib/options', () => ({
  getOptions: vi.fn(() => ({})),
}));

const getOptions = getOptionsMock as Mock;

describe('eslint', () => {
  describe('customizeConfig', () => {
    it('should merge the presets of the base config with the custom config', () => {
      const baseConfig = {
        extends: ['some-preset'],
        rules: {
          'some-custom-rule': false,
        },
      };
      const newConfig = {
        extends: ['other-preset'],
      };
      const actual = customizeConfig(baseConfig, newConfig);
      expect(actual).toEqual(
        expect.objectContaining({
          extends: ['some-preset', 'other-preset'],
          rules: {
            'some-custom-rule': false,
          },
        }),
      );
    });

    it('should merge the extends of the base config with the custom config', () => {
      const base = {
        extends: ['airbnb-base', 'plugin:prettier/recommended'],
      };
      const custom = {
        extends: ['plugin:react/recommended'],
      };
      const expected = {
        extends: [
          'airbnb-base',
          'plugin:prettier/recommended',
          'plugin:react/recommended',
        ],
      };
      const actual = customizeConfig(base, custom);
      expect(actual).toEqual(expected);
    });

    it('should merge the rules of the base config with the custom config', () => {
      const base = {
        rules: {
          'no-use-before-define': ['error', { functions: false }],
          'curly': ['error', 'all'],
          'no-underscore-dangle': [
            'error',
            { allow: ['__DEV__', '__PRODUCTION__'] },
          ],
        },
      };
      const custom = {
        rules: {
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',
          'no-underscore-dangle': ['warning', { allow: ['__resourcePath'] }],
        },
      };
      const expected = {
        rules: {
          'no-use-before-define': ['error', { functions: false }],
          'curly': ['error', 'all'],
          'no-underscore-dangle': ['warning', { allow: ['__resourcePath'] }],
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',
        },
      };
      const actual = customizeConfig(base, custom);
      expect(actual).toEqual(expected);
    });
  });

  describe('getFileGlobsForWorkspaces', () => {
    const files = ['e2e/**/*', '*.spec.*'];

    it('should return the file globs unchanged when the workspaces are null', () => {
      const workspaces = null;
      const actual = getFileGlobsForWorkspaces(workspaces, files);
      expect(actual).toEqual(files);
    });

    it('should return the file globs raw and prefixed with each workspace', () => {
      const workspaces = ['packages/*', 'docs'];
      const actual = getFileGlobsForWorkspaces(workspaces, files);
      expect(actual).toEqual([
        'e2e/**/*',
        '*.spec.*',
        'packages/*/e2e/**/*',
        'packages/*/*.spec.*',
        'docs/e2e/**/*',
        'docs/*.spec.*',
      ]);
    });
  });
  // biome-ignore lint/suspicious/noSkippedTests: TODO: Replace with non-snapshot tests
  describe.skip('with options', () => {
    const matrix = getAllChoiceCombinations({
      language: Language,
      environments: [Environment],
      frameworks: [Framework],
      plugins: [Plugin],
    });

    it.each(matrix)('should return a config for %o', (options) => {
      getOptions.mockReturnValue(options);
      const actual = createConfig();
      expect(actual).toMatchSnapshot();
    });

    it('should return a config with a copyright notice', () => {
      const options = { openSource: true, frameworks: [] };
      getOptions.mockReturnValue(options);
      const actual = createConfig();
      expect(actual).toMatchSnapshot();
    });
  });

  it('should merge with the default config', () => {
    const overrides = {
      extends: ['prettier/react'],
    };
    const actual = createConfig(overrides);
    expect(actual).toEqual(
      expect.objectContaining({
        extends: expect.arrayContaining([
          'eslint:recommended',
          'prettier/react',
        ]),
      }),
    );
  });
});
