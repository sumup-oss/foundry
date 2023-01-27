/**
 * Copyright 2023, SumUp Ltd.
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

import { omit } from 'lodash/fp';
import readPkgUp from 'read-pkg-up';

import { PackageJson } from '../types/shared';

import { writeFileAsync } from './files';

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

  const hasConflict = packageJson.scripts[name] !== command;
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

export async function writePackageJson(
  packagePath: string,
  packageJson: PackageJson,
): Promise<void> {
  // These properties are added by `read-pkg-up`
  const sanitizedPackageJson = omit(['_id', 'readme'], packageJson);
  const content = `${JSON.stringify(sanitizedPackageJson, null, 2)}\n`;
  return writeFileAsync(packagePath, content, { flag: 'w' });
}
