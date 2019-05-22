// eslint-disable-next-line import/prefer-default-export
export const base = {
  branches: [
    'master',
    'next',
    'canary',
    { name: 'alpha', prerelease: true },
    { name: 'beta', prerelease: true }
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    '@semantic-release/git'
  ]
};

export const modules = Object.assign({}, base, {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git'
  ]
});

export const SEMANTIC_RELEASE_CONFIGS = ['base', 'modules'];
