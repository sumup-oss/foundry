import { pick } from 'lodash/fp';

import { Options } from '../../types/shared';

export const files = (options: Options) => [
  {
    name: 'lint-staged.config.js',
    content: `module.exports = require('@sumup/foundry/lint-staged')(${JSON.stringify(
      pick(['language'], options)
    )})`
  }
];
