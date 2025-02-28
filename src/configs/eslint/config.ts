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

import type { ESLint, Linter } from 'eslint';

import { getOptions } from '../../lib/options.js';

import { browser } from './browser.js';
import { emotion } from './emotion.js';
import { ignore } from './ignore.js';
import { javascript } from './javascript.js';
import { next } from './next.js';
import { node } from './node.js';
import { openSource } from './open-source.js';
import { react } from './react.js';
import { tests } from './tests.js';
import { typescript } from './typescript.js';

// TODO:
export function createConfig(
  config: { plugins: Record<string, ESLint.Plugin> },
  overrides: Linter.Config = {},
): Linter.Config[] {
  const options = getOptions();

  // TODO: Validate plugins, warn on missing ones
  console.info(options, config);

  return [overrides, javascript, typescript];
}

export const configs = {
  browser,
  emotion,
  ignore,
  javascript,
  tests,
  next,
  node,
  openSource,
  react,
  typescript,
};
