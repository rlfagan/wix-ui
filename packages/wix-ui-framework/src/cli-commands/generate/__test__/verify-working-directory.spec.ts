import cista from 'cista';

import * as logger from '../../../logger';
import * as utils from '../utils';
import {
  verifyWorkingDirectory,
  errorMessage,
} from '../tasks/verify-working-directory';

let isGitRepoCleanSpy;

const mockGitStatus = (isClean: boolean) => {
  isGitRepoCleanSpy = jest
    .spyOn(utils, 'isGitRepoClean')
    .mockImplementation(() => Promise.resolve(isClean));
};

const noop = () => {
  //
};

describe('verifyWorkingDirectory', () => {
  let errorSpy;
  let exitSpy;

  beforeEach(() => {
    errorSpy = jest.spyOn(logger, 'error').mockImplementation(noop);
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(logger, 'divider').mockImplementation(noop);
  });

  afterEach(() => {
    if (isGitRepoCleanSpy) {
      isGitRepoCleanSpy.mockRestore();
    }

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should not fail when git repo is clean', async () => {
    mockGitStatus(true);

    const fakeFs = cista();
    await verifyWorkingDirectory({ cwd: fakeFs.dir });

    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('should fail when git repo is dirty', async () => {
    mockGitStatus(false);

    const fakeFs = cista();
    await verifyWorkingDirectory({ cwd: fakeFs.dir });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalledWith(errorMessage);
  });
});
