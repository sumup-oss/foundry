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
  TEMPLATES = 'templates'
}

export enum Prompt {
  LANGUAGE = 'language',
  TARGET = 'target',
  PUBLISH = 'publish'
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

export interface Options {
  presets: Preset[];
  configDir: string;
  language?: Language;
  target?: Target;
  publish?: boolean;
}
