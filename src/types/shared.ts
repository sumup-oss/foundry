export enum Tool {
  ESLINT = 'eslint',
  PRETTIER = 'prettier',
  HUSKY = 'husky',
  LINT_STAGED = 'lint-staged',
  PLOP = 'plop',
  SEMANTIC_RELEASE = 'semantic-release'
}

export enum Preset {
  LINT = 'lint',
  RELEASE = 'release',
  TEMPLATE = 'template'
}

export enum Language {
  TYPESCRIPT = 'TypeScript',
  JAVASCRIPT = 'JavaScript'
}

export enum Target {
  NODE = 'Node',
  BROWSER = 'Browser',
  REACT = 'React'
}

export type Presets = {
  [key in Preset]: Tool[];
};

export interface Options {
  presets: Preset[];
  language?: Language;
  target?: Target;
  publish?: boolean;
  configDir: string;
}
