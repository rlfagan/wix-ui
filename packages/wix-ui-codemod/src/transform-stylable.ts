import program from 'commander';
import { execFileSync } from 'child_process';

program.arguments('<transform> [path]');

program.parse(process.argv);

let transformPath: string;
try {
  transformPath = require.resolve(`./${program.args[0]}`);
} catch {
  console.error(`Error: Transform "${program.args[0]}" not found.`);
  process.exit(1);
}

const args: string[] = [];
args.push('-e', transformPath);

try {
  execFileSync(require.resolve('.bin/stc-codemod'), args, { stdio: 'inherit' });
} catch {
  process.exit(1);
}
