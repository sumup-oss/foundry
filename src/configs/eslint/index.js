import merge from 'webpack-merge';

export const overwritePresets = merge({
  customizeArray(a, b, key) {
    return key === 'extends' ? b : undefined;
  }
});

export const base = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier', 'jest', 'cypress'],
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
      impliedStrict: true
    }
  },
  overrides: [
    {
      files: ['**/*spec.js', 'e2e/**/*.js'],
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
        'jest/globals': true,
        'cypress/globals': true
      }
    },
    {
      files: ['*.config.js', '.*rc.js'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true
          }
        ]
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
    'plugin:prettier/recommended',
    'prettier/react'
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'emotion'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'emotion/jsx-import': 'error',
    'emotion/no-vanilla': 'error',
    'emotion/import-from-emotion': 'error',
    'emotion/styled-import': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true
      }
    ]
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true
  }
});

export const copyright = {
    plugins:['notice'],
    rules: {
      'notice/notice': [
        'error',
        {
          templateFile: `${__dirname}/copyright.tpl`,
          templateVars:{ NAME: 'SumUp Ltd.' },
          varRegexps:{ NAME: /SumUp Ltd./ }
        }
      ]
    }
}

export const ESLINT_CONFIGS = ['base', 'node', 'react'];
