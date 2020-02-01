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

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import prettier from 'prettier';
import pkgUp from 'pkg-up';

import { Language, PackageJson } from '../types/shared';
import prettierConfig from '../prettier';

const writeFileAsync = promisify(fs.writeFile);

export function writeFile(
  configDir: string,
  filename: string,
  content: string,
  shouldOverwrite = false,
): Promise<void> {
  const formatOptions = prettierConfig({ language: Language.TYPESCRIPT });
  const fileContent = prettier.format(content, formatOptions);
  const targetDir = path.resolve(configDir);
  const filePath = path.resolve(targetDir, filename);
  const flag = shouldOverwrite ? 'w' : 'wx';

  return writeFileAsync(filePath, fileContent, { flag });
}

export async function findPackageJson(): Promise<string> {
  const packagePath = await pkgUp();
  if (!packagePath) {
    throw new Error('Unable to find a "package.json" file.');
  }
  return packagePath;
}

export function addPackageScript(
  packageJson: PackageJson,
  name: string,
  command: string,
  shouldOverwrite = false,
): PackageJson {
  const hasConflict = Boolean(packageJson.scripts[name]);
  if (hasConflict && !shouldOverwrite) {
    throw new Error(`A script with the name "${name}" already exists.`);
  }
  // eslint-disable-next-line no-param-reassign
  packageJson.scripts[name] = command;
  return packageJson;
}

export async function savePackageJson(packageJson: PackageJson): Promise<void> {
  const packagePath = await findPackageJson();
  const content = `${JSON.stringify(packageJson, null, 2)}\n`;
  return writeFileAsync(packagePath, content);
}
