/**
 * Copyright 2025, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import js from '@eslint/js';
import type { ESLint, Linter } from 'eslint';
import { createOxcImportResolver } from 'eslint-import-resolver-oxc';
import importX from 'eslint-plugin-import-x';

import { extensions, files } from './files.js';

// Adapted from https://github.com/9romise/eslint-import-resolver-oxc/blob/main/src/typings.ts
type ImportResolver = {
  interfaceVersion: 3;
  name: string;
  resolve: (
    source: string,
    file: string,
  ) => {
    found: boolean;
    path: string | null | undefined;
  };
};

export const javascript = {
  name: 'foundry/javascript',
  files: [...files.javascript, ...files.typescript],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        impliedStrict: true,
      },
    },
  },
  settings: {
    'import-x/resolver-next': [createOxcImportResolver() as ImportResolver],
    'import-x/extensions': [...extensions.javascript, ...extensions.typescript],
    'import-x/ignore': [
      'node_modules',
      '\\.(coffee|scss|css|less|hbs|svg|json)$',
    ],
  },
  plugins: {
    'import-x': importX as unknown as ESLint.Plugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...importX.configs.recommended.rules,

    // Covered by Biome
    'array-callback-return': 'off',
    'constructor-super': 'off',
    'curly': 'off',
    'default-case-last': 'off',
    'default-case': 'off',
    'default-param-last': 'off',
    'dot-notation': 'off',
    'eqeqeq': 'off',
    'for-direction': 'off',
    'getter-return': 'off',
    'grouped-accessor-pairs': 'off',
    'guard-for-in': 'off',
    'no-array-constructor': 'off',
    'no-async-promise-executor': 'off',
    'no-bitwise': 'off',
    'no-case-declarations': 'off',
    'no-class-assign': 'off',
    'no-compare-neg-zero': 'off',
    'no-cond-assign': 'off',
    'no-console': 'off',
    'no-const-assign': 'off',
    'no-constant-condition': 'off',
    'no-constructor-return': 'off',
    'no-control-regex': 'off',
    'no-debugger': 'off',
    'no-dupe-args': 'off',
    'no-dupe-class-members': 'off',
    'no-dupe-else-if': 'off',
    'no-dupe-keys': 'off',
    'no-duplicate-case': 'off',
    'no-else-return': 'off',
    'no-empty-character-class': 'off',
    'no-empty-function': 'off',
    'no-empty-pattern': 'off',
    'no-empty-static-block': 'off',
    'no-empty': 'off',
    'no-eval': 'off',
    'no-ex-assign': 'off',
    'no-extra-boolean-cast': 'off',
    'no-extra-label': 'off',
    'no-fallthrough': 'off',
    'no-func-assign': 'off',
    'no-global-assign': 'off',
    'no-implicit-coercion': 'off',
    'no-import-assign': 'off',
    'no-inner-declarations': 'off',
    'no-irregular-whitespace': 'off',
    'no-label-var': 'off',
    'no-labels': 'off',
    'no-lone-blocks': 'off',
    'no-lonely-if': 'off',
    'no-loss-of-precision': 'off',
    'no-misleading-character-class': 'off',
    'no-negated-condition': 'off',
    'no-nested-ternary': 'off',
    'no-new-native-nonconstructor': 'off',
    'no-new-symbol': 'off',
    'no-new-wrappers': 'off',
    'no-nonoctal-decimal-escape': 'off',
    'no-obj-calls': 'off',
    'no-octal-escape': 'off',
    'no-param-reassign': 'off',
    'no-prototype-builtins': 'off',
    'no-redeclare': 'off',
    'no-regex-spaces': 'off',
    'no-restricted-globals': 'off',
    'no-restricted-imports': 'off',
    'no-self-assign': 'off',
    'no-self-compare': 'off',
    'no-sequences': 'off',
    'no-setter-return': 'off',
    'no-shadow-restricted-names': 'off',
    'no-sparse-array': 'off',
    'no-template-curly-in-string': 'off',
    'no-this-before-super': 'off',
    'no-throw-literal': 'off',
    'no-undef-init': 'off',
    'no-undef': 'off',
    'no-unneeded-ternary': 'off',
    'no-unreachable': 'off',
    'no-unsafe-finally': 'off',
    'no-unsafe-negation': 'off',
    'no-unsafe-optional-chaining': 'off',
    'no-unused-labels': 'off',
    'no-unused-private-class-members': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-backreference': 'off',
    'no-useless-catch': 'off',
    'no-useless-computed-key': 'off',
    'no-useless-concat': 'off',
    'no-useless-constructor': 'off',
    'no-useless-escape': 'off',
    'no-useless-rename': 'off',
    'no-var': 'off',
    'no-void': 'off',
    'no-with': 'off',
    'object-shorthand': 'off',
    'one-var': 'off',
    'operator-assignment': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-const': 'off',
    'prefer-exponentiation-operator': 'off',
    'prefer-numeric-literals': 'off',
    'prefer-object-has-own': 'off',
    'prefer-object-spread': 'off',
    'prefer-regex-literals': 'off',
    'prefer-rest-params': 'off',
    'prefer-template': 'off',
    'require-await': 'off',
    'require-yield': 'off',
    'symbol-description': 'off',
    'use-isnan': 'off',
    'valid-typeof': 'off',
    'yoda': 'off',

    /**
     * Best practices
     */

    // treat var statements as if they were block scoped
    // https://eslint.org/docs/latest/rules/block-scoped-var
    'block-scoped-var': 'error',

    // enforce that class methods use "this"
    // https://eslint.org/docs/latest/rules/class-methods-use-this
    'class-methods-use-this': ['error', { exceptMethods: [] }],

    // require return statements to either always or never specify values
    // https://eslint.org/docs/latest/rules/consistent-return
    'consistent-return': 'error',

    // enforce a maximum number of classes per file
    // https://eslint.org/docs/latest/rules/max-classes-per-file
    'max-classes-per-file': ['error', 1],

    // disallow the use of alert, confirm, and prompt
    // https://eslint.org/docs/latest/rules/no-alert
    'no-alert': 'error',

    // disallow use of arguments.caller or arguments.callee
    // https://eslint.org/docs/latest/rules/no-caller
    'no-caller': 'error',

    // disallow adding to native types
    // https://eslint.org/docs/latest/rules/no-extend-native
    'no-extend-native': 'error',

    // disallow unnecessary function binding
    // https://eslint.org/docs/latest/rules/no-extra-bind
    'no-extra-bind': 'error',

    // disallow use of eval()-like methods
    // https://eslint.org/docs/latest/rules/no-implied-eval
    'no-implied-eval': 'error',

    // disallow usage of __iterator__ property
    // https://eslint.org/docs/latest/rules/no-iterator
    'no-iterator': 'error',

    // disallow creation of functions within loops
    // https://eslint.org/docs/latest/rules/no-loop-func
    'no-loop-func': 'error',

    // disallow use of multiline strings
    // https://eslint.org/docs/latest/rules/no-multi-str
    'no-multi-str': 'error',

    // disallow use of new operator when not part of the assignment or comparison
    // https://eslint.org/docs/latest/rules/no-new
    'no-new': 'error',

    // disallow use of new operator for Function object
    // https://eslint.org/docs/latest/rules/no-new-func
    'no-new-func': 'error',

    // Disallow calls to the Object constructor without an argument
    // https://eslint.org/docs/latest/rules/no-object-constructor
    'no-object-constructor': 'error',

    // disallow usage of __proto__ property
    // https://eslint.org/docs/latest/rules/no-proto
    'no-proto': 'error',

    // disallow certain object properties
    // https://eslint.org/docs/latest/rules/no-restricted-properties
    'no-restricted-properties': [
      'error',
      {
        property: '__defineGetter__',
        message: 'Please use `Object.defineProperty` instead.',
      },
      {
        property: '__defineSetter__',
        message: 'Please use `Object.defineProperty` instead.',
      },
    ],

    // disallow use of assignment in return statement
    // https://eslint.org/docs/latest/rules/no-return-assign
    'no-return-assign': ['error', 'always'],

    // disallow use of `javascript:` urls.
    // https://eslint.org/docs/latest/rules/no-script-url
    'no-script-url': 'error',

    // disallow usage of expressions in statement position
    // https://eslint.org/docs/latest/rules/no-unused-expressions
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      },
    ],

    // disallow redundant return; keywords
    // https://eslint.org/docs/latest/rules/no-useless-return
    'no-useless-return': 'error',

    // require using Error objects as Promise rejection reasons
    // https://eslint.org/docs/latest/rules/prefer-promise-reject-errors
    'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

    // Suggest using named capture group in regular expression
    // https://eslint.org/docs/latest/rules/prefer-named-capture-group
    'prefer-named-capture-group': 'warn',

    // require use of the second argument for parseInt()
    // https://eslint.org/docs/latest/rules/radix
    'radix': 'error',

    // requires to declare all vars on top of their containing scope
    // https://eslint.org/docs/latest/rules/vars-on-top
    'vars-on-top': 'error',

    /**
     * Errors
     */

    // Disallow await inside of loops
    // https://eslint.org/docs/latest/rules/no-await-in-loop
    'no-await-in-loop': 'error',

    // Disallow returning values from Promise executor functions
    // https://eslint.org/docs/latest/rules/no-promise-executor-return
    'no-promise-executor-return': 'error',

    // Disallow loops with a body that allows only one iteration
    // https://eslint.org/docs/latest/rules/no-unreachable-loop
    'no-unreachable-loop': [
      'error',
      {
        ignore: [], // WhileStatement, DoWhileStatement, ForStatement, ForInStatement, ForOfStatement
      },
    ],

    /**
     * ES6
     */

    // enforces no braces where they can be omitted
    // https://eslint.org/docs/latest/rules/arrow-body-style
    // TODO: enable requireReturnForObjectLiteral?
    'arrow-body-style': [
      'error',
      'as-needed',
      { requireReturnForObjectLiteral: false },
    ],

    // disallow specified names in exports
    // https://eslint.org/docs/latest/rules/no-restricted-exports
    'no-restricted-exports': [
      'error',
      {
        restrictedNamedExports: [
          'default', // use `export default` to provide a default export
          'then', // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most Node ESM versions
        ],
      },
    ],

    // Prefer destructuring from arrays and objects
    // https://eslint.org/docs/latest/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // suggest using the spread syntax instead of .apply()
    // https://eslint.org/docs/latest/rules/prefer-spread
    'prefer-spread': 'error',

    // ECMAScript modules always have strict mode semantics
    // https://eslint.org/docs/latest/rules/strict
    'strict': ['error', 'never'],

    /**
     * Style
     */

    // require camel case names
    'camelcase': ['error', { properties: 'never', ignoreDestructuring: false }],

    // enforces use of function declarations or expressions
    // https://eslint.org/docs/rules/func-style
    'func-style': [
      'error',
      'declaration',
      {
        allowArrowFunctions: true,
        allowTypeAnnotation: true,
      },
    ],

    // require a capital letter for constructors
    // https://eslint.org/docs/latest/rules/new-cap
    'new-cap': [
      'error',
      {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: [
          'Immutable.Map',
          'Immutable.Set',
          'Immutable.List',
        ],
      },
    ],

    // disallow use of the continue statement
    // https://eslint.org/docs/latest/rules/no-continue
    'no-continue': 'error',

    // disallow use of chained assignment expressions
    // https://eslint.org/docs/latest/rules/no-multi-assign
    'no-multi-assign': 'error',

    // disallow use of the Object constructor
    // https://eslint.org/docs/latest/rules/no-new-object
    'no-new-object': 'error',

    // disallow use of unary operators, ++ and --
    // https://eslint.org/docs/latest/rules/no-plusplus
    'no-plusplus': 'error',

    // disallow certain syntax forms
    // https://eslint.org/docs/latest/rules/no-restricted-syntax
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],

    // disallow dangling underscores in identifiers
    // https://eslint.org/docs/latest/rules/no-underscore-dangle
    'no-underscore-dangle': [
      'error',
      {
        allow: [],
        allowAfterThis: false,
        allowAfterSuper: false,
        enforceInMethodNames: true,
      },
    ],

    // require or disallow the Unicode Byte Order Mark
    // https://eslint.org/docs/latest/rules/unicode-bom
    'unicode-bom': ['error', 'never'],

    /**
     * Variables
     */

    // disallow deletion of variables
    // https://eslint.org/docs/latest/rules/no-delete-var
    'no-delete-var': 'error',

    // disallow declaration of variables already declared in the outer scope
    // https://eslint.org/docs/latest/rules/no-shadow
    'no-shadow': 'error',

    /**
     * Imports
     */

    // ensure imports point to files/modules that can be resolved
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unresolved.md
    'import-x/no-unresolved': [
      'error',
      { commonjs: true, caseSensitive: true },
    ],

    // do not allow a default import name to match a named export
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-as-default.md
    'import-x/no-named-as-default': 'error',

    // warn on accessing default export property names that are also named exports
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-as-default-member.md
    'import-x/no-named-as-default-member': 'error',

    // disallow use of jsdoc-marked-deprecated imports
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-deprecated.md
    'import-x/no-deprecated': 'warn',

    // forbid mutable exports
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-mutable-exports.md
    'import-x/no-mutable-exports': 'error',

    // disallow AMD require/define
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-amd.md
    'import-x/no-amd': 'error',

    // disallow non-import statements appearing before import statements
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/first.md
    'import-x/first': 'error',

    // disallow duplicate imports
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-duplicates.md
    'import-x/no-duplicates': 'error',

    // ensure consistent use of file extension within the import path
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/extensions.md
    'import-x/extensions': 'off',

    // ensure absolute imports are above relative imports and that unassigned imports are ignored
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/order.md
    'import-x/order': 'off',

    // require a newline after the last import/require in a group
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/newline-after-import.md
    'import-x/newline-after-import': 'error',

    // require modules with a single export to use a default export
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/prefer-default-export.md
    'import-x/prefer-default-export': 'off',

    // forbid import of modules using absolute paths
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-absolute-path.md
    'import-x/no-absolute-path': 'error',

    // forbid require() calls with expressions
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-dynamic-require.md
    'import-x/no-dynamic-require': 'error',

    // Forbid Webpack loader syntax in imports
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-webpack-loader-syntax.md
    'import-x/no-webpack-loader-syntax': 'error',

    // prevent importing the default as if it were named
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-named-default.md
    'import-x/no-named-default': 'error',

    // forbid a module from importing itself
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-self-import.md
    'import-x/no-self-import': 'error',

    // Ensures that there are no useless path segments
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-useless-path-segments.md
    'import-x/no-useless-path-segments': ['error', { commonjs: true }],

    // reports the use of import declarations with CommonJS exports in any module except for the main module.
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-import-module-exports.md
    'import-x/no-import-module-exports': ['error', { exceptions: [] }],

    // use this rule to prevent importing packages through relative paths.
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-relative-packages.md
    'import-x/no-relative-packages': 'error',

    // reports the use of empty named import blocks.
    // https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-empty-named-blocks.md
    'import-x/no-empty-named-blocks': 'error',
  },
} satisfies Linter.Config;
