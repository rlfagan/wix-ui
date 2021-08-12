import path from 'path';
import cista from 'cista';

import { WufError, ErrorKind } from '../errors';
import { resolveRequire } from '.';

describe('resolveRequire', () => {
  describe('when called with empty string', () => {
    it('should throw error', () => {
      expect(async () => {
        await resolveRequire('');
      }).rejects.toThrowError(
        new WufError({
          name: 'ResolveRequire',
          kind: ErrorKind.UserError,
          message: 'missing required path argument',
        }),
      );
    });
  });

  it('should return path of existing file', async () => {
    const fakeFs = cista({
      'file.js': '',
    });

    const expectation = path.join(fakeFs.dir, 'file.js');
    expect(await resolveRequire(expectation)).toEqual(expectation);
  });

  const extensions = ['js', 'jsx', 'ts', 'tsx'];

  describe('file with extension', () => {
    const fakeFs = cista({
      'js/index.js': '',
      'jsx/index.jsx': '',
      'ts/index.ts': '',
      'tsx/index.tsx': '',
    });

    extensions.forEach((extension) => {
      it(`should return correct path for ${extension} extension`, async () => {
        const assertion = path.join(fakeFs.dir, extension);
        const expectation = path.join(assertion, `index.${extension}`);
        expect(await resolveRequire(assertion)).toEqual(expectation);
      });
    });
  });

  describe('when file name is same as folder name', () => {
    const expectationsAndAsserts = [
      ['js/special-name/special-name.js', 'js/special-name'],
      ['jsx/special-name/special-name.jsx', 'jsx/special-name'],
      ['ts/special-name/special-name.ts', 'ts/special-name'],
      ['tsx/special-name/special-name.tsx', 'tsx/special-name'],
      ['tsx/specialName/specialName.tsx', 'tsx/specialName'],
      ['tsx/something-else/index.tsx', 'tsx/something-else'],
    ];

    const fakeFs = cista(
      expectationsAndAsserts.reduce((a, [f]) => ({ ...a, [f]: '' }), {}),
    );

    expectationsAndAsserts.forEach(([expectation, assertion]) => {
      it(`should return "${expectation}" when given "${assertion}"`, async () => {
        expect(await resolveRequire(path.join(fakeFs.dir, assertion))).toEqual(
          path.join(fakeFs.dir, expectation),
        );
      });
    });
  });
});
