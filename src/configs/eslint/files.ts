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
    '**/jest.config.*', // Jest config and setup
    '**/vite.config.*', // Vite config
    '**/vitest.config*', // Vitest config and setup
    '**/.storybook/**/*', // Storybook config
    '**/.eslintrc.*', // ESLint config
    '**/eslint.config.*', // ESLint config
    '**/.huskyrc.*', // Husky config
    '**/husky.config.*', // Husky config
    '**/.stylelintrc.*', // Stylelint config
    '**/stylelint.config.*', // Stylelint config
    '**/lint-staged.config.*', // lint-staged config
    '**/vue.config.js', // Vue-CLI config
    '**/webpack.config.*', // Webpack config
    '**/rollup.config.*', // Rollup config
    '**/svgo.config.*', // SVGO config
    '**/gulpfile.*', // Gulp config
    '**/Gruntfile{,.js}', // Grunt config
    '**/protractor.conf.*', // Protractor config
    '**/karma.conf.*', // Karma config
  ],
  ignores: [
    '**/node_modules/**', // dependencies
    '**/dist/**', // generated assets
    '**/.astro/**', // generated assets (Astro)
    '**/.next/**', // generated assets (Next.js)
    '**/next-env.d.ts', // generated types (Next.js)
    '**/build/**', // generated assets (create-react-app, Remix)
    '**/storybook-static/**', // generated assets (Storybook)
    '**/public/**', // (generated) assets
    '**/vendor/**', // third-party assets
    '**/__reports__/**', // coverage reports
    '**/__coverage__/**', // coverage reports
    '**/*.snap', // snapshot files
    '**/*.css', // CSS files
  ],
  storybook: [
    '**/.storybook/**/*', // Storybook config
    '**/*.{story,stories}.*', // Storybook stories
  ],
  tests: [
    '**/test/**', // tape, common npm pattern
    '**/tests/**', // also common npm pattern
    '**/spec/**', // mocha, rspec-like pattern
    '**/__tests__/**', // Jest pattern
    '**/__mocks__/**', // Jest pattern
    '**/__fixtures__/**/*', // Jest pattern
    '**/*Fixtures.*', // pattern at SumUp
    '**/test.*', // repos with a single test file
    '**/test-*.*', // repos with multiple top-level test files
    '**/*{.,_}{test,spec}.*', // tests where the extension or filename suffix denotes that it is a test
    '**/jest.*', // Jest config and setup
    '**/vite.*', // Vite config
    '**/vitest.*', // Vitest config and setup
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
