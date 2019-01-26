import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins: [
    babel({
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
