import { Preset, Tool } from '../types/shared';

import {
  enumToChoices,
  mergeOptions,
  validatePresets,
  validatePath
} from './init';

describe('init command', () => {
  describe('enumToChoices', () => {
    it('should convert an enum to an array of options', () => {
      enum Fruit {
        MANGO = 'Mango',
        BANANA = 'Banana',
        KIWI = 'Kiwi'
      }
      const actual = enumToChoices(Fruit);
      const expected = ['Mango', 'Banana', 'Kiwi'];
      expect(actual).toEqual(expected);
    });
  });

  describe('mergeOptions', () => {
    it('should override the CLI args with the answers', () => {
      const args = {
        presets: [Preset.LINT],
        configDir: './'
      };
      const answers = {
        presets: [Preset.RELEASE],
        configDir: './src'
      };
      const actual = mergeOptions(args, answers);
      const expected = { configDir: './src', presets: ['release'] };
      expect(actual).toEqual(expected);
    });

    it('should strip out additional CLI args', () => {
      const args = {
        presets: [Preset.LINT],
        configDir: './',
        $0: 'cli.js',
        _: ['init']
      };
      const answers = {
        presets: [Preset.LINT],
        configDir: './src'
      };
      const actual = mergeOptions(args, answers);
      const expected = { configDir: './src', presets: ['lint'] };
      expect(actual).toEqual(expected);
    });
  });

  describe('validatePresets', () => {
    it('should return an error message when no presets were selected', () => {
      const presets: Preset[] = [];
      const actual = validatePresets(presets);
      expect(typeof actual).toBe('string');
    });

    it('should return true otherwise', () => {
      const presets = [Preset.LINT];
      const actual = validatePresets(presets);
      expect(actual).toBeTruthy();
    });
  });

  describe('validatePath', () => {
    it('should return false if no path was passed', () => {
      const actual = validatePath();
      expect(actual).toBeFalsy();
    });

    it('should return an error if the path is not valid', () => {
      const path = 'foo/bar';
      const actual = validatePath(path);
      expect(typeof actual).toBe('string');
    });

    it('should return true if the path is valid', () => {
      const path = '.';
      const actual = validatePath(path);
      expect(actual).toBeTruthy();
    });
  });
});
