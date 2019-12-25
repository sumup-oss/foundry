import { Tool } from '../types/shared';

import {
  enumToChoices,
  mergeOptions,
  whenToolsSelected,
  validateTools
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
        tools: [Tool.ESLINT],
        configDir: './'
      };
      const answers = {
        tools: [Tool.PRETTIER],
        configDir: './src'
      };
      const actual = mergeOptions(args, answers);
      const expected = { configDir: './src', tools: ['prettier'] };
      expect(actual).toEqual(expected);
    });

    it('should strip out additional CLI args', () => {
      const args = {
        tools: [Tool.ESLINT],
        configDir: './',
        $0: 'cli.js',
        _: ['init']
      };
      const answers = {
        tools: [Tool.PRETTIER],
        configDir: './src'
      };
      const actual = mergeOptions(args, answers);
      const expected = { configDir: './src', tools: ['prettier'] };
      expect(actual).toEqual(expected);
    });
  });

  describe('whenToolsSelected', () => {
    it('should return true if the options contain the specifed tools', () => {
      const options = { tools: [Tool.ESLINT, Tool.HUSKY], configDir: '.' };
      const tools = [Tool.ESLINT];
      const actual = whenToolsSelected(options, tools);
      expect(actual).toBeTruthy();
    });

    it('should return true if the options do not contain the specifed tools', () => {
      const options = { tools: [Tool.ESLINT, Tool.HUSKY], configDir: '.' };
      const tools = [Tool.SEMANTIC_RELEASE];
      const actual = whenToolsSelected(options, tools);
      expect(actual).toBeFalsy();
    });
  });

  describe('validateTools', () => {
    it('should return an error message when no tools were selected', () => {
      const tools: Tool[] = [];
      const actual = validateTools(tools);
      expect(actual).toMatchInlineSnapshot(
        `"You must choose at least one tool."`
      );
    });

    it('should return an error message when Prettier was selected without Eslint', () => {
      const tools = [Tool.PRETTIER];
      const actual = validateTools(tools);
      expect(actual).toMatchInlineSnapshot(
        `"Prettier requires Eslint to be configured as well."`
      );
    });

    it('should return true otherwise', () => {
      const tools = [Tool.PRETTIER];
      const actual = validateTools(tools);
      expect(actual).toBeTruthy();
    });
  });
});
