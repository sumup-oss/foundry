import * as eslint from './eslint';
import * as babel from './babel';
import * as prettier from './prettier';
import * as plop from './plop';
import * as lintStaged from './lint-staged';
import * as husky from './husky';
import * as semanticRelease from './semantic-release';

export const SUPPORTED_CONFIGS = [
  'eslint',
  'babel',
  'prettier',
  'plop',
  'husky',
  'lint-staged',
  'semantic-release'
];

export { eslint, babel, prettier, plop, lintStaged, husky, semanticRelease };
