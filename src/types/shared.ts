export enum Preset {
  LINT = 'lint',
  RELEASE = 'release',
  TEMPLATES = 'templates'
}

export enum Tool {
  ESLINT = 'eslint',
  PRETTIER = 'prettier',
  HUSKY = 'husky',
  LINT_STAGED = 'lint-staged',
  PLOP = 'plop',
  SEMANTIC_RELEASE = 'semantic-release'
}

export enum Prompt {
  LANGUAGE = 'language',
  ENVIRONMENTS = 'environments',
  FRAMEWORKS = 'frameworks',
  OPEN_SOURCE = 'open-source',
  PUBLISH = 'publish'
}

export enum Language {
  TYPESCRIPT = 'TypeScript',
  JAVASCRIPT = 'JavaScript'
}

export enum Environment {
  NODE = 'Node',
  BROWSER = 'Browser'
}

export enum Framework {
  REACT = 'React',
  EMOTION = 'Emotion',
  JEST = 'Jest'
}

export interface Options {
  presets: Preset[];
  configDir: string;
  language?: Language;
  environments?: Environment[];
  frameworks?: Framework[];
  openSource?: boolean;
  publish?: boolean;
}

export type File = {
  name: string;
  content: string;
  overwrite?: boolean;
};

export type Scripts = {
  [key: string]: string;
};

export interface ToolOptions {
  files?: (options: Options) => File[];
  scripts?: (options: Options) => Scripts;
}
