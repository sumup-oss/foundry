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

import { Tool, ToolOptions } from '../types/shared';

import * as eslint from './eslint';
import * as husky from './husky';
import * as lintStaged from './lint-staged';
import * as prettier from './prettier';
import * as semanticRelease from './semantic-release';
import * as ci from './ci';

export const tools: { [key in Tool]?: ToolOptions } = {
  [Tool.ESLINT]: eslint,
  [Tool.HUSKY]: husky,
  [Tool.LINT_STAGED]: lintStaged,
  [Tool.PRETTIER]: prettier,
  [Tool.SEMANTIC_RELEASE]: semanticRelease,
  [Tool.CI]: ci,
};
