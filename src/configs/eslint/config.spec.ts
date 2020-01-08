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

import { Target } from '../../types/shared';
import { getAllChoiceCombinations } from '../../lib/choices';

import { overwritePresets, config } from './config';

describe('eslint', () => {
  describe('overwritePresets', () => {
    it('should merge two configurations overwriting existing presets', () => {
      const config = {
        extends: ['some-preset'],
        rules: {
          'some-custom-rule': false
        }
      };
      const newConfig = {
        extends: ['other-preset']
      };
      const actual = overwritePresets(config, newConfig);
      expect(actual).toEqual(
        expect.objectContaining({
          extends: ['other-preset'],
          rules: {
            'some-custom-rule': false
          }
        })
      );
    });

    it('should overwrite the extends of the base config with the custom config', () => {
      const base = {
        extends: [
          'airbnb-base',
          'plugin:jest/recommended',
          'plugin:prettier/recommended'
        ]
      };
      const custom = {
        extends: [
          'airbnb-base',
          'plugin:react/recommended',
          'plugin:jsx-a11y/recommended',
          'prettier/react'
        ]
      };
      const expected = custom;
      const actual = overwritePresets(base, custom);
      expect(actual).toEqual(expected);
    });

    it('should merge the rules of the base config with the custom config', () => {
      const base = {
        rules: {
          'no-use-before-define': ['error', { functions: false }],
          'curly': ['error', 'all'],
          'no-underscore-dangle': [
            'error',
            { allow: ['__DEV__', '__PRODUCTION__'] }
          ]
        }
      };
      const custom = {
        rules: {
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',
          'no-underscore-dangle': ['warning', { allow: ['__resourcePath'] }]
        }
      };
      const expected = {
        rules: {
          'no-use-before-define': ['error', { functions: false }],
          'curly': ['error', 'all'],
          'no-underscore-dangle': ['warning', { allow: ['__resourcePath'] }],
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn'
        }
      };
      const actual = overwritePresets(base, custom);
      expect(actual).toEqual(expected);
    });
  });

  describe('with options', () => {
    const matrix = getAllChoiceCombinations({ target: Target });

    it.each(matrix)('should return a config for %o', (options) => {
      const actual = config(options);
      expect(actual).toMatchSnapshot();
    });
  });

  describe('with overrides', () => {
    it('should override the default config', () => {
      const options = undefined;
      const overrides = {
        extends: ['prettier/react']
      };
      const actual = config(options, overrides);
      expect(actual).toEqual(
        expect.objectContaining({
          extends: ['prettier/react']
        })
      );
    });
  });
});
