import { resolve as pathResolve } from 'path';

// Plugins
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

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
    input: 'src/cli.js',
    output: { file: 'dist/cli.js', format: 'cjs' },
    ...shared
  }
];
