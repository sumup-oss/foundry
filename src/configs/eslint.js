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
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true
      }
    ],
    // TODO: can you remove these when you have a config?
    'prettier/prettier': [
      'error',
      {
        singleQuote: true
      }
    ],
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['*.js', 'src/**/*.story.js', 'src/**/*.spec.js']
      }
    ]
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
      files: ['src/**/*spec.js'],
      rules: {
        'max-len': [
          'error',
          {
            code: 80,
            tabWidth: 2,
            ignorePattern: '^\\s*it(:?.(:?skip|only))\\(',
            ignoreComments: true,
            ignoreUrls: true
          }
        ]
      },
      env: {
        'jest/globals': true
      }
    }
  ]
};

// TODO: add node specific config here.
export const node = merge(base, { env: { node: true } });

// TODO: Use Airbnb default config here!
// https://www.npmjs.com/package/eslint-config-airbnb
export const react = overwritePresets(exports.base, {
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'prettier',
    'prettier/react'
  ],
  plugins: ['react'],
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
