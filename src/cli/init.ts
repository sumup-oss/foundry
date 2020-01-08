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
import inquirer from 'inquirer';
import { isEmpty } from 'lodash/fp';

import { Options, Preset, Language, Target } from '../types/shared';
import presets from '../presets';

export interface InitParams {
  presets?: Preset[];
  language?: Language;
  target?: Target;
  publish?: boolean;
  configDir?: string;
  $0?: string;
  _?: string[];
}

export function init(args: InitParams) {
  const questions = [
    {
      type: 'checkbox',
      name: 'presets',
      message: 'Which presets do you want to use?',
      choices: presets,
      default: args.presets,
      validate: validatePresets,
      when: validatePresets(args.presets as Preset[]) !== true
    },
    {
      type: 'list',
      name: 'language',
      message: 'Which programming language does the project use?',
      choices: enumToChoices(Language),
      when: (answers: Options) => {
        const options = mergeOptions(args, answers);
        return (
          typeof options.language === 'undefined' &&
          whenPresetsSelected(options, [Preset.LINT, Preset.TEMPLATES])
        );
      }
    },
    {
      type: 'list',
      name: 'target',
      message: 'Which platform does the project target?',
      choices: enumToChoices(Target),
      when: (answers: Options) => {
        const options = mergeOptions(args, answers);
        return (
          typeof options.target === 'undefined' &&
          whenPresetsSelected(options, [
            Preset.LINT,
            Preset.TEMPLATES,
            Preset.RELEASE
          ])
        );
      }
    },
    {
      type: 'confirm',
      name: 'publish',
      message: 'Would you like to publish your package to NPM?',
      default: false,
      when: (answers: Options) => {
        const options = mergeOptions(args, answers);
        return (
          typeof options.publish === 'undefined' &&
          whenPresetsSelected(options, [Preset.RELEASE])
        );
      }
    },
    {
      type: 'input',
      name: 'configDir',
      message: 'Where should the config files be stored?',
      default: args.configDir || '.',
      validate: validatePath,
      when: validatePath(args.configDir as string) !== true
    }
  ];

  inquirer.prompt(questions).then((answers: Options) => {
    const options: Options = mergeOptions(args, answers);
    console.log(JSON.stringify(options, null, 2));

    // TODO: Generate config file for each tool and pass the relevant options.
  });
}

export function enumToChoices(enums: { [key: string]: string }): string[] {
  return Object.values(enums);
}

export function mergeOptions(args: InitParams, answers: Options): Options {
  const { $0, _, ...rest } = args;
  return { ...rest, ...answers };
}

export function whenPresetsSelected(
  options: Options,
  presets: Preset[]
): boolean {
  return presets.some((preset) => options.presets.includes(preset));
}

export function validatePresets(presets: Preset[]): string | boolean {
  if (isEmpty(presets)) {
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
