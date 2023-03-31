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

import Listr from 'listr';
import listrInquirer from 'listr-inquirer';
import readPkgUp from 'read-pkg-up';
import semver from 'semver';

import type { Dependencies, PackageJson, PluginConfig } from '../types/shared';
import * as logger from '../lib/logger';
import { getPlugins } from '../configs/eslint/plugins';
import { getDependencyVersion } from '../lib/package-json';

export interface InitParams {
  configDir: string;
  overwrite?: boolean;
}

export async function init(params: InitParams): Promise<void> {
  // Write config files
  // Determine and install dependencies
  // - [ ] add optionalPeerDependencies
  console.log(params);

  const tasks = new Listr([
    {
      title: 'Analyzing the project',
      task: async (ctx): Promise<Listr> => {
        const pkg = await readPkgUp();

        if (!pkg) {
          throw new Error('Unable to find a "package.json" file.');
        }

        const { packageJson } = pkg;

        // Default dependencies & config
        // prettier
        // import
        // json?

        const plugins = getPlugins(packageJson);

        const tasks = tmp(packageJson, plugins);

        ctx.plugins = plugins;
        ctx.packagePath = pkg.path;
        ctx.packageJson = pkg.packageJson;

        return new Listr(
          tasks.map((task) => {
            switch (task.type) {
              case 'info': {
                return {
                  title: 'hello',
                  task: () => {},
                };
              }
              case 'upgrade': {
                return {
                  title: 'hello',
                  task: () =>
                    listrInquirer(
                      [
                        {
                          type: 'confirm',
                          name: 'upgrade',
                          message: `"${task.name}@${task.installedVersion}" is already installed. Would you like to upgrade it?`,
                          default: true,
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
                    ),
                };
              }
              default: {
                return {
                  title: 'hello',
                  task: () => {},
                };
              }
            }
          }),
        );
      },
    },
    {
      title: 'Installing packages',
      task: () => {
        // Detect package manager
        // Install all packages at once
      },
    },
    {
      title: 'Writing config files',
      task: () => {},
    },
    {
      title: 'Adding scripts',
      task: () => {},
    },
  ]);

  await tasks.run().catch((error: string) => {
    logger.error(error);
    process.exit(1);
  });
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

type Task =
  | {
      type: 'install';
      name: string;
      range: string;
    }
  | {
      type: 'info';
      name: string;
      range: string;
      installedVersion: string;
    }
  | {
      type: 'upgrade';
      name: string;
      range: string;
      installedVersion: string;
    }
  | {
      type: 'unsupported';
      name: string;
      range: string;
    };

// TODO: Extract into separate file, add tests
function tmp(packageJson: PackageJson, plugins: PluginConfig[]): Task[] {
  const devDependencies = plugins.reduce((deps, { devDependencies }) => {
    return Object.assign(deps, devDependencies);
  }, {} as Dependencies);

  const tasks: Task[] = Object.entries(devDependencies).map(([name, range]) => {
    const installedVersion = getDependencyVersion(packageJson, name);

    if (!installedVersion) {
      return { type: 'install', name, range };
    }

    if (semver.satisfies(installedVersion, range)) {
      return { type: 'info', name, range, installedVersion };
    }

    if (semver.lt(installedVersion, range)) {
      return { type: 'upgrade', name, range, installedVersion };
    }

    return { type: 'unsupported', name, range };
  });

  return tasks;
}
