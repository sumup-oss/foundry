import { writeFile } from 'fs';
import bootstrap from './bootstrap';
import { eslint, babel } from '../configs';

jest.mock('fs', () => ({ writeFile: jest.fn() }));

const { ESLINT_CONFIGS } = eslint;
const { BABEL_CONFIGS } = babel;

describe('bootstrap command', () => {
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
      bootstrap(params);

      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining('eslint'),
        expect.any(String),
        expect.any(Function)
      );
    });

    it('should use the base config when no config is specified', () => {
      const params = Object.assign({}, defaultParams, { eslint: true });
      bootstrap(params);

      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('base'),
        expect.any(Function)
      );
    });

    ESLINT_CONFIGS.forEach(config => {
      it(`should write the config file for ${config}`, () => {
        const params = { ...defaultParams, eslint: config };
        bootstrap(params);

        expect(writeFile).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining(config),
          expect.any(Function)
        );
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
      bootstrap(params);
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining('babel'),
        expect.any(String),
        expect.any(Function)
      );
    });

    it('should create the babel.config.js preset file', () => {
      const params = Object.assign({}, defaultParams, { babel: 'base' });
      bootstrap(params);

      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('base'),
        expect.any(Function)
      );
    });

    it(`should use the base config when no config is specified`, () => {
      const params = Object.assign({}, defaultParams, { babel: true });
      bootstrap(params);

      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('base'),
        expect.any(Function)
      );
    });

    BABEL_CONFIGS.forEach(config => {
      it(`should write the config file for ${config}`, () => {
        const params = Object.assign({}, defaultParams, { babel: config });
        bootstrap(params);

        expect(writeFile).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining(config),
          expect.any(Function)
        );
      });
    });
  });

  describe.skip('when passed the prettier flag', () => {
    it('should write the prettier.config.js', () => {});
  });
});
