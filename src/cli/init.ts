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

import chalk from 'chalk';
import inquirer from 'inquirer';
import isCI from 'is-ci';
import Listr, { type ListrTaskWrapper } from 'listr';
import listrInquirer from 'listr-inquirer';
import { readPackageUp } from 'read-package-up';

import * as tools from '../configs/index.js';
import { addPackageScript, savePackageJson, writeFile } from '../lib/files.js';
import * as logger from '../lib/logger.js';
import type {
  File,
  InitOptions,
  PackageJson,
  ToolOptions,
} from '../types/shared.js';

import { DEFAULT_OPTIONS } from './defaults.js';

export interface InitParams {
  configDir: string;
  openSource?: boolean;
  overwrite?: boolean;
  $0?: string;
  _?: string[];
}

export async function init({ $0, _, ...args }: InitParams): Promise<void> {
  let options: InitOptions;

  if (isCI) {
    logger.empty();
    logger.info('Detected CI environment, falling back to default options.');

    options = { ...DEFAULT_OPTIONS, ...args };
  } else {
    const answers = await inquirer.prompt({
      type: 'confirm',
      name: 'openSource',
      message: 'Do you intend to open-source this project?',
      default: DEFAULT_OPTIONS.openSource,
      when: (): boolean => typeof args.openSource === 'undefined',
    });

    options = { ...args, ...answers };
  }

  const selectedTools: Record<string, ToolOptions> = tools;

  const files = getFilesForTools(options, selectedTools);

  const scripts = [
    {
      name: 'lint',
      command:
        'biome check --diagnostic-level=error && eslint . --quiet --concurrency=auto',
      description: 'check files for problematic patterns and report them',
    },
    {
      name: 'lint:fix',
      command:
        'biome check --write --diagnostic-level=error && eslint . --fix --quiet --concurrency=auto',
      description: 'same as `lint` and also try to fix the issues',
    },
    {
      name: 'lint:ci',
      command:
        'biome ci --diagnostic-level=error && eslint . --quiet --concurrency=auto',
      description: 'lint files in a continuous integration workflow',
    },
    {
      name: 'lint:css',
      command: "stylelint '**/*.css' --quiet",
      description: 'check CSS files for problematic patterns and report them',
    },
  ];

  logger.empty();

  const tasks = new Listr([
    {
      title: 'Writing config files',
      task: (): Listr<never> =>
        new Listr(
          files.map((file) => ({
            title: `Write "${file.name}"`,
            task: (_ctx: never, task): Promise<unknown> =>
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
      task: async (): Promise<Listr> => {
        type Context = {
          packagePath: string;
          packageJson: PackageJson;
        };
        return new Listr<Context>([
          {
            title: 'Read package.json',
            task: async (ctx): Promise<void> => {
              const pkg = await readPackageUp({ normalize: false });

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
              } catch (_error) {
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

function getFilesForTools(
  options: InitOptions,
  selectedTools: Record<string, ToolOptions>,
): File[] {
  return Object.values(selectedTools).reduce((allFiles: File[], tool) => {
    if (tool.files) {
      const filesForTool = tool.files(options);
      allFiles.push(...filesForTool);
    }
    return allFiles;
  }, []);
}
