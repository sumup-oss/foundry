import * as eslint from './eslint';
import * as babel from './babel';
import * as prettier from './prettier';
import * as plop from './plop';
import * as lintStaged from './lint-staged';
import * as husky from './husky';

export const SUPPORTED_CONFIGS = [
  'eslint',
  'babel',
  'prettier',
  'plop',
  'husky',
  'lint-staged'
];

export { eslint, babel, prettier, plop, lintStaged, husky };
