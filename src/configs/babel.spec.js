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

import { withoutPreset, overwriteEnvPreset } from './babel';

describe('The babel configuration module', () => {
  describe('withoutPreset()', () => {
    it('should return a function to remove a given preset from a babel configuration', () => {
      const fn = withoutPreset('@babel/preset-env');
      expect(fn).toEqual(expect.any(Function));
    });

    describe('the preset removal function', () => {
      it('should remove a preset with no options', () => {
        const presets = ['some-preset'];
        const removeSomePreset = withoutPreset('some-preset');
        const actual = removeSomePreset(presets);
        expect(actual).toBeEmpty();
      });

      it('should remove a preset with options', () => {
        const presets = [['some-preset', { option: true }]];
        const removeSomePreset = withoutPreset('some-preset');
        const actual = removeSomePreset(presets);
        expect(actual).toBeEmpty();
      });
    });
  });

  describe('overwriteEnvPreset()', () => {
    it('should overwrite the env preset with a given replacement', () => {
      const config = {
        presets: [['@babel/preset-env', { option: true }]]
      };
      const newEnvPreset = ['@babel/preset-env', { option: false }];
      const envPresetConfig = {
        presets: [newEnvPreset]
      };
      const actual = overwriteEnvPreset(config, envPresetConfig);
      expect(actual.presets[0][1]).toEqual({ option: false });
    });
  });
});
