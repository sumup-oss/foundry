// eslint-disable-next-line import/prefer-default-export
export const base = {
  linters: {
    '*.js': ['foundry run eslint --fix', 'git add']
  }
};
