/**
 * Copyright 2020, SumUp Ltd.
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

import { writeFile as fsWriteFile, mkdir as fsMkdir } from 'fs';
import path from 'path';
import { promisify } from 'util';

import { omit } from 'lodash/fp';
import { format, Options as PrettierConfig } from 'prettier';
import readPkgUp from 'read-pkg-up';

import { PackageJson } from '../types/shared';
import prettierConfig from '../prettier';

const writeFileAsync = promisify(fsWriteFile);
const mkdirAsync = promisify(fsMkdir);

export function formatContent(fileName: string, content: string): string {
  const configMap: { [key: string]: PrettierConfig } = {
    '.js': prettierConfig({ parser: 'babel' }),
    '.json': { parser: 'json' },
    '.yaml': { parser: 'yaml' },
  };

  const extension = path.extname(fileName);
  const formatConfig = configMap[extension];

  if (!formatConfig) {
    return content;
  }

  return format(content, formatConfig);
}

export async function writeFile(
  configDir: string,
  fileName: string,
  content: string,
  shouldOverwrite = false,
): Promise<void> {
  const fileContent = formatContent(fileName, content);
  const filePath = path.join(configDir, fileName);
  const directory = path.dirname(filePath);
  if (directory && directory !== '.') {
    await mkdirAsync(directory, { recursive: true });
  }
  const flag = shouldOverwrite ? 'w' : 'wx';

  return writeFileAsync(filePath, fileContent, { flag });
}

export function addPackageScript(
  packageJson: PackageJson,
  name: string,
  command: string,
  shouldOverwrite = false,
): PackageJson {
  if (!packageJson.scripts) {
    // eslint-disable-next-line no-param-reassign
    packageJson.scripts = { [name]: command };
    return packageJson;
  }

  const hasConflict = Boolean(packageJson.scripts[name]);
  if (hasConflict && !shouldOverwrite) {
    throw new Error(`A script with the name "${name}" already exists.`);
  }
  // eslint-disable-next-line no-param-reassign
  packageJson.scripts[name] = command;
  return packageJson;
}

export function readPackageJson(): PackageJson {
  const pkg = readPkgUp.sync();

  if (!pkg) {
    throw new Error('Unable to find a "package.json" file');
  }

  return pkg.packageJson;
}

export async function savePackageJson(
  packagePath: string,
  packageJson: PackageJson,
): Promise<void> {
  // This property is added by `read-pkg-up`
  const sanitizedPackageJson = omit('_id', packageJson);
  const content = `${JSON.stringify(sanitizedPackageJson, null, 2)}\n`;
  return writeFileAsync(packagePath, content, { flag: 'w' });
}
