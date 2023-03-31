/**
 * Copyright 2023, SumUp Ltd.
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

import type { PackageJson, PluginConfig } from '../../../types/shared';

import { getPluginConfig as browser } from './browser';
import { getPluginConfig as cypress } from './cypress';
import { getPluginConfig as emotion } from './emotion';
import { getPluginConfig as jest } from './jest';
import { getPluginConfig as language } from './language';
import { getPluginConfig as next } from './next';
import { getPluginConfig as node } from './node';
import { getPluginConfig as notice } from './notice';
import { getPluginConfig as playwright } from './playwright';
import { getPluginConfig as react } from './react';
import { getPluginConfig as testingLibrary } from './testing-library';

const plugins = [
  browser,
  cypress,
  emotion,
  jest,
  language,
  next,
  node,
  notice,
  playwright,
  react,
  testingLibrary,
];

export function getPlugins(packageJson: PackageJson): PluginConfig[] {
  return plugins
    .map((getPluginConfig) => getPluginConfig(packageJson))
    .filter(isPluginConfig);
}

function isPluginConfig(
  pluginConfig: PluginConfig | null,
): pluginConfig is PluginConfig {
  return Boolean(pluginConfig);
}
