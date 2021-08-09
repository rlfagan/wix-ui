import { constants } from 'fs';
import fs from 'fs/promises';

import { Path } from './typings.d';

export const fileExists: (a: Path) => Promise<boolean> = (path) =>
  fs
    .access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false);
