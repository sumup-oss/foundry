/**
 * Copyright 2020, SumUp Ltd.
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

import { Preset } from '../types/shared';

import { validatePresets, validatePath } from './init';

describe('init command', () => {
  describe('validatePresets', () => {
    it('should return an error message when no presets were selected', () => {
      const presets: Preset[] = [];
      const actual = validatePresets(presets);
      expect(typeof actual).toBe('string');
    });

    it('should return true otherwise', () => {
      const presets = [Preset.LINT];
      const actual = validatePresets(presets);
      expect(actual).toBeTruthy();
    });
  });

  describe('validatePath', () => {
    it('should return false if no path was passed', () => {
      const actual = validatePath();
      expect(actual).toBeFalsy();
    });

    it('should return an error if the path is not valid', () => {
      const path = 'foo/bar';
      const actual = validatePath(path);
      expect(typeof actual).toBe('string');
    });

    it('should return true if the path is valid', () => {
      const path = '.';
      const actual = validatePath(path);
      expect(actual).toBeTruthy();
    });
  });
});
