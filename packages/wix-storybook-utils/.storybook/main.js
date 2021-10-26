const path = require('path');
const WixStorybookWebpackPlugin = require('../src/WixStorybookWebpackPlugin');

const makeTestkitTemplate = (platform) =>
  `import { <%= utils.toCamel(component.displayName) %>TestkitFactory } from 'wix-style-react/dist${platform}';`;

const testkitsWarning = `
> I am a testkit warning and have a <a href="/?selectedKind=Test&selectedStory=Empty">link</a>.
`;

const options = {
  importFormat: "import { %componentName } from '%moduleName'",
  moduleName: 'wix-storybook-utils',
  testkitsWarning,
  testkits: {
    vanilla: {
      template: makeTestkitTemplate(''),
    },
    enzyme: {
      template: makeTestkitTemplate('/enzyme'),
    },
    puppeteer: {
      template: makeTestkitTemplate('/puppeteer'),
    },
    protractor: {
      template: makeTestkitTemplate('/protractor'),
    },
  },
  issueURL: 'https://github.com/wix/wix-ui/issues/new/choose',
  repoBaseURL:
    'https://github.com/wix/wix-ui/tree/master/packages/wix-storybook-utils/src/components/',
  playgroundComponentsPath: path.resolve(__dirname, 'playground'),
  feedbackText:
    'You can help us improve this component by providing feedback, asking questions or leaving any  other comments via `#wix-style-ux` or `#wix-style-react` Slack channels or GitHub. Found a bug? Please report it to: <a href="https://goo.gl/forms/wrVuHnyBrEISXUPF2" target="_blank">goo.gl/forms/wrVuHnyBrEISXUPF2</a>',
};

// https://github.com/webpack/webpack/pull/8460/commits/a68426e9255edcce7822480b78416837617ab065#diff-4e3db817402e6923cfe42d171bb94b704d7d7b0d52ee64d71540063130594c38R12
const previouslyPolyfilledBuiltinModules = {
  path: require.resolve('path-browserify'),
  fs: require.resolve('browserify-fs'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process/browser'),
};

module.exports = {
  stories: ['../stories/index.js'],
  webpackFinal: (config) => {
    config.module = {
      ...config.module,
      rules: [
        ...(config.module.rules || []),
        {
          test: /\.s[ca]ss$/,
          exclude: /\.global\.s[ca]ss$/,
          use: [
            { loader: require.resolve('style-loader') },
            {
              loader: require.resolve('css-loader'),
              options: { modules: true, import: true },
            },
            { loader: require.resolve('sass-loader') },
          ],
        },
        {
          test: /\.global\.s[ca]ss$/,
          rules: [
            { loader: require.resolve('style-loader') },
            {
              loader: require.resolve('css-loader'),
              options: { modules: false, import: true },
            },
            { loader: require.resolve('sass-loader') },
          ],
        },
      ],
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      'wix-storybook-utils': path.resolve(__dirname, '..', 'src'),
      ...previouslyPolyfilledBuiltinModules,
    };

    config.plugins.push(new WixStorybookWebpackPlugin(options));

    return config;
  },
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { docs: false, controls: false, toolbars: false },
    },
  ],
};
