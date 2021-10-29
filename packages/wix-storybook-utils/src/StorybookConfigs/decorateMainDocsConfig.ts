const decorateMainConfig = require('./decorateMainConfig');
const WixStorybookWebpackPlugin = require('../../src/WixStorybookWebpackPlugin');

type StorybookUtilsPluginConfig = {
  importFormat?: string;
  moduleName: string;
  issueURL: string;
  repoBaseURL: string;
  playgroundComponentsPath: string;
  feedbackText: string;
  importTestkitPath: string;
  testkits: {
    vanilla: {
      template: string;
    };
    enzyme: {
      template: string;
    };
    puppeteer: {
      template: string;
    };
  };
  unifiedTestkit?: true;
};

module.exports = ({
  webpackFinal = config => config,
  addons = [],
  stories,
  storybookUtilsPluginConfig,
}: {
  webpackFinal?(config: any): any;
  addons?: string[];
  stories: string[];
  storybookUtilsPluginConfig: StorybookUtilsPluginConfig;
}) =>
  decorateMainConfig({
    stories,
    addons,
    webpackFinal: config => {
      config.plugins.push(
        new WixStorybookWebpackPlugin({
          importFormat: "import { %componentName } from '%moduleName'",
          ...storybookUtilsPluginConfig,
        }),
      );
      return webpackFinal(config);
    },
  });
