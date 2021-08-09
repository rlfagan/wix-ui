import { Command } from 'commander';

import { generate } from './cli-commands/generate';
import { cli as generateCli } from './cli-commands/generate/cli';

import { exportTestkits } from './cli-commands/export-testkits';
import { cli as exportTestkitsCli } from './cli-commands/export-testkits/cli';

import { update } from './cli-commands/update';
import { cli as updateCli } from './cli-commands/update/cli';

import { make } from './cli-commands/make';
import { cli as makeCli } from './cli-commands/make/cli';

const extendOptions = (options) => ({
  ...options,
  _process: {
    cwd: process.cwd(),
  },
});

export const cli = ({ version }) => {
  const program = new Command();

  program.name('wuf').version(version, '-v, --version');

  const run = (action) => (options) => {
    action(extendOptions(options)).catch(console.error);
  };

  generateCli(program).action(run(generate));

  exportTestkitsCli(program).action(run(exportTestkits));

  updateCli(program).action(run(update));

  makeCli(program).action(run(make));

  if (!process.argv.slice(2).length) {
    program.help();
  }

  program.parse(process.argv);
};
