import nodeExternals from 'webpack-node-externals';

const makeWebpackConfig = ({ entry, withNodeExternals }) => {
  const externals = withNodeExternals ? [nodeExternals()] : [];
  return {
    optimization: {
      // We no not want to minimize our code.
      minimize: false,
    },
    performance: {
      // Turn off size warnings for entry points
      hints: false,
    },
    stats: 'verbose',
    entry,
    externals,
    mode: 'production',
    target: 'node',
    output: {
      /* memory fs path */
      path: '/',
      filename: 'service.js',
      library: 'handler',
      libraryTarget: 'commonjs',
      libraryExport: 'default',
    },
  };
};

export default makeWebpackConfig;
