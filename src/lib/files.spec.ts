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

import { writeFile, addPackageScript } from './files';

jest.mock('fs', () => ({
  writeFile: jest.fn(),
  mkdirSync: jest.fn(),
  existsSync: jest.fn(),
}));

const content = `module.exports = "Hello world"`;

const formattedContent = `module.exports = 'Hello world';
`;

describe('files', () => {
  describe('writeFile', () => {
    it('should create the target folder if it does not exist', () => {
      const configDir = './config';
      const filename = '.eslintrc.js';
      const shouldOverwrite = false;

      writeFile(configDir, filename, content, shouldOverwrite);

      expect(fs.mkdirSync).toHaveBeenCalledWith('config', { recursive: true });
    });

    it('should write the file to disk', () => {
      const configDir = './config';
      const filename = '.eslintrc.js';
      const shouldOverwrite = false;

      writeFile(configDir, filename, content, shouldOverwrite);

      expect(fs.writeFile).toHaveBeenCalledWith(
        'config/.eslintrc.js',
        expect.any(String),
        { flag: 'wx' },
        expect.any(Function),
      );
    });

    it('should overwrite the file if it already exists', () => {
      const configDir = '.';
      const filename = '.eslintrc.js';
      const shouldOverwrite = true;

      writeFile(configDir, filename, content, shouldOverwrite);

      expect(fs.writeFile).toHaveBeenCalledWith(
        '.eslintrc.js',
        expect.any(String),
        { flag: 'w' },
        expect.any(Function),
      );
    });

    it('should format the file contents', () => {
      const configDir = '.';
      const filename = '.eslintrc.js';
      const shouldOverwrite = true;

      writeFile(configDir, filename, content, shouldOverwrite);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        formattedContent,
        expect.any(Object),
        expect.any(Function),
      );
    });
  });

  describe('addPackageScript', () => {
    it('should add a script to the package.json file', () => {
      const packageJson = { scripts: {} };
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
      const packageJson = { scripts: { lint: 'eslint .' } };
      const name = 'lint';
      const command = 'foundry run eslint src';
      const shouldOverwrite = false;

      const actual = () =>
        addPackageScript(packageJson, name, command, shouldOverwrite);

      expect(actual).toThrowError();
    });

    it('should overwrite the conflicting script', () => {
      const packageJson = { scripts: { lint: 'eslint .' } };
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
});
