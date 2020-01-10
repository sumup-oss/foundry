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

import { enumToChoices } from './choices';

describe('prompts', () => {
  describe('enumToChoices', () => {
    it('should convert an enum to an array of options', () => {
      enum Fruit {
        MANGO = 'Mango',
        BANANA = 'Banana',
        KIWI = 'Kiwi',
      }
      const actual = enumToChoices(Fruit);
      const expected = ['Mango', 'Banana', 'Kiwi'];
      expect(actual).toEqual(expected);
    });
  });
});
