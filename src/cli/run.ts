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

import { spawn } from '../lib/spawn';

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
  useRelative: boolean = false
): Promise<string> {
  const pathMain: string = require.resolve(name);
  const pathPackage: string = await resolveTo(pathMain, 'package.json');
  return useRelative ? relative(__dirname, pathPackage) : pathPackage;
}

function isRelativePath(path: string): boolean {
  const firstChar = path.split('')[0];
  return firstChar === '.';
}

async function loadJson(path: string) {
  const isRelative = isRelativePath(path);
  if (isRelative) {
    throw new TypeError(`Relative paths are not supported: ${path}`);
  }
  try {
    const data = await readFileAsync(path);
    return JSON.parse(data.toString());
  } catch (err) {
    return new Error(`Path does not exist. ${path}`);
  }
}

async function resolveBinaryPath(
  name: string,
  useRelative: boolean = false
): Promise<string | null> {
  try {
    // This could potentially break, if the name of a binary (name) is different
    // from the name of the package.
    const packageJsonPath = await getPackageJsonPath(name, useRelative);
    const { bin: packageBin } = await loadJson(packageJsonPath);
    const binaryPath = isString(packageBin) ? packageBin : packageBin[name];

    if (!binaryPath) {
      return null;
    }

    return resolve(dirname(packageJsonPath), binaryPath);
  } catch (err) {
    return null;
  }
}

function getToolArguments() {
  // The standard 2 indicating node binary, executing script, and
  // the run command and the tool argument.
  const SKIP_COUNT = 4;
  const { argv } = process;
  return argv.slice(SKIP_COUNT);
}

async function executeBinary(path: string, args: any) {
  return spawn(path, args, {
    stdio: 'inherit'
  });
}

export interface RunParams {
  argv: {
    _: string[];
  };
}

export async function run({ argv }: RunParams) {
  const { _: commandArgs } = argv;
  const [, tool] = commandArgs;
  const binPath = await resolveBinaryPath(tool);

  if (!binPath) {
    // eslint-disable-next-line no-console
    console.error(`No executable found for ${tool}`);
    process.exit(1);
  }

  const binArgs = getToolArguments();

  try {
    await executeBinary(binPath, binArgs);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `Executing the command "${binPath} ${binArgs.join(' ')}" failed`,
      err
    );
    process.exit(1);
  }
}
