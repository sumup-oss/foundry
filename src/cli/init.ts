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
import Listr, { ListrTaskWrapper } from 'listr';
import listrInquirer from 'listr-inquirer';
import { isEmpty, flow, map, flatten, uniq } from 'lodash/fp';

import {
  Options,
  Preset,
  Prompt,
  Language,
  Environment,
  Framework,
  Tool,
  ToolOptions,
  File,
  Scripts
} from '../types/shared';
import * as logger from '../lib/logger';
import { enumToChoices } from '../lib/choices';
import {
  writeFile,
  findPackageJson,
  addPackageScript,
  savePackageJson
} from '../lib/files';
import { presets, presetChoices } from '../presets';
import { tools } from '../configs';

export interface InitParams {
  configDir: string;
  presets?: Preset[];
  language?: Language;
  environments?: Environment[];
  frameworks?: Framework[];
  openSource?: boolean;
  publish?: boolean;
  $0?: string;
  _?: string[];
}

export async function init(args: InitParams) {
  const initialAnswers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'presets',
      message: 'Which presets do you want to use?',
      choices: presetChoices,
      default: args.presets,
      validate: validatePresets,
      when: () => validatePresets(args.presets as Preset[]) !== true
    }
  ]);

  const prompts = {
    [Prompt.LANGUAGE]: {
      type: 'list',
      name: 'language',
      message: 'Which programming language does the project use?',
      choices: enumToChoices(Language),
      default: Language.TYPESCRIPT,
      when: () => !args.language
    },
    [Prompt.ENVIRONMENTS]: {
      type: 'checkbox',
      name: 'environments',
      message: 'Which environment(s) will the code run in?',
      choices: enumToChoices(Environment),
      when: () => isEmpty(args.environments)
    },
    [Prompt.FRAMEWORKS]: {
      type: 'list',
      name: 'frameworks',
      message: 'Which framework(s) does the project use?',
      choices: enumToChoices(Framework),
      when: () => !args.frameworks
    },
    [Prompt.PUBLISH]: {
      type: 'confirm',
      name: 'publish',
      message: 'Would you like to publish your package to NPM?',
      default: false,
      when: () => typeof args.publish === 'undefined'
    },
    [Prompt.OPEN_SOURCE]: {
      type: 'confirm',
      name: 'openSource',
      message: 'Do you plan to open-source this project?',
      default: false,
      when: () => typeof args.openSource === 'undefined'
    }
  };

  const additionalPrompts = getPromptsForPresets(
    initialAnswers.presets,
    prompts
  );
  const additionalAnswers = await inquirer.prompt(additionalPrompts);

  const answers = { ...initialAnswers, ...additionalAnswers };
  const options = mergeOptions(args, answers);
  const tools = getToolsForPresets(options.presets);
  const files = getFilesForTools(options, tools);
  const scripts = getScriptsForTools(options, tools);

  // Add an empty line between the prompts and the tasks to make the output prettier ✨
  console.log('\n');

  const tasks = new Listr([
    {
      title: 'Write config files',
      task: () =>
        new Listr(
          files.map((file) => ({
            title: `Writing "${file.name}"...`,
            task: async (ctx: never, task) =>
              writeFile(options.configDir, file.name, file.content).catch(() =>
                listrInquirer(
                  [
                    {
                      type: 'confirm',
                      name: 'overwrite',
                      message: `"${file.name}" already exists. Would you like to replace it?`,
                      default: false
                    }
                  ],
                  (answers: { overwrite: boolean }) => {
                    if (!answers.overwrite) {
                      return task.skip('Skipped');
                    }
                    return writeFile(
                      options.configDir,
                      file.name,
                      file.content,
                      true
                    );
                  }
                )
              )
          }))
        )
    },
    {
      title: 'Add scripts to package.json',
      task: async () => {
        type Context = {
          packagePath: string;
          packageJson: {
            scripts: Scripts;
          };
        };
        return new Listr<Context>([
          {
            title: 'Read package.json...',
            task: async (ctx) => {
              ctx.packagePath = await findPackageJson();
              ctx.packageJson = require(ctx.packagePath);
            }
          },
          ...Object.entries(scripts).map(([key, value]) => ({
            title: `Adding "${key}" script to package.json...`,
            task: (ctx: Context, task: ListrTaskWrapper<Context>) => {
              try {
                return addPackageScript(ctx.packageJson, key, value);
              } catch (error) {
                return task.skip(error.message);
              }
            }
          })),
          {
            title: 'Saving package.json...',
            task: (ctx) => savePackageJson(ctx.packageJson)
          }
        ]);
      }
    }
  ]);

  tasks.run().catch((err) => {
    logger.error(err);
    process.exit(1);
  });
}

export function mergeOptions(
  args: InitParams,
  answers: Omit<Options, 'configDir'>
): Options {
  const { $0, _, ...rest } = args;
  return { ...rest, ...answers };
}

function getPromptsForPresets(
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

function getToolsForPresets(selectedPresets: Preset[]) {
  return flow(
    map((preset: Preset): Tool[] => presets[preset].tools),
    flatten,
    uniq,
    map((tool: Tool) => tools[tool])
  )(selectedPresets) as ToolOptions[];
}

function getFilesForTools(
  options: Options,
  selectedTools: ToolOptions[]
): File[] {
  return selectedTools.reduce((allFiles: File[], tool) => {
    if (tool.files) {
      const filesForTool = tool.files(options);
      allFiles.push(...filesForTool);
    }
    return allFiles;
  }, []);
}

function getScriptsForTools(
  options: Options,
  selectedTools: ToolOptions[]
): Scripts {
  return selectedTools.reduce((allScripts: Scripts, tool) => {
    if (tool.scripts) {
      const scriptsForTool = tool.scripts(options);
      return { ...allScripts, ...scriptsForTool };
    }
    return allScripts;
  }, {});
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
