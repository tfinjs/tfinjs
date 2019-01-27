/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      configFile: path.resolve(__dirname, '../babel.config.js'),
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: (p) => {
    const deps = [
      'memory-fs',
      'webpack',
      'find-up',
      'resolve',
      'lodash/get',
      'webpack-node-externals',
      '@yarnpkg/lockfile',
      'eol',
      'assert',
      'adm-zip',
      'fs',
      'path',
    ];
    const r = deps.includes(p);
    return r;
    // return true;
  },
};
