import program from 'commander';
import { execFileSync } from 'child_process';

const BACKWARDS_COMPATIBLE_SCRIPTS = ['wix-style-react/migrate-wsr10'];

program
  .arguments('<transform> [path]')
  .option('-p, --print', 'print modified files to stdout')
  .option('-d, --dry', 'run in dry mode (will not modify any files on disk)')
  .option(
    '--backwards-compatible-only',
    'change code to new major version API which is backwards compatible with previous major version as well.',
  );

program.parse(process.argv);

if (program.args.length < 2) {
  program.help();
}

let transformPath: string;

const migrationScript = program.args[0];

try {
  transformPath = require.resolve(`./${migrationScript}`);
} catch {
  console.error(`Error: Transform "${migrationScript}" not found.`);
  process.exit(1);
}

const isBackwardsCompatibleOnly = program.opts().backwardsCompatibleOnly;

if (
  !BACKWARDS_COMPATIBLE_SCRIPTS.includes(migrationScript) &&
  isBackwardsCompatibleOnly
) {
  console.error(
    `Error: "${migrationScript}" does not support backwards compatible mode.`,
  );
  process.exit(1);
}

const args: string[] = [];

if (program.dry) {
  args.push('--dry');
}

if (program.print) {
  args.push('--print');
}

if (isBackwardsCompatibleOnly) {
  args.push('--backwardsCompatibleOnly');
}

args.push('--ignore-pattern=**/node_modules/**');
args.push('--parser', 'tsx');
args.push('--extensions', 'tsx,ts,jsx,js');
args.push('--transform', transformPath);
args.push('--verbose', '2');
args.push(program.args[1]);

try {
  execFileSync(require.resolve('.bin/jscodeshift'), args, { stdio: 'inherit' });
} catch {
  process.exit(1);
}
