import { config } from './config';

describe('prettier', () => {
  describe('with options', () => {
    it('should return a config', () => {
      const actual = config();
      expect(actual).toMatchSnapshot();
    });
  });

  describe('with overrides', () => {
    it('should override the default config', () => {
      const options = undefined;
      const overrides = {
        singleQuote: false
      };
      const actual = config(options, overrides);

      expect(actual.singleQuote).toBeFalsy();
    });
  });
});
