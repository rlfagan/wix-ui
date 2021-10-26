const types = require('@babel/types');
const pathLib = require('path');
const visit = require('react-autodocs-utils/src/parser/visit');
const parse = require('react-autodocs-utils/src/parser/parse');
const print = require('react-autodocs-utils/src/parser/print');
const get = require('react-autodocs-utils/src/get');

// pre storybook 6 era storybook configuration
const createTitlePreEra = () => {
  const raw =
    '${storybookUtilsConfig.category}/${storybookUtilsConfig.storyName}';

  return types.templateLiteral([types.templateElement({ raw })], []);
};

const prepareStory = (storyConfig, sourcePath) => (source) =>
  new Promise((resolve, reject) => {
    const isError = !source && !storyConfig && !sourcePath;
    return isError
      ? reject(
          'ERROR: unable to prepare story, both `storyConfig` and `source` must be provided',
        )
      : resolve(source);
  })
    .then(parse)
    .then((ast) => {
      let isES5 = true;

      visit(ast)({
        ExportDefaultDeclaration() {
          isES5 = false;
          return false;
        },
      });

      if (isES5) {
        // add requires
        ast.program.body.unshift(
          parse(
            'const StoryPage = require("wix-storybook-utils/StoryPage").default',
          ),
        );
      } else {
        ast.program.body.unshift(
          parse('import StoryPage from "wix-storybook-utils/StoryPage"'),
        );
      }
      return ast;
    })
    .then((ast) => {
      // TODO: this is not too good, unfortunatelly, i cant return
      // rejected promise from within visitor, babylon complains
      let error = null;

      const enhanceWithMetadata = (declaration) => {
        const configAST = parse(`(${JSON.stringify(storyConfig)})`);
        let configProperties = null;

        visit(configAST)({
          ObjectExpression(path) {
            /**
             *  This below is a feature where user can reference components
             *  that he would like to see in playgrounds loaded.
             * */
            if (storyConfig.playgroundComponentsPath) {
              // resolving relative path for playgroundComponentsPath
              const resolvedPath = pathLib.relative(
                sourcePath,
                storyConfig.playgroundComponentsPath,
              );

              // Creating an expression as require function
              const requireExpression = parse(
                `require('${resolvedPath}').default`,
              ).program.body[0].expression;

              // Creating object property called playgroundComponents
              const playgroundComponentsProperty = types.objectProperty(
                types.identifier('playgroundComponents'),
                requireExpression,
              );

              path.node.properties.push(playgroundComponentsProperty);
            }

            // metadata values saved
            configProperties = path.node.properties;
            path.stop();
          },
        });

        // here we enhance the general story object with metadata
        declaration.properties.push(
          types.objectProperty(
            types.identifier('_config'),
            types.objectExpression(configProperties),
          ),
        );

        return declaration;
      };

      const createStorybookUtilsConfig = (declaration) => {
        return types.variableDeclaration('const', [
          types.variableDeclarator(
            types.identifier('storybookUtilsConfig'),
            enhanceWithMetadata(declaration),
          ),
        ]);
      };

      const createJSXStoryPageFunction = () => {
        const storybookUtilsConfigSpread = types.jSXSpreadAttribute(
          types.identifier('storybookUtilsConfig'),
        );
        const jSXOpeningElement = types.jSXOpeningElement(
          types.jSXIdentifier('StoryPage'),
          [storybookUtilsConfigSpread],
          true,
        );
        return types.arrowFunctionExpression(
          [],
          types.jSXElement(jSXOpeningElement, null, []),
        );
      };

      const createCsfExport = (declaration) => {
        const title = declaration.properties.find(
          ({ key }) => key.name === 'title',
        );

        // Handle storybook 6 and up
        if (title) {
          return types.objectExpression([
            types.objectProperty(types.identifier('title'), title.value),
            types.objectProperty(
              types.identifier('component'),
              createJSXStoryPageFunction(),
            ),
          ]);
        }

        const storyName = declaration.properties.find(
          ({ key }) => key.name === 'storyName',
        );
        const category = declaration.properties.find(
          ({ key }) => key.name === 'category',
        );

        // Handle pre storybook 6 era
        if (storyName && category) {
          return types.objectExpression([
            types.objectProperty(
              types.identifier('title'),
              createTitlePreEra(),
            ),
            types.objectProperty(
              types.identifier('component'),
              createJSXStoryPageFunction(),
            ),
          ]);
        }

        return null;
      };

      let consumerStoryConfig = null;

      visit(ast)({
        ExportDefaultDeclaration(path) {
          consumerStoryConfig = path.node.declaration;
          path.node.declaration = createCsfExport(path.node.declaration);
          return false;
        },
        ExpressionStatement(path) {
          const isModuleExports = [
            types.isMemberExpression(path.node.expression.left),
            get(path)('node.expression.left.object.name') === 'module',
            get(path)('node.expression.left.property.name') === 'exports',
          ].every(Boolean);

          if (isModuleExports) {
            consumerStoryConfig = path.node.declaration;
            path.node.declaration = createCsfExport(path);
          }
        },
      });

      // Finding whats the position of export default
      const exportIndex = ast.program.body.findIndex(
        ({ type }) => type === 'ExportDefaultDeclaration',
      );
      // Save the identifier with all its values
      const exportItentifier = ast.program.body[exportIndex];

      // Override that position with storybook utils config
      ast.program.body[exportIndex] = createStorybookUtilsConfig(
        consumerStoryConfig,
      );

      // Lets put the module export or export default back at the end
      ast.program.body[exportIndex + 1] = exportItentifier;

      return error ? Promise.reject(error) : ast;
    })

    .then(print);

module.exports = prepareStory;
