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
import chalk from 'chalk';
import isCI from 'is-ci';
import readPkgUp from 'read-pkg-up';

import {
  Options,
  Preset,
  Prompt,
  Language,
  Environment,
  Framework,
  CI,
  Tool,
  ToolOptions,
  File,
  Script,
  PackageJson,
} from '../types/shared';
import * as logger from '../lib/logger';
import { enumToChoices } from '../lib/choices';
import { writeFile, addPackageScript, savePackageJson } from '../lib/files';
import { presets, presetChoices } from '../presets';
import { tools } from '../configs';

import { DEFAULT_OPTIONS } from './defaults';

export interface InitParams {
  configDir: string;
  presets?: Preset[];
  language?: Language;
  environments?: Environment[];
  frameworks?: Framework[];
  openSource?: boolean;
  ci?: CI;
  overwrite?: boolean;
  publish?: boolean;
  $0?: string;
  _?: string[];
}

export async function init({ $0, _, ...args }: InitParams): Promise<void> {
  let options: Options;

  if (!isCI) {
    const initialAnswers = (await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'presets',
        message: 'Which presets do you want to use?',
        choices: presetChoices,
        default: args.presets,
        validate: validatePresets,
        when: (): boolean => validatePresets(args.presets as Preset[]) !== true,
      },
    ])) as { presets: Preset[] };

    const prompts = {
      [Prompt.LANGUAGE]: {
        type: 'list',
        name: 'language',
        message: 'Which programming language does the project use?',
        choices: enumToChoices(Language),
        default: DEFAULT_OPTIONS.language,
        when: (): boolean => !args.language,
      },
      [Prompt.ENVIRONMENTS]: {
        type: 'checkbox',
        name: 'environments',
        message: 'Which environment(s) will the code run in?',
        choices: enumToChoices(Environment),
        when: (): boolean => isEmpty(args.environments),
      },
      [Prompt.FRAMEWORKS]: {
        type: 'checkbox',
        name: 'frameworks',
        message: 'Which framework(s) does the project use?',
        choices: enumToChoices(Framework),
        when: (): boolean => !args.frameworks,
      },
      [Prompt.CI]: {
        type: 'checkbox',
        name: 'ci',
        message: 'Which CI platform would you like to use?',
        choices: enumToChoices(CI),
        when: (): boolean => isEmpty(args.ci),
      },
      [Prompt.PUBLISH]: {
        type: 'confirm',
        name: 'publish',
        message: 'Would you like to publish your package to NPM?',
        default: DEFAULT_OPTIONS.publish,
        when: (): boolean => typeof args.publish === 'undefined',
      },
      [Prompt.OPEN_SOURCE]: {
        type: 'confirm',
        name: 'openSource',
        message: 'Do you plan to open-source this project?',
        default: DEFAULT_OPTIONS.openSource,
        when: (): boolean => typeof args.openSource === 'undefined',
      },
    };

    const additionalPrompts = getPromptsForPresets(
      initialAnswers.presets,
      prompts,
    );
    const additionalAnswers = await inquirer.prompt(additionalPrompts);

    options = { ...args, ...initialAnswers, ...additionalAnswers };
  } else {
    logger.empty();
    logger.info('Detected CI environment, falling back to default options.');

    options = { ...DEFAULT_OPTIONS, ...args };
  }

  const selectedTools = getToolsForPresets(options.presets);
  const files = getFilesForTools(options, selectedTools);
  const scripts = getScriptsForTools(options, selectedTools);

  logger.empty();

  const tasks = new Listr([
    {
      title: 'Writing config files',
      task: (): Listr<never> =>
        new Listr(
          files.map((file) => ({
            title: `Write "${file.name}"`,
            task: (ctx: never, task): Promise<unknown> =>
              writeFile(
                options.configDir,
                file.name,
                file.content,
                options.overwrite,
              ).catch(() => {
                logger.debug(`File "${file.name}" already exists`);
                if (isCI) {
                  logger.debug('In a CI environment, skipping...');
                  task.skip('Skipped');
                  return undefined;
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
                return listrInquirer(
                  [
                    {
                      type: 'confirm',
                      name: 'overwrite',
                      // eslint-disable-next-line max-len
                      message: `"${file.name}" already exists. Would you like to replace it?`,
                      default: false,
                    },
                  ],
                  ({ overwrite }: { overwrite: boolean }) => {
                    logger.debug(`Overwrite file: ${overwrite.toString()}`);
                    if (!overwrite) {
                      task.skip('Skipped');
                      return undefined;
                    }
                    return writeFile(
                      options.configDir,
                      file.name,
                      file.content,
                      true,
                    );
                  },
                );
              }),
          })),
        ),
    },
    {
      title: 'Adding scripts to package.json',
      // eslint-disable-next-line @typescript-eslint/require-await
      task: async (): Promise<Listr> => {
        type Context = {
          packagePath: string;
          packageJson: PackageJson;
        };
        return new Listr<Context>([
          {
            title: 'Read package.json',
            task: async (ctx): Promise<void> => {
              const pkg = await readPkgUp();

              if (!pkg) {
                throw new Error('Unable to find a "package.json" file.');
              }

              ctx.packagePath = pkg.path;
              ctx.packageJson = pkg.packageJson;
            },
          },
          ...scripts.map(({ name, command }) => ({
            title: `Add "${name}"`,
            task: (
              ctx: Context,
              task: ListrTaskWrapper<Context>,
            ): undefined | Promise<void> => {
              try {
                addPackageScript(
                  ctx.packageJson,
                  name,
                  command,
                  options.overwrite,
                );
                return undefined;
              } catch (error) {
                logger.debug(`Script "${name}" already exists`);
                if (isCI) {
                  logger.debug('In a CI environment, skipping...');
                  task.skip('Skipped');
                  return undefined;
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
                return listrInquirer(
                  [
                    {
                      type: 'confirm',
                      name: 'overwriteScript',
                      // eslint-disable-next-line max-len
                      message: `"${name}" already exists. Would you like to replace it?`,
                      default: false,
                    },
                  ],
                  ({ overwrite }: { overwrite: boolean }) => {
                    logger.debug(`Overwrite script: ${overwrite.toString()}`);
                    if (!overwrite) {
                      task.skip('Skipped');
                      return;
                    }
                    addPackageScript(ctx.packageJson, name, command, true);
                  },
                );
              }
            },
          })),
          {
            title: 'Save package.json',
            task: (ctx): Promise<void> =>
              savePackageJson(ctx.packagePath, ctx.packageJson),
          },
        ]);
      },
    },
  ]);

  tasks
    .run()
    .then(() => {
      logger.empty();
      logger.info('Added the following scripts to "package.json":');
      logger.empty();
      scripts.forEach(({ name, description }) => {
        logger.log(`  ${chalk.bold(`"${name}"`)}: ${description}`);
      });
    })
    .catch((error: string) => {
      logger.error(error);
      process.exit(1);
    });
}

function getPromptsForPresets(
  selectedPresets: Preset[],
  prompts: { [key in Prompt]: Question },
): Question[] {
  return flow(
    map((preset: Preset): Prompt[] => presets[preset].prompts),
    flatten,
    uniq,
    map((prompt: Prompt) => prompts[prompt]),
  )(selectedPresets);
}

function getToolsForPresets(selectedPresets: Preset[]): ToolOptions[] {
  return flow(
    map((preset: Preset): Tool[] => presets[preset].tools),
    flatten,
    uniq,
    map((tool: Tool) => tools[tool]),
  )(selectedPresets) as ToolOptions[];
}

function getFilesForTools(
  options: Options,
  selectedTools: ToolOptions[],
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
  selectedTools: ToolOptions[],
): Script[] {
  return selectedTools.reduce((allScripts: Script[], tool) => {
    if (tool.scripts) {
      const scriptsForTool = tool.scripts(options);
      return [...allScripts, ...scriptsForTool];
    }
    return allScripts;
  }, []);
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
