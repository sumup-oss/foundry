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

import { existsSync } from 'fs';
import { resolve } from 'path';
import inquirer, { Question } from 'inquirer';
import { isEmpty, flow, map, flatten, uniq } from 'lodash/fp';

import { Options, Preset, Prompt, Language, Target } from '../types/shared';
import { enumToChoices } from '../lib/choices';
import { presets, presetChoices } from '../presets';

export interface InitParams {
  configDir: string;
  presets?: Preset[];
  language?: Language;
  target?: Target;
  publish?: boolean;
  $0?: string;
  _?: string[];
}

export function init(args: InitParams) {
  inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'presets',
        message: 'Which presets do you want to use?',
        choices: presetChoices,
        default: args.presets,
        validate: validatePresets,
        when: () => validatePresets(args.presets as Preset[]) !== true
      }
    ])
    .then((initialAnswers) => {
      const prompts = {
        language: {
          type: 'list',
          name: 'language',
          message: 'Which programming language does the project use?',
          choices: enumToChoices(Language),
          default: Language.TYPESCRIPT,
          when: () => !args.language
        },
        target: {
          type: 'list',
          name: 'target',
          message: 'Which platform does the project target?',
          choices: enumToChoices(Target),
          default: Target.BROWSER,
          when: () => !args.target
        },
        publish: {
          type: 'confirm',
          name: 'publish',
          message: 'Would you like to publish your package to NPM?',
          default: false,
          when: () => typeof args.publish === 'undefined'
        }
      };

      const additionalPrompts = mapPresetsToPrompts(
        initialAnswers.presets,
        prompts
      );

      inquirer.prompt(additionalPrompts).then((additionalAnswers) => {
        const answers: Options = { ...initialAnswers, ...additionalAnswers };
        const options: Options = mergeOptions(args, answers);

        // TODO: Generate config file for each tool and pass the relevant options.
        console.log(JSON.stringify(options, null, 2));
      });
    });
}

export function mergeOptions(args: InitParams, answers: Options): Options {
  const { $0, _, ...rest } = args;
  return { ...rest, ...answers };
}

export function mapPresetsToPrompts(
  selectedPresets: Preset[],
  prompts: { [key in Prompt]: Question }
): Question[] {
  return flow(
    map((preset: Preset): Prompt[] => presets[preset].prompts),
    flatten,
    uniq,
    map((prompt: Prompt) => prompts[prompt])
  )(selectedPresets);
}

export function validatePresets(selectedPresets: Preset[]): string | boolean {
  if (isEmpty(selectedPresets)) {
    return 'You must choose at least one preset.';
  }

  return true;
}

export function validatePath(path?: string): string | boolean {
  if (!path) {
    return false;
  }

  const resolvedPath = resolve(path);

  if (!existsSync(resolvedPath)) {
    return `The path "${resolvedPath}" doesn't exist. Please try another one.`;
  }

  return true;
}
