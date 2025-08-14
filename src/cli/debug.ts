/**
 * Copyright 2024, SumUp Ltd.
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

import { isEmpty } from '../lib/helpers.js';
import * as logger from '../lib/logger.js';
import { getOptions } from '../lib/options.js';
import { isArray } from '../lib/type-check.js';

export function debug(): void {
  const options = getOptions();

  const stringifiedOptions = Object.entries(options).reduce(
    (acc, [key, value]) => {
      acc[key] = isArray(value) && !isEmpty(value) ? value.join(', ') : value;
      return acc;
    },
    {} as Record<string, unknown>,
  );

  logger.empty();
  logger.info('Detected configuration:');
  logger.table(stringifiedOptions);
}
