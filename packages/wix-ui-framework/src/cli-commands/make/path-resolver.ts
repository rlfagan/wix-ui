import path from 'path';

export const pathResolver =
  (cwd: string) =>
  (...a: string[]) => {
    if (path.isAbsolute(a[0])) {
      return a[0];
    } else {
      return path.resolve(cwd, ...a);
    }
  };
