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
import { flow, map, flatten, uniq } from 'lodash/fp';
import chalk from 'chalk';
import isCI from 'is-ci';
import readPkgUp from 'read-pkg-up';

import {
  InitOptions,
  Preset,
  Prompt,
  Tool,
  ToolOptions,
  File,
  Script,
  PackageJson,
} from '../types/shared';
import * as logger from '../lib/logger';
import { writeFile, addPackageScript, savePackageJson } from '../lib/files';
import { presets } from '../presets';
import { tools } from '../configs';

import { DEFAULT_OPTIONS } from './defaults';

export interface InitParams {
  configDir: string;
  openSource?: boolean;
  publish?: boolean;
  overwrite?: boolean;
  $0?: string;
  _?: string[];
}

export async function init({ $0, _, ...args }: InitParams): Promise<void> {
  let options: InitOptions;

  const selectedPresets = [Preset.LINT];

  if (!isCI) {
    const prompts = {
      [Prompt.OPEN_SOURCE]: {
        type: 'confirm',
        name: 'openSource',
        message: 'Do you intend to open-source this project?',
        default: DEFAULT_OPTIONS.openSource,
        when: (): boolean => typeof args.openSource === 'undefined',
      },
    };

    const additionalPrompts = getPromptsForPresets(selectedPresets, prompts);
    const additionalAnswers = await inquirer.prompt(additionalPrompts);

    options = { ...args, ...additionalAnswers };
  } else {
    logger.empty();
    logger.info('Detected CI environment, falling back to default options.');

    options = { ...DEFAULT_OPTIONS, ...args };
  }

  const selectedTools = getToolsForPresets(selectedPresets);
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
      title: 'Updating package.json',
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
          {
            title: 'Add license field',
            enabled: () => options.openSource === true,
            task: (ctx): void => {
              ctx.packageJson.license = 'Apache-2.0';
            },
          },
          ...scripts.map(({ name, command }) => ({
            title: `Add "${name}" script`,
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
                  ({ overwriteScript }: { overwriteScript: boolean }) => {
                    logger.debug(
                      `Overwrite script: ${overwriteScript.toString()}`,
                    );
                    if (!overwriteScript) {
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
    map((preset: Preset) => presets[preset].prompts || []),
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
  )(selectedPresets);
}

function getFilesForTools(
  options: InitOptions,
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
  options: InitOptions,
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
