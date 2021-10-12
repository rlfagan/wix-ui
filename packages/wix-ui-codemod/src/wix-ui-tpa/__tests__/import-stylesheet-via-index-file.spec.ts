import { createTempDirectory, ITempDirectory } from 'create-temp-directory';
import {
  populateDirectorySync,
  loadDirSync,
  runCliCodeMod,
} from '../../../testkits/stylable-cli-testkit';

describe('CLI Codemods st-import-to-at-import', () => {
  let tempDir: ITempDirectory;

  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });
  afterEach(async () => {
    await tempDir.remove();
  });

  it('an import with `-st-default`', () => {
    populateDirectorySync(tempDir.path, {
      'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Button/Button.st.css"; -st-default: Button; }`,
    });

    const rulePath = require.resolve('../import-stylesheet-via-index-file');
    runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

    const dirContent = loadDirSync(tempDir.path);

    expect(dirContent['style.st.css']).toBe(
      ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Button; }',
    );
  });
});
