import path from 'path';

import { WufError, ErrorKind, resolveOrThrow } from '../../errors';
import { Process, Component, Path } from '../../typings.d';
import { renderTemplate } from './template';
import { Options } from './typings';
import { pathResolver } from './path-resolver';
import { resolveExport } from './resolve-export';

export interface PluginApi {
  cwd: Process['cwd'];
  output: Options['output'];
  renderTemplate: typeof renderTemplate;
}

const chain = async <T>({
  plugins,
  data,
  api,
}: {
  plugins: Function[];
  data: T | Promise<T>;
  api: PluginApi;
}) =>
  plugins.reduce(async (data, fn) => {
    try {
      const previousData = await data;
      const newData = await fn(previousData, api);
      return { ...previousData, ...newData };
    } catch (error) {
      throw new WufError({
        kind: ErrorKind.UserError,
        name: 'PluginError',
        message: 'Plugin is failing at runtime',
        error,
      });
    }
  }, data);

export const executePlugin = async ({ requirePath, data, api }) => {
  const pluginRaw = resolveOrThrow(
    () => require(requirePath),
    (error) =>
      new WufError({
        name: 'PluginError',
        kind: ErrorKind.SystemError,
        message: `Unable to require plugin at "${requirePath}"`,
        error,
      }),
  );

  const plugin = resolveExport(pluginRaw);

  if (typeof plugin === 'function') {
    const pluginOutput = await plugin(data, api);
    return { ...data, ...pluginOutput };
  } else if (Array.isArray(plugin)) {
    return {
      ...data,
      ...(await chain({
        plugins: plugin,
        data,
        api,
      })),
    };
  }
  return plugin;
};

export const resolvePlugin = async ({ options, components }) => {
  const pathResolve = pathResolver(options._process.cwd);

  const pluginPaths = options.plugin.map((rawPluginPath: Path) => {
    const pluginPath = pathResolve(rawPluginPath);

    const relativePath = path.relative(options._process.cwd, pluginPath);

    const errors = [];
    try {
      return require.resolve(pluginPath);
    } catch (e) {
      const error = new WufError({
        name: 'PluginError',
        kind: ErrorKind.UserError,
        message: `Plugin not found at "${relativePath}"`,
        error: e,
      });

      errors.push(error);
    }

    try {
      const internalPluginPath = path.join(
        'wix-ui-framework',
        'plugins',
        rawPluginPath,
      );
      return require.resolve(internalPluginPath, {
        paths: [options._process.cwd],
      });
    } catch (e) {
      const error = new WufError({
        name: 'PluginError',
        kind: ErrorKind.UserError,
        message: `Plugin not found at "${relativePath}"`,
        error: e,
      });

      errors.push(error);
    }

    if (errors.length) {
      throw errors[0];
    }
  });

  const pluginApi: PluginApi = {
    cwd: options._process.cwd,
    output: options.output,
    renderTemplate,
  };

  return await pluginPaths.reduce(
    async (
      promise: Promise<{ components: Partial<Component> }>,
      requirePath: Path,
    ) =>
      executePlugin({
        requirePath,
        data: await promise,
        api: pluginApi,
      }),
    Promise.resolve({ components }),
  );
};
