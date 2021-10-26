import { createTempDirectory, ITempDirectory } from 'create-temp-directory';
import {
  populateDirectorySync,
  loadDirSync,
  runCliCodeMod,
} from '../../../testkits/stylable-cli-testkit';

describe('CLI Codemods st-import-to-at-import', () => {
  let tempDir: ITempDirectory;
  let rulePath: string;

  beforeAll(() => {
    rulePath = require.resolve('../import-stylesheet-via-index-file');
  });
  beforeEach(async () => {
    tempDir = await createTempDirectory();
  });
  afterEach(async () => {
    await tempDir.remove();
  });

  describe('old import syntax', () => {
    it('an import with `-st-default`', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Button/Button.st.css"; -st-default: Button; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Button; }',
      );
    });

    it('an import with a named `-st-default`', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Button/Button.st.css"; -st-default: CustomName; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Button as CustomName; }',
      );
    });

    it('an import with overrideStyleParam', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Button/Button.st.css"; -st-named: overrideStyleParams; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Button__overrideStyleParams as overrideStyleParams; }',
      );
    });

    it('an import with named overrideStyleParam', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Button/Button.st.css"; -st-named: overrideStyleParams as someName; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Button__overrideStyleParams as someName; }',
      );
    });

    it('an import with multiple classes', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Badge/Badge.st.css"; -st-named: priority-light, priority-primary; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Badge__priority-light as priority-light, Badge__priority-primary as priority-primary; }',
      );
    });

    it('an import with multiple named classes', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Badge/Badge.st.css"; -st-named: priority-light as light, priority-primary as primary, priority-secondary; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Badge__priority-light as light, Badge__priority-primary as primary, Badge__priority-secondary as priority-secondary; }',
      );
    });

    it('a formatters import', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/common/formatters.st"; -st-named: font, color; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/style-processor-formatters"; -st-named: font, color; }',
      );
    });

    it('a formatters import with named classes', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/common/formatters.st"; -st-named: font as fontFormatter, fallback, color as colorFormatter; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/style-processor-formatters"; -st-named: font as fontFormatter, fallback, color as colorFormatter; }',
      );
    });

    it('with multiuple imports', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Badge/Badge.st.css"; -st-named: priority-light as light, priority-primary as primary, priority-secondary; } :import { -st-from: "wix-ui-tpa/dist/src/common/formatters.st"; -st-named: font, color; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Badge__priority-light as light, Badge__priority-primary as primary, Badge__priority-secondary as priority-secondary; } :import { -st-from: "wix-ui-tpa/style-processor-formatters"; -st-named: font, color; }',
      );
    });

    it('imports with non-standard spaces', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Badge/Badge.st.css"; -st-named:    priority-light as light,    priority-primary as primary,     priority-secondary; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Badge__priority-light as light, Badge__priority-primary as primary, Badge__priority-secondary as priority-secondary; }',
      );
    });

    it('named and default', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `:import { -st-from: "wix-ui-tpa/dist/src/components/Button/Button.st.css"; -st-named: overrideStyleParams; -st-default: TPAButton; }`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        ':import { -st-from: "wix-ui-tpa/index.st.css"; -st-named: Button__overrideStyleParams as overrideStyleParams, Button as TPAButton; }',
      );
    });
  });

  describe('new import syntax', () => {
    it('a default import', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import Button from 'wix-ui-tpa/dist/src/components/Button/Button.st.css';`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Button] from "wix-ui-tpa/index.st.css";',
      );
    });

    it('a named default import', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import TPAButton from 'wix-ui-tpa/dist/src/components/Button/Button.st.css';`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Button as TPAButton] from "wix-ui-tpa/index.st.css";',
      );
    });

    it('an import with overrideStyleParam', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import [overrideStyleParams] from 'wix-ui-tpa/dist/src/components/Button/Button.st.css';`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Button__overrideStyleParams as overrideStyleParams] from "wix-ui-tpa/index.st.css";',
      );
    });

    it('an import with named overrideStyleParam', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import [overrideStyleParams as SomeName] from 'wix-ui-tpa/dist/src/components/Button/Button.st.css';`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Button__overrideStyleParams as SomeName] from "wix-ui-tpa/index.st.css";',
      );
    });

    it('an import with multiple classes', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import [priority-light, priority-primary] from 'wix-ui-tpa/dist/src/components/Badge/Badge.st.css';`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Badge__priority-light as priority-light, Badge__priority-primary as priority-primary] from "wix-ui-tpa/index.st.css";',
      );
    });

    it('an import with multiple named classes', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import [priority-light as light, priority-primary as primary, priority-secondary] from 'wix-ui-tpa/dist/src/components/Badge/Badge.st.css';`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Badge__priority-light as light, Badge__priority-primary as primary, Badge__priority-secondary as priority-secondary] from "wix-ui-tpa/index.st.css";',
      );
    });

    it('default and named', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import TPABadge, [priority-light as light, priority-primary as primary, priority-secondary] from 'wix-ui-tpa/dist/src/components/Badge/Badge.st.css';`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Badge as TPABadge, Badge__priority-light as light, Badge__priority-primary as primary, Badge__priority-secondary as priority-secondary] from "wix-ui-tpa/index.st.css";',
      );
    });

    it('named and default', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import [priority-light as light, priority-primary as primary, priority-secondary], TPABadge from 'wix-ui-tpa/dist/src/components/Badge/Badge.st.css';`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Badge as TPABadge, Badge__priority-light as light, Badge__priority-primary as primary, Badge__priority-secondary as priority-secondary] from "wix-ui-tpa/index.st.css";',
      );
    });

    it('a formatters import', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import [font, color] from "wix-ui-tpa/dist/src/common/formatters.st";`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [font, color] from "wix-ui-tpa/style-processor-formatters";',
      );
    });

    it('a formatters import with named classes', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import [font as fontFormatter, fallback, color as colorFormatter] from "wix-ui-tpa/dist/src/common/formatters.st";`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [font as fontFormatter, fallback, color as colorFormatter] from "wix-ui-tpa/style-processor-formatters";',
      );
    });

    it('with multiuple imports', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import [priority-light as light, priority-primary as primary, priority-secondary], TPABadge from "wix-ui-tpa/dist/src/components/Badge/Badge.st.css"; @st-import [font as fontFormatter, fallback, color as colorFormatter] from "wix-ui-tpa/dist/src/common/formatters.st";`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import [Badge as TPABadge, Badge__priority-light as light, Badge__priority-primary as primary, Badge__priority-secondary as priority-secondary] from "wix-ui-tpa/index.st.css"; @st-import [font as fontFormatter, fallback, color as colorFormatter] from "wix-ui-tpa/style-processor-formatters";',
      );
    });

    it('imports with non-standard spaces', () => {
      populateDirectorySync(tempDir.path, {
        'style.st.css': `@st-import   [ priority-light as light,      priority-primary as primary,       priority-secondary ],     TPABadge      from     "wix-ui-tpa/dist/src/components/Badge/Badge.st.css";`,
      });

      runCliCodeMod(['--rootDir', tempDir.path, '-e', rulePath]);

      const dirContent = loadDirSync(tempDir.path);

      expect(dirContent['style.st.css']).toBe(
        '@st-import   [Badge as TPABadge, Badge__priority-light as light, Badge__priority-primary as primary, Badge__priority-secondary as priority-secondary] from "wix-ui-tpa/index.st.css";',
      );
    });
  });
});
