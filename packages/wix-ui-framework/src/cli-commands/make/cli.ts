export const cli = (program) =>
  program
    .command('make')
    .description(
      'combine data from `wuf update`, template and optional plugins to generate any kind of code.',
    )
    .option(
      '--input <string>',
      'Path to `components.json` file created with `wuf update`. Default is `.wuf/components.json`',
    )
    .option(
      '--output <string>',
      'Path of root folder where generated files should be created. Default is `./src`',
    )
    .option(
      '--template <string>',
      'Path to EJS template to be used for generating code. Can be path directly to a single ejs file, or path to a folder containing templates.',
    )
    .option(
      '--plugin <string...>',
      'Name of a built-in plugin or path to one. This flag can be used multiple times to enable multiple plugins. Plugins are executed in the same order they are provided. By default, no plugins are used.',
    );
