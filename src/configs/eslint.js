import merge from 'webpack-merge';

export const overwritePresets = merge({
  customizeArray(a, b, key) {
    return key === 'extends' ? b : undefined;
  }
});

export const base = {
  extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  rules: {
    'no-use-before-define': ['error', { functions: false }],
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true
      }
    ],
    curly: ['error', 'all'],
    'no-underscore-dangle': [
      'error',
      { allow: ['__DEV__', '__PRODUCTION__', '__TEST__'] }
    ],
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['*.js', '**/*.story.js', '**/*.spec.js']
      }
    ]
  },
  globals: {
    __DEV__: true,
    __PRODUCTION__: true,
    __TEST__: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      ecmaVersion: 2017,
      impliedStrict: true,
      jsx: true
    }
  },
  overrides: [
    {
      files: ['**/*spec.js'],
      rules: {
        'max-len': [
          'error',
          {
            code: 80,
            tabWidth: 2,
            ignorePattern: '^\\s*it(?:\\.(?:skip|only))?\\(',
            ignoreComments: true,
            ignoreUrls: true
          }
        ]
      },
      globals: {
        mount: true,
        shallow: true,
        render: true,
        create: true,
        axe: true,
        renderToHtml: true
      },
      env: {
        'jest/globals': true
      }
    }
  ]
};

// TODO: add node specific config here.
export const node = overwritePresets(base, { env: { node: true } });

export const react = overwritePresets(base, {
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'prettier/react'
  ],
  plugins: ['react', 'jsx-a11y'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true
  }
});

export const ESLINT_CONFIGS = ['base', 'node', 'react'];
