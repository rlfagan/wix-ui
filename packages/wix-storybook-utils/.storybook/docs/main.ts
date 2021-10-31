const path = require('path');
const WixStorybookWebpackPlugin = require('../../src/WixStorybookWebpackPlugin');
const { decorateMainConfig } = require('wix-storybook-config');

const options = {
  moduleName: 'wix-storybook-utils',
  issueURL: 'https://github.com/wix/wix-ui/issues/new/choose',
  repoBaseURL:
    'https://github.com/wix/wix-ui/tree/master/packages/wix-storybook-utils/src/components/',
  feedbackText:
    'You can help us improve this component by providing feedback, asking questions or leaving any  other comments via `#wix-style-ux` or `#wix-style-react` Slack channels or GitHub. Found a bug? Please report it to: <a href="https://goo.gl/forms/wrVuHnyBrEISXUPF2" target="_blank">goo.gl/forms/wrVuHnyBrEISXUPF2</a>',
  importTestkitPath: 'wix-storybook-utils/dist',
  playgroundComponentsPath: path.resolve(__dirname, './playground'),
  testkits: {
    vanilla: {
      template: '',
    },
    enzyme: {
      template: '',
    },
    puppeteer: {
      template: '',
    },
  },
};

module.exports = decorateMainConfig({
  stories: ['../../stories/index.js', '../../src/**/*.story.ts'],
  webpackFinal: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'wix-storybook-utils': path.resolve(__dirname, '..', '..', 'src'),
    };
    config.plugins.push(new WixStorybookWebpackPlugin(options));
    return config;
  },
});
