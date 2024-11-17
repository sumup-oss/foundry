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

import type { NormalizedPackageJson } from 'read-pkg-up';

export enum Tool {
  ESLINT = 'eslint',
  STYLELINT = 'stylelint',
  BIOME = 'biome',
  HUSKY = 'husky',
  LINT_STAGED = 'lint-staged',
}

export enum Language {
  TYPESCRIPT = 'TypeScript',
  JAVASCRIPT = 'JavaScript',
}

export enum Environment {
  NODE = 'Node',
  BROWSER = 'Browser',
}

export enum Framework {
  REACT = 'React',
  NEXT_JS = 'Next.js',
}

export enum Plugin {
  CIRCUIT_UI = 'Circuit UI',
  CIRCUIT_UI_OSS = 'Circuit UI (OSS scope)',
  CYPRESS = 'Cypress',
  EMOTION = 'Emotion',
  JEST = 'Jest',
  NEXT_JS = 'Next.js',
  PLAYWRIGHT = 'Playwright',
  STORYBOOK = 'Storybook',
  TESTING_LIBRARY = 'Testing Library',
}

export type Workspaces = string[] | null;

export interface Options {
  language?: Language;
  environments?: Environment[];
  frameworks?: Framework[];
  plugins?: Plugin[];
  openSource?: boolean;
  workspaces?: Workspaces;
  useBiome?: boolean;
}

export interface InitOptions extends Options {
  configDir: string;
  overwrite?: boolean;
}

export type File = {
  name: string;
  content: string;
  overwrite?: boolean;
};

export type Script = {
  name: string;
  command: string;
  description: string;
};

export interface ToolOptions {
  files?: (options: InitOptions) => File[];
}

export type PackageJson = NormalizedPackageJson & {
  workspaces?: string[];
};
