/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
  input: 'src/cli/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [
    resolve({
      jail: __dirname,
    }),
    json({
      include: ['package.json'],
    }),
    babel({
      configFile: path.resolve(__dirname, '../babel.config.js'),
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: (p) => {
    const deps = [
      '@tfinjs/api',
      '@tfinjs/api',
      '@tfinjs/dependency-graph',
      'assert',
      'chalk',
      'commander',
      'figures',
      'find-up',
      'fs',
      'lodash/fromPairs',
      'lodash/intersection',
      'lodash/keys',
      'memory-fs',
      'mkdirp',
      'path',
      'source-map-support/register',
      'webpack-node-externals',
      'webpack',
    ];
    const r = deps.includes(p);
    return r;
  },
};
