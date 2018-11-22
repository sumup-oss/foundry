import { withoutPreset, overwriteEnvPreset } from './babel';

describe('The babel configuration module', () => {
  describe('withoutPreset()', () => {
    it('should return a function to remove a given preset from a babel configuration', () => {
      const fn = withoutPreset('@babel/preset-env');
      expect(fn).toEqual(expect.any(Function));
    });

    describe('the preset removal function', () => {
      it('should remove a preset with no options', () => {
        const presets = ['some-preset'];
        const removeSomePreset = withoutPreset('some-preset');
        const actual = removeSomePreset(presets);
        expect(actual).toBeEmpty();
      });

      it('should remove a preset with options', () => {
        const presets = [['some-preset', { option: true }]];
        const removeSomePreset = withoutPreset('some-preset');
        const actual = removeSomePreset(presets);
        expect(actual).toBeEmpty();
      });
    });
  });

  describe('overwriteEnvPreset()', () => {
    it('should overwrite the env preset with a given replacement', () => {
      const config = {
        presets: [['@babel/preset-env', { option: true }]]
      };
      const newEnvPreset = ['@babel/preset-env', { option: false }];
      const envPresetConfig = {
        presets: [newEnvPreset]
      };
      const actual = overwriteEnvPreset(config, envPresetConfig);
      expect(actual.presets[0][1]).toEqual({ option: false });
    });
  });
});
