import fs from 'fs/promises';
import { resolve as pathResolve } from 'path';
import minimatch from 'minimatch';

import { fileExists } from '../file-exists';

interface Config {
  cwd: string;
  path: string;
  withContent?: boolean;
  exclude?: string[];
}

export const fsToJson: (config: Config) => Promise<Object> = async ({
  cwd,
  path,
  withContent = false,
  exclude = [],
}) => {
  const realPath = pathResolve(cwd, path);
  if (!(await fileExists(realPath))) {
    throw new Error(`ERROR: File does not exist at ${realPath}`);
  }

  const recursion = ({ entries, entryCwd }) =>
    entries.reduce(
      (accPromise: Promise<Object>, entry: string) =>
        accPromise.then(async (acc) => {
          const entryPath = pathResolve(entryCwd, entry);

          if (
            exclude.some((glob) =>
              minimatch(entryPath, glob, { matchBase: true }),
            )
          ) {
            return acc;
          }

          const entryStats = await fs.stat(entryPath);

          return entryStats.isDirectory()
            ? {
                ...acc,
                [entry]: await recursion({
                  entries: await fs.readdir(entryPath),
                  entryCwd: entryPath,
                }),
              }
            : {
                ...acc,
                [entry]: withContent
                  ? await fs.readFile(entryPath, 'utf8')
                  : '',
              };
        }),
      Promise.resolve({}),
    );

  return recursion({
    entries: await fs.readdir(pathResolve(cwd, path)),
    entryCwd: cwd,
  });
};
