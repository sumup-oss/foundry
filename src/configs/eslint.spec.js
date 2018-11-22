import { overwritePresets } from './eslint';

describe('The eslint configuration module', () => {
  describe('overwritePresets()', () => {
    it('should merge two configurations overwriting existing presets', () => {
      const config = {
        extends: ['some-preset'],
        rules: {
          'some-custom-rule': false
        }
      };
      const newConfig = {
        extends: ['other-preset']
      };
      const actual = overwritePresets(config, newConfig);
      expect(actual).toEqual(
        expect.objectContaining({
          extends: ['other-preset'],
          rules: {
            'some-custom-rule': false
          }
        })
      );
    });
  });
});
