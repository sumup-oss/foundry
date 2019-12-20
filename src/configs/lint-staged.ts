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

type LinterCommand = string | string[];
type LinterFn = (filenames: string[]) => LinterCommand;

interface LintStagedConfig {
  linters: {
    [key: string]: LinterCommand | LinterFn;
  };
}

// eslint-disable-next-line import/prefer-default-export
export const base: LintStagedConfig = {
  linters: {
    '*.jsx?': ['foundry run eslint --fix']
  }
};

export const typescript: LintStagedConfig = {
  linters: {
    '*.jsx?': ['foundry run eslint --fix'],
    '*.tsx?': () => 'tsc -p tsconfig.json --noEmit'
  }
};
