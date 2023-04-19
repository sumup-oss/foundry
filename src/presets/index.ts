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

import chalk from 'chalk';

import { Preset, Tool, Prompt } from '../types/shared';

type PresetConfig = {
  name: string;
  value: Preset;
  short: string;
  tools: Tool[];
  prompts?: Prompt[];
};

const lint: PresetConfig = {
  name: formatName(
    'Lint',
    'Check code for syntax errors and format it automatically',
  ),
  value: Preset.LINT,
  short: 'Lint',
  tools: [Tool.ESLINT, Tool.PRETTIER, Tool.HUSKY, Tool.LINT_STAGED],
  prompts: [Prompt.OPEN_SOURCE],
};

function formatName(name: string, description: string): string {
  return [`${chalk.bold(name)}:`, description].join(' ');
}

export const presets = { lint };
