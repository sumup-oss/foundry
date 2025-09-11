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

import { defineConfig as defineESLintConfig } from 'eslint/config';

import { readPackageJson } from '../../lib/files.js';
import {
  warnAboutMissingPlugins,
  warnAboutUnsupportedPlugins,
} from '../../lib/options.js';

import { browser } from './browser.js';
import { ignores } from './ignores.js';
import { javascript } from './javascript.js';
import { next } from './next.js';
import { node } from './node.js';
import { openSource } from './open-source.js';
import { react } from './react.js';
import { stories } from './stories.js';
import { tests } from './tests.js';
import { typescript } from './typescript.js';

/**
 * Helper function to define a config array and validate that all plugins
 * relevant to the project have been installed.
 *
 * @param args The arguments to the function.
 * @returns The config array.
 * @throws {TypeError} If no arguments are provided or if an argument is not an object.
 */
export const defineConfig: typeof defineESLintConfig = (...args) => {
  const packageJson = readPackageJson();

  warnAboutUnsupportedPlugins(packageJson);
  warnAboutMissingPlugins(packageJson);

  return defineESLintConfig(...args);
};

export const configs = {
  browser,
  ignores,
  javascript,
  next,
  node,
  openSource,
  react,
  stories,
  tests,
  typescript,
};
