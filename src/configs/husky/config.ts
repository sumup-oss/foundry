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

import { merge } from 'lodash/fp';

import { Options } from '../../types/shared';

export type HuskyOptions = Partial<Options>;

interface HuskyConfig {
  skipCI?: boolean;
  hooks?: { [key: string]: string };
}

export const base: HuskyConfig = {
  hooks: {
    'pre-commit': 'foundry run lint-staged',
  },
};

export function config(
  options: HuskyOptions = {},
  overrides: HuskyConfig = {},
): HuskyConfig {
  return merge(base, overrides);
}
