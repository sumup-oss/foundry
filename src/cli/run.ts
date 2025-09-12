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

import { dirname, resolve } from 'node:path';

import { readPackageUp } from 'read-package-up';

import * as logger from '../lib/logger.js';
import { spawn } from '../lib/spawn.js';

async function resolveBinaryPath(name: string): Promise<string | null> {
  try {
    // This could potentially break, if the name of a binary (name) is different
    // from the name of the package.
    const mainUrl = import.meta.resolve(name);
    const mainPath = mainUrl.replace(/^file:\/\//, '');
    const pkg = await readPackageUp({ cwd: mainPath });

    if (!pkg) {
      return null;
    }

    const binaryPath = pkg.packageJson.bin?.[name];

    if (!binaryPath) {
      return null;
    }

    return resolve(dirname(pkg.path), binaryPath);
  } catch (_error) {
    return null;
  }
}

function getToolArguments(): string[] {
  // The standard 2 indicating node binary, executing script, and
  // the run command and the tool argument.
  const skipCount = 4;
  const { argv } = process;
  return argv.slice(skipCount);
}

async function executeBinary(path: string, args: string[]): Promise<string> {
  return spawn(path, args, {
    stdio: 'inherit',
  });
}

export interface RunParams {
  argv: {
    _: string[];
  };
}

export async function run({ argv }: RunParams): Promise<void> {
  const { _: commandArgs } = argv;
  const [, tool] = commandArgs;
  const binPath = await resolveBinaryPath(tool);

  if (!binPath) {
    logger.error(`No executable found for ${tool}`);
    process.exit(1);
  }

  const binArgs = getToolArguments();

  try {
    await executeBinary(binPath, binArgs);
  } catch (err) {
    logger.error(
      `Executing the command "${binPath} ${binArgs.join(' ')}" failed`,
    );
    logger.error(err as string);
    process.exit(1);
  }
}
