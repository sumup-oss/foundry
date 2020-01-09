import { pick } from 'lodash/fp';

import { Options } from '../../types/shared';

export const files = (options: Options) => [
  {
    name: 'prettier.config.js',
    content: `module.exports = require('@sumup/foundry/prettier')(${JSON.stringify(
      pick(['language'], options)
    )})`
  }
];
