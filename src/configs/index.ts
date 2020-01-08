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

import * as eslint from './eslint';
import * as prettier from './prettier';
import * as plop from './plop';
import * as lintStaged from './lint-staged';
import * as husky from './husky';
import * as semanticRelease from './semantic-release';

export const SUPPORTED_CONFIGS = [
  'eslint',
  'prettier',
  'plop',
  'husky',
  'lint-staged',
  'semantic-release'
];

export { eslint, prettier, plop, lintStaged, husky, semanticRelease };
