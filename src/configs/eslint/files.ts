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

export const extensions = {
  javascript: ['.js', '.jsx', '.cjs', '.mjs'],
  typescript: ['.ts', '.tsx', '.cts', '.mts'],
} satisfies Record<string, string[]>;

export const files = {
  javascript: [toGlobPattern('**/*', extensions.javascript)],
  typescript: [toGlobPattern('**/*', extensions.typescript)],
  configs: [
    '**/jest.config.*', // jest config and setup
    '**/vite.config.*', // vite config
    '**/vitest.config*', // vitest config and setup
    '**/.storybook/**/*', // storybook config
    '**/.eslintrc.*', // eslint config
    '**/eslint.config.*', // eslint config
    '**/.huskyrc.*', // husky config
    '**/.stylelintrc.*', // stylelint config
    '**/lint-staged.config.*', // lint-staged config
    '**/vue.config.js', // vue-cli config
    '**/webpack.config.*', // webpack config
    '**/rollup.config.*', // rollup config
    '**/svgo.config.*', // svgo config
    '**/gulpfile.*', // gulp config
    '**/Gruntfile{,.js}', // grunt config
    '**/protractor.conf.*', // protractor config
    '**/karma.conf.*', // karma config
  ],
  stories: [
    '**/.storybook/**/*', // storybook config
    '**/*.{story,stories}.*', // storybook stories
  ],
  tests: [
    '**/test/**', // tape, common npm pattern
    '**/tests/**', // also common npm pattern
    '**/spec/**', // mocha, rspec-like pattern
    '**/__tests__/**', // jest pattern
    '**/__mocks__/**', // jest pattern
    '**/__fixtures__/**/*', // jest pattern
    '**/*Fixtures.*', // pattern at SumUp
    '**/test.*', // repos with a single test file
    '**/test-*.*', // repos with multiple top-level test files
    '**/*{.,_}{test,spec}.*', // tests where the extension or filename suffix denotes that it is a test
    '**/jest.*', // jest config and setup
    '**/vite.*', // vite config
    '**/vitest.*', // vitest config and setup
    '**/setupTests.*', // test setup
    '**/test-utils.*', // test utils
  ],
  types: [
    '**/*.d.ts', // type declaration files
  ],
} satisfies Record<string, string[]>;

function toGlobPattern(prefix: string, exts: string[]) {
  const patterns = exts
    .map((extension) => extension.replace(/^\./, ''))
    .join(',');
  return `${prefix.replace(/$\./, '')}.{${patterns}}`;
}
