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

import { writeFile as fsWriteFile, mkdir as fsMkdir } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

import { Biome, Distribution } from '@biomejs/js-api';
import { readPackageUpSync } from 'read-package-up';

import type { PackageJson } from '../types/shared.js';

const writeFileAsync = promisify(fsWriteFile);
const mkdirAsync = promisify(fsMkdir);

export async function formatContent(
  fileName: string,
  content: string,
): Promise<string> {
  const biome = await Biome.create({
    distribution: Distribution.NODE,
  });

  // TODO: Import the Biome config once the projected has been migrated to ESM to support import assertions.
  biome.applyConfiguration({
    'javascript': {
      'formatter': {
        'quoteProperties': 'preserve',
        'quoteStyle': 'single',
      },
    },
  });

  const formatted = biome.formatContent(content, { filePath: fileName });
  return formatted.content;
}

export async function writeFile(
  configDir: string,
  fileName: string,
  content: string,
  shouldOverwrite = false,
): Promise<void> {
  const fileContent = await formatContent(fileName, content);
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
  const pkg = readPackageUpSync({ normalize: false });

  if (!pkg) {
    throw new Error('Unable to find a "package.json" file');
  }

  return pkg.packageJson;
}

export async function savePackageJson(
  packagePath: string,
  packageJson: PackageJson,
): Promise<void> {
  const content = `${JSON.stringify(packageJson, null, 2)}\n`;
  return writeFileAsync(packagePath, content, { flag: 'w' });
}
