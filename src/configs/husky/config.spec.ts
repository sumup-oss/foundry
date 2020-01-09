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

import { config } from './config';

describe('husky', () => {
  describe('with options', () => {
    it('should return a config', () => {
      const actual = config();
      expect(actual).toMatchInlineSnapshot(`
              Object {
                "hooks": Object {
                  "pre-commit": "foundry run lint-staged",
                },
              }
          `);
    });
  });

  describe('with overrides', () => {
    it('should override the default config', () => {
      const options = undefined;
      const overrides = {
        hooks: {
          'pre-commit': 'custom command',
        },
      };
      const actual = config(options, overrides);
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "hooks": Object {
            "pre-commit": "custom command",
          },
        }
      `);
    });
  });
});
