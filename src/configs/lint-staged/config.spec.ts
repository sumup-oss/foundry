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

import { Language } from '../../types/shared';
import { getAllChoiceCombinations } from '../../lib/choices';

import { config } from './config';

describe('lint-staged', () => {
  describe('with options', () => {
    const matrix = getAllChoiceCombinations({ language: Language });

    it.each(matrix)('should return a config for %o', (options) => {
      const actual = config(options);
      expect(actual).toMatchSnapshot();
    });
  });

  describe('with overrides', () => {
    it('should override the default config', () => {
      const options = undefined;
      const overrides = {
        '*.jsx?': ['custom command'],
      };
      const actual = config(options, overrides);
      expect(actual).toMatchSnapshot();
    });
  });
});
