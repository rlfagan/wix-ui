import { WufError, ErrorKind, resolveOrThrow } from '../../errors';
import { Process, Component, Path } from '../../typings.d';
import { renderTemplate } from './template';
import { Options } from './typings';

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
  const plugin = resolveOrThrow(
    () => require(requirePath),
    (error) =>
      new WufError({
        name: 'PluginError',
        kind: ErrorKind.SystemError,
        message: `Unable to require plugin at "${requirePath}"`,
        error,
      }),
  );

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
  const pluginApi: PluginApi = {
    cwd: options._process.cwd,
    output: options.output,
    renderTemplate,
  };

  return await options.plugin.reduce(
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
