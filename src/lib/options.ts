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
  Options,
  PackageJson,
  Plugin,
} from '../types/shared';

import { readPackageJson } from './files';
import * as logger from './logger';

// These lists are not exhaustive and should be expanded if necessary.
export const NODE_LIBRARIES = [
  'next',
  '@sveltejs/kit',
  'nuxt',
  'express',
  'koa',
];
export const BROWSER_LIBRARIES = ['next', 'react', 'preact', 'svelte', 'vue'];

const FRAMEWORK_PLUGINS = [
  {
    frameworkPackages: ['next'],
    pluginPackage: 'eslint-config-next',
    supportedRange: '>=10.0.0',
  },
  {
    frameworkPackages: ['@emotion/react', '@emotion/styled'],
    pluginPackage: '@emotion/eslint-plugin',
    supportedRange: '^11.0.0',
  },
  {
    frameworkPackages: ['jest'],
    pluginPackage: 'eslint-plugin-jest',
    supportedRange: '^27.0.0',
  },
  {
    frameworkPackages: [
      '@testing-library/dom',
      '@testing-library/jest-dom',
      '@testing-library/react',
    ],
    pluginPackage: 'eslint-plugin-testing-library',
    supportedRange: '^6.0.0',
  },
  {
    frameworkPackages: ['cypress'],
    pluginPackage: 'eslint-plugin-cypress',
    supportedRange: '^2.0.0',
  },
  {
    frameworkPackages: ['@playwright/test'],
    pluginPackage: 'eslint-plugin-playwright',
    supportedRange: '>=0.17.0 <1.0.0',
  },
  {
    frameworkPackages: ['storybook', '@storybook/react'],
    pluginPackage: 'eslint-plugin-storybook',
    supportedRange: '>=0.6.0 <1.0.0',
  },
];

export function getOptions(): Required<Options> {
  const packageJson = readPackageJson();
  const config = (packageJson.foundry || {}) as Options;

  warnAboutUnsupportedPlugins(packageJson);
  warnAboutMissingPlugins(packageJson);

  const pick = pickConfigOrDetect(packageJson);

  return {
    language: pick(config.language, detectLanguage),
    environments: pick(config.environments, detectEnvironments),
    frameworks: pick(config.frameworks, detectFrameworks),
    plugins: pick(config.plugins, detectPlugins),
    openSource: pick(config.openSource, detectOpenSource),
    publish: Boolean(config.publish),
  };
}

export function pickConfigOrDetect(packageJson: PackageJson) {
  return <Option>(
    explicit: Option | undefined,
    detectFn: (packageJson: PackageJson) => Option,
  ) => (explicit !== undefined ? explicit : detectFn(packageJson));
}

export function getDependencyVersion(
  packageJson: PackageJson,
  name: string,
): string {
  const { dependencies = {}, devDependencies = {} } = packageJson;

  return dependencies[name] || devDependencies[name];
}

export function hasDependency(packageJson: PackageJson, name: string): boolean {
  return Boolean(getDependencyVersion(packageJson, name));
}

export function detectLanguage(packageJson: PackageJson): Language {
  return hasDependency(packageJson, 'typescript')
    ? Language.TYPESCRIPT
    : Language.JAVASCRIPT;
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
    environments.push(Environment.NODE);
  }

  if (hasClientLibraries || isBrowser) {
    environments.push(Environment.BROWSER);
  }

  return environments;
}

export function detectFrameworks(packageJson: PackageJson): Framework[] {
  const frameworks: Framework[] = [];

  if (hasDependency(packageJson, 'next')) {
    frameworks.push(Framework.NEXT_JS);
  }

  if (
    !hasDependency(packageJson, 'next') &&
    hasDependency(packageJson, 'react')
  ) {
    frameworks.push(Framework.REACT);
  }

  return frameworks;
}

export function warnAboutUnsupportedPlugins(packageJson: PackageJson): void {
  FRAMEWORK_PLUGINS.forEach(({ pluginPackage, supportedRange }) => {
    const version = getDependencyVersion(packageJson, pluginPackage);

    if (!version) {
      return;
    }

    const isSupported = intersects(version, supportedRange);

    if (!isSupported) {
      logger.warn(
        `"${pluginPackage}" is installed at version "${version}". Foundry has only been tested with "${supportedRange}". You may find that it works just fine, or you may not.`,
      );
    }
  });
}

export function warnAboutMissingPlugins(packageJson: PackageJson): void {
  FRAMEWORK_PLUGINS.forEach(({ frameworkPackages, pluginPackage }) => {
    const installedPackage = frameworkPackages.find((pkg) =>
      hasDependency(packageJson, pkg),
    );

    if (installedPackage && !hasDependency(packageJson, pluginPackage)) {
      logger.warn(
        `"${installedPackage}" is installed but not the corresponding ESLint plugin. Please install "${pluginPackage}".`,
      );
    }
  });
}

export function detectPlugins(packageJson: PackageJson): Plugin[] {
  const plugins: Plugin[] = [];

  if (hasDependency(packageJson, 'eslint-config-next')) {
    plugins.push(Plugin.NEXT_JS);
  }

  if (hasDependency(packageJson, '@emotion/eslint-plugin')) {
    plugins.push(Plugin.EMOTION);
  }

  if (hasDependency(packageJson, 'eslint-plugin-jest')) {
    plugins.push(Plugin.JEST);
  }

  if (hasDependency(packageJson, 'eslint-plugin-testing-library')) {
    plugins.push(Plugin.TESTING_LIBRARY);
  }

  if (hasDependency(packageJson, 'eslint-plugin-cypress')) {
    plugins.push(Plugin.CYPRESS);
  }

  if (hasDependency(packageJson, 'eslint-plugin-playwright')) {
    plugins.push(Plugin.PLAYWRIGHT);
  }

  if (hasDependency(packageJson, 'eslint-plugin-storybook')) {
    plugins.push(Plugin.STORYBOOK);
  }

  return plugins;
}

export function detectOpenSource(packageJson: PackageJson) {
  return packageJson.license === 'Apache-2.0';
}
