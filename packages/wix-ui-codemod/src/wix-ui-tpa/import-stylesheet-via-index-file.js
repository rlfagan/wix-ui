module.exports.codemods = [
  {
    id: 'replace imports',
    apply({ ast, postcss }) {
      // This var will give indication for our users for the changed files
      let isChanged = false;

      ast.walkRules((rule) => {
        if (rule.selector === ':import') {
          let componentName;
          let isForbiddenImport;

          rule.walkDecls('-st-from', (decl) => {
            isForbiddenImport = IMPORT_PATHS_TO_CHANGE[0].regexp.test(
              decl.value,
            );

            if (isForbiddenImport) {
              isChanged = true;
              componentName = getComponentNameFromImportPath(decl.value);
              decl.value = JSON.stringify(IMPORT_PATHS_TO_CHANGE[0].changeTo);
            }
          });

          rule.walkDecls('-st-default', (decl) => {
            if (isForbiddenImport) {
              decl.replaceWith(
                postcss.decl({ prop: '-st-named', value: componentName }),
              );
            }
          });
        }
      });

      return {
        changed: isChanged,
      };
    },
  },
];

const IMPORT_PATHS_TO_CHANGE = [
  {
    regexp: /wix-ui-tpa\/dist\/src\/(.*\/)*(.*)\.st\.css/g,
    changeTo: 'wix-ui-tpa/index.st.css',
  },
  {
    regexp: /wix-ui-tpa\/dist\/src\/common\/formatters.st/g,
    changeTo: 'wix-ui-tpa/style-processor-formatters',
  },
];

const getComponentNameFromImportPath = (importPath) => {
  let componentName;
  const regex = /wix-ui-tpa\/dist\/src\/(.*\/)*(.*)\.st\.css/g;

  if (regex.test(importPath)) {
    componentName = importPath.replace(regex, '$2');
    // Remove the ״״ before returning it
    componentName = componentName.substr(1, componentName.length - 2);
  }

  return componentName;
};
