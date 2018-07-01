import bootstrapConfig from './bootstrap-config';

const TYPE_CONFIGS = {
  REACT: {
    eslint: 'react',
    babel: 'react',
    prettier: 'base',
    plop: 'react'
  }
};

const CATEGORY_CONFIGS = {
  LIBRARY: {},
  APP: {}
};

const getConfig = collection => name => collection[name.toUpperCase()];

const getTypeConfig = getConfig(TYPE_CONFIGS);
const getCategoryConfig = getConfig(CATEGORY_CONFIGS);

export default function bootstrap({ type, category, targetDir }) {
  const typeParams = getTypeConfig(type);
  const categoryParams = getCategoryConfig(category);

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
