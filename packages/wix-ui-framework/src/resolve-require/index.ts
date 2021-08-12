import path from 'path';
import { WufError, ErrorKind } from '../errors';

const supportedExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const makeResolvableFiles = (modulePath: string): string[] => {
  const basename = path.basename(modulePath);
  return [
    ...supportedExtensions.map((ext) => `index${ext}`),
    ...supportedExtensions.map((ext) => `${basename}${ext}`),
  ];
};

const requireResolve = async (p: string): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      resolve(require.resolve(p));
    } catch (e) {
      reject(e);
    }
  });

const invert = <T>(promise: Promise<T | T[]>): Promise<T> =>
  new Promise((resolve, reject) => promise.then(reject).catch(resolve));

const first = <T>(promises: Promise<T>[]): Promise<T> =>
  invert(Promise.all(promises.map(invert)));

export const resolveRequire = async (modulePath: string): Promise<string> => {
  if (!modulePath) {
    throw new WufError({
      name: 'ResolveRequire',
      kind: ErrorKind.UserError,
      message: 'missing required path argument',
    });
  }

  try {
    return require.resolve(modulePath);
  } catch (e) {
    return first(
      makeResolvableFiles(modulePath).map((p: string) =>
        requireResolve(path.join(modulePath, p)),
      ),
    );
  }
};
