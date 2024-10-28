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

import { describe, expect, it, vi, type Mock } from 'vitest';

import { Plugin } from '../../types/shared';
import { getOptions as getOptionsMock } from '../../lib/options';

import { customizeConfig, createConfig } from './config';

vi.mock('../../lib/options', () => ({
  getOptions: vi.fn(() => ({})),
}));

const getOptions = getOptionsMock as Mock;

describe('stylelint', () => {
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

  describe('with overrides', () => {
    it('should merge with the default config', () => {
      const overrides = {
        extends: ['stylelint-config-styled-components'],
      };
      const actual = createConfig(overrides);
      expect(actual).toEqual(
        expect.objectContaining({
          extends: expect.arrayContaining([
            'stylelint-config-standard',
            'stylelint-config-styled-components',
          ]),
        }),
      );
    });
  });

  describe('with options', () => {
    it("should return a config for { plugins: ['Circuit UI'] }", () => {
      getOptions.mockReturnValue({ plugins: [Plugin.CIRCUIT_UI] });
      const actual = createConfig();
      expect(actual).toMatchSnapshot();
    });

    it("should return a config for { plugins: ['Circuit UI (OSS scope)'] }", () => {
      getOptions.mockReturnValue({ plugins: [Plugin.CIRCUIT_UI_OSS] });
      const actual = createConfig();
      expect(actual).toMatchSnapshot();
    });
  });
});
