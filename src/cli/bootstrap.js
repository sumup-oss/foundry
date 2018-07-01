import { join } from 'path';

import bootstrapConfig from './bootstrap-config';

const TYPE_CONFIGS = {
  REACT: {
    eslint: 'react',
    babel: 'react',
    prettier: 'base',
    plop: 'react'
  },
  NODE: {
    eslint: 'node',
    babel: 'node',
    prettier: 'base'
  },
  VANILLA: {
    eslint: 'base',
    babel: 'base',
    prettier: 'base'
  }
};

const CATEGORY_CONFIGS = {
  LIBRARY: {},
  APP: {}
};

const getConfig = collection => name => collection[name.toUpperCase()];

const getTypeConfig = getConfig(TYPE_CONFIGS);
const getCategoryConfig = getConfig(CATEGORY_CONFIGS);

function createConfigs({ type, category, baseDir, name }) {
  const typeParams = getTypeConfig(type);
  const categoryParams = getCategoryConfig(category);
  const targetDir = join(baseDir, name);

  if (!typeParams) {
    console.error(`Invalid project type ${type}. Exiting...`);
    process.exit(1);
  }

  if (!categoryParams) {
    console.error(`Invalid project category ${category}. Exiting...`);
    process.exit(1);
  }

  const bootstrapConfigParams = Object.assign(
    { targetDir },
    typeParams,
    categoryParams
  );

  return bootstrapConfig(bootstrapConfigParams);
}

export default function bootstrap(params) {
  /**
   * TODO:
   * - Create the target folder if it does not exist.
   * - Create a package.json inside the target folder, if it
   *   does not exist.
   * - Add the scripts to package.json. Optionally overwrite existing
   *   scripts.
   */
  return createConfigs(params);
}
