import { pick } from 'lodash/fp';

import { Options, Language } from '../../types/shared';

export const files = (options: Options) => [
  {
    name: '.eslintrc.js',
    content: `module.exports = require('@sumup/foundry/eslint')(${JSON.stringify(
      pick(['target'], options)
    )})`
  }
];

export const scripts = (options: Options) => {
  const { language = Language.TYPESCRIPT } = options;
  const extensionMap = {
    [Language.TYPESCRIPT]: '.js,.jsx,.ts,.tsx',
    [Language.JAVASCRIPT]: '.js,.jsx'
  };
  const extensions = extensionMap[language];
  return {
    'lint': `foundry run eslint . --ext ${extensions}`,
    'lint:fix': 'yarn lint --fix',
    'lint:ci':
      'yarn lint --format junit -o __reports__/junit/eslint-results.xml'
  };
};
