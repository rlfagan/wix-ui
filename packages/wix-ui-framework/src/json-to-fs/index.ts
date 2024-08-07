import fs from 'fs/promises';
import path from 'path';

type Queue = {
  type: 'files' | 'up' | 'down';
  entry?: Entry;
  name?: string;
}[];

type Entry = [string, string | object];
type Tree = {
  [key: string]: string | object;
};

export const jsonToFs = async ({ tree = {}, cwd }) => {
  if (!cwd) {
    return Promise.reject('jsonToFs expects `cwd` to be passed');
  }

  const makeQueue = (tree: Tree): Queue =>
    Object.entries(tree).map((entry) => ({
      type: 'files',
      entry,
    }));

  let currentPath = cwd;
  const queue: Queue = makeQueue(tree);

  while (queue.length) {
    const current = queue.shift();
    if (current.type === 'files') {
      const [name, content] = current.entry;
      if (typeof content === 'string') {
        await fs.writeFile(path.join(currentPath, name), content, {
          encoding: 'utf8',
        });
      } else {
        queue.unshift({ type: 'down', name }, ...makeQueue(content as Tree), {
          type: 'up',
        });
      }
    }

    if (current.type === 'down') {
      currentPath = path.join(currentPath, current.name);
      try {
        await fs.mkdir(currentPath);
      } catch (e) {
        // TODO: consider a nicer handling for the case when we try to create folder that already exists
      }
    }

    if (current.type === 'up') {
      currentPath = path.dirname(currentPath);
    }
  }
};
