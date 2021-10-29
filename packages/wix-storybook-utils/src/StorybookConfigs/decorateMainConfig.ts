const webpack = require('webpack');
const {
  StylableWebpackPlugin,
  applyWebpackConfigStylableExcludes,
} = require('@stylable/webpack-plugin');

// https://github.com/webpack/webpack/pull/8460/commits/a68426e9255edcce7822480b78416837617ab065#diff-4e3db817402e6923cfe42d171bb94b704d7d7b0d52ee64d71540063130594c38R12
const previouslyPolyfilledBuiltinModules = {
  path: require.resolve('path-browserify'),
  fs: require.resolve('browserify-fs'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process/browser'),
};

module.exports = ({
  webpackFinal = config => config,
  addons = [],
  stories,
}: {
  webpackFinal(config: any): any;
  addons: string[];
  stories: string[];
}) => ({
  core: {
    builder: 'webpack5',
  },
  stories,
  webpackFinal: config => {
    config.plugins.push(new StylableWebpackPlugin({ strict: true }));
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    );

    config.resolve.fallback = {
      ...previouslyPolyfilledBuiltinModules,
    };

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

    applyWebpackConfigStylableExcludes(config);

    return webpackFinal(config);
  },
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { docs: false, controls: false, toolbars: false },
    },
    ...addons,
  ],
});
