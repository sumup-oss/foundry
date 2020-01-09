import { config } from './config';

describe('semantic-release', () => {
  describe('with options', () => {
    it('should return a default config', () => {
      const actual = config();
      expect(actual).toMatchSnapshot();
    });

    it('should return a config to publish to NPM', () => {
      const options = { publish: true };
      const actual = config(options);
      expect(actual).toMatchSnapshot();
    });
  });

  describe('with overrides', () => {
    it('should override the default config', () => {
      const options = undefined;
      const overrides = {
        branches: ['master']
      };
      const actual = config(options, overrides);
      expect(actual).toEqual(expect.objectContaining({ branches: ['master'] }));
    });
  });
});
