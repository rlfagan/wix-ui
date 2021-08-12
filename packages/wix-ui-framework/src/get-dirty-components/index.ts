import path from 'path';
import dependencyTree from 'dependency-tree';

import { Components } from '../typings';
import { resolveRequire } from '../resolve-require';

interface Config {
  rootPath: string;
  components: Components;
  changedFiles: string[];
}

export const getDirtyComponents = async ({
  rootPath,
  components,
  changedFiles: changedFilesRaw,
}: Config): Promise<string[]> => {
  const changedFiles = changedFilesRaw.map((changedFilePath) =>
    path.resolve(changedFilePath),
  );

  const visited = {};
  const getDependencies = async (componentPath: string) => {
    const filename = await resolveRequire(
      path.resolve(rootPath, componentPath),
    );

    return dependencyTree.toList({
      filename,
      directory: path.dirname(filename),
      visited,
      filter: (p) =>
        [
          ['.js', '.jsx', '.ts', '.tsx', '.st.css', '.scss'].some((extension) =>
            p.endsWith(extension),
          ),
          !p.includes('node_modules'),
          p !== path.resolve(rootPath, 'src/index.js'),
        ].every(Boolean),
    });
  };

  const componentsWithDependencyList: Record<string, string[]> =
    await Object.entries(components).reduce(async (accPromise, current) => {
      const acc = await accPromise;
      const [componentName, { path: componentPath }] = current;
      acc[componentName] = await getDependencies(componentPath);
      return acc;
    }, Promise.resolve({}));

  const dirtyComponents = Object.entries(componentsWithDependencyList).reduce(
    (acc, [componentName, dependencies]) => {
      const isDirty = dependencies.some((dependency) => {
        return (
          changedFiles.includes(dependency) ||
          changedFiles.some((changedFile) => {
            return changedFile.includes(
              path.resolve(components[componentName].path),
            );
          })
        );
      });
      if (isDirty) {
        acc.add(componentName);
      }
      return acc;
    },
    new Set<string>(),
  );

  return Array.from(dirtyComponents);
};
