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

import * as logger from '../lib/logger.js';

export function run(): void {
  logger.error(
    'The `run` command has been removed. Instead, call tools like Biome, ESLint, and Stylelint directly. Refer to the migration guide for details: https://github.com/sumup-oss/foundry/blob/main/MIGRATION.md#from-v8x-to-v9',
  );

  process.exit(1);
}
