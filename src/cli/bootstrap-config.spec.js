import { writeFile } from 'fs';
import bootstrapConfig from './bootstrap-config';
import { eslint, babel } from '../configs';

jest.mock('fs', () => ({ writeFile: jest.fn() }));

const { ESLINT_CONFIGS } = eslint;
const { BABEL_CONFIGS } = babel;

describe('bootstrap-config command', () => {
  const defaultParams = {
    targetDir: '/some/cool/path',
    all: false
  };

  it.skip('should write all configs by default', () => {});

  it.skip('should write configs to the current working directory by default', () => {});

  it.skip('should write configs to the location specified by the targetDir flag', () => {});

  describe('when passed the eslint param', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create the eslintrc', () => {
      const params = Object.assign({}, defaultParams, { eslint: 'base' });
      bootstrapConfig(params);
      const actualPath = writeFile.mock.calls[0][0];
      const writesEslintRc = new RegExp('eslintrc').test(actualPath);
      expect(writesEslintRc).toBeTruthy();
    });

    it(`should use the base config when no config is specified`, () => {
      const params = Object.assign({}, defaultParams, { eslint: true });
      bootstrapConfig(params);
      const actualContent = writeFile.mock.calls[0][1];
      const importsCorrectPreset = new RegExp('base').test(actualContent);
      expect(importsCorrectPreset).toBeTruthy();
    });

    ESLINT_CONFIGS.forEach(config => {
      it(`should write the config file for ${config}`, () => {
        const params = Object.assign({}, defaultParams, { eslint: config });
        bootstrapConfig(params);
        const actualContent = writeFile.mock.calls[0][1];
        const importsCorrectPreset = new RegExp(config).test(actualContent);
        expect(importsCorrectPreset).toBeTruthy();
      });
    });
  });

  describe('when passed the babel flag', () => {
    // For the babel configuration we write two files (.babelrc and
    // babel.config.js). That's why the indicees for writeFile calls are
    // different then for eslint.
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create the .babelrc', () => {
      const params = Object.assign({}, defaultParams, { babel: 'base' });
      bootstrapConfig(params);
      const actualPath = writeFile.mock.calls[0][0];
      const writesEslintRc = new RegExp('babelrc').test(actualPath);
      expect(writesEslintRc).toBeTruthy();
    });

    it('should create the babel.config.js preset file', () => {
      const params = Object.assign({}, defaultParams, { babel: 'base' });
      bootstrapConfig(params);
      const actualPath = writeFile.mock.calls[1][0];
      const writesEslintRc = new RegExp('babel.config.js').test(actualPath);
      expect(writesEslintRc).toBeTruthy();
    });

    it(`should use the base config when no config is specified`, () => {
      const params = Object.assign({}, defaultParams, { babel: true });
      bootstrapConfig(params);
      const actualContent = writeFile.mock.calls[1][1];
      const importsCorrectPreset = new RegExp('base').test(actualContent);
      expect(importsCorrectPreset).toBeTruthy();
    });

    BABEL_CONFIGS.forEach(config => {
      it(`should write the config file for ${config}`, () => {
        const params = Object.assign({}, defaultParams, { babel: config });
        bootstrapConfig(params);
        const actualContent = writeFile.mock.calls[1][1];
        const importsCorrectPreset = new RegExp(config).test(actualContent);
        expect(importsCorrectPreset).toBeTruthy();
      });
    });
  });

  describe.skip('when passed the prettier flag', () => {
    it('should write the prettier.config.js', () => {});
  });
});
