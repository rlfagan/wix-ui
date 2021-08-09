import path from 'path';

import { objectEntries } from '../../object-entries';
import { OptionsRaw, Options } from './typings';
import { WufError, ErrorKind, resolveOrThrow } from '../../errors';
import { renderTemplate } from './template';
import { resolvePlugin } from './plugin';

const pathResolver =
  (cwd: string) =>
  (...a: string[]) => {
    if (path.isAbsolute(a[0])) {
      return a[0];
    } else {
      return path.resolve(cwd, ...a);
    }
  };

const resolveInput = ({ requirePath, cwd }) => {
  try {
    const inputPath = resolveOrThrow(
      () => require.resolve(path.resolve(cwd, requirePath)),
      (error) =>
        new WufError({
          name: 'RequireResolveError',
          kind: ErrorKind.SystemError,
          message: `Unable to find file at ${requirePath}`,
          error,
          info: {
            requirePath,
          },
        }),
    );

    const input = resolveOrThrow(
      () => require(inputPath),
      (error) =>
        new WufError({
          name: `RequireError`,
          kind: ErrorKind.SystemError,
          message: 'Unable to require file provided in `--input`',
          error,
        }),
    );

    return input;
  } catch (error) {
    if (
      error.name === 'RequireResolveError' &&
      error.info.requirePath.endsWith('.wuf/components.json')
    ) {
      // This is a recoverable error:
      // 1. User did not provide `--input`
      // 2. fallback `.wuf/components.json` was not found
      // program should not fail, empty object is valid value
      return {};
    } else {
      throw error;
    }
  }
};

const makeOutput = async (options: Options): Promise<void> => {
  const dataFromPlugins = await resolvePlugin({
    options,
    components: objectEntries(options.components).map(([name, value]) => ({
      name,
      ...value,
    })),
  });

  if (options.template) {
    await renderTemplate({
      templatePath: options.template,
      output: options.output,
      data: dataFromPlugins,
    });
  }
};

const processRawOptions: (a: OptionsRaw) => Promise<void> = async (
  optionsRaw,
) => {
  if (!optionsRaw.output) {
    throw new WufError({
      name: 'OptionsError',
      kind: ErrorKind.UserError,
      message: 'Missing required `output` parameter.',
    });
  }

  const pathResolve = pathResolver(optionsRaw._process.cwd);

  const pluginPaths = (optionsRaw.plugin ?? []).map((p) => {
    const pluginPath = pathResolve(p);
    try {
      return require.resolve(pluginPath);
    } catch (error) {
      const relativePath = path.relative(optionsRaw._process.cwd, pluginPath);
      throw new WufError({
        name: 'PluginError',
        kind: ErrorKind.UserError,
        message: `Plugin not found at "${relativePath}"`,
        error,
      });
    }
  });

  const options = {
    ...optionsRaw,
    plugin: pluginPaths,
    template: optionsRaw.template ? pathResolve(optionsRaw.template) : null,
    output: pathResolve(optionsRaw.output),
    components: resolveInput({
      requirePath: pathResolve(optionsRaw.input || '.wuf/components.json'),
      cwd: optionsRaw._process.cwd,
    }),
  };

  return makeOutput(options);
};

export const make: (a: OptionsRaw) => Promise<void> = processRawOptions;
