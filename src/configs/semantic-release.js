// eslint-disable-next-line import/prefer-default-export
export const base = {
  branches: [
    'master',
    'next',
    { name: 'alpha', prerelease: true },
    { name: 'beta', prerelease: true }
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github'
  ]
};

export const module = Object.assign(base, {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github'
  ]
});

export const SEMANTIC_RELEASE_CONFIGS = ['base', 'module'];
