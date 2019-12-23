export enum Tool {
  ESLINT = 'eslint',
  PRETTIER = 'prettier',
  PLOP = 'plop',
  HUSKY = 'husky',
  LINT_STAGED = 'lint-staged',
  SEMANTIC_RELEASE = 'semantic-release'
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
  tools: Tool[];
  language?: Language;
  target?: Target;
  publish?: boolean;
  configDir: string;
}
