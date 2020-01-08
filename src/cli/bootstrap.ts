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

import { writeFile } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
import { flow, mapValues, omitBy, pick } from 'lodash/fp';

import { SUPPORTED_CONFIGS, eslint, plop, semanticRelease } from '../configs';
import * as logger from '../lib/logger';

import { Tool } from '../types/shared';

const writeFileAsync = promisify(writeFile);

const { ESLINT_CONFIGS } = eslint;
const { PLOP_CONFIGS } = plop;
const { SEMANTIC_RELEASE_CONFIGS } = semanticRelease;

export interface BootstrapParams {
  'eslint'?: 'base' | 'node' | 'react' | true;
  'prettier'?: 'base' | true;
  'plop'?: 'base' | 'react' | true;
  'husky'?: 'base' | true;
  'lint-staged'?: 'base' | 'typescript' | true;
  'semantic-release'?: 'base' | 'modules' | true;
  'targetDir'?: string;
  'all'?: boolean;
}

type Tools = Tool[];

type SupportedConfigs = { [key in Tool]: string[] };

type Configs = { [key in Tool]: string };

type ConfigExports = { [key in Tool]: string };

function getConfigType(tool: Tool, type: string): string {
  const configs: SupportedConfigs = {
    'eslint': ESLINT_CONFIGS,
    'prettier': ['base'],
    'husky': ['base'],
    'lint-staged': ['base'],
    'plop': PLOP_CONFIGS,
    'semantic-release': SEMANTIC_RELEASE_CONFIGS
  };

  const supportedConfigs = configs[tool];

  const isSupportedConfig = supportedConfigs.includes(type);

  if (!isSupportedConfig) {
    logger.warn(
      `Config ${type} is not available for ${tool}. Falling back to base config.`
    );
    return 'base';
  }

  return type;
}

function createConfigExport(tool: Tool, type: string): string {
  return `module.exports = require('@sumup/foundry/${tool}').${type}`;
}

// eslint-disable-next-line consistent-return
async function writeConfigFile(
  tool: Tool,
  content: string,
  targetDir: string
): Promise<void> {
  const filenames = {
    'eslint': '.eslintrc.js',
    'prettier': 'prettier.config.js',
    'plop': 'plopfile.js',
    'husky': '.huskyrc.js',
    'lint-staged': 'lint-staged.config.js',
    'semantic-release': '.releaserc.js'
  };
  const filename = filenames[tool];

  const path = resolve(targetDir, filename);

  try {
    return await writeFileAsync(path, content);
  } catch (e) {
    logger.error(`An error occured writing ${filename} to ${targetDir}.`);
    logger.error(e);
    process.exit(1);
  }
}

const getConfigs = flow(
  (params) => {
    const { all } = params;

    if (all) {
      return SUPPORTED_CONFIGS.reduce(
        (allConfigs, configName) =>
          Object.assign(allConfigs, { [configName]: 'base' }),
        {}
      );
    }

    return flow(
      pick(SUPPORTED_CONFIGS),
      mapValues((v) => (v === true ? 'base' : v))
    )(params);
  },
  omitBy((val) => !val)
);

export function bootstrap(params: BootstrapParams) {
  // TODO: handle case where someone writes eslint config but not prettier
  //       config. Should at least get a message telling them they will either
  //       need to overwrite the eslint plugins/presets or provide one manually.
  const { targetDir = './' } = params;
  const configParams = getConfigs(params) as Configs;
  const tools = Object.keys(configParams) as Tools;

  const configExports = tools.reduce((acc, tool) => {
    const configType = getConfigType(tool, configParams[tool]);
    const configExport = createConfigExport(tool, configType);
    return { ...acc, [tool]: configExport };
  }, {}) as ConfigExports;

  return Promise.all(
    tools.map((tool) => writeConfigFile(tool, configExports[tool], targetDir))
  );
}
