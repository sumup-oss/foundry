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
import {
  flow,
  get,
  includes,
  keys,
  map,
  mapValues,
  omitBy,
  pickAll,
  reduce,
  zipObject,
  assign
} from 'lodash/fp';
import {
  SUPPORTED_CONFIGS,
  eslint,
  babel,
  plop,
  semanticRelease
} from '../configs';

const writeFileAsync = promisify(writeFile);

const { ESLINT_CONFIGS } = eslint;
const { BABEL_CONFIGS } = babel;
const { PLOP_CONFIGS } = plop;
const { SEMANTIC_RELEASE_CONFIGS } = semanticRelease;

function getConfigName(name, val) {
  const configs = {
    eslint: ESLINT_CONFIGS,
    prettier: ['base'],
    husky: ['base'],
    'lint-staged': ['base'],
    babel: BABEL_CONFIGS,
    plop: PLOP_CONFIGS,
    'semantic-release': [SEMANTIC_RELEASE_CONFIGS]
  };

  const supportedConfigs = get(name, configs);

  const isSupportedConfig = includes(val, supportedConfigs);

  if (!isSupportedConfig) {
    console.warn(
      `Config ${val} is not available for ${name}. Falling back to base config.`
    );
    return 'base';
  }

  return val;
}

function createConfigExport(name, config) {
  return `module.exports = require('@sumup/foundry/${name}').${config}`;
}

// eslint-disable-next-line consistent-return
async function writeConfigFile(name, content, targetDir) {
  const filenames = {
    eslint: '.eslintrc.js',
    prettier: 'prettier.config.js',
    babel: '.babelrc.js',
    plop: 'plopfile.js',
    husky: '.huskyrc.js',
    'lint-staged': 'lint-staged.config.js',
    'semantic-release': '.releaserc.js'
  };
  const filename = get(name, filenames);

  const path = resolve(targetDir, filename);

  try {
    return await writeFileAsync(path, content);
  } catch (e) {
    console.error(`An error occured writing ${filename} to ${targetDir}.`);
    console.error(e);
    process.exit(1);
  }
}

const getConfigs = flow(
  params => {
    const { all } = params;

    if (all) {
      return zipObject(
        SUPPORTED_CONFIGS,
        Array.from(Array(SUPPORTED_CONFIGS.length).keys()).map(() => 'base')
      );
    }

    const picked = flow(
      pickAll(SUPPORTED_CONFIGS),
      mapValues(v => (v === true ? 'base' : v))
    )(params);

    return picked;
  },
  omitBy(val => !val)
);

export default function bootstrap(params) {
  // TODO: handle case where someone writes eslint config but not prettier
  //       config. Should at least get a message telling them they will either
  //       need to overwrite the eslint plugins/presets or provide one manually.
  const { targetDir } = params;
  const configParams = getConfigs(params);
  const tools = keys(configParams);

  const configs = reduce(
    (acc, tool) =>
      assign(acc, {
        [tool]: getConfigName(tool, configParams[tool])
      }),
    {},
    tools
  );

  const configExportStrings = reduce(
    (acc, tool) => ({
      ...acc,
      [tool]: createConfigExport(tool, configs[tool])
    }),
    {},
    tools
  );

  // TODO: Add a flag for the target directory.
  return flow(
    map(tool => writeConfigFile(tool, configExportStrings[tool], targetDir)),
    promises => Promise.all(promises) // breaks if you don't put the arrow function here.
  )(tools);
}
