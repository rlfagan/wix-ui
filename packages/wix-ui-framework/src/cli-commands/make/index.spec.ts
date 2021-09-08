import cista from 'cista';
import fs from 'fs';
import path from 'path';

import { make } from '.';

const getPath = (dir) => (p) => path.join(__dirname, '__fixtures__', dir, p);
const getInputPath = getPath('inputs');
const getOutputPath = getPath('outputs');
const getPluginPath = getPath('plugins');
const getTemplatePath = getPath('templates');

const runTest = async ({
  files = {},
  input = '.wuf/components.json',
  template = '.wuf/template.ejs',
  output = '.wuf/output',
  plugin = [],
  outputFixturePath,
}) => {
  const fakeFs = cista(files);

  await make({
    input,
    template,
    plugin,
    output,
    _process: {
      cwd: fakeFs.dir,
    },
  });

  const assertion = fs.readFileSync(path.join(fakeFs.dir, output), 'utf8');
  const expectation = fs.readFileSync(outputFixturePath, 'utf8');

  expect(assertion).toEqual(expectation);
};

describe('make', () => {
  afterEach(() => {
    cista().cleanup();
  });

  describe('when `input` is omitted', () => {
    it('should fallback to default `.wuf/components.json`', async () => {
      await runTest({
        outputFixturePath: getOutputPath('simple-output'),
        template: getTemplatePath('template-without-plugins.ejs'),
        input: '',
        files: {
          '.wuf/components.json': `{ "a": {"name": "Hello"}, "b": { "name": "world!" } }`,
        },
      });
    });

    it('should not fail if `.wuf/components.json` does not exist', async () => {
      await runTest({
        outputFixturePath: getOutputPath('output-without-components'),
        template: getTemplatePath('template-without-components.ejs'),
        input: '',
      });
    });

    it('should fail if input path leads to non-requirable file', async () => {
      const fakeFs = cista({
        'corrupted-file.json': 'oh no',
      });

      const runMake = () =>
        make({
          input: './corrupted-file.json',
          output: '.',
          _process: {
            cwd: fakeFs.dir,
          },
        });

      await expect(runMake()).rejects.toThrowError(
        'Unable to require file provided in `--input`',
      );
    });
  });

  describe('when `output` is omitted', () => {
    it('should throw error', async () => {
      const runMake = () =>
        make({
          template: getTemplatePath('template-without-components.ejs'),
          plugin: [
            getPluginPath('add-hardcoded-data.js'),
            getPluginPath('override-hardcoded-data.js'),
          ],
          _process: {
            cwd: '.',
          },
        });

      await expect(runMake()).rejects.toThrowError(
        'Missing required `output` parameter.',
      );
    });
  });

  describe('template', () => {
    it('should not fail if no template given. Should just run plugins', async () => {
      const spy = jest.spyOn(global.console, 'log');
      const fakeFs = cista();

      await make({
        plugin: [getPluginPath('return-nothing.js')],
        output: '.',
        _process: {
          cwd: fakeFs.dir,
        },
      });

      expect(spy).toHaveBeenCalledWith('this plugin is only side effects');
      jest.clearAllMocks();
    });

    it('should fail if given template path is incorrect', async () => {
      const fakeFs = cista();

      const runMake = () =>
        make({
          template: 'i-dont-exist',
          output: '.',
          _process: {
            cwd: fakeFs.dir,
          },
        });

      await expect(runMake()).rejects.toThrowError(
        `TemplateError: file not found at "${path.join(
          fakeFs.dir,
          'i-dont-exist',
        )}"`,
      );
    });
  });

  describe('plugin', () => {
    it('should not fail if no plugin given', async () => {
      await runTest({
        input: '',
        plugin: null,
        template: getTemplatePath('template-without-input-and-plugins.ejs'),
        outputFixturePath: getOutputPath('output-without-input-and-plugins'),
      });
    });

    it('should run plugin and push its return value to template', async () => {
      await runTest({
        input: getInputPath('two-components.json'),
        template: getTemplatePath('capitalized-component-paths.ejs'),
        plugin: [getPluginPath('capitalize-component-path.js')],
        outputFixturePath: getOutputPath('capitalized-components'),
      });
    });

    it('should support multiple plugins an run them in order', async () => {
      await runTest({
        input: getInputPath('two-components.json'),
        output: '.wuf/multiple-plugins.with-some-extension',
        plugin: [
          getPluginPath('override-components.js'),
          getPluginPath('add-hardcoded-data.js'),
          getPluginPath('reverse-hardcoded-data.js'),
        ],
        template: getTemplatePath('multiple-plugins.ejs'),
        outputFixturePath: getOutputPath('multiple-plugins'),
      });
    });

    it('should allow plugins to override data', async () => {
      await runTest({
        input: getInputPath('two-components.json'),
        template: getTemplatePath('plugin-overrides-data.ejs'),
        plugin: [
          getPluginPath('add-hardcoded-data.js'),
          getPluginPath('override-hardcoded-data.js'),
        ],
        outputFixturePath: getOutputPath('plugin-overrides-data'),
      });
    });

    it('should persist chained plugin data even if some plugin returns `undefined`', async () => {
      await runTest({
        input: getInputPath('two-components.json'),
        template: getTemplatePath('plugin-overrides-data.ejs'),
        plugin: [
          getPluginPath('add-hardcoded-data.js'),
          getPluginPath('return-nothing.js'),
          getPluginPath('override-hardcoded-data.js'),
        ],
        outputFixturePath: getOutputPath('plugin-overrides-data'),
      });
    });

    it('should fail if plugin not found', async () => {
      const fakeFs = cista();

      const runMake = () =>
        make({
          template: getTemplatePath('template-without-components.ejs'),
          plugin: [
            getPluginPath('add-hardcoded-data.js'),
            '.wuf/plugins/this-plugin-does-not-exist',
          ],
          output: 'output',
          _process: {
            cwd: fakeFs.dir,
          },
        });

      await expect(runMake()).rejects.toThrowError(
        'Plugin not found at ".wuf/plugins/this-plugin-does-not-exist"',
      );
    });

    it('should fail if plugin is failing', async () => {
      const fakeFs = cista();

      const failingPluginPath = getPluginPath(
        'plugin-that-fails-at-parse-time.js',
      );

      const runMake = () =>
        make({
          template: getTemplatePath('template-without-components.ejs'),
          plugin: [getPluginPath('add-hardcoded-data.js'), failingPluginPath],
          output: 'output',
          _process: {
            cwd: fakeFs.dir,
          },
        });

      await expect(runMake()).rejects.toThrowError(
        `WUF SystemError PluginError: Unable to require plugin at "${failingPluginPath}"`,
      );
    });

    it('should fail if plugin is failing during runtime', async () => {
      const fakeFs = cista();

      const failingPluginPath = getPluginPath(
        'plugin-that-fails-at-run-time.js',
      );
      const runMake = () =>
        make({
          template: getTemplatePath('template-without-components.ejs'),
          plugin: [failingPluginPath],
          output: 'output',
          _process: {
            cwd: fakeFs.dir,
          },
        });

      await expect(runMake()).rejects.toThrowError(
        `WUF UserError PluginError: Plugin is failing at runtime`,
      );
    });

    it('should support returning array of plugins', async () => {
      const fakeFs = cista({
        'template.ejs':
          '<%= dataFromPlugin1 %> <%= cwd %> <%= dataFromPlugin2 %>',
      });

      const outputPath = path.join(fakeFs.dir, 'some', 'folder', 'output-file');

      await make({
        input: getInputPath('two-components.json'),
        plugin: [getPluginPath('chained-plugin.js')],
        output: outputPath,
        _process: {
          cwd: fakeFs.dir,
        },
      });

      const assertion = fs.readFileSync(outputPath, 'utf8').trim();

      expect(assertion).toEqual(`2 ${fakeFs.dir} 42!`);
    });

    it('should merge data in array of plugins and handle missing returns', async () => {
      const fakeFs = cista({
        'template.ejs':
          '<%= dataFromPlugin1 %> <%= cwd %> <%= dataFromPlugin4 %>',
      });

      const outputPath = path.join(fakeFs.dir, 'some', 'folder', 'output-file');

      await make({
        input: getInputPath('two-components.json'),
        plugin: [getPluginPath('chained-plugins-missing-returns.js')],
        output: outputPath,
        _process: {
          cwd: fakeFs.dir,
        },
      });

      const assertion = fs.readFileSync(outputPath, 'utf8').trim();

      expect(assertion).toEqual(`2 ${fakeFs.dir} 42!`);
    });

    it('should be able to be imported from wix-ui-framework library, when given from CLI flag', async () => {
      const fakeFs = cista({
        'node_modules/wix-ui-framework/plugins/plugin-from-wuf.js':
          'module.exports = () => ({ hello: "hello" })',

        'node_modules/wix-ui-framework/plugins/plugin-with-default-export.js': `module.exports = {
            default: () => ({ world: "world" })
          }`,
        'template.ejs': '<%= hello %> <%= world %>',
      });

      const outputPath = path.join(fakeFs.dir, 'output');

      await make({
        plugin: ['plugin-from-wuf', 'plugin-with-default-export'],
        output: outputPath,
        template: 'template.ejs',
        _process: {
          cwd: fakeFs.dir,
        },
      });

      const assertion = fs.readFileSync(outputPath, 'utf8').trim();

      expect(assertion).toEqual(`hello world`);
    });
  });

  describe('plugin API', () => {
    it('should have correct `cwd`', async () => {
      const fakeFs = cista();

      await make({
        template: getTemplatePath('template-with-cwd.ejs'),
        plugin: [getPluginPath('plugin-api-cwd.js')],
        output: '.wuf/output',
        _process: {
          cwd: fakeFs.dir,
        },
      });

      const assertion = fs
        .readFileSync(path.join(fakeFs.dir, '.wuf', 'output'), 'utf8')
        .trim();

      const expectation = `This output was generated in cwd: ${fakeFs.dir}`;

      expect(assertion).toEqual(expectation);
    });

    it('should pass `output`', async () => {
      const fakeFs = cista({
        'template.ejs': `<%= outputPathFromPlugin %>`,
      });

      await make({
        plugin: [getPluginPath('output-path.js')],
        template: 'template.ejs',
        output: 'this/is/output/path',
        _process: {
          cwd: fakeFs.dir,
        },
      });

      const expectedPath = path.join(
        fakeFs.dir,
        'this',
        'is',
        'output',
        'path',
      );
      const assertion = fs.readFileSync(expectedPath, 'utf8').trim();

      expect(assertion).toEqual(expectedPath);
    });

    it('should pass `renderTemplate`', async () => {
      const fakeFs = cista({
        'template/from/nested/folder.ejs': `Hello, <%= greeting %>`,
      });

      await make({
        input: getInputPath('two-components.json'),
        plugin: [getPluginPath('render-template.js')],
        output: 'initially/missing/folder',
        _process: {
          cwd: fakeFs.dir,
        },
      });

      const expectedPath = path.join(
        fakeFs.dir,
        'initially',
        'missing',
        'folder',
      );

      const readFile = (p: string) =>
        fs.readFileSync(path.join(expectedPath, p), 'utf8').trim();

      expect(readFile('ComponentA')).toEqual('Hello, Batman');
      expect(readFile('ComponentB')).toEqual('Hello, Robin');
    });

    it('should support `toCamel`, `toKebab`, `toSnake`, `toPascal` utilities', async () => {
      const fakeFs = cista({
        'plugin.js': `
        module.exports = (data, api) => {
          return {
            toCamelWorks: api.toCamel("yes-sir"),
            toKebabWorks: api.toKebab("yesSir"),
            toSnakeWorks: api.toSnake("yes-sir"),
            toPascalWorks: api.toPascal("yes-sir"),
          }
        }
        `,
        'template.ejs':
          '<%= toCamelWorks %> <%= toKebabWorks %> <%= toSnakeWorks %> <%= toPascalWorks %>',
      });

      await make({
        plugin: ['plugin.js'],
        template: 'template.ejs',
        output: 'output',
        _process: {
          cwd: fakeFs.dir,
        },
      });

      const output = fs.readFileSync(path.join(fakeFs.dir, 'output'), 'utf8');
      const expectedOutput = 'yesSir yes-sir yes_sir YesSir';
      expect(output).toEqual(expectedOutput);
    });

    describe('cleanFolder', () => {
      it('should remove files from given path', async () => {
        const fakeFs = cista({
          'folder/file': '',
          'folder/file-1': '',
          'folder/file-2': '',
          'plugin.js': `module.exports = async (data, { output, cleanFolder }) => { await cleanFolder(output) }`,
        });

        await make({
          plugin: ['plugin.js'],
          output: 'folder',
          _process: {
            cwd: fakeFs.dir,
          },
        });

        const files = fs.readdirSync(path.join(fakeFs.dir, 'folder'));

        expect(files).toEqual([]);
      });

      it('should throw error when given path is outside `cwd`', async () => {
        const fakeFs = cista({
          'keep-this-file': '',
          'plugin.js': `
          const path = require("path");
          module.exports = async (data, { cwd, cleanFolder }) => { await cleanFolder(path.join(cwd, "..")) }
          `,
        });

        const run = () =>
          make({
            plugin: ['plugin.js'],
            output: 'folder',
            _process: {
              cwd: fakeFs.dir,
            },
          });

        await expect(run()).rejects.toThrowError(
          `WUF UserError CleanFolderError: Declining to remove file outside of current working directory. This folder will not be cleaned: "${path.join(
            fakeFs.dir,
            '..',
          )}"`,
        );

        expect(fs.readdirSync(path.join(fakeFs.dir))).toEqual([
          'keep-this-file',
          'plugin.js',
        ]);
      });
    });
  });

  describe('template API', () => {
    it('should support `toCamel`, `toKebab`, `toSnake`, `toPascal` utilities', async () => {
      await runTest({
        input: getInputPath('two-components.json'),
        template: getTemplatePath('template-with-utils.ejs'),
        outputFixturePath: getOutputPath('output-with-utils'),
      });
    });
  });

  describe('plugin `require`', () => {
    it('should require modules from user node_modules', async () => {
      const fakeFs = cista({
        '.wuf/template.ejs': `The ultimate answer to everything (from "<%= modulesPath %>") is: <%= ultimateAnswer %>`,
        '.wuf/plugin.js': `
          const ultimateAnswer = require("ultimate-answer");

          module.exports = (data, { cwd }) => {
            return {
              modulesPath: cwd,
              ultimateAnswer,
            };
          };
        `,
        'node_modules/ultimate-answer/package.json':
          '{ "name": "ultimate-answer", "main": "index.js" }',
        'node_modules/ultimate-answer/index.js':
          'module.exports = "more botox";',
      });

      await make({
        template: './.wuf/template.ejs',
        plugin: ['./.wuf/plugin.js'],
        output: '.wuf/output',
        _process: {
          cwd: fakeFs.dir,
        },
      });

      const assertion = fs
        .readFileSync(path.join(fakeFs.dir, '.wuf', 'output'), 'utf8')
        .trim();

      const expectation = `The ultimate answer to everything (from "${fakeFs.dir}") is: more botox`;

      expect(assertion).toEqual(expectation);
    });
  });
});
