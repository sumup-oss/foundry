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

import { Handlebars } from './handlebars';

describe('Handlebars', () => {
  describe('includes', () => {
    const input = `
{{#includes foo "bar"}}
hello
{{/includes}}
`;

    it('should return the block content if the value is included in the array', () => {
      const template = Handlebars.compile(input);
      const actual = template({ foo: ['bar'] });
      const expected = 'hello';
      expect(actual).toInclude(expected);
    });

    it('should return nothin if the value is not included in the array', () => {
      const template = Handlebars.compile(input);
      const actual = template({ foo: ['bazz'] });
      const expected = 'hello';
      expect(actual).not.toInclude(expected);
    });
  });
});
