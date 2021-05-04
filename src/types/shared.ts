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

export enum Preset {
  LINT = 'lint',
  RELEASE = 'release',
  TEMPLATES = 'templates',
  CI = 'ci',
}

export enum Tool {
  ESLINT = 'eslint',
  PRETTIER = 'prettier',
  HUSKY = 'husky',
  LINT_STAGED = 'lint-staged',
  PLOP = 'plop',
  SEMANTIC_RELEASE = 'semantic-release',
  CI = 'ci',
}

export enum Prompt {
  LANGUAGE = 'language',
  ENVIRONMENTS = 'environments',
  FRAMEWORKS = 'frameworks',
  OPEN_SOURCE = 'open-source',
  PUBLISH = 'publish',
  CI = 'ci',
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
  EMOTION = 'Emotion',
  JEST = 'Jest',
  CYPRESS = 'Cypress',
  TESTING_LIBRARY = 'Testing Library',
}

export enum CI {
  GITHUB_ACTIONS = 'github-actions',
}

export interface Options {
  presets: Preset[];
  configDir: string;
  language?: Language;
  environments?: Environment[];
  frameworks?: Framework[];
  ci?: CI;
  openSource?: boolean;
  publish?: boolean;
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
  files?: (options: Options) => File[];
  scripts?: (options: Options) => Script[];
}

export type PackageJson = {
  scripts?: { [key: string]: string };
  bin?: string;
  [key: string]: Record<string, unknown> | string | undefined;
};
