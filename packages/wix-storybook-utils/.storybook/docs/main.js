const wixStorybookConfig = require('@wix/yoshi/config/webpack.config.storybook');
const { StylableWebpackPlugin } = require('@stylable/webpack-plugin');
const WixStorybookWebpackPlugin = require('../../src/WixStorybookWebpackPlugin');
const path = require('path');

module.exports = {
  stories: ['../../stories/index.js', '../../src/**/*.story.ts'],
  webpackFinal: config => {
    const newConfig = wixStorybookConfig(config);
    newConfig.plugins.pop();
    newConfig.plugins.push(new StylableWebpackPlugin({}));
    newConfig.plugins.push(
      new WixStorybookWebpackPlugin({
        importFormat: "import { %componentName } from '%moduleName'",
        moduleName: 'wix-storybook-utils',
        issueURL: 'https://github.com/wix/wix-ui/issues/new/choose',
        repoBaseURL:
          'https://github.com/wix/wix-ui/tree/master/packages/wix-storybook-utils/src/components/',
        playgroundComponentsPath: path.resolve(__dirname, 'playground'),
        feedbackText:
          'You can help us improve this component by providing feedback, asking questions or leaving any  other comments via `#wix-style-ux` or `#wix-style-react` Slack channels or GitHub. Found a bug? Please report it to: <a href="https://goo.gl/forms/wrVuHnyBrEISXUPF2" target="_blank">goo.gl/forms/wrVuHnyBrEISXUPF2</a>',
      }),
    );

    newConfig.resolve.alias = {
      ...newConfig.resolve.alias,
      'wix-storybook-utils': path.resolve(__dirname, '..', '..', 'src'),
    };
    return newConfig;
  },
};
