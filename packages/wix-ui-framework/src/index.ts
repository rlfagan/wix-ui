// the following must be `require`
// `import` is not allowd, because `package.json` is not under `rootDir` defined in `tsconfig.json`
const { version } = require('../package.json');

import { cli } from './cli';

cli({ version });
