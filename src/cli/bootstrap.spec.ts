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

import { writeFile } from 'fs';
import { bootstrap, BootstrapParams } from './bootstrap';
import { eslint, babel } from '../configs';

jest.mock('fs', () => ({ writeFile: jest.fn() }));

const { ESLINT_CONFIGS } = eslint;
const { BABEL_CONFIGS } = babel;

describe('bootstrap command', () => {
  const consoleBackup = console;

  beforeEach(() => {
    global.console = {
      ...console,
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
  });

  afterAll(() => {
    global.console = consoleBackup;
  });

  const defaultParams: BootstrapParams = {
    targetDir: '/some/cool/path',
    all: false
  };

  it('should allow writing all configs', () => {
    // The all param is getting set by yargs
    const params: BootstrapParams = {
      targetDir: defaultParams.targetDir,
      all: true
    };
    bootstrap(params);

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('eslint'),
      expect.stringContaining('base'),
      expect.any(Function)
    );
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('prettier'),
      expect.stringContaining('base'),
      expect.any(Function)
    );
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('babel'),
      expect.stringContaining('base'),
      expect.any(Function)
    );
  });

  describe('when passed the eslint param', () => {
    it('should create the eslintrc', () => {
      const params: BootstrapParams = { ...defaultParams, eslint: 'base' };
      bootstrap(params);

      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining('eslint'),
        expect.any(String),
        expect.any(Function)
      );
    });

    it('should use the base config when no config is specified', () => {
      const params: BootstrapParams = { ...defaultParams, eslint: true };
      bootstrap(params);

      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('base'),
        expect.any(Function)
      );
    });

    ESLINT_CONFIGS.forEach((config) => {
      it(`should write the config file for ${config}`, () => {
        const params: BootstrapParams = {
          ...defaultParams,
          eslint: config as 'base' | 'node' | 'react'
        };
        bootstrap(params);

        expect(writeFile).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining(config),
          expect.any(Function)
        );
      });
    });
  });

  describe('when passed the babel flag', () => {
    it('should create the .babelrc', () => {
      const params: BootstrapParams = { ...defaultParams, babel: 'base' };
      bootstrap(params);
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining('babel'),
        expect.any(String),
        expect.any(Function)
      );
    });

    it('should create the babel.config.js preset file', () => {
      const params: BootstrapParams = { ...defaultParams, babel: 'base' };
      bootstrap(params);

      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('base'),
        expect.any(Function)
      );
    });

    it('should use the base config when no config is specified', () => {
      const params: BootstrapParams = { ...defaultParams, babel: true };
      bootstrap(params);

      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('base'),
        expect.any(Function)
      );
    });

    BABEL_CONFIGS.forEach((config) => {
      it(`should write the config file for ${config}`, () => {
        const params: BootstrapParams = {
          ...defaultParams,
          babel: config as 'base' | 'node' | 'react' | 'webpack' | 'lodash'
        };
        bootstrap(params);

        expect(writeFile).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining(config),
          expect.any(Function)
        );
      });
    });
  });

  describe('when passed the prettier flag', () => {
    it('should write the prettier.config.js', () => {
      bootstrap({
        ...defaultParams,
        prettier: true
      });

      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining('prettier.config.js'),
        expect.stringContaining('base'),
        expect.any(Function)
      );
    });
  });

  // describe('when passed an invalid configuration name', () => {
  //   it('should default to the base configuration', () => {
  //     const params: BootstrapParams = { ...defaultParams, prettier: 'react' };
  //     bootstrap(params);

  //     expect(writeFile).toHaveBeenCalledWith(
  //       expect.stringContaining('prettier.config.js'),
  //       expect.stringContaining('base'),
  //       expect.any(Function)
  //     );
  //   });

  //   it('should print an error for the user', () => {
  //     const params: BootstrapParams = { ...defaultParams, prettier: 'react' };
  //     bootstrap(params);

  //     expect(console.warn).toHaveBeenCalledWith(
  //       expect.stringContaining('react')
  //     );
  //     expect(console.warn).toHaveBeenCalledWith(
  //       expect.stringContaining('base')
  //     );
  //   });
  // });

  // describe('when passed an unsupported tool name', () => {
  //   it('should not do anything', () => {
  //     bootstrap({
  //       ...defaultParams,
  //       'some-tool': 'react'
  //     });

  //     expect(writeFile).not.toHaveBeenCalled();
  //   });
  // });

  describe('when writing to a config file fails', () => {
    let processExit: jest.SpyInstance;

    beforeAll(() => {
      processExit = jest.spyOn(process, 'exit').mockImplementation();
    });

    afterAll(() => {
      processExit.mockRestore();
    });

    it('should log an error and exit the program', async () => {
      ((writeFile as unknown) as jest.Mock).mockImplementationOnce(
        (foo, bar, onErr) => {
          onErr(new Error('Foo'));
        }
      );

      await bootstrap({ ...defaultParams, prettier: 'base' });
      expect(global.console.error).toHaveBeenCalled();
      expect(processExit).toHaveBeenCalledWith(1);
    });
  });
});
