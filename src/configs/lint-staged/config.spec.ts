import { Language } from '../../types/shared';
import { getAllChoiceCombinations } from '../../lib/choices';

import { config } from './config';

describe('lint-staged', () => {
  describe('with options', () => {
    const matrix = getAllChoiceCombinations({ language: Language });

    it.each(matrix)('should return a config for %o', (options) => {
      const actual = config(options);
      expect(actual).toMatchSnapshot();
    });
  });

  describe('with overrides', () => {
    it('should override the default config', () => {
      const options = undefined;
      const overrides = {
        '*.jsx?': ['custom command']
      };
      const actual = config(options, overrides);
      expect(actual).toMatchSnapshot();
    });
  });
});
