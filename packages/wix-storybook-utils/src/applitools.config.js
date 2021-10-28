const applitoolsConfig = require('storybook-snapper/config/applitools.config');

module.exports = applitoolsConfig({
  config: {
    testConcurrency: 20,
    batchName: 'wix-storybook-utils',
  },
});
