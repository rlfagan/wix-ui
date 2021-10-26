const {
  getComponentNameFromImportPath,
  replaceNamedImportWithPrefixNamedImport,
  replaceDefaultWithNamed,
  getMatchedReplacementRule,
} = require('../stylable-imports-utils');

const {
  splitAtImportExportsPartsAndPath,
  replaceAtImportExportsNamesWithPrefixNamedImport,
} = require('../stylable-at-imports-utils');

const STRATEGIES = {
  REPLACE_WITH_COMPONENT_NAME_PREFIX: true,
};

const applyCodemod = (ast, _postCss, replacementsModel) => {
  let isChanged = false;
  let matchedReplacementRule;
  let componentName;

  ast.walkRules((rule) => {
    if (rule.selector === ':import') {
      rule.walkDecls('-st-from', (fromDecl) => {
        let transformedExportNames = [];

        matchedReplacementRule = getMatchedReplacementRule(
          fromDecl.value,
          replacementsModel.rules,
        );

        if (matchedReplacementRule) {
          isChanged = true;

          if (matchedReplacementRule.strategy === STRATEGIES.REPLACE_WITH_COMPONENT_NAME_PREFIX) {
            componentName = getComponentNameFromImportPath(
              fromDecl.value,
              replacementsModel.componentNamePattern,
            );

            rule.walkDecls('-st-named', (namedDecl) => {
              namedDecl.remove();
              transformedExportNames.push(
                replaceNamedImportWithPrefixNamedImport(
                  namedDecl.value,
                  componentName,
                ),
              );
            });

            rule.walkDecls('-st-default', (defaultDecl) => {
              defaultDecl.remove();
              transformedExportNames.push(
                replaceDefaultWithNamed(defaultDecl.value, componentName),
              );
            });

            rule.append(
              _postCss.decl({
                prop: '-st-named',
                value: transformedExportNames.join(', '),
              }),
            );
          }

          fromDecl.value = JSON.stringify(matchedReplacementRule.changeTo);
        }
      });
    }
  });

  // The new import syntax:
  ast.walkAtRules((rule) => {
    if (rule.name === 'st-import') {
      const splittedImport = splitAtImportExportsPartsAndPath(rule.params);

      matchedReplacementRule = getMatchedReplacementRule(
        splittedImport.importPath,
        replacementsModel.rules,
      );

      let finalExportsNames;
      if (matchedReplacementRule) {
        isChanged = true;

        const newImportPath = JSON.stringify(matchedReplacementRule.changeTo);

        if (matchedReplacementRule.strategy === STRATEGIES.REPLACE_WITH_COMPONENT_NAME_PREFIX) {
          componentName = getComponentNameFromImportPath(
            splittedImport.importPath,
            replacementsModel.componentNamePattern,
          );

          finalExportsNames = replaceAtImportExportsNamesWithPrefixNamedImport(
            splittedImport.exportsNames,
            componentName,
          );
        } else {
          finalExportsNames = splittedImport.exportsNames;
        }

        rule.params = `${finalExportsNames} from ${newImportPath}`;
      }
    }
  });

  return isChanged;
};

module.exports.STRATEGIES = STRATEGIES;
module.exports.applyCodemod = applyCodemod;
