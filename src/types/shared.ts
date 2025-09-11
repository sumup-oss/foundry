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

import type { PackageJson } from 'read-package-up';

export type { PackageJson };

export enum Language {
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
}

export enum Environment {
  Node = 'Node',
  Browser = 'Browser',
}

export enum Framework {
  React = 'React',
  Nextjs = 'Next.js',
}

export enum Plugin {
  CircuitUI = 'Circuit UI',
  CircuitUIOSS = 'Circuit UI (OSS scope)',
  Cypress = 'Cypress',
  Emotion = 'Emotion',
  Jest = 'Jest',
  Nextjs = 'Next.js',
  Playwright = 'Playwright',
  Storybook = 'Storybook',
  TestingLibrary = 'Testing Library',
}

export interface Options {
  language?: Language;
  environments?: Environment[];
  frameworks?: Framework[];
  plugins?: Plugin[];
  openSource?: boolean;
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

export interface ToolOptions {
  files?: (options: InitOptions) => File[];
}
