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

import { PackageJson } from '../types/shared';

import { addPackageScript, writePackageJson } from './package-json';

jest.mock('fs', () => ({
  ...jest.requireActual<typeof fs>('fs'),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  writeFile: jest.fn((file, data, options, callback) => callback()),
  mkdirSync: jest.fn(),
}));

const basePackageJson = {
  name: 'name',
  readme: 'README.md',
  version: '0.0.0',
  _id: 'id',
};

describe('Package.json', () => {
  describe('addPackageScript', () => {
    it('should add a script to the package.json file', () => {
      const packageJson = { scripts: {} } as PackageJson;
      const name = 'lint';
      const command = 'foundry run eslint src';
      const shouldOverwrite = false;

      const actual = addPackageScript(
        packageJson,
        name,
        command,
        shouldOverwrite,
      );

      const expected = {
        scripts: { lint: 'foundry run eslint src' },
      };
      expect(actual).toEqual(expected);
    });

    it('should initialize the scripts if they do not exist yet', () => {
      const packageJson = {} as PackageJson;
      const name = 'lint';
      const command = 'foundry run eslint src';
      const shouldOverwrite = false;

      const actual = addPackageScript(
        packageJson,
        name,
        command,
        shouldOverwrite,
      );

      const expected = {
        scripts: { lint: 'foundry run eslint src' },
      };
      expect(actual).toEqual(expected);
    });

    it('should throw an error if a conflicting script exists', () => {
      const packageJson = {
        scripts: { lint: 'eslint .' },
      } as unknown as PackageJson;
      const name = 'lint';
      const command = 'foundry run eslint src';
      const shouldOverwrite = false;

      const actual = () =>
        addPackageScript(packageJson, name, command, shouldOverwrite);

      expect(actual).toThrow();
    });

    it('should overwrite the conflicting script', () => {
      const packageJson = {
        scripts: { lint: 'eslint .' },
      } as unknown as PackageJson;
      const name = 'lint';
      const command = 'foundry run eslint src';
      const shouldOverwrite = true;

      const actual = addPackageScript(
        packageJson,
        name,
        command,
        shouldOverwrite,
      );

      const expected = {
        scripts: { lint: 'foundry run eslint src' },
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('writePackageJson', () => {
    it('should save the package.json file to disk', async () => {
      const path = 'package.json';

      await writePackageJson(path, basePackageJson);

      expect(fs.writeFile).toHaveBeenCalled();
    });
  });
});
