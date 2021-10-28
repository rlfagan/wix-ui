const path = require('path');
const applitoolsConfig = require('storybook-snapper/config/applitools.config');

module.exports = applitoolsConfig({
  config: {
    testConcurrency: 60,
    batchName: 'wix-storybook-utils',
    storybookConfigDir: path.resolve(__dirname, './'),
  },
});
