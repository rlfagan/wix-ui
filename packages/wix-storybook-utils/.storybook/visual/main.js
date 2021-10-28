const wixStorybookConfig = require('@wix/yoshi/config/webpack.config.storybook');
const { StylableWebpackPlugin } = require('@stylable/webpack-plugin');

module.exports = {
  stories: ['../../src/**/*.visual.tsx'],
  webpackFinal: (config) => {
    const newConfig = wixStorybookConfig(config);
    newConfig.plugins.pop();
    newConfig.plugins.push(new StylableWebpackPlugin({}));
    return newConfig;
  },
};
