import {
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  mkdirSync,
} from 'fs';
import { spawnSync } from 'child_process';
import { join, relative } from 'path';

export interface Files {
  [filepath: string]: string;
}

export interface FilesStructure {
  [filepath: string]: string | FilesStructure;
}

/**
 * Run the Stylable cli codemode
 *
 * @param cliArgs - The Stybale cli arguments. For more info: https://github.com/wix/stylable/tree/master/packages/cli#usage-stc-codemod
 */
export function runCliCodeMod(cliArgs: string[] = []) {
  const cliPath = require.resolve('@stylable/cli/bin/stc-codemod.js');
  // TODO: add error handling if the CLI command fails to use the codemodes
  return spawnSync('node', [cliPath, ...cliArgs], { encoding: 'utf8' });
}

/**
 * Load the dir content
 *
 * @param rootPath
 * @param dirPath
 */
export function loadDirSync(rootPath: string, dirPath: string = rootPath): Files {
  return readdirSync(dirPath).reduce<Files>((acc, entry) => {
    const fullPath = join(dirPath, entry);
    const key = relative(rootPath, fullPath).replace(/\\/g, '/');
    const stat = statSync(fullPath);
    if (stat.isFile()) {
      acc[key] = readFileSync(fullPath, 'utf8');
    } else if (stat.isDirectory()) {
      return {
        ...acc,
        ...loadDirSync(rootPath, fullPath),
      };
    } else {
      throw new Error('Not Implemented');
    }
    return acc;
  }, {});
}

/**
 * Populate content for a dir
 *
 * @param rootDir - The dir path for the folder with the Stylable test files
 * @param files - The files that should be added for the dir
 */
export function populateDirectorySync(rootDir: string, files: FilesStructure) {
  for (const [filePath, content] of Object.entries(files)) {
    if (typeof content === 'object') {
      const dirPath = join(rootDir, filePath);
      mkdirSync(dirPath);
      populateDirectorySync(dirPath, content);
    } else {
      writeFileSync(join(rootDir, filePath), content);
    }
  }
}
