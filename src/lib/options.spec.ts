/**
 * Copyright 2022, SumUp Ltd.
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

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Environment, Framework, Language, Plugin } from '../types/shared';

import * as logger from './logger';
import {
  pickConfigOrDetect,
  hasDependency,
  detectLanguage,
  detectEnvironments,
  detectFrameworks,
  detectOpenSource,
  detectPlugins,
  warnAboutMissingPlugins,
  warnAboutUnsupportedPlugins,
  NODE_LIBRARIES,
  BROWSER_LIBRARIES,
} from './options';

const basePackageJson = {
  name: 'name',
  readme: 'README.md',
  version: '0.0.0',
  _id: 'id',
};

vi.mock('./logger.ts');

describe('options', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('pickConfigOrDetect', () => {
    it('should return the config value when defined', () => {
      const pickFn = pickConfigOrDetect(basePackageJson);
      const option = true;
      const detectFn = vi.fn();
      const actual = pickFn(option, detectFn);

      expect(actual).toBe(true);
      expect(detectFn).not.toHaveBeenCalled();
    });

    it('should return the detected value otherwise', () => {
      const pickFn = pickConfigOrDetect(basePackageJson);
      const option = undefined;
      const detectFn = vi.fn(() => false);
      const actual = pickFn(option, detectFn);

      expect(actual).toBe(false);
      expect(detectFn).toHaveBeenCalledWith(basePackageJson);
    });
  });

  describe('hasDependency', () => {
    it('should return true if a package is listed in the dependencies', () => {
      const packageJson = {
        ...basePackageJson,
        dependencies: { typescript: '^1.0.0' },
      };
      const name = 'typescript';
      const actual = hasDependency(packageJson, name);

      expect(actual).toBe(true);
    });

    it('should return true if a package is listed in the devDependencies', () => {
      const packageJson = {
        ...basePackageJson,
        devDependencies: { typescript: '^1.0.0' },
      };
      const name = 'typescript';
      const actual = hasDependency(packageJson, name);

      expect(actual).toBe(true);
    });

    it('should return false otherwise', () => {
      const name = 'typescript';
      const actual = hasDependency(basePackageJson, name);

      expect(actual).toBe(false);
    });
  });

  describe('detectLanguage', () => {
    it('should return `TypeScript` when it is installed', () => {
      const packageJson = {
        ...basePackageJson,
        devDependencies: { typescript: '^1.0.0' },
      };
      const actual = detectLanguage(packageJson);

      expect(actual).toBe(Language.TYPESCRIPT);
    });

    it('should return `JavaScript` otherwise', () => {
      const actual = detectLanguage(basePackageJson);

      expect(actual).toBe(Language.JAVASCRIPT);
    });
  });

  describe('detectEnvironments', () => {
    it.each(NODE_LIBRARIES)(
      'should include `Node` when `%s` is installed',
      (library) => {
        const packageJson = {
          ...basePackageJson,
          devDependencies: { [library]: '^1.0.0' },
        };
        const actual = detectEnvironments(packageJson);

        expect(actual).toContain(Environment.NODE);
      },
    );

    it.each(BROWSER_LIBRARIES)(
      'should include `Browser` when `%s` is installed',
      (library) => {
        const packageJson = {
          ...basePackageJson,
          devDependencies: { [library]: '^1.0.0' },
        };
        const actual = detectEnvironments(packageJson);

        expect(actual).toContain(Environment.BROWSER);
      },
    );

    it('should include `Node` for a CLI package', () => {
      const packageJson = {
        ...basePackageJson,
        bin: { command: 'path' },
      };
      const actual = detectEnvironments(packageJson);

      expect(actual).toContain(Environment.NODE);
    });

    it('should include `Browser` for a browser library', () => {
      const packageJson = {
        ...basePackageJson,
        browser: 'path',
      };
      const actual = detectEnvironments(packageJson);

      expect(actual).toContain(Environment.BROWSER);
    });
  });

  describe('detectFrameworks', () => {
    it.each([
      ['next', Framework.NEXT_JS],
      ['react', Framework.REACT],
    ])(
      'should, when `%s` is installed, include the `%s` preset',
      (library, preset) => {
        const packageJson = {
          ...basePackageJson,
          dependencies: { [library]: '^1.0.0' },
        };
        const actual = detectFrameworks(packageJson);

        expect(actual).toContain(preset);
      },
    );

    it('should not include the `React` preset when `next` is installed', () => {
      const packageJson = {
        ...basePackageJson,
        dependencies: { next: '^1.0.0', react: '^1.0.0' },
      };
      const actual = detectFrameworks(packageJson);

      expect(actual).toContain(Framework.NEXT_JS);
      expect(actual).not.toContain(Framework.REACT);
    });
  });

  describe('detectPlugins', () => {
    it.each([
      ['eslint-config-next', Plugin.NEXT_JS],
      ['@emotion/eslint-plugin', Plugin.EMOTION],
      ['eslint-plugin-jest', Plugin.JEST],
      ['eslint-plugin-testing-library', Plugin.TESTING_LIBRARY],
      ['eslint-plugin-cypress', Plugin.CYPRESS],
      ['eslint-plugin-playwright', Plugin.PLAYWRIGHT],
      ['eslint-plugin-storybook', Plugin.STORYBOOK],
    ])(
      'should, when `%s` is installed, include the `%s` preset',
      (library, preset) => {
        const packageJson = {
          ...basePackageJson,
          dependencies: { [library]: '^1.0.0' },
        };
        const actual = detectPlugins(packageJson);

        expect(actual).toContain(preset);
      },
    );

    it('should detect multiple libraries', () => {
      const packageJson = {
        ...basePackageJson,
        dependencies: {
          '@emotion/eslint-plugin': '^1.0.0',
          'eslint-config-next': '^1.0.0',
        },
      };
      const actual = detectPlugins(packageJson);

      expect(actual).toContain(Plugin.EMOTION);
      expect(actual).toContain(Plugin.NEXT_JS);
    });
  });

  describe('detectOpenSource', () => {
    it('should return true when the license is `Apache-2.0`', () => {
      const packageJson = {
        ...basePackageJson,
        license: 'Apache-2.0',
      };
      const actual = detectOpenSource(packageJson);

      expect(actual).toBe(true);
    });

    it('should return false for other licenses', () => {
      const packageJson = {
        ...basePackageJson,
        license: 'MIT',
      };
      const actual = detectOpenSource(packageJson);

      expect(actual).toBe(false);
    });

    it('should return false when the license is missing', () => {
      const actual = detectOpenSource(basePackageJson);

      expect(actual).toBe(false);
    });
  });

  describe('warnAboutUnsupportedPlugins', () => {
    it('should log a warning if a plugin is installed at a lower version than has been tested with Foundry', () => {
      const packageJson = {
        ...basePackageJson,
        license: 'MIT',
        dependencies: { 'eslint-config-next': '^9.0.0' },
      };

      warnAboutUnsupportedPlugins(packageJson);

      expect(logger.warn).toHaveBeenCalledOnce();
      expect(logger.warn).toHaveBeenCalledWith(
        '"eslint-config-next" is installed at version "^9.0.0". Foundry has only been tested with versions ">=10.0.0". You may find that it works just fine, or you may not.',
      );
    });

    it('should log a warning if a plugin is installed at a higher version than has been tested with Foundry', () => {
      const packageJson = {
        ...basePackageJson,
        license: 'MIT',
        dependencies: { 'eslint-plugin-playwright': '^1.0.0' },
      };

      warnAboutUnsupportedPlugins(packageJson);

      expect(logger.warn).toHaveBeenCalledOnce();
      expect(logger.warn).toHaveBeenCalledWith(
        '"eslint-plugin-playwright" is installed at version "^1.0.0". Foundry has only been tested with versions ">=0.17.0 <1.0.0". You may find that it works just fine, or you may not.',
      );
    });

    it('should extract the version if a plugin is installed from a tarball URL', () => {
      const packageJson = {
        ...basePackageJson,
        license: 'MIT',
        dependencies: {
          '@sumup/eslint-plugin-circuit-ui':
            'https://registry.npmjs.org/@sumup/eslint-plugin-circuit-ui/-/eslint-plugin-circuit-ui-1.0.0.tgz',
        },
      };

      warnAboutUnsupportedPlugins(packageJson);

      expect(logger.warn).toHaveBeenCalledOnce();
      expect(logger.warn).toHaveBeenCalledWith(
        '"@sumup/eslint-plugin-circuit-ui" is installed at version "1.0.0". Foundry has only been tested with versions ">=3.0.0 <5.0.0". You may find that it works just fine, or you may not.',
      );
    });

    it('should log a warning if the installed plugin version cannot be verified', () => {
      const packageJson = {
        ...basePackageJson,
        license: 'MIT',
        dependencies: { 'eslint-plugin-playwright': 'latest' },
      };

      warnAboutUnsupportedPlugins(packageJson);

      expect(logger.warn).toHaveBeenCalledOnce();
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed to verify whether "eslint-plugin-playwright" installed at version "latest" is supported. You may find that it works just fine, or you may not.',
      );
    });
  });

  describe('warnAboutMissingPlugins', () => {
    it('should log a warning if a framework is installed but not its corresponding ESLint plugin', () => {
      const packageJson = {
        ...basePackageJson,
        license: 'MIT',
        dependencies: {
          'next': '^1.0.0',
          '@emotion/react': '^1.0.0',
        },
      };

      warnAboutMissingPlugins(packageJson);

      expect(logger.warn).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledWith(
        '"next" is installed but not the corresponding ESLint plugin. Please install "eslint-config-next".',
      );
      expect(logger.warn).toHaveBeenCalledWith(
        '"@emotion/react" is installed but not the corresponding ESLint plugin. Please install "@emotion/eslint-plugin".',
      );
    });
  });
});
