const DecorateMainConfig = require('wix-storybook-config');

module.exports = DecorateMainConfig.decorateMainConfig({
  stories: ['../../src/**/*.visual.tsx'],
});
