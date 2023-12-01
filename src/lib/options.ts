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

import {
  Environment,
  Framework,
  Language,
  Options,
  PackageJson,
} from '../types/shared';

import { readPackageJson } from './files';

// These lists are not exhaustive and should be expanded if necessary.
export const NODE_LIBRARIES = [
  'next',
  '@sveltejs/kit',
  'nuxt',
  'express',
  'koa',
];
export const BROWSER_LIBRARIES = ['next', 'react', 'preact', 'svelte', 'vue'];

export function getOptions(): Required<Options> {
  const packageJson = readPackageJson();
  const config = (packageJson.foundry || {}) as Options;

  const pick = pickConfigOrDetect(packageJson);

  return {
    language: pick(config.language, detectLanguage),
    environments: pick(config.environments, detectEnvironments),
    frameworks: pick(config.frameworks, detectFrameworks),
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

export function hasDependency(packageJson: PackageJson, name: string): boolean {
  const { dependencies = {}, devDependencies = {} } = packageJson;

  return Boolean(dependencies[name] || devDependencies[name]);
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

  if (hasDependency(packageJson, '@emotion/react')) {
    frameworks.push(Framework.EMOTION);
  }

  if (hasDependency(packageJson, 'jest')) {
    frameworks.push(Framework.JEST);
  }

  if (hasDependency(packageJson, '@testing-library/react')) {
    frameworks.push(Framework.TESTING_LIBRARY);
  }

  if (hasDependency(packageJson, 'cypress')) {
    frameworks.push(Framework.CYPRESS);
  }

  if (hasDependency(packageJson, 'playwright')) {
    frameworks.push(Framework.PLAYWRIGHT);
  }

  if (hasDependency(packageJson, 'storybook')) {
    frameworks.push(Framework.STORYBOOK);
  }

  return frameworks;
}

export function detectOpenSource(packageJson: PackageJson) {
  return packageJson.license === 'Apache-2.0';
}
