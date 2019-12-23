declare module 'inquirer-fuzzy-path' {
  import inquirer from 'inquirer';

  class PathPrompt implements inquirer.prompts.PromptConstructor {
    status: 'pending' | 'idle' | 'loading' | 'answered' | 'done';
    run: () => Promise<any>;
  }

  export = PathPrompt;
}
