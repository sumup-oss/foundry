import { pick } from 'lodash/fp';

import { Options } from '../../types/shared';

export const files = (options: Options) => [
  {
    name: '.releaserc.js',
    content: `module.exports = require('@sumup/foundry/semantic-release')(${JSON.stringify(
      pick(['publish'], options)
    )})`
  }
];

export const scripts = () => ({
  release: 'foundry run semantic-release'
});
