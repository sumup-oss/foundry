import { pick } from 'lodash/fp';

import { Options } from '../../types/shared';

export const files = (options: Options) => [
  {
    name: 'plopfile.js',
    content: `module.exports = require('@sumup/foundry/plop')(${JSON.stringify(
      pick(['language'], options)
    )})`
  }
];

export const scripts = () => ({
  'create:component': 'foundry run plop component'
});
