const plugin = {
  name: 'define-version',
  setup(build) {
    build.initialOptions.define.APP_VERSION = JSON.stringify(process.env.APP_VERSION ?? 'v0.0.0');
  },
};
module.exports = plugin;
