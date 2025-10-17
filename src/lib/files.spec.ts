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

import { mkdir as fsMkdir, writeFile as fsWriteFile } from 'node:fs';

import dedent from 'dedent';
import { describe, expect, it, vi } from 'vitest';

import type { ModuleType, PackageJson } from '../types/shared.js';

import {
  addPackageScript,
  getFileExtension,
  savePackageJson,
  writeFile,
} from './files.js';

vi.mock('node:fs', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  writeFile: vi.fn((_file, _data, _options, callback) => callback()),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  mkdir: vi.fn((_dir, _options, callback) => callback()),
}));

const content = 'export const foo = "Hello world"';

const formattedContent = `export const foo = 'Hello world';
`;

const basePackageJson = {
  name: 'name',
  readme: 'README.md',
  version: '0.0.0',
  _id: 'id',
};

describe('files', () => {
  describe('writeFile', () => {
    it('should create the target folder if it does not exist', async () => {
      const configDir = './config';
      const filename = 'eslint.config.js';
      const shouldOverwrite = false;

      await writeFile(configDir, filename, content, shouldOverwrite);

      expect(fsMkdir).toHaveBeenCalledWith(
        'config',
        { recursive: true },
        expect.any(Function),
      );
    });

    it('should write the file to disk', async () => {
      const configDir = './config';
      const filename = 'eslint.config.js';
      const shouldOverwrite = false;

      await writeFile(configDir, filename, content, shouldOverwrite);

      expect(fsWriteFile).toHaveBeenCalledWith(
        'config/eslint.config.js',
        expect.any(String),
        { flag: 'wx' },
        expect.any(Function),
      );
    });

    it('should overwrite the file if it already exists', async () => {
      const configDir = '.';
      const filename = 'eslint.config.js';
      const shouldOverwrite = true;

      await writeFile(configDir, filename, content, shouldOverwrite);

      expect(fsWriteFile).toHaveBeenCalledWith(
        'eslint.config.js',
        expect.any(String),
        { flag: 'w' },
        expect.any(Function),
      );
    });

    it('should format the file contents', async () => {
      const configDir = '.';
      const filename = 'eslint.config.js';
      const shouldOverwrite = true;

      await writeFile(configDir, filename, content, shouldOverwrite);

      expect(fsWriteFile).toHaveBeenCalledWith(
        expect.any(String),
        formattedContent,
        expect.any(Object),
        expect.any(Function),
      );
    });

    it('should not format hidden file contents', async () => {
      const configDir = '.';
      const editorconfig = dedent`
        [*]
        charset = utf-8
        end_of_line = lf
        insert_final_newline = true
        indent_style = space
        indent_size = 2
      `;
      const filename = '.editorconfig';
      const shouldOverwrite = true;

      await writeFile(configDir, filename, editorconfig, shouldOverwrite);

      expect(fsWriteFile).toHaveBeenCalledWith(
        filename,
        editorconfig,
        expect.any(Object),
        expect.any(Function),
      );
    });
  });

  describe('addPackageScript', () => {
    it('should add a script to the package.json file', () => {
      const packageJson = { scripts: {} } as PackageJson;
      const name = 'lint';
      const command = 'eslint .';
      const shouldOverwrite = false;

      const actual = addPackageScript(
        packageJson,
        name,
        command,
        shouldOverwrite,
      );

      const expected = {
        scripts: { lint: 'eslint .' },
      };
      expect(actual).toEqual(expected);
    });

    it('should initialize the scripts if they do not exist yet', () => {
      const packageJson = {} as PackageJson;
      const name = 'lint';
      const command = 'eslint .';
      const shouldOverwrite = false;

      const actual = addPackageScript(
        packageJson,
        name,
        command,
        shouldOverwrite,
      );

      const expected = {
        scripts: { lint: 'eslint .' },
      };
      expect(actual).toEqual(expected);
    });

    it('should throw an error if a conflicting script exists', () => {
      const packageJson = {
        scripts: { lint: 'eslint .' },
      } as unknown as PackageJson;
      const name = 'lint';
      const command = 'eslint .';
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
      const command = 'eslint .';
      const shouldOverwrite = true;

      const actual = addPackageScript(
        packageJson,
        name,
        command,
        shouldOverwrite,
      );

      const expected = {
        scripts: { lint: 'eslint .' },
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('savePackageJson', () => {
    it('should save the package.json file to disk', async () => {
      const path = 'package.json';

      await savePackageJson(path, basePackageJson);

      expect(fsWriteFile).toHaveBeenCalled();
    });
  });

  describe('getFileExtension', () => {
    it.each<[ModuleType, ModuleType, string]>([
      ['module', 'module', 'js'],
      ['module', 'commonjs', 'cjs'],
      ['commonjs', 'module', 'mjs'],
      ['commonjs', 'commonjs', 'js'],
    ])(
      'should return the file name for a %s file in a %s package',
      (packageType, fileType, extension) => {
        const file = 'file';
        const fileName = getFileExtension(file, fileType, packageType);
        expect(fileName).toBe(`${file}.${extension}`);
      },
    );
  });
});
