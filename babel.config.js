module.exports = (api) => {
  const isTest = api.env('test');

  const presetEnvOptions = isTest ? {
    targets: {
      node: 'current',
    },
  } : {
    targets: {
      node: '8.10',
    },
  };

  return {
    presets: [
      [
        '@babel/preset-env',
        presetEnvOptions,
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };
};
