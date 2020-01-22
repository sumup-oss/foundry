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

import { pick } from 'lodash/fp';

import { Options, File } from '../../types/shared';

export const files = (options: Options): File[] => [
  {
    name: 'lint-staged.config.js',
    content: `
    module.exports = require('@sumup/foundry/lint-staged')(${JSON.stringify(
      pick(['language'], options),
    )})`,
  },
];
