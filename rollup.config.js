import { resolve as pathResolve } from 'path';

// Plugins
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';

// Shared config
const shared = {
  external: id =>
    /lodash|webpack-merge|yargs|child_process|path|util|fs/.test(id),
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      module: true,
      main: true,
      browser: false,
      preferBuiltins: true,
      // eslint-disable-next-line
      jail: pathResolve('.'),
      modulesOnly: true
    }),
    copy({
      'src/configs/plop/templates': 'dist/plop-templates',
      'package.json': 'dist/package.json',
      'LICENSE': 'dist/LICENSE',
      'README.md': 'dist/README.md',
      verbose: true
    })
  ]
};

// Entry files
export default [
  {
    input: 'src/index.js',
    output: { file: 'dist/index.js', format: 'cjs' },
    ...shared
  },
  {
    input: 'src/prettier.js',
    output: { file: 'dist/prettier.js', format: 'cjs' },
    ...shared
  },
  {
    input: 'src/eslint.js',
    output: { file: 'dist/eslint.js', format: 'cjs' },
    ...shared
  },
  {
    input: 'src/plop.js',
    output: { file: 'dist/plop.js', format: 'cjs' },
    ...shared
  },
  {
    input: 'src/babel.js',
    output: { file: 'dist/babel.js', format: 'cjs' },
    ...shared
  },
  {
    input: 'src/cli.js',
    output: { file: 'dist/cli.js', format: 'cjs' },
    ...shared
  }
];
