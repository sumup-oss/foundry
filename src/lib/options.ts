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

import { intersects } from 'semver';

import {
  Environment,
  Framework,
  Language,
  type Options,
  type PackageJson,
  Plugin,
} from '../types/shared.js';

import { readPackageJson } from './files.js';
import * as logger from './logger.js';

// These lists are not exhaustive and should be expanded if necessary.
export const NODE_LIBRARIES = [
  'next',
  '@sveltejs/kit',
  'nuxt',
  'express',
  'koa',
];
export const BROWSER_LIBRARIES = ['next', 'react', 'preact', 'svelte', 'vue'];

const PLUGINS = [
  {
    name: Plugin.CircuitUI,
    frameworkPackages: ['@sumup-oss/circuit-ui', '@sumup-oss/design-tokens'],
    eslintPlugins: {
      '@sumup-oss/eslint-plugin-circuit-ui': '>=7.0.0 <8.0.0',
    },
    stylelintPlugins: {
      '@sumup-oss/stylelint-plugin-circuit-ui': '>=3.0.0 <5.0.0',
    },
  },
  {
    name: Plugin.Nextjs,
    frameworkPackages: ['next'],
    eslintPlugins: {
      '@next/eslint-plugin-next': '>=15.0.0',
    },
  },
  {
    name: Plugin.Jest,
    frameworkPackages: ['jest'],
    eslintPlugins: {
      'eslint-plugin-jest': '>=29.0.0 <30.0.0',
    },
  },
  {
    name: Plugin.TestingLibrary,
    frameworkPackages: [
      '@testing-library/dom',
      '@testing-library/jest-dom',
      '@testing-library/react',
    ],
    eslintPlugins: {
      'eslint-plugin-testing-library': '>=7.0.0 <8.0.0',
    },
  },
  {
    name: Plugin.Cypress,
    frameworkPackages: ['cypress'],
    eslintPlugins: {
      'eslint-plugin-cypress': '>=4.0.0 <6.0.0',
    },
  },
  {
    name: Plugin.Playwright,
    frameworkPackages: ['@playwright/test'],
    eslintPlugins: {
      'eslint-plugin-playwright': '>=2.0.0 <3.0.0',
    },
  },
  {
    name: Plugin.Storybook,
    frameworkPackages: ['storybook', '@storybook/react'],
    eslintPlugins: {
      'eslint-plugin-storybook': '>=9.0.0 <10.0.0',
    },
  },
];

export function getPlugins(): Plugin[] {
  const packageJson = readPackageJson();
  const config = (packageJson.foundry || {}) as Options;

  warnAboutUnsupportedPlugins(packageJson);
  warnAboutMissingPlugins(packageJson);

  const pick = pickConfigOrDetect(packageJson);

  // TODO: Differentiate between ESLint and Stylelint plugins
  return pick(config.plugins, detectPlugins);
}

export function getOptions(): Required<Options> {
  const packageJson = readPackageJson();
  const config = (packageJson.foundry || {}) as Options;

  warnAboutUnsupportedPlugins(packageJson);
  warnAboutMissingPlugins(packageJson);

  const pick = pickConfigOrDetect(packageJson);

  return {
    packageType: packageJson.type || 'commonjs',
    language: pick(config.language, detectLanguage),
    environments: pick(config.environments, detectEnvironments),
    frameworks: pick(config.frameworks, detectFrameworks),
    // TODO: Differentiate between ESLint and Stylelint plugins
    plugins: pick(config.plugins, detectPlugins),
    openSource: pick(config.openSource, detectOpenSource),
  };
}

export function pickConfigOrDetect(packageJson: PackageJson) {
  return <Option>(
    explicit: Option | undefined,
    detectFn: (packageJson: PackageJson) => Option,
  ) => (explicit !== undefined ? explicit : detectFn(packageJson));
}

function getDependencyVersion(
  packageJson: PackageJson,
  name: string,
): string | undefined {
  const { dependencies = {}, devDependencies = {} } = packageJson;

  return dependencies[name] || devDependencies[name];
}

export function hasDependency(packageJson: PackageJson, name: string): boolean {
  return Boolean(getDependencyVersion(packageJson, name));
}

export function detectLanguage(packageJson: PackageJson): Language {
  return hasDependency(packageJson, 'typescript')
    ? Language.TypeScript
    : Language.JavaScript;
}

export function detectEnvironments(packageJson: PackageJson): Environment[] {
  const hasServerLibraries = NODE_LIBRARIES.some((library) =>
    hasDependency(packageJson, library),
  );

  const hasClientLibraries = BROWSER_LIBRARIES.some((library) =>
    hasDependency(packageJson, library),
  );

  const isCLI = Boolean(packageJson.bin);
  const isBrowser = Boolean(packageJson.browser);

  const environments: Environment[] = [];

  if (hasServerLibraries || isCLI) {
    environments.push(Environment.Node);
  }

  if (hasClientLibraries || isBrowser) {
    environments.push(Environment.Browser);
  }

  return environments;
}

export function detectFrameworks(packageJson: PackageJson): Framework[] {
  const frameworks: Framework[] = [];

  if (hasDependency(packageJson, 'next')) {
    frameworks.push(Framework.Nextjs);
  }

  if (
    !hasDependency(packageJson, 'next') &&
    hasDependency(packageJson, 'react')
  ) {
    frameworks.push(Framework.React);
  }

  return frameworks;
}

export function warnAboutUnsupportedPlugins(packageJson: PackageJson): void {
  PLUGINS.forEach(({ eslintPlugins, stylelintPlugins = {} }) => {
    Object.entries({ ...eslintPlugins, ...stylelintPlugins }).forEach(
      ([pluginPackage, supportedRange]: [string, string]) => {
        let version = getDependencyVersion(packageJson, pluginPackage);

        if (!version) {
          return;
        }

        try {
          // Extract the version from tarball URLs
          if (version.startsWith('https://')) {
            const matches = version.match(/(?<version>\d\.\d\.\d.*)\.tgz/);

            if (matches?.groups?.version) {
              version = matches.groups.version;
            }
          }

          const isSupported = intersects(version, supportedRange);

          if (!isSupported) {
            logger.warn(
              `"${pluginPackage}" is installed at version "${version}". Foundry has only been tested with versions "${supportedRange}". You may find that it works just fine, or you may not. Pull requests welcome!`,
            );
          }
        } catch (error) {
          logger.warn(
            `Failed to verify whether "${pluginPackage}" installed at version "${version}" is supported. You may find that it works just fine, or you may not.`,
          );
          logger.debug((error as Error).message);
        }
      },
    );
  });
}

export function warnAboutMissingPlugins(packageJson: PackageJson): void {
  PLUGINS.forEach(({ frameworkPackages, eslintPlugins, stylelintPlugins }) => {
    const installedPackage = frameworkPackages.find((pkg) =>
      hasDependency(packageJson, pkg),
    );

    Object.keys({ ...eslintPlugins, ...stylelintPlugins }).forEach(
      (pluginPackage) => {
        if (installedPackage && !hasDependency(packageJson, pluginPackage)) {
          logger.warn(
            `"${installedPackage}" is installed but not the corresponding ESLint plugin. Please install "${pluginPackage}".`,
          );
        }
      },
    );
  });
}

export function detectPlugins(packageJson: PackageJson): Plugin[] {
  const pluginSet = PLUGINS.reduce(
    (allPlugins, { name, eslintPlugins, stylelintPlugins }) => {
      const plugins = Object.keys({ ...eslintPlugins, ...stylelintPlugins });

      plugins.forEach((pluginPackage) => {
        if (hasDependency(packageJson, pluginPackage)) {
          allPlugins.add(name);
        }
      });

      return allPlugins;
    },
    new Set<Plugin>(),
  );

  return Array.from(pluginSet);
}

export function detectOpenSource(packageJson: PackageJson) {
  return packageJson.license === 'Apache-2.0';
}
