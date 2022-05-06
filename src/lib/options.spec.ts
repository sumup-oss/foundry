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

import { Environment, Framework, Language } from '../types/shared';

import {
  pickConfigOrDetect,
  hasDependency,
  detectLanguage,
  detectEnvironments,
  detectFrameworks,
  detectOpenSource,
  NODE_LIBRARIES,
  BROWSER_LIBRARIES,
} from './options';

const basePackageJson = {
  name: 'name',
  readme: 'README.md',
  version: '0.0.0',
  _id: 'id',
};

describe('options', () => {
  describe('pickConfigOrDetect', () => {
    it('should return the config value when defined', () => {
      const pickFn = pickConfigOrDetect(basePackageJson);
      const option = true;
      const detectFn = jest.fn();
      const actual = pickFn(option, detectFn);

      expect(actual).toBe(true);
      expect(detectFn).not.toHaveBeenCalled();
    });

    it('should return the detected value otherwise', () => {
      const pickFn = pickConfigOrDetect(basePackageJson);
      const option = undefined;
      const detectFn = jest.fn(() => false);
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
      ['@emotion/react', Framework.EMOTION],
      ['jest', Framework.JEST],
      ['@testing-library/react', Framework.TESTING_LIBRARY],
      ['cypress', Framework.CYPRESS],
      ['playwright', Framework.PLAYWRIGHT],
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
});
