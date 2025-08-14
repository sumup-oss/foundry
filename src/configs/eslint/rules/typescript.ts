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

// import { imports } from './imports.js';
import { variables } from './variables.js';

export const typescript = {
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  // settings: {
  //   // Apply special parsing for TypeScript files
  //   'import/parsers': {
  //     '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
  //   },
  //   // Append 'ts' extensions to Airbnb 'import/resolver' setting
  //   // Original: ['.mjs', '.js', '.json']
  //   'import/resolver': {
  //     node: {
  //       extensions: ['.mjs', '.js', '.json', '.ts', '.d.ts'],
  //     },
  //   },
  //   // Append 'ts' extensions to Airbnb 'import/extensions' setting
  //   // Original: ['.js', '.mjs', '.jsx']
  //   'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
  //   // Resolve type definition packages
  //   'import/external-module-folders': ['node_modules', 'node_modules/@types'],
  // },
  rules: {
    // Replace Airbnb 'camelcase' rule with '@typescript-eslint/naming-convention'
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
    camelcase: 'off',
    // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule already takes care of this.
    '@typescript-eslint/naming-convention': [
      'error',
      // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      // Allow camelCase functions (23.2), and PascalCase functions (23.8)
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],

    // Replace Airbnb 'no-shadow' rule with '@typescript-eslint' version
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': variables.rules['no-shadow'],

    // Append 'ts' and 'tsx' to Airbnb 'import/extensions' rule
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
    // 'import/extensions': [
    //   imports.rules['import/extensions'][0],
    //   imports.rules['import/extensions'][1],
    //   {
    //     ...imports.rules['import/extensions'][2],
    //     ts: 'never',
    //     tsx: 'never',
    //   },
    // ],

    // Append 'ts' and 'tsx' extensions to Airbnb 'import/no-extraneous-dependencies' rule
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    // 'import/no-extraneous-dependencies': [
    //   imports.rules['import/no-extraneous-dependencies'][0],
    //   {
    //     ...imports.rules['import/no-extraneous-dependencies'][1],
    //     devDependencies: imports.rules[
    //       'import/no-extraneous-dependencies'
    //     ][1].devDependencies.reduce((result, devDep) => {
    //       const toAppend: string[] = [devDep];
    //       const devDepWithTs = devDep.replace(/\bjs(x?)\b/g, 'ts$1');
    //       if (devDepWithTs !== devDep) {
    //         toAppend.push(devDepWithTs);
    //       }
    //       return result.concat(toAppend);
    //     }, [] as string[]),
    //   },
    // ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // The following rules are enabled in Airbnb config, but are already checked (more thoroughly) by the TypeScript compiler
        // Some of the rules also fail in TypeScript files, for example: https://github.com/typescript-eslint/typescript-eslint/issues/662#issuecomment-507081586
        // Rules are inspired by: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts
        'constructor-super': 'off',
        'getter-return': 'off',
        'no-const-assign': 'off',
        'no-dupe-args': 'off',
        'no-dupe-class-members': 'off',
        'no-dupe-keys': 'off',
        'no-func-assign': 'off',
        'no-import-assign': 'off',
        'no-new-symbol': 'off',
        'no-obj-calls': 'off',
        'no-redeclare': 'off',
        'no-setter-return': 'off',
        'no-this-before-super': 'off',
        'no-undef': 'off',
        'no-unreachable': 'off',
        'no-unsafe-negation': 'off',
        'valid-typeof': 'off',
        // The following rules are enabled in Airbnb config, but are recommended to be disabled within TypeScript projects
        // See: https://github.com/typescript-eslint/typescript-eslint/blob/13583e65f5973da2a7ae8384493c5e00014db51b/docs/linting/TROUBLESHOOTING.md#eslint-plugin-import
        // 'import/named': 'off',
        // 'import/no-named-as-default-member': 'off',
        // Disable `import/no-unresolved`, see README.md for details
        // 'import/no-unresolved': 'off',
      },
    },
  ],
} as const;
