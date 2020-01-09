import { pick } from 'lodash/fp';

import { Options } from '../../types/shared';

export const files = (options: Options) => [
  {
    name: '.eslintrc.js',
    content: `module.exports = require('@sumup/foundry/eslint')(${JSON.stringify(
      pick(['target'], options)
    )})`
  }
];

export const scripts = () => ({
  'lint': 'foundry run eslint',
  'lint:fix': 'foundry run eslint --fix'
});
