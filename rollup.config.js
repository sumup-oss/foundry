/**
 * Copyright 2019, SumUp Ltd.
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

import { resolve as pathResolve, join as pathJoin } from 'path';

// Plugins
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';
import cleanup from 'rollup-plugin-cleanup';
import { name, version } from './package.json';

// Shared config
const shared = {
  external: id =>
    /lodash|webpack-merge|yargs|child_process|path|util|fs/.test(id),
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      preferBuiltins: true,
      jail: pathResolve('.'),
      modulesOnly: true
    }),
    cleanup({
      comments: 'none',
      sourcemap: false
    })
  ]
};

const banner = `/**
 * ${name}, v${version}
 * Build time: ${new Date().toUTCString()}
 *
 * Copyright 2018, SumUp Ltd.
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
`;

// Entry files
export default [
  {
    ...shared,
    input: 'src/index.js',
    output: { file: 'dist/index.js', format: 'cjs' },
    plugins: [
      ...shared.plugins,
      copy({
        targets: {
          'src/configs/eslint/copyright.tpl': 'dist/copyright.tpl',
          'src/configs/plop/templates': 'dist/plop-templates',
          'package.json': 'dist/package.json',
          LICENSE: 'dist/LICENSE',
          'README.md': 'dist/README.md'
        },
        verbose: true
      })
    ]
  },
  {
    input: 'src/prettier.js',
    output: { file: 'dist/prettier.js', format: 'cjs', banner },
    ...shared
  },
  {
    input: 'src/eslint.js',
    output: { file: 'dist/eslint.js', format: 'cjs', banner },
    ...shared
  },
  {
    input: 'src/plop.js',
    output: { file: 'dist/plop.js', format: 'cjs', banner },
    ...shared
  },
  {
    input: 'src/babel.js',
    output: { file: 'dist/babel.js', format: 'cjs', banner },
    ...shared
  },
  {
    input: 'src/lint-staged.js',
    output: { file: 'dist/lint-staged.js', format: 'cjs', banner },
    ...shared
  },
  {
    input: 'src/husky.js',
    output: { file: 'dist/husky.js', format: 'cjs', banner },
    ...shared
  },
  {
    input: 'src/semantic-release.js',
    output: { file: 'dist/semantic-release.js', format: 'cjs', banner },
    ...shared
  },
  {
    input: 'src/cli.js',
    output: {
      file: 'dist/cli',
      format: 'cjs',
      banner: `#!/usr/bin/env node

${banner}
`
    },
    ...shared
  }
];
