/**
 * Copyright 2026, SumUp Ltd.
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

import confirm from '@inquirer/confirm';
import { readPackageUp } from 'read-package-up';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { addPackageScript, savePackageJson, writeFile } from '../lib/files.js';
import * as logger from '../lib/logger.js';
import type { PackageJson } from '../types/shared.js';

import { type InitParams, init } from './init.js';

const mockIsCI = vi.hoisted(() => ({ value: false }));
const mockOpenSource: { value: boolean | undefined } = vi.hoisted(() => ({
  value: true,
}));

vi.mock('@inquirer/confirm', () => ({ default: vi.fn() }));

vi.mock('is-ci', () => ({
  get default() {
    return mockIsCI.value;
  },
}));

vi.mock('../lib/logger.js', () => ({
  empty: vi.fn(),
  info: vi.fn(),
  log: vi.fn(),
  debug: vi.fn(),
  error: vi.fn(),
}));

vi.mock('../lib/files.js', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../lib/files.js')>();
  return {
    ...mod,
    addPackageScript: vi.fn(mod.addPackageScript),
    writeFile: vi.fn(),
    savePackageJson: vi.fn(),
  };
});

vi.mock('../lib/options.js', () => ({
  getOptions: vi.fn(() => ({
    packageType: 'module',
    language: 'TypeScript',
    environments: ['Node'],
    plugins: [],
    openSource: mockOpenSource.value,
  })),
}));

vi.mock('../configs/index.js', () => ({
  toolA: {
    files: () => [
      { name: 'eslint.config.js', content: 'export default {}' },
      { name: '.editorconfig', content: 'root = true' },
    ],
  },
  toolB: {},
}));

vi.mock('read-package-up', () => ({
  readPackageUp: vi.fn().mockImplementation(() =>
    Promise.resolve({
      path: '/project/package.json',
      packageJson: { name: 'test-project', version: '1.0.0' },
    }),
  ),
}));

/**
 * `init` fires `tasks.run().then().catch()` without awaiting, so
 * we wrap the real Listr to capture the run promise and suppress output.
 */
let listrRunPromise: Promise<unknown>;

vi.mock('listr2', async (importOriginal) => {
  const mod = await importOriginal<typeof import('listr2')>();
  const OriginalListr = mod.Listr;

  return {
    ...mod,
    Listr: vi.fn().mockImplementation(function SilentListr(
      tasks: ConstructorParameters<typeof OriginalListr>[0],
    ) {
      const instance = new OriginalListr(tasks, {
        renderer: 'silent' as never,
      });
      const origRun = instance.run.bind(instance);
      instance.run = (...args: Parameters<typeof instance.run>) => {
        listrRunPromise = origRun(...args);
        return listrRunPromise;
      };
      return instance;
    }),
  };
});

const confirmMock = confirm as unknown as Mock;
const writeFileMock = writeFile as unknown as Mock;
const addPackageScriptMock = addPackageScript as unknown as Mock;
const savePackageJsonMock = savePackageJson as unknown as Mock;
const readPackageUpMock = readPackageUp as unknown as Mock;
const loggerMock = logger as unknown as Record<string, Mock>;

async function runInit(args: InitParams) {
  await init(args);
  await listrRunPromise;
}

describe('init', () => {
  const defaultArgs: InitParams = {
    configDir: '.',
    overwrite: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    confirmMock.mockReset();
    mockIsCI.value = false;
    mockOpenSource.value = true;
  });

  describe('in CI mode', () => {
    beforeEach(() => {
      mockIsCI.value = true;
    });

    it('should write all config files', async () => {
      await runInit(defaultArgs);

      expect(writeFileMock).toHaveBeenCalledTimes(2);
      expect(writeFileMock).toHaveBeenCalledWith(
        '.',
        'eslint.config.js',
        'export default {}',
        false,
      );
      expect(writeFileMock).toHaveBeenCalledWith(
        '.',
        '.editorconfig',
        'root = true',
        false,
      );
    });

    it('should add all lint scripts to package.json', async () => {
      await runInit(defaultArgs);

      // 4 scripts hardcoded in init.ts: lint, lint:fix, lint:ci, lint:css
      expect(addPackageScriptMock).toHaveBeenCalledTimes(4);
      expect(addPackageScriptMock).toHaveBeenCalledWith(
        expect.any(Object),
        'lint',
        expect.stringContaining('biome check'),
        false,
      );
      expect(addPackageScriptMock).toHaveBeenCalledWith(
        expect.any(Object),
        'lint:fix',
        expect.stringContaining('--fix'),
        false,
      );
      expect(addPackageScriptMock).toHaveBeenCalledWith(
        expect.any(Object),
        'lint:ci',
        expect.stringContaining('biome ci'),
        false,
      );
      expect(addPackageScriptMock).toHaveBeenCalledWith(
        expect.any(Object),
        'lint:css',
        expect.stringContaining('stylelint'),
        false,
      );
    });

    it('should save the updated package.json', async () => {
      await runInit(defaultArgs);

      expect(savePackageJsonMock).toHaveBeenCalledTimes(1);
      expect(savePackageJsonMock).toHaveBeenCalledWith(
        '/project/package.json',
        expect.objectContaining({ name: 'test-project' }),
      );
    });

    it('should log the added scripts on success', async () => {
      await runInit(defaultArgs);

      expect(loggerMock.info).toHaveBeenCalledWith(
        expect.stringContaining('scripts'),
      );
      // 4 scripts hardcoded in init.ts
      expect(loggerMock.log).toHaveBeenCalledTimes(4);
    });
  });

  describe('when openSource is undetermined (interactive)', () => {
    beforeEach(() => {
      mockOpenSource.value = undefined;
      confirmMock.mockResolvedValue(true);
    });

    it('should prompt the user for the open-source question', async () => {
      await runInit(defaultArgs);

      expect(confirmMock).toHaveBeenCalledTimes(1);
      const callArgs = confirmMock.mock.calls[0][0] as { message: string };
      expect(callArgs.message).toContain('open-source');
    });

    it('should add the license when the user confirms open-source', async () => {
      await runInit(defaultArgs);

      expect(savePackageJsonMock).toHaveBeenCalledWith(
        '/project/package.json',
        expect.objectContaining({ license: 'Apache-2.0' }),
      );
    });

    it('should skip the license when the user declines open-source', async () => {
      confirmMock.mockResolvedValue(false);

      await runInit(defaultArgs);

      expect(savePackageJsonMock).toHaveBeenCalledTimes(1);
      const savedPkg = savePackageJsonMock.mock.calls[0][1] as Record<
        string,
        unknown
      >;
      expect(savedPkg).not.toHaveProperty('license');
    });
  });

  describe('when openSource is already determined', () => {
    it('should not prompt for the open-source question', async () => {
      await runInit(defaultArgs);

      expect(confirmMock).not.toHaveBeenCalled();
    });

    it('should write all config files', async () => {
      await runInit(defaultArgs);

      expect(writeFileMock).toHaveBeenCalledTimes(2);
    });

    it('should add the license field for open-source projects', async () => {
      await runInit(defaultArgs);

      expect(savePackageJsonMock).toHaveBeenCalledWith(
        '/project/package.json',
        expect.objectContaining({ license: 'Apache-2.0' }),
      );
    });

    it('should not overwrite an existing license field', async () => {
      readPackageUpMock.mockResolvedValueOnce({
        path: '/project/package.json',
        packageJson: {
          name: 'test-project',
          version: '1.0.0',
          license: 'MIT',
        },
      });

      await runInit(defaultArgs);

      const savedPkg = savePackageJsonMock.mock.calls[0][1] as Record<
        string,
        unknown
      >;
      expect(savedPkg.license).toBe('MIT');
    });

    it('should skip the license field when openSource is false', async () => {
      mockOpenSource.value = false;

      await runInit(defaultArgs);

      expect(savePackageJsonMock).toHaveBeenCalledTimes(1);
      const savedPkg = savePackageJsonMock.mock.calls[0][1] as Record<
        string,
        unknown
      >;
      expect(savedPkg).not.toHaveProperty('license');
    });

    it('should save the updated package.json', async () => {
      await runInit(defaultArgs);

      expect(savePackageJsonMock).toHaveBeenCalledTimes(1);
    });

    it('should log the added scripts on success', async () => {
      await runInit(defaultArgs);

      expect(loggerMock.info).toHaveBeenCalledWith(
        expect.stringContaining('scripts'),
      );
    });
  });

  describe('with overwrite enabled', () => {
    it('should pass the overwrite flag to writeFile', async () => {
      await runInit({ ...defaultArgs, overwrite: true });

      expect(writeFileMock).toHaveBeenCalledWith(
        '.',
        'eslint.config.js',
        'export default {}',
        true,
      );
      expect(writeFileMock).toHaveBeenCalledWith(
        '.',
        '.editorconfig',
        'root = true',
        true,
      );
    });

    it('should pass the overwrite flag to addPackageScript', async () => {
      await runInit({ ...defaultArgs, overwrite: true });

      expect(addPackageScriptMock).toHaveBeenCalledWith(
        expect.any(Object),
        'lint',
        expect.any(String),
        true,
      );
    });
  });

  describe('with a custom config directory', () => {
    it('should write config files to the specified directory', async () => {
      await runInit({ ...defaultArgs, configDir: './config' });

      expect(writeFileMock).toHaveBeenCalledWith(
        './config',
        'eslint.config.js',
        expect.any(String),
        false,
      );
      expect(writeFileMock).toHaveBeenCalledWith(
        './config',
        '.editorconfig',
        expect.any(String),
        false,
      );
    });
  });

  describe('when a config file already exists', () => {
    beforeEach(() => {
      writeFileMock.mockRejectedValueOnce(new Error('EEXIST'));
    });

    it('should skip the file in CI', async () => {
      mockIsCI.value = true;

      await runInit(defaultArgs);

      expect(writeFileMock).toHaveBeenCalledTimes(2);
      expect(loggerMock.debug).toHaveBeenCalledWith(
        expect.stringContaining('already exists'),
      );
    });

    it('should rewrite when the user accepts the overwrite prompt', async () => {
      confirmMock.mockResolvedValue(true);

      await runInit(defaultArgs);

      expect(writeFileMock).toHaveBeenCalledTimes(3);
      expect(writeFileMock).toHaveBeenCalledWith(
        '.',
        'eslint.config.js',
        'export default {}',
        true,
      );
    });

    it('should skip when the user declines the overwrite prompt', async () => {
      confirmMock.mockResolvedValue(false);

      await runInit(defaultArgs);

      expect(writeFileMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('when a package script already exists', () => {
    beforeEach(() => {
      readPackageUpMock.mockResolvedValueOnce({
        path: '/project/package.json',
        packageJson: {
          name: 'test-project',
          version: '1.0.0',
          scripts: { lint: 'existing-lint-command' },
        },
      });
    });

    it('should skip the script in CI', async () => {
      mockIsCI.value = true;

      await runInit(defaultArgs);

      expect(loggerMock.debug).toHaveBeenCalledWith(
        expect.stringContaining('already exists'),
      );
      const savedPkg = savePackageJsonMock.mock.calls[0][1] as PackageJson;
      expect(savedPkg.scripts?.lint).toBe('existing-lint-command');
    });

    it('should rewrite when the user accepts the overwrite prompt', async () => {
      confirmMock.mockResolvedValue(true);

      await runInit(defaultArgs);

      const savedPkg = savePackageJsonMock.mock.calls[0][1] as PackageJson;
      expect(savedPkg.scripts?.lint).toContain('biome check');
    });

    it('should skip when the user declines the overwrite prompt', async () => {
      confirmMock.mockResolvedValue(false);

      await runInit(defaultArgs);

      const savedPkg = savePackageJsonMock.mock.calls[0][1] as PackageJson;
      expect(savedPkg.scripts?.lint).toBe('existing-lint-command');
    });
  });

  describe('when package.json is not found', () => {
    it('should log the error and exit', async () => {
      readPackageUpMock.mockResolvedValueOnce(undefined);
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation((() => {}) as never);

      try {
        await init(defaultArgs);
        await expect(listrRunPromise).rejects.toThrow(
          'Unable to find a "package.json"',
        );
        // Flush microtasks so the .catch() handler completes
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });

        expect(loggerMock.error).toHaveBeenCalled();
        expect(exitSpy).toHaveBeenCalledWith(1);
      } finally {
        exitSpy.mockRestore();
      }
    });
  });
});
