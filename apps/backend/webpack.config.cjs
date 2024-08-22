const { composePlugins, withNx } = require('@nx/webpack');
const nodeExternals = require('webpack-node-externals');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // https://github.com/nrwl/nx/issues/7872#issuecomment-997460397
  return {
    ...config,
    externalsPresets: {
      node: true
    },
    output: {
      ...config.output,
      module: true,
      libraryTarget: 'module',
      chunkFormat: 'module',
      library: {
        type: 'module'
      },
      environment: {
        module: true
      }
    },
    experiments: {
      outputModule: true,
    },
    externals: nodeExternals({
      importType: 'module',
      allowlist: ['web-push', 'handlebars'],
    })
  };
});
