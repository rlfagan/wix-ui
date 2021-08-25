import path from 'path';
import gatherAll from 'react-autodocs-utils/src/gather-all';
import { resolveRequire } from '../../../resolve-require';

export default async ({ components }, { cwd }) => {
  const componentsWithProps = await components.reduce(
    (promise, component) =>
      promise.then(async (accumulator) => {
        try {
          const componentPath = await resolveRequire(
            path.join(cwd, component.path, component.name),
          );

          return [
            ...accumulator,
            {
              ...component,
              ...(await gatherAll(componentPath)),
            },
          ];
        } catch (e) {
          console.warn(`Unable to parse component ${component.name}`, e);
          return promise;
        }
      }),
    Promise.resolve([]),
  );

  return {
    components: componentsWithProps,
  };
};