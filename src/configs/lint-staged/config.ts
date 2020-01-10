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

import { Language, Options } from '../../types/shared';

type LintStagedOptions = Pick<Options, 'language'>;
type LinterCommand = string | string[];
type LinterFn = (filenames: string[]) => LinterCommand;

interface LintStagedConfig {
  [key: string]: LinterCommand | LinterFn;
}

export const javascript: LintStagedConfig = {
  '*.jsx?': ['foundry run eslint --fix']
};

export const typescript: LintStagedConfig = {
  '*.jsx?': ['foundry run eslint --fix'],
  '*.tsx?': () => 'tsc -p tsconfig.json --noEmit'
};

const LANGUAGES = {
  [Language.JAVASCRIPT]: javascript,
  [Language.TYPESCRIPT]: typescript
};

export function config(
  options: LintStagedOptions = {},
  overrides: LintStagedConfig = {}
) {
  const { language = Language.JAVASCRIPT } = options;
  const baseConfig = LANGUAGES[language];
  return { ...baseConfig, ...overrides };
}
