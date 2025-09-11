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

import { describe, expect, it } from 'vitest';

import {
  Environment,
  Framework,
  Language,
  Plugin,
} from '../../types/shared.js';

import { files } from './index.js';

describe('eslint', () => {
  describe('files', () => {
    it('should match the snapshot for basic options', () => {
      const options = { configDir: '.' };
      const actual = files(options);
      expect(actual).toMatchSnapshot();
    });

    it('should match the snapshot for complete options', () => {
      const options = {
        configDir: '.',
        language: Language.TypeScript,
        environments: [Environment.Browser, Environment.Node],
        frameworks: [Framework.Nextjs, Framework.React],
        plugins: [Plugin.Jest, Plugin.Storybook],
        openSource: true,
      };
      const actual = files(options);
      expect(actual).toMatchSnapshot();
    });
  });
});
