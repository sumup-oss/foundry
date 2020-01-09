import { Tool, ToolOptions } from '../types/shared';

import * as eslint from './eslint';
import * as husky from './husky';
import * as lintStaged from './lint-staged';
import * as plop from './plop';
import * as prettier from './prettier';
import * as semanticRelease from './semantic-release';

export const tools: { [key in Tool]?: ToolOptions } = {
  [Tool.ESLINT]: eslint,
  [Tool.HUSKY]: husky,
  [Tool.LINT_STAGED]: lintStaged,
  [Tool.PLOP]: plop,
  [Tool.PRETTIER]: prettier,
  [Tool.SEMANTIC_RELEASE]: semanticRelease
};
