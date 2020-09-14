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

import { dirname, resolve, join, relative } from 'path';
import { access, readFile } from 'fs';
import { promisify } from 'util';

import { isString } from 'lodash/fp';

import { PackageJson } from '../types/shared';
import { spawn } from '../lib/spawn';
import * as logger from '../lib/logger';

const readFileAsync = promisify(readFile);
const accessAsync = promisify(access);

function shouldStopRecursion(path: string): boolean {
  return !/^.+node_modules/.test(path);
}

async function resolveTo(path: string, name: string): Promise<string> {
  if (shouldStopRecursion(path)) {
    return '';
  }

  const packageJsonPath = join(path, name);

  try {
    await accessAsync(packageJsonPath);
    return packageJsonPath;
  } catch (err) {
    const parentPath = resolve(path, '..');
    return resolveTo(parentPath, name);
  }
}

async function getPackageJsonPath(
  name: string,
  useRelative = false,
): Promise<string> {
  const pathMain: string = require.resolve(name);
  const pathPackage: string = await resolveTo(pathMain, 'package.json');
  return useRelative ? relative(__dirname, pathPackage) : pathPackage;
}

function isRelativePath(path: string): boolean {
  const firstChar = path.split('')[0];
  return firstChar === '.';
}

async function loadJson(path: string): Promise<PackageJson> {
  const isRelative = isRelativePath(path);
  if (isRelative) {
    throw new TypeError(`Relative paths are not supported: ${path}`);
  }
  try {
    const data = await readFileAsync(path);
    return JSON.parse(data.toString()) as PackageJson;
  } catch (err) {
    throw new Error(`Path does not exist. ${path}`);
  }
}

async function resolveBinaryPath(
  name: string,
  useRelative = false,
): Promise<string | null> {
  try {
    // This could potentially break, if the name of a binary (name) is different
    // from the name of the package.
    const packageJsonPath = await getPackageJsonPath(name, useRelative);
    const { bin: packageBin } = await loadJson(packageJsonPath);

    if (!packageBin) {
      return null;
    }

    const binaryPath = isString(packageBin) ? packageBin : packageBin[name];

    if (!binaryPath) {
      return null;
    }

    return resolve(dirname(packageJsonPath), binaryPath);
  } catch (err) {
    return null;
  }
}

function getToolArguments(): string[] {
  // The standard 2 indicating node binary, executing script, and
  // the run command and the tool argument.
  const SKIP_COUNT = 4;
  const { argv } = process;
  return argv.slice(SKIP_COUNT);
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
    logger.error(err);
    process.exit(1);
  }
}
